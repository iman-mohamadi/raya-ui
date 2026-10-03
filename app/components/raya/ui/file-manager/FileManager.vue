<script setup lang="ts" generic="TData = unknown">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  toRef,
  useSlots,
  useId,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger, useDirection } from 'reka-ui'
import { useNow, useVModel } from '@vueuse/core'
import { Folder as FolderIcon } from '@lucide/vue'
import { cn } from '@/lib/utils'
import FileManagerCommandPalette from './FileManagerCommandPalette.vue'
import FileManagerConflictDialog from './FileManagerConflictDialog.vue'
import FileManagerContent from './FileManagerContent.vue'
import FileManagerDeleteDialog from './FileManagerDeleteDialog.vue'
import FileManagerMenuItems from './FileManagerMenuItems.vue'
import FileManagerOperations from './FileManagerOperations.vue'
import FileManagerSidebar from './FileManagerSidebar.vue'
import FileManagerStatusBar from './FileManagerStatusBar.vue'
import FileManagerToolbar from './FileManagerToolbar.vue'
import { columnDefinitions as normalizeColumns, resolveColumns } from './columns'
import { provideFileManagerContext, provideSharedDragDrop, type FileManagerContext } from './context'
import { resolveMessages } from './messages'
import type {
  FileManagerAction,
  FileManagerClipboard,
  FileManagerCommand,
  FileManagerColumn,
  FileManagerActionId,
  FileManagerConflict,
  FileManagerConflictResolution,
  FileManagerContextMenuSlotProps,
  FileManagerEmits,
  FileManagerItem,
  FileManagerLocation,
  FileManagerMenuSlotProps,
  FileManagerOperationContext,
  FileManagerOperationFailure,
  FileManagerOperationResult,
  FileManagerProps,
  FileManagerSlots,
  FileManagerSort,
  FileManagerView,
} from './types'
import { useFileManagerActions } from './useFileManagerActions'
import { useFocusRetention } from './useFocusRetention'
import { useTouchDragDrop } from './useTouchDragDrop'
import { useFileManagerCommands, type FileManagerHandlerName } from './useFileManagerCommands'
import { useFileManagerConflicts } from './useFileManagerConflicts'
import { useFileManagerDragDrop } from './useFileManagerDragDrop'
import { useFileManagerKeyboard } from './useFileManagerKeyboard'
import { useFileManagerLoader, type LoadState } from './useFileManagerLoader'
import { useFileManagerNavigation } from './useFileManagerNavigation'
import { useFileManagerOperations, type RunOptions } from './useFileManagerOperations'
import { useFileManagerSelection } from './useFileManagerSelection'
import {
  can,
  childrenOf,
  collectDroppedFiles,
  findNameConflicts,
  focusElement,
  formatBytes,
  indexFileTree,
  isDescendantOf,
  isFolder,
  isUnloadedFolder,
  matchesAccept,
  sortFileItems,
  uniqueName,
  type DroppedFile,
} from './utils'
import { fileManagerMenuContent } from './variants'

type Item = FileManagerItem<TData>

const props = withDefaults(defineProps<FileManagerProps<TData>>(), {
  items: () => [],
  folder: undefined,
  selected: undefined,
  view: undefined,
  search: undefined,
  sort: undefined,
  clipboard: undefined,
  location: undefined,
  listing: undefined,
  locations: () => [],
  operations: undefined,
  columns: undefined,
  favorites: undefined,
  multiple: true,
  sidebar: true,
  rootLabel: 'root',
  label: 'Files',
  confirmDelete: true,
  commandPalette: false,
  resizableColumns: true,
  reorderableColumns: true,
  searchDebounce: 300,
})

const emit = defineEmits<FileManagerEmits<TData>>()

const slots = useSlots()
defineSlots<FileManagerSlots<TData>>()

const messages = computed(() => resolveMessages(props.messages))
const root = useTemplateRef<HTMLElement>('root')
const renameLayerId = `${useId()}-rename`
useFocusRetention(root)

// Direction: the prop, then Reka's ConfigProvider, then what the page says.
const configDir = useDirection(toRef(props, 'dir'))
const pageDir = ref<'ltr' | 'rtl'>('ltr')
const dir = computed<'ltr' | 'rtl'>(() => props.dir ?? (configDir.value === 'rtl' ? 'rtl' : pageDir.value))
const isMac = ref(false)
onMounted(() => {
  if (root.value && getComputedStyle(root.value).direction === 'rtl') pageDir.value = 'rtl'
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
})

// --- Controlled / uncontrolled state ------------------------------------------

const folderModel = useVModel(props, 'folder', emit, { passive: true, defaultValue: props.defaultFolder ?? null })
const selectedModel = useVModel(props, 'selected', emit, { passive: true, defaultValue: props.defaultSelected ?? [] })
const viewModel = useVModel(props, 'view', emit, { passive: true, defaultValue: props.defaultView ?? 'grid' })
const searchModel = useVModel(props, 'search', emit, { passive: true, defaultValue: '' })
const initialSort: FileManagerSort = props.defaultSort ?? { key: 'name', direction: 'asc' }
const sortModel = useVModel(props, 'sort', emit, { passive: true, defaultValue: initialSort })
const locationModel = useVModel(props, 'location', emit, { passive: true, defaultValue: null })

const writable = <T,>(get: () => T, set: (value: T) => void) => computed<T>({ get, set })
const folderId = writable<string | null>(() => folderModel.value ?? null, (value) => { folderModel.value = value })
const selectedIds = writable<string[]>(() => selectedModel.value ?? [], (value) => { selectedModel.value = value })
const view = writable<FileManagerView>(() => viewModel.value ?? 'grid', (value) => { viewModel.value = value })
const search = writable<string>(() => searchModel.value ?? '', (value) => { searchModel.value = value })
const sort = writable<FileManagerSort>(() => sortModel.value ?? initialSort, (value) => { sortModel.value = value })
// Kept by hand: useVModel's typing would unwrap the generic `data` of clipboard items.
const localClipboard = shallowRef<FileManagerClipboard<TData> | null>(props.clipboard ?? null)
watch(() => props.clipboard, (value) => {
  if (value !== undefined) localClipboard.value = value
})
const clipboard = writable<FileManagerClipboard<TData> | null>(
  () => (props.clipboard !== undefined ? props.clipboard : localClipboard.value),
  (value) => {
    localClipboard.value = value
    emit('update:clipboard', value)
  },
)
const locationId = writable<string | null>(() => locationModel.value ?? null, (value) => { locationModel.value = value })

// --- Tree, listing and folder contents -------------------------------------------

/** The tree, plus listing items that live outside it (search results, Recent…). */
const index = computed(() => {
  const tree = indexFileTree(props.items)
  const listed = props.listing?.items
  if (!listed?.length) return tree
  const merged = new Map(tree)
  for (const [id, entry] of indexFileTree(listed)) if (!merged.has(id)) merged.set(id, entry)
  return merged
})
const itemOf = (id: string) => index.value.get(id)?.item
const itemsOf = (ids: readonly string[]) => ids.flatMap((id) => {
  const item = itemOf(id)
  return item ? [item] : []
})

const navigation = useFileManagerNavigation({ folder: folderId, index })
const currentFolder = computed(() => (navigation.current.value === null ? null : itemOf(navigation.current.value) ?? null))
const path = computed(() => itemsOf(navigation.path.value))

const listing = computed(() => props.listing ?? null)
const activeLocation = computed(() => props.locations.flatMap(section => section.locations).find(entry => entry.id === locationId.value) ?? null)
const query = computed(() => search.value.trim())
const listingLabel = computed(() => {
  if (!listing.value) return null
  return listing.value.label ?? activeLocation.value?.label ?? (query.value ? `“${query.value}”` : '')
})

const now = useNow({ interval: 60_000 })
// Columns are a two-way model (resizing and reordering). Kept by hand, like the
// clipboard, so the generic item data in `value`/`format` keeps its type.
const localColumns = shallowRef(props.columns)
// An inline `:columns="['name', 'size']"` is a new array on every render of the
// parent: only a different list replaces the resized or reordered one.
const sameColumns = (a: typeof props.columns, b: typeof props.columns) =>
  a === b || (!!a && !!b && a.length === b.length && a.every((column, i) => column === b[i]))
watch(() => props.columns, (value, previous) => {
  if (!sameColumns(value, previous)) localColumns.value = value
})
const columnDefinitions = computed(() => normalizeColumns(localColumns.value))

function setColumns(next: FileManagerColumn<TData>[]) {
  localColumns.value = next
  emit('update:columns', next)
}

function resizeColumn(key: string, width: string | undefined) {
  setColumns(columnDefinitions.value.map(column => (column.key === key ? { ...column, width } : column)))
}

function moveColumn(key: string, index: number) {
  const next = [...columnDefinitions.value]
  const from = next.findIndex(column => column.key === key)
  const [moved] = from < 0 ? [] : next.splice(from, 1)
  if (!moved) return
  next.splice(Math.max(1, Math.min(index, next.length)), 0, moved)
  setColumns(next)
}
const columns = computed(() => resolveColumns(columnDefinitions.value, messages.value, () => now.value))

const sortColumns = computed(() => columns.value.filter(column => column.sortable).map(column => ({ key: column.key, label: column.label })))

const sourceItems = computed<Item[]>(() => {
  if (listing.value) return listing.value.items
  return currentFolder.value ? currentFolder.value.children ?? [] : props.items
})
const contentItems = computed(() => {
  const needle = props.remoteSearch ? '' : query.value.toLowerCase()
  const filtered = needle ? sourceItems.value.filter(item => item.name.toLowerCase().includes(needle)) : sourceItems.value
  return sortFileItems(filtered, sort.value, columnDefinitions.value)
})
const contentIds = computed(() => contentItems.value.map(item => item.id))

// --- Selection & focus ----------------------------------------------------------

const isSelectable = (id: string) => {
  const item = itemOf(id)
  return item !== undefined && !item.disabled
}

const selection = useFileManagerSelection({
  selected: selectedIds,
  multiple: toRef(props, 'multiple'),
  visibleIds: contentIds,
  isSelectable,
})

// Items that disappeared (deleted, moved away) leave the selection.
watch(index, () => {
  const kept = selectedIds.value.filter(id => index.value.has(id))
  if (kept.length !== selectedIds.value.length) selectedIds.value = kept
})

const selectedSet = computed(() => new Set(selectedIds.value))
const selectedItems = computed(() => itemsOf(selectedIds.value))
const selectedSize = computed(() => {
  const files = selectedItems.value.filter(item => !isFolder(item))
  return files.length ? formatBytes(files.reduce((sum, item) => sum + (item.size ?? 0), 0), messages.value) : ''
})
const favoriteSet = computed(() => new Set(props.favorites ?? []))

const content = useTemplateRef<ComponentPublicInstance>('content')
const contentElement = computed<HTMLElement | null>(() => {
  const el: unknown = content.value?.$el
  return el instanceof HTMLElement ? el : null
})

// The roving tab stop: the last focused item, else the first selected one, else the first.
const lastFocusedId = ref<string | null>(null)
const focusedId = computed<string | null>({
  get: () => {
    const ids = contentIds.value
    if (lastFocusedId.value !== null && ids.includes(lastFocusedId.value)) return lastFocusedId.value
    return ids.find(id => selectedSet.value.has(id)) ?? ids[0] ?? null
  },
  set: (value) => { lastFocusedId.value = value },
})

function findItemElement(id: string) {
  const elements = contentElement.value?.querySelectorAll<HTMLElement>('[role="option"][data-item-id]') ?? []
  return Array.from(elements).find(el => el.dataset.itemId === id)
}

function focusItem(id: string) {
  lastFocusedId.value = id
  nextTick(() => focusElement(findItemElement(id)))
}

/** Focus stays in the content area after an action, on `id` or the tab stop. */
function refocus(id: string | null = focusedId.value) {
  nextTick(() => {
    const target = id === null ? undefined : findItemElement(id)
    focusElement(target ?? contentElement.value)
  })
}

/** Cards per row, measured from the rendered grid. */
function gridColumns(): number {
  const options = Array.from(contentElement.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
  const top = options[0]?.offsetTop
  return Math.max(1, options.filter(option => option.offsetTop === top).length)
}

/**
 * Before items go away (delete, trash, cut-paste), move the tab stop to the
 * nearest item that stays, so focus lands somewhere sensible afterwards.
 */
function focusNeighborOf(ids: readonly string[]) {
  const leaving = new Set(ids)
  const order = contentIds.value
  const last = Math.max(...order.map((id, i) => (leaving.has(id) ? i : -1)))
  const neighbor = order.slice(last + 1).find(id => !leaving.has(id)) ?? [...order.slice(0, last)].reverse().find(id => !leaving.has(id))
  if (!neighbor) return
  const hadFocus = contentElement.value?.contains(document.activeElement) ?? false
  lastFocusedId.value = neighbor
  if (hadFocus) refocus(neighbor)
}

/** Runs `callback` once every id is on screen (a created item arrives through `items`). */
function whenPresent(ids: string[], callback: (ids: string[]) => void) {
  const ready = () => ids.every(id => contentIds.value.includes(id))
  if (ready()) {
    nextTick(() => callback(ids))
    return
  }
  const stop = watch(contentIds, () => {
    if (!ready()) return
    stop()
    clearTimeout(timer)
    nextTick(() => callback(ids))
  })
  const timer = setTimeout(stop, 10_000)
}

function applyResult(result: FileManagerOperationResult<TData> | undefined) {
  if (result?.select?.length) {
    whenPresent(result.select, (ids) => {
      selectedIds.value = ids
      const [first] = ids
      if (first) focusItem(first)
    })
  }
  if (result?.rename) {
    whenPresent([result.rename], ([id]) => {
      if (!id) return
      selectedIds.value = [id]
      focusItem(id)
      actions.startRename(id)
    })
  }
}

// --- Operations & conflicts -------------------------------------------------------

const conflicts = useFileManagerConflicts<TData>({
  takenNames: conflict => childrenOf(index.value, props.items, conflict.target?.id ?? null).map(item => item.name),
})

const operations = useFileManagerOperations<TData>({
  messages: () => messages.value,
  external: () => props.operations,
  resolveConflicts: conflicts.resolve,
  onError: operation => emit('operation-error', operation),
  onExternal: (event, operation) => {
    if (event === 'cancel') emit('cancel-operation', operation)
    else if (event === 'retry') emit('retry-operation', operation)
    else emit('dismiss-operation', operation)
  },
})

const contextFor = (signal: AbortSignal): FileManagerOperationContext<TData> => ({
  signal,
  progress: () => {},
  resolveConflicts: conflicts.resolve,
})

type ItemsRun = Omit<RunOptions<TData>, 'count' | 'itemIds' | 'retryWith'>

/**
 * Runs a handler on `items`. `build` makes the run for any subset, so Retry
 * after a partial failure sends only the items that failed.
 */
function runOnItems(items: Item[], build: (subset: Item[]) => ItemsRun) {
  const make = (subset: Item[]): RunOptions<TData> => ({
    ...build(subset),
    count: subset.length,
    itemIds: subset.map(item => item.id),
    retryWith: (failed: FileManagerOperationFailure<TData>[]) => {
      const ids = new Set(failed.flatMap(failure => (failure.source instanceof File ? [] : [failure.source.id])))
      const retry = subset.filter(item => ids.has(item.id))
      return retry.length ? make(retry) : undefined
    },
  })
  return operations.run(make(items))
}

// --- Permissions --------------------------------------------------------------------

const isReadonly = computed(() => Boolean(props.readonly || props.disabled))

/** Whether items can be added to `folder` (`null` is the root). */
function canWrite(folder: Item | null) {
  if (isReadonly.value) return false
  return folder === null || (can(folder, 'write') && !folder.trashed)
}

const has = (name: FileManagerHandlerName) => Boolean(props[name])

// --- Rename & delete ----------------------------------------------------------------

type ConfirmKind = 'delete' | 'delete-permanently' | 'empty-trash'
const pendingConfirm = shallowRef<{ kind: ConfirmKind, items: Item[] } | null>(null)

function removeItems(kind: 'delete' | 'delete-permanently' | 'trash', items: Item[]) {
  const deletable = items.filter(item => can(item, 'delete'))
  if (!deletable.length) return
  focusNeighborOf(deletable.map(item => item.id))
  void runOnItems(deletable, subset => ({
    type: kind === 'trash' ? 'trash' : 'delete',
    onSuccess: applyResult,
    invoke: (context) => {
      if (kind === 'trash') return props.onTrash?.({ items: subset }, context)
      if (kind === 'delete-permanently') return props.onDeletePermanently?.({ items: subset }, context)
      return props.onDelete?.(subset, context)
    },
  }))
}

// Remembered apart from `pendingConfirm`: the dialog's close can clear that
// before its confirm button's handler runs.
let confirmKind: ConfirmKind = 'delete'

function confirmThen(kind: ConfirmKind, items: Item[]) {
  if (kind === 'empty-trash' || props.confirmDelete) {
    confirmKind = kind
    pendingConfirm.value = { kind, items }
  }
  else if (kind === 'delete' || kind === 'delete-permanently') {
    removeItems(kind, items)
  }
}

function onConfirm(items: Item[]) {
  pendingConfirm.value = null
  if (confirmKind === 'empty-trash') {
    void operations.run({ type: 'delete', count: listing.value?.items.length ?? 0, invoke: context => props.onEmptyTrash?.({ folder: currentFolder.value }, context), onSuccess: applyResult })
  }
  else {
    removeItems(confirmKind, items)
  }
}

const confirmText = computed(() => {
  const pending = pendingConfirm.value
  const m = messages.value
  if (pending?.kind === 'delete-permanently')
    return { title: m.deletePermanentlyTitle(pending.items), description: m.deletePermanentlyDescription(pending.items), confirm: m.deletePermanently }
  if (pending?.kind === 'empty-trash')
    return { title: m.emptyTrashTitle, description: m.emptyTrashDescription, confirm: m.emptyTrash }
  return { title: undefined, description: undefined, confirm: undefined }
})

function renameItem(item: Item, name: string) {
  const onRename = props.onRename
  if (!onRename) return
  void runOnItems([item], () => ({ type: 'rename', silent: true, invoke: context => onRename(item, name, context), onSuccess: applyResult }))
}

const actions = useFileManagerActions({
  index,
  rootItems: () => props.items,
  selected: selectedIds,
  onRename: () => (props.onRename && !isReadonly.value ? renameItem : undefined),
  validateName: () => props.validateName,
  // Confirmation is handled here, for delete, permanent delete and empty trash alike.
  onDelete: () => (props.onDelete && !isReadonly.value ? (items: Item[]) => confirmThen('delete', items) : undefined),
  confirmDelete: () => false,
  disabled: () => props.disabled,
  messages: () => messages.value,
  focus: focusItem,
})

// --- Clipboard ------------------------------------------------------------------------

const cutIds = computed(() => new Set(clipboard.value?.operation === 'cut' ? clipboard.value.items.map(item => item.id) : []))

function toClipboard(operation: 'copy' | 'cut', items: Item[]) {
  clipboard.value = { operation, items }
  if (operation === 'copy') emit('copy', { items })
  else emit('cut', { items })
}

const parentOf = (item: Item) => index.value.get(item.id)?.parentId ?? null

/** Asks about name clashes in `target`. `null` means the user canceled. */
async function resolveClashes(sources: { name: string, source: Item | File }[], target: Item | null, refused: FileManagerConflict<TData>[] = []) {
  const existing = childrenOf(index.value, props.items, target?.id ?? null)
  return conflicts.resolve([...refused, ...findNameConflicts(sources, existing, target)])
}

async function paste(target: Item | null) {
  const current = clipboard.value
  const onPaste = props.onPaste
  if (!current || !onPaste || !canWrite(target)) return
  const operation = current.operation
  const targetId = target?.id ?? null
  // Fresh copies of what is still there. Nothing may land inside itself: those
  // are shown in the conflict dialog (skip only) rather than dropped silently.
  const fresh = current.items.map(item => itemOf(item.id) ?? item)
  const intoItself = fresh.filter(item => target && (target.id === item.id || isDescendantOf(index.value, target.id, item.id)))
  const items = fresh
    .filter(item => !intoItself.includes(item))
    .filter(item => operation === 'copy' || parentOf(item) !== targetId)
  if (!items.length && !intoItself.length) return

  // Copying next to the original keeps both, like a desktop — no need to ask.
  const taken = childrenOf(index.value, props.items, targetId).map(item => item.name)
  const alongside = operation === 'copy' ? items.filter(item => parentOf(item) === targetId) : []
  const automatic: FileManagerConflictResolution<TData>[] = alongside.map((item) => {
    const name = uniqueName(item.name, taken)
    taken.push(name)
    return { conflict: { name: item.name, source: item, destination: item, target, reason: 'exists' }, action: 'keep-both', name }
  })

  const others = items.filter(item => !alongside.includes(item))
  const refused = intoItself.map((item): FileManagerConflict<TData> => ({ name: item.name, source: item, destination: null, target, reason: 'into-itself' }))
  const resolved = await resolveClashes(others.map(item => ({ name: item.name, source: item })), target, refused)
  if (resolved === null) return
  const skipped = new Set(resolved.filter(resolution => resolution.action === 'skip').map(resolution => resolution.conflict.source))
  const pasted = items.filter(item => !skipped.has(item))
  if (!pasted.length) return
  const resolutions = [...automatic, ...resolved.filter(resolution => resolution.action !== 'skip')]

  const options = (subset: Item[]): ItemsRun => ({
    type: operation === 'cut' ? 'move' : 'copy',
    cancelable: true,
    invoke: context => onPaste({ items: subset, target, operation, conflicts: resolutions.filter(resolution => subset.some(item => item === resolution.conflict.source)) }, context),
    onSuccess: (result) => {
      if (operation === 'cut') clipboard.value = null
      applyResult(result)
    },
  })
  if (operation === 'cut') focusNeighborOf(pasted.map(item => item.id))
  void runOnItems(pasted, options)
}

async function move(items: Item[], target: Item | null) {
  const onMove = props.onMove
  const movable = items.filter(item => can(item, 'move'))
  if (!onMove || !movable.length || !canWrite(target)) return
  const resolved = await resolveClashes(movable.map(item => ({ name: item.name, source: item })), target)
  if (resolved === null) return
  const skipped = new Set(resolved.filter(resolution => resolution.action === 'skip').map(resolution => resolution.conflict.source))
  const moved = movable.filter(item => !skipped.has(item))
  if (!moved.length) return
  const resolutions = resolved.filter(resolution => resolution.action !== 'skip')
  const options = (subset: Item[]): ItemsRun => ({
    type: 'move',
    cancelable: true,
    invoke: context => onMove({ items: subset, target, conflicts: resolutions.filter(resolution => subset.some(item => item === resolution.conflict.source)) }, context),
    onSuccess: applyResult,
  })
  void runOnItems(moved, options)
}

// --- Uploads ----------------------------------------------------------------------------

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const folderInput = useTemplateRef<HTMLInputElement>('folderInput')
const externalDrag = ref(false)

/** The folder that receives uploads and new items; `undefined` while a listing is shown. */
const addTarget = computed<Item | null | undefined>(() => (listing.value ? undefined : currentFolder.value))
const uploadable = computed(() => has('onUpload') && addTarget.value !== undefined && canWrite(addTarget.value))

const topName = (entry: DroppedFile) => (entry.path ? entry.path.split('/')[0] ?? entry.file.name : entry.file.name)

async function upload(entries: DroppedFile[], target: Item | null) {
  const onUpload = props.onUpload
  if (!onUpload || !entries.length || !canWrite(target)) return
  const m = messages.value

  const rejected: string[] = []
  const accepted = entries.filter(({ file }) => {
    if (!matchesAccept(file, props.accept)) rejected.push(m.fileNotAccepted(file.name))
    else if (props.maxFileSize !== undefined && file.size > props.maxFileSize) rejected.push(m.fileTooLarge(file.name, formatBytes(props.maxFileSize, m)))
    else return true
    return false
  })
  if (rejected.length) {
    void operations.run({ type: 'upload', count: rejected.length, label: m.filesRejected(rejected.length), retryable: false, invoke: () => { throw new Error(rejected.join(' ')) } })
  }
  if (!accepted.length) return

  // Conflicts are about what lands in the folder: loose files, or the top of a dropped folder.
  const groups = new Map<string, DroppedFile[]>()
  for (const entry of accepted) groups.set(topName(entry), [...(groups.get(topName(entry)) ?? []), entry])
  const resolved = await resolveClashes([...groups].map(([name, [first]]) => ({ name, source: first?.file ?? new File([], name) })), target)
  if (resolved === null) return
  const skippedNames = new Set(resolved.filter(resolution => resolution.action === 'skip').map(resolution => resolution.conflict.name.toLowerCase()))
  const resolutions = resolved.filter(resolution => resolution.action !== 'skip')

  const send = (subset: DroppedFile[]): RunOptions<TData> => ({
    type: 'upload',
    count: subset.length,
    cancelable: true,
    invoke: context => onUpload(subset.map(entry => entry.file), target, {
      ...context,
      relativePaths: subset.map(entry => entry.path),
      conflicts: resolutions.filter(resolution => subset.some(entry => topName(entry).toLowerCase() === resolution.conflict.name.toLowerCase())),
    }),
    onSuccess: applyResult,
    retryWith: (failed) => {
      const files = new Set(failed.flatMap(failure => (failure.source instanceof File ? [failure.source] : [])))
      const retry = subset.filter(entry => files.has(entry.file))
      return retry.length ? send(retry) : undefined
    },
  })
  const files = accepted.filter(entry => !skippedNames.has(topName(entry).toLowerCase()))
  if (files.length) void operations.run(send(files))
}

function pickFiles(directory: boolean) {
  const input = directory ? folderInput.value : fileInput.value
  input?.click()
}

function onFileInput(event: Event) {
  if (!(event.target instanceof HTMLInputElement) || addTarget.value === undefined) return
  const files = Array.from(event.target.files ?? [])
  // Folder picks carry their path in `webkitRelativePath`.
  void upload(files.map(file => ({ file, path: file.webkitRelativePath ?? '' })), addTarget.value)
  event.target.value = ''
}

// --- Loading: lazy children, next pages, remote search -----------------------------------

const childrenLoader = useFileManagerLoader<TData, string>({
  handler: () => {
    const load = props.onLoadChildren
    if (!load) return undefined
    return (id, context) => {
      const folder = itemOf(id)
      return folder ? load(folder, context) : undefined
    }
  },
  context: contextFor,
})

function loadChildren(id: string, force = false) {
  return childrenLoader.load(id, id, force)
}

watch(currentFolder, (folder) => {
  if (folder && props.onLoadChildren && isUnloadedFolder(folder) && !childrenLoader.state(folder.id))
    loadChildren(folder.id).catch(() => {})
}, { immediate: true })

const moreLoader = useFileManagerLoader<TData, { folder: Item | null, cursor: unknown }>({
  handler: () => {
    const load = props.onLoadMore
    return load ? (event, context) => load(event, context) : undefined
  },
  context: contextFor,
})
const moreKey = computed(() => (listing.value ? '#listing' : navigation.current.value ?? '#root'))
const hasMore = computed(() => Boolean(listing.value ? listing.value.hasMore : currentFolder.value?.hasMore) && Boolean(props.onLoadMore))

function loadMore() {
  const cursor = listing.value ? listing.value.cursor : currentFolder.value?.cursor
  moreLoader.load(moreKey.value, { folder: currentFolder.value, cursor }, true).catch(() => {})
}

const searchState = shallowRef<LoadState | undefined>()
let searchController: AbortController | undefined
let searchTimer: ReturnType<typeof setTimeout> | undefined

function runSearch(term: string) {
  const onSearch = props.onSearch
  if (!onSearch) return
  searchController?.abort()
  const controller = new AbortController()
  searchController = controller
  searchState.value = term ? { status: 'loading' } : undefined
  Promise.resolve()
    .then(() => onSearch({ query: term, folder: currentFolder.value }, contextFor(controller.signal)))
    .then(
      () => {
        if (searchController === controller) searchState.value = undefined
      },
      (error: unknown) => {
        if (searchController !== controller || controller.signal.aborted) return
        searchState.value = { status: 'error', error: error instanceof Error ? error.message : String(error) }
      },
    )
}

watch(query, (term) => {
  if (!props.remoteSearch) return
  clearTimeout(searchTimer)
  if (props.searchDebounce > 0 && term) searchTimer = setTimeout(() => runSearch(term), props.searchDebounce)
  else runSearch(term)
})

const contentLoad = computed<{ state: LoadState | undefined, kind: 'folder' | 'search' }>(() => {
  if (searchState.value) return { state: searchState.value, kind: 'search' }
  const folder = currentFolder.value
  return { state: folder && !listing.value ? childrenLoader.state(folder.id) : undefined, kind: 'folder' }
})

function retryContent() {
  if (contentLoad.value.kind === 'search') runSearch(query.value)
  else if (currentFolder.value) loadChildren(currentFolder.value.id, true).catch(() => {})
}

// --- Navigation --------------------------------------------------------------------

/** Where focus was in each folder, restored when coming back to it. */
const lastFocusByFolder = new Map<string | null, string>()
// Going Up selects the folder you came from.
let pendingSelection: string | null = null

function rememberFocus() {
  const id = focusedId.value
  if (id !== null) lastFocusByFolder.set(navigation.current.value, id)
}

watch(navigation.current, (next, previous) => {
  const hadFocus = contentElement.value?.contains(document.activeElement) ?? false
  // Coming back out of a child folder (Up or Back) selects it, like Explorer and Finder.
  const cameFromChild = previous != null && index.value.get(previous)?.parentId === next ? previous : null
  const restore = pendingSelection ?? cameFromChild
  selectedIds.value = restore === null ? [] : [restore]
  lastFocusedId.value = restore ?? lastFocusByFolder.get(next) ?? null
  selection.anchor.value = restore
  pendingSelection = null
  search.value = ''
  locationId.value = null
  actions.renamingId.value = null
  if (hadFocus) refocus()
})

function navigate(id: string | null) {
  rememberFocus()
  if (locationId.value !== null && id === navigation.current.value) {
    // Leaving a listing for the folder that was open underneath.
    locationId.value = null
    return
  }
  navigation.navigate(id)
}

function goUp() {
  if (!navigation.canGoUp.value || listing.value) return
  rememberFocus()
  pendingSelection = navigation.current.value
  navigation.up()
}

function goBack() {
  // Back from a listing returns to the folder underneath.
  if (listing.value || locationId.value !== null) {
    locationId.value = null
    if (props.remoteSearch) search.value = ''
    return
  }
  rememberFocus()
  navigation.back()
}

function goForward() {
  rememberFocus()
  navigation.forward()
}

function openItem(id: string) {
  const item = itemOf(id)
  if (!item || item.disabled || props.disabled || !can(item, 'read')) return
  if (isFolder(item)) navigate(id)
  else emit('open', item)
}

function selectLocation(entry: FileManagerLocation) {
  sidebarOpen.value = false
  if (entry.folder !== undefined) {
    locationId.value = null
    navigate(entry.folder)
    return
  }
  rememberFocus()
  selectedIds.value = []
  lastFocusedId.value = null
  locationId.value = entry.id
}

// Keep the directory tree open down to the current folder.
const treeExpanded = ref<string[]>([])
watch(navigation.path, (ids) => {
  const missing = ids.filter(id => !treeExpanded.value.includes(id))
  if (missing.length) treeExpanded.value = [...treeExpanded.value, ...missing]
}, { immediate: true })

const sidebarOpen = ref(false)
function onSidebarNavigate(id: string) {
  sidebarOpen.value = false
  navigate(id)
}

// --- Command palette (opt-in: `command-palette`) --------------------------------------

const paletteOpen = ref(false)

/** Where a folder sits, for the palette: "root / components". */
function parentPath(id: string) {
  const names: string[] = []
  let parentId = index.value.get(id)?.parentId ?? null
  while (parentId !== null) {
    const entry = index.value.get(parentId)
    if (!entry) break
    names.unshift(entry.item.name)
    parentId = entry.parentId
  }
  return [props.rootLabel, ...names].join(' / ')
}

/** Built only while the palette is open: the selection's actions, then places to go. */
const paletteCommands = computed<FileManagerCommand[]>(() => {
  if (!paletteOpen.value) return []
  const seen = new Set<string>()
  const available = [...commands.resolve(selectedItems.value, 'items'), ...commands.resolve([], 'background')]
    .filter(action => !action.disabled && !seen.has(action.id) && seen.add(action.id))
  const leaveListing = () => { locationId.value = null }
  return [
    ...available.map((action): FileManagerCommand => ({
      id: `action:${action.id}`,
      label: action.label,
      icon: action.icon,
      shortcut: action.shortcut,
      destructive: action.destructive,
      group: 'actions',
      run: action.run,
    })),
    ...props.locations.flatMap(section => section.locations).filter(entry => !entry.disabled).map((entry): FileManagerCommand => ({
      id: `location:${entry.id}`,
      label: entry.label,
      icon: entry.icon,
      group: 'go',
      run: () => selectLocation(entry),
    })),
    { id: 'folder:', label: props.rootLabel, icon: FolderIcon, group: 'go', run: () => { leaveListing(); navigate(null) } },
    ...[...index.value.values()]
      .filter(entry => isFolder(entry.item) && !entry.item.trashed && !entry.item.disabled)
      .map((entry): FileManagerCommand => ({
        id: `folder:${entry.item.id}`,
        label: entry.item.name,
        hint: parentPath(entry.item.id),
        icon: FolderIcon,
        group: 'go',
        run: () => { leaveListing(); navigate(entry.item.id) },
      })),
  ]
})

function onRootKeydown(event: KeyboardEvent) {
  if (!props.commandPalette || props.disabled || event.altKey || event.shiftKey) return
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return
  event.preventDefault()
  event.stopPropagation()
  paletteOpen.value = true
}

function runPaletteCommand(command: FileManagerCommand) {
  actions.afterMenuCloses(() => {
    // Back in the list first: actions and navigation carry focus on from there.
    focusElement(findItemElement(focusedId.value ?? '') ?? contentElement.value)
    command.run()
  })
}

function onPaletteCloseAutoFocus(event: Event) {
  // A chosen command runs now that focus is back; otherwise Reka restores it.
  actions.onMenuCloseAutoFocus(event)
}

// --- Commands: toolbar, menus, shortcuts, status bar ---------------------------------------

const refreshing = ref(false)
const contextMenuOpen = ref(false)
const toolbarMenuOpen = ref(false)

function runSilently(type: RunOptions<TData>['type'], items: Item[], invoke: (subset: Item[], context: FileManagerOperationContext<TData>) => unknown) {
  return runOnItems(items, subset => ({ type, silent: true, invoke: context => invoke(subset, context), onSuccess: applyResult }))
}

const commands = useFileManagerCommands<TData>({
  messages: () => messages.value,
  has,
  readonly: () => isReadonly.value,
  isMac: () => isMac.value,
  currentFolder: () => addTarget.value,
  canWrite,
  hasClipboard: () => Boolean(clipboard.value?.items.length),
  isFavorite: id => favoriteSet.value.has(id),
  inTrash: () => Boolean(listing.value?.trash),
  directoryUpload: () => Boolean(props.directoryUpload),
  // An open menu traps focus until it has closed; dialogs and inputs wait for that.
  schedule: run => () => (contextMenuOpen.value || toolbarMenuOpen.value ? actions.afterMenuCloses(run) : run()),
  perform: {
    open: item => openItem(item.id),
    preview: item => void runSilently('other', [item], (_, context) => props.onPreview?.({ item }, context)),
    download: items => void runOnItems(items, subset => ({ type: 'download', cancelable: true, invoke: context => props.onDownload?.({ items: subset }, context), onSuccess: applyResult })),
    createFolder: parent => void operations.run({ type: 'create', count: 1, silent: true, invoke: context => props.onCreateFolder?.(parent, context), onSuccess: applyResult }),
    createFile: parent => void operations.run({ type: 'create', count: 1, silent: true, invoke: context => props.onCreateFile?.(parent, context), onSuccess: applyResult }),
    upload: pickFiles,
    cut: items => toClipboard('cut', items),
    copy: items => toClipboard('copy', items),
    paste: target => void paste(target),
    duplicate: items => void runOnItems(items, subset => ({ type: 'duplicate', invoke: context => props.onDuplicate?.({ items: subset }, context), onSuccess: applyResult })),
    rename: item => actions.startRename(item.id),
    trash: items => removeItems('trash', items),
    delete: items => confirmThen('delete', items),
    restore: (items) => {
      focusNeighborOf(items.map(item => item.id))
      void runOnItems(items, subset => ({ type: 'restore', invoke: context => props.onRestore?.({ items: subset }, context), onSuccess: applyResult }))
    },
    deletePermanently: items => confirmThen('delete-permanently', items),
    emptyTrash: () => confirmThen('empty-trash', listing.value?.items ?? []),
    share: items => void runSilently('share', items, (subset, context) => props.onShare?.({ items: subset }, context)),
    copyLink: items => void runSilently('share', items, (subset, context) => props.onCopyLink?.({ items: subset }, context)),
    favorite: items => void runSilently('other', items, (subset, context) => props.onFavorite?.({ items: subset }, context)),
    unfavorite: items => void runSilently('other', items, (subset, context) => props.onUnfavorite?.({ items: subset }, context)),
    properties: items => void runSilently('other', items, (subset, context) => props.onProperties?.({ items: subset }, context)),
    refresh: () => {
      if (refreshing.value) return
      refreshing.value = true
      const folder = currentFolder.value
      if (folder) childrenLoader.reset(folder.id)
      void operations.run({ type: 'refresh', count: 0, silent: true, invoke: context => props.onRefresh?.({ folder }, context) })
        .finally(() => { refreshing.value = false })
    },
  },
})

const folderActions = computed(() => commands.resolve([], 'background'))
const selectionActions = computed(() => commands.resolve(selectedItems.value, 'items'))
const toolbarActions = computed(() => commands.toolbar(selectedItems.value))

// --- Pointer & keyboard ---------------------------------------------------------

function onItemClick(id: string, event: MouseEvent) {
  if (props.disabled || !isSelectable(id)) return
  // On touch, tapping the selected item opens it; the first tap selects.
  const touch = typeof PointerEvent !== 'undefined' && event instanceof PointerEvent && event.pointerType === 'touch'
  if (touch && selectedIds.value.length === 1 && selectedSet.value.has(id)) {
    openItem(id)
    return
  }
  lastFocusedId.value = id
  if (props.multiple && event.shiftKey) selection.extend(id)
  else if (props.multiple && (event.metaKey || event.ctrlKey)) selection.toggle(id)
  else selection.replace(id)
}

function onItemToggle(id: string) {
  if (props.disabled || !isSelectable(id)) return
  lastFocusedId.value = id
  selection.toggle(id)
}

function onContentClick(event: MouseEvent) {
  // A click on empty space clears the selection, as on a desktop.
  if (event.target instanceof Element && !event.target.closest('[role="option"], button')) selection.clear()
}

const keyboard = useFileManagerKeyboard({
  ids: contentIds,
  focusedId,
  view,
  dir,
  multiple: toRef(props, 'multiple'),
  isSelectable,
  nameOf: id => itemOf(id)?.name ?? '',
  columns: gridColumns,
  focus: focusItem,
  replace: selection.replace,
  toggle: selection.toggle,
  extend: selection.extend,
  selectAll: selection.selectAll,
  clear: selection.clear,
  open: openItem,
  back: goBack,
  forward: goForward,
  up: goUp,
})

function onContentKeydown(event: KeyboardEvent) {
  if (props.disabled || props.loading) return
  // Buttons (the drop tile, sort headers) and the rename input handle their own keys.
  if (event.target instanceof Element && event.target.closest('button, input')) return
  const mod = event.ctrlKey || event.metaKey
  const key = event.key.toLowerCase()
  if (mod && key === 'z' && !event.shiftKey) {
    event.preventDefault()
    operations.undo()
    return
  }
  if (mod && (key === 'y' || (key === 'z' && event.shiftKey))) {
    event.preventDefault()
    operations.redo()
    return
  }
  if (commands.handleKeydown(event, selectedItems.value)) return
  keyboard.onKeydown(event)
}

/**
 * Clipboard and history shortcuts in the sidebar tree act on the focused
 * folder, as in a desktop file manager's navigation pane: Ctrl+C/X take it, Ctrl+V
 * pastes into it. The tree handles everything else (arrows, F2, Delete).
 */
const TREE_SHORTCUTS: Record<string, FileManagerActionId> = { c: 'copy', x: 'cut', v: 'paste' }

function onSidebarKeydown(event: KeyboardEvent) {
  if (props.disabled || !(event.ctrlKey || event.metaKey) || event.altKey) return
  if (!(event.target instanceof Element) || event.target.closest('input') || !event.target.closest('[role="tree"]')) return
  const key = event.key.toLowerCase()
  if (key === 'z' || key === 'y') {
    event.preventDefault()
    if (key === 'y' || event.shiftKey) operations.redo()
    else operations.undo()
    return
  }
  const id = TREE_SHORTCUTS[key]
  const folderId = event.target.closest('[data-item-id]')?.getAttribute('data-item-id')
  const folderItem = folderId ? itemOf(folderId) : undefined
  if (!id || event.shiftKey || !folderItem) return
  const action = commands.resolve([folderItem], 'items').find(candidate => candidate.id === id)
  if (!action || action.disabled) return
  event.preventDefault()
  event.stopPropagation()
  action.run()
}

// --- Drag and drop -----------------------------------------------------------------

const dragDropEnabled = computed(() => Boolean(props.draggable) && !isReadonly.value)
const dragDrop = useFileManagerDragDrop({
  enabled: dragDropEnabled,
  index,
  selected: selectedIds,
  isExpanded: id => treeExpanded.value.includes(id),
  expand: (id) => {
    if (!treeExpanded.value.includes(id)) treeExpanded.value = [...treeExpanded.value, id]
  },
  onMove: event => void move(event.items, event.target),
  canDrag: (id) => {
    const item = itemOf(id)
    return item !== undefined && can(item, 'move') && !item.trashed
  },
  canDropInto: targetId => canWrite(targetId === null ? null : itemOf(targetId) ?? null),
  countLabel: count => messages.value.items(count),
})
provideSharedDragDrop(dragDrop)
useTouchDragDrop(root, {
  enabled: dragDropEnabled,
  countLabel: count => messages.value.items(count),
  count: () => dragDrop.draggingIds.value.length,
})

function canDropOnLocation(entry: FileManagerLocation) {
  if (!entry.trash || !has('onTrash')) return false
  const dragging = itemsOf(dragDrop.draggingIds.value)
  return dragging.length > 0 && dragging.every(item => can(item, 'delete'))
}

function onDropOnLocation(entry: FileManagerLocation, event: DragEvent) {
  event.preventDefault()
  if (canDropOnLocation(entry)) removeItems('trash', itemsOf(dragDrop.draggingIds.value))
  dragDrop.onDragEnd()
}

const isExternalDrag = (event: DragEvent) =>
  !dragDrop.draggingIds.value.length && Boolean(event.dataTransfer?.types.includes('Files'))

function onContentDragOver(event: DragEvent) {
  if (isExternalDrag(event)) {
    if (!uploadable.value) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    externalDrag.value = true
    return
  }
  // Empty space targets the open folder, where the items already are: refused,
  // which also clears any folder highlight left behind.
  dragDrop.onDragOver(navigation.current.value, event)
}

function onContentDragLeave(event: DragEvent) {
  const next = event.relatedTarget
  if (!(next instanceof Node && event.currentTarget instanceof Node && event.currentTarget.contains(next)))
    externalDrag.value = false
  dragDrop.onDragLeave(event)
}

function onContentDrop(event: DragEvent) {
  if (externalDrag.value) {
    event.preventDefault()
    externalDrag.value = false
    const target = addTarget.value
    if (event.dataTransfer && target !== undefined) {
      const transfer = event.dataTransfer
      void collectDroppedFiles(transfer, Boolean(props.directoryUpload)).then(files => upload(files, target))
    }
    return
  }
  dragDrop.onDrop(event)
}

// --- Context menu -------------------------------------------------------------------

const hasCustomMenu = computed(() => Boolean(slots['context-menu']))
const contextItemId = ref<string | null>(null)
const contextItem = computed<Item | null>(() => (contextItemId.value === null ? null : itemOf(contextItemId.value) ?? null))

const contextActions = computed(() => commands.menu(contextItem.value ? actions.targetsOf(contextItem.value) : []))
const menuSlotProps = computed<FileManagerMenuSlotProps<TData>>(() => ({ ...actions.menuScope(contextItem.value), actions: contextActions.value }))

function onItemContextMenu(id: string) {
  contextItemId.value = id
  lastFocusedId.value = id
  if (!selectedSet.value.has(id) && isSelectable(id)) selection.replace(id)
}

function onContentContextMenuCapture(event: MouseEvent) {
  contextItemId.value = null
  // Empty space with nothing to offer gets the browser's own menu.
  const onItem = event.target instanceof Element && event.target.closest('[role="option"]')
  if (!onItem && !folderActions.value.length && !hasCustomMenu.value) event.stopImmediatePropagation()
}

function onContentMenuCloseAutoFocus(event: Event) {
  if (actions.onMenuCloseAutoFocus(event)) return
  // Return focus to the item that was right-clicked, not the list container.
  event.preventDefault()
  refocus(contextItemId.value ?? focusedId.value)
}

function onToolbarMenuCloseAutoFocus(event: Event) {
  actions.onMenuCloseAutoFocus(event)
}

/** The tree's own menu: the file manager's actions, but rename and delete act in the tree. */
function treeMenuActions(scope: FileManagerContextMenuSlotProps<TData>): FileManagerAction[] {
  const items = scope.item ? actions.targetsOf(scope.item) : []
  return commands.menu(items).map((action) => {
    if (action.id === 'rename') return { ...action, run: scope.rename }
    // Everything else also waits for the tree's menu to close.
    return { ...action, run: () => scope.defer(action.run) }
  })
}

const treeBackgroundMenu = computed(() => hasCustomMenu.value || folderActions.value.length > 0)

provideFileManagerContext({
  selected: selectedSet,
  cutIds,
  favorites: favoriteSet,
  itemOperation: id => operations.byItem.value.get(id),
  focusedId,
  now,
  multiple: toRef(props, 'multiple'),
  draggable: dragDropEnabled,
  dragDrop,
  draggingIds: computed(() => new Set(dragDrop.draggingIds.value)),
  slots: slots as FileManagerContext['slots'],
  messages,
  onItemClick,
  onItemToggle,
  onItemOpen: openItem,
  onItemContextMenu,
  renamingId: actions.renamingId,
  renameLayer: `#${renameLayerId}`,
  validateRename: actions.validateRename,
  commitRename: actions.commitRename,
  cancelRename: actions.cancelRename,
})

defineExpose({
  /** Starts renaming an item inline, if `onRename` is provided. */
  rename: (id: string) => actions.startRename(id),
  /** Deletes items by id, through the confirmation dialog when enabled. */
  remove: (ids: string[]) => confirmThen('delete', itemsOf(ids)),
  copy: (ids: string[]) => toClipboard('copy', itemsOf(ids)),
  cut: (ids: string[]) => toClipboard('cut', itemsOf(ids)),
  /** Pastes into `folderId` (default: the open folder). */
  paste: (folderId?: string | null) => void paste(folderId === undefined ? currentFolder.value : folderId === null ? null : itemOf(folderId) ?? null),
  refresh: () => commands.resolve([], 'background').find(action => action.id === 'refresh')?.run(),
  undo: () => operations.undo(),
  redo: () => operations.redo(),
  /** Moves focus into the file manager: the item holding the tab stop, else the list. */
  focus: () => focusElement(findItemElement(focusedId.value ?? '') ?? contentElement.value),
  /** Opens the command palette (needs `command-palette`). */
  openCommandPalette: () => { if (props.commandPalette) paletteOpen.value = true },
  /** Opens the conflict dialog for conflicts your server reported. */
  resolveConflicts: conflicts.resolve,
  /** Available actions for items (by id), or for the open folder when empty — e.g. for a command palette. */
  getActions: (ids: string[] = []) => (ids.length ? commands.resolve(itemsOf(ids), 'items') : commands.resolve([], 'background')),
  /** Every operation currently shown. */
  operations: operations.operations,
})

const allOperations = operations.operations

// The directory tree gets the file manager's rename and delete, so they are tracked
// as operations and confirmed the same way.
const treeRename = computed(() => (props.onRename && !isReadonly.value ? renameItem : undefined))
const treeDelete = computed(() => {
  if (isReadonly.value || !(props.onDelete || props.onTrash)) return undefined
  return (items: Item[]) => (props.onTrash ? removeItems('trash', items) : confirmThen('delete', items))
})
const treeLoad = computed(() => (props.onLoadChildren ? (folder: Item) => loadChildren(folder.id) : undefined))

function onDeleteDialogCloseAutoFocus(event: Event) {
  event.preventDefault()
  refocus()
}
</script>

<template>
  <div
    ref="root"
    data-slot="file-manager"
    @keydown="onRootKeydown"
    :dir="props.dir"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :class="cn(
      '@container relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-sm text-card-foreground',
      disabled && 'pointer-events-none opacity-60',
      props.class,
    )"
  >
    <FileManagerToolbar
      v-model:search="search"
      v-model:view="view"
      v-model:sort="sort"
      :path="path"
      :root-label="rootLabel"
      :listing-label="listingLabel"
      :item-count="contentItems.length"
      :can-go-back="navigation.canGoBack.value || listing !== null || locationId !== null"
      :can-go-forward="navigation.canGoForward.value"
      :can-go-up="navigation.canGoUp.value && listing === null"
      :disabled="disabled"
      :dir="dir"
      :folder-actions="folderActions"
      :selection-actions="toolbarActions"
      :sort-columns="sortColumns"
      :refreshing="refreshing"
      :search-placeholder="remoteSearch ? messages.searchPlaceholder : messages.filterPlaceholder"
      :show-sidebar-toggle="sidebar"
      @back="goBack"
      @forward="goForward"
      @up="goUp"
      @navigate="navigate"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @menu-open="toolbarMenuOpen = $event"
      @menu-close-auto-focus="onToolbarMenuCloseAutoFocus"
    >
      <template v-if="$slots['toolbar-actions']" #actions>
        <slot name="toolbar-actions" />
      </template>
    </FileManagerToolbar>

    <div class="relative flex min-h-0 flex-1">
      <FileManagerSidebar
        v-if="sidebar"
        @keydown="onSidebarKeydown"
        v-model:expanded="treeExpanded"
        :items="items"
        :folder="navigation.current.value"
        :location="locationId"
        :locations="locations"
        :item-count="contentItems.length"
        :selected-size="selectedSize"
        :draggable="dragDropEnabled"
        :disabled="disabled"
        :dir="dir"
        :open="sidebarOpen"
        :get-icon="getIcon"
        :on-rename="treeRename"
        :validate-name="validateName"
        :on-delete="treeDelete"
        :on-load-children="treeLoad"
        :background-menu="treeBackgroundMenu"
        :can-drop-on-location="canDropOnLocation"
        @navigate="onSidebarNavigate"
        @select-location="selectLocation"
        @drop-on-location="onDropOnLocation"
        @close="sidebarOpen = false"
      >
        <template #context-menu="scope">
          <slot v-if="hasCustomMenu" name="context-menu" v-bind="{ ...scope, actions: treeMenuActions(scope) }" />
          <FileManagerMenuItems v-else :actions="treeMenuActions(scope)" kind="context" />
        </template>
      </FileManagerSidebar>

      <div class="flex min-w-0 flex-1 flex-col">
        <div class="relative flex min-h-0 flex-1 flex-col">
          <ContextMenuRoot :dir="dir" :modal="false" @update:open="contextMenuOpen = $event">
            <ContextMenuTrigger as-child :disabled="loading || disabled">
              <FileManagerContent
                ref="content"
                tabindex="-1"
                :items="contentItems"
                :view="view"
                :sort="sort"
                :columns="columns"
                :query="remoteSearch ? '' : query"
                :loading="loading"
                :load-state="contentLoad.state"
                :load-state-kind="contentLoad.kind"
                :multiple="multiple"
                :uploadable="uploadable"
                :empty-kind="listing ? (listing.trash ? 'trash' : 'listing') : 'folder'"
                :external-drag="externalDrag"
                :folder-name="currentFolder?.name ?? rootLabel"
                :label="label"
                :has-more="hasMore"
                :resizable-columns="resizableColumns"
                :reorderable-columns="reorderableColumns"
                :dir="dir"
                :more-state="moreLoader.state(moreKey)"
                :get-icon="getIcon"
                class="outline-none"
                @update:sort="sort = $event"
                @resize-column="resizeColumn"
                @move-column="moveColumn"
                @pick="pickFiles(false)"
                @load-more="loadMore"
                @retry="retryContent"
                @click="onContentClick"
                @keydown="onContentKeydown"
                @contextmenu.capture="onContentContextMenuCapture"
                @dragover="onContentDragOver"
                @dragleave="onContentDragLeave"
                @drop="onContentDrop"
              >
              </FileManagerContent>
            </ContextMenuTrigger>

            <ContextMenuPortal>
              <ContextMenuContent
                data-slot="file-manager-context-menu"
                :class="cn(fileManagerMenuContent, 'origin-(--reka-context-menu-content-transform-origin)')"
                @close-auto-focus="onContentMenuCloseAutoFocus"
              >
                <slot v-if="hasCustomMenu" name="context-menu" v-bind="menuSlotProps" />
                <FileManagerMenuItems v-else :actions="contextActions" kind="context" />
              </ContextMenuContent>
            </ContextMenuPortal>
          </ContextMenuRoot>

          <FileManagerOperations
            :operations="allOperations"
            :messages="messages"
            @cancel="operations.cancel"
            @retry="operations.retry"
            @undo="operations.undo"
            @dismiss="operations.dismiss"
          />
        </div>

        <FileManagerStatusBar :selected-items="selectedItems" :item-count="contentItems.length" :actions="selectionActions">
          <template v-if="$slots['status-actions']" #actions="scope">
            <slot name="status-actions" v-bind="scope" />
          </template>
        </FileManagerStatusBar>
      </div>
    </div>

    <FileManagerDeleteDialog
      :items="pendingConfirm?.items ?? null"
      :title="confirmText.title"
      :description="confirmText.description"
      :confirm-label="confirmText.confirm"
      :messages="messages"
      @confirm="onConfirm"
      @close="pendingConfirm = null"
      @close-auto-focus="onDeleteDialogCloseAutoFocus"
    >
      <template v-if="$slots['delete-description'] && pendingConfirm?.kind !== 'empty-trash'" #description="scope">
        <slot name="delete-description" v-bind="scope" />
      </template>
    </FileManagerDeleteDialog>

    <FileManagerConflictDialog
      :conflict="conflicts.current.value"
      :remaining="conflicts.remaining.value"
      :root-label="rootLabel"
      :messages="messages"
      @choose="conflicts.choose"
      @cancel="conflicts.cancel"
    />

    <input
      v-if="has('onUpload')"
      ref="fileInput"
      type="file"
      multiple
      :accept="accept"
      class="sr-only"
      tabindex="-1"
      aria-hidden="true"
      @change="onFileInput"
    >
    <input
      v-if="has('onUpload') && directoryUpload"
      ref="folderInput"
      type="file"
      multiple
      webkitdirectory
      class="sr-only"
      tabindex="-1"
      aria-hidden="true"
      @change="onFileInput"
    >
    <FileManagerCommandPalette
      v-if="commandPalette"
      v-model:open="paletteOpen"
      :commands="paletteCommands"
      :messages="messages"
      :dir="dir"
      @run="runPaletteCommand"
      @close-auto-focus="onPaletteCloseAutoFocus"
    />

    <!-- Rename inputs are drawn here, over their item (see FileManagerRenameInput). -->
    <div :id="renameLayerId" class="pointer-events-none absolute inset-0 z-30 overflow-hidden" />
  </div>
</template>

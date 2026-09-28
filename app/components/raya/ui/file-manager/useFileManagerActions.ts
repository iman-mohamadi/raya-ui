import { computed, ref, shallowRef, type Ref } from 'vue'
import type { FileManagerMessages } from './messages'
import type { FileManagerContextMenuSlotProps, FileManagerItem, FileManagerNameValidator } from './types'
import { can, validateItemName, type FileManagerIndex } from './utils'

interface UseFileManagerActionsOptions<TData> {
  index: Readonly<Ref<FileManagerIndex<TData>>>
  rootItems: () => FileManagerItem<TData>[]
  selected: Readonly<Ref<string[]>>
  onRename: () => ((item: FileManagerItem<TData>, name: string) => unknown) | undefined
  validateName: () => FileManagerNameValidator<TData> | undefined
  onDelete: () => ((items: FileManagerItem<TData>[]) => unknown) | undefined
  confirmDelete: () => boolean
  disabled: () => boolean
  messages: () => FileManagerMessages
  /** Returns focus to an item once an action is over. */
  focus: (id: string) => void
}

/**
 * Inline rename and confirmed delete, shared by `FileTree` and `FileManager`.
 *
 * Actions picked from a menu are queued and run when the menu has finished
 * closing: the menu traps focus until then, which would otherwise steal it
 * straight back from the rename input or a dialog.
 */
export function useFileManagerActions<TData>(options: UseFileManagerActionsOptions<TData>) {
  const { index, selected } = options

  const renamingId = ref<string | null>(null)
  const pendingDelete = shallowRef<FileManagerItem<TData>[] | null>(null)
  let queued: (() => void) | null = null

  const canRename = computed(() => Boolean(options.onRename()) && !options.disabled())
  const canDelete = computed(() => Boolean(options.onDelete()) && !options.disabled())

  const itemOf = (id: string) => index.value.get(id)?.item

  function isRenamable(item: FileManagerItem<TData>) {
    return canRename.value && can(item, 'rename') && !item.trashed
  }

  function startRename(id: string | null) {
    if (id === null) return
    const item = itemOf(id)
    if (item && isRenamable(item)) renamingId.value = id
  }

  function validateRename(id: string, name: string): string | undefined {
    const item = itemOf(id)
    if (!item) return undefined
    return validateItemName(index.value, options.rootItems(), item, name, options.messages())
      ?? options.validateName()?.(name.trim(), item)
  }

  function commitRename(id: string, name: string) {
    const item = itemOf(id)
    renamingId.value = null
    if (item) options.onRename()?.(item, name)
    options.focus(id)
  }

  function cancelRename(id: string) {
    renamingId.value = null
    options.focus(id)
  }

  function requestDelete(items: FileManagerItem<TData>[]) {
    const deletable = items.filter(item => can(item, 'delete'))
    const onDelete = options.onDelete()
    if (!deletable.length || !onDelete || options.disabled()) return
    if (options.confirmDelete()) pendingDelete.value = deletable
    else onDelete(deletable)
  }

  function confirmDelete(items: FileManagerItem<TData>[]) {
    pendingDelete.value = null
    options.onDelete()?.(items)
  }

  /** Items an action on `item` applies to: the whole selection when `item` is part of it. */
  function targetsOf(item: FileManagerItem<TData>): FileManagerItem<TData>[] {
    if (!selected.value.includes(item.id)) return [item]
    return selected.value.flatMap((id) => {
      const selectedItem = itemOf(id)
      return selectedItem ? [selectedItem] : []
    })
  }

  /** Runs `action` once the open menu has closed. */
  function afterMenuCloses(action: () => void) {
    queued = action
  }

  /** Scope for the `#context-menu` slot. */
  function menuScope(item: FileManagerItem<TData> | null): FileManagerContextMenuSlotProps<TData> {
    return {
      item,
      rename: () => {
        if (item) afterMenuCloses(() => startRename(item.id))
      },
      remove: () => {
        if (item) afterMenuCloses(() => requestDelete(targetsOf(item)))
      },
      defer: afterMenuCloses,
    }
  }

  /**
   * Bind to a menu's `close-auto-focus`. Runs the queued action instead of
   * returning focus; returns whether it did.
   */
  function onMenuCloseAutoFocus(event: Event): boolean {
    if (!queued) return false
    event.preventDefault()
    const action = queued
    queued = null
    action()
    return true
  }

  return {
    renamingId,
    pendingDelete,
    canRename,
    canDelete,
    isRenamable,
    startRename,
    validateRename,
    commitRename,
    cancelRename,
    requestDelete,
    confirmDelete,
    closeDelete: () => { pendingDelete.value = null },
    targetsOf,
    afterMenuCloses,
    menuScope,
    onMenuCloseAutoFocus,
  }
}

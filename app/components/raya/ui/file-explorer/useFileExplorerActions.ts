import { computed, ref, shallowRef, type Ref } from 'vue'
import type { FileExplorerContextMenuSlotProps, FileExplorerItem, FileExplorerNameValidator } from './types'
import { validateItemName, type FileExplorerIndex } from './utils'

interface UseFileExplorerActionsOptions<TData> {
  index: Readonly<Ref<FileExplorerIndex<TData>>>
  rootItems: () => FileExplorerItem<TData>[]
  selected: Readonly<Ref<string[]>>
  onRename: () => ((item: FileExplorerItem<TData>, name: string) => void) | undefined
  validateName: () => FileExplorerNameValidator<TData> | undefined
  onDelete: () => ((items: FileExplorerItem<TData>[]) => void) | undefined
  confirmDelete: () => boolean
  disabled: () => boolean
  /** Returns focus to an item once an action is over. */
  focus: (id: string) => void
}

/**
 * Inline rename and confirmed delete, shared by `FileTree` and `FileExplorer`.
 *
 * Actions picked from the context menu are queued and run when the menu has
 * finished closing: the menu traps focus until then, which would otherwise
 * steal it straight back from the rename input or the dialog.
 */
export function useFileExplorerActions<TData>(options: UseFileExplorerActionsOptions<TData>) {
  const { index, selected } = options

  const renamingId = ref<string | null>(null)
  const pendingDelete = shallowRef<FileExplorerItem<TData>[] | null>(null)
  let queued: (() => void) | null = null

  const canRename = computed(() => Boolean(options.onRename()) && !options.disabled())
  const canDelete = computed(() => Boolean(options.onDelete()) && !options.disabled())

  const itemOf = (id: string) => index.value.get(id)?.item

  function startRename(id: string | null) {
    if (id === null || !canRename.value) return
    const item = itemOf(id)
    if (item && !item.disabled) renamingId.value = id
  }

  function validateRename(id: string, name: string): string | undefined {
    const item = itemOf(id)
    if (!item) return undefined
    return validateItemName(index.value, options.rootItems(), item, name) ?? options.validateName()?.(name.trim(), item)
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

  function requestDelete(items: FileExplorerItem<TData>[]) {
    const deletable = items.filter(item => !item.disabled)
    const onDelete = options.onDelete()
    if (!deletable.length || !onDelete || options.disabled()) return
    if (options.confirmDelete()) pendingDelete.value = deletable
    else onDelete(deletable)
  }

  function confirmDelete(items: FileExplorerItem<TData>[]) {
    pendingDelete.value = null
    options.onDelete()?.(items)
  }

  /** Items an action on `item` applies to: the whole selection when `item` is part of it. */
  function targetsOf(item: FileExplorerItem<TData>): FileExplorerItem<TData>[] {
    if (!selected.value.includes(item.id)) return [item]
    return selected.value.flatMap((id) => {
      const selectedItem = itemOf(id)
      return selectedItem ? [selectedItem] : []
    })
  }

  /** Scope for the `#context-menu` slot. */
  function menuScope(item: FileExplorerItem<TData> | null): FileExplorerContextMenuSlotProps<TData> {
    return {
      item,
      rename: () => {
        if (item) queued = () => startRename(item.id)
      },
      remove: () => {
        if (item) queued = () => requestDelete(targetsOf(item))
      },
    }
  }

  /** Bind to the menu content's `close-auto-focus`. */
  function onMenuCloseAutoFocus(event: Event) {
    if (!queued) return
    event.preventDefault()
    const action = queued
    queued = null
    action()
  }

  return {
    renamingId,
    pendingDelete,
    canRename,
    canDelete,
    startRename,
    validateRename,
    commitRename,
    cancelRename,
    requestDelete,
    confirmDelete,
    closeDelete: () => { pendingDelete.value = null },
    targetsOf,
    menuScope,
    onMenuCloseAutoFocus,
  }
}

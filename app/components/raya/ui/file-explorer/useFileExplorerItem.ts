import { computed } from 'vue'
import { injectFileExplorerContext } from './context'
import type { FileExplorerItem } from './types'
import { isFolder } from './utils'

/**
 * Attributes and listeners shared by a grid card and a details row: both are
 * `role="option"` in the explorer's listbox, hold a roving tab stop, and act as
 * drag sources (and, for folders, drop targets).
 */
export function useFileExplorerItem<TData>(item: () => FileExplorerItem<TData>) {
  const ctx = injectFileExplorerContext()

  const id = computed(() => item().id)
  const selected = computed(() => ctx.selected.value.has(id.value))
  const disabled = computed(() => Boolean(item().disabled))
  const dropTarget = computed(() => ctx.dragDrop.dropTargetId.value === id.value)
  const renaming = computed(() => ctx.renamingId.value === id.value)

  const attrs = computed(() => ({
    'role': 'option',
    'aria-selected': selected.value,
    'aria-disabled': disabled.value || undefined,
    'tabindex': ctx.focusedId.value === id.value ? 0 : -1,
    'data-item-id': id.value,
    'data-selected': selected.value ? '' : undefined,
    'data-disabled': disabled.value ? '' : undefined,
    'data-dragging': ctx.dragDrop.draggingIds.value.includes(id.value) ? '' : undefined,
    'data-drop-target': dropTarget.value ? '' : undefined,
    // Paused while renaming, so selecting text in the input does not start a drag.
    'draggable': ctx.draggable.value && !disabled.value && !renaming.value ? true : undefined,
    'onClick': (event: MouseEvent) => ctx.onItemClick(id.value, event),
    'onDblclick': () => ctx.onItemOpen(id.value),
    'onContextmenu': () => ctx.onItemContextMenu(id.value),
    'onDragstart': (event: DragEvent) => ctx.dragDrop.onDragStart(id.value, event),
    'onDragover': (event: DragEvent) => {
      // Files forward drops to their folder, which is the open one: a no-op the
      // drag session refuses. Folders accept the drop themselves.
      if (!isFolder(item())) return
      ctx.dragDrop.onDragOver(id.value, event)
      event.stopPropagation()
    },
    'onDrop': (event: DragEvent) => {
      if (!isFolder(item())) return
      event.stopPropagation()
      ctx.dragDrop.onDrop(event)
    },
    'onDragend': () => ctx.dragDrop.onDragEnd(),
  }))

  const rename = {
    validate: (name: string) => ctx.validateRename(id.value, name),
    commit: (name: string) => ctx.commitRename(id.value, name),
    cancel: () => ctx.cancelRename(id.value),
  }

  return { selected, disabled, renaming, rename, attrs, now: ctx.now }
}

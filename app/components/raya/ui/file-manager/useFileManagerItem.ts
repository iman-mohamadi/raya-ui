import { computed, useId } from 'vue'
import { injectFileManagerContext } from './context'
import type { FileManagerItem } from './types'
import { formatBytes, formatRelativeTime, getFileExtension, getFileKind, isFolder } from './utils'

/**
 * A grid card and a details row are each split in two components, for speed in
 * large folders: a root that owns the option element (selection, focus, drag
 * state) and a body with the content. Focus and selection changes then patch a
 * few attributes on the roots instead of rendering every item again, and the
 * bodies only render when their own item changes.
 *
 * Every piece of state below is its own computed of a primitive: Vue only
 * propagates a computed whose value changed, so moving focus from one item to
 * the next touches those two items, not the whole folder.
 */

/** The option element: `role="option"`, roving tab stop, drag source and (for folders) drop target. */
export function useFileManagerItemRoot<TData>(item: () => FileManagerItem<TData>) {
  const ctx = injectFileManagerContext()

  const id = computed(() => item().id)
  const folder = computed(() => isFolder(item()))
  const disabled = computed(() => Boolean(item().disabled))
  const selected = computed(() => ctx.selected.value.has(id.value))
  const focused = computed(() => ctx.focusedId.value === id.value)
  const cut = computed(() => ctx.cutIds.value.has(id.value))
  const dragging = computed(() => ctx.draggingIds.value.has(id.value))
  const dropTarget = computed(() => ctx.dragDrop.dropTargetId.value === id.value)
  const dropInvalid = computed(() => ctx.dragDrop.invalidTargetId.value === id.value)
  const renaming = computed(() => ctx.renamingId.value === id.value)
  const status = computed(() => ctx.itemOperation(id.value)?.status)
  // Paused while renaming, so selecting text in the input does not start a drag.
  const draggable = computed(() => ctx.draggable.value && !disabled.value && !renaming.value)

  // Options are named by the item's name alone and described by a short summary
  // (see the body), so a screen reader does not read a card's preview as its name.
  const nameId = useId()
  const descriptionId = useId()

  // Created once: listeners that change identity would be re-bound on each patch.
  const listeners = {
    onClick: (event: MouseEvent) => ctx.onItemClick(id.value, event),
    onDblclick: () => ctx.onItemOpen(id.value),
    onContextmenu: () => ctx.onItemContextMenu(id.value),
    onDragstart: (event: DragEvent) => ctx.dragDrop.onDragStart(id.value, event),
    onDragover: (event: DragEvent) => {
      // Files forward drops to their folder, which is the open one: a no-op the
      // drag session refuses. Folders accept the drop themselves.
      if (!folder.value) return
      ctx.dragDrop.onDragOver(id.value, event)
      event.stopPropagation()
    },
    onDrop: (event: DragEvent) => {
      if (!folder.value) return
      event.stopPropagation()
      ctx.dragDrop.onDrop(event)
    },
    onDragend: () => ctx.dragDrop.onDragEnd(),
  }

  const attrs = computed(() => ({
    'role': 'option',
    'aria-selected': selected.value,
    'aria-disabled': disabled.value || undefined,
    'aria-busy': status.value === 'running' || status.value === 'pending' || undefined,
    'aria-labelledby': nameId,
    'aria-describedby': descriptionId,
    'tabindex': focused.value ? 0 : -1,
    'data-item-id': id.value,
    'data-selected': selected.value ? '' : undefined,
    'data-disabled': disabled.value ? '' : undefined,
    'data-cut': cut.value ? '' : undefined,
    'data-dragging': dragging.value ? '' : undefined,
    'data-drop-target': dropTarget.value ? '' : undefined,
    'data-drop-invalid': dropInvalid.value ? '' : undefined,
    'data-operation': status.value,
    'draggable': draggable.value ? true : undefined,
    ...listeners,
  }))

  return { attrs, nameId, descriptionId }
}

/** What a card or row shows. Nothing here depends on selection or focus. */
export function useFileManagerItemContent<TData>(item: () => FileManagerItem<TData>) {
  const ctx = injectFileManagerContext()

  const id = computed(() => item().id)
  const renaming = computed(() => ctx.renamingId.value === id.value)
  const favorite = computed(() => ctx.favorites.value.has(id.value))
  const operation = computed(() => ctx.itemOperation(id.value))
  const busy = computed(() => operation.value?.status === 'running' || operation.value?.status === 'pending')

  // Strings, so the minute clock re-renders an item only when its label changes
  // ("10m ago" → "11m ago"), not every item every minute.
  const modified = computed(() => formatRelativeTime(item().modifiedAt, ctx.now.value, ctx.messages.value))
  const description = computed(() => {
    const current = item()
    const m = ctx.messages.value
    const kind = getFileKind(current)
    const summary = isFolder(current)
      ? [m.folder, current.children ? m.items(current.children.length) : '']
      : [m.fileKind(kind.category, getFileExtension(current), kind.label), formatBytes(current.size, m)]
    return [
      ...summary,
      modified.value,
      favorite.value ? m.starred : '',
      current.permissions?.write === false ? m.readOnly : '',
      operation.value ? [operation.value.label, operation.value.error].filter(Boolean).join(': ') : '',
    ].filter(Boolean).join(m.listSeparator)
  })

  const rename = {
    validate: (name: string) => ctx.validateRename(id.value, name),
    commit: (name: string) => ctx.commitRename(id.value, name),
    cancel: () => ctx.cancelRename(id.value),
  }

  return {
    renaming,
    favorite,
    operation,
    busy,
    modified,
    description,
    rename,
    renameLayer: ctx.renameLayer,
    slots: ctx.slots,
    now: ctx.now,
    messages: ctx.messages,
    multiple: ctx.multiple,
    toggle: () => ctx.onItemToggle(id.value),
  }
}

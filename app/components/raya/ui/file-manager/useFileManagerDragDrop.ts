import { onBeforeUnmount, ref, shallowRef, type Ref } from 'vue'
import type { FileManagerMoveEvent } from './types'
import { isDescendantOf, isFolder, type FileManagerIndex } from './utils'

const AUTO_EXPAND_DELAY = 600

interface UseFileManagerDragDropOptions<TData> {
  enabled: Readonly<Ref<boolean>>
  index: Readonly<Ref<FileManagerIndex<TData>>>
  selected: Readonly<Ref<string[]>>
  isExpanded: (id: string) => boolean
  expand: (id: string) => void
  onMove: (event: FileManagerMoveEvent<TData>) => void
  /** Whether an item may be dragged at all (permissions, trash…). Disabled items never can. */
  canDrag?: (id: string) => boolean
  /** Extra checks on a destination (e.g. write permission). `null` is the root. */
  canDropInto?: (targetId: string | null, ids: readonly string[]) => boolean
  /** Text of the drag image when several items are dragged, e.g. "3 items". */
  countLabel?: (count: number) => string
}

/**
 * Native HTML5 drag and drop. The component only reports the intent through
 * `onMove`; moving the data is up to the consumer.
 *
 * Dragging a selected item drags the whole selection, with a count as the drag
 * image. Dropping on a file drops into that file's folder. Drops into the item
 * itself, into one of its own descendants, back into the folder it already
 * lives in, or into a folder `canDropInto` refuses are rejected, and a folder
 * that refuses the drop is marked while hovered.
 */
export function useFileManagerDragDrop<TData>(options: UseFileManagerDragDropOptions<TData>) {
  const { enabled, index, selected, isExpanded, expand, onMove } = options

  const draggingIds = shallowRef<readonly string[]>([])
  const dropTargetId = ref<string | null | undefined>(undefined)
  /** A hovered folder that refuses the drop. */
  const invalidTargetId = ref<string | null | undefined>(undefined)

  let expandTimer: ReturnType<typeof setTimeout> | undefined
  let expandCandidate: string | null = null

  function clearAutoExpand() {
    clearTimeout(expandTimer)
    expandTimer = undefined
    expandCandidate = null
  }

  function scheduleAutoExpand(folderId: string | null) {
    if (folderId === expandCandidate) return
    clearAutoExpand()
    if (folderId === null || isExpanded(folderId)) return
    expandCandidate = folderId
    expandTimer = setTimeout(() => expand(folderId), AUTO_EXPAND_DELAY)
  }

  function reset() {
    clearAutoExpand()
    draggingIds.value = []
    dropTargetId.value = undefined
    invalidTargetId.value = undefined
  }

  function setCountImage(event: DragEvent, count: number) {
    if (!event.dataTransfer || typeof event.dataTransfer.setDragImage !== 'function' || !options.countLabel) return
    const badge = document.createElement('div')
    badge.textContent = options.countLabel(count)
    badge.className = 'fixed -top-96 start-0 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-md'
    document.body.append(badge)
    event.dataTransfer.setDragImage(badge, -12, -12)
    // The browser snapshots the element synchronously; it can go right away.
    setTimeout(() => badge.remove())
  }

  function onDragStart(id: string, event: DragEvent) {
    if (!enabled.value) return
    const allowed = (candidate: string) => {
      const entry = index.value.get(candidate)
      return Boolean(entry) && !entry?.item.disabled && (options.canDrag?.(candidate) ?? true)
    }
    const source = selected.value.includes(id) ? selected.value : [id]
    const ids = source.filter(candidate =>
      // Moving a folder already moves its contents.
      allowed(candidate) && !source.some(other => other !== candidate && isDescendantOf(index.value, candidate, other)))
    if (!ids.length || !ids.includes(id)) {
      event.preventDefault()
      return
    }

    draggingIds.value = ids
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      // Some browsers refuse to start a drag without data.
      event.dataTransfer.setData('text/plain', ids.map(itemId => index.value.get(itemId)?.item.name ?? itemId).join('\n'))
    }
    if (ids.length > 1) setCountImage(event, ids.length)
  }

  /** A folder receives the drop itself; a file forwards it to its parent. */
  function resolveTarget(id: string | null): string | null {
    if (id === null) return null
    const entry = index.value.get(id)
    if (!entry) return null
    return isFolder(entry.item) ? id : entry.parentId
  }

  function canDropInto(targetId: string | null): boolean {
    const ids = draggingIds.value
    if (!ids.length) return false
    if (targetId !== null && index.value.get(targetId)?.item.disabled) return false

    const intoItself = ids.some(id => id === targetId || (targetId !== null && isDescendantOf(index.value, targetId, id)))
    const alreadyThere = ids.every(id => index.value.get(id)?.parentId === targetId)
    return !intoItself && !alreadyThere && (options.canDropInto?.(targetId, ids) ?? true)
  }

  function onDragOver(id: string | null, event: DragEvent) {
    if (!draggingIds.value.length) return
    const targetId = resolveTarget(id)
    if (!canDropInto(targetId)) {
      dropTargetId.value = undefined
      // Only a folder hovered directly is marked; files and empty space stay neutral.
      const alreadyThere = draggingIds.value.every(dragged => index.value.get(dragged)?.parentId === targetId)
      invalidTargetId.value = id !== null && id === targetId && !alreadyThere ? targetId : undefined
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'none'
      clearAutoExpand()
      return
    }

    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    dropTargetId.value = targetId
    invalidTargetId.value = undefined
    // Only hovering the folder row itself opens it, not hovering its files.
    scheduleAutoExpand(id !== null && id === targetId ? id : null)
  }

  function onDrop(event: DragEvent) {
    const targetId = dropTargetId.value
    if (targetId !== undefined && draggingIds.value.length) {
      event.preventDefault()
      const items = draggingIds.value.flatMap((id) => {
        const item = index.value.get(id)?.item
        return item ? [item] : []
      })
      const target = targetId === null ? null : index.value.get(targetId)?.item ?? null
      onMove({ items, target })
    }
    reset()
  }

  onBeforeUnmount(clearAutoExpand)

  return {
    draggingIds,
    dropTargetId,
    invalidTargetId,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd: reset,
    /** Clears the highlight when the pointer leaves the file manager altogether. */
    onDragLeave(event: DragEvent) {
      const next = event.relatedTarget
      const container = event.currentTarget
      if (container instanceof Node && next instanceof Node && container.contains(next)) return
      dropTargetId.value = undefined
      invalidTargetId.value = undefined
      clearAutoExpand()
    },
  }
}

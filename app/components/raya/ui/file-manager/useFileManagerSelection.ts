import { ref, type Ref } from 'vue'

interface UseFileManagerSelectionOptions {
  selected: Ref<string[]>
  multiple: Readonly<Ref<boolean>>
  /** Items on screen, in order. Ranges are computed over this list. */
  visibleIds: Readonly<Ref<string[]>>
  isSelectable: (id: string) => boolean
}

/**
 * Desktop-style selection over item ids: click replaces, Ctrl/Cmd toggles,
 * Shift extends a range from the last anchor.
 */
export function useFileManagerSelection(options: UseFileManagerSelectionOptions) {
  const { selected, multiple, visibleIds, isSelectable } = options
  const anchor = ref<string | null>(null)

  function replace(id: string) {
    selected.value = [id]
    anchor.value = id
  }

  function toggle(id: string) {
    if (!multiple.value) return replace(id)
    selected.value = selected.value.includes(id)
      ? selected.value.filter(value => value !== id)
      : [...selected.value, id]
    anchor.value = id
  }

  /** Selects everything between the anchor and `id`. The anchor stays put. */
  function extend(id: string) {
    const ids = visibleIds.value
    const from = anchor.value === null ? -1 : ids.indexOf(anchor.value)
    const to = ids.indexOf(id)
    if (!multiple.value || from === -1 || to === -1) return replace(id)

    const [start, end] = from < to ? [from, to] : [to, from]
    selected.value = ids.slice(start, end + 1).filter(isSelectable)
  }

  function selectAll() {
    if (!multiple.value) return
    selected.value = visibleIds.value.filter(isSelectable)
  }

  function clear() {
    selected.value = []
    anchor.value = null
  }

  return { anchor, replace, toggle, extend, selectAll, clear }
}

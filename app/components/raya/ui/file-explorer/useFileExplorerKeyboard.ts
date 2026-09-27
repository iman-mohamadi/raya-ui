import type { Ref } from 'vue'
import type { FileExplorerView } from './types'

interface UseFileExplorerKeyboardOptions {
  /** Items in the open folder, in display order. */
  ids: Readonly<Ref<string[]>>
  focusedId: Ref<string | null>
  view: Readonly<Ref<FileExplorerView>>
  multiple: Readonly<Ref<boolean>>
  isSelectable: (id: string) => boolean
  nameOf: (id: string) => string
  /** Number of cards per row in the grid view. */
  columns: () => number
  /** Moves DOM focus to an item. */
  focus: (id: string) => void
  replace: (id: string) => void
  toggle: (id: string) => void
  extend: (id: string) => void
  selectAll: () => void
  clear: () => void
  open: (id: string) => void
  back: () => void
  forward: () => void
  up: () => void
  remove?: () => void
  rename?: () => void
  /** In right-to-left layouts, ArrowLeft moves forward in the grid. */
  dir?: Readonly<Ref<'ltr' | 'rtl'>>
}

const TYPEAHEAD_RESET = 700

/**
 * Desktop file manager keys for the content area. Arrows move in two
 * dimensions in the grid; Shift extends the selection, Ctrl/Cmd moves focus
 * without selecting (Space then toggles), and typing jumps to a name.
 */
export function useFileExplorerKeyboard(options: UseFileExplorerKeyboardOptions) {
  const rtl = () => options.dir?.value === 'rtl'
  let typeahead = ''
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

  function moveTo(id: string, event: KeyboardEvent) {
    options.focusedId.value = id
    options.focus(id)
    if (event.shiftKey && options.multiple.value) options.extend(id)
    else if (!(event.ctrlKey || event.metaKey)) options.replace(id)
  }

  function offset(key: string): number | 'start' | 'end' | undefined {
    const grid = options.view.value === 'grid'
    switch (key) {
      case 'ArrowDown': return grid ? options.columns() : 1
      case 'ArrowUp': return grid ? -options.columns() : -1
      case 'ArrowRight': return grid ? (rtl() ? -1 : 1) : undefined
      case 'ArrowLeft': return grid ? (rtl() ? 1 : -1) : undefined
      case 'Home': return 'start'
      case 'End': return 'end'
    }
    return undefined
  }

  function runTypeahead(key: string): boolean {
    clearTimeout(typeaheadTimer)
    typeahead += key.toLowerCase()
    typeaheadTimer = setTimeout(() => { typeahead = '' }, TYPEAHEAD_RESET)

    const ids = options.ids.value
    const from = options.focusedId.value === null ? 0 : ids.indexOf(options.focusedId.value)
    // A single repeated letter cycles through the matches, as in Explorer and Finder.
    const cycling = typeahead.length > 1 && [...typeahead].every(char => char === typeahead[0])
    const needle = cycling ? typeahead[0] ?? '' : typeahead
    const start = cycling || typeahead.length === 1 ? from + 1 : from
    const ordered = [...ids.slice(start), ...ids.slice(0, start)]
    return ordered.some((id) => {
      if (!options.nameOf(id).toLowerCase().startsWith(needle)) return false
      options.focusedId.value = id
      options.focus(id)
      options.replace(id)
      return true
    })
  }

  function onKeydown(event: KeyboardEvent) {
    const ids = options.ids.value
    const current = options.focusedId.value
    const index = current === null ? -1 : ids.indexOf(current)

    if (event.altKey) {
      if (event.key === 'ArrowLeft') options.back()
      else if (event.key === 'ArrowRight') options.forward()
      else if (event.key === 'ArrowUp') options.up()
      else return
      event.preventDefault()
      return
    }

    const step = offset(event.key)
    if (step !== undefined) {
      if (!ids.length) return
      event.preventDefault()
      let target: number
      if (step === 'start') target = 0
      else if (step === 'end') target = ids.length - 1
      else if (index === -1) target = 0
      else target = Math.min(ids.length - 1, Math.max(0, index + step))
      const id = ids[target]
      if (id !== undefined) moveTo(id, event)
      return
    }

    const mod = event.ctrlKey || event.metaKey
    switch (event.key) {
      case 'Enter':
        if (current !== null) {
          event.preventDefault()
          options.open(current)
        }
        return
      case ' ':
        if (current === null || !options.isSelectable(current)) return
        event.preventDefault()
        if (options.multiple.value) options.toggle(current)
        else options.replace(current)
        return
      case 'Backspace':
        event.preventDefault()
        options.up()
        return
      case 'Escape':
        options.clear()
        return
      case 'Delete':
        if (options.remove) {
          event.preventDefault()
          options.remove()
        }
        return
      case 'F2':
        if (options.rename) {
          event.preventDefault()
          options.rename()
        }
        return
    }

    if (mod && event.key.toLowerCase() === 'a') {
      event.preventDefault()
      options.selectAll()
      return
    }

    if (event.key.length === 1 && !mod && event.key !== ' ') {
      if (runTypeahead(event.key)) event.preventDefault()
    }
  }

  return { onKeydown }
}

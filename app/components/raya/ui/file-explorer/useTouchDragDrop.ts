import { onBeforeUnmount, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'

/** Hold this long before an item lifts; moving earlier is a scroll. */
const LIFT_DELAY = 350
/** How far a finger may wander before the lift and still count as holding still. */
const SLOP = 10
/** Distance from a scroll container's edge that scrolls it while dragging. */
const EDGE = 40

interface UseTouchDragDropOptions {
  enabled: Readonly<Ref<boolean>>
  /** Label of the badge under the finger, e.g. "3 items". */
  countLabel: (count: number) => string
  /** How many items the drag carries once it started. */
  count: () => number
}

/**
 * Drag and drop for touch screens, where HTML5 drag and drop does not exist:
 * hold an item until it lifts, then move it. Holding still instead leaves room
 * for the long-press context menu, and moving early scrolls as usual.
 *
 * The drag is replayed as the same drag events a mouse produces (dragstart,
 * dragover, drop, dragend) at the element under the finger, so every drop
 * target (items, tree, breadcrumbs, sidebar locations, trash) and every check
 * and highlight behave exactly as they do with a mouse.
 */
export function useTouchDragDrop(root: Readonly<Ref<HTMLElement | null>>, options: UseTouchDragDropOptions) {
  let source: HTMLElement | null = null
  let start = { x: 0, y: 0 }
  let last = { x: 0, y: 0 }
  let timer: ReturnType<typeof setTimeout> | undefined
  let lifted = false
  let dragging = false
  let transfer: DataTransfer | null = null
  let ghost: HTMLElement | null = null
  let frame = 0

  function dispatch(target: Element, type: 'dragstart' | 'dragover' | 'drop' | 'dragend') {
    const event = new DragEvent(type, { bubbles: true, cancelable: true, clientX: last.x, clientY: last.y, dataTransfer: transfer })
    target.dispatchEvent(event)
    return event
  }

  function reset() {
    clearTimeout(timer)
    cancelAnimationFrame(frame)
    source?.removeAttribute('data-touch-lifted')
    ghost?.remove()
    source = null
    ghost = null
    transfer = null
    lifted = false
    dragging = false
  }

  function lift() {
    if (!source) return
    lifted = true
    source.setAttribute('data-touch-lifted', '')
    navigator.vibrate?.(10)
  }

  function begin() {
    if (!source) return false
    transfer = new DataTransfer()
    if (dispatch(source, 'dragstart').defaultPrevented) return false
    dragging = true
    ghost = document.createElement('div')
    ghost.setAttribute('aria-hidden', 'true')
    ghost.textContent = options.countLabel(options.count())
    ghost.className = 'pointer-events-none fixed left-0 top-0 z-[200] rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-lg'
    document.body.append(ghost)
    return true
  }

  /** Scrolls the container under the finger when the finger nears its edge. */
  function autoScroll() {
    cancelAnimationFrame(frame)
    const under = document.elementFromPoint(last.x, last.y)
    let scroller = under instanceof HTMLElement ? under : null
    while (scroller && !(scroller.scrollHeight > scroller.clientHeight && /(auto|scroll)/.test(getComputedStyle(scroller).overflowY))) scroller = scroller.parentElement
    if (!scroller) return
    const box = scroller.getBoundingClientRect()
    const step = last.y < box.top + EDGE ? -12 : last.y > box.bottom - EDGE ? 12 : 0
    if (!step) return
    scroller.scrollTop += step
    frame = requestAnimationFrame(autoScroll)
  }

  function hover() {
    // Above the finger, so the finger does not hide it.
    if (ghost) ghost.style.transform = `translate(${last.x}px, ${last.y}px) translate(-50%, -140%)`
    const target = document.elementFromPoint(last.x, last.y)
    if (target) dispatch(target, 'dragover')
    autoScroll()
  }

  useEventListener(root, 'touchstart', (event: TouchEvent) => {
    reset()
    if (!options.enabled.value || event.touches.length !== 1) return
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[draggable="true"]') : null
    if (!target || !root.value?.contains(target)) return
    const touch = event.touches[0]!
    source = target
    start = { x: touch.clientX, y: touch.clientY }
    last = start
    timer = setTimeout(lift, LIFT_DELAY)
  }, { passive: true })

  useEventListener(root, 'touchmove', (event: TouchEvent) => {
    if (!source) return
    const touch = event.touches[0]
    if (!touch) return
    last = { x: touch.clientX, y: touch.clientY }
    if (!lifted) {
      // Moving before the lift is a scroll: let it happen.
      if (Math.hypot(last.x - start.x, last.y - start.y) > SLOP) reset()
      return
    }
    // The browser already started scrolling: too late to take over.
    if (!event.cancelable) return reset()
    event.preventDefault()
    if (!dragging && !begin()) return reset()
    hover()
  }, { passive: false })

  function finish(drop: boolean) {
    if (dragging && source) {
      const target = drop ? document.elementFromPoint(last.x, last.y) : null
      if (target) dispatch(target, 'drop')
      dispatch(source, 'dragend')
    }
    reset()
  }

  useEventListener(root, 'touchend', (event: TouchEvent) => {
    // A drag ends without the click (or double-tap) a lifted tap would make.
    if (dragging && event.cancelable) event.preventDefault()
    finish(true)
  })
  useEventListener(root, 'touchcancel', () => finish(false))
  // Held still long enough for the context menu: that wins.
  useEventListener(root, 'contextmenu', () => {
    if (!dragging) reset()
  }, { capture: true })

  onBeforeUnmount(reset)
}

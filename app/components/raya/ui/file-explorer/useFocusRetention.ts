import type { Ref } from 'vue'
import { useEventListener, useMutationObserver } from '@vueuse/core'

/**
 * Keeps keyboard focus on an element that the DOM moved. Vue reorders keyed
 * lists by moving nodes, and browsers drop focus from a node that moves: a
 * rename or a paste that re-sorts the folder would leave focus on <body>.
 *
 * After each mutation inside `root`, focus returns to the element that last
 * had it, if that element is still in the document and focus fell to <body>.
 * Focus the user moved elsewhere (Tab, a click outside) is never taken back.
 */
export function useFocusRetention(root: Readonly<Ref<HTMLElement | null>>) {
  let remembered: HTMLElement | null = null

  useEventListener(root, 'focusin', (event: FocusEvent) => {
    remembered = event.target instanceof HTMLElement ? event.target : null
  })
  useEventListener(root, 'focusout', (event: FocusEvent) => {
    const next = event.relatedTarget
    if (next instanceof Node && !root.value?.contains(next)) remembered = null
  })
  useEventListener(typeof document === 'undefined' ? null : document, 'pointerdown', (event: PointerEvent) => {
    if (!(event.target instanceof Node) || !root.value?.contains(event.target)) remembered = null
  }, { capture: true })

  useMutationObserver(root, () => {
    const element = remembered
    if (!element?.isConnected) return
    const active = document.activeElement
    if (active === element || (active && active !== document.body)) return
    element.focus({ preventScroll: true })
  }, { childList: true, subtree: true })
}

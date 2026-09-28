import type { FunctionalComponent, Slot } from 'vue'

/**
 * Renders a slot handed down through context, or its own default content when
 * there is none. Slots reach cards, rows and tree nodes this way instead of
 * being re-declared at each level: Vue cannot tell whether a forwarded slot
 * changed, so it re-renders every component that forwards one whenever its
 * parent renders, which in a folder of thousands means all of them.
 */
export const SlotOutlet: FunctionalComponent<{ slot?: Slot, scope?: object }> = (props, { slots }) =>
  props.slot ? props.slot(props.scope ?? {}) : slots.default?.()

SlotOutlet.props = ['slot', 'scope']
SlotOutlet.displayName = 'SlotOutlet'

<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, type ComputedRef } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: { type: String, required: true },
  asChild: { type: Boolean, default: false },
  as: { type: String, default: 'div' },
  class: { type: String, default: '' }
})

const context = inject<{
  registerSection: (id: string, el: HTMLElement) => void,
  unregisterSection: (id: string) => void,
  orientation: ComputedRef<string>
}>('scroll-spy')

if (!context) throw new Error('ScrollSpySection must be used within ScrollSpy')

const elementRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (elementRef.value) {
    // If asChild is used, Primitive renders the slot content directly,
    // but the ref still points to the DOM element if configured correctly.
    // However, with reka-ui Primitive, the ref usually works on the underlying element.
    // If using a component as child, ensure it forwards refs.
    context.registerSection(props.value, elementRef.value.$el || elementRef.value)
  }
})

onBeforeUnmount(() => {
  context.unregisterSection(props.value)
})
</script>

<template>
  <Primitive
      ref="elementRef"
      :as="as"
      :as-child="asChild"
      :id="value"
      :data-orientation="context.orientation.value"
      :class="props.class"
  >
    <slot />
  </Primitive>
</template>
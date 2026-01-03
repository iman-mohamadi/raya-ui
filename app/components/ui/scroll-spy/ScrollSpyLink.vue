<script setup lang="ts">
import { inject, computed, type Ref, type ComputedRef } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: { type: String, required: true },
  asChild: { type: Boolean, default: false },
  as: { type: String, default: 'a' },
  class: { type: String, default: '' }
})

const context = inject<{
  activeId: Ref<string>,
  scrollToSection: (id: string) => void,
  orientation: ComputedRef<string>
}>('scroll-spy')

if (!context) {
  throw new Error('ScrollSpyLink must be used within ScrollSpy')
}

const isActive = computed(() => context.activeId.value === props.value)

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  context.scrollToSection(props.value)
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :href="`#${value}`"
      :data-state="isActive ? 'active' : 'inactive'"
      :data-orientation="context.orientation.value"
      @click="handleClick"
      :class="cn(
      'rounded px-3 py-1.5 font-medium text-muted-foreground text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'data-[state=active]:bg-accent data-[state=active]:text-foreground',
      props.class
    )"
  >
    <slot />
  </Primitive>
</template>
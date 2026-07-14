<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  as?: string
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'a',
  asChild: false,
  class: '',
})

const context = inject<{
  activeId: Ref<string>,
  scrollTo: (id: string) => void
}>('scroll-spy')

if (!context) {
  throw new Error('ScrollSpyLink must be used within ScrollSpy')
}

const isActive = computed(() => context.activeId.value === props.value)

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  context.scrollTo(props.value)
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :href="`#${value}`"
      :data-state="isActive ? 'active' : 'inactive'"
      :data-scroll-spy-value="value"
      @click="handleClick"
      :class="cn(
      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
      'text-muted-foreground hover:text-foreground hover:bg-accent/50',
      'data-[state=active]:bg-accent data-[state=active]:text-foreground',
      props.class
    )"
  >
    <slot />
  </Primitive>
</template>
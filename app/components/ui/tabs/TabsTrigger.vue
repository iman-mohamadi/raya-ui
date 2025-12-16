<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue"
import { type TabsTriggerProps, TabsTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
      v-bind="forwardedProps"
      :class="cn(
      'relative z-10 inline-flex h-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50',
      // Inactive state
      'text-muted-foreground hover:text-foreground',
      // Active state (Handled by the sliding highlight for BG, but we switch text color here)
      'data-[state=active]:text-foreground',
      // Focus styles
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      props.class,
    )"
  >
    <slot />
  </TabsTrigger>
</template>
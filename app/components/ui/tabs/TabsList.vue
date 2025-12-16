<script setup lang="ts">
import { type HTMLAttributes, computed, ref, onMounted, nextTick } from "vue"
import { type TabsListProps, TabsList } from "reka-ui"
import { cn } from "@/lib/utils"
import { useResizeObserver, useMutationObserver } from "@vueuse/core"

const props = defineProps<TabsListProps & { class?: HTMLAttributes["class"] }>()

const tabsListRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref({
  left: "0px",
  width: "0px",
  opacity: "0",
})

// Function to update the indicator position
const updateIndicator = () => {
  if (!tabsListRef.value) return

  const activeTab = tabsListRef.value.querySelector('[data-state="active"]') as HTMLElement
  if (activeTab) {
    const listRect = tabsListRef.value.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()

    indicatorStyle.value = {
      left: `${tabRect.left - listRect.left}px`,
      width: `${tabRect.width}px`,
      opacity: "1",
    }
  } else {
    indicatorStyle.value.opacity = "0"
  }
}

// Watch for size changes
useResizeObserver(tabsListRef, updateIndicator)

// Watch for active state changes (attributes on children)
useMutationObserver(tabsListRef, updateIndicator, {
  subtree: true,
  attributes: true,
  attributeFilter: ["data-state"],
})

onMounted(() => {
  // Initial position check
  nextTick(updateIndicator)
  // Double check after a small delay for hydration/rendering stability
  setTimeout(updateIndicator, 100)
})
</script>

<template>
  <TabsList
      ref="tabsListRef"
      v-bind="props"
      :class="cn(
      'relative inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      props.class,
    )"
  >
    <div
        class="absolute bottom-1 top-1 z-0 rounded-md border border-transparent bg-background shadow-sm transition-all duration-300 ease-in-out dark:border-input dark:bg-input/30"
        :style="indicatorStyle"
    ></div>

    <slot />
  </TabsList>
</template>
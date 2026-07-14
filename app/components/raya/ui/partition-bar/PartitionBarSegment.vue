<script setup lang="ts">
import { inject, computed, onMounted, onUnmounted, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { useId } from '#imports' // Nuxt/Vue auto-import

const partitionBarLineVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-primary/60",
      destructive: "bg-destructive",
      outline: "border border-input bg-background",
      muted: "bg-primary/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

const partitionBarTitleVariants = cva("", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-primary/60",
      destructive: "text-destructive",
      outline: "text-foreground",
      muted: "text-primary/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

interface Props {
  num?: number
  variant?: VariantProps<typeof partitionBarLineVariants>['variant']
  alignment?: "left" | "center" | "right"
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  num: 0,
  variant: "default",
  alignment: "center"
})

// Context Injection
const context = inject<{
  total: { value: number }
  size: { value: VariantProps<typeof partitionBarVariants>['size'] }
  register: (id: string, val: number) => void
  unregister: (id: string) => void
}>('partition-bar-context')

if (!context) {
  throw new Error("PartitionBarSegment must be used within a PartitionBar")
}

const { total, size, register, unregister } = context
const id = useId()

// Register value on mount and updates
watch(() => props.num, (newVal) => {
  register(id, newVal)
}, { immediate: true })

onUnmounted(() => {
  unregister(id)
})

const widthPercent = computed(() => {
  return total.value > 0 ? (props.num / total.value) * 100 : 0
})

const heightClass = computed(() => {
  if (size.value === 'sm') return 'h-2'
  if (size.value === 'lg') return 'h-4'
  return 'h-3'
})

const marginClass = computed(() => {
  if (size.value === 'sm') return 'mt-2'
  if (size.value === 'lg') return 'mt-4'
  return 'mt-3'
})
</script>

<template>
  <li
      class="flex flex-col min-w-0"
      :style="{
      flexBasis: `${widthPercent}%`,
      flexGrow: 0,
      flexShrink: 0
    }"
  >
    <div
        :class="cn(
        partitionBarLineVariants({ variant }),
        'rounded-full w-full shrink-0',
        heightClass,
        props.class
      )"
    />

    <div
        :class="cn(
        partitionBarTitleVariants({ variant }),
        'w-full whitespace-normal flex flex-col',
        marginClass,
        alignment === 'left' && 'items-start',
        alignment === 'center' && 'items-center',
        alignment === 'right' && 'items-end'
      )"
    >
      <slot />
    </div>
  </li>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { Motion, AnimatePresence } from 'motion-v'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string | number | null
  defaultValue?: string | number | null
  items: any[]
  enableHover?: boolean
  class?: string
  transition?: any
  layoutId?: string
}

const props = withDefaults(defineProps<Props>(), {
  enableHover: false,
  items: () => [],
  layoutId: 'animated-background'
})

const emit = defineEmits(['update:modelValue'])

const uniqueId = props.layoutId || `background-${Math.random().toString(36).substr(2, 9)}`

// Internal state for hover mode or uncontrolled mode
const internalValue = ref(props.defaultValue ?? null)

const activeId = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : internalValue.value,
  set: (val) => {
    internalValue.value = val
    emit('update:modelValue', val)
  }
})

const handleInteraction = (id: string | number | null) => {
  if (props.enableHover) {
    activeId.value = id
  } else {
    // For click mode, we only set if not null (clicks usually select)
    // If you want toggle behavior, logic would be different.
    // Assuming selection behavior here.
    if (id !== null) activeId.value = id
  }
}

// Default transition from motion-primitives
const defaultTransition = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.3
}
</script>

<template>
  <div :class="cn('flex', props.class)">
    <div
        v-for="(item, index) in items"
        :key="index"
        :data-id="item.id || item.value || index"
        class="relative inline-flex"
        @click="!enableHover ? handleInteraction(item.id ?? item.value ?? index) : undefined"
        @mouseenter="enableHover ? handleInteraction(item.id ?? item.value ?? index) : undefined"
        @mouseleave="enableHover ? handleInteraction(null) : undefined"
    >
      <AnimatePresence>
        <Motion
            v-if="activeId === (item.id ?? item.value ?? index)"
            :layout-id="uniqueId"
            :class="cn('absolute inset-0 z-0', $attrs.itemClass)"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="transition || defaultTransition"
        >
          <slot name="background">
            <div class="absolute inset-0 bg-accent rounded-md w-full h-full" />
          </slot>
        </Motion>
      </AnimatePresence>

      <div class="z-10 relative">
        <slot :item="item" :index="index" :is-active="activeId === (item.id ?? item.value ?? index)" />
      </div>
    </div>
  </div>
</template>
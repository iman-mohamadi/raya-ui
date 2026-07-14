<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  decimals?: number
  defaultValue?: number
  label?: string
  max?: number
  min?: number
  step?: number
  ticks?: number
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Value',
  defaultValue: 0,
  min: 0,
  max: 1,
  step: 0.01,
  decimals: 2,
  ticks: 9
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'slideBegin', value: number): void
  (e: 'slideEnd', value: number): void
}>()

const trackRef = ref<HTMLDivElement | null>(null)
const internalValue = ref(props.defaultValue)
const isDragging = ref(false)
const isHovering = ref(false)
const isHoverDevice = ref(false)

const value = computed(() => props.modelValue ?? internalValue.value)
const range = computed(() => props.max - props.min)
const percentage = computed(() => range.value > 0 ? ((value.value - props.min) / range.value) * 100 : 0)
const isActive = computed(() => isDragging.value || (isHoverDevice.value && isHovering.value))

onMounted(() => {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
  isHoverDevice.value = mq.matches
  mq.addEventListener("change", (e) => (isHoverDevice.value = e.matches))
})

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)
const roundToStep = (val: number, step: number, min: number) => Math.round((val - min) / step) * step + min

const setValue = (newValue: number) => {
  const clamped = clamp(roundToStep(newValue, props.step, props.min), props.min, props.max)
  if (props.modelValue === undefined) internalValue.value = clamped
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

const getValueFromPointer = (clientX: number) => {
  if (!trackRef.value) return value.value
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  return props.min + ratio * range.value
}

const handlePointerDown = (e: PointerEvent) => {
  e.preventDefault()
  trackRef.value?.setPointerCapture(e.pointerId)
  isDragging.value = true
  emit('slideBegin', value.value)
  setValue(getValueFromPointer(e.clientX))
}

const handlePointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  setValue(getValueFromPointer(e.clientX))
}

const handlePointerUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    emit('slideEnd', value.value)
  }
}
</script>

<template>
  <div :class="cn('relative w-full select-none', props.className)">
    <div
        ref="trackRef"
        role="slider"
        tabindex="0"
        :aria-label="label"
        :aria-valuemax="max"
        :aria-valuemin="min"
        :aria-valuenow="Number(value.toFixed(decimals))"
        class="relative cursor-pointer overflow-hidden bg-muted outline-offset-2"
        :style="{ height: '52px', borderRadius: '12px', touchAction: 'none' }"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
    >
      <div
          class="pointer-events-none absolute inset-y-0 left-0 bg-foreground/14"
          :style="{
          borderRadius: '12px',
          width: `${percentage}%`,
          transition: isDragging ? 'none' : 'width 150ms cubic-bezier(0.23, 1, 0.32, 1)'
        }"
      />

      <div v-if="ticks > 0" class="pointer-events-none absolute inset-0">
        <div
            v-for="i in ticks"
            :key="i"
            class="absolute top-1/2 bg-foreground/25"
            :style="{
            left: `${((i) / (ticks + 1)) * 100}%`,
            width: '1px',
            height: '8px',
            borderRadius: '999px',
            transform: 'translateX(-50%) translateY(-50%)'
          }"
        />
      </div>

      <div
          class="pointer-events-none absolute"
          :style="{
          top: '50%',
          left: `${percentage}%`,
          transform: 'translateX(-50%) translateY(-50%)',
          marginLeft: '-6px',
          zIndex: 3,
          transition: isDragging ? 'none' : 'left 150ms cubic-bezier(0.23, 1, 0.32, 1)'
        }"
      >
        <div
            class="bg-foreground/90 transition-all duration-250 ease-out"
            :style="{
            width: '5px',
            height: '34px',
            borderRadius: '999px',
            opacity: isActive ? 0.8 : 0.15,
            transform: `scale(${isActive ? 1 : 0.7})`
          }"
        />
      </div>

      <div
          class="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 whitespace-nowrap text-foreground"
          :style="{ fontSize: '17px', zIndex: 4 }"
      >
        {{ label }}
      </div>

      <div
          class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-foreground"
          :style="{
          zIndex: 4,
          fontFamily: 'ui-monospace, monospace',
          fontVariantNumeric: 'tabular-nums',
          fontSize: '15px',
          fontWeight: 500
        }"
      >
        {{ value.toFixed(decimals) }}
      </div>
    </div>
  </div>
</template>
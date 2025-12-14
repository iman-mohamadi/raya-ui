{
type: uploaded file
fileName: iman-mohamadi/enzoui/EnzOUi-481682bc4f3f825c0131815bd4179e5da136063e/app/components/ui/animated-tabs/AnimatedTabs.vue
fullContent:
<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { cn } from '@/lib/utils'

export interface TabItem {
  label: string
  icon?: any
  slot?: string
  content?: string
  disabled?: boolean
  [key: string]: any
}

interface Props {
  modelValue?: string | number
  items?: TabItem[]
  defaultIndex?: number
  orientation?: 'horizontal' | 'vertical'
  variant?: 'pill' | 'link'
  content?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  defaultIndex: 0,
  orientation: 'horizontal',
  variant: 'pill',
  content: true
})

const emit = defineEmits(['update:modelValue', 'change'])

// State
const activeIndex = ref(props.defaultIndex)
const tabRefs = ref<HTMLElement[]>([])
const containerRef = ref<HTMLElement | null>(null)

// Drag State
const isDown = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const isDragging = ref(false)

const markerStyle = ref({
  width: '0px',
  height: '0px',
  transform: 'translate(0px, 0px)',
  opacity: 0
})

const selected = computed({
  get() {
    if (props.modelValue !== undefined) return props.modelValue
    return activeIndex.value
  },
  set(val) {
    if (props.modelValue !== undefined) {
      emit('update:modelValue', val)
    } else {
      activeIndex.value = Number(val)
    }
    emit('change', val)
  }
})

const currentNumericIndex = computed(() => {
  return typeof selected.value === 'number' ? selected.value : 0
})

// Update Marker Position (Scroll-safe)
const updateMarker = () => {
  const el = tabRefs.value[currentNumericIndex.value]
  if (!el || !containerRef.value) {
    markerStyle.value.opacity = 0
    return
  }

  // Use offsetLeft/Top relative to the container scrolling context
  const left = el.offsetLeft
  const top = el.offsetTop
  const width = el.offsetWidth
  const height = el.offsetHeight

  if (props.variant === 'link') {
    markerStyle.value = {
      width: `${width}px`,
      height: '2px',
      transform: `translate(${left}px, ${height - 2}px)`,
      opacity: 1
    }
  } else {
    markerStyle.value = {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${left}px, ${top}px)`,
      opacity: 1
    }
  }
}

const setTabRef = (el: any, index: number) => {
  if (el) tabRefs.value[index] = el
}

// --- Optimized Drag Logic ---
const startDrag = (e: MouseEvent) => {
  if (!containerRef.value) return
  isDown.value = true
  isDragging.value = false

  // Record initial positions
  startX.value = e.pageX
  scrollLeft.value = containerRef.value.scrollLeft
}

const stopDrag = () => {
  isDown.value = false
  // Small delay so the 'click' event on the button knows to ignore if we were just dragging
  setTimeout(() => isDragging.value = false, 50)
}

const doDrag = (e: MouseEvent) => {
  if (!isDown.value || !containerRef.value) return
  e.preventDefault() // Stop text selection

  const x = e.pageX
  // FIXED: Multiplier set to 1 for 1:1 natural movement (was 2)
  const walk = (x - startX.value) * 1

  // Threshold to flag as a drag operation instead of a click
  if (Math.abs(walk) > 5) isDragging.value = true

  containerRef.value.scrollLeft = scrollLeft.value - walk
}

const handleTabClick = (index: number) => {
  if (isDragging.value) return // Prevent switching tabs if we were just scrolling
  selected.value = index
}

// Watchers
watch(
    () => [currentNumericIndex.value, props.variant, props.orientation],
    async () => {
      await nextTick()
      updateMarker()
    }
)

onMounted(async () => {
  await nextTick()
  updateMarker()
  window.addEventListener('resize', updateMarker)
})
</script>

<template>
  <div :class="cn('w-full flex flex-col', props.class)">

    <div
        ref="containerRef"
        class="relative flex items-center gap-1 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
        :class="[
        orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row',
        variant === 'pill'
          ? 'p-1 bg-muted/50 border border-border rounded-xl'
          : 'p-0 rounded-none bg-transparent'
      ]"
        @mousedown="startDrag"
        @mouseleave="stopDrag"
        @mouseup="stopDrag"
        @mousemove="doDrag"
    >
      <div
          class="absolute top-0 left-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
          :class="[
          variant === 'pill'
            ? 'bg-background shadow-sm rounded-lg border border-border/50'
            : 'bg-primary rounded-t-sm z-20'
        ]"
          :style="markerStyle"
      ></div>

      <button
          v-for="(item, index) in items"
          :key="index"
          :ref="(el) => setTabRef(el, index)"
          type="button"
          :disabled="item.disabled"
          @click="handleTabClick(index)"
          class="relative z-10 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap flex-shrink-0"
          :class="[
          variant === 'pill' ? 'rounded-lg' : 'rounded-none hover:bg-muted/50',
          currentNumericIndex === index
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground',
          item.disabled && 'opacity-50 cursor-not-allowed'
        ]"
      >
        <slot name="default" :item="item" :index="index" :selected="currentNumericIndex === index">
          <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
          <span>{{ item.label }}</span>
        </slot>
      </button>
    </div>

    <div v-if="content" class="mt-4">
      <template v-for="(item, index) in items" :key="index">
        <div
            v-show="currentNumericIndex === index"
            class="focus:outline-none"
            role="tabpanel"
        >
          <slot :name="item.slot || 'item'" :item="item" :index="index" :selected="currentNumericIndex === index">
            <div v-if="item.content" v-html="item.content"></div>
          </slot>
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
}
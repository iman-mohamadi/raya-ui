<script setup lang="ts">
import {
  ref,
  provide,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
  type PropType
} from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: '' },
  offset: { type: Number, default: 0 },
  rootMargin: { type: String, default: undefined },
  threshold: { type: [Number, Array] as PropType<number | number[]>, default: 0 },
  scrollBehavior: { type: String as PropType<ScrollBehavior>, default: 'smooth' },
  container: { type: Object as PropType<HTMLElement | null>, default: null },
  orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'vertical' },
  asChild: { type: Boolean, default: false },
  as: { type: String, default: 'div' },
  class: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const activeId = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: props.defaultValue,
})

const sectionMap = new Map<string, HTMLElement>()
const isScrolling = ref(false)
const scrollTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
let observer: IntersectionObserver | null = null

const registerSection = (id: string, element: HTMLElement) => {
  sectionMap.set(id, element)
  updateObserver()
}

const unregisterSection = (id: string) => {
  sectionMap.delete(id)
  updateObserver()
}

const scrollTo = (id: string) => {
  const element = sectionMap.get(id) || document.getElementById(id)

  if (!element) {
    activeId.value = id
    return
  }

  isScrolling.value = true
  activeId.value = id

  const containerEl = props.container || window
  const isWindow = containerEl === window

  let targetTop = 0
  if (!isWindow && containerEl instanceof HTMLElement) {
    const containerRect = containerEl.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const scrollTop = containerEl.scrollTop
    targetTop = elementRect.top - containerRect.top + scrollTop - props.offset

    containerEl.scrollTo({
      top: targetTop,
      behavior: props.scrollBehavior
    })
  } else {
    const elementRect = element.getBoundingClientRect()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    targetTop = elementRect.top + scrollTop - props.offset

    window.scrollTo({
      top: targetTop,
      behavior: props.scrollBehavior
    })
  }

  if (scrollTimeout.value) clearTimeout(scrollTimeout.value)
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}

const updateObserver = () => {
  if (observer) observer.disconnect()
  if (sectionMap.size === 0) return

  const root = props.container || null
  const margin = props.rootMargin ?? `${-props.offset}px 0px -70% 0px`

  observer = new IntersectionObserver((entries) => {
    if (isScrolling.value) return

    const intersecting = entries.filter(e => e.isIntersecting)
    if (intersecting.length === 0) return

    const topmost = intersecting.reduce((prev, curr) => {
      return curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
    })

    const id = topmost.target.id
    if (id && id !== activeId.value) {
      activeId.value = id
    }
  }, {
    root,
    rootMargin: margin,
    threshold: props.threshold
  })

  sectionMap.forEach((el) => observer?.observe(el))
}

watch(() => [props.container, props.rootMargin, props.offset, props.threshold], updateObserver)

onMounted(() => {
  updateObserver()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  if (scrollTimeout.value) clearTimeout(scrollTimeout.value)
})

provide('scroll-spy', {
  activeId,
  scrollTo,
  registerSection,
  unregisterSection,
  orientation: computed(() => props.orientation)
})
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :class="cn(
        'flex',
        // FIX: Vertical orientation = Sidebar Mode = Row Layout (Sidebar | Content)
        // Horizontal orientation = Navbar Mode = Col Layout (Navbar / Content)
        orientation === 'horizontal' ? 'flex-col' : 'flex-row',
        props.class
      )"
  >
    <slot />
  </Primitive>
</template>
<script setup lang="ts">
import { inject, ref, watch, nextTick, onMounted, type ComputedRef, type Ref } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { unrefElement } from '@vueuse/core'

const props = defineProps({
  asChild: { type: Boolean, default: false },
  as: { type: String, default: 'nav' },
  class: { type: String, default: '' },
  indicator: { type: Boolean, default: false },
  indicatorClass: { type: String, default: 'bg-primary' },
  indicatorPosition: {
    type: String as () => 'before' | 'after',
    default: 'before'
  }
})

const context = inject<{
  orientation: ComputedRef<'vertical' | 'horizontal'>,
  activeId: Ref<string>
}>('scroll-spy')

if (!context) {
  throw new Error('ScrollSpyNav must be used within ScrollSpy')
}

const navRef = ref<InstanceType<typeof Primitive> | null>(null)
const indicatorStyle = ref({
  top: 'auto',
  bottom: 'auto',
  left: 'auto',
  right: 'auto',
  height: '0px',
  width: '0px',
  opacity: 0
})

const updateIndicator = async () => {
  // FIX: Safely unwrap DOM element
  const el = unrefElement(navRef)
  if (!props.indicator || !el) return

  await nextTick()

  const currentId = context.activeId.value
  // FIX: Query by ID value instead of active state to avoid race conditions
  const activeLink = currentId
      ? el.querySelector(`[data-scroll-spy-value="${currentId}"]`) as HTMLElement
      : null

  if (!activeLink) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: 0 }
    return
  }

  const styles: any = { opacity: 1 }
  const isHorizontal = context.orientation.value === 'horizontal'
  const isAfter = props.indicatorPosition === 'after'

  if (isHorizontal) {
    // Horizontal Nav (Navbar)
    styles.left = `${activeLink.offsetLeft}px`
    styles.width = `${activeLink.offsetWidth}px`
    styles.height = '2px'

    if (isAfter) {
      styles.bottom = '0'
      styles.top = 'auto'
    } else {
      styles.top = '0'
      styles.bottom = 'auto'
    }
  } else {
    // Vertical Nav (Sidebar)
    styles.top = `${activeLink.offsetTop}px`
    styles.height = `${activeLink.offsetHeight}px`
    styles.width = '2px'

    if (isAfter) {
      styles.right = '0'
      styles.left = 'auto'
    } else {
      styles.left = '0'
      styles.right = 'auto'
    }
  }

  indicatorStyle.value = styles
}

watch(context.activeId, updateIndicator, { immediate: true })

onMounted(() => {
  if (props.indicator) {
    window.addEventListener('resize', updateIndicator)
    setTimeout(updateIndicator, 100)
  }
})
</script>

<template>
  <div class="relative">
    <div
        v-if="indicator"
        :class="cn(
        'absolute rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]',
        props.indicatorClass
      )"
        :style="indicatorStyle"
    />

    <Primitive
        ref="navRef"
        :as="as"
        :as-child="asChild"
        :class="cn(
        'flex gap-2',
        // FIX: Item direction logic
        // Vertical Parent (Sidebar) -> Flex Col Items
        // Horizontal Parent (Navbar) -> Flex Row Items
        context.orientation.value === 'horizontal' ? 'flex-row' : 'flex-col',

        // Padding adjustments for indicator
        indicator && context.orientation.value === 'vertical' && indicatorPosition === 'before' ? 'pl-4' : '',
        indicator && context.orientation.value === 'vertical' && indicatorPosition === 'after' ? 'pr-4' : '',
        indicator && context.orientation.value === 'horizontal' && indicatorPosition === 'before' ? 'pt-4' : '',
        indicator && context.orientation.value === 'horizontal' && indicatorPosition === 'after' ? 'pb-4' : '',
        props.class
      )"
    >
      <slot />
    </Primitive>
  </div>
</template>
<script lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import type { AnimatedTabsVariants } from './variants'

/** An icon is either a component (any `lucide-vue-next` icon) or a CSS icon class. */
export type TabsIcon = Component | string

export interface TabsItemAvatar {
  src?: string
  alt?: string
  /** Fallback initials shown when `src` is missing. */
  text?: string
  loading?: 'eager' | 'lazy'
}

export interface TabsItemBadge {
  label?: string | number
  class?: HTMLAttributes['class']
}

export interface TabsItem {
  label?: string
  icon?: TabsIcon
  avatar?: TabsItemAvatar
  badge?: string | number | TabsItemBadge
  /** Text rendered in the panel when no matching slot is provided. */
  content?: string
  value?: string | number
  disabled?: boolean
  /** Name of the slot that renders this item's panel. */
  slot?: string
  class?: HTMLAttributes['class']
  ui?: {
    trigger?: HTMLAttributes['class']
    leadingIcon?: HTMLAttributes['class']
    leadingAvatar?: HTMLAttributes['class']
    label?: HTMLAttributes['class']
    trailingBadge?: HTMLAttributes['class']
    content?: HTMLAttributes['class']
  }
  [key: string]: any
}

/** Kept so existing `TabItem` imports keep working. */
export type TabItem = TabsItem

export interface AnimatedTabsProps {
  /** The element or component this component should render as. */
  as?: Component | string
  items?: TabsItem[]
  color?: AnimatedTabsVariants['color']
  variant?: AnimatedTabsVariants['variant']
  size?: AnimatedTabsVariants['size']
  /** The orientation of the tabs. */
  orientation?: AnimatedTabsVariants['orientation']
  /** Render the panels. Set to `false` for triggers only. */
  content?: boolean
  /** The key used to read the value from each item. Supports dot paths. */
  valueKey?: string
  /** The key used to read the label from each item. Supports dot paths. */
  labelKey?: string
  /** The value of the tab active on first render. Defaults to the first item. */
  defaultValue?: string | number
  /** The controlled value of the active tab. Bindable with `v-model`. */
  modelValue?: string | number
  /** Whether a tab activates on focus (`automatic`) or on click (`manual`). */
  activationMode?: 'automatic' | 'manual'
  /** Unmount the panel of an inactive tab. */
  unmountOnHide?: boolean
  class?: HTMLAttributes['class']
  /** Override the classes of any individual slot. */
  ui?: {
    root?: HTMLAttributes['class']
    list?: HTMLAttributes['class']
    indicator?: HTMLAttributes['class']
    trigger?: HTMLAttributes['class']
    leadingIcon?: HTMLAttributes['class']
    leadingAvatar?: HTMLAttributes['class']
    label?: HTMLAttributes['class']
    trailingBadge?: HTMLAttributes['class']
    content?: HTMLAttributes['class']
  }
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui'
import { animatedTabs } from './variants'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AnimatedTabsProps>(), {
  as: 'div',
  items: () => [],
  color: 'primary',
  variant: 'pill',
  size: 'md',
  orientation: 'horizontal',
  content: true,
  valueKey: 'value',
  labelKey: 'label',
  unmountOnHide: true,
  activationMode: 'automatic'
})

const emit = defineEmits<{ 'update:modelValue': [payload: string | number] }>()

const slots = defineSlots<{
  leading(props: { item: TabsItem, index: number }): any
  default(props: { item: TabsItem, index: number }): any
  trailing(props: { item: TabsItem, index: number }): any
  content(props: { item: TabsItem, index: number }): any
  'list-leading'(): any
  'list-trailing'(): any
  [key: string]: any
}>()

/** Reads `a.b.c` style paths so `value-key`/`label-key` can point into nested items. */
function get(object: Record<string, any> | undefined, path: string) {
  if (!object) return undefined
  if (!path.includes('.')) return object[path]
  return path.split('.').reduce<any>((acc, key) => (acc == null ? acc : acc[key]), object)
}

/** Matches Nuxt UI: the value falls back to the item index as a string. */
function getItemValue(item: TabsItem, index: number): string {
  return String(get(item, props.valueKey) ?? index)
}

const triggersRef = ref<ComponentPublicInstance[]>([])
defineExpose({ triggersRef })

const defaultValue = computed(() =>
  props.defaultValue !== undefined
    ? String(props.defaultValue)
    : props.items.length
      ? getItemValue(props.items[0]!, 0)
      : ''
)

const isControlled = computed(() => props.modelValue !== undefined)
const internalValue = ref(defaultValue.value)

const activeValue = computed({
  get: () => (isControlled.value ? String(props.modelValue) : internalValue.value),
  set: (value: string | number) => {
    if (!isControlled.value) internalValue.value = String(value)
    emit('update:modelValue', value)
  }
})

const activeIndex = computed(() => props.items.findIndex((item, index) => getItemValue(item, index) === activeValue.value))

// --- Indicator ---------------------------------------------------------------
// reka-ui ships a TabsIndicator, but it never resolves its list element here and
// so never renders. The geometry is measured directly instead and published
// through the same `--reka-tabs-indicator-*` variables the theme reads, so the
// ported Nuxt UI classes work unchanged.

const listRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref<Record<string, string> | null>(null)

function setListRef(el: any) {
  listRef.value = el?.$el ?? el ?? null
}

function triggerElement(index: number): HTMLElement | null {
  const instance = triggersRef.value[index] as any
  return instance?.$el ?? instance ?? null
}

function updateIndicator() {
  const trigger = activeIndex.value >= 0 ? triggerElement(activeIndex.value) : null
  if (!listRef.value || !trigger) {
    indicatorStyle.value = null
    return
  }

  const [size, thickness, position] = props.orientation === 'horizontal'
    ? [trigger.offsetWidth, trigger.offsetHeight, trigger.offsetLeft]
    : [trigger.offsetHeight, trigger.offsetWidth, trigger.offsetTop]

  indicatorStyle.value = {
    '--reka-tabs-indicator-size': `${size}px`,
    '--reka-tabs-indicator-thickness': `${thickness}px`,
    '--reka-tabs-indicator-position': `${position}px`
  }
}

async function scheduleIndicatorUpdate() {
  await nextTick()
  updateIndicator()
}

watch(
  () => [activeValue.value, props.items, props.orientation, props.variant, props.size],
  scheduleIndicatorUpdate,
  { deep: true }
)

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await scheduleIndicatorUpdate()

  if (typeof ResizeObserver === 'undefined' || !listRef.value) return
  resizeObserver = new ResizeObserver(() => updateIndicator())
  resizeObserver.observe(listRef.value)
  props.items.forEach((_, index) => {
    const el = triggerElement(index)
    if (el) resizeObserver!.observe(el)
  })
})

onBeforeUnmount(() => resizeObserver?.disconnect())

const ui = computed(() =>
  animatedTabs({
    color: props.color,
    variant: props.variant,
    size: props.size,
    orientation: props.orientation
  })
)

function badgeOf(badge: TabsItem['badge']): TabsItemBadge {
  return typeof badge === 'object' ? badge : { label: badge }
}
</script>

<template>
  <TabsRoot
    v-bind="$attrs"
    v-model="activeValue"
    :as="as"
    :orientation="orientation"
    :activation-mode="activationMode"
    :unmount-on-hide="unmountOnHide"
    :class="cn(ui.root(), props.ui?.root, props.class)"
  >
    <TabsList :ref="setListRef" data-slot="list" :class="cn(ui.list(), props.ui?.list)">
      <slot name="list-leading" />

      <span
        v-if="indicatorStyle"
        data-slot="indicator"
        aria-hidden="true"
        :style="indicatorStyle"
        :class="cn(ui.indicator(), props.ui?.indicator)"
      />

      <TabsTrigger
        v-for="(item, index) in items"
        :key="index"
        :ref="el => { if (el) triggersRef[index] = el as ComponentPublicInstance }"
        :value="getItemValue(item, index)"
        :disabled="item.disabled"
        :class="cn(ui.trigger(), props.ui?.trigger, item.ui?.trigger, item.class)"
      >
        <slot name="leading" :item="item" :index="index">
          <template v-if="item.icon">
            <span
              v-if="typeof item.icon === 'string'"
              :class="cn(ui.leadingIcon(), props.ui?.leadingIcon, item.ui?.leadingIcon, item.icon)"
            />
            <component
              :is="item.icon"
              v-else
              :class="cn(ui.leadingIcon(), props.ui?.leadingIcon, item.ui?.leadingIcon)"
            />
          </template>
          <img
            v-else-if="item.avatar?.src"
            :src="item.avatar.src"
            :alt="item.avatar.alt"
            :loading="item.avatar.loading"
            :class="cn(ui.leadingAvatar(), ui.leadingAvatarSize(), props.ui?.leadingAvatar, item.ui?.leadingAvatar)"
          >
          <span
            v-else-if="item.avatar?.text"
            :class="cn(ui.leadingAvatar(), ui.leadingAvatarSize(), 'inline-flex items-center justify-center text-[0.65em] font-medium', props.ui?.leadingAvatar, item.ui?.leadingAvatar)"
          >{{ item.avatar.text }}</span>
        </slot>

        <span
          v-if="get(item, labelKey) || !!slots.default"
          :class="cn(ui.label(), props.ui?.label, item.ui?.label)"
        >
          <slot :item="item" :index="index">{{ get(item, labelKey) }}</slot>
        </span>

        <slot name="trailing" :item="item" :index="index">
          <span
            v-if="item.badge !== undefined && item.badge !== null"
            :class="cn(ui.trailingBadge(), ui.trailingBadgeSize(), props.ui?.trailingBadge, item.ui?.trailingBadge, badgeOf(item.badge).class)"
          >{{ badgeOf(item.badge).label }}</span>
        </slot>
      </TabsTrigger>

      <slot name="list-trailing" />
    </TabsList>

    <template v-if="!!content">
      <TabsContent
        v-for="(item, index) in items"
        :key="index"
        :value="getItemValue(item, index)"
        :unmount-on-hide="unmountOnHide"
        :class="cn(ui.content(), props.ui?.content, item.ui?.content)"
      >
        <slot :name="item.slot || 'content'" :item="item" :index="index">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </TabsRoot>
</template>

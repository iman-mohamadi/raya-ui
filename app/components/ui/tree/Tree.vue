<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import { TreeRoot, TreeItem, useForwardPropsEmits } from 'reka-ui'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  items?: T[]
  modelValue?: any
  expanded?: string[]
  defaultExpanded?: string[]
  defaultValue?: any
  multiple?: boolean
  disabled?: boolean
  propagateSelect?: boolean
  getKey?: (item: T) => string
  labelKey?: string
  childrenKey?: string
  class?: string
}>(), {
  items: () => [],
  labelKey: 'label',
  childrenKey: 'children',
  propagateSelect: true
})

const emits = defineEmits<{
  'update:modelValue': [value: any]
  'update:expanded': [value: string[]]
  'select': [node: any]
  'toggle': [node: any]
}>()

// Explicit key resolver to ensure TreeRoot always receives a function
const itemKeyResolver = (item: any) => {
  if (!item) return ''
  if (props.getKey) {
    return props.getKey(item as T)
  }
  return (item[props.labelKey] as string) || item.id || item.key || ''
}

// Explicit children resolver
const itemChildrenResolver = (item: any) => {
  return item?.[props.childrenKey]
}

// Forward other state/configuration props
const rootProps = computed(() => ({
  items: props.items,
  modelValue: props.modelValue,
  expanded: props.expanded,
  defaultExpanded: props.defaultExpanded,
  defaultValue: props.defaultValue,
  multiple: props.multiple,
  disabled: props.disabled,
  propagateSelect: props.propagateSelect
}))

const forwarded = useForwardPropsEmits(rootProps, emits)
</script>

<template>
  <TreeRoot
      v-bind="forwarded"
      :get-key="itemKeyResolver"
      :get-children="itemChildrenResolver"
      :class="cn('w-full select-none list-none', props.class)"
      v-slot="{ flattenItems }"
  >
    <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
        :class="cn(
        'group relative flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-medium outline-none transition-colors',
        'hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'cursor-pointer'
      )"
        :style="{ paddingLeft: `${item.level * 1.5}rem` }"
        v-slot="{ isExpanded, isSelected }"
    >
      <component
          :is="isExpanded ? ChevronDown : ChevronRight"
          v-if="item.hasChildren"
          class="h-4 w-4 shrink-0 text-muted-foreground/70 group-hover:text-foreground transition-colors"
      />
      <span v-else class="h-4 w-4 shrink-0" />

      <slot name="item" :item="item.value" :expanded="isExpanded" :selected="isSelected">
        <component
            :is="item.value.icon"
            v-if="item.value.icon"
            class="h-4 w-4 shrink-0 mr-1 text-muted-foreground group-hover:text-foreground transition-colors"
            :class="{ 'text-foreground': isSelected }"
        />

        <span
            class="truncate"
            :class="{ 'text-primary font-semibold': isSelected }"
        >
          {{ item.value[props.labelKey] }}
        </span>
      </slot>
    </TreeItem>
  </TreeRoot>
</template>
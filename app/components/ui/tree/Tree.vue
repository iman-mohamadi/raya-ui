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
  selectionBehavior?: 'toggle' | 'replace'
  disabled?: boolean
  propagateSelect?: boolean
  bubbleSelect?: boolean
  dir?: 'ltr' | 'rtl'
  getKey?: (item: T) => string
  labelKey?: string
  childrenKey?: string
  class?: string
}>(), {
  items: () => [],
  labelKey: 'label',
  childrenKey: 'children',
  propagateSelect: true,
  selectionBehavior: 'toggle' // Default to 'toggle' for easier multiple selection
})

const emits = defineEmits<{
  'update:modelValue': [value: any]
  'update:expanded': [value: string[]]
  'select': [node: any]
  'toggle': [node: any]
}>()

const itemKeyResolver = (item: any) => {
  if (!item) return ''
  if (props.getKey) {
    return props.getKey(item as T)
  }
  return (item[props.labelKey] as string) || item.id || item.key || ''
}

const itemChildrenResolver = (item: any) => {
  return item?.[props.childrenKey]
}

const rootProps = computed(() => ({
  items: props.items,
  modelValue: props.modelValue,
  expanded: props.expanded,
  defaultExpanded: props.defaultExpanded,
  defaultValue: props.defaultValue,
  multiple: props.multiple,
  selectionBehavior: props.selectionBehavior,
  disabled: props.disabled,
  propagateSelect: props.propagateSelect,
  bubbleSelect: props.bubbleSelect,
  dir: props.dir
}))

const forwarded = useForwardPropsEmits(rootProps, emits)
</script>

<template>
  <TreeRoot
      v-bind="forwarded"
      :get-key="itemKeyResolver"
      :get-children="itemChildrenResolver"
      as="div"
      :class="cn('w-full select-none list-none', props.class)"
      v-slot="{ flattenItems }"
  >
    <TransitionGroup
        name="tree-list"
        tag="ul"
        class="w-full flex flex-col"
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
    </TransitionGroup>
  </TreeRoot>
</template>

<style>
.tree-list-move {
  transition: transform 0.2s ease-in-out;
}
.tree-list-enter-active,
.tree-list-leave-active {
  transition: all 0.2s ease-in-out;
}
.tree-list-enter-from,
.tree-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
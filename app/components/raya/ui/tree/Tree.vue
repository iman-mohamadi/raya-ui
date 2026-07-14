<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import { TreeRoot, TreeItem, useForwardPropsEmits, type TreeRootEmits, type TreeRootProps } from 'reka-ui'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

// Use Omit to exclude the mandatory 'getKey' from TreeRootProps
// and redefine it as optional in our component props.
const props = withDefaults(defineProps<Omit<TreeRootProps, 'getKey'> & {
  class?: string
  items?: T[]
  labelKey?: string
  childrenKey?: string
  iconKey?: string
  getKey?: (item: T) => string
}>(), {
  items: () => [],
  labelKey: 'label',
  childrenKey: 'children',
  iconKey: 'icon',
  selectionBehavior: 'toggle',
})

const emits = defineEmits<TreeRootEmits>()

const delegatedProps = computed(() => {
  // Destructure 'getKey' out so we don't forward it (we bind it explicitly)
  const { class: _, items, labelKey, childrenKey, iconKey, getKey, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Helper to resolve the key for an item, matching TreeRoot's logic
const getKeyResolver = (item: T) => {
  if (props.getKey) return props.getKey(item)
  return item[props.labelKey] as string
}

// Manually handle expansion toggling for parents
const handleToggle = (item: any) => {
  if (!item.hasChildren) return

  const key = getKeyResolver(item.value)
  const currentExpanded = props.expanded ? [...props.expanded] : []
  const index = currentExpanded.indexOf(key)

  if (index > -1) {
    currentExpanded.splice(index, 1)
  } else {
    currentExpanded.push(key)
  }

  emits('update:expanded', currentExpanded)
}
</script>

<template>
  <TreeRoot
      v-bind="forwarded"
      :class="cn('w-full select-none list-none', props.class)"
      :items="items"
      :get-key="getKeyResolver"
      :get-children="(item) => item[childrenKey]"
      v-slot="{ flattenItems }"
  >
    <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
        v-slot="{ isExpanded, isSelected, isIndeterminate }"
        :class="cn(
        'group relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-accent',
        'data-[selected]:bg-accent data-[selected]:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'cursor-pointer'
      )"
        :style="{ paddingLeft: `${item.level * 1.5}rem` }"
        @select="(event) => {
        // Prevent selection for items with children (parents)
        if (item.hasChildren) {
            event.preventDefault()
        }
      }"
        @click="handleToggle(item)"
    >
      <component
          :is="isExpanded ? ChevronDown : ChevronRight"
          v-if="item.hasChildren"
          class="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground/80 transition-transform"
      />
      <span v-else class="h-4 w-4 shrink-0" />

      <slot
          name="item"
          :item="item.value"
          :expanded="isExpanded"
          :selected="isSelected"
          :indeterminate="isIndeterminate"
      >
        <component
            :is="item.value[iconKey]"
            v-if="item.value[iconKey]"
            class="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground"
            :class="{ 'text-accent-foreground': isSelected }"
        />

        <span class="truncate">
          {{ item.value[labelKey] }}
        </span>
      </slot>
    </TreeItem>
  </TreeRoot>
</template>
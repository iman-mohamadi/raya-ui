<script setup lang="ts" generic="TData">
import { computed, nextTick } from 'vue'
import { TreeRoot } from 'reka-ui'
import FileTreeNode from './FileTreeNode.vue'
import { injectFileTreeContext } from './context'
import type { FileExplorerIconResolver, FileExplorerItem, FileTreeNodeSlots } from './types'

const props = defineProps<{
  items: FileExplorerItem<TData>[]
  expanded: string[]
  /** Resolved items for the selected ids. Reka only reads them to set `aria-selected`. */
  selectedItems: FileExplorerItem<TData>[]
  multiple: boolean
  disabled: boolean
  getIcon?: FileExplorerIconResolver<TData>
}>()

const emit = defineEmits<{
  'update:expanded': [value: string[]]
}>()

defineSlots<FileTreeNodeSlots<TData>>()

const ctx = injectFileTreeContext()

const getKey = (item: FileExplorerItem<TData>) => item.id
// Folders report children (possibly empty) so Reka treats them as expandable,
// except leaf folders in a folders-only tree, which match FileTreeNode.
const getChildren = (item: FileExplorerItem<TData>) => {
  if (item.type !== 'folder') return undefined
  if (ctx.foldersOnly.value && !item.children?.length) return undefined
  return item.children ?? []
}

const modelValue = computed(() => (props.multiple ? props.selectedItems : props.selectedItems[0]))

const RANGE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'Home', 'End'])

function focusedItemId(): string | undefined {
  const active = document.activeElement
  const item = active instanceof HTMLElement ? active.closest<HTMLElement>('[role="treeitem"]') : null
  return item?.dataset.itemId
}

function onKeydown(event: KeyboardEvent) {
  if (!props.multiple) return

  if (event.shiftKey && RANGE_KEYS.has(event.key)) {
    // Reka moves focus on the next tick; extend the range once it has landed.
    nextTick(() => {
      const id = focusedItemId()
      if (id) ctx.extendSelection(id)
    })
    return
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
    event.preventDefault()
    ctx.selectAll()
  }
}
</script>

<template>
  <TreeRoot
    :items="items"
    :get-key="getKey"
    :get-children="getChildren"
    :model-value="modelValue"
    :multiple="multiple"
    :expanded="expanded"
    :disabled="disabled"
    data-slot="file-tree-tree"
    class="outline-none"
    @update:expanded="emit('update:expanded', $event)"
    @keydown="onKeydown"
  >
    <FileTreeNode
      v-for="(item, i) in items"
      :key="item.id"
      :item="item"
      :depth="0"
      :posinset="i + 1"
      :setsize="items.length"
      :get-icon="getIcon"
    >
      <template v-if="$slots.item" #item="scope">
        <slot name="item" v-bind="scope" />
      </template>
      <template v-if="$slots.icon" #icon="scope">
        <slot name="icon" v-bind="scope" />
      </template>
      <template v-if="$slots.label" #label="scope">
        <slot name="label" v-bind="scope" />
      </template>
      <template v-if="$slots.actions" #actions="scope">
        <slot name="actions" v-bind="scope" />
      </template>
    </FileTreeNode>
  </TreeRoot>
</template>

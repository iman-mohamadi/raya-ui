<script setup lang="ts" generic="TData">
import { computed, nextTick } from 'vue'
import { TreeRoot } from 'reka-ui'
import FileTreeNode from './FileTreeNode.vue'
import { injectFileTreeContext } from './context'
import type { FileManagerIconResolver, FileManagerItem } from './types'
import { isExpandableFolder } from './utils'

const props = defineProps<{
  items: FileManagerItem<TData>[]
  expanded: string[]
  /** Resolved items for the selected ids. Reka only reads them to set `aria-selected`. */
  selectedItems: FileManagerItem<TData>[]
  multiple: boolean
  disabled: boolean
  dir?: 'ltr' | 'rtl'
  getIcon?: FileManagerIconResolver<TData>
}>()

const emit = defineEmits<{
  'update:expanded': [value: string[]]
}>()

const ctx = injectFileTreeContext()

const getKey = (item: FileManagerItem<TData>) => item.id
// Expandable folders report children (possibly empty) so Reka offers to open
// them; the rule is shared with FileTreeNode.
const getChildren = (item: FileManagerItem<TData>) =>
  isExpandableFolder(item, { lazy: ctx.lazy.value, foldersOnly: ctx.foldersOnly.value }) ? item.children ?? [] : undefined

const modelValue = computed(() => (props.multiple ? props.selectedItems : props.selectedItems[0]))

const RANGE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'Home', 'End'])

function focusedItemId(): string | undefined {
  const active = document.activeElement
  const item = active instanceof HTMLElement ? active.closest<HTMLElement>('[role="treeitem"]') : null
  return item?.dataset.itemId
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'F2' || event.key === 'Delete') {
    const id = focusedItemId()
    if (id === undefined) return
    event.preventDefault()
    if (event.key === 'F2') ctx.startRename(id)
    else ctx.deleteFrom(id)
    return
  }

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
    :dir="dir"
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
    </FileTreeNode>
  </TreeRoot>
</template>

<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import {
  CollapsibleContent,
  CollapsibleRoot,
  TreeItem,
  type TreeItemSelectEvent,
  type TreeItemToggleEvent,
} from 'reka-ui'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerRenameInput from './FileExplorerRenameInput.vue'
import FileTreeNode from './FileTreeNode.vue'
import { injectFileTreeContext } from './context'
import type {
  FileExplorerIconResolver,
  FileExplorerItem,
  FileExplorerItemSlotProps,
  FileTreeNodeSlots,
} from './types'
import { getFileIcon, isFolder, splitByQuery } from './utils'
import { fileTreeIconVariants, fileTreeRowVariants } from './variants'

const props = defineProps<{
  item: FileExplorerItem<TData>
  /** Zero-based. */
  depth: number
  posinset: number
  setsize: number
  getIcon?: FileExplorerIconResolver<TData>
}>()

defineSlots<FileTreeNodeSlots<TData>>()

const ctx = injectFileTreeContext()

const folder = computed(() => isFolder(props.item))
const children = computed(() => props.item.children ?? [])
// In a folders-only tree, a folder without subfolders is a leaf, like Windows' navigation pane.
const expandable = computed(() => folder.value && (!ctx.foldersOnly.value || children.value.length > 0))
const isDragging = computed(() => ctx.dragDrop.draggingIds.value.includes(props.item.id))
const isDropTarget = computed(() => ctx.dragDrop.dropTargetId.value === props.item.id)
const renaming = computed(() => ctx.renamingId.value === props.item.id)

function slotProps(expanded: boolean, selected: boolean, disabled: boolean): FileExplorerItemSlotProps<TData> {
  return { item: props.item, depth: props.depth, expanded, selected, disabled }
}

function resolveIcon(state: FileExplorerItemSlotProps<TData>) {
  return props.getIcon?.(props.item, state) ?? getFileIcon(props.item, state)
}

function hasModifier(event: Event) {
  return event instanceof MouseEvent && (event.shiftKey || event.metaKey || event.ctrlKey)
}

// Selection is owned by FileTree (id-based, desktop-style), so Reka's
// default object-based handling is always prevented.
function onSelect(event: TreeItemSelectEvent<FileExplorerItem<TData>>) {
  event.preventDefault()
  ctx.onItemSelect(props.item.id, event.detail.originalEvent)
}

// Modifier clicks build a selection; they shouldn't also open folders. With
// `expandOnClick` off, only the chevron and the arrow keys open folders.
function onToggle(event: TreeItemToggleEvent<FileExplorerItem<TData>>) {
  const original = event.detail.originalEvent
  if (hasModifier(original) || (!ctx.expandOnClick.value && original instanceof MouseEvent))
    event.preventDefault()
}

function onContextMenu(event: MouseEvent) {
  // Nested treeitems contain each other; only the innermost one answers.
  if (!(event.target instanceof Element) || event.target.closest('[role="treeitem"]') !== event.currentTarget) return
  ctx.onItemContextMenu(props.item.id)
}

// Reka's TreeItem handles ArrowLeft/Right without checking the event target, so
// in a nested tree the key would bubble on and collapse every ancestor too.
function stopHorizontalArrowKeys(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.stopPropagation()
}

function onDragOver(event: DragEvent) {
  ctx.dragDrop.onDragOver(props.item.id, event)
  // The explorer's own handler treats unclaimed space as the root folder.
  event.stopPropagation()
}
</script>

<template>
  <TreeItem
    v-slot="{ isExpanded, isSelected, isDisabled, handleToggle }"
    :value="item"
    :level="depth + 1"
    :disabled="item.disabled"
    :aria-setsize="setsize"
    :aria-posinset="posinset"
    :data-item-id="item.id"
    data-slot="file-tree-item"
    :class="cn(
      'outline-none',
      '[&:focus-visible>[data-slot=file-tree-row]]:ring-2 [&:focus-visible>[data-slot=file-tree-row]]:ring-inset [&:focus-visible>[data-slot=file-tree-row]]:ring-ring/50',
    )"
    :style="{ '--file-tree-depth': depth }"
    @select="onSelect"
    @toggle="onToggle"
    @contextmenu="onContextMenu"
  >
    <div
      data-slot="file-tree-row"
      :class="fileTreeRowVariants({ size: ctx.size.value })"
      :data-selected="isSelected ? '' : undefined"
      :data-disabled="isDisabled ? '' : undefined"
      :data-dragging="isDragging ? '' : undefined"
      :data-drop-target="isDropTarget ? '' : undefined"
      :draggable="ctx.draggable.value && !isDisabled && !renaming ? 'true' : undefined"
      @dblclick="!isDisabled && ctx.onItemOpen(item.id)"
      @dragstart="ctx.dragDrop.onDragStart(item.id, $event)"
      @dragover="onDragOver"
      @drop.stop="ctx.dragDrop.onDrop($event)"
      @dragend="ctx.dragDrop.onDragEnd()"
    >
      <!-- Pointer-only affordance: keyboard users toggle with ArrowLeft/Right on the treeitem. -->
      <span
        v-if="expandable"
        aria-hidden="true"
        data-slot="file-tree-chevron"
        class="flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground/80 hover:text-foreground"
        @click.stop="!isDisabled && handleToggle()"
      >
        <ChevronRight
          :class="cn(
            'size-3.5 transition-transform duration-150 ease-out motion-reduce:transition-none',
            isExpanded ? 'rotate-90' : 'rtl:rotate-180',
          )"
        />
      </span>
      <span v-else aria-hidden="true" class="w-4 shrink-0" />

      <slot name="item" v-bind="slotProps(isExpanded, isSelected, isDisabled)">
        <slot name="icon" v-bind="slotProps(isExpanded, isSelected, isDisabled)">
          <component
            :is="resolveIcon(slotProps(isExpanded, isSelected, isDisabled))"
            aria-hidden="true"
            :class="fileTreeIconVariants({ size: ctx.size.value })"
          />
        </slot>
        <FileExplorerRenameInput
          v-if="renaming"
          :name="item.name"
          :is-folder="folder"
          :validate="name => ctx.validateRename(item.id, name)"
          class="-ms-1 h-5"
          @commit="name => ctx.commitRename(item.id, name)"
          @cancel="ctx.cancelRename(item.id)"
        />
        <slot v-else name="label" v-bind="slotProps(isExpanded, isSelected, isDisabled)" :query="ctx.query.value">
          <span class="min-w-0 truncate">
            <template v-for="(part, i) in splitByQuery(item.name, ctx.query.value)" :key="i">
              <mark v-if="part.match" class="rounded-[3px] bg-primary/20 text-inherit">{{ part.text }}</mark>
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
        </slot>
      </slot>

      <span
        v-if="$slots.actions"
        class="ms-auto flex shrink-0 items-center gap-1 ps-2 text-xs text-muted-foreground"
      >
        <slot name="actions" v-bind="slotProps(isExpanded, isSelected, isDisabled)" />
      </span>
    </div>

    <CollapsibleRoot v-if="expandable" :open="isExpanded" as-child>
      <CollapsibleContent
        as="ul"
        role="group"
        data-slot="file-tree-group"
        :class="cn(
          'relative overflow-hidden',
          'data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up duration-150 motion-reduce:animate-none',
          ctx.guides.value && 'before:pointer-events-none before:absolute before:inset-y-0 before:start-[calc(var(--file-tree-depth)_*_var(--file-tree-indent)_+_0.75rem_-_0.5px)] before:w-px before:bg-border',
        )"
        @keydown="stopHorizontalArrowKeys"
      >
        <FileTreeNode
          v-for="(child, i) in children"
          :key="child.id"
          :item="child"
          :depth="depth + 1"
          :posinset="i + 1"
          :setsize="children.length"
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
      </CollapsibleContent>
    </CollapsibleRoot>
  </TreeItem>
</template>

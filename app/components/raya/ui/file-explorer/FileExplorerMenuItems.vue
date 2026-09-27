<script setup lang="ts">
import { computed } from 'vue'
import { ContextMenuItem, ContextMenuSeparator, DropdownMenuItem, DropdownMenuSeparator } from 'reka-ui'
import type { FileExplorerAction } from './types'
import { fileExplorerMenuItem } from './variants'

const props = defineProps<{
  actions: FileExplorerAction[]
  /** Which Reka menu the items belong to. */
  kind: 'context' | 'dropdown'
}>()

const Item = computed(() => (props.kind === 'context' ? ContextMenuItem : DropdownMenuItem))
const Separator = computed(() => (props.kind === 'context' ? ContextMenuSeparator : DropdownMenuSeparator))

/** Consecutive actions of the same group, separated by a rule. */
const groups = computed(() => {
  const result: FileExplorerAction[][] = []
  for (const action of props.actions) {
    const last = result.at(-1)
    if (last && last[0]?.group === action.group) last.push(action)
    else result.push([action])
  }
  return result
})
</script>

<template>
  <template v-for="(group, index) in groups" :key="index">
    <component :is="Separator" v-if="index > 0" class="-mx-1 my-1 h-px bg-border" />
    <component
      :is="Item"
      v-for="action in group"
      :key="action.id"
      :disabled="action.disabled"
      :data-action="action.id"
      :data-destructive="action.destructive ? '' : undefined"
      :class="fileExplorerMenuItem"
      @select="action.run()"
    >
      <component :is="action.icon" aria-hidden="true" />
      <span class="flex-1 truncate">{{ action.label }}</span>
      <kbd v-if="action.shortcut" class="ms-4 font-sans text-xs tracking-widest text-muted-foreground">{{ action.shortcut }}</kbd>
    </component>
  </template>
</template>

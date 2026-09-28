<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { FileManagerIconResolver, FileManagerItem } from './types'
import { getFileIcon, getFileKind } from './utils'

const props = withDefaults(defineProps<{
  item: FileManagerItem<TData>
  size?: 'sm' | 'md'
  getIcon?: FileManagerIconResolver<TData>
}>(), {
  size: 'md',
})

const kind = computed(() => getFileKind(props.item))
const state = computed(() => ({ depth: 0, expanded: false, selected: false, disabled: Boolean(props.item.disabled) }))
const customIcon = computed(() => props.getIcon?.(props.item, state.value))
const icon = computed(() => customIcon.value ?? getFileIcon(props.item, state.value))
// A custom resolver always wins over the text badge.
const showBadge = computed(() => kind.value.badge !== undefined && customIcon.value === undefined)
</script>

<template>
  <span
    aria-hidden="true"
    data-slot="file-manager-file-icon"
    :class="cn(
      'inline-flex shrink-0 items-center justify-center rounded-md font-mono font-semibold leading-none',
      size === 'md' ? 'size-8 text-[11px] [&_svg]:size-4' : 'size-5 rounded-[5px] text-[8px] [&_svg]:size-3',
      kind.tone,
      item.type === 'folder' && 'bg-transparent ring-1 ring-inset ring-border',
    )"
  >
    <template v-if="showBadge">{{ kind.badge }}</template>
    <component :is="icon" v-else />
  </span>
</template>

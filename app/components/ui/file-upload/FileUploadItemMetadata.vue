<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()
const itemContext = inject<any>('FileUploadItemContext')!

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :class="cn('flex min-w-0 flex-1 flex-col gap-0.5', props.class)"
  >
    <p class="truncate text-sm font-medium">{{ itemContext.file.name }}</p>
    <p class="truncate text-xs text-muted-foreground">{{ formatBytes(itemContext.file.size) }}</p>
    <p v-if="itemContext.state.value?.error" class="text-xs text-destructive">{{ itemContext.state.value.error }}</p>
  </Primitive>
</template>
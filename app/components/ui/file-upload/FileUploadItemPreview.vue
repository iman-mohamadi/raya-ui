<script setup lang="ts">
import { inject, type HTMLAttributes, computed, toRaw } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { FileIcon, FileTextIcon, FileCodeIcon, FileArchiveIcon, FileVideoIcon, FileAudioIcon, FileCogIcon } from 'lucide-vue-next'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()
const itemContext = inject<any>('FileUploadItemContext')!
const rootContext = inject<any>('FileUploadContext')!

const file = itemContext.file

const isImage = computed(() => file.type.startsWith('image/'))
const imageUrl = computed(() => {
  if (!isImage.value) return null
  const rawFile = toRaw(file)
  if (!rootContext.urlCache.has(rawFile)) {
    rootContext.urlCache.set(rawFile, URL.createObjectURL(rawFile))
  }
  return rootContext.urlCache.get(rawFile)
})

function getIcon() {
  const type = file.type
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (type.startsWith('video/')) return FileVideoIcon
  if (type.startsWith('audio/')) return FileAudioIcon
  if (type.startsWith('text/') || ['txt', 'md', 'pdf'].includes(ext)) return FileTextIcon
  if (['zip', 'rar', '7z'].includes(ext)) return FileArchiveIcon
  if (['html', 'css', 'js', 'ts', 'json'].includes(ext)) return FileCodeIcon
  return FileIcon
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :class="cn('relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50', props.class)"
  >
    <img v-if="isImage" :src="imageUrl" :alt="file.name" class="size-full object-cover" />
    <component v-else :is="getIcon()" class="size-5 text-muted-foreground" />
    <slot />
  </Primitive>
</template>
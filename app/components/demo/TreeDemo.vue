<script setup lang="ts">
import { Tree } from '@/components/ui/tree'
import { Folder, File } from 'lucide-vue-next'

const items = [
  {
    id: '1',
    label: 'components',
    icon: Folder,
    children: [
      { id: '2', label: 'ui', icon: Folder },
      { id: '3', label: 'index.ts', icon: File },
    ]
  }
]
</script>

<template>
  <div class="flex items-center justify-center w-full h-full p-4">
    <div class="border rounded-lg bg-background/50 p-2 w-full max-w-[200px] text-sm sm:text-base">
      <Tree :items="items" />
    </div>
  </div>
</template>
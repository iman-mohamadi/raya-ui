<script setup lang="ts">
/**
 * A bare FileExplorer for end-to-end tests that the docs demo cannot cover,
 * such as very large folders. Routed at /__e2e/file-explorer in development, and
 * in builds made with E2E_HARNESS=1 (pnpm test:perf).
 *
 * Query: `count` (files in the "big" folder, default 5000), `view` (grid | list).
 */
import { computed, ref } from 'vue'
import { definePageMeta, useRoute } from '#imports'
import { FileExplorer, type FileExplorerItem, type FileExplorerView } from '@/components/raya/ui/file-explorer'

definePageMeta({ layout: false })

const route = useRoute()
const count = Math.max(0, Number(route.query.count ?? 5000) || 0)
const view = ref<FileExplorerView>(route.query.view === 'list' ? 'list' : 'grid')

const EXTENSIONS = ['ts', 'vue', 'png', 'pdf', 'md', 'json', 'mp4', 'zip']
const start = Date.UTC(2026, 0, 1)

const items = computed<FileExplorerItem[]>(() => [
  {
    id: 'big',
    name: 'big',
    type: 'folder',
    children: Array.from({ length: count }, (_, i) => ({
      id: `big/${i}`,
      name: `file-${String(i).padStart(5, '0')}.${EXTENSIONS[i % EXTENSIONS.length]}`,
      type: 'file' as const,
      size: 1_000 + ((i * 7919) % 5_000_000),
      modifiedAt: new Date(start - i * 60_000),
      owner: i % 3 ? 'You' : 'Ada',
    })),
  },
  { id: 'small', name: 'small', type: 'folder', children: [] },
])

const folder = ref<string | null>(null)
const selected = ref<string[]>([])
const opened = ref('')
const pasted = ref(0)
</script>

<template>
  <main class="h-screen bg-background p-4 text-foreground">
    <FileExplorer
      v-model:folder="folder"
      v-model:selected="selected"
      v-model:view="view"
      :items="items"
      :columns="['name', 'modified', 'owner', 'type', 'size']"
      draggable
      label="Harness files"
      class="h-full"
      @open="item => (opened = item.name)"
      @paste="() => { pasted++ }"
      @move="() => {}"
    />
    <output data-testid="state" class="sr-only">{{ JSON.stringify({ folder, selected: selected.length, opened, pasted }) }}</output>
  </main>
</template>

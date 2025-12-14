<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import FloatingDockIcon from './FloatingDockIcon.vue'

interface DockItem {
  title: string
  icon: any
  href: string
}

const props = defineProps<{
  items: DockItem[]
  class?: string
}>()

const mouseX = ref<number>(Infinity)
</script>

<template>
  <div
      :class="cn(
      'mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900',
      props.class
    )"
      @mousemove="(e) => mouseX = e.pageX"
      @mouseleave="() => mouseX = Infinity"
  >
    <FloatingDockIcon
        v-for="item in items"
        :key="item.title"
        :mouse-x="mouseX"
        :title="item.title"
        :icon="item.icon"
        :href="item.href"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { LayoutGrid } from 'lucide-vue-next' // Generic fallback icon
import { cn } from '@/lib/utils'

interface DockItem {
  title: string
  icon: any
  href: string
}

const props = defineProps<{
  items: DockItem[]
  class?: string
}>()

const open = ref(false)
</script>

<template>
  <div :class="cn('relative block md:hidden', props.class)">
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="open" class="absolute bottom-full mb-4 inset-x-0 flex flex-col gap-2 items-center">
        <a
            v-for="(item, idx) in items"
            :key="item.title"
            :href="item.href"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm"
        >
          <component :is="item.icon" class="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
        </a>
      </div>
    </Transition>

    <button
        @click="open = !open"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
    >
      <LayoutGrid class="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
    </button>
  </div>
</template>
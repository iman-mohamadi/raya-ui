<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Github, Book, Package, Image as ImageIcon, AudioLines } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const config = useAppConfig().enzoui
const route = useRoute()

// Navigation Data
const navGroups = [
  {
    title: 'Guide',
    icon: Book,
    items: [
      { label: 'Introduction', to: '/docs/introduction' },
      { label: 'Installation', to: '/docs/installation' },
    ]
  },
  {
    title: 'Components',
    icon: Package,
    items: [
      { label: 'Wheel Picker', to: '/docs/components/wheel-picker' },
      { label: 'Liquid Glass', to: '/docs/components/liquid-glass' },
      { label: 'Code Block', to: '/docs/components/code-block' },
      { label: 'Animated Tabs', to: '/docs/components/animated-tabs' },
      { label: 'Bar Visualizer', to: '/docs/components/bar-visualizer' },
      { label: 'Tree', to: '/docs/components/tree' },
    ]
  },
  {
    title: 'Backgrounds',
    icon: ImageIcon,
    items: [
      { label: 'Ambient Grid', to: '/docs/backgrounds/ambient-grid' },
      { label: 'Dotted Glow', to: '/docs/backgrounds/dotted-glow-background' },
      { label: 'Ripple Effect', to: '/docs/backgrounds/background-ripple-effect' },
    ]
  }
]

// --- Tracking Logic ---
const itemRefs = ref<Record<string, HTMLElement>>({})
const indicatorStyle = ref<Record<string, string>>({})

// Helper to set the indicator position
const setIndicator = (groupTitle: string, el: HTMLElement | null) => {
  if (!el) {
    // Hide if no target (shouldn't happen often)
    indicatorStyle.value[groupTitle] = `opacity: 0;`
    return
  }

  // Calculate center position: Item Top + (Item Height / 2) - (Indicator Height / 2)
  // We assume indicator height is ~16px based on styling
  const top = el.offsetTop + (el.offsetHeight / 2) - 8

  indicatorStyle.value[groupTitle] = `
    transform: translateY(${top}px);
    opacity: 1;
    height: 16px;
  `
}

// Hover Handler
const handleHover = (groupTitle: string, path: string) => {
  const el = itemRefs.value[`${groupTitle}-${path}`]
  if (el) setIndicator(groupTitle, el)
}

// Reset Handler (Go back to active route)
const handleLeave = (groupTitle: string, items: any[]) => {
  const activeItem = items.find(i => i.to === route.path)
  if (activeItem) {
    const el = itemRefs.value[`${groupTitle}-${activeItem.to}`]
    setIndicator(groupTitle, el)
  } else {
    // If no active item in this group, hide indicator
    indicatorStyle.value[groupTitle] = `opacity: 0;`
  }
}

// Initial Setup & Route Watcher
const updateAllIndicators = () => {
  navGroups.forEach(group => {
    handleLeave(group.title, group.items)
  })
}

onMounted(() => {
  // Wait for DOM
  nextTick(updateAllIndicators)
})

watch(() => route.path, () => {
  nextTick(updateAllIndicators)
})
</script>

<template>
  <div class="min-h-screen bg-black text-white selection:bg-white/20 font-sans">

    <header class="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
      <div class="container mx-auto flex h-14 items-center px-6">
        <NuxtLink to="/" class="mr-6 flex items-center space-x-2 font-bold text-xl tracking-tight">
          <div class="h-6 w-6 rounded bg-white text-black flex items-center justify-center text-xs font-black">E</div>
          <span>{{ config?.name || 'EnzOUi' }}</span>
        </NuxtLink>
        <div class="flex flex-1 justify-end">
          <a :href="config?.github" target="_blank">
            <Button variant="ghost" size="icon" class="text-zinc-400 hover:text-white"><Github class="h-5 w-5" /></Button>
          </a>
        </div>
      </div>
    </header>

    <div class="container mx-auto flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] gap-10 px-6">

      <aside class="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 py-8 pr-6 md:sticky md:block overflow-y-auto">
        <nav class="space-y-8">

          <div v-for="group in navGroups" :key="group.title">
            <div class="mb-3 flex items-center gap-2 px-1 text-sm font-semibold text-white/90">
              <component :is="group.icon" class="h-4 w-4 text-zinc-400" />
              {{ group.title }}
            </div>

            <div
                class="relative border-l border-zinc-800/50 ml-3"
                @mouseleave="handleLeave(group.title, group.items)"
            >
              <div
                  class="absolute left-[-1.5px] w-[3px] rounded-full bg-white transition-all duration-300 ease-out"
                  :style="indicatorStyle[group.title] || 'opacity: 0;'"
              ></div>

              <NuxtLink
                  v-for="item in group.items"
                  :key="item.to"
                  :to="item.to"
                  :ref="(el) => { if(el) itemRefs[`${group.title}-${item.to}`] = el.$el }"
                  @mouseenter="handleHover(group.title, item.to)"
                  class="
                  group flex w-full items-center pl-4 pr-2 py-2
                  text-sm text-zinc-400
                  transition duration-200
                  hover:text-zinc-50
                    hover:translate-x-[3px]
                "
                  active-class="!text-white font-medium"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

        </nav>
      </aside>

      <main class="relative py-10 max-w-4xl min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbar for Sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}
</style>
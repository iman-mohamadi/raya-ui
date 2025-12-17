<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Github, Book, Package, Image as ImageIcon, Menu, ChevronDown } from 'lucide-vue-next'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const config = useAppConfig().raya
const route = useRoute()

// --- Mobile Menu State ---
const isMobileMenuOpen = ref(false)

// Close mobile menu when route changes
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

const navGroups = [
  {
    title: 'Components',
    icon: Package,
    items: [
      { label: 'Encrypted Text', to: '/docs/components/encrypted-text' },
      { label: 'Animated Input', to: '/docs/components/animated-input' },
      { label: 'Code Block', to: '/docs/components/code-block' },
      { label: 'Bar Visualizer', to: '/docs/components/bar-visualizer' },
      { label: 'Animated Tabs', to: '/docs/components/animated-tabs' },
      { label: 'Floating Dock', to: '/docs/components/floating-dock' },
      { label: 'Morphing Text', to: '/docs/components/morphing-text' },
      { label: 'Pixelated Button', to: '/docs/components/pixelated-button' },
      { label: 'Raya Button', to: '/docs/components/raya-button' },
      { label: 'Liquid Glass', to: '/docs/components/liquid-glass' },
      { label: 'Tree', to: '/docs/components/tree' },
      { label: 'Wheel Picker', to: '/docs/components/wheel-picker' },
    ]
  },
  {
    title: 'Backgrounds',
    icon: ImageIcon,
    items: [
      { label: 'Ambient Grid', to: '/docs/backgrounds/ambient-grid' },
      { label: 'Background Beams', to: '/docs/backgrounds/background-beams' },
      { label: 'Dotted Glow', to: '/docs/backgrounds/dotted-glow-background' },
      { label: 'Gravity Stars', to: '/docs/backgrounds/gravity-stars' },
      { label: 'Ripple Effect', to: '/docs/backgrounds/background-ripple-effect' },
    ]
  },
  {
    title: 'Guide',
    icon: Book,
    items: [
      { label: 'Installation', to: '/docs/installation' },
      { label: 'Introduction', to: '/docs/introduction' },
    ]
  }
]


const sortedNavGroups = computed(() => {
  return [...navGroups]
      .sort((a, b) => {
        // Guide always on top
        if (a.title === 'Guide') return -1
        if (b.title === 'Guide') return 1

        // Alphabetical for the rest
        return a.title.localeCompare(b.title)
      })
      .map(group => ({
        ...group,
        items: [...group.items].sort((a, b) =>
            a.label.localeCompare(b.label)
        )
      }))
})


// --- Tracking Logic (Desktop) ---
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
  sortedNavGroups.value.forEach(group => {
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
  <div class="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative">
    <AppNav :showDoc="false"/>

    <div class="container mx-auto flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] gap-10 px-6">

      <div class="md:hidden absolute top-4 z-200 right-13">
        <Sheet v-model:open="isMobileMenuOpen">
          <SheetTrigger as-child>
            <RayaButton variant="ghost" color="neutral" size="icon" class="size-8">
              <Menu class="h-4 w-4" />
            </RayaButton>
          </SheetTrigger>
          <SheetContent side="left" class="bg-black border-r border-white/10 text-white w-[80%] sm:w-[350px] p-0">
            <ScrollArea class="h-full px-6 py-6">
              <SheetHeader class="mb-6 text-left">
                <SheetTitle class="text-white">Documentation</SheetTitle>
              </SheetHeader>

              <nav class="space-y-6">
                <Collapsible
                    v-for="group in sortedNavGroups"
                    :key="group.title"
                    :default-open="true"
                    class="group/collapsible"
                >
                  <CollapsibleTrigger class="flex w-full items-center justify-between mb-3 px-1 text-sm font-semibold text-white/90">
                    <div class="flex items-center gap-2">
                      <component :is="group.icon" class="h-4 w-4 text-zinc-400" />
                      {{ group.title }}
                    </div>
                    <ChevronDown class="h-4 w-4 text-zinc-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div class="flex flex-col space-y-1 ml-3 border-l border-zinc-800/50 pl-3">
                      <NuxtLink
                          v-for="item in group.items"
                          :key="item.to"
                          :to="item.to"
                          class="text-sm text-zinc-400 transition hover:text-white py-1"
                          active-class="!text-white font-medium"
                      >
                        {{ item.label }}
                      </NuxtLink>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <aside class="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <ScrollArea class="h-full pr-6 py-8">
          <nav class="space-y-8">

            <Collapsible
                v-for="group in sortedNavGroups"
                :key="group.title"
                :default-open="true"
                class="group/collapsible"
            >
              <CollapsibleTrigger class="flex w-full items-center justify-between mb-3 px-1 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                <div class="flex items-center gap-2">
                  <component :is="group.icon" class="h-4 w-4 text-zinc-400" />
                  {{ group.title }}
                </div>
                <ChevronDown class="h-4 w-4 text-zinc-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>

              <CollapsibleContent>
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
              </CollapsibleContent>
            </Collapsible>

          </nav>
        </ScrollArea>
      </aside>

      <main class="relative py-10 max-w-4xl min-w-0 w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

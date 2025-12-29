<script setup lang="ts">
import {ref, onMounted, nextTick, watch, computed} from 'vue'
import {useRoute} from 'vue-router'
import {Book, Package, Image as ImageIcon} from 'lucide-vue-next'
import Divider from "~/components/Divider.vue";

const route = useRoute()

const navGroups = [
  {
    title: 'Components',
    icon: Package,
    items: [
      {label: 'Encrypted Text', to: '/docs/components/encrypted-text'},
      {label: 'Animated Input', to: '/docs/components/animated-input'},
      {label: 'Animated Background', to: '/docs/components/animated-background'},
      {label: 'Code Block', to: '/docs/components/code-block'},
      {label: 'Bar Visualizer', to: '/docs/components/bar-visualizer'},
      {label: 'Animated Tabs', to: '/docs/components/animated-tabs'},
      {label: 'Floating Dock', to: '/docs/components/floating-dock'},
      {label: 'Morphing Text', to: '/docs/components/morphing-text'},
      {label: 'Pixelated Button', to: '/docs/components/pixelated-button'},
      {label: 'Raya Button', to: '/docs/components/raya-button'},
      {label: 'Liquid Glass', to: '/docs/components/liquid-glass'},
      {label: 'Tree', to: '/docs/components/tree'},
      {label: 'Wheel Picker', to: '/docs/components/wheel-picker'},
    ]
  },
  {
    title: 'Backgrounds',
    icon: ImageIcon,
    items: [
      {label: 'Ambient Grid', to: '/docs/backgrounds/ambient-grid'},
      {label: 'Background Beams', to: '/docs/backgrounds/background-beams'},
      {label: 'Dotted Glow', to: '/docs/backgrounds/dotted-glow-background'},
      {label: 'Gravity Stars', to: '/docs/backgrounds/gravity-stars'},
      {label: 'Ripple Effect', to: '/docs/backgrounds/background-ripple-effect'},
      {label: 'Snow Effect', to: '/docs/backgrounds/snow-effect'},
    ]
  },
  {
    title: 'Guide',
    icon: Book,
    items: [
      {label: 'Installation', to: '/docs/installation'},
      {label: 'Introduction', to: '/docs/introduction'},
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
  <div class="">
    <AppNav :showDoc="false" :sortedNavGroups="sortedNavGroups"/>
    <div class="container mx-auto border-x min-h-dvh pt-14">
      <Divider/>
      <!--  TODO    -->
      <!--   a navigation here for all pages with a link to go back to components page in the left side and two button in the right side   -->
      <!--   one button should go to previous component and other one goes to next component if next or perv is not avilable hide the button    -->
      <main>
        <slot/>
      </main>
    </div>
  </div>
</template>

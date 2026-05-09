<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Home', path: '/' },
      { title: 'Introduction', path: '/docs/introduction' },
      { title: 'Installation', path: '/docs/installation' },
    ]
  },
  {
    title: 'Backgrounds & Shaders',
    items: [
      { title: 'Ambient Grid', path: '/docs/backgrounds/ambient-grid' },
      { title: 'Background Beams', path: '/docs/backgrounds/background-beams' },
      { title: 'Background Ripple', path: '/docs/backgrounds/background-ripple-effect' },
      { title: 'Dotted Glow', path: '/docs/backgrounds/dotted-glow-background' },
      { title: 'Gravity Stars', path: '/docs/backgrounds/gravity-stars' },
      { title: 'Snow Effect', path: '/docs/backgrounds/snow-effect' },
    ]
  },
  {
    title: 'Components',
    items: [
      { title: 'Animated Background', path: '/docs/components/animated-background' },
      { title: 'Animated Input', path: '/docs/components/animated-input' },
      { title: 'Animated Tabs', path: '/docs/components/animated-tabs' },
      { title: 'Animated Theme Toggler', path: '/docs/components/animated-theme-toggler' },
      { title: 'Bar Visualizer', path: '/docs/components/bar-visualizer' },
      { title: 'Code Block', path: '/docs/components/code-block' },
      { title: 'Encrypted Text', path: '/docs/components/encrypted-text' },
      { title: 'File Upload', path: '/docs/components/file-upload' },
      { title: 'Flip Clock', path: '/docs/components/flip-clock' },
      { title: 'Floating Dock', path: '/docs/components/floating-dock' },
      { title: 'Glowing Effect', path: '/docs/components/glowing-effect' },
      { title: 'Liquid Glass', path: '/docs/components/liquid-glass' },
      { title: 'Magnetic', path: '/docs/components/magnetic' },
      { title: 'Marquee', path: '/docs/components/marquee' },
      { title: 'Morphing Text', path: '/docs/components/morphing-text' },
      { title: 'Partition Bar', path: '/docs/components/partition-bar' },
      { title: 'Persian Date Picker', path: '/docs/components/persian-date-picker' },
      { title: 'Pixelated Button', path: '/docs/components/pixelated-button' },
      { title: 'Raya Button', path: '/docs/components/raya-button' },
      { title: 'Scroll Spy', path: '/docs/components/scroll-spy' },
      { title: 'Tree', path: '/docs/components/tree' },
      { title: 'Wheel Picker', path: '/docs/components/wheel-picker' },
    ]
  }
]
</script>

<template>
  <nav class="relative z-30 flex flex-col gap-1 px-3 pt-15 pb-32 h-full overflow-y-auto no-scrollbar top-5">

    <div v-for="group in navigation" :key="group.title" class="flex flex-col gap-0 mb-2">

      <!-- Category Header & Badge -->
      <!-- Updated to use text-muted-foreground from the theme -->
      <span class="px-0 py-4 text-base font-medium text-muted-foreground flex justify-baseline gap-2">
        {{ group.title }}
        <!-- Using opacity to soften the badge text instead of explicit colors -->
        <span class="text-xs font-normal tabular-nums opacity-60">{{ group.items.length }}</span>
      </span>

      <!-- The Links -->
      <NuxtLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          custom
          v-slot="{ href, navigate, isExactActive }"
      >
        <div class="relative group cursor-pointer" @click="navigate">

          <!-- ========================================== -->
          <!-- RULER TICKS (Theme Adapted)                -->
          <!-- ========================================== -->
          <!-- Active Line: Uses primary color and drops a subtle primary shadow -->
          <!-- Hover Line: Uses the foreground color (pure black/white depending on theme) -->
          <span
              class="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[1.8px] rounded-full z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-left"
              :class="isExactActive
              ? 'w-[30px] opacity-100 bg-primary shadow-md shadow-primary/30'
              : 'w-0 opacity-0 bg-foreground group-hover:w-[24px] group-hover:opacity-100'"
          ></span>

          <!-- Center Tick (Fades out when active) -->
          <span
              class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-px bg-muted-foreground/50 transition-all duration-300"
              :style="{ width: isExactActive ? '0px' : '18px' }"
          ></span>

          <!-- Top, Quarter, and Three-Quarter Ticks -->
          <span class="pointer-events-none absolute w-[13px] left-0 top-1/4 h-px bg-muted-foreground/30"></span>
          <span class="pointer-events-none absolute w-[16px] left-0 top-0 h-px bg-muted-foreground/30"></span>
          <span class="pointer-events-none absolute w-[13px] left-0 top-3/4 h-px bg-muted-foreground/30"></span>


          <!-- ========================================== -->
          <!-- ELASTIC TEXT WRAPPER                       -->
          <!-- ========================================== -->
          <div
              class="origin-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              :class="isExactActive
              ? 'translate-x-[8px] opacity-100'
              : 'opacity-60 group-hover:translate-x-[8px] group-hover:opacity-100'"
          >
            <NuxtLink :to="href" class="relative flex items-center pl-8 pr-3 py-0.5 select-none">
              <span
                  class="text-base truncate transition-colors duration-300 text-foreground"
                  :class="isExactActive ? 'font-medium' : ''"
              >
                {{ item.title }}
              </span>
            </NuxtLink>
          </div>

        </div>
      </NuxtLink>

    </div>
  </nav>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
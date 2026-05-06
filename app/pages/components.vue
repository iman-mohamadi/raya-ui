<script lang="ts" setup>
import {computed} from 'vue'
import {Motion} from 'motion-v'
import {useNavigationStore} from "~/stores/navigation"

// Import background components for live previews
import AmbientGrid from '@/components/ui/ambient-grid/AmbientGrid.vue'
import BackgroundBeams from '@/components/ui/background-beams/BackgroundBeams.vue'
import DottedGlowBackground from '@/components/ui/dotted-glow-background/DottedGlowBackground.vue'
import GravityStars from '@/components/ui/gravity-stars/GravityStars.vue'
import BackgroundRippleEffect from '@/components/ui/background-ripple-effect/BackgroundRippleEffect.vue'
import SnowEffect from '@/components/ui/snow-effect/SnowEffect.vue'

const navStore = useNavigationStore()

// Filter out Guide to focus on UI Primitives
const groups = computed(() => {
  return navStore.navGroups.filter(g => g.title !== 'Guide')
})

// Component mapping for dynamic previews
const backgroundComponents: Record<string, any> = {
  'Ambient Grid': AmbientGrid,
  'Background Beams': BackgroundBeams,
  'Dotted Glow': DottedGlowBackground,
  'Gravity Stars': GravityStars,
  'Ripple Effect': BackgroundRippleEffect,
  'Snow Effect': SnowEffect,
}
</script>

<template>
  <div class="max-w-7xl mx-auto">

    <!-- Header Section -->
    <header class="mb-16">
      <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-4">
        Inventory
      </div>
      <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
        Components
      </h1>
      <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
        Expertly crafted, high-performance primitives powered by **Tailwind**, **Reka UI**, and **Vue**.
        Copy, paste, and make them yours.
      </p>
    </header>

    <!-- Components Groups -->
    <div v-for="group in groups" :key="group.title" class="mb-24">

      <!-- Group Title with minimal separator -->
      <div class="flex items-center gap-4 mb-10">
        <h2 class="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground whitespace-nowrap">
          {{ group.title }}
        </h2>
        <div class="h-px flex-1 bg-border/50"/>
      </div>

      <!-- Component Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
            v-for="(item, index) in group.items"
            :key="item.to"
            class="contents"
        >
          <ClientOnly>
            <Motion
                :in-view="{ opacity: 1, y: 0 }"
                :initial="{ opacity: 0, y: 20 }"
                :transition="{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
            >
              <NuxtLink
                  :to="item.to"
                  class="group flex flex-col h-full rounded-[2rem] border border-border/50 bg-muted/10 overflow-hidden hover:bg-muted/20 hover:border-primary/20 transition-all duration-500"
              >
                <!-- Live Preview / Thumbnail Area -->
                <div
                    class="aspect-[4/3] relative flex items-center justify-center overflow-hidden bg-background/50 border-b border-border/30">

                  <!-- Live Background Rendering -->
                  <ClientOnly v-if="!item.img && backgroundComponents[item.label]">
                    <component
                        :is="backgroundComponents[item.label]"
                        class="absolute inset-0 z-0 opacity-80"
                        v-bind="item.label === 'Gravity Stars' ? { starsCount: 40 } : {}"
                    />
                  </ClientOnly>

                  <!-- Static Image for complex components -->
                  <NuxtImg
                      v-else-if="item.img"
                      :alt="item.label"
                      :src="item.img"
                      class="w-full h-full object-cover mix-blend-normal group-hover:scale-105 transition-transform duration-700"
                  />

                  <!-- Placeholder for components without preview yet -->
                  <div v-else class="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                    No Preview
                  </div>

                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"/>
                </div>

                <!-- Info Area -->
                <div class="p-6 flex flex-col flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                      {{ item.label }}
                    </span>
                    <ArrowRight
                        class="size-3 text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"/>
                  </div>
                  <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {{ item.description }}
                  </p>
                </div>
              </NuxtLink>
            </Motion>
          </ClientOnly>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.tracking-tighter {
  letter-spacing: -0.05em;
}
</style>
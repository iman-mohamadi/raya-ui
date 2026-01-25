<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationStore } from "~/stores/navigation";

// Import your background components
import AmbientGrid from '@/components/ui/ambient-grid/AmbientGrid.vue'
import BackgroundBeams from '@/components/ui/background-beams/BackgroundBeams.vue'
import DottedGlowBackground from '@/components/ui/dotted-glow-background/DottedGlowBackground.vue'
import GravityStars from '@/components/ui/gravity-stars/GravityStars.vue'
import BackgroundRippleEffect from '@/components/ui/background-ripple-effect/BackgroundRippleEffect.vue'
import SnowEffect from '@/components/ui/snow-effect/SnowEffect.vue'

definePageMeta({layout: 'docs'})

const navStore = useNavigationStore()

const groups = computed(() => {
  return navStore.navGroups.filter(g => g.title !== 'Guide')
})

// Map the navigation labels to the actual components
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
  <div>
    <PageTitle
        title="Shadcn components"
        subtitle="Build, customise, ship, repeat"
        description="Copy and paste expertly crafted, fully customisable, responsive, components, powered by shadcn-vue, Tailwind & Vue."
    />
    <Divider/>

    <div class="relative" v-for="group in groups" :key="group.title">
      <div class="row-line py-4 text-primary text-lg">
        {{group.title}}
      </div>
      <div class="blocks-list-grid-lines">
        <div class="col-line line-1"></div>
        <div class="col-line line-2"></div>
        <div class="col-line line-3"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-g">
        <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="group row-line"
        >
          <div class="bg-background aspect-390/200 overflow-hidden relative flex items-center justify-center p-6 transition-all duration-500 ease-out wrapper-line-after">

            <component
                v-if="!item.img && backgroundComponents[item.label]"
                :is="backgroundComponents[item.label]"
                class="absolute z-10 w-full h-full"
            />

            <NuxtImg
                v-else-if="item.img"
                :src="item.img"
                :alt="item.label"
                class="w-full object-center mix-blend-exclusion"
            />
          </div>

          <div class="pl-m py-2 before:hidden pb-8 block">
            <p class="text-sm text-foreground first-letter:uppercase font-medium group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
              {{ item.label }}
            </p>
            <p class="text-xs text-muted-foreground font-mono truncate pr-2">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </div>
      <div class="h-g"></div>
    </div>
  </div>
</template>
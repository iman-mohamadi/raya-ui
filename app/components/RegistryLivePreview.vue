<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import WireframeThumbnail from '~/components/WireframeThumbnail.vue'

const props = withDefaults(defineProps<{ component: string; color?: string }>(), {
  color: 'var(--primary)',
})

// Lazily loaded so they stay out of the critical bundle and only spin up
// on the client (inside <ClientOnly>), keeping SSR + ScrollTrigger stable.
const Magnetic = defineAsyncComponent(() => import('~/components/ui/magnetic/Magnetic.vue'))
const BarVisualizer = defineAsyncComponent(() => import('~/components/ui/bar-visualizer/BarVisualizer.vue'))
const GlowingEffect = defineAsyncComponent(() => import('~/components/ui/glowing-effect/GlowingEffect.vue'))
const MorphingText = defineAsyncComponent(() => import('~/components/ui/morphing-text/MorphingText.vue'))
const LiquidGlass = defineAsyncComponent(() => import('~/components/ui/liquid-glass/LiquidGlass.vue'))

const LIVE = new Set(['Magnetic', 'Bar Visualizer', 'Glowing Effect', 'Morphing Text', 'Liquid Glass'])
const isLive = computed(() => LIVE.has(props.component))
</script>

<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden">
    <ClientOnly v-if="isLive">
      <Magnetic v-if="component === 'Magnetic'" :range="130" :intensity="0.85">
        <div
            class="size-14 rounded-full flex items-center justify-center font-mono text-[8px] tracking-[0.25em] uppercase border cursor-none"
            :style="{ color, borderColor: color }"
        >
          Pull
        </div>
      </Magnetic>

      <BarVisualizer
          v-else-if="component === 'Bar Visualizer'"
          demo
          state="speaking"
          :bar-count="13"
          center-align
          class="bg-transparent h-20 w-full p-0"
      />

      <div
          v-else-if="component === 'Glowing Effect'"
          class="relative w-32 h-20 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center"
      >
        <GlowingEffect :glow="true" :disabled="false" :spread="42" :proximity="150" :blur="2" :border-width="2" />
        <span class="font-mono text-[8px] tracking-[0.25em] uppercase text-white/40">Hover</span>
      </div>

      <MorphingText
          v-else-if="component === 'Morphing Text'"
          :texts="['Copy', 'Paste', 'Own']"
          class="text-3xl h-14 text-white"
      />

      <div v-else-if="component === 'Liquid Glass'" class="relative w-36 h-20 flex items-center justify-center">
        <div class="absolute left-2 top-1 size-10 rounded-full blur-xl" :style="{ background: color, opacity: 0.5 }" />
        <div class="absolute right-3 bottom-1 size-8 rounded-full bg-primary/40 blur-xl" />
        <LiquidGlass :radius="16" :scale="-140" class="w-28 h-14 flex items-center justify-center">
          <span class="font-mono text-[8px] tracking-[0.25em] uppercase text-white/70">Glass</span>
        </LiquidGlass>
      </div>

      <template #fallback>
        <WireframeThumbnail :component="component" />
      </template>
    </ClientOnly>

    <WireframeThumbnail v-else :component="component" />
  </div>
</template>

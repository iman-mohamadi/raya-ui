<script lang="ts" setup>
import {Plus} from 'lucide-vue-next'
import {Motion} from 'motion-v'
import {GravityStars} from '@/components/ui/gravity-stars'
import MorphingText from '@/components/ui/morphing-text/MorphingText.vue'
import RayaButton from '@/components/ui/raya-button/RayaButton.vue'
import FaqSection from "~/components/landing/FaqSection.vue"

definePageMeta({layout: 'default'})

const appConfig = useAppConfig()
const version = appConfig.raya?.version || '1.0.0'

const heroWords = ["RAYA", "ENGINE", "VISION", "OWNED"]

const features = [
  {id: '01', title: 'LATENCY', desc: 'Zero runtime overhead. Optimized Nuxt 4 macros.'},
  {id: '02', title: 'ATOMIC', desc: 'Modular core for high-density dashboards.'},
  {id: '03', title: 'ACCESS', desc: 'WAI-ARIA compliance via Reka UI primitives.'}
]
</script>

<template>
  <div class="relative text-foreground overflow-x-hidden">

    <!-- --- ARCHITECT HERO --- -->
    <section class="relative min-h-screen flex flex-col lg:flex-row border-b border-border">

      <!-- Left Side: Sharp Typography -->
      <div class="flex-1 flex flex-col justify-center p-8 md:p-16 lg:border-r border-border relative z-10">
        <ClientOnly>
          <Motion
              :animate="{ opacity: 1, x: 0 }"
              :initial="{ opacity: 0, x: -50 }"
              :transition="{ duration: 1, ease: [0.19, 1, 0.22, 1] }"
              class="space-y-12"
          >
            <div class="flex items-center gap-4">
              <div
                  class="size-12 bg-foreground flex items-center justify-center text-background font-black text-xl italic">
                R
              </div>
              <div class="text-[10px] font-black tracking-[0.4em] uppercase opacity-50">Build.v{{ version }}</div>
            </div>

            <div class="space-y-2">
              <h1 class="text-[12vw] lg:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase italic">
                Atomic <br/>
                <span class="text-primary italic">Design</span>
              </h1>
              <div class="h-24 flex items-center">
                <MorphingText :texts="heroWords"
                              class="text-4xl font-bold tracking-widest text-muted-foreground uppercase"/>
              </div>
            </div>

            <p class="max-w-md text-lg text-muted-foreground leading-tight font-medium">
              A specialized collection of copy-paste components for the modern engineer. Built with Vue, Nuxt, and
              absolute precision.
            </p>

            <div class="flex flex-wrap gap-4 pt-8">
              <NuxtLink to="/docs/installation">
                <RayaButton
                    class="h-16 px-12 rounded-none bg-foreground text-background font-black uppercase tracking-widest hover:translate-y-[-4px] transition-transform">
                  Get Started
                </RayaButton>
              </NuxtLink>
              <NuxtLink to="/docs/components/tree">
                <RayaButton class="h-16 px-12 rounded-none border-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
                            variant="outline">
                  Library
                </RayaButton>
              </NuxtLink>
            </div>
          </Motion>
        </ClientOnly>
      </div>

      <!-- Right Side: The Simulation Container -->
      <div class="flex-1 relative min-h-[400px] lg:min-h-screen bg-muted/5">
        <GravityStars
            :gravity-strength="40"
            :mouse-influence="200"
            :stars-count="80"
            class="absolute inset-0 z-0"
            mouse-gravity="attract"
        />
        <!-- Overlay Stats -->
        <div class="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10 pointer-events-none">
          <div class="font-mono text-[10px] space-y-1 opacity-40 uppercase tracking-widest">
            <div>Phys_Engine: Active</div>
            <div>Context: Vue_3.5_Stable</div>
            <div>Primitives: Reka_UI</div>
          </div>
          <div
              class="size-32 border border-foreground/10 rounded-full flex items-center justify-center animate-spin-slow">
            <Plus class="size-4 opacity-20"/>
          </div>
        </div>
      </div>
    </section>

    <!-- --- THE SPECIFICATION (Features) --- -->
    <section class="py-0 border-b border-border">
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div
            v-for="(feature, index) in features"
            :key="index"
            class="p-12 border-b md:border-b-0 md:border-r border-border group hover:bg-foreground hover:text-background transition-colors duration-700"
        >
          <div class="flex flex-col gap-12">
            <span class="font-mono text-xs opacity-50">{{ feature.id }}</span>
            <div class="space-y-4">
              <h3 class="text-3xl font-black italic tracking-tighter uppercase">{{ feature.title }}</h3>
              <p class="text-sm font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                {{ feature.desc }}
              </p>
            </div>
            <Plus class="size-5 opacity-20 group-hover:rotate-90 transition-transform"/>
          </div>
        </div>
      </div>
    </section>

    <!-- --- FULL WIDTH CTA --- -->
    <section class="relative py-40 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-10 pointer-events-none skew-y-12 scale-150">
        <div class="grid grid-cols-10 gap-4 w-full h-full">
          <div v-for="i in 100" :key="i" class="aspect-square border border-foreground/20"/>
        </div>
      </div>

      <Motion
          :in-view="{ opacity: 1, scale: 1 }"
          :initial="{ opacity: 0, scale: 0.9 }"
          class="relative z-10 space-y-12"
      >
        <h2 class="text-[10vw] font-black leading-none uppercase italic tracking-tighter">
          Stop <br/> Building <br/> Junk.
        </h2>
        <NuxtLink to="/docs/installation">
          <RayaButton
              class="h-20 px-20 bg-primary text-white font-black text-xl uppercase tracking-tighter italic hover:scale-105 transition-transform">
            Initialize Raya_UI
          </RayaButton>
        </NuxtLink>
      </Motion>
    </section>

    <!-- --- FOOTER INTEL --- -->
    <section class="p-8 md:p-16 border-t border-border bg-muted/10">
      <div class="container max-w-4xl mx-auto">
        <div class="flex flex-col gap-16">
          <div class="flex justify-between items-start">
            <h2 class="text-xs font-black tracking-[0.8em] uppercase opacity-30">Common_Inquiries</h2>
            <div class="font-mono text-[10px] opacity-20">0X44 // 2026</div>
          </div>
          <FaqSection/>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 12s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Github, Copy, Check, ArrowRight, Zap, Layers, Smartphone } from 'lucide-vue-next'
import { useMouse, useWindowSize } from '@vueuse/core'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { AmbientGrid } from '@/components/ui/ambient-grid'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { Button } from '@/components/ui/button'

const config = useAppConfig().raya
const { x, y } = useMouse()
const { width, height } = useWindowSize()

// --- Installation Copy Logic ---
const copied = ref(false)
const installCmd = `npx shadcn-vue@latest add ${config.baseUrl}/tree.json`
const copyInstall = () => {
  navigator.clipboard.writeText(installCmd)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

// --- Demo Data for the Hero Dashboard ---
const tabs = [
  { label: 'Design', icon: Layers },
  { label: 'Code', icon: Zap },
  { label: 'Mobile', icon: Smartphone }
]
const activeTab = ref(0)
const hours = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }))
const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))
const timeState = ref({ hour: 10, minute: 10 })

// --- Parallax Logic ---
const cardTransform = computed(() => {
  if (width.value < 1024) return ''
  // Calculate subtle rotation based on mouse position relative to center
  const rotateX = (y.value - height.value / 2) / 40
  const rotateY = (x.value - width.value / 2) / 40
  return `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`
})
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white selection:bg-teal-500/30 font-sans">

    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      <div class="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]"></div>
    </div>

    <div class="absolute inset-0 z-0 opacity-40">
      <AmbientGrid :grid-size="40" color1="#14b8a6" color2="#0f172a" :interactive="true" />
    </div>

    <div class="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
      <BackgroundRippleEffect :cell-size="60" :interactive="true" fill />
    </div>

    <header class="container relative z-50 mx-auto flex h-20 items-center justify-between px-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 text-black font-black text-lg shadow-[0_0_15px_rgba(20,184,166,0.5)]">
          R
        </div>
        <span class="text-xl font-bold tracking-tight text-white">{{ config.name }}</span>
      </NuxtLink>
      <div class="flex items-center gap-6">
        <NuxtLink to="/docs/introduction" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Docs</NuxtLink>
        <NuxtLink to="/docs/components/liquid-glass" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Components</NuxtLink>
        <div class="h-4 w-[1px] bg-white/20 hidden sm:block"></div>
        <a :href="config?.github" target="_blank" class="text-zinc-400 hover:text-white transition-colors">
          <Github class="h-5 w-5" />
        </a>
      </div>
    </header>

    <main class="relative z-10 container mx-auto px-6 pt-12 lg:pt-20 pb-20">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <div class="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">

          <div class="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs font-medium text-teal-300 backdrop-blur-md shadow-[0_0_10px_rgba(20,184,166,0.2)] mx-auto lg:mx-0">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>Based on Persian Design System</span>
          </div>

          <div class="space-y-4">
            <h1 class="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Craft UI with <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-blue-500 drop-shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                Liquid Precision.
              </span>
            </h1>
            <p class="text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              <strong class="text-teal-400">Raya</strong> (رایا) brings fluid physics, glassmorphism, and
              interactive depth to your Vue applications.
              Copy-paste, fully accessible, and stunningly fast.
            </p>
          </div>

          <div class="max-w-md mx-auto lg:mx-0">
            <div class="relative group flex items-center gap-3 rounded-xl bg-zinc-900/60 border border-white/10 p-1 pl-4 pr-1 transition-all hover:border-teal-500/30 hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] backdrop-blur-md">
              <div class="text-teal-500 select-none opacity-70">$</div>
              <code class="flex-1 font-mono text-sm text-zinc-300 truncate">
                npx shadcn-vue@latest add ...
              </code>
              <Button size="icon" variant="ghost" class="h-9 w-9 shrink-0 rounded-lg text-zinc-400 hover:bg-teal-500/20 hover:text-teal-400 transition-all" @click="copyInstall">
                <Check v-if="copied" class="h-4 w-4" />
                <Copy v-else class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <NuxtLink to="/docs/introduction">
              <Button class="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 font-bold rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Get Started
              </Button>
            </NuxtLink>
            <NuxtLink to="/docs/components/liquid-glass">
              <Button variant="outline" class="h-12 px-8 text-base border-zinc-700 bg-transparent hover:bg-zinc-800 rounded-full">
                View Gallery
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </NuxtLink>
          </div>
        </div>

        <div class="relative w-full aspect-square max-w-[550px] mx-auto perspective-[2000px] group">

          <LiquidGlass
              :style="{ transform: cardTransform, transition: 'transform 0.1s ease-out' }"
              class="w-full h-full rounded-[2.5rem] shadow-2xl transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(20,184,166,0.2)]"
              :radius="40"
              :blur="10"
              :scale="-20"
              :lightness="15"
          >
            <div class="relative h-full w-full bg-black/40 p-8 flex flex-col gap-6 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden">

              <div class="flex items-center justify-between border-b border-white/10 pb-6">
                <div class="flex items-center gap-3">
                  <div class="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                <div class="text-xs font-mono text-zinc-500">Raya Interactive Demo</div>
              </div>

              <div class="flex-1 flex flex-col items-center justify-center gap-8">

                <div class="w-full max-w-xs">
                  <AnimatedTabs v-model="activeTab" :items="tabs" variant="pill" class="bg-black/30 p-1 rounded-full border border-white/5" />
                </div>

                <div class="relative w-full max-w-xs h-48 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-black border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
                  <div class="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                  <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

                  <WheelPickerWrapper class="w-full px-8 z-0">
                    <WheelPicker v-model="timeState.hour" :options="hours" infinite class="text-xl" />
                    <div class="text-zinc-600 font-bold pb-1">:</div>
                    <WheelPicker v-model="timeState.minute" :options="minutes" infinite class="text-xl" />
                  </WheelPickerWrapper>

                  <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div class="w-full h-10 bg-white/5 border-y border-teal-500/30 backdrop-blur-[1px]"></div>
                  </div>
                </div>

                <div class="text-center">
                  <p class="text-xs text-teal-400 font-mono tracking-widest uppercase">Live Interactive Primitives</p>
                </div>

              </div>
            </div>
          </LiquidGlass>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Smooth parallax transition */
.perspective-1000 {
  perspective: 1000px;
}
</style>
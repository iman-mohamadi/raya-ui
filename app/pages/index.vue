<script setup lang="ts">
import { ref } from 'vue'
import {
  Github, ArrowRight, Terminal, Layers,
  Smartphone, Zap, LayoutGrid, MousePointer2,
  Move3d, Music, Copy, Check
} from 'lucide-vue-next'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { Button } from '@/components/ui/button'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'
import { BarVisualizer } from '@/components/ui/bar-visualizer'
import { Tree } from '@/components/ui/tree'

const config = useAppConfig().raya
const copied = ref(false)

// --- Install Command ---
const installCmd = `npx shadcn-vue@latest add ${config.baseUrl}/wheel-picker.json`
const copyInstall = () => {
  navigator.clipboard.writeText(installCmd)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

// --- Demo Data ---
const timeState = ref({ hour: 10, minute: 30 })
const hours = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }))
const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))

const tabIndex = ref(0)
const tabs = [
  { label: 'Design', icon: LayoutGrid },
  { label: 'Code', icon: Terminal },
  { label: 'Motion', icon: Zap }
]

const treeItems = [
  {
    label: 'components',
    children: [
      { label: 'ui', children: [{ label: 'button.vue' }, { label: 'glass.vue' }] },
      { label: 'utils.ts' }
    ]
  },
  { label: 'app.vue' }
]
const treeSelection = ref(null)
const treeExpanded = ref(['components', 'ui'])
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans">

    <header class="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div class="container mx-auto flex h-16 items-center justify-between px-6">
        <div class="flex items-center gap-2">
          <NuxtImg src="/logo.svg" class="w-20"/>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="/docs/introduction" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors">
            Docs
          </NuxtLink>
          <a :href="config?.github" target="_blank" class="text-zinc-500 hover:text-white transition-colors">
            <Github class="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>

    <main class="relative z-10 pt-32 pb-20 container mx-auto px-6">
      <BackgroundRippleEffect
          :cell-size="50"
          :interactive="true"
          fill
          class="text-[oklch(0.82_0.16_195)]"
      />
      <section class="flex flex-col items-center text-center space-y-10 mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">

        <div class="inline-flex items-center gap-2 rounded-full border border-[oklch(0.82_0.16_195)]/30 bg-[oklch(0.82_0.16_195)]/5 px-3 py-1 text-xs font-medium text-[oklch(0.82_0.16_195)]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.82_0.16_195)] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.82_0.16_195)]"></span>
          </span>
          <span>Animate your UI</span>
        </div>

        <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-[1] max-w-4xl relative z-20">
          Make it
          <span class="text-[oklch(0.82_0.16_195)]">pop.</span>
          <br/>
          Make it
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[oklch(0.82_0.16_195)] to-white/50">flow.</span>
        </h1>

        <p class="text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed relative z-20">
          Raya (رایا) is a collection of high-performance, interactive Vue primitives.
          Black, bold, and strictly typed.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 relative z-20">
          <div class="relative group flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-1 pl-4 pr-1 hover:border-[oklch(0.82_0.16_195)]/50 transition-colors">
            <span class="text-[oklch(0.82_0.16_195)] font-mono">$</span>
            <code class="font-mono text-sm text-zinc-400">npx shadcn-vue@latest add...</code>
            <Button size="icon" variant="ghost" class="h-9 w-9 rounded-lg text-zinc-400 hover:text-white hover:bg-[oklch(0.82_0.16_195)]/10" @click="copyInstall">
              <Check v-if="copied" class="h-4 w-4 text-[oklch(0.82_0.16_195)]" />
              <Copy v-else class="h-4 w-4" />
            </Button>
          </div>

          <NuxtLink to="/docs/components/liquid-glass">
            <Button class="h-11 px-8 rounded-xl bg-[oklch(0.82_0.16_195)] text-black font-bold hover:bg-[oklch(0.82_0.16_195)]/90 transition-all hover:scale-105">
              Browse Components
            </Button>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
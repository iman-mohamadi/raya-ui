<script setup lang="ts">
import { ref } from 'vue'
import {
  Github, Copy, Check
} from 'lucide-vue-next'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Button } from '@/components/ui/button'

const config = useAppConfig().raya
const copied = ref(false)

// --- Install Command ---
const installCmd = `npx shadcn-vue@latest add ${config.baseUrl}/wheel-picker.json`
const copyInstall = () => {
  navigator.clipboard.writeText(installCmd)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

useSeoMeta({
  title: 'Beautiful Vue & Shadcn Components',
  description: 'Raya UI offers a collection of high-quality, copy-paste Vue components. Built for speed, accessibility, and modern design.',
  ogTitle: 'Raya UI - The Ultimate Vue Component Collection',
  ogDescription: 'Stop reinventing the wheel. Copy beautiful, accessible components directly into your Nuxt app.',
  ogImage: 'https://raya-ui.com/logo.svg',
})
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans">
   <AppNav />
    <main class="relative z-10 pt-32 pb-20 container mx-auto px-6">
      <BackgroundBeams />
      <section class="flex flex-col items-center text-center space-y-10 mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">

        <div class="inline-flex items-center gap-2 rounded-full border border-[oklch(0.82_0.16_195)]/30 bg-[oklch(0.82_0.16_195)]/5 px-3 py-1 text-xs font-medium text-[oklch(0.82_0.16_195)] relative z-20">
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
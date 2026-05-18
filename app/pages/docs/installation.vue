<script setup lang="ts">
import { ref, computed } from 'vue'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Terminal, Box, Info } from 'lucide-vue-next'

const config = useAppConfig().raya

useSeoMeta({
  title: 'Installation - Raya UI',
  description: 'Setup Raya UI in your Vue or Nuxt project in seconds.',
})

// --- Commands for Frameworks ---
const frameworkCommands = {
  vite: {
    create: 'npm create vite@latest my-app -- --template vue-ts',
    init: 'npx shadcn-vue@latest init',
    add: `npx raya-ui@latest add tree`
  },
  nuxt: {
    create: 'npx nuxi@latest init my-app',
    init: 'npx shadcn-vue@latest init',
    add: `npx raya-ui@latest add tree`
  },
  astro: {
    create: 'npm create astro@latest',
    init: 'npx shadcn-vue@latest init',
    add: `npx raya-ui@latest add tree`
  },
  manual: {
    deps: 'npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-vue-next reka-ui @vueuse/core',
    utils: `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`
  }
}

const frameworkTabs = [
  { label: 'Nuxt 4', slot: 'nuxt' },
  { label: 'Vite', slot: 'vite' },
  { label: 'Astro', slot: 'astro' },
  { label: 'Manual', slot: 'manual' }
]
</script>

<template>
    <div class="container mx-auto">

      <!-- Header Section -->
      <header class="mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 tracking-wider uppercase">
          <Terminal class="size-3" />
          Setup Guide
        </div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
          Installation
        </h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Raya UI is built on top of Tailwind CSS and Reka UI.
          Follow these steps to integrate our high-performance primitives into your workflow.
        </p>
      </header>

      <!-- Prerequisites -->
      <section class="mb-16 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-6 rounded-3xl border border-border bg-muted/20 backdrop-blur-sm">
          <Box class="size-6 text-primary mb-4" />
          <h3 class="font-bold text-foreground">Tailwind CSS</h3>
          <p class="text-sm text-muted-foreground mt-2">Raya requires Tailwind CSS v3.4+ or v4.0 for utility-first styling.</p>
        </div>
        <div class="p-6 rounded-3xl border border-border bg-muted/20 backdrop-blur-sm">
          <Info class="size-6 text-info mb-4" />
          <h3 class="font-bold text-foreground">Nuxt / Vue</h3>
          <p class="text-sm text-muted-foreground mt-2">Optimized for Nuxt 4, but works perfectly with Vite-based Vue 3 projects.</p>
        </div>
      </section>

      <!-- Tabs Section -->
      <div class="mb-20">
        <div class="flex items-center gap-3 mb-8">
          <div class="h-px flex-1 bg-border" />
          <span class="text-xs font-black uppercase tracking-widest text-muted-foreground px-4">Choose your framework</span>
          <div class="h-px flex-1 bg-border" />
        </div>

        <AnimatedTabs :items="frameworkTabs" class="space-y-10">

          <!-- NUXT -->
          <template #nuxt>
            <div class="space-y-12">
              <div class="flex gap-6">
                <div class="flex flex-col items-center">
                  <div class="size-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">1</div>
                  <div class="w-px flex-1 bg-border my-2" />
                </div>
                <div class="pb-8">
                  <h4 class="text-xl font-bold text-foreground mb-2">Create Nuxt Project</h4>
                  <p class="text-muted-foreground mb-4">Initialize a new project using the Nuxi CLI.</p>
                  <CodeBlock :code="frameworkCommands.nuxt.create" />
                </div>
              </div>

              <div class="flex gap-6">
                <div class="flex flex-col items-center">
                  <div class="size-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">2</div>
                  <div class="w-px flex-1 bg-border my-2" />
                </div>
                <div class="pb-8">
                  <h4 class="text-xl font-bold text-foreground mb-2">Initialize Shadcn Vue</h4>
                  <p class="text-muted-foreground mb-4">This sets up your components.json and Tailwind configurations.</p>
                  <CodeBlock :code="frameworkCommands.nuxt.init" />
                </div>
              </div>

              <div class="flex gap-6">
                <div class="flex flex-col items-center">
                  <div class="size-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">3</div>
                </div>
                <div>
                  <h4 class="text-xl font-bold text-foreground mb-2">Add Components</h4>
                  <p class="text-muted-foreground mb-4">Pull high-performance components directly into your project.</p>
                  <CodeBlock :code="frameworkCommands.nuxt.add" />
                </div>
              </div>
            </div>
          </template>

          <!-- VITE -->
          <template #vite>
            <div class="space-y-12">
              <div class="flex gap-6">
                <div class="flex flex-col items-center">
                  <div class="size-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">1</div>
                  <div class="w-px flex-1 bg-border my-2" />
                </div>
                <div class="pb-8">
                  <h4 class="text-xl font-bold text-foreground mb-2">Create Vite App</h4>
                  <CodeBlock :code="frameworkCommands.vite.create" />
                </div>
              </div>
              <div class="flex gap-6">
                <div class="flex flex-col items-center">
                  <div class="size-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">2</div>
                </div>
                <div>
                  <h4 class="text-xl font-bold text-foreground mb-2">Initialize CLI</h4>
                  <CodeBlock :code="frameworkCommands.vite.init" />
                </div>
              </div>
            </div>
          </template>

          <!-- MANUAL -->
          <template #manual>
            <div class="space-y-8">
              <div class="p-4 rounded-2xl bg-warning/10 border border-warning/20 text-warning text-sm flex gap-3">
                <Info class="size-5 shrink-0" />
                Manual setup requires you to handle Tailwind's `content` and `theme` extensions yourself.
              </div>
              <div class="space-y-4">
                <h4 class="text-xl font-bold text-foreground">Core Dependencies</h4>
                <CodeBlock :code="frameworkCommands.manual.deps" />
              </div>
              <div class="space-y-4">
                <h4 class="text-xl font-bold text-foreground">Utility Helper</h4>
                <CodeBlock :code="frameworkCommands.manual.utils" lang="typescript" file-name="lib/utils.ts" />
              </div>
            </div>
          </template>

        </AnimatedTabs>
      </div>

      <!-- Support Section -->
      <footer class="mt-20 p-10 rounded-[3rem] bg-foreground text-background flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 class="text-3xl font-black tracking-tight">Need help?</h2>
          <p class="text-background/70 mt-2">Join our Discord or check the GitHub discussions.</p>
        </div>
        <div class="flex gap-4">
          <button class="px-6 py-3 rounded-full bg-background text-foreground font-bold text-sm hover:scale-105 transition-transform">GitHub</button>
          <button class="px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:scale-105 transition-transform">Discord</button>
        </div>
      </footer>

    </div>
</template>
<script setup lang="ts">
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

// --- Commands for Frameworks ---
const frameworkCommands = {
  vite: {
    create: 'npm create vite@latest my-app -- --template vue-ts',
    init: 'npx shadcn-vue@latest init',
    add: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/wheel-picker.json'
  },
  nuxt: {
    create: 'npx nuxi@latest init my-app',
    init: 'npx shadcn-vue@latest init',
    add: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/wheel-picker.json'
  },
  astro: {
    create: 'npm create astro@latest',
    init: 'npx shadcn-vue@latest init',
    add: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/wheel-picker.json'
  },
  laravel: {
    create: 'composer create-project laravel/laravel my-app',
    init: 'npx shadcn-vue@latest init',
    add: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/wheel-picker.json'
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

// --- Tabs Configuration ---
const frameworkTabs = [
  { label: 'Vite', slot: 'vite' },
  { label: 'Nuxt', slot: 'nuxt' },
  { label: 'Astro', slot: 'astro' },
  { label: 'Laravel', slot: 'laravel' },
  { label: 'Manual', slot: 'manual' }
]
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight text-white">Installation</h1>
      <p class="text-xl text-zinc-400">
        How to install dependencies and structure your app.
      </p>
    </div>

    <div class="space-y-6">
      <AnimatedTabs :items="frameworkTabs" class="space-y-6">

        <template #vite>
          <div class="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">1. Create project</h3>
              <p class="text-zinc-400">Start by creating a new Vue project using Vite.</p>
              <CodeBlock :code="frameworkCommands.vite.create"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">2. Run the CLI</h3>
              <p class="text-zinc-400">Initialize Shadcn Vue to set up Tailwind and CSS variables.</p>
              <CodeBlock :code="frameworkCommands.vite.init"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">3. Add EnzOUi Components</h3>
              <p class="text-zinc-400">You can now add any component from our registry.</p>
              <CodeBlock :code="frameworkCommands.vite.add"  />
            </div>
          </div>
        </template>

        <template #nuxt>
          <div class="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">1. Create project</h3>
              <p class="text-zinc-400">Initialize a new Nuxt application.</p>
              <CodeBlock :code="frameworkCommands.nuxt.create"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">2. Run the CLI</h3>
              <p class="text-zinc-400">Run the Shadcn init command to configure `components.json` and Tailwind.</p>
              <CodeBlock :code="frameworkCommands.nuxt.init"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">3. Add EnzOUi Components</h3>
              <CodeBlock :code="frameworkCommands.nuxt.add"  />
            </div>
          </div>
        </template>

        <template #astro>
          <div class="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">1. Create project</h3>
              <p class="text-zinc-400">Create a new Astro project.</p>
              <CodeBlock :code="frameworkCommands.astro.create"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">2. Run the CLI</h3>
              <p class="text-zinc-400">Initialize Shadcn Vue.</p>
              <CodeBlock :code="frameworkCommands.astro.init"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">3. Add EnzOUi Components</h3>
              <CodeBlock :code="frameworkCommands.astro.add"  />
            </div>
          </div>
        </template>

        <template #laravel>
          <div class="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">1. Create project</h3>
              <p class="text-zinc-400">Start a new Laravel project.</p>
              <CodeBlock :code="frameworkCommands.laravel.create"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">2. Run the CLI</h3>
              <p class="text-zinc-400">Configure Shadcn Vue for Laravel.</p>
              <CodeBlock :code="frameworkCommands.laravel.init"  />
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">3. Add EnzOUi Components</h3>
              <CodeBlock :code="frameworkCommands.laravel.add"  />
            </div>
          </div>
        </template>

        <template #manual>
          <div class="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200">
              <p class="text-sm">We strongly recommend using the CLI tools above. Manual installation requires setting up Tailwind variables yourself.</p>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">1. Install Dependencies</h3>
              <p class="text-zinc-400">Install the required utility libraries and primitives.</p>
              <CodeBlock :code="frameworkCommands.manual.deps"  />
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">2. Configure Utils</h3>
              <p class="text-zinc-400">Create a `lib/utils.ts` file for the class merger.</p>
              <CodeBlock :code="frameworkCommands.manual.utils" lang="typescript" file-name="lib/utils.ts" />
            </div>
          </div>
        </template>

      </AnimatedTabs>
    </div>

  </div>
</template>
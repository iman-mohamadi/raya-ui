<script setup lang="ts">
import { ArrowRight, Check, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Introduction - Vue & Nuxt Component Library',
  description: `Learn about the philosophy behind ${config.name}, a copy-paste component library built for Vue and Nuxt.`,
  ogTitle: 'Introduction - Vue & Nuxt Component Library',
  ogDescription: `Learn about the philosophy behind ${config.name}, a copy-paste component library built for Vue and Nuxt.`,
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Introduction"
        description="Beautifully designed components built with Vue & Shadcn. Copy and paste into your apps. Open Source. Accessible."
    />
    <Divider/>

    <div class="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
      <div class="flex items-start gap-3">
        <AlertTriangle class="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
        <div class="space-y-1">
          <h3 class="font-medium text-amber-500">Prerequisite: Shadcn Vue</h3>
          <p class="text-sm text-amber-200/80 leading-relaxed">
            <strong>{{ config.name }}</strong> is built on top of the Shadcn Vue ecosystem.
            <br />
            You <u>must</u> have a working <a href="https://www.shadcn-vue.com/docs/installation.html" target="_blank" class="underline hover:text-white">Shadcn Vue</a> project set up (initialized) before adding these components, as they rely on the same `lib/utils` (cn helper), Tailwind configuration, and base dependencies.
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-6 mt-10">
      <div class="space-y-4">
        <h2 class="scroll-m-20 border-b border-zinc-800 pb-2 text-2xl font-semibold tracking-tight text-white">
          Philosophy
        </h2>
        <p class="leading-7 text-zinc-400">
          {{ config.name }} is not a component library. It's a collection of re-usable components that you can copy and paste into your apps.
        </p>
        <p class="leading-7 text-zinc-400">
          <strong>What do you mean by "not a component library"?</strong><br>
          I mean you do not install it as a dependency. It is not available or distributed via npm.
        </p>
        <p class="leading-7 text-zinc-400">
          Pick the components you need. Copy and paste the code into your project and customize to your needs. The code is yours.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 mt-6">
      <div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3">
        <h3 class="font-semibold text-white flex items-center gap-2">
          <Check class="h-4 w-4 text-white" />
          Themable
        </h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Built on top of Tailwind CSS variables. If you use Shadcn Vue, these components automatically adapt to your theme (colors, radius, dark mode).
        </p>
      </div>

      <div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3">
        <h3 class="font-semibold text-white flex items-center gap-2">
          <Check class="h-4 w-4 text-white" />
          Accessible
        </h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          We use <a href="https://reka-ui.com/" target="_blank" class="underline underline-offset-4 hover:text-white">Reka UI</a> (formerly Radix Vue) primitives to ensure keyboard navigation, focus management, and ARIA support out of the box.
        </p>
      </div>
    </div>

    <div class="pt-6 mt-4">
      <NuxtLink to="/docs/installation">
        <Button size="lg" class="bg-white text-black hover:bg-zinc-200 font-bold">
          Start Installation
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </NuxtLink>
    </div>

  </div>
</template>
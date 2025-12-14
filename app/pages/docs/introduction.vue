<script setup lang="ts">
import { ArrowRight, Check } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight text-white">Introduction</h1>
      <p class="text-xl text-zinc-400">
        Beautifully designed components built with Vue & Shadcn.
        <span class="block mt-2 text-zinc-500 text-lg">Copy and paste into your apps. Open Source. Accessible.</span>
      </p>
    </div>

    <div class="space-y-6">
      <div class="space-y-4">
        <h2 class="scroll-m-20 border-b border-zinc-800 pb-2 text-2xl font-semibold tracking-tight text-white">
          Philosophy
        </h2>
        <p class="leading-7 text-zinc-400">
          EnzOUi is not a component library. It's a collection of re-usable components that you can copy and paste into your apps.
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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
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

    <div class="pt-6">
      <NuxtLink to="/docs/installation">
        <Button size="lg" class="bg-white text-black hover:bg-zinc-200 font-bold">
          Start Installation
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </NuxtLink>
    </div>

  </div>
</template>
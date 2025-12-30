<script setup lang="ts">
import { SnowEffect } from '@/components/ui/snow-effect'
import { Button } from '@/components/ui/button'
import { ArrowRight, Component, Code2, Paintbrush } from 'lucide-vue-next'
import FaqSection from "~/components/landing/FaqSection.vue"

definePageMeta({
  layout: 'default'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Raya UI',
        'operatingSystem': 'Web',
        'applicationCategory': 'DeveloperApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': 'A collection of accessible, reusable, and composable Vue components built with Tailwind CSS.',
        'author': {
          '@type': 'Person',
          'name': 'Iman Mohamadi'
        },
        'keywords': 'Vue, Nuxt, UI Library, Shadcn, Tailwind CSS, Components'
      })
    }
  ]
})

useSeoMeta({
  title: 'Raya UI - Open Source Vue & Nuxt UI Library',
  description: 'Raya UI is a comprehensive Vue and Nuxt UI library based on Shadcn and Tailwind CSS. Accessible, copy-paste components for modern web development.',
  ogTitle: 'Raya UI - The Ultimate Vue & Nuxt UI Library',
  ogDescription: 'Stop reinventing the wheel. Copy beautiful, accessible components directly into your Nuxt app with Raya UI.',
  ogImage: 'https://raya-ui.com/og-image.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-black text-foreground selection:bg-primary/20 selection:text-primary">

    <SnowEffect
        color="#ffffff"
        :quantity="100"
        :speed="0.5"
        :min-radius="1"
        :max-radius="3"
        class="z-0 opacity-70"
    />

    <div class="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0 opacity-50" />

    <div class="relative z-10 container border-none mx-auto px-4 pt-32 pb-20 flex flex-col items-center text-center">
      <div class="relative mb-6 group cursor-default">
        <svg viewBox="0 0 100 100" class="absolute -top-10 -left-8 w-20 h-20 z-20 drop-shadow-lg transform -rotate-12 pointer-events-none" aria-hidden="true">
          <path d="M10 75 Q 30 10 85 55 L 75 75 Z" class="fill-red-600" />
          <path d="M5 75 C 5 70 25 70 45 72 S 85 70 85 75 C 85 85 65 85 45 83 S 5 85 5 75 Z" class="fill-slate-100" />
          <circle cx="85" cy="55" r="8" class="fill-slate-100" />
        </svg>
        <h1 class="text-7xl md:text-9xl font-black tracking-tighter text-primary drop-shadow-2xl">
          Raya UI
        </h1>
      </div>

      <p class="max-w-xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-medium">
        A collection of accessible, reusable, and composable Vue components.
        <br class="hidden md:block" />
        Styled with Tailwind CSS. Open Source.
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-4">
        <NuxtLink to="/components">
          <Button size="lg" class="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
            Browse Components
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </NuxtLink>
        <NuxtLink to="/docs/installation">
          <Button size="lg" variant="outline" class="h-12 px-8 text-base bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-white">
            Documentation
          </Button>
        </NuxtLink>
      </div>

      <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div class="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/50">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Paintbrush class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-lg font-bold text-white">Customizable</h3>
          <p class="text-sm text-zinc-400">Built with Tailwind CSS, giving you full control over styles and themes.</p>
        </div>
        <div class="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/50">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Component class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-lg font-bold text-white">Copy & Paste</h3>
          <p class="text-sm text-zinc-400">No massive dependencies. Just copy the component code you need into your project.</p>
        </div>
        <div class="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/50">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Code2 class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-lg font-bold text-white">Type Safe</h3>
          <p class="text-sm text-zinc-400">Written in TypeScript with full type definitions for a better developer experience.</p>
        </div>
      </div>
    </div>

    <div class="relative z-10 w-full bg-zinc-950/50 border-t border-zinc-800">
      <FaqSection />
    </div>

  </div>
</template>
<script setup lang="ts">
import { ArrowRight, Check, AlertTriangle, Box, Accessibility, Paintbrush } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

// Using the new default layout
definePageMeta({ layout: false })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Introduction - Raya UI',
  description: `Learn about the philosophy behind ${config.name}, a collection of re-usable components for Vue and Nuxt.`,
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-4xl mx-auto">

      <!-- Hero Header -->
      <header class="mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 tracking-wider uppercase">
          <Box class="size-3" />
          The Vision
        </div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
          Introduction
        </h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Beautifully crafted UI primitives built with **Vue**, **Nuxt**, and **Tailwind**.
          Accessible, open-source, and ready to be owned by your codebase.
        </p>
      </header>

      <!-- Prerequisite Callout -->
      <div class="group relative overflow-hidden rounded-[2rem] border border-warning/20 bg-warning/5 p-8 mb-20 transition-all hover:bg-warning/10">
        <div class="flex flex-col md:flex-row items-start gap-6 relative z-10">
          <div class="size-12 rounded-2xl bg-warning/20 flex items-center justify-center text-warning shrink-0">
            <AlertTriangle class="size-6" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold text-foreground">Prerequisite: Shadcn Vue</h3>
            <p class="text-muted-foreground leading-relaxed">
              {{ config.name }} is an extension of the Shadcn Vue ecosystem. You <strong>must</strong> have a
              <a href="https://www.shadcn-vue.com/" target="_blank" class="text-foreground underline underline-offset-4 decoration-warning/30 hover:decoration-warning transition-all">Shadcn Vue</a>
              project initialized before adding these components.
            </p>
          </div>
        </div>
        <!-- Decorative Glow -->
        <div class="absolute -right-20 -top-20 size-64 bg-warning/10 blur-[100px] rounded-full" />
      </div>

      <!-- Philosophy Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        <div class="lg:col-span-4">
          <h2 class="text-3xl font-black tracking-tight text-foreground uppercase italic">Philosophy</h2>
        </div>
        <div class="lg:col-span-8 space-y-8">
          <div class="space-y-4">
            <h4 class="text-xl font-bold text-foreground">Owned, Not Installed</h4>
            <p class="text-lg text-muted-foreground leading-relaxed">
              {{ config.name }} is <strong>not</strong> a component library in the traditional sense. It's a collection of components that you copy and paste directly into your app.
            </p>
          </div>
          <div class="space-y-4">
            <h4 class="text-xl font-bold text-foreground">Complete Control</h4>
            <p class="text-lg text-muted-foreground leading-relaxed">
              The code is yours. Once you paste it, it becomes part of your source. Customize the logic, change the styles, and make it fit your specific project needs without fighting a library's internal configuration.
            </p>
          </div>
        </div>
      </div>

      <!-- Feature Grid (Bento) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        <div class="p-8 rounded-[2rem] border border-border bg-muted/20 backdrop-blur-sm space-y-4">
          <div class="size-10 rounded-xl bg-foreground text-background flex items-center justify-center">
            <Paintbrush class="size-5" />
          </div>
          <h3 class="text-xl font-bold text-foreground">Infinite Customization</h3>
          <p class="text-muted-foreground leading-relaxed">
            Built on Tailwind CSS variables. These components detect your theme settings automatically, ensuring consistent colors and border-radii across your application.
          </p>
        </div>

        <div class="p-8 rounded-[2rem] border border-border bg-muted/20 backdrop-blur-sm space-y-4">
          <div class="size-10 rounded-xl bg-foreground text-background flex items-center justify-center">
            <Accessibility class="size-5" />
          </div>
          <h3 class="text-xl font-bold text-foreground">Accessible by Default</h3>
          <p class="text-muted-foreground leading-relaxed">
            Leveraging <a href="https://reka-ui.com/" target="_blank" class="text-foreground font-bold hover:underline">Reka UI</a> primitives to provide WAI-ARIA compliant components with full keyboard support.
          </p>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex flex-col md:flex-row items-center justify-between p-10 rounded-[3rem] bg-foreground text-background gap-8">
        <div>
          <h2 class="text-3xl font-black tracking-tighter">Ready to build?</h2>
          <p class="text-background/70 mt-1">Start your journey with the installation guide.</p>
        </div>
        <NuxtLink to="/docs/installation">
          <Button size="lg" class="bg-background text-foreground hover:bg-background/90 font-black rounded-full h-14 px-8 group">
            Start Setup
            <ArrowRight class="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </NuxtLink>
      </div>

    </div>
  </NuxtLayout>
</template>
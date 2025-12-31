<script setup lang="ts">
import { ArrowRight, Zap, Layers, Accessibility, Rocket } from 'lucide-vue-next'
import { BackgroundBeams } from "~/components/ui/background-beams"
import MorphingText from '@/components/ui/morphing-text/MorphingText.vue'
import RayaButton from '@/components/ui/raya-button/RayaButton.vue'
import GravityStars from '@/components/ui/gravity-stars/GravityStars.vue'
import FaqSection from "~/components/landing/FaqSection.vue"
import Divider from "~/components/Divider.vue"

// --- Configuration & Metadata ---
definePageMeta({
  layout: 'default'
})

const appConfig = useAppConfig()
const version = appConfig.raya?.version || '0.0.0'

const heroWords = [
  "Raya UI",
  "Limitless",
  "Visionary"
]

const features = [
  {
    title: 'Instant Speed',
    description: 'Zero runtime overhead with optimized compile-time macros.',
    icon: Zap,
    color: 'text-yellow-400'
  },
  {
    title: 'Modular Core',
    description: 'Drop-in components that adapt seamlessly to your design system.',
    icon: Layers,
    color: 'text-blue-400'
  },
  {
    title: 'Accessibility',
    description: 'Built on WCAG standards ensuring the web is for everyone.',
    icon: Accessibility,
    color: 'text-green-400'
  }
]

// --- SEO Setup ---
const jsonLd = {
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
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd)
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
  <div class="flex flex-col">

    <div class="relative w-full flex flex-col items-center justify-center py-20 md:py-32 overflow-hidden">
      <BackgroundBeams class="absolute inset-0 z-0 opacity-80 pointer-events-none" />

      <div class="relative z-10 flex flex-col items-center text-center space-y-8 px-4">

        <div class="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-background/50 backdrop-blur-md text-xs font-medium text-foreground/80 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span class="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          v{{ version }} System Online
        </div>

        <div class="h-20 sm:h-24 md:h-32 w-full flex items-center justify-center">
          <MorphingText
              :texts="heroWords"
              class="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter drop-shadow-2xl text-primary"
          />
        </div>

        <p class="text-lg md:text-xl text-muted-foreground max-w-[60ch] leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300">
          A collection of accessible, reusable, and composable Vue components.
          <br class="hidden md:block" />
          Styled with Tailwind CSS. Open Source.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 items-center pt-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500">
          <NuxtLink to="/components">
            <RayaButton
                size="lg"
                class="rounded-full px-8 h-12 text-base shadow-[0_0_30px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_50px_-10px_rgba(var(--primary),0.7)] transition-all hover:scale-105"
            >
              Browse Components
              <ArrowRight class="ml-2 h-4 w-4" />
            </RayaButton>
          </NuxtLink>

          <NuxtLink to="/docs/installation">
            <RayaButton
                variant="outline"
                size="lg"
                class="rounded-full px-8 h-12 text-base bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/40 transition-all"
            >
              Documentation
            </RayaButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <Divider />

    <div class="grid relative row-line before:hidden">
      <div class="h-g"/>

      <div class="grid relative grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-g">
        <div
            v-for="(feature, index) in features"
            :key="index"
            class="group border-x border-dashed border-edge"
        >
          <div class="row-line bg-primary-50/5 dark:bg-primary-50/10 aspect-390/200 overflow-hidden relative flex items-center justify-center">
            <component
                :is="feature.icon"
                :class="['w-12 h-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 drop-shadow-lg', feature.color]"
            />
          </div>

          <div class="pl-m py-4 row-line before:hidden pb-8 block">
            <p class="text-base text-foreground font-semibold mb-2 group-hover:text-primary transition-colors">
              {{ feature.title }}
            </p>
            <p class="text-sm text-muted-foreground font-mono leading-relaxed pr-4">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
      <div class="h-g"></div>
    </div>

    <section class="mt-20 mb-20 relative h-[400px] w-full rounded-3xl overflow-hidden border border-border/50 mx-auto max-w-[95%]">
      <GravityStars
          class="absolute inset-0 z-0 bg-black/5 dark:bg-black/40"
          :starsCount="100"
          :movementSpeed="0.5"
          mouseGravity="attract"
          glowAnimation="spring"
          :glowIntensity="15"
      />

      <div class="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none p-4 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tighter">
          Ready to build?
        </h2>

        <div class="pointer-events-auto">
          <NuxtLink to="/docs/installation">
            <RayaButton
                size="lg"
                class="rounded-full px-10 py-6 text-lg font-bold shadow-xl"
            >
              <Rocket class="mr-2 h-5 w-5" />
              Get Started Now
            </RayaButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <Divider />

    <section>
      <FaqSection />
    </section>

  </div>
</template>
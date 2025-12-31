<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
import FaqSection from "~/components/landing/FaqSection.vue"
import {BackgroundBeams} from "~/components/ui/background-beams";

definePageMeta({
  layout: 'default'
})

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
  <div>
    <div class="h-screen w-full overflow-x-hidden">
      <BackgroundBeams />
      <div class="grid gap-2 py-2 relative z-10">
        <div class="grid gap-6 md:gap-8">
          <h1 class="text-7xl md:text-9xl font-black tracking-tighter text-primary drop-shadow-2xl">
            Raya UI
          </h1>
          <p class="text-foreground max-w-[60ch] -mt-2 text-base leading-7 md:text-lg md:leading-8">
            A collection of accessible, reusable, and composable Vue components.
            <br class="hidden md:block" />
            Styled with Tailwind CSS. Open Source.
          </p>
        </div>
        <div class="h-g" />
        <Divider />
        <div class="flex items-center justify-center h-30">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <NuxtLink to="/components">
              <Button
                  size="lg"
                  class="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
              >
                Browse Components
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </NuxtLink>
            <NuxtLink to="/docs/installation">
              <Button
                  size="lg"
                  variant="outline"
                  class="h-12 px-8 text-base bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-white"
              >
                Documentation
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div>
        <FaqSection />
    </div>
  </div>
</template>
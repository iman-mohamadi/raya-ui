<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/vue'

const appConfig = useAppConfig()

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${appConfig.raya.name}` : appConfig.raya.name
  },
  htmlAttrs: {
    lang: 'en'
  },
  script: [
    {
      innerHTML: `(function() {
        try {
          var localValue = localStorage.getItem('theme');
          if (localValue === 'dark' || (!localValue && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {}
      })()`,
      type: 'text/javascript'
    }
  ]
})

useSeoMeta({
  description: appConfig.raya.description,
  ogTitle: appConfig.raya.name,
  ogDescription: appConfig.raya.description,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <SpeedInsights />
  <Analytics />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
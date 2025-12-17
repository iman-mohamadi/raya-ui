<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

const appConfig = useAppConfig()

useHead({
  // Dynamic title: "Page Name - EnzOUi"
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${appConfig.raya.name}` : appConfig.raya.name
  },
  htmlAttrs: {
    lang: 'en',
    class: 'dark' // Forces Dark Mode for Shadcn
  }
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
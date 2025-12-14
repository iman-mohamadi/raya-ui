<script setup lang="ts">
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
</template>

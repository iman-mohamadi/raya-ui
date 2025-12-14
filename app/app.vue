<script setup lang="ts">
const appConfig = useAppConfig()

useHead({
  // Dynamic title: "Page Name - EnzOUi"
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${appConfig.enzoui.name}` : appConfig.enzoui.name
  },
  htmlAttrs: {
    lang: 'en',
    class: 'dark' // Forces Dark Mode for Shadcn
  }
})

useSeoMeta({
  description: appConfig.enzoui.description,
  ogTitle: appConfig.enzoui.name,
  ogDescription: appConfig.enzoui.description,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

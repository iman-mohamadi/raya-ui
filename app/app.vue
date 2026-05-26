<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const appConfig = useAppConfig()

onMounted(() => {

  // INITIAL REVEAL
  gsap.to('#global-curtain', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1.2,
    ease: 'expo.inOut',
    delay: 0.2
  })

  gsap.fromTo(
      '.page-wrapper',
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 0.3
      }
  )

  // ROUTE EXIT
  router.beforeEach((to, from, next) => {

    if (to.path === from.path) {
      return next()
    }

    const tl = gsap.timeline({
      onComplete: next
    })

    gsap.set('#global-curtain', {
      transformOrigin: 'bottom'
    })

    tl.to('.page-wrapper', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    })

    tl.to('#global-curtain', {
      scaleY: 1,
      duration: 0.8,
      ease: 'expo.inOut'
    }, '<')
  })

  // ROUTE ENTER
  router.afterEach(() => {

    gsap.set('#global-curtain', {
      transformOrigin: 'top'
    })

    gsap.to('#global-curtain', {
      scaleY: 0,
      duration: 1,
      ease: 'expo.inOut'
    })

    gsap.fromTo(
        '.page-wrapper',
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
    )
  })
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
        ? `${titleChunk} - ${appConfig.raya.name}`
        : appConfig.raya.name
  },

  htmlAttrs: {
    lang: 'en'
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
  <div class="bg-[#040404] min-h-screen text-[#FAFAFA] overflow-x-hidden">

    <!-- CURTAIN -->
    <div
        id="global-curtain"
        class="fixed inset-0 z-[99999] bg-[#020202] pointer-events-none flex items-center justify-center origin-bottom"
    >
      <div class="font-mono text-[10px] tracking-[0.4em] text-[#FF4A00] uppercase animate-pulse">
        System.Routing
      </div>
    </div>

    <!-- PAGE -->
    <div class="page-wrapper">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

  </div>
</template>

<style>
html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  background: #040404;
  overflow-x: hidden;
}

html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

::-webkit-scrollbar {
  display: none;
}

* {
  scrollbar-width: none;
  box-sizing: border-box;
}

.page-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
}
</style>
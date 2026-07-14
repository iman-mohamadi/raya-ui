<script setup lang="ts">
import FloatingDockDesktop from './FloatingDockDesktop.vue'
import FloatingDockMobile from './FloatingDockMobile.vue'

interface DockItem {
  title: string
  icon: any
  href: string
}

defineProps<{
  items: DockItem[]
  desktopClass?: string
  mobileClass?: string
}>()
</script>

<template>
  <FloatingDockDesktop :items="items" :class="desktopClass" />
  <FloatingDockMobile :items="items" :class="mobileClass" />
</template>
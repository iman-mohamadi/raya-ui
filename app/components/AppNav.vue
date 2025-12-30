<script setup lang="ts">
import { Github, Book, Package, Image as ImageIcon, Menu, ChevronDown } from 'lucide-vue-next'
import {useRoute} from "vue-router";

const config = useAppConfig().raya
const route = useRoute()
const props = defineProps({
  showDoc: {
    type: Boolean,
    default: true
  },
  sortedNavGroups: {
    type: Array,
    default: () => []
  }
})

// --- Mobile Menu State ---
const isMobileMenuOpen = ref(false)

// Close mobile menu when route changes
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header class="bg-background z-30 inset-header">
    <div class="px-4">
      <div class="screen-line-before px-2 screen-line-after flex h-12 items-center justify-between after:z-1 after:transition-[background-color]">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" >
            <NuxtImg src="/logo.svg" class="w-20"/>
          </NuxtLink>
          <VersionBadge />
        </div>

        <div class="flex items-center gap-4">

          <nav class="hidden md:flex items-center gap-4">
            <NuxtLink to="/docs/installation" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors" active-class="text-[oklch(0.82_0.16_195)]">
              Installation
            </NuxtLink>
            <NuxtLink to="/docs/introduction" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors" active-class="text-[oklch(0.82_0.16_195)]">
              Introduction
            </NuxtLink>
            <NuxtLink to="/components" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors" active-class="text-[oklch(0.82_0.16_195)]">
              Components
            </NuxtLink>
          </nav>

          <a :href="config?.github" target="_blank" class="text-zinc-500 hover:text-white transition-colors">
            <Github class="h-5 w-5" />
          </a>
        </div>

      </div>
    </div>
  </header>
</template>
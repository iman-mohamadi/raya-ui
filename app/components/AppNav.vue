<script setup lang="ts">
import {Github} from "lucide-vue-next";
const config = useAppConfig().raya
const props = defineProps({
  showDoc: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
    <div class="container mx-auto flex h-16 items-center justify-between px-6">
      <div class="flex items-center gap-2">
        <NuxtLink to="/" >
          <NuxtImg src="/logo.svg" class="w-20"/>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <NuxtLink to="/docs/introduction" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors" v-if="showDoc">
          Docs
        </NuxtLink>
        <a :href="config?.github" target="_blank" class="text-zinc-500 hover:text-white transition-colors">
          <Github class="h-5 w-5" />
        </a>
      </div>
    </div>
  </header>
</template>
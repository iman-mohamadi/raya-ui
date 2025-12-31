<script setup lang="ts">
import { FloatingDock } from '@/components/ui/floating-dock'
import { Home, User, Settings } from 'lucide-vue-next'

const items = [
  { title: 'Home', icon: Home, href: '#' },
  { title: 'Profile', icon: User, href: '#' },
  { title: 'Settings', icon: Settings, href: '#' },
]
</script>

<template>
  <div class="flex items-center justify-center w-full h-full">
    <div class="scale-75 origin-center">
      <FloatingDock :items="items" desktop-class="bg-background/80 border shadow-sm" />
    </div>
  </div>
</template>
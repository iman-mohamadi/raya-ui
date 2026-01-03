<script setup lang="ts">
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 min-h-[200px] w-full p-10">
    <p class="text-muted-foreground text-sm mb-4">Click the icon to toggle theme</p>
    <div class="flex gap-4 items-center">
      <AnimatedThemeToggler />
      <AnimatedThemeToggler class="bg-zinc-100 dark:bg-zinc-800 rounded-full w-12 h-12" />
      <AnimatedThemeToggler class="border border-input" />
    </div>
  </div>
</template>
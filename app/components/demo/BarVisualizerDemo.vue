<script setup lang="ts">
import { BarVisualizer } from '@/components/ui/bar-visualizer'
</script>

<template>
  <div class="flex items-center justify-center w-full h-full px-4">
    <BarVisualizer
        state="speaking"
        :bar-count="8"
        demo
        class="w-full max-w-md h-30 bg-zinc-900/50 rounded-xl"
    />
  </div>
</template>
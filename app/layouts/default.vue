<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<template>
  <main class="">
    <slot />
    <SpeedInsights />
  </main>
</template>
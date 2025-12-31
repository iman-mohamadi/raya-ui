<script setup lang="ts">
import { PixelatedButton } from '@/components/ui/pixelated-button'
</script>

<template>
  <div class="flex items-center justify-center w-full h-full overflow-hidden">
    <PixelatedButton label="PLAY" :scale="0.5" :show-particles="false" />
  </div>
</template>
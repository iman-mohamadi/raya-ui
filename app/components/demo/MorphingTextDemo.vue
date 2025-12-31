<script setup lang="ts">
import { MorphingText } from '@/components/ui/morphing-text'
</script>

<template>
  <div class="flex items-center justify-center w-full h-full px-4">
    <MorphingText :texts="['Raya', 'Ui']" class="font-bold text-3xl sm:text-5xl text-center" />
  </div>
</template>
<script setup lang="ts">
import { Magnetic } from '@/components/ui/magnetic'
import { Magnet } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center justify-center w-full h-full">
    <Magnetic>
      <div class="p-3 bg-primary/10 rounded-full text-primary">
        <Magnet class="w-6 h-6" />
      </div>
    </Magnetic>
  </div>
</template>
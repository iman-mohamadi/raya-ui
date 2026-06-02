<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  mode: 0 | 1 | 2
}>()

const modeLabel = computed(() => {
  const labels = ['REPULSION', 'ATTRACTION', 'VORTEX']
  return labels[props.mode]
})

const modeColorClass = computed(() => {
  const colors = [
    'text-cyan-400',
    'text-purple-400',
    'text-pink-400'
  ]
  return colors[props.mode]
})

const modeDescription = computed(() => {
  const descriptions = [
    'Push particles away from your cursor',
    'Pull particles toward your cursor',
    'Spin particles in orbital vortex'
  ]
  return descriptions[props.mode]
})
</script>

<template>
  <div class="fixed bottom-6 left-6 z-50 pointer-events-none">
    <!-- Mode indicator with animation -->
    <div class="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-4 text-sm">
      <div class="text-xs text-white/50 uppercase tracking-widest mb-1">Interaction Mode</div>
      <div class="font-bold text-lg transition-colors duration-300" :class="modeColorClass">
        {{ modeLabel }}
      </div>
      <div class="text-xs text-white/40 mt-2">{{ modeDescription }}</div>
      <div class="text-xs text-white/30 mt-3 border-t border-white/10 pt-2">
        Press M or SPACE to switch
      </div>
    </div>
  </div>
</template>

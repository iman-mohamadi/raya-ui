<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const fps = ref(0)
const frameTime = ref(0)
const isVisible = ref(false)

let lastTime = performance.now()
let frameCount = 0
let lastSecond = performance.now()

const updateMetrics = () => {
  const now = performance.now()
  const delta = now - lastTime
  lastTime = now
  frameTime.value = Math.round(delta * 100) / 100
  
  frameCount++
  
  if (now - lastSecond >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastSecond = now
  }
  
  requestAnimationFrame(updateMetrics)
}

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

onMounted(() => {
  updateMetrics()
  window.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
      toggleVisibility()
    }
  })
})
</script>

<template>
  <div v-if="isVisible" class="fixed top-8 left-8 z-50 pointer-events-auto">
    <div class="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 font-mono text-xs text-white/70">
      <div class="space-y-1">
        <div class="text-cyan-400">FPS: {{ fps }}</div>
        <div class="text-cyan-400">Frame: {{ frameTime.toFixed(2) }}ms</div>
        <div class="text-white/50 text-xs mt-2">Press P to toggle</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { InteractionMode } from '~/utils/particleInteractionModes'

const currentMode = ref<InteractionMode>('explosion')

const modeInfo: Record<InteractionMode, { label: string; description: string; color: string }> = {
  explosion: {
    label: 'EXPLOSION',
    description: 'Violent outward particle burst with depth effect',
    color: 'text-orange-400'
  },
  vortex: {
    label: 'VORTEX',
    description: 'Swirling tornado vortex effect',
    color: 'text-purple-400'
  },
  magnet: {
    label: 'MAGNET',
    description: 'Smooth attraction toward cursor',
    color: 'text-cyan-400'
  },
  chaos: {
    label: 'CHAOS',
    description: 'Turbulent chaotic storm motion',
    color: 'text-yellow-400'
  }
}

onMounted(() => {
  const handleModeChange = (e: CustomEvent) => {
    currentMode.value = e.detail.mode
  }
  window.addEventListener('modeChanged', handleModeChange as any)

  return () => {
    window.removeEventListener('modeChanged', handleModeChange as any)
  }
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none flex flex-col items-center justify-center z-40">
    <!-- Mode indicator with animated background -->
    <div class="fixed top-8 right-8 pointer-events-auto">
      <div class="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
        <div class="text-xs text-white/50 uppercase tracking-widest mb-2">Interaction Mode</div>
        <div class="text-xl font-bold mb-1" :class="modeInfo[currentMode].color">
          {{ modeInfo[currentMode].label }}
        </div>
        <div class="text-xs text-white/40">{{ modeInfo[currentMode].description }}</div>
        
        <!-- Mode selector dots -->
        <div class="flex gap-2 mt-4">
          <button
            v-for="mode in ['explosion', 'vortex', 'magnet', 'chaos'] as InteractionMode[]"
            :key="mode"
            @click="currentMode = mode"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="[
              currentMode === mode 
                ? 'bg-white w-8 scale-100' 
                : 'bg-white/30 hover:bg-white/50'
            ]"
            :title="modeInfo[mode].label"
          />
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="fixed bottom-8 left-8 pointer-events-auto">
      <div class="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-3">
        <div class="text-xs text-white/60">
          <div class="mb-2 font-semibold text-white/80">Controls</div>
          <div class="text-xs space-y-1">
            <div><span class="text-cyan-400">SPACE/M</span> - Switch Mode</div>
            <div><span class="text-cyan-400">MOUSE</span> - Interact with Particles</div>
            <div class="text-white/40 mt-2">Move your mouse across the particles!</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cursor ring indicator -->
    <div 
      class="fixed w-24 h-24 border-2 border-cyan-400/50 rounded-full pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200"
      style="margin-left: -48px; margin-top: -48px; box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);"
    />
  </div>
</template>

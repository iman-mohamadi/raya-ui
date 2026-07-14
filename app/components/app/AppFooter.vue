<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-[#030303] text-white border-t border-white/10 pt-32 pb-12 px-6 md:px-12 relative overflow-hidden z-50">

    <div class="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">

      <div class="md:col-span-2 flex flex-col justify-between">
        <div class="space-y-6">
          <div class="size-12 bg-white flex items-center justify-center text-black font-black text-2xl italic rounded-lg">R</div>
          <p class="text-white/40 max-w-sm leading-relaxed text-sm font-medium">
            An exclusive, high-performance component registry for Vue and Nuxt engineers. Copy the code. Own the architecture.
          </p>
        </div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-white/30 mt-12 md:mt-0 flex gap-1">
          © {{ new Date().getFullYear() }} Architected by
          <a href="https://iman-mhmdi.ir" target="_blank" class="text-sky-500 hover:text-sky-400 duration-200">Iman</a>.
        </p>
      </div>

      <div class="space-y-6">
        <h4 class="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-6">Directory</h4>
        <ul class="space-y-4">
          <li><NuxtLink to="/docs/introduction" class="text-sm font-bold uppercase tracking-wide hover:text-white/60 transition-colors">Introduction</NuxtLink></li>
          <li><NuxtLink to="/docs/installation" class="text-sm font-bold uppercase tracking-wide hover:text-white/60 transition-colors">Installation</NuxtLink></li>
          <li><NuxtLink to="/components" class="text-sm font-bold uppercase tracking-wide hover:text-white/60 transition-colors">Components</NuxtLink></li>
        </ul>
      </div>

      <div class="space-y-6">
        <h4 class="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-6">Network</h4>
        <ul class="space-y-4">
          <li><a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="flex items-center text-sm font-bold uppercase tracking-wide hover:text-white/60 transition-colors">GitHub <ArrowUpRight class="size-3 ml-1 opacity-50" /></a></li>
          <li><a href="https://iman-mhmdi.ir" target="_blank" class="flex items-center text-sm font-bold uppercase tracking-wide hover:text-white/60 transition-colors">Creator <ArrowUpRight class="size-3 ml-1 opacity-50" /></a></li>
        </ul>
      </div>

    </div>

    <div class="w-full mt-24 border-t border-white/5 pt-8 flex items-center justify-center pointer-events-none select-none">
      <h1 class="text-[18vw] font-black italic tracking-tighter uppercase leading-none text-transparent text-stroke-1 text-stroke-white opacity-6 shadow-xl">
        RAYA UI
      </h1>
    </div>

  </footer>
</template>

<style scoped>
.text-stroke-1 {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
}
</style>
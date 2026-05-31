<template>
  <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
    <nav class="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl transition-transform hover:scale-105 duration-500 ease-out">
      <NuxtLink to="/docs/installation" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Docs</NuxtLink>
      <NuxtLink to="/components" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Components</NuxtLink>
      <div class="w-px h-4 bg-white/20 mx-2"></div>
      <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors">GitHub</a>
    </nav>
  </div>
</template>
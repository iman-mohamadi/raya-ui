<template>
  <footer class="h-screen flex flex-col justify-end pb-32 items-center text-center text-white/50 relative z-10 pointer-events-auto">
    <div class="max-w-4xl w-full px-6 grid grid-cols-2 md:grid-cols-4 gap-8 backdrop-blur-md bg-black/20 p-12 rounded-3xl border border-white/5">
      <div class="text-left space-y-4">
        <h4 class="text-white font-semibold">Raya UI</h4>
        <ul class="space-y-2 text-sm">
          <li><NuxtLink to="/docs/introduction" class="hover:text-white transition-colors">Introduction</NuxtLink></li>
          <li><NuxtLink to="/components" class="hover:text-white transition-colors">Components</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="mt-12 text-sm">
      &copy; {{ new Date().getFullYear() }} Raya UI. MIT License.
    </div>
  </footer>
</template>
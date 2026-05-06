<script lang="ts" setup>
import {Motion} from 'motion-v'
</script>

<template>
  <div
      class="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary">

    <!-- 2. Decorative Structural Lines (Your Signature Style) -->
    <div
        class="fixed inset-y-0 left-[max(0px,calc(50%-var(--breakpoint-2xl)/2-80px))] w-px bg-gradient-to-b from-transparent via-border to-transparent hidden xl:block"/>
    <div
        class="fixed inset-y-0 right-[max(0px,calc(50%-var(--breakpoint-2xl)/2-80px))] w-px bg-gradient-to-b from-transparent via-border to-transparent hidden xl:block"/>

    <!-- 3. Navigation -->
    <DefaulAppNav/>

    <!-- 4. Main Content Wrapper -->
    <main class="relative z-10 pt-32 pb-20">
      <div class="container max-w-7xl mx-auto px-6">
        <!-- Smooth Entrance Animation for Every Page -->
        <ClientOnly>
          <Motion
              :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
              :initial="{ opacity: 0, y: 20, filter: 'blur(10px)' }"
              :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
          >
            <slot/>
          </Motion>
        </ClientOnly>
      </div>
    </main>

    <!-- 5. Footer -->
    <footer class="relative z-10 py-12 border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div class="container max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex flex-col gap-1">
          <span class="font-bold tracking-tighter uppercase">Raya UI</span>
          <p class="text-xs text-muted-foreground">© 2026 Architected by Iman Mohammadi.</p>
        </div>
        <div class="flex gap-6 text-sm text-muted-foreground">
          <a class="hover:text-foreground transition-colors" href="#">Documentation</a>
          <a class="hover:text-foreground transition-colors" href="#">GitHub</a>
          <a class="hover:text-foreground transition-colors" href="#">Components</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Smooth Scroll for the whole app */
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar for Raya UI */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-muted-foreground);
}
</style>
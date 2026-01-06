<script setup lang="ts">
import Divider from "~/components/Divider.vue";
</script>

<template>
  <div
      class="@container/root grid min-h-[100vh] grid-cols-[1fr_--spacing(4)_minmax(0,var(--breakpoint-2xl))_--spacing(4)_1fr] md:grid-cols-[1fr_--spacing(10)_minmax(0,var(--breakpoint-2xl))_--spacing(10)_1fr] grid-rows-[auto_1fr_auto] relative overflow-clip">
    <div class="col-span-full sticky top-0 z-30">
      <div class="z-30">
        <header class="">
          <AppNav />
        </header>
      </div>
    </div>
    <div
        class="col-start-2 row-span-full row-start-2 text-edge border-x border-x-current bg-patterned"></div>
    <div class="col-start-3">
      <div>
        <Divider/>
        <div class="container mx-auto px-4 relative z-1">
          <slot />
        </div>
      </div>
    </div>
    <AppFooter />
    <div
        class="col-start-4 row-span-full row-start-2 text-edge border-x border-x-current bg-patterned"></div>
  </div>
</template>



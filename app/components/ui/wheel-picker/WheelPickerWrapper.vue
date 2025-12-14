<script setup lang="ts">
import { cn } from '@/lib/utils';

defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="cn($props.class)" data-rwp-wrapper>
    <slot />
  </div>
</template>

<style scoped>
/* Exact CSS from React source */
[data-rwp-wrapper] {
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
  align-items: stretch;
  justify-content: space-between;
  perspective: 2000px; /* <--- THIS FIXES THE VISUAL GLITCH */
  user-select: none;
}

:deep([data-rwp-wrapper] ul) {
  margin: 0;
  padding: 0;
  list-style: none;
}

:deep([data-rwp-wrapper] li) {
  margin: 0;
  padding: 0;
}
</style>
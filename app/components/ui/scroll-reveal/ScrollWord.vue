<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  word: string;
  progress: number;
  range: Array<number>;
}

const props = defineProps<Props>();

const computedOpacity = computed(() => {
  const [start, end] = props.range;
  const progress = props.progress;

  if (progress < start) return 0.2;
  if (progress > end) return 1;

  // Interpolate smoothly between 20% and 100% opacity
  const ratio = (progress - start) / (end - start);
  return 0.2 + ratio * 0.8;
});
</script>

<template>
  <span
      :style="{ opacity: computedOpacity }"
      class="relative inline-block mx-[0.15em] text-foreground transition-opacity duration-70"
  >
    {{ word }}
  </span>
</template>
<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { computed, onMounted, onUnmounted, ref } from "vue";
import ScrollWord from "./ScrollWord.vue";

interface Props {
  class?: string;
  text: string;
}

const props = defineProps<Props>();

const containerRef = ref<HTMLElement | null>(null);
const words = computed(() => props.text.split(" ").filter(w => w.length > 0));
const scrollYProgress = ref(0);
let rafId: number;
let scrollParent: HTMLElement | Window | null = null;

const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
  if (!node || node === document.body) return window;
  if (node.hasAttribute("data-radix-scroll-area-viewport")) return node;

  const overflowY = window.getComputedStyle(node).overflowY;
  if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
    return node;
  }
  return getScrollParent(node.parentElement);
};

function updateScrollYProgress() {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  let containerTop = 0;
  let containerHeight = window.innerHeight;

  if (scrollParent && scrollParent !== window) {
    const parentRect = (scrollParent as HTMLElement).getBoundingClientRect();
    containerTop = parentRect.top;
    containerHeight = parentRect.height;
  }

  // Animation triggers when element enters 85% of viewport
  // Animation finishes when element reaches 45% of viewport
  const startThreshold = containerHeight * 0.85;
  const endThreshold = containerHeight * 0.45;

  const relativeTop = rect.top - containerTop;
  const currentProgress = (startThreshold - relativeTop) / (startThreshold - endThreshold);

  scrollYProgress.value = Math.max(0, Math.min(1, currentProgress));

  rafId = requestAnimationFrame(updateScrollYProgress);
}

onMounted(() => {
  scrollParent = getScrollParent(containerRef.value);
  rafId = requestAnimationFrame(updateScrollYProgress);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <p
      ref="containerRef"
      :class="cn('flex flex-wrap justify-center text-center text-4xl font-bold tracking-tight leading-relaxed text-foreground', props.class)"
  >
    <ScrollWord
        v-for="(word, i) in words"
        :key="i"
        :word="word"
        :progress="scrollYProgress"
        :range="[i / words.length, (i + 1) / words.length]"
    />
  </p>
</template>
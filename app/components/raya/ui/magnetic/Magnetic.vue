<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { Motion } from "motion-v";
import { useEventListener, useMouseInElement } from "@vueuse/core";

type SpringOptions = {
  stiffness?: number;
  damping?: number;
  mass?: number;
};

type MagneticProps = {
  intensity?: number;
  range?: number;
  actionArea?: "self" | "parent" | "global";
  springOptions?: SpringOptions;
};

const props = withDefaults(defineProps<MagneticProps>(), {
  intensity: 0.6,
  range: 100,
  actionArea: "self",
  springOptions: () => ({ stiffness: 26.7, damping: 4.1, mass: 0.2 }),
});

const elementRef = ref<InstanceType<typeof Motion> | null>(null);
const isHovered = ref(false);

// Physics State
const targetX = ref(0);
const targetY = ref(0);
const currentX = ref(0);
const currentY = ref(0);

let velocityX = 0;
let velocityY = 0;
let animationFrameId: number;

const updatePhysics = () => {
  // Use a fixed time step for stability (approx 60fps)
  const dt = 1 / 60;

  const { stiffness, damping, mass } = props.springOptions;

  // Spring force calculation: F = -kx - cv
  // Acceleration: a = F / m

  const forceX = -stiffness * (currentX.value - targetX.value) - damping * velocityX;
  const accelX = forceX / mass;

  const forceY = -stiffness * (currentY.value - targetY.value) - damping * velocityY;
  const accelY = forceY / mass;

  // Euler integration
  velocityX += accelX * dt;
  velocityY += accelY * dt;

  currentX.value += velocityX * dt;
  currentY.value += velocityY * dt;

  animationFrameId = requestAnimationFrame(updatePhysics);
};

const handleMouseMove = (e: MouseEvent) => {
  const el = elementRef.value?.$el as HTMLElement;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distanceX = e.clientX - centerX;
  const distanceY = e.clientY - centerY;

  const absoluteDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

  if (isHovered.value && absoluteDistance <= props.range) {
    const scale = 1 - absoluteDistance / props.range;
    targetX.value = distanceX * props.intensity * scale;
    targetY.value = distanceY * props.intensity * scale;
  } else {
    targetX.value = 0;
    targetY.value = 0;
  }
};

// Handle Hover Logic
onMounted(() => {
  const el = elementRef.value?.$el as HTMLElement;
  if (!el) return;

  // Start Physics Loop
  updatePhysics();

  // Attach Mouse Listener Global
  window.addEventListener('mousemove', handleMouseMove);

  // Determine Action Area
  if (props.actionArea === 'global') {
    isHovered.value = true;
  } else {
    const triggerEl = props.actionArea === 'parent' ? el.parentElement : el;
    if (triggerEl) {
      triggerEl.addEventListener('mouseenter', () => isHovered.value = true);
      triggerEl.addEventListener('mouseleave', () => {
        isHovered.value = false;
        targetX.value = 0;
        targetY.value = 0;
      });
    }
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<template>
  <Motion
      ref="elementRef"
      :style="{ x: currentX, y: currentY }"
  >
    <slot />
  </Motion>
</template>
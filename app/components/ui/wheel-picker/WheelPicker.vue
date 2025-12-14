{
type: uploaded file
fileName: iman-mohamadi/enzoui/EnzOUi-481682bc4f3f825c0131815bd4179e5da136063e/app/components/ui/wheel-picker/WheelPicker.vue
fullContent:
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

// --- Types ---
export type WheelPickerValue = string | number;

export interface WheelPickerOption<T extends WheelPickerValue = string | number> {
  value: T;
  label: string | number;
}

export interface WheelPickerClassNames {
  optionItem?: string;
  highlightWrapper?: string;
  highlightItem?: string;
}

interface Props {
  modelValue?: WheelPickerValue; // v-model
  defaultValue?: WheelPickerValue;
  options: WheelPickerOption[];
  infinite?: boolean;
  visibleCount?: number;
  dragSensitivity?: number;
  scrollSensitivity?: number;
  optionItemHeight?: number;
  classNames?: WheelPickerClassNames;
}

const props = withDefaults(defineProps<Props>(), {
  infinite: false,
  visibleCount: 20,
  dragSensitivity: 3,
  scrollSensitivity: 5,
  optionItemHeight: 30,
  options: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: WheelPickerValue): void;
  (e: 'change', value: WheelPickerValue): void;
}>();

// --- Constants ---
const RESISTANCE = 0.3;
const MAX_VELOCITY = 30;

const easeOutCubic = (p: number) => Math.pow(p - 1, 3) + 1;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

// --- State & Refs ---
const containerRef = ref<HTMLElement | null>(null);
const wheelItemsRef = ref<HTMLElement | null>(null);
const highlightListRef = ref<HTMLElement | null>(null);

const internalValue = ref<WheelPickerValue>(
    props.modelValue ?? props.defaultValue ?? props.options[0]?.value
);

const scrollPos = ref(0);
const moveId = ref(0);
const isDragging = ref(false);
const lastWheelTime = ref(0);

const touchData = {
  startY: 0,
  yList: [] as [number, number][],
  touchScroll: 0,
  isClick: true,
};

let dragController: AbortController | null = null;

// --- Computed Layouts ---
const itemHeight = computed(() => props.optionItemHeight);
const halfItemHeight = computed(() => itemHeight.value * 0.5);
const safeVisibleCount = computed(() => Math.max(4, props.visibleCount));
const itemAngle = computed(() => 360 / safeVisibleCount.value);
const radius = computed(() => itemHeight.value / Math.tan((itemAngle.value * Math.PI) / 180));
const containerHeight = computed(() => Math.round(radius.value * 2 + itemHeight.value * 0.25));
const quarterCount = computed(() => safeVisibleCount.value >> 2);
const baseDeceleration = computed(() => props.dragSensitivity * 10);
const snapBackDeceleration = 10;

const displayOptions = computed(() => {
  if (!props.infinite) return props.options;

  const result: WheelPickerOption[] = [];
  const halfCount = Math.ceil(safeVisibleCount.value / 2);

  if (props.options.length === 0) return result;

  let tempOptions = [...props.options];
  while (result.length < halfCount) {
    result.push(...tempOptions);
  }
  return result;
});

const renderItems = computed(() => {
  const items: Array<{
    option: WheelPickerOption;
    index: number;
    angle: number;
    key: string | number;
    style: any
  }> = [];

  const getStyle = (angle: number) => ({
    top: `${-halfItemHeight.value}px`,
    height: `${itemHeight.value}px`,
    lineHeight: `${itemHeight.value}px`,
    transform: `rotateX(${angle}deg) translateZ(${radius.value}px)`,
    // IMPORTANT: visibility is handled by JS updateStyles
  });

  displayOptions.value.forEach((option, index) => {
    items.push({
      option,
      index,
      angle: -itemAngle.value * index,
      key: index,
      style: getStyle(-itemAngle.value * index)
    });
  });

  if (props.infinite) {
    for (let i = 0; i < quarterCount.value; ++i) {
      const prependIndex = -i - 1;
      const appendIndex = i + displayOptions.value.length;

      const preOption = displayOptions.value[displayOptions.value.length - i - 1];
      items.unshift({
        option: preOption,
        index: prependIndex,
        angle: itemAngle.value * (i + 1),
        key: `pre-${i}`,
        style: getStyle(itemAngle.value * (i + 1))
      });

      const postOption = displayOptions.value[i];
      items.push({
        option: postOption,
        index: appendIndex,
        angle: -itemAngle.value * appendIndex,
        key: `post-${i}`,
        style: getStyle(-itemAngle.value * appendIndex)
      });
    }
  }

  return items;
});

const renderHighlightItems = computed(() => {
  const items = displayOptions.value.map((option, index) => ({
    option,
    key: index
  }));

  if (props.infinite && displayOptions.value.length > 0) {
    const firstItem = displayOptions.value[0];
    const lastItem = displayOptions.value[displayOptions.value.length - 1];
    items.unshift({ option: lastItem, key: 'infinite-start' });
    items.push({ option: firstItem, key: 'infinite-end' });
  }

  return items;
});

const wheelSegmentPositions = computed(() => {
  let positionAlongWheel = 0;
  const degToRad = Math.PI / 180;
  const segmentRanges: [number, number][] = [];

  for (let i = quarterCount.value - 1; i >= -quarterCount.value + 1; --i) {
    const angle = i * itemAngle.value;
    const segmentLength = itemHeight.value * Math.cos(angle * degToRad);
    const start = positionAlongWheel;
    positionAlongWheel += segmentLength;
    segmentRanges.push([start, positionAlongWheel]);
  }
  return segmentRanges;
});

// --- Core Logic ---

const normalizeScroll = (scroll: number) => {
  const length = displayOptions.value.length;
  if (length === 0) return 0;
  return ((scroll % length) + length) % length;
};

const updateStyles = (scroll: number) => {
  const normalizedScroll = props.infinite ? normalizeScroll(scroll) : scroll;

  if (wheelItemsRef.value) {
    const transform = `translateZ(${-radius.value}px) rotateX(${itemAngle.value * normalizedScroll}deg)`;
    wheelItemsRef.value.style.transform = transform;

    const children = wheelItemsRef.value.children;
    for (let i = 0; i < children.length; i++) {
      const li = children[i] as HTMLElement;
      const indexStr = li.dataset.index;
      if (indexStr !== undefined) {
        const index = parseFloat(indexStr);
        const distance = Math.abs(index - normalizedScroll);

        // 1. Visibility Culling: Hide items far away for performance
        const isVisible = distance <= quarterCount.value;
        li.style.visibility = isVisible ? "visible" : "hidden";

        // 2. Ghosting Fix:
        // If the item is very close to the center (distance < 0.3),
        // we hide the 3D version so it doesn't overlap with the Highlight version.
        // We use opacity for a smoother transition than visibility.
        if (isVisible) {
          if (distance < 0.3) {
            li.style.opacity = "0"; // Hide 3D item, show only Highlight item
          } else {
            li.style.opacity = "1"; // Show 3D item
          }
        }
      }
    }
  }

  if (highlightListRef.value) {
    highlightListRef.value.style.transform = `translateY(${-normalizedScroll * itemHeight.value}px)`;
  }

  return normalizedScroll;
};

const scrollTo = (scroll: number) => {
  return updateStyles(scroll);
};

const cancelAnimation = () => {
  cancelAnimationFrame(moveId.value);
};

const animateScroll = (
    startScroll: number,
    endScroll: number,
    duration: number,
    onComplete?: () => void
) => {
  if (startScroll === endScroll || duration === 0) {
    scrollTo(startScroll);
    return;
  }

  const startTime = performance.now();
  const totalDistance = endScroll - startScroll;

  const tick = (currentTime: number) => {
    const elapsed = (currentTime - startTime) / 1000;

    if (elapsed < duration) {
      const progress = easeOutCubic(elapsed / duration);
      scrollPos.value = scrollTo(startScroll + progress * totalDistance);
      moveId.value = requestAnimationFrame(tick);
    } else {
      cancelAnimation();
      scrollPos.value = scrollTo(endScroll);
      onComplete?.();
    }
  };

  moveId.value = requestAnimationFrame(tick);
};

const selectByScroll = (scroll: number) => {
  const normalized = normalizeScroll(scroll) | 0;
  const length = displayOptions.value.length;
  if (!length) return;

  const boundedScroll = props.infinite
      ? normalized
      : Math.min(Math.max(normalized, 0), length - 1);

  if (!props.infinite && boundedScroll !== scroll) return;

  scrollPos.value = scrollTo(boundedScroll);

  const selectedOption = displayOptions.value[scrollPos.value];
  if (selectedOption) {
    internalValue.value = selectedOption.value;
    emit('update:modelValue', selectedOption.value);
    emit('change', selectedOption.value);
  }
};

const selectByValue = (val: WheelPickerValue) => {
  const index = displayOptions.value.findIndex((opt) => opt.value === val);
  if (index === -1) {
    if (displayOptions.value.length > 0) {
      scrollPos.value = scrollTo(0);
    }
    return;
  }
  cancelAnimation();
  scrollPos.value = scrollTo(index);
};

const scrollByStep = (step: number) => {
  const startScroll = scrollPos.value;
  let endScroll = startScroll + step;

  if (props.infinite) {
    endScroll = Math.round(endScroll);
  } else {
    endScroll = clamp(Math.round(endScroll), 0, displayOptions.value.length - 1);
  }

  const distance = Math.abs(endScroll - startScroll);
  if (distance === 0) return;

  const duration = Math.sqrt(distance / props.scrollSensitivity);

  cancelAnimation();
  animateScroll(startScroll, endScroll, duration, () => {
    selectByScroll(scrollPos.value);
  });
};

// --- Input Handlers ---

const handleWheelItemClick = (clientY: number) => {
  const container = containerRef.value;
  if (!container) return;

  const { top } = container.getBoundingClientRect();
  const clickOffsetY = clientY - top;

  const clickedSegmentIndex = wheelSegmentPositions.value.findIndex(
      ([start, end]) => clickOffsetY >= start && clickOffsetY <= end
  );

  if (clickedSegmentIndex === -1) return;

  const stepsToScroll = (quarterCount.value - clickedSegmentIndex - 1) * -1;
  scrollByStep(stepsToScroll);
};

const updateScrollDuringDrag = (e: MouseEvent | TouchEvent) => {
  const currentY = (window.TouchEvent && e instanceof TouchEvent ? e.touches?.[0]?.clientY : (e as MouseEvent).clientY) || 0;

  if (touchData.isClick) {
    const dragThreshold = 5;
    if (Math.abs(currentY - touchData.startY) > dragThreshold) {
      touchData.isClick = false;
    }
  }

  touchData.yList.push([currentY, Date.now()]);
  if (touchData.yList.length > 5) touchData.yList.shift();

  const dragDelta = (touchData.startY - currentY) / itemHeight.value;
  let nextScroll = scrollPos.value + dragDelta;

  if (props.infinite) {
    nextScroll = normalizeScroll(nextScroll);
  } else {
    const maxIndex = displayOptions.value.length;
    if (nextScroll < 0) nextScroll *= RESISTANCE;
    else if (nextScroll > maxIndex) nextScroll = maxIndex + (nextScroll - maxIndex) * RESISTANCE;
  }

  touchData.touchScroll = updateStyles(nextScroll);
};

const handleDragMoveEvent = (event: Event) => {
  const e = event as MouseEvent | TouchEvent;
  if (!isDragging.value && !containerRef.value?.contains(e.target as Node) && e.target !== containerRef.value) {
    return;
  }
  if (e.cancelable) e.preventDefault();
  if (displayOptions.value.length) updateScrollDuringDrag(e);
};

const initiateDragGesture = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  dragController = new AbortController();
  const { signal } = dragController;
  const passiveOpts = { signal, passive: false } as AddEventListenerOptions;

  containerRef.value?.addEventListener('touchmove', handleDragMoveEvent, passiveOpts);
  document.addEventListener('mousemove', handleDragMoveEvent, passiveOpts);

  const startY = (window.TouchEvent && event instanceof TouchEvent ? event.touches?.[0]?.clientY : (event as MouseEvent).clientY) || 0;

  touchData.startY = startY;
  touchData.yList = [[startY, Date.now()]];
  touchData.touchScroll = scrollPos.value;
  touchData.isClick = true;

  cancelAnimation();
};

const decelerateAndAnimateScroll = (initialVelocity: number) => {
  scrollPos.value = touchData.touchScroll;

  const currentScroll = scrollPos.value;
  let targetScroll = currentScroll;
  let deceleration = initialVelocity > 0 ? -baseDeceleration.value : baseDeceleration.value;
  let duration = 0;

  if (props.infinite) {
    duration = Math.abs(initialVelocity / deceleration);
    const scrollDistance = initialVelocity * duration + 0.5 * deceleration * duration * duration;
    targetScroll = Math.round(currentScroll + scrollDistance);
  } else if (currentScroll < 0 || currentScroll > displayOptions.value.length - 1) {
    const target = clamp(currentScroll, 0, displayOptions.value.length - 1);
    const scrollDistance = currentScroll - target;
    deceleration = snapBackDeceleration;
    duration = Math.sqrt(Math.abs(scrollDistance / deceleration));
    initialVelocity = deceleration * duration;
    initialVelocity = currentScroll > 0 ? -initialVelocity : initialVelocity;
    targetScroll = target;
  } else {
    duration = Math.abs(initialVelocity / deceleration);
    const scrollDistance = initialVelocity * duration + 0.5 * deceleration * duration * duration;
    targetScroll = Math.round(currentScroll + scrollDistance);
    targetScroll = clamp(targetScroll, 0, displayOptions.value.length - 1);

    const adjustedDistance = targetScroll - currentScroll;
    duration = Math.sqrt(Math.abs(adjustedDistance / deceleration));
  }

  animateScroll(currentScroll, targetScroll, duration, () => {
    selectByScroll(scrollPos.value);
  });

  // Fallback sync
  selectByScroll(scrollPos.value);
};

const finalizeDragAndStartInertiaScroll = () => {
  dragController?.abort();
  dragController = null;
  isDragging.value = false;

  if (touchData.isClick) {
    handleWheelItemClick(touchData.startY);
    return;
  }

  const yList = touchData.yList;
  let velocity = 0;

  if (yList.length > 1) {
    const [startY, startTime] = yList[yList.length - 2] || [0, 0];
    const [endY, endTime] = yList[yList.length - 1] || [0, 0];
    const timeDiff = endTime - startTime;
    if (timeDiff > 0) {
      const distance = startY - endY;
      const velocityPerSecond = ((distance / itemHeight.value) * 1000) / timeDiff;
      const direction = velocityPerSecond > 0 ? 1 : -1;
      velocity = Math.min(Math.abs(velocityPerSecond), MAX_VELOCITY) * direction;
    }
  }

  decelerateAndAnimateScroll(velocity);
};

const handleDragStartEvent = (event: Event) => {
  const e = event as MouseEvent | TouchEvent;
  const isTargetValid = !!containerRef.value?.contains(e.target as Node) || e.target === containerRef.value;

  if ((isDragging.value || isTargetValid) && e.cancelable) {
    e.preventDefault();
    if (displayOptions.value.length) initiateDragGesture(e);
  }
};

const handleDragEndEvent = (event: Event) => {
  const e = event as MouseEvent | TouchEvent;
  if (!displayOptions.value.length) return;

  const isTargetValid = !!containerRef.value?.contains(e.target as Node) || e.target === containerRef.value;

  if ((isDragging.value || isTargetValid) && e.cancelable) {
    e.preventDefault();
    finalizeDragAndStartInertiaScroll();
  }
};

const handleWheelEvent = (event: Event) => {
  const e = event as WheelEvent;
  if (!displayOptions.value.length || !containerRef.value) return;

  const isTargetValid = containerRef.value.contains(e.target as Node) || e.target === containerRef.value;
  if ((isDragging.value || isTargetValid) && e.cancelable) {
    e.preventDefault();

    const now = Date.now();
    if (now - lastWheelTime.value < 100) return;

    const direction = Math.sign(e.deltaY);
    if (!direction) return;

    lastWheelTime.value = now;
    scrollByStep(direction);
  }
};

// --- Lifecycle & Watchers ---

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== internalValue.value) {
    internalValue.value = newVal;
    selectByValue(newVal);
  }
});

watch(() => props.options, () => {
  nextTick(() => {
    selectByValue(internalValue.value);
  });
}, { deep: true });

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  const opts = { passive: false };
  container.addEventListener("touchstart", handleDragStartEvent, opts);
  container.addEventListener("touchend", handleDragEndEvent, opts);
  container.addEventListener("wheel", handleWheelEvent, opts);
  document.addEventListener("mousedown", handleDragStartEvent, opts);
  document.addEventListener("mouseup", handleDragEndEvent, opts);

  // Initial selection
  nextTick(() => {
    selectByValue(internalValue.value);
  });
});

onUnmounted(() => {
  const container = containerRef.value;
  if (container) {
    container.removeEventListener("touchstart", handleDragStartEvent);
    container.removeEventListener("touchend", handleDragEndEvent);
    container.removeEventListener("wheel", handleWheelEvent);
  }
  document.removeEventListener("mousedown", handleDragStartEvent);
  document.removeEventListener("mouseup", handleDragEndEvent);
  dragController?.abort();
  cancelAnimation();
});
</script>

<template>
  <div
      ref="containerRef"
      class="rwp-wrapper"
      :class="classNames?.highlightWrapper"
      :style="{ height: `${containerHeight}px` }"
      tabindex="0"
      role="listbox"
      :aria-label="'Choose an option'"
  >
    <ul ref="wheelItemsRef" class="rwp-options">
      <li
          v-for="item in renderItems"
          :key="item.key"
          :data-index="item.index"
          class="rwp-option-item text-muted-foreground"
          :class="classNames?.optionItem"
          :style="item.style"
      >
        {{ item.option.label }}
      </li>
    </ul>

    <div
        class="rwp-highlight-wrapper"
        :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }"
    >
      <ul
          ref="highlightListRef"
          class="rwp-highlight-list"
          :style="{ top: infinite ? `${-itemHeight}px` : undefined }"
      >
        <li
            v-for="item in renderHighlightItems"
            :key="item.key"
            class="rwp-highlight-item text-foreground"
            :class="classNames?.highlightItem"
            :style="{ height: `${itemHeight}px` }"
        >
          {{ item.option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Reset & Base */
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  margin: 0;
  padding: 0;
}

.rwp-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
  align-items: stretch;
  justify-content: space-between;
  perspective: 2000px;
  user-select: none;
  /* Mask Image for fade effect - keeps 3D look */
  mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      black 20%,
      black 80%,
      transparent 100%
  );
  -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      black 20%,
      black 80%,
      transparent 100%
  );
  cursor: grab;
}

.rwp-wrapper:active {
  cursor: grabbing;
}

/* Center Highlight Bar */
.rwp-highlight-wrapper {
  position: absolute;
  overflow: hidden;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  font-size: 1rem;
  font-weight: 500;
  pointer-events: none;
  /* Use theme border color */
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.rwp-highlight-list {
  position: absolute;
  width: 100%;
  left: 0;
}

/* 3D Rotating List */
.rwp-options {
  position: absolute;
  top: 50%;
  left: 0;
  display: block;
  width: 100%;
  height: 0;
  margin: 0 auto;
  -webkit-font-smoothing: subpixel-antialiased;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.rwp-option-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
  will-change: visibility;
  font-size: 0.875rem;
  /* Use theme muted foreground for unselected items */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Transition opacity for smoother ghosting fix */
  transition: opacity 0.1s linear;
}

.rwp-highlight-item {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Adapts to parent color (Dark Mode friendly) */
  color: currentColor;
}
</style>
}
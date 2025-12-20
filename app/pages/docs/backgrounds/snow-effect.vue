<script setup lang="ts">
import { SnowEffect } from '@/components/ui/snow-effect'
import { CodeBlock } from '@/components/ui/code-block'
import { AnimatedTabs } from '@/components/ui/animated-tabs'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- Tabs ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

const installationCode = `npx shadcn-vue@latest add ${config.baseUrl}/snow-effect.json`

const usageCode = `<script setup lang="ts">
import { SnowEffect } from '@/components/ui/snow-effect'
<\/script>

<template>
  <div class="relative w-full h-[400px] bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
    <SnowEffect
      color="#ffffff"
      :quantity="100"
      :speed="1"
      class="z-10"
    />

    <div class="z-20 text-center">
      <h1 class="text-4xl font-bold text-white tracking-tighter">
        Winter is Coming
      </h1>
      <p class="text-slate-400 mt-2">Pure Vue + Canvas Snowfall</p>
    </div>
  </div>
</template>`

const componentCode = `<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, computed } from "vue";
import { useDevicePixelRatio } from "@vueuse/core";
import { cn } from "@/lib/utils";

type Snowflake = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  dx: number; // Horizontal drift
  dy: number; // Vertical fall speed
};

type Props = {
  color?: string;
  quantity?: number;
  speed?: number;
  maxRadius?: number;
  minRadius?: number;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  color: "#FFF",
  quantity: 100,
  speed: 1,
  maxRadius: 3,
  minRadius: 1,
  class: "",
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const snowflakes = ref<Snowflake[]>([]);
const canvasSize = reactive<{ w: number; h: number }>({ w: 0, h: 0 });
const { pixelRatio } = useDevicePixelRatio();

const color = computed(() => {
  const hex = props.color.replace(/^#/, "").padStart(6, "0");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return \`\${r} \${g} \${b}\`;
});

onMounted(() => {
  if (canvasRef.value) context.value = canvasRef.value.getContext("2d");
  initCanvas();
  animate();
  window.addEventListener("resize", initCanvas);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", initCanvas);
});

function initCanvas() {
  resizeCanvas();
  createSnowflakes();
}

function resizeCanvas() {
  if (canvasContainerRef.value && canvasRef.value && context.value) {
    snowflakes.value.length = 0;
    canvasSize.w = canvasContainerRef.value.offsetWidth;
    canvasSize.h = canvasContainerRef.value.offsetHeight;
    canvasRef.value.width = canvasSize.w * pixelRatio.value;
    canvasRef.value.height = canvasSize.h * pixelRatio.value;
    canvasRef.value.style.width = \`\${canvasSize.w}px\`;
    canvasRef.value.style.height = \`\${canvasSize.h}px\`;
    context.value.scale(pixelRatio.value, pixelRatio.value);
  }
}

function createSnowflakes() {
  for (let i = 0; i < props.quantity; i++) {
    const snowflake = createSnowflake();
    snowflakes.value.push(snowflake);
  }
}

function createSnowflake(): Snowflake {
  const x = Math.random() * canvasSize.w;
  const y = Math.random() * canvasSize.h;
  const size = Math.random() * (props.maxRadius! - props.minRadius!) + props.minRadius!;
  const alpha = Math.random() * 0.5 + 0.5;
  const dx = (Math.random() - 0.5) * 0.5;
  const dy = Math.random() * 0.25 + props.speed;
  return { x, y, size, alpha, dx, dy };
}

function drawSnowflake(snowflake: Snowflake) {
  if (context.value) {
    const { x, y, size, alpha } = snowflake;
    context.value.beginPath();
    context.value.arc(x, y, size, 0, Math.PI * 2);
    context.value.fillStyle = \`rgba(\${color.value.split(" ").join(", ")}, \${alpha})\`;
    context.value.fill();
  }
}

function animate() {
  if (context.value) context.value.clearRect(0, 0, canvasSize.w, canvasSize.h);
  snowflakes.value.forEach((snowflake) => {
    snowflake.x += snowflake.dx;
    snowflake.y += snowflake.dy;
    if (snowflake.y > canvasSize.h) {
      snowflake.y = -snowflake.size;
      snowflake.x = Math.random() * canvasSize.w;
    }
    drawSnowflake(snowflake);
  });
  requestAnimationFrame(animate);
}
<\/script>

<template>
  <div
    ref="canvasContainerRef"
    :class="cn('pointer-events-none absolute inset-0', props.class)"
    aria-hidden="true"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">
    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Snow Effect</h1>
      <p class="text-xl text-muted-foreground">
        A peaceful, falling snow effect rendered on an HTML5 Canvas.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-border bg-slate-950 p-10 h-[400px] flex items-center justify-center overflow-hidden">
          <SnowEffect
              color="#ffffff"
              :quantity="150"
              :speed="1"
              class="z-10"
          />
          <div class="z-20 text-center relative pointer-events-none">
            <h1 class="text-4xl font-bold text-white tracking-tighter">
              Winter Mode
            </h1>
            <p class="text-slate-400 mt-2">Adjust quantity and speed via props</p>
          </div>
        </div>
      </template>
      <template #code>
        <div class="mt-4">
          <CodeBlock :code="usageCode"/>
        </div>
      </template>
    </AnimatedTabs>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installationCode" file-name="Terminal" />
        </template>
        <template #manual>
          <div class="space-y-6">
            <div class="space-y-2">
              <h3 class="text-base font-medium">1. Install Dependencies</h3>
              <CodeBlock code="npm install @vueuse/core" file-name="Terminal" />
            </div>
            <div class="space-y-2">
              <h3 class="text-base font-medium">2. Create Component</h3>
              <p class="text-sm text-muted-foreground">
                Copy the code below into <code class="bg-muted px-1 py-0.5 rounded">components/ui/snow-effect/SnowEffect.vue</code>
              </p>
              <CodeBlock :code="componentCode" file-name="components/ui/snow-effect/SnowEffect.vue" />
            </div>
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-border bg-card">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-border bg-muted/50 text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-border text-foreground">
          <tr>
            <td class="px-4 py-3 font-mono text-primary">color</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">"#FFF"</td>
            <td class="px-4 py-3">The color of the snowflakes (Hex code).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">quantity</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">100</td>
            <td class="px-4 py-3">The number of snowflakes to render.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">speed</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">1</td>
            <td class="px-4 py-3">The vertical falling speed multiplier.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">minRadius</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">1</td>
            <td class="px-4 py-3">Minimum radius of a snowflake.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">maxRadius</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">3</td>
            <td class="px-4 py-3">Maximum radius of a snowflake.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
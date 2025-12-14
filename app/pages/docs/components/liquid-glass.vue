<script setup lang="ts">
import { GripVertical } from 'lucide-vue-next'
import { useElementBounding, useDraggable } from '@vueuse/core'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { AmbientGrid } from '@/components/ui/ambient-grid'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

// --- Draggable Setup ---
const dragEl = ref<HTMLElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)

// 1. Get bounds of both container and element
const container = useElementBounding(containerEl)
const element = useElementBounding(dragEl)

// 2. Store LOCAL coordinates (Relative to container top-left)
// Initial position: centered-ish
const position = ref({ x: 100, y: 100 })

// 3. Handle Dragging with Clamping
useDraggable(dragEl, {
  preventDefault: true,
  onMove: (e) => {
    if (!container.width.value || !element.width.value) return

    // Calculate raw local position from mouse event
    // e.x is viewport x, container.left.value is viewport x of container
    const rawX = e.x - container.left.value
    const rawY = e.y - container.top.value

    // Calculate max boundaries
    const maxX = container.width.value - element.width.value
    const maxY = container.height.value - element.height.value

    // Clamp values to keep inside box
    position.value.x = Math.max(0, Math.min(rawX, maxX))
    position.value.y = Math.max(0, Math.min(rawY, maxY))
  }
})

// 4. Center on Mount (Optional polish)
onMounted(() => {
  // Small delay to ensure bounds are calculated
  setTimeout(() => {
    if (container.width.value && element.width.value) {
      position.value.x = (container.width.value / 2) - (element.width.value / 2)
      position.value.y = (container.height.value / 2) - (element.height.value / 2)
    }
  }, 100)
})

// --- Tabs Configuration ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

const packageManagerTabs = [
  { label: 'npm', slot: 'npm' },
  { label: 'pnpm', slot: 'pnpm' },
  { label: 'yarn', slot: 'yarn' },
  { label: 'bun', slot: 'bun' }
]

// --- Code Snippets ---
const installCommands = {
  npm: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/liquid-glass.json',
  pnpm: 'pnpm dlx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/liquid-glass.json',
  yarn: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/liquid-glass.json',
  bun: 'bunx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/liquid-glass.json',
  manual: `Copy the component code manually.`
}

const previewCode = `<template>
  <div class="relative w-full h-96 bg-zinc-950 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
    <h1 class="text-9xl font-bold opacity-10 absolute top-10 left-10">REFRACT</h1>

    <LiquidGlass class="w-64 h-40" :radius="24" :blur="15" :scale="-40" :lightness="30" :gOffset="10" :bOffset="10">
      <div class="flex items-center justify-center h-full w-full bg-white/5 p-6">
        <p class="text-white font-medium">Drag me around!</p>
      </div>
    </LiquidGlass>
  </div>
</template>`

const usageCode = `<template>
  <LiquidGlass :radius="30" :scale="-180" :blur="10">
    <div class="p-6">
      <h2 class="text-white text-lg font-bold">Glass Card</h2>
      <p class="text-zinc-300">Content inside the glass.</p>
    </div>
  </LiquidGlass>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Liquid Glass</h1>
      <p class="text-xl text-zinc-400">
        An Apple-style chromatic aberration and displacement effect for Vue.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-zinc-950 mt-4 overflow-hidden h-[500px]">

          <div ref="containerEl" class="absolute inset-0 overflow-hidden select-none">
            <AmbientGrid :grid-size="40" color1="#a855f7" color2="#3b82f6" />

            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <h1 class="text-[12rem] font-black text-white/5 leading-none tracking-tighter">GLASS</h1>
              <h1 class="text-[12rem] font-black text-white/5 leading-none tracking-tighter">EFFECT</h1>
            </div>

            <div
                ref="dragEl"
                :style="{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                position: 'absolute',
                top: 0,
                left: 0,
                touchAction: 'none'
              }"
                class="absolute z-20 cursor-grab active:cursor-grabbing will-change-transform"
            >
              <LiquidGlass class="w-72 h-48" :radius="24" :blur="15" :scale="-40" :lightness="30" :gOffset="10" :bOffset="10">
                <div class="h-full w-full flex flex-col justify-between p-6 bg-white/5">
                  <div class="flex justify-between items-start">
                    <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <div class="h-4 w-4 bg-white rounded-full"></div>
                    </div>
                    <GripVertical class="text-white/50" />
                  </div>
                  <div>
                    <p class="text-white/60 text-sm font-medium uppercase tracking-wider">Balance</p>
                    <p class="text-white text-3xl font-bold tracking-tight">$12,450.00</p>
                  </div>
                </div>
              </LiquidGlass>
            </div>

            <div class="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <span class="text-xs text-zinc-500 bg-black/50 px-3 py-1 rounded-full border border-white/10">
              Try dragging the card to see the refraction
            </span>
            </div>
          </div>
        </div>
      </template>
      <template #code>
        <div class="mt-4">
          <CodeBlock :code="previewCode" lang="html" file-name="Demo.vue" />
        </div>
      </template>
    </AnimatedTabs>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Installation
      </h2>

      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <AnimatedTabs :items="packageManagerTabs" variant="link" class="w-full">
            <template #npm>
              <CodeBlock :code="installCommands.npm"  class="mt-4" />
            </template>
            <template #pnpm>
              <CodeBlock :code="installCommands.pnpm"  class="mt-4" />
            </template>
            <template #yarn>
              <CodeBlock :code="installCommands.yarn"  class="mt-4" />
            </template>
            <template #bun>
              <CodeBlock :code="installCommands.bun"  class="mt-4" />
            </template>
          </AnimatedTabs>
        </template>

        <template #manual>
          <div class="mt-4 space-y-4">
            <p class="text-sm text-zinc-400">Copy the component code into your project.</p>
            <CodeBlock :code="installCommands.manual"  />
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Usage
      </h2>
      <CodeBlock :code="usageCode" lang="html" />
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">radius</td>
            <td class="px-4 py-3 font-mono text-xs">16</td>
            <td class="px-4 py-3">Border radius of the glass container.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">scale</td>
            <td class="px-4 py-3 font-mono text-xs">-180</td>
            <td class="px-4 py-3">Intensity of the displacement/refraction.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">blur</td>
            <td class="px-4 py-3 font-mono text-xs">11</td>
            <td class="px-4 py-3">Blur amount for the internal displacement map.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">alpha</td>
            <td class="px-4 py-3 font-mono text-xs">0.93</td>
            <td class="px-4 py-3">Opacity of the internal shape mask.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
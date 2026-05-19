<script setup lang="ts">
import { ref, computed } from 'vue'
import { Scrubber } from '@/components/ui/scrubber'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Interactive Scrubber Component',
  description: 'A tactile range slider with pointer capture, custom ticks, and lifecycle events.',
})

// --- Interactive Settings State ---
const scrubberValue = ref(0.5)
const label = ref('Volume')
const min = ref(0)
const max = ref(1)
const step = ref(0.01)
const ticks = ref(9)
const decimals = ref(2)
const log = ref<string[]>([])

const resetSettings = () => {
  scrubberValue.value = 0.5
  label.value = 'Volume'
  min.value = 0
  max.value = 1
  step.value = 0.01
  ticks.value = 9
  decimals.value = 2
  log.value = []
}

// Event Handlers
const handleSlideBegin = (v: number) => log.value.push(`Slide Begin: ${v.toFixed(decimals.value)}`)
const handleSlideEnd = (v: number) => log.value.push(`Slide End: ${v.toFixed(decimals.value)}`)

const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add scrubber'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add scrubber'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add scrubber'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add scrubber'; break;
  }
  return {
    cli: cliCmd,
    manual: `npm install @vueuse/core clsx tailwind-merge`,
  }
})

const codeString = computed(() => {
  return `<script setup lang="ts">
import { ref } from 'vue'
import { Scrubber } from '@/components/ui/scrubber'

const value = ref(${scrubberValue.value.toFixed(decimals.value)})
const log = (msg: string) => console.log(msg)
<\/script>

<template>
  <Scrubber
    v-model="value"
    label="${label.value}"
    :min="${min.value}"
    :max="${max.value}"
    :step="${step.value}"
    :ticks="${ticks.value}"
    :decimals="${decimals.value}"
    @slide-begin="(v) => log('Started at ' + v)"
    @slide-end="(v) => log('Ended at ' + v)"
  />
</template>`
})
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Scrubber</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Interactive Scrubber</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A tactile range slider providing smooth parameter control with visual tick markers, pointer capture, and precise lifecycle events.
      </p>
    </div>

    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>
      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button v-for="tab in ['cli', 'manual']" :key="tab" @click="activeInstallTab = tab"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
                :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'">{{ tab }}</button>
      </div>
      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="p-1.5"><CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" /></div>
      </div>
    </div>


    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">v-model</code></div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0"><code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code></div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The active bound value of the scrubber.</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">label</code></div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0"><code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code></div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Display title aligned to the left of the component.</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">min / max</code></div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0"><code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code></div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The numeric boundaries for the control constraints.</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-7 text-foreground">Emits</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground px-2 py-1 rounded">@slideBegin</code></div>
          <div class="text-sm text-muted-foreground mt-1">Fired when the user first clicks/taps the track.</div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground px-2 py-1 rounded">@change</code></div>
          <div class="text-sm text-muted-foreground mt-1">Fired continuously during movement.</div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground px-2 py-1 rounded">@slideEnd</code></div>
          <div class="text-sm text-muted-foreground mt-1">Fired when the user releases the slider.</div>
        </div>
      </div>

      <h3 class="text-2xl mt-7 text-foreground">Keyboard Interactions</h3>
      <div class="rounded-xl border border-border p-4 bg-muted/20 mt-4">
        <ul class="text-sm text-muted-foreground space-y-2">
          <li><strong>Arrow Right / Up</strong>: Increment value by step.</li>
          <li><strong>Arrow Left / Down</strong>: Decrement value by step.</li>
          <li><strong>Home / End</strong>: Jump to Min / Max boundaries.</li>
        </ul>
      </div>
    </div>

    <template #preview>
      <div class="w-full p-8 flex flex-col gap-6 items-center">
        <div class="w-full max-w-sm">
          <Scrubber
              v-model="scrubberValue"
              @slide-begin="handleSlideBegin"
              @slide-end="handleSlideEnd"
              :label="label"
              :min="min"
              :max="max"
              :step="step"
              :ticks="ticks"
              :decimals="decimals"
          />
        </div>
        <div class="w-full max-w-sm h-24 overflow-y-auto bg-muted/30 rounded-lg p-3 text-xs font-mono text-muted-foreground">
          {{ log.slice(-5).join('\n') || 'Interact to see events...' }}
        </div>
      </div>
    </template>

    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <template #settings>
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground">Settings</span>
        <button @click="resetSettings" class="text-sm text-muted-foreground">Reset</button>
      </div>
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium">Scrubber Label</label>
        <input type="text" v-model="label" class="w-full bg-background border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div class="flex gap-4 mb-6">
        <div class="flex-1"><label class="text-sm">Min</label><input type="number" v-model.number="min" class="w-full bg-background border rounded-lg px-3 py-2 text-sm" /></div>
        <div class="flex-1"><label class="text-sm">Max</label><input type="number" v-model.number="max" class="w-full bg-background border rounded-lg px-3 py-2 text-sm" /></div>
      </div>
      <div class="flex gap-4 mb-6">
        <div class="flex-1"><label class="text-sm">Step</label><input type="number" v-model.number="step" step="0.01" class="w-full bg-background border rounded-lg px-3 py-2 text-sm" /></div>
        <div class="flex-1"><label class="text-sm">Ticks</label><input type="number" v-model.number="ticks" class="w-full bg-background border rounded-lg px-3 py-2 text-sm" /></div>
      </div>
    </template>
  </DocContent>
</template>
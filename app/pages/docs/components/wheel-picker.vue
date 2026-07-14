<script setup lang="ts">
import { ref, computed } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/raya/ui/wheel-picker'
import { CodeBlock } from '@/components/raya/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Wheel Picker Component for Vue & Nuxt',
  description: 'A high-performance, iOS-style 3D physics-based wheel picker component for Vue and Nuxt applications.',
  ogTitle: 'Wheel Picker Component for Vue & Nuxt',
  ogDescription: 'A high-performance, iOS-style 3D physics-based wheel picker component for Vue and Nuxt applications.',
})

// --- Interactive Settings State ---
const activeExample = ref('time') // time, date, custom
const isInfinite = ref(true)

const resetSettings = () => {
  activeExample.value = 'time'
  isInfinite.value = true
}

// --- Demo Data: Time Picker ---
const timeState = ref({ hour: 9, minute: 41, ampm: 'AM' })
const hours = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }))
const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))
const meridiem = [{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]

// --- Demo Data: Date Picker ---
const dateState = ref({ month: 5, day: 15, year: 2025 })
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    .map((m, i) => ({ value: i, label: m }))
const days = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: (i + 1).toString() }))
const years = Array.from({ length: 50 }, (_, i) => ({ value: 2025 - i, label: (2025 - i).toString() }))

// --- Demo Data: Score Picker ---
const scoreState = ref(5)
const scores = Array.from({ length: 11 }, (_, i) => ({ value: i, label: i.toString() }))

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add wheel-picker'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add wheel-picker'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add wheel-picker'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add wheel-picker'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install @vueuse/core`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  const inf = isInfinite.value ? ' infinite' : ''

  if (activeExample.value === 'date') {
    return `<script setup lang="ts">
import { ref } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'

const dateState = ref({ month: 5, day: 15, year: 2025 })

// Generate your options arrays (months, days, years)...
<\/script>

<template>
  <WheelPickerWrapper class="w-80 rounded-xl border border-border bg-background p-4">
    <WheelPicker v-model="dateState.month" :options="months"${inf} class="flex-[2]" />
    <WheelPicker v-model="dateState.day" :options="days"${inf} class="flex-1" />
    <WheelPicker v-model="dateState.year" :options="years"${inf} class="flex-1" />
  </WheelPickerWrapper>
</template>`
  }

  if (activeExample.value === 'custom') {
    return `<script setup lang="ts">
import { ref } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'

const scoreState = ref(5)
const scores = Array.from({ length: 11 }, (_, i) => ({ value: i, label: i.toString() }))
<\/script>

<template>
  <WheelPickerWrapper class="w-48 rounded-xl border border-border bg-background p-4">
    <WheelPicker
      v-model="scoreState"
      :options="scores"${inf}
      :class-names="{
        highlightWrapper: 'border-primary/50 bg-primary/10 rounded-lg',
        highlightItem: 'text-primary font-bold'
      }"
    />
  </WheelPickerWrapper>
</template>`
  }

  // Default Time Picker
  return `<script setup lang="ts">
import { ref } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'

const timeState = ref({ hour: 9, minute: 41, ampm: 'AM' })

const hours = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1).padStart(2, '0') }))
const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: String(i).padStart(2, '0') }))
const meridiem = [{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]
<\/script>

<template>
  <div class="relative flex h-56 w-64 flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
    <!-- Faux Device Notch -->
    <div class="absolute top-0 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-muted"></div>

    <WheelPickerWrapper class="w-full px-6">
      <WheelPicker v-model="timeState.hour" :options="hours"${inf} />
      <WheelPicker v-model="timeState.minute" :options="minutes"${inf} />
      <!-- AMPM generally shouldn't loop -->
      <WheelPicker v-model="timeState.ampm" :options="meridiem" />
    </WheelPickerWrapper>
  </div>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Wheel Picker</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Wheel Picker</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A high-performance, iOS-style 3D physics-based wheel picker. Perfect for touch-friendly date, time, and custom value selections.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <!-- Main Install Tabs -->
      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual', 'css']"
            :key="tab"
            @click="activeInstallTab = tab"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- CLI Install -->
      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                @click="activeCliTab = tab"
                class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
                :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" />
        </div>
      </div>

      <!-- Manual Install -->
      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/wheel-picker</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography, structural layout colors, and highlight accents natively from your <code>main.css</code> theme variables.
        </div>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">
            <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            your-project
          </div>
          <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
            <div class="flex items-center gap-2 py-2">
              <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              components
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                ui
              </div>
              <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                <div class="flex items-center gap-2 py-2 text-pink-500">
                  <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  wheel-picker
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>WheelPicker.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>WheelPickerWrapper.vue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">WheelPicker Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">modelValue</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string | number</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The selected value of the wheel. Bind using <code>v-model</code>.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">options</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Array&lt;{ value: any, label: string }&gt;</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Array of objects detailing the available options in the picker.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">infinite</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">If true, the wheel loops seamlessly back to the beginning when scrolling past the end.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">itemHeight</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">36</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The exact height of each row in pixels. Required for calculating the physics translation.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">classNames</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Object</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Provides keys to inject custom Tailwind classes into <code>container</code>, <code>highlightWrapper</code>, and <code>highlightItem</code>.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full flex flex-col items-center justify-center p-6 min-h-[400px]">
        <ClientOnly>

          <!-- Time Picker Example -->
          <div v-if="activeExample === 'time'" class="relative flex h-56 w-64 flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-muted bg-background shadow-2xl">
            <div class="absolute top-0 left-1/2 z-20 h-5 w-28 -translate-x-1/2 rounded-b-xl bg-muted border-b border-x border-border/50 shadow-sm"></div>
            <WheelPickerWrapper class="w-full px-4">
              <WheelPicker v-model="timeState.hour" :options="hours" :infinite="isInfinite" />
              <WheelPicker v-model="timeState.minute" :options="minutes" :infinite="isInfinite" />
              <!-- AMPM shouldn't realistically loop -->
              <WheelPicker v-model="timeState.ampm" :options="meridiem" />
            </WheelPickerWrapper>
          </div>

          <!-- Date Picker Example -->
          <div v-else-if="activeExample === 'date'" class="w-80 rounded-2xl border border-border bg-background shadow-lg p-6">
            <WheelPickerWrapper>
              <WheelPicker v-model="dateState.month" :options="months" :infinite="isInfinite" class="flex-[2]" />
              <WheelPicker v-model="dateState.day" :options="days" :infinite="isInfinite" class="flex-1" />
              <WheelPicker v-model="dateState.year" :options="years" :infinite="isInfinite" class="flex-1" />
            </WheelPickerWrapper>
          </div>

          <!-- Custom Score Example -->
          <div v-else-if="activeExample === 'custom'" class="w-48 rounded-2xl border border-border bg-background shadow-lg p-6">
            <WheelPickerWrapper>
              <WheelPicker
                  v-model="scoreState"
                  :options="scores"
                  :infinite="isInfinite"
                  :class-names="{
                  highlightWrapper: 'border-primary/50 bg-primary/10 rounded-lg',
                  highlightItem: 'text-primary font-bold text-lg'
                }"
              />
            </WheelPickerWrapper>
          </div>

        </ClientOnly>

        <!-- Live Value Feedback Box -->
        <div class="mt-8 w-full max-w-sm p-4 bg-muted/30 border border-border rounded-lg flex flex-col gap-2 font-mono text-sm">
          <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Active State</span>
          <code class="text-foreground">
            <template v-if="activeExample === 'time'">
              {{ String(timeState.hour).padStart(2, '0') }}:{{ String(timeState.minute).padStart(2, '0') }} {{ timeState.ampm }}
            </template>
            <template v-else-if="activeExample === 'date'">
              {{ months[dateState.month]?.label }} {{ dateState.day }}, {{ dateState.year }}
            </template>
            <template v-else-if="activeExample === 'custom'">
              Score: {{ scoreState }} / 10
            </template>
          </code>
        </div>
      </div>
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Source Code Slot               -->
    <!-- ========================================== -->
    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Settings Panel Slot            -->
    <!-- ========================================== -->
    <template #settings>
      <!-- Panel Header & Reset -->
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Example Switcher -->
      <div class="flex flex-col gap-2 mb-6 border-b border-border pb-6">
        <label class="text-sm font-medium text-foreground">Example Layout</label>
        <div class="relative">
          <select v-model="activeExample" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="time">iOS Time Picker</option>
            <option value="date">Date Selector</option>
            <option value="custom">Custom Styling</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Infinite Looping Toggle -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isInfinite = !isInfinite">Infinite Looping</label>
          <span class="text-xs text-muted-foreground">Wheel wraps around limits seamlessly.</span>
        </div>
        <button @click="isInfinite = !isInfinite" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative shrink-0', isInfinite ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isInfinite ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

    </template>
  </DocContent>
</template>
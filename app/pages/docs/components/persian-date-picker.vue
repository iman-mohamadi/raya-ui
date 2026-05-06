<script setup lang="ts">
import { ref, computed } from 'vue'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Persian Date Picker Component for Vue & Nuxt',
  description: 'A fully accessible Jalali/Gregorian date picker built on Reka UI with range support and ISO string compatibility.',
  ogTitle: 'Persian Date Picker Component for Vue & Nuxt',
  ogDescription: 'A fully accessible Jalali/Gregorian date picker built on Reka UI with range support and ISO string compatibility.',
})

// --- Interactive Settings State ---
const isRange = ref(false)
const isDisabled = ref(false)
const placeholderText = ref('انتخاب تاریخ')

const resetSettings = () => {
  isRange.value = false
  isDisabled.value = false
  placeholderText.value = 'انتخاب تاریخ'
}

// --- Demo State ---
const singleDate = ref('2026-05-06')
const rangeDate = ref({ start: '2026-05-06', end: '2026-05-12' })

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add persian-date-picker'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add persian-date-picker'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add persian-date-picker'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add persian-date-picker'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install reka-ui lucide-vue-next clsx tailwind-merge`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = ``

  if (isRange.value) props += `\n    range`
  if (placeholderText.value && placeholderText.value !== 'انتخاب تاریخ') props += `\n    placeholder="${placeholderText.value}"`
  if (isDisabled.value) props += `\n    disabled`

  const boundVar = isRange.value ? 'rangeDate' : 'date'
  const refDefinition = isRange.value
      ? `const rangeDate = ref({ start: '2026-05-06', end: '2026-05-12' })`
      : `const date = ref('2026-05-06')`

  return `<script setup lang="ts">
import { ref } from 'vue'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'

// Accepts standard ISO 8601 strings
${refDefinition}
<\/script>

<template>
  <PersianDatePicker
    v-model="${boundVar}"${props}
    class="w-full max-w-sm"
  />
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Persian Date Picker</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Persian Date Picker</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A robust, accessible date picker built on Reka UI. Features native Jalali/Gregorian switching, weekend highlighting, and ISO-8601 string support.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/persian-date-picker</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography, background colors, and primary accents seamlessly from your <code>main.css</code> theme variables.
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Features</h2>
      <ul class="list-disc list-inside text-sm text-muted-foreground space-y-2 mt-2">
        <li><strong>Native Jalali Support:</strong> Uses <code>fa-IR-u-ca-persian</code> locale for accurate Persian calendar calculations without heavy moment/date-fns libraries.</li>
        <li><strong>Dual Mode:</strong> Users can toggle between Jalali and Gregorian calendars directly inside the popup.</li>
        <li><strong>Weekend Logic:</strong> Automatically highlights Fridays in Jalali mode and Sat/Sun in Gregorian mode.</li>
        <li><strong>RTL/LTR:</strong> Automatically adjusts layout direction based on the active calendar.</li>
        <li><strong>Keyboard Navigation:</strong> Full keyboard support powered by Reka UI primitives.</li>
      </ul>
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
                  persian-date-picker
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>PersianDatePicker.vue</div>
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

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">modelValue</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string | { start: string, end: string }</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The bound date value in standard ISO 8601 format (e.g., <code>"2026-05-06"</code>). Becomes an object with start/end strings if <code>range</code> is true.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">range</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Enables date range selection mode instead of single date picking.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">placeholder</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"انتخاب تاریخ"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Text displayed inside the trigger button when no date is actively selected.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">disabled</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Disables interaction with the picker trigger.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full flex flex-col items-center justify-center p-6 h-full min-h-[400px]">

        <div class="w-full max-w-sm flex flex-col gap-4">
          <!-- Render based on mode to maintain proper v-model typings -->
          <PersianDatePicker
              v-if="!isRange"
              v-model="singleDate"
              :placeholder="placeholderText"
              :disabled="isDisabled"
              class="w-full"
          />
          <PersianDatePicker
              v-else
              v-model="rangeDate"
              range
              :placeholder="placeholderText"
              :disabled="isDisabled"
              class="w-full"
          />

          <!-- Live Value Feedback -->
          <div class="mt-4 p-4 bg-muted/30 border border-border rounded-lg flex flex-col gap-2">
            <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Model Value</span>
            <code class="text-sm text-foreground break-all">
              {{ isRange ? JSON.stringify(rangeDate) : singleDate || 'null' }}
            </code>
          </div>
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

      <!-- Range Toggle -->
      <div class="flex items-center justify-between mb-6 border-b border-border pb-6">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isRange = !isRange">Range Selection Mode</label>
        <button @click="isRange = !isRange" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', isRange ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isRange ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Disabled Toggle -->
      <div class="flex items-center justify-between mb-6">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isDisabled = !isDisabled">Disabled State</label>
        <button @click="isDisabled = !isDisabled" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', isDisabled ? 'bg-error' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isDisabled ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Placeholder Input -->
      <div class="flex flex-col gap-2 mb-2">
        <label class="text-sm font-medium text-foreground">Placeholder Text</label>
        <input
            type="text"
            v-model="placeholderText"
            dir="rtl"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all"
        />
      </div>

    </template>
  </DocContent>
</template>
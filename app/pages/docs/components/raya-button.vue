<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Raya Button Component for Vue & Nuxt',
  description: 'The ultimate button component inspired by Nuxt UI, built for Vue and Nuxt applications.',
  ogTitle: 'Raya Button Component for Vue & Nuxt',
  ogDescription: 'The ultimate button component inspired by Nuxt UI, built for Vue and Nuxt applications.',
})

// --- Interactive Settings State ---
const variant = ref('solid')
const color = ref('primary')
const size = ref('md')
const isLoading = ref(false)
const isDisabled = ref(false)

const resetSettings = () => {
  variant.value = 'solid'
  color.value = 'primary'
  size.value = 'md'
  isLoading.value = false
  isDisabled.value = false
}

// --- Color Options for Settings ---
const colors = [
  { label: 'Primary', value: 'primary', bgClass: 'bg-foreground' },
  { label: 'Secondary', value: 'secondary', bgClass: 'bg-muted' },
  { label: 'Success', value: 'success', bgClass: 'bg-success' },
  { label: 'Warning', value: 'warning', bgClass: 'bg-warning' },
  { label: 'Error', value: 'error', bgClass: 'bg-error' },
  { label: 'Info', value: 'info', bgClass: 'bg-info' },
  { label: 'Neutral', value: 'neutral', bgClass: 'bg-neutral-500' },
]

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add raya-button'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add raya-button'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add raya-button'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add raya-button'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install class-variance-authority reka-ui lucide-vue-next`,
    css: `/* The CLI adds these automatically. For a manual install, paste them
   into your Tailwind CSS entry so the semantic colors resolve. */
@theme inline {
  --color-primary-content: var(--primary-foreground);
  --color-secondary-content: var(--secondary-foreground);
  --color-success: var(--success);
  --color-success-content: var(--success-foreground);
  --color-info: var(--info);
  --color-info-content: var(--info-foreground);
  --color-warning: var(--warning);
  --color-warning-content: var(--warning-foreground);
  --color-error: var(--error);
  --color-error-content: var(--error-foreground);
  --color-inverted: var(--foreground);
  --color-default: var(--foreground);
  --color-elevated: var(--muted);
  --color-accented: var(--accent);
}

:root {
  --success: oklch(0.62 0.19 145.4);
  --success-foreground: oklch(0.98 0 0);
  --info: oklch(0.60 0.16 255);
  --info-foreground: oklch(0.98 0 0);
  --warning: oklch(0.75 0.15 70);
  --warning-foreground: oklch(0.98 0 0);
  --error: var(--destructive);
  --error-foreground: oklch(1 0 0);
}

.dark {
  --success: oklch(0.55 0.18 145.4);
  --success-foreground: oklch(1 0 0);
  --info: oklch(0.55 0.16 255);
  --info-foreground: oklch(1 0 0);
  --warning: oklch(0.70 0.15 70);
  --warning-foreground: oklch(0.1 0 0);
  --error: var(--destructive);
  --error-foreground: oklch(1 0 0);
}`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = `variant="${variant.value}"`
  if (color.value !== 'primary') props += `\n    color="${color.value}"`
  if (size.value !== 'md') props += `\n    size="${size.value}"`
  if (isLoading.value) props += `\n    loading`
  if (isDisabled.value) props += `\n    disabled`

  return `<script setup lang="ts">
import { RayaButton } from '@/components/ui/raya-button'
<\/script>

<template>
  <RayaButton
    ${props}
  >
    Raya Button
  </RayaButton>
</template>`
})
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Raya Button</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Raya Button</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        The ultimate button component. Inspired by Nuxt UI, built for Vue, with built-in loading states and fluid animations.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/raya-button</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Auto-installed:</strong> the <code>add</code> command writes these semantic color tokens into your theme for you. Only paste them manually if you copied the files by hand.
        </div>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="css" :code="installCommands.css" class="border-0 m-0 bg-transparent" />
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
              <div class="flex items-center gap-2 py-2 text-pink-500">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                RayaButton.vue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>
      <h3 class="text-2xl mt-7 mb-3 text-foreground">RayaButton</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">color</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"primary"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The semantic color palette of the button. Accepts primary, secondary, neutral, success, info, warning, or error.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">variant</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"solid"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The visual style of the button. Accepts solid, outline, soft, subtle, ghost, or link.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- RIGHT PANE SLOTS -->
    <template #preview>
      <RayaButton
          :variant="variant"
          :color="color"
          :size="size"
          :loading="isLoading"
          :disabled="isDisabled"
      >
        Raya Button
      </RayaButton>
    </template>

    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <template #settings>
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Color Select -->
      <div class="flex flex-col gap-3 mb-6">
        <label class="text-sm font-medium text-foreground">Color</label>
        <div class="flex flex-wrap gap-3">
          <button
              v-for="c in colors"
              :key="c.value"
              @click="color = c.value"
              :class="[
              'w-6 h-6 rounded-full transition-all ring-offset-2 ring-offset-background',
              color === c.value ? 'ring-2 ring-muted-foreground scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100',
              c.bgClass
            ]"
              :title="c.label"
          ></button>
        </div>
      </div>

      <!-- Variant Select -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Variant</label>
        <div class="relative">
          <select v-model="variant" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
            <option value="soft">Soft</option>
            <option value="subtle">Subtle</option>
            <option value="ghost">Ghost</option>
            <option value="link">Link</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Size Select -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Size</label>
        <div class="relative">
          <select v-model="size" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="xs">Extra Small (xs)</option>
            <option value="sm">Small (sm)</option>
            <option value="md">Medium (md)</option>
            <option value="lg">Large (lg)</option>
            <option value="xl">Extra Large (xl)</option>
            <option value="icon">Icon</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Loading Toggle -->
      <div class="flex items-center justify-between mb-5">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isLoading = !isLoading">Loading State</label>
        <button @click="isLoading = !isLoading" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', isLoading ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isLoading ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Disabled Toggle -->
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isDisabled = !isDisabled">Disabled State</label>
        <button @click="isDisabled = !isDisabled" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', isDisabled ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isDisabled ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>
    </template>
  </DocContent>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PartitionBar,
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from '@/components/raya/ui/partition-bar'
import { CodeBlock } from '@/components/raya/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Partition Bar Component for Vue & Nuxt',
  description: 'A proportional bar chart component for visualizing distributed data values.',
  ogTitle: 'Partition Bar Component for Vue & Nuxt',
  ogDescription: 'A proportional bar chart component for visualizing distributed data values.',
})

// --- Interactive Settings State ---
const activeExample = ref('default') // default, variants, alignment
const gap = ref(1)
const size = ref('md')

const resetSettings = () => {
  activeExample.value = 'default'
  gap.value = 1
  size.value = 'md'
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add partition-bar'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add partition-bar'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add partition-bar'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add partition-bar'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install clsx tailwind-merge class-variance-authority`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  const barProps = [
    gap.value !== 1 ? `:gap="${gap.value}"` : '',
    size.value !== 'md' ? `size="${size.value}"` : ''
  ].filter(Boolean).join(' ')

  const propStr = barProps ? ` ${barProps}` : ''

  if (activeExample.value === 'variants') {
    return `<script setup lang="ts">
import { PartitionBar, PartitionBarSegment, PartitionBarSegmentTitle } from '@/components/ui/partition-bar'
<\/script>

<template>
  <PartitionBar${propStr}>
    <PartitionBarSegment :num="4" variant="destructive">
      <PartitionBarSegmentTitle>Errors</PartitionBarSegmentTitle>
    </PartitionBarSegment>
    <PartitionBarSegment :num="12" variant="default">
      <PartitionBarSegmentTitle>Success</PartitionBarSegmentTitle>
    </PartitionBarSegment>
    <PartitionBarSegment :num="6" variant="secondary">
      <PartitionBarSegmentTitle>Pending</PartitionBarSegmentTitle>
    </PartitionBarSegment>
  </PartitionBar>
</template>`
  }

  if (activeExample.value === 'alignment') {
    return `<script setup lang="ts">
import { PartitionBar, PartitionBarSegment, PartitionBarSegmentTitle, PartitionBarSegmentValue } from '@/components/ui/partition-bar'
<\/script>

<template>
  <PartitionBar${propStr}>
    <PartitionBarSegment :num="60" alignment="left">
      <PartitionBarSegmentTitle>Left Aligned</PartitionBarSegmentTitle>
      <PartitionBarSegmentValue>60%</PartitionBarSegmentValue>
    </PartitionBarSegment>
    <PartitionBarSegment :num="40" variant="outline" alignment="right">
      <PartitionBarSegmentTitle>Right Aligned</PartitionBarSegmentTitle>
      <PartitionBarSegmentValue>40%</PartitionBarSegmentValue>
    </PartitionBarSegment>
  </PartitionBar>
</template>`
  }

  return `<script setup lang="ts">
import { PartitionBar, PartitionBarSegment, PartitionBarSegmentTitle, PartitionBarSegmentValue } from '@/components/ui/partition-bar'
<\/script>

<template>
  <PartitionBar${propStr}>
    <PartitionBarSegment :num="50">
      <PartitionBarSegmentTitle>System</PartitionBarSegmentTitle>
      <PartitionBarSegmentValue>50GB</PartitionBarSegmentValue>
    </PartitionBarSegment>

    <PartitionBarSegment :num="30" variant="secondary">
      <PartitionBarSegmentTitle>Apps</PartitionBarSegmentTitle>
      <PartitionBarSegmentValue>30GB</PartitionBarSegmentValue>
    </PartitionBarSegment>

    <PartitionBarSegment :num="20" variant="muted">
      <PartitionBarSegmentTitle>Free</PartitionBarSegmentTitle>
      <PartitionBarSegmentValue>20GB</PartitionBarSegmentValue>
    </PartitionBarSegment>
  </PartitionBar>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Partition Bar</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Partition Bar</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A horizontal proportional bar chart for effectively visualizing part-to-whole distributed data relationships.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/partition-bar</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography and semantic UI colors seamlessly from your <code>main.css</code> theme variables.
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
                  partition-bar
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>PartitionBar.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>PartitionBarSegment.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>PartitionBarSegmentTitle.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>PartitionBarSegmentValue.vue</div>
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

      <h3 class="text-2xl mt-7 mb-3 text-foreground">PartitionBar Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">gap</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">1</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Space between segments (multiplied by 4px internally).</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">size</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"md"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Height of the bar segments. Accepts 'sm', 'md', or 'lg'.</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">PartitionBarSegment Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">num</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The value of this segment relative to the sum of all segments in the bar.</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">variant</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"default"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Theme color matching standard Shadcn variants (default, secondary, destructive, outline, muted).</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">alignment</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"center"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Horizontal alignment of the content under the bar segment. Accepts 'left', 'center', or 'right'.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Credits -->
    <div class="mt-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-2 bg-muted/20 p-4 rounded-xl border border-border">
      <p>Source content adapted from <a href="https://ui.8starlabs.com/docs/components/partition-bar" target="_blank" rel="noopener noreferrer" class="text-foreground hover:text-primary underline underline-offset-4 transition-colors">8 Star labs</a>.</p>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full flex items-center justify-center p-6 h-full min-h-[300px]">
        <div class="w-full max-w-2xl">

          <!-- Default Example -->
          <PartitionBar v-if="activeExample === 'default'" :gap="gap" :size="size">
            <PartitionBarSegment :num="50" variant="destructive">
              <PartitionBarSegmentTitle>System</PartitionBarSegmentTitle>
              <PartitionBarSegmentValue>50GB</PartitionBarSegmentValue>
            </PartitionBarSegment>
            <PartitionBarSegment :num="30" variant="secondary">
              <PartitionBarSegmentTitle>Apps</PartitionBarSegmentTitle>
              <PartitionBarSegmentValue>30GB</PartitionBarSegmentValue>
            </PartitionBarSegment>
            <PartitionBarSegment :num="20" variant="muted">
              <PartitionBarSegmentTitle>Free</PartitionBarSegmentTitle>
              <PartitionBarSegmentValue>20GB</PartitionBarSegmentValue>
            </PartitionBarSegment>
          </PartitionBar>

          <!-- Variants Example -->
          <PartitionBar v-else-if="activeExample === 'variants'" :gap="gap" :size="size">
            <PartitionBarSegment :num="4" variant="destructive">
              <PartitionBarSegmentTitle>Errors</PartitionBarSegmentTitle>
            </PartitionBarSegment>
            <PartitionBarSegment :num="12" variant="default">
              <PartitionBarSegmentTitle>Success</PartitionBarSegmentTitle>
            </PartitionBarSegment>
            <PartitionBarSegment :num="6" variant="secondary">
              <PartitionBarSegmentTitle>Pending</PartitionBarSegmentTitle>
            </PartitionBarSegment>
          </PartitionBar>

          <!-- Alignment Example -->
          <PartitionBar v-else-if="activeExample === 'alignment'" :gap="gap" :size="size">
            <PartitionBarSegment :num="60" alignment="left">
              <PartitionBarSegmentTitle>Left Aligned</PartitionBarSegmentTitle>
              <PartitionBarSegmentValue>60%</PartitionBarSegmentValue>
            </PartitionBarSegment>
            <PartitionBarSegment :num="40" variant="outline" alignment="right">
              <PartitionBarSegmentTitle>Right Aligned</PartitionBarSegmentTitle>
              <PartitionBarSegmentValue>40%</PartitionBarSegmentValue>
            </PartitionBarSegment>
          </PartitionBar>

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
        <label class="text-sm font-medium text-foreground">Example Variant</label>
        <div class="relative">
          <select v-model="activeExample" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="default">Default Proportions</option>
            <option value="variants">Theme Variants</option>
            <option value="alignment">Content Alignment</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Gap Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Gap Spacing</label>
          <span class="text-xs font-mono text-muted-foreground">{{ gap }} ({{ gap * 4 }}px)</span>
        </div>
        <input
            type="range"
            v-model.number="gap"
            min="0"
            max="8"
            step="1"
            class="w-full accent-foreground"
        />
      </div>

      <!-- Size Select -->
      <div class="flex flex-col gap-2 mb-2">
        <label class="text-sm font-medium text-foreground">Bar Size</label>
        <div class="relative">
          <select v-model="size" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="sm">Small (sm)</option>
            <option value="md">Medium (md)</option>
            <option value="lg">Large (lg)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </template>
  </DocContent>
</template>
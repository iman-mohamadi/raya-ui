<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ScrollSpy,
  ScrollSpyNav,
  ScrollSpyLink,
  ScrollSpyViewport,
  ScrollSpySection
} from '@/components/ui/scroll-spy'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Scroll Spy Component for Vue & Nuxt',
  description: 'Automatically highlights navigation items based on scroll position.',
  ogTitle: 'Scroll Spy Component for Vue & Nuxt',
  ogDescription: 'Automatically highlights navigation items based on scroll position.',
})

// --- Interactive Settings State ---
const activeExample = ref('sidebar-left') // sidebar-left, navbar-top, sidebar-right
const showIndicator = ref(true)
const indicatorPosition = ref('before') // before, after
const offset = ref(0)

const resetSettings = () => {
  activeExample.value = 'sidebar-left'
  showIndicator.value = true
  indicatorPosition.value = 'before'
  offset.value = 0
}

// Auto-adjust indicator position when switching layouts for best visual default
const onExampleChange = () => {
  if (activeExample.value === 'sidebar-left') {
    indicatorPosition.value = 'before'
  } else {
    indicatorPosition.value = 'after'
  }
}

// Container refs for the different preview layouts
const containerLeft = ref<HTMLElement | null>(null)
const containerTop = ref<HTMLElement | null>(null)
const containerRight = ref<HTMLElement | null>(null)

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add scroll-spy'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add scroll-spy'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add scroll-spy'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add scroll-spy'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install reka-ui @vueuse/core clsx tailwind-merge`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  const rootProps = [
    `    :container="scrollContainer"`,
    activeExample.value === 'navbar-top' ? `    orientation="horizontal"` : `    orientation="vertical"`,
    offset.value !== 0 ? `    :offset="${offset.value}"` : ``
  ].filter(Boolean).join('\n')

  const navProps = [
    showIndicator.value ? ` indicator` : ``,
    showIndicator.value && indicatorPosition.value !== 'before' ? ` indicator-position="${indicatorPosition.value}"` : ``
  ].join('')

  if (activeExample.value === 'navbar-top') {
    return `<script setup lang="ts">
import { ref } from 'vue'
import { ScrollSpy, ScrollSpyNav, ScrollSpyLink, ScrollSpyViewport, ScrollSpySection } from '@/components/ui/scroll-spy'

const scrollContainer = ref<HTMLElement | null>(null)
<\/script>

<template>
  <ScrollSpy
${rootProps}
    class="flex flex-col h-[400px] border border-border rounded-lg bg-background overflow-hidden"
  >
    <div class="border-b border-border p-4 bg-muted/30 flex justify-between items-center shrink-0">
      <span class="font-bold text-foreground">Logo</span>
      <ScrollSpyNav${navProps} class="gap-6">
        <ScrollSpyLink value="n-1" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Concept</ScrollSpyLink>
        <ScrollSpyLink value="n-2" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Design</ScrollSpyLink>
        <ScrollSpyLink value="n-3" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Code</ScrollSpyLink>
      </ScrollSpyNav>
    </div>

    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-8 scroll-smooth">
      <ScrollSpyViewport class="space-y-24 pb-20">
        <ScrollSpySection value="n-1" class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Concept</h3>
          <div class="h-40 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
        <ScrollSpySection value="n-2" class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Design</h3>
          <div class="h-40 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
        <ScrollSpySection value="n-3" class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Code</h3>
          <div class="h-40 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
      </ScrollSpyViewport>
    </div>
  </ScrollSpy>
</template>`
  }

  if (activeExample.value === 'sidebar-right') {
    return `<script setup lang="ts">
import { ref } from 'vue'
import { ScrollSpy, ScrollSpyNav, ScrollSpyLink, ScrollSpyViewport, ScrollSpySection } from '@/components/ui/scroll-spy'

const scrollContainer = ref<HTMLElement | null>(null)
<\/script>

<template>
  <ScrollSpy
${rootProps}
    class="flex w-full h-[400px] border border-border rounded-lg bg-background overflow-hidden"
  >
    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
      <ScrollSpyViewport class="space-y-24 pb-20">
        <ScrollSpySection value="r-1" class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Overview</h3>
          <div class="h-32 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
        <ScrollSpySection value="r-2" class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Features</h3>
          <div class="h-32 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
        <ScrollSpySection value="r-3" class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Pricing</h3>
          <div class="h-32 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
      </ScrollSpyViewport>
    </div>

    <div class="w-48 border-l border-border p-6 bg-muted/30">
      <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">On this page</h4>
      <ScrollSpyNav${navProps} class="items-end">
        <ScrollSpyLink value="r-1" class="block py-2 text-sm text-right text-muted-foreground hover:text-foreground transition-colors no-underline">Overview</ScrollSpyLink>
        <ScrollSpyLink value="r-2" class="block py-2 text-sm text-right text-muted-foreground hover:text-foreground transition-colors no-underline">Features</ScrollSpyLink>
        <ScrollSpyLink value="r-3" class="block py-2 text-sm text-right text-muted-foreground hover:text-foreground transition-colors no-underline">Pricing</ScrollSpyLink>
      </ScrollSpyNav>
    </div>
  </ScrollSpy>
</template>`
  }

  // Default: Left Sidebar
  return `<script setup lang="ts">
import { ref } from 'vue'
import { ScrollSpy, ScrollSpyNav, ScrollSpyLink, ScrollSpyViewport, ScrollSpySection } from '@/components/ui/scroll-spy'

const scrollContainer = ref<HTMLElement | null>(null)
<\/script>

<template>
  <ScrollSpy
${rootProps}
    class="flex w-full h-[400px] border border-border rounded-lg bg-background overflow-hidden"
  >
    <div class="w-48 border-r border-border p-6 bg-muted/30">
      <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Docs</h4>
      <ScrollSpyNav${navProps}>
        <ScrollSpyLink value="s1-intro" class="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">Introduction</ScrollSpyLink>
        <ScrollSpyLink value="s1-install" class="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">Installation</ScrollSpyLink>
        <ScrollSpyLink value="s1-config" class="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">Configuration</ScrollSpyLink>
      </ScrollSpyNav>
    </div>

    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
      <ScrollSpyViewport class="space-y-16 pb-32">
        <ScrollSpySection value="s1-intro" class="space-y-2">
          <h2 class="text-2xl font-bold text-foreground">Introduction</h2>
          <p class="text-muted-foreground">Sidebar layout active.</p>
          <div class="h-32 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
        <ScrollSpySection value="s1-install" class="space-y-2">
          <h2 class="text-2xl font-bold text-foreground">Installation</h2>
          <p class="text-muted-foreground">Scroll down to see it move.</p>
          <div class="h-32 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
        <ScrollSpySection value="s1-config" class="space-y-2">
          <h2 class="text-2xl font-bold text-foreground">Configuration</h2>
          <p class="text-muted-foreground">Customize offsets and behavior.</p>
          <div class="h-32 bg-muted/50 border border-border border-dashed rounded" />
        </ScrollSpySection>
      </ScrollSpyViewport>
    </div>
  </ScrollSpy>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Scroll Spy</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Scroll Spy</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A utility component that automatically tracks the active section within a scrolling container and highlights the corresponding navigation items.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/scroll-spy</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography, structural layout colors, and dynamic interactive states natively from your <code>main.css</code> theme variables.
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
                  scroll-spy
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>ScrollSpy.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>ScrollSpyNav.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>ScrollSpyLink.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>ScrollSpyViewport.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>ScrollSpySection.vue</div>
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

      <h3 class="text-2xl mt-7 mb-3 text-foreground">ScrollSpy (Root)</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">container</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">HTMLElement | null</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">window</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2"><strong>Crucial:</strong> A reference to the scrolling element that contains your viewport. If omitted, it defaults to tracking the browser's window scroll.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">orientation</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"vertical"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Defines layout flow context. <code>vertical</code> implies a side-by-side flex-row. <code>horizontal</code> implies stacked flex-col.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">offset</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Top margin offset (in pixels) for triggering section activation.</p>
          </div>
        </div>

      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">ScrollSpyNav</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">indicator</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Enables the animated moving line indicator underneath or beside the active navigation item.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">indicatorPosition</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"before"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Position of the animated line. Accepts 'before' (Left/Top) or 'after' (Right/Bottom).</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 min-h-[500px]">

        <!-- Left Sidebar Preview -->
        <ScrollSpy
            v-if="activeExample === 'sidebar-left'"
            :container="containerLeft"
            orientation="vertical"
            :offset="offset"
            class="flex w-full max-w-3xl h-[400px] border border-border rounded-xl overflow-hidden bg-background shadow-lg"
        >
          <div class="w-48 border-r border-border p-6 bg-muted/20 hidden sm:block shrink-0">
            <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Docs</h4>
            <ScrollSpyNav :indicator="showIndicator" :indicator-position="indicatorPosition">
              <ScrollSpyLink value="s1-intro" class="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">
                Introduction
              </ScrollSpyLink>
              <ScrollSpyLink value="s1-install" class="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">
                Installation
              </ScrollSpyLink>
              <ScrollSpyLink value="s1-config" class="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">
                Configuration
              </ScrollSpyLink>
            </ScrollSpyNav>
          </div>
          <div ref="containerLeft" class="flex-1 overflow-y-auto p-8 scroll-smooth relative custom-scrollbar">
            <ScrollSpyViewport class="space-y-16 pb-32">
              <ScrollSpySection value="s1-intro" class="space-y-2">
                <h2 class="text-2xl font-bold text-foreground">Introduction</h2>
                <p class="text-muted-foreground">Sidebar layout uses <code>orientation="vertical"</code>.</p>
                <div class="h-32 bg-muted/30 border border-border border-dashed rounded mt-4" />
              </ScrollSpySection>
              <ScrollSpySection value="s1-install" class="space-y-2">
                <h2 class="text-2xl font-bold text-foreground">Installation</h2>
                <p class="text-muted-foreground">The indicator tracks section boundaries.</p>
                <div class="h-32 bg-muted/30 border border-border border-dashed rounded mt-4" />
              </ScrollSpySection>
              <ScrollSpySection value="s1-config" class="space-y-2">
                <h2 class="text-2xl font-bold text-foreground">Configuration</h2>
                <p class="text-muted-foreground">Customize offsets and behavior easily.</p>
                <div class="h-32 bg-muted/30 border border-border border-dashed rounded mt-4" />
              </ScrollSpySection>
            </ScrollSpyViewport>
          </div>
        </ScrollSpy>

        <!-- Top Navbar Preview -->
        <ScrollSpy
            v-else-if="activeExample === 'navbar-top'"
            :container="containerTop"
            orientation="horizontal"
            :offset="offset"
            class="flex flex-col w-full max-w-3xl h-[400px] border border-border rounded-xl overflow-hidden bg-background shadow-lg"
        >
          <div class="border-b border-border p-4 bg-muted/20 flex justify-between items-center shrink-0">
            <span class="text-sm font-bold text-foreground">Logo</span>
            <ScrollSpyNav :indicator="showIndicator" :indicator-position="indicatorPosition" class="gap-6">
              <ScrollSpyLink value="n-1" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Concept</ScrollSpyLink>
              <ScrollSpyLink value="n-2" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Design</ScrollSpyLink>
              <ScrollSpyLink value="n-3" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Code</ScrollSpyLink>
            </ScrollSpyNav>
          </div>
          <div ref="containerTop" class="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
            <ScrollSpyViewport class="space-y-24 pb-20">
              <ScrollSpySection value="n-1" class="space-y-4">
                <h3 class="text-lg font-bold text-foreground">Concept</h3>
                <div class="h-40 bg-muted/30 border border-border border-dashed rounded" />
              </ScrollSpySection>
              <ScrollSpySection value="n-2" class="space-y-4">
                <h3 class="text-lg font-bold text-foreground">Design</h3>
                <div class="h-40 bg-muted/30 border border-border border-dashed rounded" />
              </ScrollSpySection>
              <ScrollSpySection value="n-3" class="space-y-4">
                <h3 class="text-lg font-bold text-foreground">Code</h3>
                <div class="h-40 bg-muted/30 border border-border border-dashed rounded" />
              </ScrollSpySection>
            </ScrollSpyViewport>
          </div>
        </ScrollSpy>

        <!-- Right Sidebar Preview -->
        <ScrollSpy
            v-else-if="activeExample === 'sidebar-right'"
            :container="containerRight"
            orientation="vertical"
            :offset="offset"
            class="flex w-full max-w-3xl h-[400px] border border-border rounded-xl overflow-hidden bg-background shadow-lg"
        >
          <div ref="containerRight" class="flex-1 overflow-y-auto p-8 scroll-smooth relative custom-scrollbar">
            <ScrollSpyViewport class="space-y-24 pb-20">
              <ScrollSpySection value="r-1" class="space-y-4">
                <h3 class="text-lg font-bold text-foreground">Overview</h3>
                <div class="h-32 bg-muted/30 border border-border border-dashed rounded" />
              </ScrollSpySection>
              <ScrollSpySection value="r-2" class="space-y-4">
                <h3 class="text-lg font-bold text-foreground">Features</h3>
                <div class="h-32 bg-muted/30 border border-border border-dashed rounded" />
              </ScrollSpySection>
              <ScrollSpySection value="r-3" class="space-y-4">
                <h3 class="text-lg font-bold text-foreground">Pricing</h3>
                <div class="h-32 bg-muted/30 border border-border border-dashed rounded" />
              </ScrollSpySection>
            </ScrollSpyViewport>
          </div>

          <div class="w-48 border-l border-border p-6 bg-muted/20 hidden sm:block shrink-0">
            <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">On this page</h4>
            <ScrollSpyNav :indicator="showIndicator" :indicator-position="indicatorPosition" class="items-end">
              <ScrollSpyLink value="r-1" class="block py-2 text-sm text-right text-muted-foreground hover:text-foreground transition-colors no-underline">Overview</ScrollSpyLink>
              <ScrollSpyLink value="r-2" class="block py-2 text-sm text-right text-muted-foreground hover:text-foreground transition-colors no-underline">Features</ScrollSpyLink>
              <ScrollSpyLink value="r-3" class="block py-2 text-sm text-right text-muted-foreground hover:text-foreground transition-colors no-underline">Pricing</ScrollSpyLink>
            </ScrollSpyNav>
          </div>
        </ScrollSpy>

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

      <!-- Layout Switcher -->
      <div class="flex flex-col gap-2 mb-6 border-b border-border pb-6">
        <label class="text-sm font-medium text-foreground">Component Layout</label>
        <div class="relative">
          <select v-model="activeExample" @change="onExampleChange" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="sidebar-left">Sidebar (Left)</option>
            <option value="navbar-top">Navbar (Top)</option>
            <option value="sidebar-right">Sidebar (Right)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Offset Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Scroll Offset</label>
          <span class="text-xs font-mono text-muted-foreground">{{ offset }}px</span>
        </div>
        <input
            type="range"
            v-model.number="offset"
            min="-50"
            max="50"
            step="5"
            class="w-full accent-foreground"
        />
      </div>

      <!-- Show Indicator Toggle -->
      <div class="flex items-center justify-between mb-6">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="showIndicator = !showIndicator">Show Indicator</label>
        <button @click="showIndicator = !showIndicator" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', showIndicator ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', showIndicator ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Indicator Position Select (Disabled if indicator is off) -->
      <div class="flex flex-col gap-2 mb-2" :class="{ 'opacity-50 pointer-events-none': !showIndicator }">
        <label class="text-sm font-medium text-foreground">Indicator Position</label>
        <div class="relative">
          <select v-model="indicatorPosition" :disabled="!showIndicator" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="before">Before (Top/Left)</option>
            <option value="after">After (Bottom/Right)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </template>
  </DocContent>
</template>
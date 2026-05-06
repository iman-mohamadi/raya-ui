<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Code Block Component for Vue & Nuxt',
  description: 'A content-aware code container with syntax highlighting and copy functionality.',
  ogTitle: 'Code Block Component for Vue & Nuxt',
  ogDescription: 'A content-aware code container with syntax highlighting and copy functionality.',
})

// --- Interactive Settings State ---
const codeLanguage = ref('typescript')
const fileName = ref('app.ts')
const useCustomHeader = ref(false)

// State for custom header demo
const frameworks = ['npm', 'pnpm', 'bun', 'yarn']
const currentFramework = ref(0)
const tabItems = frameworks.map(fw => ({ label: fw }))
const commands = [
  'npm install raya-ui',
  'pnpm add raya-ui',
  'bun add raya-ui',
  'yarn add raya-ui'
]

const resetSettings = () => {
  codeLanguage.value = 'typescript'
  fileName.value = 'app.ts'
  useCustomHeader.value = false
  currentFramework.value = 0
}

// --- Preview Code Content ---
const previewCodeContent = computed(() => {
  switch (codeLanguage.value) {
    case 'html':
      return `<div class="p-4 bg-background rounded-xl">\n  <h1 class="text-xl">Hello Raya UI</h1>\n</div>`
    case 'css':
      return `.btn {\n  @apply px-4 py-2 bg-primary text-white rounded-md transition-all;\n}`
    case 'bash':
      return `npm run dev`
    case 'typescript':
    default:
      return `function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Raya UI'));`
  }
})

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add code-block'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add code-block'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add code-block'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add code-block'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install lucide-vue-next`, // Assuming lucide for copy icon
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  if (useCustomHeader.value) {
    return `<script setup lang="ts">
import { ref } from 'vue'
import { CodeBlock } from '@/components/ui/code-block'
import { AnimatedTabs } from '@/components/ui/animated-tabs'

const currentFramework = ref(0)
const tabItems = [{ label: 'npm' }, { label: 'pnpm' }, { label: 'bun' }, { label: 'yarn' }]
const commands = [
  'npm install raya-ui', 'pnpm add raya-ui', 'bun add raya-ui', 'yarn add raya-ui'
]
<\/script>

<template>
  <CodeBlock :code="commands[currentFramework]" lang="bash">
    <template #header>
      <AnimatedTabs
        v-model="currentFramework"
        :items="tabItems"
        variant="link"
        :content="false"
        class="w-fit px-1"
      />
    </template>
  </CodeBlock>
</template>`
  }

  let props = `:code="code"`
  if (codeLanguage.value !== 'typescript') props += `\n    lang="${codeLanguage.value}"`
  if (fileName.value) props += `\n    file-name="${fileName.value}"`

  return `<script setup lang="ts">
import { CodeBlock } from '@/components/ui/code-block'

const code = \`${previewCodeContent.value}\`
<\/script>

<template>
  <CodeBlock
    ${props}
  />
</template>`
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Code Block</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Code Block</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A content-aware code container with syntax highlighting and copy functionality. Supports custom slot headers for package manager tabs.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/code-block</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your code block styling and colors seamlessly from your <code>main.css</code> theme variables.
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
                  code-block
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-2 text-pink-500">
                    <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    CodeBlock.vue
                  </div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">code</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The raw code string to highlight and display.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">lang</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"typescript"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Language for syntax highlighting.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">fileName</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">undefined</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Optional text to display in the header bar. Omitted if the <code>#header</code> slot is used.</p>
          </div>
        </div>

      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Slots</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">#header</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Custom content for the header bar (e.g., placing <code>AnimatedTabs</code> inside). Completely overrides the <code>fileName</code> prop.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full max-w-lg px-6 flex items-center justify-center">
        <!-- Standard CodeBlock Preview -->
        <CodeBlock
            v-if="!useCustomHeader"
            :code="previewCodeContent"
            :lang="codeLanguage"
            :file-name="fileName"
            class="w-full"
        />

        <!-- Custom Header with AnimatedTabs Preview -->
        <CodeBlock
            v-else
            :code="commands[currentFramework]"
            lang="bash"
            class="w-full"
        >
          <template #header>
            <AnimatedTabs
                v-model="currentFramework"
                :items="tabItems"
                variant="link"
                :content="false"
                class="w-fit px-1"
            />
          </template>
        </CodeBlock>
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

      <!-- Custom Header Slot Toggle -->
      <div class="flex items-center justify-between mb-6">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="useCustomHeader = !useCustomHeader">Use Header Slot (Tabs)</label>
        <button @click="useCustomHeader = !useCustomHeader" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', useCustomHeader ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', useCustomHeader ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- File Name Input (Disabled if using Custom Header) -->
      <div class="flex flex-col gap-2 mb-6" :class="{ 'opacity-50 pointer-events-none': useCustomHeader }">
        <label class="text-sm font-medium text-foreground">File Name</label>
        <input
            type="text"
            v-model="fileName"
            :disabled="useCustomHeader"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all"
        />
      </div>

      <!-- Language Select (Disabled if using Custom Header which forces Bash) -->
      <div class="flex flex-col gap-2 mb-2" :class="{ 'opacity-50 pointer-events-none': useCustomHeader }">
        <label class="text-sm font-medium text-foreground">Language</label>
        <div class="relative">
          <select v-model="codeLanguage" :disabled="useCustomHeader" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="bash">Bash</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>
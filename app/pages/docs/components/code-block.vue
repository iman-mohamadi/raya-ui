{
type: uploaded file
fileName: iman-mohamadi/enzoui/EnzOUi-481682bc4f3f825c0131815bd4179e5da136063e/app/pages/docs/components/code-block.vue
fullContent:
<script setup lang="ts">
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

const simpleCode = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Enzo'));`

const installCode = `npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/code-block.json`

// Demo for Animated Tabs integration
const frameworks = ['npm', 'pnpm', 'bun', 'yarn']
const currentFramework = ref(0) // Index for v-model

const commands = [
  'npm install enzo-ui',
  'pnpm add enzo-ui',
  'bun add enzo-ui',
  'yarn add enzo-ui'
]

// Animated Tabs Items
const tabItems = frameworks.map(fw => ({ label: fw }))

// --- New Data for Preview/Code ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const codeBlockUsage = `<script setup lang="ts">
import { CodeBlock } from '@/components/ui/code-block'

const code = \`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`;
}

console.log(greet('Enzo'));\`
<\/script>

<template>
  <CodeBlock :code="code" lang="typescript" />
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Code Block</h1>
      <p class="text-xl text-zinc-400">
        A content-aware code container with syntax highlighting and copy functionality.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 mt-4 p-10 flex flex-col items-center justify-center min-h-[350px]">
          <div class="w-full max-w-md">
            <CodeBlock :code="simpleCode" lang="typescript" />
          </div>
        </div>
      </template>
      <template #code>
        <div class="mt-4">
          <CodeBlock :code="codeBlockUsage" lang="html" />
        </div>
      </template>
    </AnimatedTabs>

    <div class="space-y-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">With Filename</h2>
      <p class="text-zinc-400">Adding a <code>file-name</code> prop automatically creates a header bar.</p>
      <CodeBlock :code="installCode"  file-name="Terminal" />
    </div>

    <div class="space-y-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">With Animated Tabs</h2>
      <p class="text-zinc-400">
        You can place <code>AnimatedTabs</code> directly inside the <code>#header</code> slot.
      </p>

      <CodeBlock
          :code="commands[currentFramework]"

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

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">code</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3">The raw code string to highlight.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">lang</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3">Language for syntax highlighting (default: 'typescript').</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">fileName</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3">Optional text to display in a header bar (if no header slot).</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Slots</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Slot</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">#header</td>
            <td class="px-4 py-3">
              Custom content for the header bar (e.g., <code>AnimatedTabs</code>).
              Overrides <code>fileName</code>.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
}
<script setup lang="ts">
import { EncryptedText } from '@/components/ui/encrypted-text'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- Tabs Config ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

// --- Code Snippets ---
const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/encrypted-text.json`,
  manual: `npm install @vueuse/core`
}

const usageCode = `<script setup lang="ts">
import { EncryptedText } from '@/components/ui/encrypted-text'
<\/script>

<template>
  <div class="space-y-4">
    <h1 class="text-4xl font-bold">
      <EncryptedText
        text="Experience the future of UI"
        :reveal-delay-ms="80"
      />
    </h1>

    <p class="text-zinc-400">
      <EncryptedText
        text="Secure, animated, and highly performant text rendering."
        :reveal-delay-ms="30"
        encrypted-class="text-teal-500 blur-[2px] opacity-50"
      />
    </p>
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Encrypted Text</h1>
      <p class="text-xl text-zinc-400">
        A cyberpunk-style text reveal animation that unscrambles random characters into legible text.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 mt-4 h-[350px] flex flex-col items-center justify-center p-8 text-center">

          <div class="space-y-6 max-w-lg">
            <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">
              <EncryptedText
                  text="Raya UI Primitives"
                  :reveal-delay-ms="100"
              />
            </h2>

            <div class="text-lg text-zinc-400 font-mono">
              <span class="text-teal-500 mr-2">></span>
              <EncryptedText
                  text="Initializing secure connection..."
                  :reveal-delay-ms="40"
                  class="inline"
              />
            </div>

            <div class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-500">
              <EncryptedText
                  text="Data encryption in progress. Decrypting payload sector 7G..."
                  :reveal-delay-ms="20"
                  encrypted-class="text-teal-600/50 blur-[1px]"
              />
            </div>
          </div>

        </div>
      </template>
      <template #code>
        <div class="mt-4">
          <CodeBlock :code="usageCode" lang="html" />
        </div>
      </template>
    </AnimatedTabs>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installCommands.npm"  />
        </template>
        <template #manual>
          <div class="space-y-2">
            <p class="text-sm text-zinc-400">Install dependencies:</p>
            <CodeBlock :code="installCommands.manual"  />
            <p class="text-sm text-zinc-400 mt-4">Copy the component code into your project.</p>
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">text</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">The final text to reveal.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">revealDelayMs</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">50</td>
            <td class="px-4 py-3">Speed of the reveal (ms per character).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">flipDelayMs</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">50</td>
            <td class="px-4 py-3">Speed of the gibberish character scrambling.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">encryptedClass</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">Class applied to unrevealed (scrambled) characters.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
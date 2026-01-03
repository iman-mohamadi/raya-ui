<script setup lang="ts">
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Code Block Component for Vue & Nuxt',
  description: 'A content-aware code container with syntax highlighting and copy functionality for Vue and Nuxt applications.',
  ogTitle: 'Code Block Component for Vue & Nuxt',
  ogDescription: 'A content-aware code container with syntax highlighting and copy functionality for Vue and Nuxt applications.',
})

const simpleCode = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet('${config.name}'));`

const installCode = `npx shadcn-vue@latest add ${config.baseUrl}/code-block.json`

// Demo for Animated Tabs integration
const frameworks = ['npm', 'pnpm', 'bun', 'yarn']
const currentFramework = ref(0) // Index for v-model

const commands = [
  'npm install raya-ui',
  'pnpm add raya-ui',
  'bun add raya-ui',
  'yarn add raya-ui'
]

// Animated Tabs Items
const tabItems = frameworks.map(fw => ({ label: fw }))

const codeBlockUsage = `<script setup lang="ts">
import { CodeBlock } from '@/components/ui/code-block'

const code = \`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`;
}

console.log(greet('${config.name}'));\`
<\/script>

<template>
  <CodeBlock :code="code" lang="typescript" />
</template>`

const filenameUsage = `<CodeBlock
  code="${installCode}"
  file-name="Terminal"
/>`

const animatedTabsUsage = `<template>
  <CodeBlock :code="commands[currentFramework]">
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
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Code Block"
        description="A content-aware code container with syntax highlighting and copy functionality."
    />
    <Divider/>
    <div class="mt-4">
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="relative rounded-xl border border-edge bg-background flex flex-col items-center justify-center min-h-[350px] p-10">
            <div class="w-full max-w-md">
              <CodeBlock :code="simpleCode" lang="typescript" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="codeBlockUsage" lang="html"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <div class="space-y-4">
        <CodeBlock :code="installCode" lang="bash" />
      </div>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">With Filename</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">Adding a <code>file-name</code> prop automatically creates a header bar.</p>

        <Tabs default-value="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div class="rounded-xl border border-edge bg-background p-6 flex justify-center">
              <div class="w-full max-w-md">
                <CodeBlock :code="installCode" file-name="Terminal" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock :code="filenameUsage" lang="html"/>
          </TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">With Animated Tabs</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">
          You can place <code>AnimatedTabs</code> directly inside the <code>#header</code> slot.
        </p>

        <Tabs default-value="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div class="rounded-xl border border-edge bg-background p-6 flex justify-center">
              <div class="w-full max-w-md">
                <CodeBlock :code="commands[currentFramework]">
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
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock :code="animatedTabsUsage" lang="html"/>
          </TabsContent>
        </Tabs>
      </div>

    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-edge bg-background">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-edge bg-background text-zinc-400 dark:text-zinc-600">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-edge text-zinc-700 dark:text-zinc-300">
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

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Slots</h2>
      <div class="overflow-x-auto rounded-lg border border-edge bg-background">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-edge bg-background text-zinc-400 dark:text-zinc-600">
          <tr>
            <th class="px-4 py-3 font-medium">Slot</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-edge text-zinc-700 dark:text-zinc-300">
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
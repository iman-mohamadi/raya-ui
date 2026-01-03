<script setup lang="ts">
import { PartitionBar, PartitionBarSegment, PartitionBarSegmentTitle, PartitionBarSegmentValue } from '@/components/ui/partition-bar'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

const PREVIEW_TABS = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/partition-bar.json`,
  manual: `npm install clsx tailwind-merge class-variance-authority`
}

const defaultCode = `<script setup lang="ts">
import {
  PartitionBar,
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from '@/components/ui/partition-bar'
<\/script>

<template>
  <div class="w-full max-w-2xl">
    <PartitionBar>
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
  </div>
</template>`

const coloredCode = `<template>
  <PartitionBar :gap="2">
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

const alignmentCode = `<template>
  <PartitionBar size="lg">
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

useSeoMeta({
  title: 'Partition Bar Component for Vue & Nuxt',
  description: 'A proportional bar chart component for visualizing distributed data values.',
  ogTitle: 'Partition Bar Component for Vue & Nuxt',
  ogDescription: 'A proportional bar chart component for visualizing distributed data values.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Partition Bar"
        description="A horizontal proportional bar chart for visualizing part-to-whole relationships."
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
          <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center min-h-[350px] p-10">
            <div class="w-full max-w-2xl">
              <PartitionBar>
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
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="defaultCode" lang="html"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <div class="space-y-4">
        <CodeBlock :code="installCommands.npm"/>
        <p class="text-sm text-zinc-400">Or manually:</p>
        <CodeBlock :code="installCommands.manual"/>
      </div>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Variants</h3>
        <p class="text-zinc-400 text-sm">
          Use <code>variant</code> props to apply standard theme colors.
        </p>
        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center min-h-[250px] p-10">
              <div class="w-full max-w-xl">
                <PartitionBar :gap="2">
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
              </div>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="coloredCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Alignment & Sizes</h3>
        <p class="text-zinc-400 text-sm">
          Control label placement with <code>alignment</code> and spacing with <code>size</code>.
        </p>
        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center min-h-[250px] p-10">
              <div class="w-full max-w-xl">
                <PartitionBar size="lg">
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
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="alignmentCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>

      <h3 class="text-xl font-semibold mt-6 mb-4">PartitionBar</h3>
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
            <td class="px-4 py-3 font-mono text-purple-400">gap</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">1</td>
            <td class="px-4 py-3">Space between segments (multiplied by 4px).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">size</td>
            <td class="px-4 py-3 font-mono text-xs">'sm' | 'md' | 'lg'</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'md'</td>
            <td class="px-4 py-3">Height of the bar segments.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">class</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">Custom class for the wrapper list.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-xl font-semibold mt-8 mb-4">PartitionBarSegment</h3>
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
            <td class="px-4 py-3 font-mono text-purple-400">num</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">0</td>
            <td class="px-4 py-3">Value relative to the sum of all segments.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">variant</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'default'</td>
            <td class="px-4 py-3">Theme color (default, secondary, destructive, outline, muted).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">alignment</td>
            <td class="px-4 py-3 font-mono text-xs">'left' | 'center' | 'right'</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'center'</td>
            <td class="px-4 py-3">Horizontal alignment of the content under the bar.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">class</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">Custom class for the segment wrapper.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--  Copy Right if exist  -->
    <div class="h-g"/>

    <Divider/>

    <div class="mt-4 text-sm">
      <p>Source content adapted from <a
          href="https://ui.8starlabs.com/docs/components/partition-bar"
          target="_blank" class="underline hover:text-zinc-300">8 Star labs</a>.</p>
    </div>
  </div>
</template>
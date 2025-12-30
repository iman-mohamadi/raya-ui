<script setup lang="ts">
import { ref } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Wheel Picker Component for Vue & Nuxt',
  description: 'A high-performance, iOS-style 3D physics-based wheel picker component for Vue and Nuxt applications.',
  ogTitle: 'Wheel Picker Component for Vue & Nuxt',
  ogDescription: 'A high-performance, iOS-style 3D physics-based wheel picker component for Vue and Nuxt applications.',
})

// --- Demo Data: Time Picker ---
const hours = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }))
const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))
const meridiem = [{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]
const timeState = ref({ hour: 9, minute: 41, ampm: 'AM' })

// --- Demo Data: Date Picker ---
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    .map((m, i) => ({ value: i, label: m }))
const days = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: (i + 1).toString() }))
const years = Array.from({ length: 50 }, (_, i) => ({ value: 2025 - i, label: (2025 - i).toString() }))
const dateState = ref({ month: 5, day: 15, year: 2025 })

// --- Demo Data: Score Picker ---
const scores = Array.from({ length: 11 }, (_, i) => ({ value: i, label: i.toString() }))
const scoreState = ref(5)

// --- Tabs Configuration ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

const packageManagerTabs = [
  { label: 'npm', slot: 'npm' },
  { label: 'pnpm', slot: 'pnpm' },
  { label: 'yarn', slot: 'yarn' },
  { label: 'bun', slot: 'bun' }
]

// --- Code Snippets ---
const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/wheel-picker.json`,
  pnpm: `pnpm dlx shadcn-vue@latest add ${config.baseUrl}/wheel-picker.json`,
  yarn: `npx shadcn-vue@latest add ${config.baseUrl}/wheel-picker.json`,
  bun: `bunx shadcn-vue@latest add ${config.baseUrl}/wheel-picker.json`,
  manual: `npm install @vueuse/core`
}

const previewCode = `<script setup lang="ts">
import { ref } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'

const timeState = ref({ hour: 9, minute: 41, ampm: 'AM' })

const hours = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }))
const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))
const meridiem = [{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]
<\/script>

<template>
  <div class="relative flex h-56 w-64 flex-col items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-2xl">
    <div class="absolute top-0 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-zinc-900"></div>
    <WheelPickerWrapper class="w-full px-6">
      <WheelPicker v-model="timeState.hour" :options="hours" infinite />
      <WheelPicker v-model="timeState.minute" :options="minutes" infinite />
      <WheelPicker v-model="timeState.ampm" :options="meridiem" />
    </WheelPickerWrapper>
  </div>
</template>`

const usageCode = `<template>
  <WheelPickerWrapper>
    <WheelPicker v-model="value" :options="options" />
  </WheelPickerWrapper>
</template>`

const dateCode = `<script setup lang="ts">
import { ref } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'

const dateState = ref({ month: 5, day: 15, year: 2025 })
// ... options arrays (months, days, years)
<\/script>

<template>
  <WheelPickerWrapper>
    <WheelPicker v-model="dateState.month" :options="months" infinite class="flex-[2]" />
    <WheelPicker v-model="dateState.day" :options="days" infinite class="flex-1" />
    <WheelPicker v-model="dateState.year" :options="years" infinite class="flex-1" />
  </WheelPickerWrapper>
</template>`

const customCode = `<script setup lang="ts">
import { ref } from 'vue'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'

const score = ref(5)
const scores = Array.from({ length: 11 }, (_, i) => ({ value: i, label: i.toString() }))
<\/script>

<template>
  <WheelPickerWrapper>
    <WheelPicker
      v-model="score"
      :options="scores"
      :class-names="{
        highlightWrapper: 'border-blue-500/50 bg-blue-500/10 rounded-lg',
        highlightItem: 'text-blue-500 font-bold'
      }"
    />
  </WheelPickerWrapper>
</template>`
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Wheel Picker"
        description="A high-performance, iOS-style 3D physics based picker."
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
          <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center justify-center min-h-[400px] p-10">
            <ClientOnly>
              <div class="relative flex h-56 w-64 flex-col items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-2xl">
                <div class="absolute top-0 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-zinc-900"></div>
                <WheelPickerWrapper class="w-full px-6">
                  <WheelPicker v-model="timeState.hour" :options="hours" infinite />
                  <WheelPicker v-model="timeState.minute" :options="minutes" infinite />
                  <WheelPicker v-model="timeState.ampm" :options="meridiem" />
                </WheelPickerWrapper>
              </div>
            </ClientOnly>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="previewCode" lang="html" file-name="TimePicker.vue"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Installation
      </h2>

      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <AnimatedTabs :items="packageManagerTabs" variant="link" class="w-full">
            <template #npm>
              <CodeBlock :code="installCommands.npm"  class="mt-4" />
            </template>
            <template #pnpm>
              <CodeBlock :code="installCommands.pnpm"  class="mt-4" />
            </template>
            <template #yarn>
              <CodeBlock :code="installCommands.yarn"  class="mt-4" />
            </template>
            <template #bun>
              <CodeBlock :code="installCommands.bun"  class="mt-4" />
            </template>
          </AnimatedTabs>
        </template>

        <template #manual>
          <CodeBlock :code="installCommands.manual"  />
          <div class="mt-4 text-sm text-zinc-400">
            <p>1. Install dependencies.</p>
            <p>2. Copy the component code into your project.</p>
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Usage
      </h2>
      <CodeBlock :code="usageCode" lang="html" />
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">
        Examples
      </h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Date Picker</h3>
        <p class="text-zinc-400 text-sm">Combine multiple pickers to create a cohesive date selector.</p>

        <Tabs default-value="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center justify-center min-h-[350px] p-10">
              <ClientOnly>
                <div class="w-80 rounded-xl border border-zinc-800 bg-black p-4">
                  <WheelPickerWrapper>
                    <WheelPicker v-model="dateState.month" :options="months" infinite class="flex-[2]" />
                    <WheelPicker v-model="dateState.day" :options="days" infinite class="flex-1" />
                    <WheelPicker v-model="dateState.year" :options="years" infinite class="flex-1" />
                  </WheelPickerWrapper>
                </div>
              </ClientOnly>
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock :code="dateCode" lang="html" file-name="DatePicker.vue"/>
          </TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Custom Styling</h3>
        <p class="text-zinc-400 text-sm">Use <code>class-names</code> to style the highlight bar and text.</p>

        <Tabs default-value="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center justify-center min-h-[350px] p-10">
              <ClientOnly>
                <div class="w-48 rounded-xl border border-zinc-800 bg-black p-4">
                  <WheelPickerWrapper>
                    <WheelPicker
                        v-model="scoreState"
                        :options="scores"
                        :class-names="{
                          highlightWrapper: 'border-blue-500/50 bg-blue-500/10 rounded-lg',
                          highlightItem: 'text-blue-500 font-bold'
                        }"
                    />
                  </WheelPickerWrapper>
                </div>
              </ClientOnly>
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock :code="customCode" lang="html" file-name="CustomPicker.vue"/>
          </TabsContent>
        </Tabs>
      </div>

    </div>

  </div>
</template>
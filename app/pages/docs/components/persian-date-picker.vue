<script setup lang="ts">
import { ref } from 'vue'
import { PersianDatePicker, type DateRangeValue } from '@/components/ui/persian-date-picker'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Persian Date Picker Component',
  description: 'A fully featured Jalali date picker for Vue and Nuxt with range support, year/month navigation, and custom slots.',
})

// State for examples
const singleDate = ref('2026-02-14')
const rangeDate = ref<DateRangeValue>({ start: '2026-02-14', end: '2026-02-19' })
const twoColDate = ref<DateRangeValue>({ start: null, end: null })

const installCode = `npx shadcn-vue@latest add ${config.baseUrl}/persian-date-picker.json`

const usageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'

const date = ref('2026-02-14')
const range = ref({ start: null, end: null })
<\/script>

<template>
  <PersianDatePicker v-model="date" />
  <PersianDatePicker v-model="range" range />
</template>`
</script>

<template>
  <div class="pb-10">
    <PageTitle
        title="Persian Date Picker"
        description="A comprehensive Jalali (Persian) date picker component with support for single dates, ranges, and two-column layouts."
    />

    <Divider />

    <div class="mt-6 space-y-6">
      <section>
        <h3 class="text-lg font-semibold mb-3">Single Date Selection</h3>
        <div class="rounded-xl border border-border bg-background p-6">
          <PersianDatePicker v-model="singleDate" class="w-full max-w-sm" />
          <p class="mt-4 text-sm text-muted-foreground">Selected ISO: <code class="bg-muted px-1 rounded">{{ singleDate }}</code></p>
        </div>
      </section>
      <section>
        <Divider />

        <div class="space-y-4 mt-6">
          <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
          <CodeBlock :code="installCode" />
        </div>
      </section>
      <section>
        <h3 class="text-lg font-semibold mb-3">Range Selection</h3>
        <div class="rounded-xl border border-border bg-background p-6">
          <PersianDatePicker
              v-model="rangeDate"
              range
              placeholder="Select a date range"
              class="w-full max-w-sm"
          />
          <p class="mt-4 text-sm text-muted-foreground">
            Start: <code class="bg-muted px-1 rounded">{{ rangeDate.start || '-' }}</code>
            End: <code class="bg-muted px-1 rounded">{{ rangeDate.end || '-' }}</code>
          </p>
        </div>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-3">Two Columns Layout</h3>
        <p class="text-sm text-muted-foreground mb-4">Useful for range pickers to show two consecutive months.</p>
        <div class="rounded-xl border border-border bg-background p-6">
          <PersianDatePicker
              v-model="twoColDate"
              range
              two-columns
              range-placeholder="Travel dates..."
              class="w-full max-w-sm"
          />
        </div>
      </section>

      <div class="h-4"></div>

      <Tabs default-value="code">
        <TabsList>
          <TabsTrigger value="code">Usage Code</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <CodeBlock :code="usageCode" lang="html" file-name="PersianDateExample.vue" />
        </TabsContent>
      </Tabs>
    </div>

    <Divider class="my-8" />

    <div class="space-y-6">
      <h2 class="text-2xl font-semibold tracking-tight">API Reference</h2>

      <div class="space-y-3">
        <h3 class="text-lg font-medium">Props</h3>
        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th class="p-3">Prop</th>
              <th class="p-3">Type</th>
              <th class="p-3">Default</th>
              <th class="p-3">Description</th>
            </tr>
            </thead>
            <tbody class="divide-y">
            <tr>
              <td class="p-3 font-mono">modelValue</td>
              <td class="p-3 font-mono text-xs text-blue-500">string | { start: string, end: string }</td>
              <td class="p-3 font-mono text-xs">-</td>
              <td class="p-3">The selected date (ISO 8601 format).</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">range</td>
              <td class="p-3 font-mono text-xs text-blue-500">boolean</td>
              <td class="p-3 font-mono text-xs">false</td>
              <td class="p-3">Enable range selection mode.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">twoColumns</td>
              <td class="p-3 font-mono text-xs text-blue-500">boolean</td>
              <td class="p-3 font-mono text-xs">false</td>
              <td class="p-3">Show two consecutive months side-by-side.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">placeholder</td>
              <td class="p-3 font-mono text-xs text-blue-500">string</td>
              <td class="p-3">"انتخاب تاریخ"</td>
              <td class="p-3">Placeholder text when no date is selected.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">disabled</td>
              <td class="p-3 font-mono text-xs text-blue-500">boolean</td>
              <td class="p-3 font-mono text-xs">false</td>
              <td class="p-3">Disables the input trigger.</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-lg font-medium">Events</h3>
        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th class="p-3">Event</th>
              <th class="p-3">Payload</th>
              <th class="p-3">Description</th>
            </tr>
            </thead>
            <tbody class="divide-y">
            <tr>
              <td class="p-3 font-mono">update:modelValue</td>
              <td class="p-3 font-mono text-xs text-blue-500">string | object</td>
              <td class="p-3">Emitted when the selected date changes (v-model support).</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">change</td>
              <td class="p-3 font-mono text-xs text-blue-500">string | object</td>
              <td class="p-3">Emitted when a selection is confirmed.</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-lg font-medium">Slots</h3>
        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th class="p-3">Slot Name</th>
              <th class="p-3">Scoped Props</th>
              <th class="p-3">Description</th>
            </tr>
            </thead>
            <tbody class="divide-y">
            <tr>
              <td class="p-3 font-mono">#header</td>
              <td class="p-3 font-mono text-xs">currentMonthLabel, currentYearLabel, toggleView, ...</td>
              <td class="p-3">Replace the default navigation header.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">#footer</td>
              <td class="p-3 font-mono text-xs">clear, close, goToday, ...</td>
              <td class="p-3">Add actions to the bottom of the picker.</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="h-10" />
    </div>
  </div>
</template>
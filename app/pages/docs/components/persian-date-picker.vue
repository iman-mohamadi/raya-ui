<script setup lang="ts">
import { ref } from 'vue'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Persian Date Picker',
  description: 'A fully accessible Jalali/Gregorian date picker built on Reka UI with range support and ISO string compatibility.',
})

// State for examples
const singleDate = ref('2026-02-14')
const rangeDate = ref({ start: '2026-02-14', end: '2026-02-19' })

const installCode = `npx shadcn-vue@latest add ${config.baseUrl}/persian-date-picker.json`

const usageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'

// Accepts standard ISO strings
const date = ref('2026-02-14')
const range = ref({ start: '2026-02-14', end: '2026-02-19' })
<\/script>

<template>
  <PersianDatePicker v-model="date" placeholder="Select Date" />

  <PersianDatePicker v-model="range" range placeholder="Select Range" />
</template>`
</script>

<template>
  <div class="pb-10">
    <PageTitle
        title="Persian Date Picker"
        description="A robust, accessible date picker built on Reka UI. Features native Jalali/Gregorian switching, weekend highlighting, and ISO-8601 string support."
    />

    <Divider />

    <div class="mt-6 space-y-6">
      <section>
        <h3 class="text-lg font-semibold mb-3">Single Date Selection</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Default mode. Automatically handles Jalali (Persian) locale and weekends (Friday).
          Users can switch to Gregorian (AD) using the internal toggle.
        </p>
        <div class="rounded-xl border border-border bg-background p-6 flex flex-col gap-4">
          <PersianDatePicker v-model="singleDate" class="w-full max-w-sm" />
          <div class="rounded-md bg-muted p-3 text-xs font-mono">
            v-model: {{ singleDate }}
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-lg font-semibold mb-3">Range Selection</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Enable range mode by passing the <code>range</code> prop. The model value becomes an object with <code>start</code> and <code>end</code> keys.
        </p>
        <div class="rounded-xl border border-border bg-background p-6 flex flex-col gap-4">
          <PersianDatePicker
              v-model="rangeDate"
              range
              placeholder="انتخاب بازه زمانی"
              class="w-full max-w-sm"
          />
          <div class="rounded-md bg-muted p-3 text-xs font-mono">
            v-model: {{ rangeDate }}
          </div>
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
              <td class="p-3">
                The selected date in ISO 8601 format (e.g., <code>2024-03-20</code>).
              </td>
            </tr>
            <tr>
              <td class="p-3 font-mono">range</td>
              <td class="p-3 font-mono text-xs text-blue-500">boolean</td>
              <td class="p-3 font-mono text-xs">false</td>
              <td class="p-3">Enables date range selection mode.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">placeholder</td>
              <td class="p-3 font-mono text-xs text-blue-500">string</td>
              <td class="p-3">"انتخاب تاریخ"</td>
              <td class="p-3">Text displayed when no date is selected.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">disabled</td>
              <td class="p-3 font-mono text-xs text-blue-500">boolean</td>
              <td class="p-3 font-mono text-xs">false</td>
              <td class="p-3">Disables interaction with the picker.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono">class</td>
              <td class="p-3 font-mono text-xs text-blue-500">string</td>
              <td class="p-3 font-mono text-xs">-</td>
              <td class="p-3">Custom classes for the trigger button wrapper.</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-lg font-medium">Features</h3>
        <ul class="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li><strong>Native Jalali Support:</strong> Uses <code>fa-IR-u-ca-persian</code> locale for accurate Persian calendar calculations.</li>
          <li><strong>Dual Mode:</strong> Users can toggle between Jalali and Gregorian calendars inside the popup.</li>
          <li><strong>Weekend Logic:</strong> Automatically highlights Fridays in Jalali mode and Sat/Sun in Gregorian mode.</li>
          <li><strong>RTL/LTR:</strong> Automatically adjusts layout direction based on the active calendar.</li>
          <li><strong>Keyboard Navigation:</strong> Full keyboard support powered by Reka UI.</li>
        </ul>
      </div>

    </div>

    <div class="h-10" />
    <Divider />

    <div class="space-y-4 mt-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <CodeBlock :code="installCode" />
    </div>
  </div>
</template>
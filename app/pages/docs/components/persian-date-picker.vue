<script setup lang="ts">
import { ref } from 'vue'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Persian Date Picker Component for Vue & Nuxt',
  description: 'A Jalali (Persian) date picker with single/range mode, optional 2-column layout, and header/footer slots.',
  ogTitle: 'Persian Date Picker Component for Vue & Nuxt',
  ogDescription: 'A Jalali (Persian) date picker with single/range mode, optional 2-column layout, and header/footer slots.',
})

const singleDate = ref('2026-02-14')
const rangeDate = ref<{ start: string | null; end: string | null }>({
  start: '2026-02-14',
  end: '2026-02-19',
})

const installCode = `npx shadcn-vue@latest add ${config.baseUrl}/persian-date-picker.json`

const usageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'

const singleDate = ref('2026-02-14')
const rangeDate = ref({ start: '2026-02-14', end: '2026-02-19' })
<\/script>

<template>
  <!-- Single date -->
  <PersianDatePicker v-model="singleDate" />

  <!-- Range + 2 columns + header/footer slots -->
  <PersianDatePicker v-model="rangeDate" range two-columns>
    <template #header="{ currentLabel, nextLabel, prevMonth, nextMonth }">
      <div class="mb-3 flex items-center justify-between rounded-md bg-accent px-2 py-1">
        <button type="button" @click="nextMonth">‹</button>
        <p class="text-sm">{{ currentLabel }} <span v-if="nextLabel">- {{ nextLabel }}</span></p>
        <button type="button" @click="prevMonth">›</button>
      </div>
    </template>

    <template #footer="{ selectedLabel, clear }">
      <div class="mt-3 flex items-center justify-between border-t pt-3">
        <span class="text-xs">{{ selectedLabel }}</span>
        <button type="button" @click="clear">Clear</button>
      </div>
    </template>
  </PersianDatePicker>
</template>`
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Persian Date Picker"
        description="Jalali date picker with range mode, two-column calendar, and header/footer slots."
    />

    <Divider />

    <div class="mt-4 space-y-4">
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="rounded-xl border border-edge bg-background p-8 min-h-[280px] space-y-8">
            <div class="space-y-3">
              <p class="text-sm font-medium">Single Date</p>
              <PersianDatePicker v-model="singleDate" class="w-full max-w-sm" />
              <p class="text-xs text-muted-foreground">v-model: {{ singleDate }}</p>
            </div>

            <div class="space-y-3">
              <p class="text-sm font-medium">Range + Two Columns + Slots</p>
              <PersianDatePicker v-model="rangeDate" range two-columns class="max-w-sm">
                <template #header="{ currentLabel, nextLabel, prevMonth, nextMonth }">
                  <div class="mb-3 flex items-center justify-between rounded-md border border-border bg-accent/30 px-2 py-1">
                    <button type="button" class="rounded p-1 hover:bg-accent" @click="nextMonth">‹</button>
                    <p class="text-xs font-medium text-center">{{ currentLabel }} <span v-if="nextLabel">- {{ nextLabel }}</span></p>
                    <button type="button" class="rounded p-1 hover:bg-accent" @click="prevMonth">›</button>
                  </div>
                </template>

                <template #footer="{ selectedLabel, clear }">
                  <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span class="text-xs text-muted-foreground">{{ selectedLabel }}</span>
                    <button type="button" class="rounded-md px-2 py-1 text-xs hover:bg-accent" @click="clear">پاک کردن</button>
                  </div>
                </template>
              </PersianDatePicker>
              <p class="text-xs text-muted-foreground">v-model: {{ rangeDate }}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="usageCode" lang="html" file-name="PersianDateExample.vue" />
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g" />
    <Divider />

    <div class="space-y-4 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <CodeBlock :code="installCode" />
    </div>
  </div>
</template>

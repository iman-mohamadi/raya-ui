<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
  RangeCalendarRoot,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarGrid,
  RangeCalendarGridHead,
  RangeCalendarGridBody,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
} from 'reka-ui'
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date'
import { cn } from '@/lib/utils'

// --- Props & Emits ---
const props = withDefaults(defineProps<{
  modelValue?: string | { start?: string | null; end?: string | null } | null
  placeholder?: string
  range?: boolean
  disabled?: boolean
  class?: string
}>(), {
  placeholder: 'انتخاب تاریخ',
})

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string | { start?: string | null; end?: string | null } | null): void
}>()

// --- State ---
const isOpen = ref(false)
const calendarMode = ref<'jalali' | 'gregorian'>('jalali')
const rootRef = ref<HTMLElement | null>(null)

// Initialize placeholder to today
const placeholder = ref(today(getLocalTimeZone()))

// --- Locale Logic ---
const locale = computed(() => calendarMode.value === 'jalali' ? 'fa-IR-u-ca-persian' : 'en-US')
const dir = computed(() => calendarMode.value === 'jalali' ? 'rtl' : 'ltr')

// --- Model Value (Strict Handling) ---
const modelValueRef = computed({
  get: () => {
    // 1. Range Mode Handling
    if (props.range) {
      if (props.modelValue && typeof props.modelValue === 'object') {
        return {
          start: props.modelValue.start ? parseDate(props.modelValue.start) : undefined,
          end: props.modelValue.end ? parseDate(props.modelValue.end) : undefined
        }
      }
      // CRITICAL FIX: Must return object with undefined fields, NOT undefined itself
      return { start: undefined, end: undefined }
    }

    // 2. Single Mode Handling
    if (typeof props.modelValue === 'string') {
      try {
        return parseDate(props.modelValue)
      } catch {
        return undefined
      }
    }
    return undefined
  },
  set: (v: any) => {
    // Handle Clearing
    if (!v) {
      emit('update:modelValue', props.range ? { start: null, end: null } : null)
      return
    }

    // Handle Range Set
    if (props.range) {
      emit('update:modelValue', {
        start: v.start?.toString() ?? null,
        end: v.end?.toString() ?? null
      })
    }
    // Handle Single Set
    else {
      emit('update:modelValue', v.toString())
      closeCalendar()
    }
  }
})

// --- Placeholder Sync (Fixes "No Date" on Open) ---
watch(isOpen, (open) => {
  if (open) {
    // When opening, jump to the selected date OR today
    if (props.range && props.modelValue && typeof props.modelValue === 'object' && props.modelValue.start) {
      try { placeholder.value = parseDate(props.modelValue.start) } catch {}
    } else if (!props.range && typeof props.modelValue === 'string') {
      try { placeholder.value = parseDate(props.modelValue) } catch {}
    } else {
      placeholder.value = today(getLocalTimeZone())
    }
  }
})

// --- Formatters ---
const formatter = computed(() => new DateFormatter(locale.value, { dateStyle: 'medium' }))

const displayLabel = computed(() => {
  try {
    if (props.range && typeof props.modelValue === 'object') {
      if (props.modelValue?.start) {
        const start = parseDate(props.modelValue.start).toDate(getLocalTimeZone())
        const end = props.modelValue.end ? parseDate(props.modelValue.end).toDate(getLocalTimeZone()) : null
        return end
            ? `${formatter.value.format(start)} - ${formatter.value.format(end)}`
            : `${formatter.value.format(start)} - ...`
      }
      return props.placeholder
    }
    if (typeof props.modelValue === 'string') {
      return formatter.value.format(parseDate(props.modelValue).toDate(getLocalTimeZone()))
    }
  } catch (e) {
    return props.placeholder
  }
  return props.placeholder
})

// --- Actions ---
function toggleCalendarMode() {
  calendarMode.value = calendarMode.value === 'jalali' ? 'gregorian' : 'jalali'
}

function closeCalendar() {
  // Avoid closing in the same tick as calendar internals update DOM.
  setTimeout(() => {
    isOpen.value = false
  }, 0)
}

function handleToday() {
  const t = today(getLocalTimeZone())
  placeholder.value = t
  if (props.range) {
    // For range, setting today sets start=today, end=today (or just start)
    emit('update:modelValue', { start: t.toString(), end: t.toString() })
  } else {
    emit('update:modelValue', t.toString())
    closeCalendar()
  }
}

function clear() {
  emit('update:modelValue', props.range ? { start: null, end: null } : null)
}

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(isOpen, (v) => {
  if (v) setTimeout(() => document.addEventListener('click', onClickOutside), 0)
  else document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div ref="rootRef" :class="cn('relative w-full max-w-sm', props.class)">

    <button
        type="button"
        :dir="dir"
        :disabled="disabled"
        class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        @click="isOpen = !isOpen"
    >
      <span class="truncate">{{ displayLabel }}</span>
      <span class="text-muted-foreground opacity-50">▼</span>
    </button>

    <div
        v-if="isOpen"
        :dir="dir"
        class="absolute z-50 mt-2 w-fit rounded-lg border border-border bg-popover p-3 shadow-xl"
    >
      <CalendarRoot
          v-if="!range"
          :key="'single'"
          v-model="modelValueRef"
          v-model:placeholder="placeholder"
          :locale="locale"
          :dir="dir"
          class="p-1"
          v-slot="{ grid, weekDays }"
      >
        <CalendarHeader class="flex items-center justify-between gap-2 mb-4">
          <div class="flex items-center gap-1 w-full justify-between">
            <button
                type="button"
                class="text-[10px] font-bold border rounded px-1.5 py-0.5 hover:bg-accent transition-colors"
                @click="toggleCalendarMode"
            >
              {{ calendarMode === 'jalali' ? 'AD' : 'شمسی' }}
            </button>

            <CalendarHeading class="text-sm font-medium" />

            <button
                type="button"
                class="text-[10px] text-primary hover:underline"
                @click="handleToday"
            >
              {{ calendarMode === 'jalali' ? 'امروز' : 'Today' }}
            </button>
          </div>
        </CalendarHeader>

        <CalendarGrid class="w-full border-collapse space-y-1">
          <CalendarGridHead>
            <CalendarGridRow class="grid grid-cols-7 gap-1 mb-2">
              <CalendarHeadCell
                  v-for="day in weekDays" :key="day"
                  class="rounded-md text-[0.8rem] font-normal text-muted-foreground w-8 h-8 flex items-center justify-center"
              >
                {{ day }}
              </CalendarHeadCell>
            </CalendarGridRow>
          </CalendarGridHead>

          <CalendarGridBody v-for="month in grid" :key="month.value.toString()">
            <CalendarGridRow
                v-for="(weekDates, index) in month.rows"
                :key="index"
                class="flex w-full mt-2 gap-1"
            >
              <CalendarCell
                  v-for="(date, dIndex) in weekDates"
                  :key="date.toString()"
                  :date="date"
                  :class="cn(
                  'relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                  props.range ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md' : 'rounded-md'
                )"
              >
                <CalendarCellTrigger
                    :day="date"
                    :month="month.value"
                    :class="cn(
                    'h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md flex items-center justify-center transition-all',

                    // Weekend Styling
                    (calendarMode === 'jalali' && (dIndex === 6 || date.toDate(getLocalTimeZone()).getDay() === 5)) && 'text-red-500',
                    (calendarMode === 'gregorian' && (date.toDate(getLocalTimeZone()).getDay() === 0 || date.toDate(getLocalTimeZone()).getDay() === 6)) && 'text-red-500',

                    'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:focus:bg-primary',
                    'data-[today]:bg-accent data-[today]:text-accent-foreground',
                    'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
                    'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50'
                  )"
                />
              </CalendarCell>
            </CalendarGridRow>
          </CalendarGridBody>
        </CalendarGrid>
      </CalendarRoot>

      <RangeCalendarRoot
          v-else
          :key="'range'"
          v-model="modelValueRef"
          v-model:placeholder="placeholder"
          :locale="locale"
          :dir="dir"
          class="p-1"
          v-slot="{ grid, weekDays }"
      >
        <RangeCalendarHeader class="flex items-center justify-between gap-2 mb-4">
          <div class="flex items-center gap-1 w-full justify-between">
            <button
                type="button"
                class="text-[10px] font-bold border rounded px-1.5 py-0.5 hover:bg-accent transition-colors"
                @click="toggleCalendarMode"
            >
              {{ calendarMode === 'jalali' ? 'AD' : 'شمسی' }}
            </button>

            <RangeCalendarHeading class="text-sm font-medium" />

            <button
                type="button"
                class="text-[10px] text-primary hover:underline"
                @click="handleToday"
            >
              {{ calendarMode === 'jalali' ? 'امروز' : 'Today' }}
            </button>
          </div>
        </RangeCalendarHeader>

        <RangeCalendarGrid class="w-full border-collapse space-y-1">
          <RangeCalendarGridHead>
            <RangeCalendarGridRow class="grid grid-cols-7 gap-1 mb-2">
              <RangeCalendarHeadCell
                  v-for="day in weekDays" :key="day"
                  class="rounded-md text-[0.8rem] font-normal text-muted-foreground w-8 h-8 flex items-center justify-center"
              >
                {{ day }}
              </RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>

          <RangeCalendarGridBody v-for="month in grid" :key="month.value.toString()">
            <RangeCalendarGridRow
                v-for="(weekDates, index) in month.rows"
                :key="index"
                class="flex w-full mt-2 gap-1"
            >
              <RangeCalendarCell
                  v-for="(date, dIndex) in weekDates"
                  :key="date.toString()"
                  :date="date"
                  :class="cn(
                  'relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20',
                  '[&:has([data-highlighted])]:bg-accent/40 [&:has([data-selection-start])]:bg-accent [&:has([data-selection-end])]:bg-accent',
                  '[&:has([data-selection-start])]:rounded-l-md [&:has([data-selection-end])]:rounded-r-md'
                )"
              >
                <RangeCalendarCellTrigger
                    :day="date"
                    :month="month.value"
                    :class="cn(
                    'h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md flex items-center justify-center transition-all',

                    (calendarMode === 'jalali' && (dIndex === 6 || date.toDate(getLocalTimeZone()).getDay() === 5)) && 'text-red-500',
                    (calendarMode === 'gregorian' && (date.toDate(getLocalTimeZone()).getDay() === 0 || date.toDate(getLocalTimeZone()).getDay() === 6)) && 'text-red-500',

                    'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:focus:bg-primary',
                    'data-[highlighted]:bg-accent/70 data-[highlighted]:text-foreground',
                    'data-[today]:bg-accent data-[today]:text-accent-foreground',
                    'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
                    'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50'
                  )"
                />
              </RangeCalendarCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridBody>
        </RangeCalendarGrid>
      </RangeCalendarRoot>

      <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
        <button type="button" class="text-xs text-muted-foreground hover:text-foreground transition-colors" @click="clear">
          {{ calendarMode === 'jalali' ? 'پاک کردن' : 'Clear' }}
        </button>
      </div>

    </div>
  </div>
</template>

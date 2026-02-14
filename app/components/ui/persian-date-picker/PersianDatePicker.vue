<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

export interface DateRangeValue {
  start?: string | null
  end?: string | null
}

export type ModelValue = string | DateRangeValue | null | undefined

interface Props {
  modelValue?: ModelValue
  placeholder?: string
  rangePlaceholder?: string
  class?: string
  disabled?: boolean
  range?: boolean
  twoColumns?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'انتخاب تاریخ',
  rangePlaceholder: 'انتخاب بازه تاریخ',
  disabled: false,
  range: false,
  twoColumns: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | DateRangeValue): void
  (e: 'change', value: string | DateRangeValue): void
}>()

defineSlots<{
  header?: (props: {
    currentMonthLabel: string
    currentYearLabel: string
    nextLabel: string | null
    prevMonth: () => void
    nextMonth: () => void
    toggleView: (mode: 'month' | 'year' | 'day') => void
    viewMode: 'day' | 'month' | 'year'
    viewYear: number
    viewMonth: number
    calendarMode: 'jalali' | 'gregorian'
    toggleCalendarMode: () => void
  }) => any
  footer?: (props: {
    isRange: boolean
    selectedLabel: string
    start: string | null
    end: string | null
    clear: () => void
    close: () => void
    goToday: () => void
  }) => any
}>()

// --- Types ---
type CalendarMode = 'jalali' | 'gregorian'
type ViewMode = 'day' | 'month' | 'year'

interface DayCell {
  jd: number
  jm: number
  jy: number
  muted: boolean
  iso: string
}

interface MonthView {
  jy: number
  jm: number
  label: string
  days: DayCell[]
}

// --- Constants ---
const jalaliMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]
const gregorianMonthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const jalaliWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const gregorianWeekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Formatters
const faFormatter = new Intl.NumberFormat('fa-IR', { useGrouping: false })
const enFormatter = new Intl.NumberFormat('en-US', { useGrouping: false })

// --- State ---
const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const hoveredIso = ref<string | null>(null)
const viewMode = ref<ViewMode>('day')
const calendarMode = ref<CalendarMode>('jalali')
const isTodayHighlighted = ref(false)

// --- Jalali Core Logic ---
function div(a: number, b: number) { return Math.floor(a / b) }
function mod(a: number, b: number) { return a - Math.floor(a / b) * b }

function jalCal(jy: number) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178]
  const bl = breaks.length
  const gy = jy + 621
  let leapJ = -14
  let jp = breaks[0]
  let jm = 0
  let jump = 0
  if (jy < jp || jy >= breaks[bl - 1]) throw new Error('Invalid Jalaali year')
  for (let i = 1; i < bl; i += 1) {
    jm = breaks[i]
    jump = jm - jp
    if (jy < jm) break
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }
  let n = jy - jp
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150
  const march = 20 + leapJ - leapG
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33
  let leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) leap = 4
  return { leap, gy, march }
}

function g2d(gy: number, gm: number, gd: number) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
  d += div(153 * mod(gm + 9, 12) + 2, 5)
  d += gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  const i = div(mod(j, 1461), 4) * 5 + 308
  const gd = div(mod(i, 153), 5) + 1
  const gm = mod(div(i, 153), 12) + 1
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return { gy, gm, gd }
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}

function d2j(jdn: number) {
  const g = d2g(jdn)
  let jy = g.gy - 621
  const r = jalCal(jy)
  const jdn1f = g2d(g.gy, 3, r.march)
  let k = jdn - jdn1f
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 }
    k -= 186
  } else {
    jy -= 1
    k += 179
    if (r.leap === 1) k += 1
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 }
}

function toJalali(gy: number, gm: number, gd: number) { return d2j(g2d(gy, gm, gd)) }
function toGregorian(jy: number, jm: number, jd: number) { return d2g(j2d(jy, jm, jd)) }
function isLeapJalaliYear(jy: number) { return jalCal(jy).leap === 0 }
function getJalaliMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  return isLeapJalaliYear(jy) ? 30 : 29
}

// --- ISO Utils ---
function parseIsoDate(value?: string | null): Date | null {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return null
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(date.getTime()) ? null : date
}
function formatIsoDate(gy: number, gm: number, gd: number) {
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}
function isoFromJalali(jy: number, jm: number, jd: number) {
  const g = toGregorian(jy, jm, jd)
  return formatIsoDate(g.gy, g.gm, g.gd)
}
function compareIso(a: string, b: string) {
  const ad = parseIsoDate(a)?.getTime() ?? 0
  const bd = parseIsoDate(b)?.getTime() ?? 0
  return ad - bd
}

// --- Universal Helpers (Mode Aware) ---

function getGregorianMonthLength(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

// Initial View State
const today = new Date()
const todayJalali = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate())

// These store the CURRENT VIEW's Year/Month in the ACTIVE calendar system
const viewYear = ref(todayJalali.jy)
const viewMonth = ref(todayJalali.jm)

// Sync view on open
const singleValue = computed(() => (props.range || typeof props.modelValue !== 'string') ? null : props.modelValue)
const rangeValue = computed<DateRangeValue>(() => {
  if (!props.range) return { start: null, end: null }
  if (props.modelValue && typeof props.modelValue === 'object') {
    return { start: props.modelValue.start ?? null, end: props.modelValue.end ?? null }
  }
  return { start: null, end: null }
})
const selectedStart = computed(() => rangeValue.value.start ?? null)
const selectedEnd = computed(() => rangeValue.value.end ?? null)

watch(isOpen, (v) => {
  if (v) {
    viewMode.value = 'day'
    // Determine start date from selection or today
    const iso = selectedStart.value ?? singleValue.value
    if (iso) {
      const d = parseIsoDate(iso)
      if (d) {
        if (calendarMode.value === 'jalali') {
          const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate())
          viewYear.value = j.jy
          viewMonth.value = j.jm
        } else {
          viewYear.value = d.getFullYear()
          viewMonth.value = d.getMonth() + 1
        }
        return
      }
    }
    // Default to today
    if (calendarMode.value === 'jalali') {
      viewYear.value = todayJalali.jy
      viewMonth.value = todayJalali.jm
    } else {
      viewYear.value = today.getFullYear()
      viewMonth.value = today.getMonth() + 1
    }
  }
})

// --- Toggle Mode Logic ---
function toggleCalendarMode() {
  const currentMode = calendarMode.value
  const targetMode = currentMode === 'jalali' ? 'gregorian' : 'jalali'

  // Convert current view to target view
  // We pick the 1st day of the current view to convert
  let targetY, targetM

  if (currentMode === 'jalali') {
    // Jalali -> Gregorian
    const g = toGregorian(viewYear.value, viewMonth.value, 1)
    targetY = g.gy
    targetM = g.gm
  } else {
    // Gregorian -> Jalali
    const j = toJalali(viewYear.value, viewMonth.value, 1)
    targetY = j.jy
    targetM = j.jm
  }

  calendarMode.value = targetMode
  viewYear.value = targetY
  viewMonth.value = targetM
  viewMode.value = 'day' // Reset to day view on switch
}

// --- Render Logic ---

const currentMonthNames = computed(() => calendarMode.value === 'jalali' ? jalaliMonthNames : gregorianMonthNames)
const currentWeekDays = computed(() => calendarMode.value === 'jalali' ? jalaliWeekDays : gregorianWeekDays)
const currentFormatter = computed(() => calendarMode.value === 'jalali' ? faFormatter : enFormatter)
const isRtl = computed(() => calendarMode.value === 'jalali')

function getMonthLabel(m: number) {
  return currentMonthNames.value[m - 1]
}

// Helper to add months in either system
function addMonthLocal(y: number, m: number, offset: number) {
  const absolute = (y * 12 + (m - 1)) + offset
  const nextY = Math.floor(absolute / 12)
  const nextM = (absolute % 12 + 12) % 12 + 1
  return { y: nextY, m: nextM }
}

function buildMonthDays(year: number, month: number): DayCell[] {
  const days: DayCell[] = []

  if (calendarMode.value === 'jalali') {
    // --- Jalali Build ---
    const currentLen = getJalaliMonthLength(year, month)
    const firstGregorian = toGregorian(year, month, 1)
    // Jalali weeks start Saturday (index 6 in JS Date.getDay() is Sat? No.
    // JS Date: 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat.
    // Jalali Week: Sat=0, Sun=1, ... Fri=6.
    // So offset = (jsDay + 1) % 7
    const firstDayOfWeekGregorian = new Date(firstGregorian.gy, firstGregorian.gm - 1, firstGregorian.gd).getDay()
    const firstDayOffset = (firstDayOfWeekGregorian + 1) % 7

    const prev = addMonthLocal(year, month, -1)
    const prevLen = getJalaliMonthLength(prev.y, prev.m)

    // Previous Month Days
    for (let i = firstDayOffset - 1; i >= 0; i--) {
      const d = prevLen - i
      days.push({ jd: d, jm: prev.m, jy: prev.y, muted: true, iso: isoFromJalali(prev.y, prev.m, d) })
    }
    // Current Month Days
    for (let d = 1; d <= currentLen; d++) {
      days.push({ jd: d, jm: month, jy: year, muted: false, iso: isoFromJalali(year, month, d) })
    }
    // Next Month Days
    const next = addMonthLocal(year, month, 1)
    while (days.length < 42) {
      const d = days.length - (firstDayOffset + currentLen) + 1
      days.push({ jd: d, jm: next.m, jy: next.y, muted: true, iso: isoFromJalali(next.y, next.m, d) })
    }

  } else {
    // --- Gregorian Build ---
    const currentLen = getGregorianMonthLength(year, month)
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay() // 0=Sun, ...
    // Gregorian Week starts Sunday (index 0). So offset is just getDay()
    const firstDayOffset = firstDayOfWeek

    const prev = addMonthLocal(year, month, -1)
    const prevLen = getGregorianMonthLength(prev.y, prev.m)

    for (let i = firstDayOffset - 1; i >= 0; i--) {
      const d = prevLen - i
      days.push({ jd: d, jm: prev.m, jy: prev.y, muted: true, iso: formatIsoDate(prev.y, prev.m, d) })
    }
    for (let d = 1; d <= currentLen; d++) {
      days.push({ jd: d, jm: month, jy: year, muted: false, iso: formatIsoDate(year, month, d) })
    }
    const next = addMonthLocal(year, month, 1)
    while (days.length < 42) {
      const d = days.length - (firstDayOffset + currentLen) + 1
      days.push({ jd: d, jm: next.m, jy: next.y, muted: true, iso: formatIsoDate(next.y, next.m, d) })
    }
  }

  return days
}

const monthViews = computed<MonthView[]>(() => {
  const v1 = { y: viewYear.value, m: viewMonth.value }
  const v2 = addMonthLocal(v1.y, v1.m, 1)

  const views: MonthView[] = []

  // View 1
  views.push({
    jy: v1.y, jm: v1.m,
    label: `${getMonthLabel(v1.m)} ${currentFormatter.value.format(v1.y)}`,
    days: buildMonthDays(v1.y, v1.m)
  })

  // View 2 (if two columns)
  if (props.twoColumns) {
    views.push({
      jy: v2.y, jm: v2.m,
      label: `${getMonthLabel(v2.m)} ${currentFormatter.value.format(v2.y)}`,
      days: buildMonthDays(v2.y, v2.m)
    })
  }

  return views
})

// --- Selection / Range Logic ---
function isSelected(iso: string) {
  if (!props.range) return iso === singleValue.value
  return iso === selectedStart.value || iso === selectedEnd.value
}
function isInRange(iso: string) {
  if (!props.range || !selectedStart.value || !selectedEnd.value) return false
  return compareIso(iso, selectedStart.value) > 0 && compareIso(iso, selectedEnd.value) < 0
}
function isPreviewRange(iso: string) {
  if (!props.range || !selectedStart.value || selectedEnd.value || !hoveredIso.value) return false
  const start = selectedStart.value
  const end = hoveredIso.value
  const from = compareIso(start, end) <= 0 ? start : end
  const to = compareIso(start, end) <= 0 ? end : start
  return compareIso(iso, from) > 0 && compareIso(iso, to) < 0
}
function isToday(iso: string) {
  const d = new Date()
  const todayIso = formatIsoDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  return iso === todayIso
}

function selectDay(day: DayCell) {
  hoveredIso.value = null
  if (!props.range) {
    emit('update:modelValue', day.iso)
    emit('change', day.iso)
    isOpen.value = false
    return
  }
  const start = selectedStart.value
  const end = selectedEnd.value
  if (!start || (start && end)) {
    const value = { start: day.iso, end: null }
    emit('update:modelValue', value)
    emit('change', value)
    return
  }
  if (compareIso(day.iso, start) < 0) {
    const value = { start: day.iso, end: start }
    emit('update:modelValue', value)
    emit('change', value)
    isOpen.value = false
    return
  }
  const value = { start, end: day.iso }
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

// --- Navigation ---
function nextMonth() {
  const next = addMonthLocal(viewYear.value, viewMonth.value, 1)
  viewYear.value = next.y
  viewMonth.value = next.m
}
function prevMonth() {
  const prev = addMonthLocal(viewYear.value, viewMonth.value, -1)
  viewYear.value = prev.y
  viewMonth.value = prev.m
}
function selectMonth(mIndex: number) {
  viewMonth.value = mIndex
  viewMode.value = 'day'
}
function selectYear(y: number) {
  viewYear.value = y
  viewMode.value = 'month'
}
function goToday() {
  if (calendarMode.value === 'jalali') {
    viewYear.value = todayJalali.jy
    viewMonth.value = todayJalali.jm
  } else {
    viewYear.value = today.getFullYear()
    viewMonth.value = today.getMonth() + 1
  }
  viewMode.value = 'day'
  isTodayHighlighted.value = false
  setTimeout(() => {
    isTodayHighlighted.value = true
    setTimeout(() => isTodayHighlighted.value = false, 1500)
  }, 10)
}
function clearSelection() {
  if (props.range) {
    const value = { start: null, end: null }
    emit('update:modelValue', value)
    emit('change', value)
    return
  }
  emit('update:modelValue', '')
  emit('change', '')
}

// --- Labels ---
const selectedLabel = computed(() => {
  const mode = calendarMode.value
  const locale = mode === 'jalali' ? 'fa-IR-u-ca-persian' : 'en-US'

  const formatDate = (iso: string) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(parseIsoDate(iso) as Date)
  }

  if (!props.range) {
    if (!singleValue.value) return props.placeholder
    return formatDate(singleValue.value)
  }
  if (!selectedStart.value && !selectedEnd.value) return props.rangePlaceholder
  if (selectedStart.value && !selectedEnd.value) return (mode === 'jalali' ? 'از ' : 'From ') + formatDate(selectedStart.value)
  return formatDate(selectedStart.value as string) + (mode === 'jalali' ? ' تا ' : ' - ') + formatDate(selectedEnd.value as string)
})

// --- Years Grid ---
const yearsGrid = computed(() => {
  const start = viewYear.value - 6
  return Array.from({ length: 15 }, (_, i) => start + i)
})

// --- Click Outside ---
function onClickOutside(event: MouseEvent) {
  if (!rootRef.value) return
  if (event.target instanceof Node && !rootRef.value.contains(event.target)) isOpen.value = false
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="rootRef" :class="cn('relative w-full max-w-sm', props.class)">
    <button
        type="button"
        :disabled="disabled"
        class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        @click="isOpen = !isOpen"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <span class="text-muted-foreground opacity-50">▼</span>
    </button>

    <div
        v-if="isOpen"
        :dir="isRtl ? 'rtl' : 'ltr'"
        :class="cn('absolute z-50 mt-2 rounded-lg border border-border bg-popover p-3 shadow-xl overflow-hidden', twoColumns && viewMode === 'day' ? 'w-[39rem]' : 'w-full min-w-[300px]')"
    >
      <slot
          name="header"
          :current-month-label="getMonthLabel(viewMonth)"
          :current-year-label="currentFormatter.format(viewYear)"
          :next-label="monthViews[1]?.label ?? null"
          :prev-month="prevMonth"
          :next-month="nextMonth"
          :toggle-view="v => viewMode = v"
          :view-mode="viewMode"
          :view-year="viewYear"
          :view-month="viewMonth"
          :calendar-mode="calendarMode"
          :toggle-calendar-mode="toggleCalendarMode"
      >
        <div class="mb-3 flex items-center justify-between">
          <div v-if="viewMode === 'day'" class="flex items-center">
            <button type="button" class="rounded-md p-1 hover:bg-accent" @click="isRtl ? prevMonth() : prevMonth()">
              {{ isRtl ? '›' : '‹' }}
            </button>
          </div>
          <div v-else>
            <button type="button" class="rounded-md p-1 hover:bg-accent" @click="viewYear -= (viewMode === 'year' ? 15 : 1)">
              {{ isRtl ? '›' : '‹' }}
            </button>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex gap-1 text-sm font-medium">
              <button
                  type="button"
                  class="rounded px-2 py-0.5 hover:bg-accent transition-colors"
                  :class="{ 'bg-accent': viewMode === 'month' }"
                  @click="viewMode = viewMode === 'month' ? 'day' : 'month'"
              >
                {{ getMonthLabel(viewMonth) }}
              </button>
              <button
                  type="button"
                  class="rounded px-2 py-0.5 hover:bg-accent transition-colors"
                  :class="{ 'bg-accent': viewMode === 'year' }"
                  @click="viewMode = viewMode === 'year' ? 'day' : 'year'"
              >
                {{ currentFormatter.format(viewYear) }}
              </button>
            </div>

            <button
                type="button"
                class="ml-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border border-border rounded px-1.5 py-0.5 hover:bg-foreground hover:text-background transition-colors"
                @click="toggleCalendarMode"
            >
              {{ calendarMode === 'jalali' ? 'AD' : 'شمسی' }}
            </button>
          </div>

          <div v-if="viewMode === 'day'">
            <button type="button" class="rounded-md p-1 hover:bg-accent" @click="isRtl ? nextMonth() : nextMonth()">
              {{ isRtl ? '‹' : '›' }}
            </button>
          </div>
          <div v-else>
            <button type="button" class="rounded-md p-1 hover:bg-accent" @click="viewYear += (viewMode === 'year' ? 15 : 1)">
              {{ isRtl ? '‹' : '›' }}
            </button>
          </div>
        </div>
      </slot>

      <div v-if="viewMode === 'day'" :class="cn('grid gap-4', twoColumns ? 'grid-cols-2' : 'grid-cols-1')">
        <div v-for="month in monthViews" :key="`${month.jy}-${month.jm}`">
          <div v-if="twoColumns" class="mb-2 text-center text-xs font-medium text-muted-foreground">
            {{ month.label }}
          </div>
          <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            <span v-for="day in currentWeekDays" :key="day">{{ day }}</span>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <button
                v-for="day in month.days"
                :key="day.iso"
                type="button"
                class="relative h-9 rounded-md text-sm transition-all duration-300"
                :class="[
                  day.muted && 'text-muted-foreground/50',
                  isInRange(day.iso) && 'bg-primary/15',
                  isPreviewRange(day.iso) && 'bg-primary/10',
                  isSelected(day.iso) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  !isSelected(day.iso) && 'hover:bg-accent',

                  isToday(day.iso) && !isSelected(day.iso) && 'border border-primary/50 text-primary font-medium',
                  isToday(day.iso) && isTodayHighlighted && 'bg-primary/20 ring-2 ring-primary ring-offset-1 ring-offset-background scale-110 z-10 shadow-sm'
                ]"
                @click="selectDay(day)"
                @mouseenter="hoveredIso = day.iso"
                @mouseleave="hoveredIso = null"
            >
              {{ currentFormatter.format(day.jd) }}
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="viewMode === 'month'" class="grid grid-cols-3 gap-2">
        <button
            v-for="(mName, idx) in currentMonthNames"
            :key="mName"
            type="button"
            class="rounded-md px-2 py-3 text-sm hover:bg-accent transition-colors"
            :class="{ 'bg-primary text-primary-foreground hover:bg-primary': (idx + 1) === viewMonth }"
            @click="selectMonth(idx + 1)"
        >
          {{ mName }}
        </button>
      </div>

      <div v-else-if="viewMode === 'year'" class="grid grid-cols-3 gap-2">
        <button
            v-for="year in yearsGrid"
            :key="year"
            type="button"
            class="rounded-md px-2 py-3 text-sm hover:bg-accent transition-colors"
            :class="{ 'bg-primary text-primary-foreground hover:bg-primary': year === viewYear }"
            @click="selectYear(year)"
        >
          {{ currentFormatter.format(year) }}
        </button>
      </div>

      <slot
          name="footer"
          :is-range="range"
          :selected-label="selectedLabel"
          :start="selectedStart"
          :end="selectedEnd"
          :clear="clearSelection"
          :close="() => (isOpen = false)"
          :go-today="goToday"
      >
        <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
          <button type="button" class="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors" @click="goToday">
            {{ isRtl ? 'امروز' : 'Today' }}
          </button>
          <button type="button" class="rounded-md px-2 py-1 text-xs hover:bg-accent text-muted-foreground transition-colors" @click="clearSelection">
            {{ isRtl ? 'پاک کردن' : 'Clear' }}
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>
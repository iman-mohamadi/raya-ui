<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface DateRangeValue {
  start?: string | null
  end?: string | null
}

type ModelValue = string | DateRangeValue | null | undefined

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
    currentLabel: string
    nextLabel: string | null
    prevMonth: () => void
    nextMonth: () => void
    viewYear: number
    viewMonth: number
  }) => any
  footer?: (props: {
    isRange: boolean
    selectedLabel: string
    start: string | null
    end: string | null
    clear: () => void
    close: () => void
  }) => any
}>()

interface JalaliDate {
  jy: number
  jm: number
  jd: number
}

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

const monthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const numberFormatter = new Intl.NumberFormat('fa-IR')

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const hoveredIso = ref<string | null>(null)

function div(a: number, b: number) {
  return Math.floor(a / b)
}

function mod(a: number, b: number) {
  return a - Math.floor(a / b) * b
}

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

function d2j(jdn: number): JalaliDate {
  const g = d2g(jdn)
  let jy = g.gy - 621
  const r = jalCal(jy)
  const jdn1f = g2d(g.gy, 3, r.march)
  let k = jdn - jdn1f

  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 }
    }
    k -= 186
  } else {
    jy -= 1
    k += 179
    if (r.leap === 1) k += 1
  }

  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 }
}

function toJalali(gy: number, gm: number, gd: number) {
  return d2j(g2d(gy, gm, gd))
}

function toGregorian(jy: number, jm: number, jd: number) {
  return d2g(j2d(jy, jm, jd))
}

function isLeapJalaliYear(jy: number) {
  return jalCal(jy).leap === 0
}

function getMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  return isLeapJalaliYear(jy) ? 30 : 29
}

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

function toJalaliFromIso(value?: string | null) {
  const date = parseIsoDate(value)
  if (!date) return null
  return toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function addMonth(jy: number, jm: number, offset: number) {
  const absolute = (jy * 12 + (jm - 1)) + offset
  const nextJy = Math.floor(absolute / 12)
  const nextJm = (absolute % 12 + 12) % 12 + 1
  return { jy: nextJy, jm: nextJm }
}

const singleValue = computed(() => {
  if (props.range || typeof props.modelValue !== 'string') return null
  return props.modelValue
})

const rangeValue = computed<DateRangeValue>(() => {
  if (!props.range) return { start: null, end: null }
  if (props.modelValue && typeof props.modelValue === 'object') {
    return {
      start: props.modelValue.start ?? null,
      end: props.modelValue.end ?? null,
    }
  }
  return { start: null, end: null }
})

const selectedStart = computed(() => rangeValue.value.start ?? null)
const selectedEnd = computed(() => rangeValue.value.end ?? null)

const selectedJalali = computed(() => {
  if (props.range) return null
  return toJalaliFromIso(singleValue.value)
})

const startJalali = computed(() => toJalaliFromIso(selectedStart.value))

const today = new Date()
const todayJalali = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate())

const viewYear = ref(startJalali.value?.jy ?? selectedJalali.value?.jy ?? todayJalali.jy)
const viewMonth = ref(startJalali.value?.jm ?? selectedJalali.value?.jm ?? todayJalali.jm)

function getMonthLabel(jy: number, jm: number) {
  return `${monthNames[jm - 1]} ${numberFormatter.format(jy)}`
}

const selectedLabel = computed(() => {
  if (!props.range) {
    if (!singleValue.value) return props.placeholder
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parseIsoDate(singleValue.value) as Date)
  }

  if (!selectedStart.value && !selectedEnd.value) return props.rangePlaceholder
  if (selectedStart.value && !selectedEnd.value) {
    return `از ${new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parseIsoDate(selectedStart.value) as Date)}`
  }

  return `${new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parseIsoDate(selectedStart.value as string) as Date)} تا ${new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parseIsoDate(selectedEnd.value as string) as Date)}`
})

function buildMonthDays(jy: number, jm: number): DayCell[] {
  const currentMonthDays = getMonthLength(jy, jm)
  const firstGregorian = toGregorian(jy, jm, 1)
  const firstDayOffset = (new Date(firstGregorian.gy, firstGregorian.gm - 1, firstGregorian.gd).getDay() + 1) % 7

  const prevMonth = jm === 1 ? 12 : jm - 1
  const prevYear = jm === 1 ? jy - 1 : jy
  const prevMonthDays = getMonthLength(prevYear, prevMonth)

  const days: DayCell[] = []

  for (let i = firstDayOffset - 1; i >= 0; i -= 1) {
    const jd = prevMonthDays - i
    days.push({
      jd,
      jm: prevMonth,
      jy: prevYear,
      muted: true,
      iso: isoFromJalali(prevYear, prevMonth, jd),
    })
  }

  for (let day = 1; day <= currentMonthDays; day += 1) {
    days.push({
      jd: day,
      jm,
      jy,
      muted: false,
      iso: isoFromJalali(jy, jm, day),
    })
  }

  const nextMonth = jm === 12 ? 1 : jm + 1
  const nextYear = jm === 12 ? jy + 1 : jy
  while (days.length < 42) {
    const day = days.length - (firstDayOffset + currentMonthDays) + 1
    days.push({
      jd: day,
      jm: nextMonth,
      jy: nextYear,
      muted: true,
      iso: isoFromJalali(nextYear, nextMonth, day),
    })
  }

  return days
}

const monthViews = computed<MonthView[]>(() => {
  const first = { jy: viewYear.value, jm: viewMonth.value }
  const second = addMonth(first.jy, first.jm, 1)

  const views: MonthView[] = [
    {
      ...first,
      label: getMonthLabel(first.jy, first.jm),
      days: buildMonthDays(first.jy, first.jm),
    },
  ]

  if (props.twoColumns) {
    views.push({
      ...second,
      label: getMonthLabel(second.jy, second.jm),
      days: buildMonthDays(second.jy, second.jm),
    })
  }

  return views
})

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

function isToday(jy: number, jm: number, jd: number) {
  return todayJalali.jy === jy && todayJalali.jm === jm && todayJalali.jd === jd
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

function onDayHover(iso: string) {
  if (!props.range || !selectedStart.value || selectedEnd.value) return
  hoveredIso.value = iso
}

function onDayLeave() {
  hoveredIso.value = null
}

function nextMonth() {
  const next = addMonth(viewYear.value, viewMonth.value, 1)
  viewYear.value = next.jy
  viewMonth.value = next.jm
}

function prevMonth() {
  const prev = addMonth(viewYear.value, viewMonth.value, -1)
  viewYear.value = prev.jy
  viewMonth.value = prev.jm
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

function onClickOutside(event: MouseEvent) {
  if (!rootRef.value) return
  if (event.target instanceof Node && !rootRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
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
      <span class="text-muted-foreground">▾</span>
    </button>

    <div
        v-if="isOpen"
        :class="cn('absolute z-50 mt-2 rounded-lg border border-border bg-popover p-3 shadow-xl', twoColumns ? 'w-[39rem]' : 'w-full')"
    >
      <slot
          name="header"
          :current-label="monthViews[0].label"
          :next-label="monthViews[1]?.label ?? null"
          :prev-month="prevMonth"
          :next-month="nextMonth"
          :view-year="viewYear"
          :view-month="viewMonth"
      >
        <div class="mb-3 flex items-center justify-between">
          <button type="button" class="rounded-md p-1 hover:bg-accent" @click="nextMonth">‹</button>
          <p class="text-sm font-medium text-center">
            {{ monthViews[0].label }}
            <span v-if="monthViews[1]"> - {{ monthViews[1].label }}</span>
          </p>
          <button type="button" class="rounded-md p-1 hover:bg-accent" @click="prevMonth">›</button>
        </div>
      </slot>

      <div :class="cn('grid gap-4', twoColumns ? 'grid-cols-2' : 'grid-cols-1')">
        <div v-for="month in monthViews" :key="`${month.jy}-${month.jm}`">
          <div class="mb-2 text-center text-xs font-medium text-muted-foreground">
            {{ month.label }}
          </div>
          <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            <span v-for="day in weekDays" :key="`${month.jy}-${month.jm}-${day}`">{{ day }}</span>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <button
                v-for="day in month.days"
                :key="`${month.jy}-${month.jm}-${day.jy}-${day.jm}-${day.jd}`"
                type="button"
                class="h-9 rounded-md text-sm transition-colors"
                :class="[
                day.muted && 'text-muted-foreground/50',
                isInRange(day.iso) && 'bg-primary/15',
                isPreviewRange(day.iso) && 'bg-primary/10',
                isSelected(day.iso) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                !isSelected(day.iso) && 'hover:bg-accent',
                isToday(day.jy, day.jm, day.jd) && !isSelected(day.iso) && 'border border-primary/50'
              ]"
                @click="selectDay(day)"
                @mouseenter="onDayHover(day.iso)"
                @mouseleave="onDayLeave"
            >
              {{ numberFormatter.format(day.jd) }}
            </button>
          </div>
        </div>
      </div>

      <slot
          name="footer"
          :is-range="range"
          :selected-label="selectedLabel"
          :start="selectedStart"
          :end="selectedEnd"
          :clear="clearSelection"
          :close="() => (isOpen = false)"
      >
        <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
          <p class="text-xs text-muted-foreground">{{ selectedLabel }}</p>
          <button type="button" class="rounded-md px-2 py-1 text-xs hover:bg-accent" @click="clearSelection">
            پاک کردن
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

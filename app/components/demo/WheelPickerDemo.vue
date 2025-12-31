<script setup lang="ts">
import {WheelPicker, WheelPickerWrapper} from '@/components/ui/wheel-picker'
import {ref} from "vue";
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    .map((m, i) => ({ value: i, label: m }))
const days = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: (i + 1).toString() }))
const years = Array.from({ length: 50 }, (_, i) => ({ value: 2025 - i, label: (2025 - i).toString() }))
const dateState = ref({ month: 5, day: 15, year: 2025 })
</script>

<template>
  <div class="relative rounded-xl flex items-center justify-center w-full px-2">
    <ClientOnly>
      <div class="w-full max-w-xs sm:w-80 rounded-xl p-1">
        <WheelPickerWrapper>
          <WheelPicker v-model="dateState.month" :options="months" infinite class="flex-[2]" />
          <WheelPicker v-model="dateState.day" :options="days" infinite class="flex-1" />
          <WheelPicker v-model="dateState.year" :options="years" infinite class="flex-1" />
        </WheelPickerWrapper>
      </div>
    </ClientOnly>
  </div>
</template>
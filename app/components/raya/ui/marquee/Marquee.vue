<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
}

const props = withDefaults(defineProps<Props>(), {
  reverse: false,
  pauseOnHover: false,
  vertical: false,
  repeat: 4,
  class: ''
})
</script>

<template>
  <div
      :class="cn(
      'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] gap-(--gap)',
      {
        'flex-row': !vertical,
        'flex-col': vertical,
      },
      props.class
    )"
  >
    <div
        v-for="i in repeat"
        :key="i"
        :class="cn('flex shrink-0 justify-around gap-(--gap)', {
        'animate-marquee flex-row': !vertical,
        'animate-marquee-vertical flex-col': vertical,
        'group-hover:paused': pauseOnHover,
        'direction-[reverse]': reverse,
      })"
    >
      <slot />
    </div>
  </div>
</template>
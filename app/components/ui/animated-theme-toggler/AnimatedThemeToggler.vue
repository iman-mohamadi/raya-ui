<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useDark, useToggle } from '@vueuse/core'

interface Props {
  duration?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 400,
  class: ''
})

// Track if the component is mounted (client-side)
const mounted = ref(false)

// Use VueUse to handle state and localStorage automatically
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'dark',
})
const toggleDark = useToggle(isDark)

const buttonRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  mounted.value = true
})

const toggleTheme = async (event: MouseEvent) => {
  // If View Transitions aren't supported, just toggle
  // @ts-ignore
  if (!document.startViewTransition) {
    toggleDark()
    return
  }

  const button = buttonRef.value
  if (!button) return

  // Start the transition
  // @ts-ignore
  const transition = document.startViewTransition(async () => {
    toggleDark()
    await nextTick()
  })

  await transition.ready

  const { top, left, width, height } = button.getBoundingClientRect()
  const x = left + width / 2
  const y = top + height / 2
  const right = window.innerWidth - left
  const bottom = window.innerHeight - top
  const maxRadius = Math.hypot(
      Math.max(left, right),
      Math.max(top, bottom)
  )

  document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: props.duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
  )
}
</script>

<template>
  <button
      ref="buttonRef"
      type="button"
      @click="toggleTheme"
      :class="cn('relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors', props.class)"
  >
    <template v-if="mounted">
      <Sun v-if="isDark" class="h-5 w-5" />
      <Moon v-else class="h-5 w-5" />
    </template>

    <div v-else class="h-5 w-5" />

    <span class="sr-only">Toggle theme</span>
  </button>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 2147483646;
}
</style>
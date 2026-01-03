<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  duration?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 400,
  class: ''
})

const isDark = ref(false)
const buttonRef = ref<HTMLButtonElement | null>(null)
let observer: MutationObserver | null = null

// Helper to actually change the DOM and Storage
const updateDOM = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme", "dark")
  } else {
    document.documentElement.classList.remove("dark")
    localStorage.setItem("theme", "light")
  }
}

const updateThemeState = () => {
  isDark.value = document.documentElement.classList.contains("dark")
}

onMounted(() => {
  updateThemeState()

  observer = new MutationObserver(updateThemeState)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

const toggleTheme = async (event: MouseEvent) => {
  const newThemeIsDark = !isDark.value

  // @ts-ignore - View Transition API is strictly typed in some environments
  if (!document.startViewTransition) {
    isDark.value = newThemeIsDark
    updateDOM(newThemeIsDark)
    return
  }

  const button = buttonRef.value
  if (!button) return

  // Start the transition
  // @ts-ignore
  const transition = document.startViewTransition(async () => {
    isDark.value = newThemeIsDark
    updateDOM(newThemeIsDark)
    // Wait for Vue to update the DOM inside the transition callback
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
    <Sun v-if="!isDark" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
    <span class="sr-only">Toggle theme</span>
  </button>
</template>

<style>
/* Global CSS required for the clip-path animation to work correctly */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* Ensure the new view is on top during the animation */
::view-transition-new(root) {
  z-index: 2147483646;
}
</style>
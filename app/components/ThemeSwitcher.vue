<script setup lang="ts">
const colorMode = useColorMode()

const toggleDark = (isDark: boolean) => {
  colorMode.value = isDark ? 'dark' : 'light'
}

</script>

<template>
  <AnimatedThemeToggler @update:modelValue="toggleDark" :theme="colorMode" class="text-zinc-500 hover:text-foreground transition-colors" />
</template>

<style scoped>

</style>
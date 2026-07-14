<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <div class="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
    v{{ config.public.version }}
  </div>
</template>
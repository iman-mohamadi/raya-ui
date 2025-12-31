<script setup lang="ts">
import { CodeBlock } from '@/components/ui/code-block'

const code = `console.log("Raya");`
</script>

<template>
  <div class="flex items-center justify-center w-full h-full p-4">
    <CodeBlock :code="code" class="text-xs w-full shadow-sm" />
  </div>
</template>
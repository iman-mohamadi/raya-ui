<script setup lang="ts">
interface Props {
  text?: string
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  text: 'placeHolder',
  icon: null
})
</script>

<template>
  <div class="screen-line-after px-4 py-2 flex gap-2 items-center">
    <component v-if="icon" :is="icon" class="w-6 h-6" />
    <h3 class="text-2xl font-semibold leading-none">
      {{ text }}
    </h3>
  </div>
</template>

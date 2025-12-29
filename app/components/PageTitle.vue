<script setup lang="ts">
interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'pageTitlePlaceHolder'
})
</script>

<template>
  <div class="screen-line-after px-4 py-1">
      <h1 class="text-3xl font-semibold leading-none">
        {{ title }}
      </h1>
  </div>
</template>

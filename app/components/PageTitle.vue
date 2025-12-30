<script setup lang="ts">
interface Props {
  title: string | null
  subtitle: string | null
  description: string | null
}


const props = withDefaults(defineProps<Props>(), {
  title: null,
  subtitle: null,
  description: null,
})
</script>

<template>
  <div class="grid gap-2 py-2">
      <span v-if="subtitle"
            class="zs-overline font-mono text-xs uppercase text-foreground tracking-widest font-medium mt-0">
        {{ subtitle }}
      </span>
    <div class="grid gap-6 md:gap-8">
      <h1 class="tracking-tighter text-foreground text-balance max-w-[30ch] text-6xl md:text-8xl -mb-2">
        {{ title }}
      </h1>
      <p class="text-foreground max-w-[60ch] -mt-2 text-base leading-7 md:text-lg md:leading-8">
        {{ description }}
      </p>
    </div>
  </div>
</template>

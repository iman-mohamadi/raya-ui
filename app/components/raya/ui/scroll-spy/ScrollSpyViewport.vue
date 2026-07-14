<script setup lang="ts">
import { inject, type ComputedRef } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  asChild: { type: Boolean, default: false },
  as: { type: String, default: 'div' },
  class: { type: String, default: '' }
})

const context = inject<{ orientation: ComputedRef<string> }>('scroll-spy')
if (!context) throw new Error('ScrollSpyViewport must be used within ScrollSpy')
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :data-orientation="context.orientation.value"
      :class="cn('flex flex-1 flex-col gap-8', props.class)"
  >
    <slot />
  </Primitive>
</template>
<script setup lang="ts">
import { inject, type ComputedRef } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  asChild: { type: Boolean, default: false },
  as: { type: String, default: 'nav' },
  class: { type: String, default: '' }
})

const context = inject<{ orientation: ComputedRef<string> }>('scroll-spy')

if (!context) {
  throw new Error('ScrollSpyNav must be used within ScrollSpy')
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :class="cn(
      'flex gap-2',
      context.orientation.value === 'horizontal' ? 'flex-col' : 'flex-row',
      props.class
    )"
  >
    <slot />
  </Primitive>
</template>
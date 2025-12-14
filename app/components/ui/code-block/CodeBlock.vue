{
type: uploaded file
fileName: iman-mohamadi/enzoui/EnzOUi-481682bc4f3f825c0131815bd4179e5da136063e/app/components/ui/code-block/CodeBlock.vue
fullContent:
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'
import { cn } from '@/lib/utils'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css'

interface Props {
  code?: string
  lang?: string
  fileName?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'typescript',
  code: ''
})

const { copy, copied } = useClipboard({ source: () => props.code })

const highlightedCode = computed(() => {
  const language = props.lang && hljs.getLanguage(props.lang) ? props.lang : 'plaintext'
  return hljs.highlight(props.code, { language }).value
})
</script>

<template>
  <div
      :class="cn(
      'relative overflow-hidden rounded-xl border border-border bg-card',
      props.class
    )"
  >
    <div
        v-if="fileName || $slots.header"
        class="flex items-center bg-muted border-b border-border min-h-10"
        :class="fileName ? 'px-1' : ''"
    >
      <div class="flex-1 min-w-0 text-xs font-medium text-muted-foreground font-mono flex items-center">
        <slot name="header">
          {{ fileName }}
        </slot>
      </div>
    </div>

    <div class="absolute right-0 top-0 z-10">
      <div :class="fileName || $slots.header ?  'bg-transparent' : 'bg-muted/30 backdrop-blur-sm'" class="rounded-bl-xl  p-1.5">
        <button
            @click="copy()"
            class="flex h-7 w-7 items-center justify-center rounded-md bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-50"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-50"
              mode="out-in"
          >
            <Check v-if="copied" class="h-3.5 w-3.5 text-emerald-500" />
            <Copy v-else class="h-3.5 w-3.5" />
          </Transition>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <pre class="p-4"><code
          :class="`language-${lang} text-sm font-mono leading-relaxed bg-transparent p-0 block min-w-full text-foreground`"
          v-html="highlightedCode"
      ></code></pre>
    </div>
  </div>
</template>
}
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
} from 'reka-ui'
import { Search } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { FileManagerMessages } from './messages'
import type { FileManagerCommand } from './types'

const props = defineProps<{
  commands: FileManagerCommand[]
  messages: FileManagerMessages
  dir: 'ltr' | 'rtl'
}>()

const emit = defineEmits<{
  /** Runs once the palette has closed and handed focus back. */
  run: [command: FileManagerCommand]
  closeAutoFocus: [event: Event]
}>()

const open = defineModel<boolean>('open', { default: false })
const query = ref('')
watch(open, (value) => {
  if (value) query.value = ''
})

const LIMIT = 50

/** Every word must appear in the label or hint; labels that start with the query come first. */
const filtered = computed(() => {
  const words = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const matches = props.commands.filter((command) => {
    const text = `${command.label} ${command.hint ?? ''}`.toLowerCase()
    return words.every(word => text.includes(word))
  })
  const first = words[0]
  if (first) matches.sort((a, b) => Number(b.label.toLowerCase().startsWith(first)) - Number(a.label.toLowerCase().startsWith(first)))
  return matches
})
const groups = computed(() => [
  { id: 'actions' as const, label: props.messages.commandActions, commands: filtered.value.filter(command => command.group === 'actions').slice(0, LIMIT) },
  { id: 'go' as const, label: props.messages.commandGoTo, commands: filtered.value.filter(command => command.group === 'go').slice(0, LIMIT) },
].filter(group => group.commands.length))

function choose(id: unknown) {
  const command = props.commands.find(candidate => candidate.id === id)
  if (!command) return
  open.value = false
  emit('run', command)
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
      <DialogContent
        data-slot="file-manager-command-palette"
        :dir="dir"
        class="fixed inset-x-0 top-[12vh] z-50 mx-auto flex max-h-[70vh] w-[min(36rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none"
        @close-auto-focus="emit('closeAutoFocus', $event)"
      >
        <DialogTitle class="sr-only">{{ messages.commandPalette }}</DialogTitle>
        <DialogDescription class="sr-only">{{ messages.commandPlaceholder }}</DialogDescription>
        <ListboxRoot highlight-on-hover :dir="dir" class="flex min-h-0 flex-col" @update:model-value="choose">
          <div class="flex items-center gap-2 border-b border-border px-3">
            <Search aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
            <ListboxFilter
              v-model="query"
              auto-focus
              :aria-label="messages.commandPalette"
              :placeholder="messages.commandPlaceholder"
              class="h-11 w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <!-- The scroll container is focusable itself (Reka manages the listbox's own tab stop). -->
          <div role="group" :aria-label="messages.commandPalette" tabindex="0" class="min-h-0 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50">
            <ListboxContent :aria-label="messages.commandPalette" class="p-1.5 outline-none">
              <p v-if="!groups.length" class="px-3 py-6 text-center text-sm text-muted-foreground">
                {{ messages.commandEmpty }}
              </p>
              <ListboxGroup v-for="group in groups" :key="group.id" class="py-1">
                <ListboxGroupLabel class="px-2 pb-1 pt-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground/70 rtl:tracking-normal">
                  {{ group.label }}
                </ListboxGroupLabel>
                <ListboxItem
                  v-for="command in group.commands"
                  :key="command.id"
                  :value="command.id"
                  :data-command="command.id"
                  :class="cn(
                    'flex cursor-default select-none items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
                    command.destructive && 'text-destructive data-[highlighted]:text-destructive',
                  )"
                >
                  <component :is="command.icon" v-if="command.icon" aria-hidden="true" class="text-muted-foreground" />
                  <span class="min-w-0 flex-1 truncate">
                    <bdi>{{ command.label }}</bdi>
                    <span v-if="command.hint" class="ms-2 text-xs text-muted-foreground"><bdi>{{ command.hint }}</bdi></span>
                  </span>
                  <kbd v-if="command.shortcut" class="ms-auto shrink-0 font-mono text-[11px] text-muted-foreground">{{ command.shortcut }}</kbd>
                </ListboxItem>
              </ListboxGroup>
            </ListboxContent>
          </div>
        </ListboxRoot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

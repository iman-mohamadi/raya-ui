<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from '@/components/ui/tree'
import { CodeBlock } from '@/components/ui/code-block'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { Folder, File, FileCode, Image, Archive } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

// --- Sample Data ---
interface FileNode {
  label: string
  icon?: any
  children?: FileNode[]
}

const items: FileNode[] = [
  {
    label: 'app',
    icon: Folder,
    children: [
      {
        label: 'components',
        icon: Folder,
        children: [
          { label: 'Button.vue', icon: FileCode },
          { label: 'Card.vue', icon: FileCode },
          { label: 'Tree.vue', icon: FileCode }
        ]
      },
      {
        label: 'pages',
        icon: Folder,
        children: [
          { label: 'index.vue', icon: FileCode },
          { label: 'docs.vue', icon: FileCode }
        ]
      }
    ]
  },
  {
    label: 'assets',
    icon: Folder,
    children: [
      { label: 'logo.png', icon: Image },
      { label: 'main.css', icon: File }
    ]
  },
  { label: 'package.json', icon: Archive },
  { label: 'README.md', icon: File }
]

// --- State ---
const selection = ref<FileNode | null>(null)
const expanded = ref<string[]>(['app', 'components'])

// --- Tabs ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

// --- Code Snippets ---
const installationCode = `npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/tree.json`

const usageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from '@/components/ui/tree'
import { Folder, File, FileCode, Image, Archive } from 'lucide-vue-next'

const items = [
  {
    label: 'app',
    icon: Folder,
    children: [
      {
        label: 'components',
        icon: Folder,
        children: [
          { label: 'Button.vue', icon: FileCode },
          { label: 'Card.vue', icon: FileCode }
        ]
      },
      {
        label: 'pages',
        icon: Folder,
        children: [
          { label: 'index.vue', icon: FileCode }
        ]
      }
    ]
  },
  { label: 'package.json', icon: Archive }
]

const selection = ref(null)
const expanded = ref(['app'])
<\/script>

<template>
  <Tree
    v-model="selection"
    v-model:expanded="expanded"
    :items="items"
  />
</template>`

const componentCode = `<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import { TreeRoot, TreeItem, useForwardPropsEmits } from 'reka-ui'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  items?: T[]
  modelValue?: any
  expanded?: string[]
  defaultExpanded?: string[]
  defaultValue?: any
  multiple?: boolean
  disabled?: boolean
  propagateSelect?: boolean
  getKey?: (item: T) => string
  labelKey?: string
  childrenKey?: string
  class?: string
}>(), {
  items: () => [],
  labelKey: 'label',
  childrenKey: 'children',
  propagateSelect: true
})

const emits = defineEmits<{
  'update:modelValue': [value: any]
  'update:expanded': [value: string[]]
  'select': [node: any]
  'toggle': [node: any]
}>()

const itemKeyResolver = (item: any) => {
  if (!item) return ''
  if (props.getKey) return props.getKey(item as T)
  return (item[props.labelKey] as string) || item.id || item.key || ''
}

const itemChildrenResolver = (item: any) => {
  return item?.[props.childrenKey]
}

const rootProps = computed(() => ({
  items: props.items,
  modelValue: props.modelValue,
  expanded: props.expanded,
  defaultExpanded: props.defaultExpanded,
  defaultValue: props.defaultValue,
  multiple: props.multiple,
  disabled: props.disabled,
  propagateSelect: props.propagateSelect
}))

const forwarded = useForwardPropsEmits(rootProps, emits)
<\/script>

<template>
  <TreeRoot
    v-bind="forwarded"
    :get-key="itemKeyResolver"
    :get-children="itemChildrenResolver"
    :class="cn('w-full select-none list-none', props.class)"
    v-slot="{ flattenItems }"
  >
    <TreeItem
      v-for="item in flattenItems"
      :key="item._id"
      v-bind="item.bind"
      :class="cn(
        'group relative flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-medium outline-none transition-colors',
        'hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'cursor-pointer'
      )"
      :style="{ paddingLeft: \`\${item.level * 1.5}rem\` }"
      v-slot="{ isExpanded, isSelected }"
    >
      <component
        :is="isExpanded ? ChevronDown : ChevronRight"
        v-if="item.hasChildren"
        class="h-4 w-4 shrink-0 text-muted-foreground/70 group-hover:text-foreground transition-colors"
      />
      <span v-else class="h-4 w-4 shrink-0" />

      <slot name="item" :item="item.value" :expanded="isExpanded" :selected="isSelected">
        <component
          :is="item.value.icon"
          v-if="item.value.icon"
          class="h-4 w-4 shrink-0 mr-1 text-muted-foreground group-hover:text-foreground transition-colors"
          :class="{ 'text-foreground': isSelected }"
        />
        <span class="truncate" :class="{ 'text-primary font-semibold': isSelected }">
          {{ item.value[props.labelKey] }}
        </span>
      </slot>
    </TreeItem>
  </TreeRoot>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Tree</h1>
      <p class="text-xl text-muted-foreground">
        A hierarchical list component with nested items, expansion, and selection.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="rounded-xl border border-border bg-card p-10 min-h-[350px] flex items-start justify-center">
          <div class="w-full max-w-sm rounded-lg border border-border bg-background p-2">
            <Tree
                v-model="selection"
                v-model:expanded="expanded"
                :items="items"
                class="w-full"
            />
          </div>
        </div>
        <div class="mt-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-md font-mono">
          <p>Expanded: {{ expanded }}</p>
          <p class="mt-1">Selected: {{ selection ? selection.label : 'null' }}</p>
        </div>
      </template>
      <template #code>
        <div class="mt-4">
          <CodeBlock :code="usageCode"/>
        </div>
      </template>
    </AnimatedTabs>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installationCode" file-name="Terminal" />
        </template>
        <template #manual>
          <div class="space-y-6">
            <div class="space-y-2">
              <h3 class="text-base font-medium">1. Install Dependencies</h3>
              <CodeBlock code="npm install reka-ui lucide-vue-next" file-name="Terminal" />
            </div>
            <div class="space-y-2">
              <h3 class="text-base font-medium">2. Create Component</h3>
              <p class="text-sm text-muted-foreground">
                Copy the code below into <code class="bg-muted px-1 py-0.5 rounded">components/ui/tree/Tree.vue</code>
              </p>
              <CodeBlock :code="componentCode" file-name="components/ui/tree/Tree.vue" />
            </div>
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-border bg-card">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-border bg-muted/50 text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-border text-foreground">
          <tr>
            <td class="px-4 py-3 font-mono text-primary">items</td>
            <td class="px-4 py-3 font-mono text-xs">Array</td>
            <td class="px-4 py-3 font-mono text-xs">[]</td>
            <td class="px-4 py-3">The hierarchical data to render.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">modelValue</td>
            <td class="px-4 py-3 font-mono text-xs">any</td>
            <td class="px-4 py-3 font-mono text-xs">undefined</td>
            <td class="px-4 py-3">The currently selected item(s). Use <code>v-model</code>.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">expanded</td>
            <td class="px-4 py-3 font-mono text-xs">string[]</td>
            <td class="px-4 py-3 font-mono text-xs">[]</td>
            <td class="px-4 py-3">Keys of expanded items. Use <code>v-model:expanded</code>.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">labelKey</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">'label'</td>
            <td class="px-4 py-3">Key to access the label in your data objects.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">childrenKey</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">'children'</td>
            <td class="px-4 py-3">Key to access nested children in your data objects.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">multiple</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs">false</td>
            <td class="px-4 py-3">Allow selecting multiple items.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">propagateSelect</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs">true</td>
            <td class="px-4 py-3">If true, selection state propagates down to children (if multiple).</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Emits</h2>
      <div class="overflow-x-auto rounded-lg border border-border bg-card">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-border bg-muted/50 text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-medium">Event</th>
            <th class="px-4 py-3 font-medium">Payload</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-border text-foreground">
          <tr>
            <td class="px-4 py-3 font-mono text-primary">update:modelValue</td>
            <td class="px-4 py-3 font-mono text-xs">any</td>
            <td class="px-4 py-3">Fired when selection changes.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">update:expanded</td>
            <td class="px-4 py-3 font-mono text-xs">string[]</td>
            <td class="px-4 py-3">Fired when items are expanded or collapsed.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">select</td>
            <td class="px-4 py-3 font-mono text-xs">node</td>
            <td class="px-4 py-3">Fired when a node is selected.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Slots</h2>
      <div class="overflow-x-auto rounded-lg border border-border bg-card">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-border bg-muted/50 text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-medium">Slot</th>
            <th class="px-4 py-3 font-medium">Props</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-border text-foreground">
          <tr>
            <td class="px-4 py-3 font-mono text-primary">#item</td>
            <td class="px-4 py-3 font-mono text-xs">{ item, expanded, selected }</td>
            <td class="px-4 py-3">Custom content for each tree item.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
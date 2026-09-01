<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Lock, Sliders } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Animated Tabs Component for Vue & Nuxt',
  description: 'A Nuxt UI compatible tabs component for Vue and Nuxt: pill and link variants, seven colors, both orientations, and an indicator that slides between triggers.',
  ogTitle: 'Animated Tabs Component for Vue & Nuxt',
  ogDescription: 'A Nuxt UI compatible tabs component for Vue and Nuxt: pill and link variants, seven colors, both orientations, and an indicator that slides between triggers.',
})

// --- Interactive Settings State ---
const activeTab = ref('account')
const color = ref('primary')
const variant = ref('pill')
const size = ref('md')
const orientation = ref('horizontal')
const showContent = ref(true)

const resetSettings = () => {
  activeTab.value = 'account'
  color.value = 'primary'
  variant.value = 'pill'
  size.value = 'md'
  orientation.value = 'horizontal'
  showContent.value = true
}

// --- Color Options for Settings ---
const colors = [
  { label: 'Primary', value: 'primary', bgClass: 'bg-primary' },
  { label: 'Secondary', value: 'secondary', bgClass: 'bg-secondary border border-border' },
  { label: 'Success', value: 'success', bgClass: 'bg-success' },
  { label: 'Warning', value: 'warning', bgClass: 'bg-warning' },
  { label: 'Error', value: 'error', bgClass: 'bg-error' },
  { label: 'Info', value: 'info', bgClass: 'bg-info' },
  { label: 'Neutral', value: 'neutral', bgClass: 'bg-inverted' },
]

// --- Demo Data ---
const demoTabs = [
  { value: 'account', label: 'Account', icon: User, content: 'Modify user profiles, configure identity structures, and update metadata elements within this container pane.' },
  { value: 'security', label: 'Password', icon: Lock, content: 'Audit credentials, change master authorization keys, and set multi-factor authorization tokens safely.' },
  { value: 'preferences', label: 'Preferences', icon: Sliders, content: 'Toggle interface themes, set localization schemas, and map notification frequencies.' },
]

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const cssVarsSnippet = `/* The CLI writes these for you. Paste them into your Tailwind entry
   (the file with @import "tailwindcss") only for a manual install.
   These are the same tokens RayaButton uses — if you already installed it,
   they are in place and there is nothing to add. */

:root {
  /* Feedback colors */
  --success: oklch(0.62 0.19 145.4);
  --success-foreground: oklch(0.98 0 0);
  --info: oklch(0.60 0.16 255);
  --info-foreground: oklch(0.98 0 0);
  --warning: oklch(0.75 0.15 70);
  --warning-foreground: oklch(0.98 0 0);
  --error: var(--destructive);
  --error-foreground: oklch(1 0 0);

  /* Semantic text scale */
  --ui-text-dimmed: oklch(0.71 0 0);
  --ui-text-muted: var(--muted-foreground);
  --ui-text-toned: oklch(0.44 0 0);
  --ui-text: var(--foreground);
  --ui-text-highlighted: var(--foreground);
  --ui-text-inverted: var(--background);

  /* Semantic surfaces */
  --ui-bg: var(--background);
  --ui-bg-muted: var(--muted);
  --ui-bg-elevated: var(--muted);
  --ui-bg-accented: oklch(0.92 0 0);
  --ui-bg-inverted: var(--foreground);

  /* Semantic borders */
  --ui-border: var(--border);
  --ui-border-muted: var(--border);
  --ui-border-accented: oklch(0.87 0 0);
  --ui-border-inverted: var(--foreground);
}

.dark {
  --success: oklch(0.55 0.18 145.4);
  --success-foreground: oklch(1 0 0);
  --info: oklch(0.55 0.16 255);
  --info-foreground: oklch(1 0 0);
  --warning: oklch(0.70 0.15 70);
  --warning-foreground: oklch(0.1 0 0);
  --error: var(--destructive);
  --error-foreground: oklch(1 0 0);

  --ui-text-dimmed: oklch(0.56 0 0);
  --ui-text-muted: var(--muted-foreground);
  --ui-text-toned: oklch(0.82 0 0);
  --ui-text: var(--foreground);
  --ui-text-highlighted: var(--foreground);
  --ui-text-inverted: var(--background);

  --ui-bg: var(--background);
  --ui-bg-muted: var(--muted);
  --ui-bg-elevated: var(--muted);
  --ui-bg-accented: oklch(0.37 0 0);
  --ui-bg-inverted: var(--foreground);

  --ui-border: var(--border);
  --ui-border-muted: var(--border);
  --ui-border-accented: oklch(1.00 0 0 / 20%);
  --ui-border-inverted: var(--foreground);
}

@theme inline {
  /* Active pill label colors */
  --color-primary-content: var(--primary-foreground);
  --color-secondary-content: var(--secondary-foreground);
  --color-success: var(--success);
  --color-success-content: var(--success-foreground);
  --color-info: var(--info);
  --color-info-content: var(--info-foreground);
  --color-warning: var(--warning);
  --color-warning-content: var(--warning-foreground);
  --color-error: var(--error);
  --color-error-content: var(--error-foreground);

  /* Utility namespaces — these let text-inverted and bg-inverted be
     opposite colors while both keep opacity modifier support. */
  --text-color-dimmed: var(--ui-text-dimmed);
  --text-color-muted: var(--ui-text-muted);
  --text-color-toned: var(--ui-text-toned);
  --text-color-default: var(--ui-text);
  --text-color-highlighted: var(--ui-text-highlighted);
  --text-color-inverted: var(--ui-text-inverted);

  --background-color-default: var(--ui-bg);
  --background-color-muted: var(--ui-bg-muted);
  --background-color-elevated: var(--ui-bg-elevated);
  --background-color-accented: var(--ui-bg-accented);
  --background-color-inverted: var(--ui-bg-inverted);

  --border-color-default: var(--ui-border);
  --border-color-muted: var(--ui-border-muted);
  --border-color-accented: var(--ui-border-accented);
  --border-color-inverted: var(--ui-border-inverted);

  --ring-color-default: var(--ui-border);
  --ring-color-muted: var(--ui-border-muted);
  --ring-color-accented: var(--ui-border-accented);
  --ring-color-inverted: var(--ui-border-inverted);

  --outline-color-default: var(--ui-border);
  --outline-color-inverted: var(--ui-border-inverted);
}`

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add animated-tabs'
  switch (activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add animated-tabs'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add animated-tabs'; break;
    case 'bun': cliCmd = 'bun x --bun raya-ui@latest add animated-tabs'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install tailwind-variants tailwind-merge clsx reka-ui`,
    css: cssVarsSnippet
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  const attrs: string[] = [`:items="items"`, `v-model="active"`]
  if (color.value !== 'primary') attrs.push(`color="${color.value}"`)
  if (variant.value !== 'pill') attrs.push(`variant="${variant.value}"`)
  if (size.value !== 'md') attrs.push(`size="${size.value}"`)
  if (orientation.value !== 'horizontal') attrs.push(`orientation="${orientation.value}"`)
  if (!showContent.value) attrs.push(`:content="false"`)

  return `<script setup lang="ts">
import { ref } from 'vue'
import { AnimatedTabs, type TabsItem } from '@/components/ui/animated-tabs'
import { User, Lock, Sliders } from 'lucide-vue-next'

const active = ref('account')

const items: TabsItem[] = [
  { value: 'account', label: 'Account', icon: User, content: '…' },
  { value: 'security', label: 'Password', icon: Lock, content: '…' },
  { value: 'preferences', label: 'Preferences', icon: Sliders, content: '…' }
]
<\/script>

<template>
  <AnimatedTabs
    ${attrs.join('\n    ')}
    class="w-full"
  />
</template>`
})

// --- API Reference data ---
const props = [
  { name: 'items', type: 'TabsItem[]', default: '[]', description: 'The tabs to render. See the item shape below.' },
  { name: 'color', type: '"primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"', default: '"primary"', description: 'The semantic color of the indicator and the active trigger.' },
  { name: 'variant', type: '"pill" | "link"', default: '"pill"', description: 'A filled pill that slides behind the active trigger, or a thin line along the edge of the list.' },
  { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Drives trigger padding, font size and icon size together.' },
  { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Lays the triggers out in a row or a column, moving the indicator to the matching edge.' },
  { name: 'content', type: 'boolean', default: 'true', description: 'Set to `false` to render the triggers without any panels.' },
  { name: 'model-value', type: 'string | number', default: '—', description: 'The value of the active tab. Bindable with `v-model`. Compared as a string.' },
  { name: 'default-value', type: 'string | number', default: 'first item', description: 'The tab active on first render, when the value is not controlled.' },
  { name: 'value-key', type: 'string', default: '"value"', description: 'Which key identifies an item. Supports dot paths. Items without it fall back to their index as a string.' },
  { name: 'label-key', type: 'string', default: '"label"', description: 'Which key holds the label of an item. Supports dot paths.' },
  { name: 'activation-mode', type: '"automatic" | "manual"', default: '"automatic"', description: 'Whether keyboard focus activates a tab immediately or only on click/Enter.' },
  { name: 'unmount-on-hide', type: 'boolean', default: 'true', description: 'Set to `false` to keep inactive panels mounted in the DOM.' },
  { name: 'as', type: 'Component | string', default: '"div"', description: 'The element or component the root renders as.' },
  { name: 'class', type: 'string', default: '—', description: 'Merged onto the root slot.' },
  { name: 'ui', type: '{ root?, list?, indicator?, trigger?, leadingIcon?, leadingAvatar?, label?, trailingBadge?, content? }', default: '—', description: 'Override the classes of any individual slot.' },
]

const itemProps = [
  { name: 'label', type: 'string', description: 'The text of the trigger.' },
  { name: 'icon', type: 'Component | string', description: 'Leading icon. Accepts a component (any lucide-vue-next icon) or a CSS icon class such as `i-lucide-user`.' },
  { name: 'avatar', type: '{ src?, alt?, text?, loading? }', description: 'Leading avatar, shown when there is no icon. Falls back to `text` initials.' },
  { name: 'badge', type: 'string | number | { label?, class? }', description: 'Trailing badge, sized to the tab.' },
  { name: 'content', type: 'string', description: 'Panel text, used when no matching slot is provided.' },
  { name: 'value', type: 'string | number', description: 'Identifies the item. Defaults to its index as a string.' },
  { name: 'disabled', type: 'boolean', description: 'Prevents the tab from being activated.' },
  { name: 'slot', type: 'string', description: 'Renders this item\'s panel through the slot of that name.' },
  { name: 'class', type: 'string', description: 'Merged onto this item\'s trigger.' },
  { name: 'ui', type: '{ trigger?, leadingIcon?, leadingAvatar?, label?, trailingBadge?, content? }', description: 'Per-item slot class overrides.' },
]

const slots = [
  { name: 'leading', payload: '{ item, index }', description: 'Replaces the leading icon or avatar of a trigger.' },
  { name: 'default', payload: '{ item, index }', description: 'Replaces the label of a trigger.' },
  { name: 'trailing', payload: '{ item, index }', description: 'Replaces the trailing badge of a trigger.' },
  { name: 'content', payload: '{ item, index }', description: 'The panel of every item that has no `slot` of its own.' },
  { name: '#{{ item.slot }}', payload: '{ item, index }', description: 'The panel of one specific item, named by its `slot` property.' },
  { name: 'list-leading', payload: '—', description: 'Rendered inside the list, before the first trigger.' },
  { name: 'list-trailing', payload: '—', description: 'Rendered inside the list, after the last trigger.' },
]

const themeSlots = [
  { name: 'root', description: 'The wrapper around the list and the panels.' },
  { name: 'list', description: 'The trigger container — the pill background or the bordered edge.' },
  { name: 'indicator', description: 'The element that slides between triggers, positioned from the `--reka-tabs-indicator-*` variables.' },
  { name: 'trigger', description: 'Each tab button.' },
  { name: 'leadingIcon', description: 'The leading icon of a trigger.' },
  { name: 'leadingAvatar', description: 'The leading avatar image or initials.' },
  { name: 'leadingAvatarSize', description: 'The size class applied to the avatar for each tab size.' },
  { name: 'label', description: 'The `<span>` around a trigger label.' },
  { name: 'trailingBadge', description: 'The trailing badge of a trigger.' },
  { name: 'trailingBadgeSize', description: 'The size class applied to the badge.' },
  { name: 'content', description: 'Each panel.' },
]

const cssVars = [
  { name: '--ui-text-muted', usage: 'text-muted', description: 'The resting color of an inactive trigger.' },
  { name: '--ui-text', usage: 'text-default', description: 'The color an inactive trigger takes on hover.' },
  { name: '--ui-text-highlighted', usage: 'text-highlighted', description: 'The active trigger label in the neutral link variant.' },
  { name: '--ui-text-inverted', usage: 'text-inverted', description: 'The active trigger label sitting on the neutral pill indicator.' },
  { name: '--ui-bg-elevated', usage: 'bg-elevated', description: 'The track behind the pill variant, and the badge fill.' },
  { name: '--ui-bg-inverted', usage: 'bg-inverted', description: 'The indicator fill for the neutral color.' },
  { name: '--ui-border', usage: 'border-default', description: 'The edge line of the link variant.' },
  { name: '--ui-border-accented', usage: 'ring-accented', description: 'The badge ring.' },
  { name: '--ui-border-inverted', usage: 'outline-inverted', description: 'The focus outline for the neutral color.' },
  { name: '--ui-text-dimmed', usage: 'text-dimmed', description: 'Part of the shared text scale; not painted by this component but installed with it.' },
  { name: '--ui-text-toned', usage: 'text-toned', description: 'Part of the shared text scale; not painted by this component but installed with it.' },
  { name: '--ui-bg / --ui-bg-muted / --ui-bg-accented', usage: 'bg-default / bg-muted / bg-accented', description: 'The rest of the shared surface scale.' },
  { name: '--color-primary-content', usage: 'text-primary-content', description: 'The active label on a primary pill indicator. Maps to `--primary-foreground`.' },
  { name: '--color-secondary-content', usage: 'text-secondary-content', description: 'The active label on a secondary pill indicator. Maps to `--secondary-foreground`.' },
  { name: '--success / --success-foreground', usage: 'bg-success / text-success-content', description: 'The success indicator and its active label color.' },
  { name: '--info / --info-foreground', usage: 'bg-info / text-info-content', description: 'The info indicator and its active label color.' },
  { name: '--warning / --warning-foreground', usage: 'bg-warning / text-warning-content', description: 'The warning indicator and its active label color.' },
  { name: '--error / --error-foreground', usage: 'bg-error / text-error-content', description: 'The error indicator and its active label color. Maps to `--destructive` by default.' },
]

const examples = [
  {
    title: 'Items',
    description: 'Pass an array of objects. Each one becomes a trigger, and — unless `content` is `false` — a panel.',
    code: `<script setup lang="ts">
import { AnimatedTabs, type TabsItem } from '@/components/ui/animated-tabs'
import { User, Lock } from 'lucide-vue-next'

const items: TabsItem[] = [
  { label: 'Account', icon: User, content: 'This is the account content.' },
  { label: 'Password', icon: Lock, content: 'This is the password content.' }
]
<\/script>

<template>
  <AnimatedTabs :items="items" class="w-full" />
</template>`
  },
  {
    title: 'Content',
    description: 'Set `content` to `false` to render the triggers on their own — useful when the tabs drive something outside the component, like a code block header.',
    code: `<AnimatedTabs :content="false" :items="items" class="w-full" />`
  },
  {
    title: 'Unmount',
    description: 'Inactive panels are removed from the DOM by default. Set `unmount-on-hide` to `false` to keep them mounted and preserve their state.',
    code: `<AnimatedTabs :unmount-on-hide="false" :items="items" class="w-full" />`
  },
  {
    title: 'Color',
    description: 'The color drives the indicator fill, the active label and the focus outline.',
    code: `<AnimatedTabs color="neutral" :content="false" :items="items" class="w-full" />`
  },
  {
    title: 'Variant',
    description: '`pill` slides a filled rectangle behind the active trigger. `link` draws a thin line along the edge of the list.',
    code: `<AnimatedTabs color="neutral" variant="link" :content="false" :items="items" class="w-full" />`
  },
  {
    title: 'Size',
    description: 'Sizes scale trigger padding, font size and icon size at once.',
    code: `<AnimatedTabs size="xl" variant="pill" :content="false" :items="items" class="w-full" />`
  },
  {
    title: 'Orientation',
    description: 'Vertical tabs stack the triggers and move the indicator to the vertical edge. The panels sit beside the list.',
    code: `<AnimatedTabs orientation="vertical" variant="pill" :content="false" :items="items" class="w-full" />`
  },
  {
    title: 'Control the active item',
    description: 'Use `v-model` (or `default-value`) with the `value` of an item. When an item has no `value`, it is identified by its index **as a string**. Use `value-key` to match on a different key.',
    code: `<script setup lang="ts">
import { ref } from 'vue'

const active = ref('0')
<\/script>

<template>
  <AnimatedTabs v-model="active" :content="false" :items="items" class="w-full" />
</template>`
  },
  {
    title: 'With route query',
    description: 'Drive the active tab from a URL query parameter by giving each item a `value` and binding a writable computed.',
    code: `<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const items = [
  { label: 'Account', icon: User, value: 'account' },
  { label: 'Password', icon: Lock, value: 'password' }
]

const active = computed({
  get: () => (route.query.tab as string) || 'account',
  // The hash keeps the page from scrolling to the top
  set: tab => router.push({ query: { tab }, hash: '#with-route-query' })
})
<\/script>

<template>
  <AnimatedTabs v-model="active" :content="false" :items="items" class="w-full" />
</template>`
  },
  {
    title: 'With content slot',
    description: 'The `#content` slot replaces the panel of every item.',
    code: `<AnimatedTabs :items="items" class="w-full">
  <template #content="{ item }">
    <p>This is the {{ item.label }} tab.</p>
  </template>
</AnimatedTabs>`
  },
  {
    title: 'With custom slot',
    description: 'Give an item a `slot` name to render just that panel yourself.',
    code: `<script setup lang="ts">
const items = [
  { label: 'Account', icon: User, slot: 'account' },
  { label: 'Password', icon: Lock, slot: 'password' }
]
<\/script>

<template>
  <AnimatedTabs :items="items" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
    <template #account="{ item }">
      <p class="text-muted mb-4">Make changes to your account here.</p>
    </template>

    <template #password="{ item }">
      <p class="text-muted mb-4">Change your password here.</p>
    </template>
  </AnimatedTabs>
</template>`
  },
  {
    title: 'With bottom tab bar',
    description: 'The `ui` prop reshapes the tabs into a mobile-style bottom bar with stacked icons and small labels.',
    code: `<AnimatedTabs
  :items="items"
  :content="false"
  :ui="{
    list: 'justify-around w-full',
    trigger: 'grow flex-col gap-1 py-1',
    label: 'text-[10px]/3'
  }"
  class="w-full"
/>`
  },
  {
    title: 'Badges and avatars',
    description: 'An item can carry a trailing badge, and an avatar in place of an icon.',
    code: `<script setup lang="ts">
const items = [
  { label: 'Inbox', icon: Inbox, badge: 12 },
  { label: 'Team', avatar: { src: 'https://github.com/nuxt.png' } }
]
<\/script>

<template>
  <AnimatedTabs :items="items" :content="false" class="w-full" />
</template>`
  },
]
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Animated Tabs</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Animated Tabs</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A set of tab panels displayed one at a time. A faithful port of the Nuxt UI v4 tabs — same props, same slots,
        same theme — with an indicator that slides between triggers instead of snapping.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual', 'css']"
            :key="tab"
            @click="activeInstallTab = tab"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- CLI Install -->
      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                @click="activeCliTab = tab"
                class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
                :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" />
        </div>
      </div>

      <!-- Manual Install -->
      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/animated-tabs</code>.</p>
        <p class="text-sm text-muted-foreground">3. Add the CSS variables from the <strong>css</strong> tab.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Auto-installed:</strong> the <code>add</code> command writes these tokens into your theme for you. Only paste them manually if you copied the files by hand.
        </div>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="css" :code="installCommands.css" class="border-0 m-0 bg-transparent" />
        </div>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">
            <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            your-project
          </div>
          <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
            <div class="flex items-center gap-2 py-2">
              <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              components/ui/animated-tabs
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2 text-pink-500">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                AnimatedTabs.vue
              </div>
              <div class="flex items-center gap-2 py-2 text-amber-500">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                variants.ts
              </div>
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                index.ts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Usage</h2>

      <div v-for="example in examples" :key="example.title" class="flex flex-col mb-8">
        <h3 class="text-2xl mt-5 mb-2 text-foreground">{{ example.title }}</h3>
        <p class="text-sm text-muted-foreground leading-relaxed mb-3">{{ example.description }}</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="vue" :code="example.code" class="border-0 m-0 bg-transparent" />
        </div>
      </div>
    </div>

    <!-- CSS Variables -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">CSS Variables</h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        The tabs paint themselves entirely from these tokens, so they inherit your theme instead of hard-coding colors.
        Raw values live on <code>:root</code> and <code>.dark</code>; the <code>@theme inline</code> block maps them onto
        Tailwind's utility namespaces. That split is what lets <code>text-inverted</code> and <code>bg-inverted</code>
        resolve to opposite colors while both still accept opacity modifiers. This is the same set
        <NuxtLink to="/docs/components/raya-button" class="text-primary hover:underline">Raya Button</NuxtLink>
        installs — if you already have it, there is nothing new to add.
      </p>

      <div class="rounded-none border-t border-border mt-6 overflow-hidden">
        <div v-for="cssVar in cssVars" :key="cssVar.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-56 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ cssVar.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ cssVar.usage }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ cssVar.description }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-warning/20 bg-warning/10 p-4 text-sm text-warning mt-6">
        <strong class="font-semibold">Note:</strong> active pill labels use a per-color foreground
        (<code>text-primary-content</code>, <code>text-success-content</code>, …) rather than Nuxt UI's single
        <code>text-inverted</code>, matching how Raya Button handles solid variants. The <code>neutral</code> color still
        uses <code>text-inverted</code>, which is already correct on <code>bg-inverted</code>.
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="prop in props" :key="prop.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ prop.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex flex-wrap items-center gap-2 min-w-0">
              <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md break-all">{{ prop.type }}</code>
              <div class="flex-1"></div>
              <code class="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">{{ prop.default }}</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-1">{{ prop.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Item</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        The shape of each entry in <code>items</code>. Every property is optional.
      </p>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="item in itemProps" :key="item.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ item.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ item.type }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Slots</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="slot in slots" :key="slot.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ slot.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start">{{ slot.payload }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ slot.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Emits &amp; expose</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">update:modelValue</code>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">Emitted with the value of the newly active tab.</p>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">triggersRef</code>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">Exposed on a template ref: the array of trigger component instances, in item order.</p>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Theme slots</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        The theme lives in <code>variants.ts</code> as a <code>tailwind-variants</code> definition. Each slot can be
        overridden per instance with the <code>ui</code> prop, per item with <code>item.ui</code>, or globally by editing
        that file.
      </p>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="slot in themeSlots" :key="slot.name" class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ slot.name }}</code>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">{{ slot.description }}</p>
        </div>
      </div>
    </div>

    <!-- RIGHT PANE SLOTS -->
    <template #preview>
      <div class="w-full max-w-lg px-8">
        <AnimatedTabs
            v-model="activeTab"
            :items="demoTabs"
            :color="color"
            :variant="variant"
            :size="size"
            :orientation="orientation"
            :content="showContent"
            class="w-full"
        />
      </div>
    </template>

    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <template #settings>
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Color Select -->
      <div class="flex flex-col gap-3 mb-6">
        <label class="text-sm font-medium text-foreground">Color</label>
        <div class="flex flex-wrap gap-3">
          <button
              v-for="c in colors"
              :key="c.value"
              @click="color = c.value"
              :class="[
              'w-6 h-6 rounded-full transition-all ring-offset-2 ring-offset-background',
              color === c.value ? 'ring-2 ring-muted-foreground scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100',
              c.bgClass
            ]"
              :title="c.label"
          ></button>
        </div>
      </div>

      <!-- Variant Select -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Variant</label>
        <div class="relative">
          <select v-model="variant" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="pill">Pill</option>
            <option value="link">Link</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Size Select -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Size</label>
        <div class="relative">
          <select v-model="size" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="xs">Extra Small (xs)</option>
            <option value="sm">Small (sm)</option>
            <option value="md">Medium (md)</option>
            <option value="lg">Large (lg)</option>
            <option value="xl">Extra Large (xl)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Orientation Select -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Orientation</label>
        <div class="relative">
          <select v-model="orientation" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Content Toggle -->
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="showContent = !showContent">Show Content</label>
        <button @click="showContent = !showContent" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', showContent ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', showContent ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>
    </template>
  </DocContent>
</template>

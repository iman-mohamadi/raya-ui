<script setup lang="ts">
import { ref, computed } from 'vue'
import { Rocket, ArrowRight } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Raya Button Component for Vue & Nuxt',
  description: 'A Nuxt UI compatible button for Vue and Nuxt: seven semantic colors, six variants, icons, avatars, links, and automatic loading states.',
  ogTitle: 'Raya Button Component for Vue & Nuxt',
  ogDescription: 'A Nuxt UI compatible button for Vue and Nuxt: seven semantic colors, six variants, icons, avatars, links, and automatic loading states.',
})

// --- Interactive Settings State ---
const variant = ref('solid')
const color = ref('primary')
const size = ref('md')
const iconMode = ref('none')
const isLoading = ref(false)
const isDisabled = ref(false)
const isBlock = ref(false)

const resetSettings = () => {
  variant.value = 'solid'
  color.value = 'primary'
  size.value = 'md'
  iconMode.value = 'none'
  isLoading.value = false
  isDisabled.value = false
  isBlock.value = false
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

const previewLeadingIcon = computed(() => (iconMode.value === 'leading' ? Rocket : undefined))
const previewTrailingIcon = computed(() => (iconMode.value === 'trailing' ? ArrowRight : undefined))

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const cssVarsSnippet = `/* The CLI writes these for you. Paste them into your Tailwind entry
   (the file with @import "tailwindcss") only for a manual install. */

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
  /* Solid-variant foregrounds */
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
  let cliCmd = 'npx raya-ui@latest add raya-button'
  switch (activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add raya-button'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add raya-button'; break;
    case 'bun': cliCmd = 'bun x --bun raya-ui@latest add raya-button'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install tailwind-variants tailwind-merge clsx reka-ui lucide-vue-next`,
    css: cssVarsSnippet
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  const attrs: string[] = [`variant="${variant.value}"`]
  if (color.value !== 'primary') attrs.push(`color="${color.value}"`)
  if (size.value !== 'md') attrs.push(`size="${size.value}"`)
  if (iconMode.value === 'leading') attrs.push(`:leading-icon="Rocket"`)
  if (iconMode.value === 'trailing') attrs.push(`:trailing-icon="ArrowRight"`)
  if (isBlock.value) attrs.push(`block`)
  if (isLoading.value) attrs.push(`loading`)
  if (isDisabled.value) attrs.push(`disabled`)

  const imports = iconMode.value === 'leading'
    ? `\nimport { Rocket } from 'lucide-vue-next'`
    : iconMode.value === 'trailing'
      ? `\nimport { ArrowRight } from 'lucide-vue-next'`
      : ''

  return `<script setup lang="ts">
import { RayaButton } from '@/components/ui/raya-button'${imports}
<\/script>

<template>
  <RayaButton
    ${attrs.join('\n    ')}
  >
    Raya Button
  </RayaButton>
</template>`
})

// --- API Reference data ---
const props = [
  { name: 'label', type: 'string', default: '—', description: 'Text rendered inside the button. Ignored when the default slot is used.' },
  { name: 'color', type: '"primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"', default: '"primary"', description: 'The semantic color palette of the button.' },
  { name: 'variant', type: '"solid" | "outline" | "soft" | "subtle" | "ghost" | "link"', default: '"solid"', description: 'The visual style of the button.' },
  { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'The size of the button — drives padding, font size and icon size together.' },
  { name: 'active-color', type: 'color', default: '—', description: 'Color applied while the button is active (an active link, or `active` set explicitly).' },
  { name: 'active-variant', type: 'variant', default: '—', description: 'Variant applied while the button is active.' },
  { name: 'square', type: 'boolean', default: 'false', description: 'Equal padding on all sides. Applied automatically when there is no label and no default slot.' },
  { name: 'block', type: 'boolean', default: 'false', description: 'Render the button full width, centering its content and pushing the trailing icon to the end.' },
  { name: 'field-group', type: '"horizontal" | "vertical"', default: '—', description: 'Flatten the shared edges when several buttons sit in one group.' },
  { name: 'icon', type: 'Component | string', default: '—', description: 'Icon displayed on the side chosen by `leading` / `trailing`. Accepts a component (any lucide-vue-next icon) or a CSS icon class such as `i-lucide-rocket`.' },
  { name: 'leading-icon', type: 'Component | string', default: '—', description: 'Icon pinned to the left side.' },
  { name: 'trailing-icon', type: 'Component | string', default: '—', description: 'Icon pinned to the right side.' },
  { name: 'leading', type: 'boolean', default: 'false', description: 'Force `icon` onto the left side.' },
  { name: 'trailing', type: 'boolean', default: 'false', description: 'Force `icon` onto the right side.' },
  { name: 'avatar', type: '{ src?, alt?, text?, loading? }', default: '—', description: 'Avatar rendered on the left side. Falls back to `text` initials when `src` is absent.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show the spinning loading icon and disable the button.' },
  { name: 'loading-auto', type: 'boolean', default: 'false', description: 'Enter the loading state automatically while the `@click` promise is pending.' },
  { name: 'loading-icon', type: 'Component | string', default: 'LoaderCircle', description: 'The icon used for the loading state.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button. Links receive `aria-disabled` instead of the `disabled` attribute.' },
  { name: 'type', type: '"button" | "submit" | "reset"', default: '"button"', description: 'The native type, used when the button is not a link.' },
  { name: 'as', type: 'Component | string', default: '"button"', description: 'The element or component to render as when the button is not a link.' },
  { name: 'as-child', type: 'boolean', default: 'false', description: 'Merge the props onto the single child element instead of rendering a wrapper.' },
  { name: 'to', type: 'string | RouteLocation', default: '—', description: 'Turns the button into a link. Uses NuxtLink, then RouterLink, then a plain `<a>` — whichever is available.' },
  { name: 'href', type: 'string', default: '—', description: 'Alias for `to`. Ignored when `to` is set.' },
  { name: 'target', type: 'string', default: '—', description: 'Where to open the link. `_blank` adds `rel="noopener noreferrer"` automatically.' },
  { name: 'rel', type: 'string', default: '—', description: 'Overrides the automatic `rel` attribute.' },
  { name: 'external', type: 'boolean', default: '—', description: 'Force the link to render as a plain `<a>` (true) or as a router link (false).' },
  { name: 'replace', type: 'boolean', default: 'false', description: 'Call `router.replace` instead of `router.push`.' },
  { name: 'download', type: 'boolean | string', default: '—', description: 'Download attribute, forwarded to plain `<a>` links.' },
  { name: 'active', type: 'boolean', default: '—', description: 'Force the active state independently of the current route.' },
  { name: 'exact', type: 'boolean', default: 'false', description: 'Only active when the current path is an exact match.' },
  { name: 'exact-query', type: 'boolean', default: 'false', description: 'Also require the query string to match.' },
  { name: 'exact-hash', type: 'boolean', default: 'false', description: 'Also require the hash to match.' },
  { name: 'active-class', type: 'string', default: '—', description: 'Class applied while the button is active.' },
  { name: 'inactive-class', type: 'string', default: '—', description: 'Class applied while the button is inactive.' },
  { name: 'class', type: 'string', default: '—', description: 'Merged onto the base slot, overriding the generated classes.' },
  { name: 'ui', type: '{ base?, label?, leadingIcon?, leadingAvatar?, trailingIcon? }', default: '—', description: 'Override the classes of any individual slot.' },
]

const slots = [
  { name: 'leading', description: 'Replaces the leading icon or avatar.' },
  { name: 'default', description: 'The content of the button. Takes precedence over `label`.' },
  { name: 'trailing', description: 'Replaces the trailing icon.' },
]

const themeSlots = [
  { name: 'base', description: 'The button element itself — layout, radius, padding, colors and states.' },
  { name: 'label', description: 'The `<span>` wrapping the `label` prop.' },
  { name: 'leadingIcon', description: 'The leading icon, spun by `animate-spin` while loading.' },
  { name: 'leadingAvatar', description: 'The leading avatar image or initials.' },
  { name: 'leadingAvatarSize', description: 'The size class applied to the avatar for each button size.' },
  { name: 'trailingIcon', description: 'The trailing icon, spun while loading when `trailing` is set.' },
]

const cssVars = [
  { name: '--ui-text-dimmed', usage: 'text-dimmed', description: 'Lowest-emphasis text.' },
  { name: '--ui-text-muted', usage: 'text-muted', description: 'Muted text — the resting color of the neutral link variant.' },
  { name: '--ui-text-toned', usage: 'text-toned', description: 'One step above muted.' },
  { name: '--ui-text', usage: 'text-default', description: 'Default body text — used by every neutral variant except solid.' },
  { name: '--ui-text-highlighted', usage: 'text-highlighted', description: 'Strongest text.' },
  { name: '--ui-text-inverted', usage: 'text-inverted', description: 'Text on top of an inverted surface — the label color of the neutral solid button.' },
  { name: '--ui-bg', usage: 'bg-default', description: 'Page background — the resting fill of the neutral outline button.' },
  { name: '--ui-bg-muted', usage: 'bg-muted', description: 'Muted surface.' },
  { name: '--ui-bg-elevated', usage: 'bg-elevated', description: 'Raised surface — the fill of the neutral soft and subtle buttons.' },
  { name: '--ui-bg-accented', usage: 'bg-accented', description: 'One step above elevated — the hover fill of the neutral variants.' },
  { name: '--ui-bg-inverted', usage: 'bg-inverted', description: 'Inverted surface — the fill of the neutral solid button.' },
  { name: '--ui-border', usage: 'border-default / ring-default', description: 'Default border color.' },
  { name: '--ui-border-muted', usage: 'border-muted / ring-muted', description: 'Quieter border color.' },
  { name: '--ui-border-accented', usage: 'ring-accented', description: 'The ring of the neutral outline and subtle buttons.' },
  { name: '--ui-border-inverted', usage: 'ring-inverted / outline-inverted', description: 'The focus ring and focus outline of the neutral variants.' },
  { name: '--color-primary-content', usage: 'text-primary-content', description: 'Label color on a solid primary button. Maps to `--primary-foreground`.' },
  { name: '--color-secondary-content', usage: 'text-secondary-content', description: 'Label color on a solid secondary button. Maps to `--secondary-foreground`.' },
  { name: '--success / --success-foreground', usage: 'bg-success / text-success-content', description: 'The success palette and its label color.' },
  { name: '--info / --info-foreground', usage: 'bg-info / text-info-content', description: 'The info palette and its label color.' },
  { name: '--warning / --warning-foreground', usage: 'bg-warning / text-warning-content', description: 'The warning palette and its label color.' },
  { name: '--error / --error-foreground', usage: 'bg-error / text-error-content', description: 'The error palette and its label color. Maps to `--destructive` by default.' },
]

const examples = [
  {
    title: 'Label',
    description: 'Use the default slot, or the `label` prop, to set the text of the button.',
    code: `<RayaButton label="Button" />

<RayaButton>Button</RayaButton>`
  },
  {
    title: 'Color & Variant',
    description: 'Seven colors times six variants. `color` picks the palette, `variant` picks how much of it is painted.',
    code: `<RayaButton color="neutral">Button</RayaButton>

<RayaButton color="neutral" variant="outline">Button</RayaButton>

<RayaButton color="error" variant="soft">Button</RayaButton>`
  },
  {
    title: 'Size',
    description: 'Sizes scale padding, font size and icon size at once.',
    code: `<RayaButton size="xs">Button</RayaButton>
<RayaButton size="sm">Button</RayaButton>
<RayaButton size="md">Button</RayaButton>
<RayaButton size="lg">Button</RayaButton>
<RayaButton size="xl">Button</RayaButton>`
  },
  {
    title: 'Icon',
    description: 'Pass any `lucide-vue-next` component — or a CSS icon class like `i-lucide-rocket` if you use Iconify. Use `leading-icon` and `trailing-icon` to set a different icon per side. With no label, the button becomes square automatically.',
    code: `<script setup lang="ts">
import { Rocket, ArrowRight, Search } from 'lucide-vue-next'
<\/script>

<template>
  <RayaButton :icon="Rocket">Button</RayaButton>

  <RayaButton :trailing-icon="ArrowRight">Button</RayaButton>

  <!-- Icon-only: square padding, no label needed -->
  <RayaButton :icon="Search" />
</template>`
  },
  {
    title: 'Avatar',
    description: 'The `avatar` prop renders an image on the leading side, sized to match the button. Without `src`, `text` is rendered as initials.',
    code: `<RayaButton
  :avatar="{ src: 'https://github.com/nuxt.png', loading: 'lazy' }"
  color="neutral"
  variant="outline"
>
  Button
</RayaButton>`
  },
  {
    title: 'Link',
    description: 'Set `to` (or `href`) and the button renders as a link: NuxtLink when available, then RouterLink, then a plain `<a>`. External URLs always render as `<a>`, and `target="_blank"` adds `rel="noopener noreferrer"` for you.',
    code: `<RayaButton to="https://github.com/nuxt/ui" target="_blank">
  Button
</RayaButton>

<RayaButton to="/docs/introduction">Docs</RayaButton>`
  },
  {
    title: 'Active state',
    description: 'A link is active when it matches the current route; `active` forces it. Restyle the active state with `active-color` and `active-variant`, or with `active-class` and `inactive-class`.',
    code: `<RayaButton
  active
  color="neutral"
  variant="outline"
  active-color="primary"
  active-variant="solid"
>
  Button
</RayaButton>

<RayaButton active active-class="font-bold" inactive-class="font-light">
  Button
</RayaButton>`
  },
  {
    title: 'Loading',
    description: 'The `loading` prop swaps in a spinner and disables the button. `loading-auto` does it for you while the `@click` handler\'s promise is pending, and `loading-icon` swaps the spinner.',
    code: `<script setup lang="ts">
import { Loader } from 'lucide-vue-next'

async function onClick() {
  return new Promise<void>(res => setTimeout(res, 1000))
}
<\/script>

<template>
  <RayaButton loading :trailing="false">Button</RayaButton>

  <RayaButton loading-auto @click="onClick">Button</RayaButton>

  <RayaButton loading :loading-icon="Loader">Button</RayaButton>
</template>`
  },
  {
    title: 'Block & square',
    description: '`block` stretches the button to full width and pushes the trailing icon to the far edge. `square` forces equal padding on all sides.',
    code: `<RayaButton block :trailing-icon="ArrowRight">Button</RayaButton>

<RayaButton square :icon="Search" />`
  },
  {
    title: 'The class and ui props',
    description: '`class` overrides the base slot. `ui` targets any individual slot.',
    code: `<RayaButton class="font-bold rounded-full">Button</RayaButton>

<RayaButton
  :icon="Rocket"
  color="neutral"
  variant="outline"
  :ui="{ leadingIcon: 'text-primary' }"
>
  Button
</RayaButton>`
  },
]
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Raya Button</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Raya Button</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A button that can act as a link or trigger an action. A faithful port of the Nuxt UI v4 button — same props,
        same slots, same color × variant matrix — running on plain Vue with <code class="text-sm">tailwind-variants</code>.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <!-- Main Install Tabs -->
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/raya-button</code>.</p>
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
              components/ui/raya-button
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2 text-pink-500">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                RayaButton.vue
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
        The button paints itself entirely from these tokens, so it inherits your theme instead of hard-coding colors.
        Raw values live on <code>:root</code> and <code>.dark</code>; the <code>@theme inline</code> block maps them onto
        Tailwind's utility namespaces. Splitting them that way is what lets
        <code>text-inverted</code> and <code>bg-inverted</code> resolve to opposite colors while both still accept opacity
        modifiers such as <code>bg-inverted/90</code>. Every one of them is listed in the
        <strong>css</strong> tab above.
      </p>

      <div class="rounded-none border-t border-border mt-6 overflow-hidden">
        <div v-for="cssVar in cssVars" :key="cssVar.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-56 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ cssVar.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start">{{ cssVar.usage }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ cssVar.description }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-warning/20 bg-warning/10 p-4 text-sm text-warning mt-6">
        <strong class="font-semibold">Note:</strong> solid variants use a per-color foreground
        (<code>text-primary-content</code>, <code>text-success-content</code>, …) rather than Nuxt UI's single
        <code>text-inverted</code>. Nuxt UI can share one inverted token because every brand color there is a 500/400
        shade; this theme pairs each color with its own foreground, so the pairing has to be per color. The
        <code>neutral</code> color still uses <code>text-inverted</code> on <code>bg-inverted</code>.
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        Every native <code>&lt;button&gt;</code> attribute is forwarded as well.
      </p>
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

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Slots</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="slot in slots" :key="slot.name" class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ slot.name }}</code>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">{{ slot.description }}</p>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Theme slots</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        The theme lives in <code>variants.ts</code> as a <code>tailwind-variants</code> definition. Each of these slots can
        be overridden per instance with the <code>ui</code> prop, or globally by editing that file.
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
      <div class="w-full px-10 flex items-center justify-center">
        <RayaButton
            :variant="variant"
            :color="color"
            :size="size"
            :leading-icon="previewLeadingIcon"
            :trailing-icon="previewTrailingIcon"
            :block="isBlock"
            :loading="isLoading"
            :disabled="isDisabled"
        >
          Raya Button
        </RayaButton>
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
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
            <option value="soft">Soft</option>
            <option value="subtle">Subtle</option>
            <option value="ghost">Ghost</option>
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

      <!-- Icon Select -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Icon</label>
        <div class="relative">
          <select v-model="iconMode" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="none">None</option>
            <option value="leading">Leading (Rocket)</option>
            <option value="trailing">Trailing (ArrowRight)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Block Toggle -->
      <div class="flex items-center justify-between mb-5">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isBlock = !isBlock">Block</label>
        <button @click="isBlock = !isBlock" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', isBlock ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isBlock ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Loading Toggle -->
      <div class="flex items-center justify-between mb-5">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isLoading = !isLoading">Loading State</label>
        <button @click="isLoading = !isLoading" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', isLoading ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isLoading ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Disabled Toggle -->
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="isDisabled = !isDisabled">Disabled State</label>
        <button @click="isDisabled = !isDisabled" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', isDisabled ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', isDisabled ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>
    </template>
  </DocContent>
</template>

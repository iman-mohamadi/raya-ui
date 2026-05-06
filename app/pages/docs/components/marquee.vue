<script setup lang="ts">
import { ref, computed } from 'vue'
import { Marquee } from '@/components/ui/marquee'
import { CodeBlock } from '@/components/ui/code-block'
import { cn } from '@/lib/utils'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Marquee Component for Vue & Nuxt',
  description: 'An infinite scrolling component that can be paused on hover, supporting horizontal and vertical orientations.',
  ogTitle: 'Marquee Component for Vue & Nuxt',
  ogDescription: 'An infinite scrolling component that can be paused on hover, supporting horizontal and vertical orientations.',
})

// --- Interactive Settings State ---
const activeExample = ref('horizontal') // horizontal, vertical, 3d
const pauseOnHover = ref(true)
const reverse = ref(false)
const duration = ref(20)

const resetSettings = () => {
  activeExample.value = 'horizontal'
  pauseOnHover.value = true
  reverse.value = false
  duration.value = 20
}

// --- Data for Examples ---
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add marquee'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add marquee'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add marquee'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add marquee'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install clsx tailwind-merge`,
    css: `@theme inline {
  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-100% - var(--gap))); }
  }

  @keyframes marquee-vertical {
    from { transform: translateY(0); }
    to { transform: translateY(calc(-100% - var(--gap))); }
  }
}`
  }
})

// --- Dynamic Source Code ---
const activeCodeString = computed(() => {
  let props1 = ``
  let props2 = ` reverse`

  if (pauseOnHover.value) {
    props1 += ` pause-on-hover`
    props2 += ` pause-on-hover`
  }
  if (reverse.value) {
    props1 += ` reverse`
    props2 = props2.replace(' reverse', '')
  }

  const durationClass = `class="[--duration:${duration.value}s]"`

  if (activeExample.value === '3d') {
    return `<template>
  <div class="relative flex h-[600px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px] rounded-lg border bg-background">
    <div
      class="flex flex-row items-center gap-4"
      style="transform: translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg);"
    >
      <Marquee${props1} vertical ${durationClass}>
        <!-- Review Cards -->
      </Marquee>
      <Marquee${props2} vertical ${durationClass}>
        <!-- Review Cards -->
      </Marquee>
      <Marquee${props1} vertical ${durationClass}>
        <!-- Review Cards -->
      </Marquee>
      <Marquee${props2} vertical ${durationClass}>
        <!-- Review Cards -->
      </Marquee>
    </div>

    <!-- Gradient Overlays -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
  </div>
</template>`
  }

  if (activeExample.value === 'vertical') {
    return `<template>
  <div class="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-background">
    <Marquee${props1} vertical ${durationClass}>
      <!-- Review Cards (First Row) -->
    </Marquee>
    <Marquee${props2} vertical ${durationClass}>
      <!-- Review Cards (Second Row) -->
    </Marquee>

    <!-- Gradient Overlays -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background"></div>
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background"></div>
  </div>
</template>`
  }

  return `<script setup lang="ts">
import { Marquee } from '@/components/ui/marquee'
<\/script>

<template>
  <div class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
    <Marquee${props1} ${durationClass}>
      <!-- Review Cards (First Row) -->
    </Marquee>
    <Marquee${props2} ${durationClass}>
      <!-- Review Cards (Second Row) -->
    </Marquee>

    <!-- Gradient Overlays -->
    <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
  </div>
</template>`
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Marquee</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Marquee</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        An infinite scrolling component that handles content loops effortlessly. Supports horizontal, vertical, and 3D perspective orientations.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/marquee</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-warning/20 bg-warning/10 p-4 text-sm text-warning mb-2">
          <strong class="font-semibold">Required:</strong> You must add the keyframes and animations to your <code>main.css</code> file.
        </div>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="css" :code="installCommands.css" class="border-0 m-0 bg-transparent max-h-[400px] overflow-y-auto" />
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
              components
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                ui
              </div>
              <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                <div class="flex items-center gap-2 py-2 text-pink-500">
                  <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  marquee
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>Marquee.vue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">reverse</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Reverses the animation direction.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">pauseOnHover</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Pauses the animation when the mouse hovers over the container.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">vertical</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Changes orientation to vertical scrolling.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">repeat</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">4</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Number of times to duplicate the content for seamless looping.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">class</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Custom classes. Use <code>[--duration:20s]</code> or <code>[--gap:1rem]</code> here to customize speed and spacing.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full flex items-center justify-center p-6 h-full min-h-[500px]">

        <!-- Horizontal Example -->
        <div v-if="activeExample === 'horizontal'" class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background border border-border shadow-sm">
          <Marquee :pause-on-hover="pauseOnHover" :reverse="reverse" :style="`--duration: ${duration}s`">
            <figure
                v-for="review in firstRow"
                :key="review.username"
                class="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div class="flex flex-row items-center gap-2">
                <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                  <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                </div>
              </div>
              <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
            </figure>
          </Marquee>

          <Marquee :pause-on-hover="pauseOnHover" :reverse="!reverse" :style="`--duration: ${duration}s`">
            <figure
                v-for="review in secondRow"
                :key="review.username"
                class="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div class="flex flex-row items-center gap-2">
                <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                  <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                </div>
              </div>
              <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
            </figure>
          </Marquee>

          <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
          <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>

        <!-- Vertical Example -->
        <div v-else-if="activeExample === 'vertical'" class="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg bg-background border border-border shadow-sm">
          <Marquee :pause-on-hover="pauseOnHover" :reverse="reverse" vertical :style="`--duration: ${duration}s`">
            <figure
                v-for="review in firstRow"
                :key="review.username"
                class="relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div class="flex flex-row items-center gap-2">
                <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                  <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                </div>
              </div>
              <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
            </figure>
          </Marquee>

          <Marquee :pause-on-hover="pauseOnHover" :reverse="!reverse" vertical :style="`--duration: ${duration}s`">
            <figure
                v-for="review in secondRow"
                :key="review.username"
                class="relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div class="flex flex-row items-center gap-2">
                <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                  <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                </div>
              </div>
              <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
            </figure>
          </Marquee>

          <div class="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background"></div>
          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background"></div>
        </div>

        <!-- 3D Perspective Example -->
        <div v-else-if="activeExample === '3d'" class="relative flex h-[600px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px] rounded-lg bg-background border border-border shadow-sm">
          <div
              class="flex flex-row items-center gap-4"
              style="transform: translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg);"
          >
            <Marquee :pause-on-hover="pauseOnHover" :reverse="reverse" vertical :style="`--duration: ${duration}s`">
              <figure v-for="review in firstRow" :key="review.username" class="relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors">
                <div class="flex flex-row items-center gap-2">
                  <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                    <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                  </div>
                </div>
                <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
              </figure>
            </Marquee>
            <Marquee :pause-on-hover="pauseOnHover" :reverse="!reverse" vertical :style="`--duration: ${duration}s`">
              <figure v-for="review in secondRow" :key="review.username" class="relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors">
                <div class="flex flex-row items-center gap-2">
                  <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                    <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                  </div>
                </div>
                <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
              </figure>
            </Marquee>
            <Marquee :pause-on-hover="pauseOnHover" :reverse="reverse" vertical :style="`--duration: ${duration}s`">
              <figure v-for="review in firstRow" :key="review.username" class="relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors">
                <div class="flex flex-row items-center gap-2">
                  <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                    <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                  </div>
                </div>
                <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
              </figure>
            </Marquee>
            <Marquee :pause-on-hover="pauseOnHover" :reverse="!reverse" vertical :style="`--duration: ${duration}s`">
              <figure v-for="review in secondRow" :key="review.username" class="relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border border-border p-4 bg-muted/30 hover:bg-muted/60 transition-colors">
                <div class="flex flex-row items-center gap-2">
                  <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-foreground">{{ review.name }}</span>
                    <p class="text-xs font-medium text-muted-foreground">{{ review.username }}</p>
                  </div>
                </div>
                <blockquote class="mt-2 text-sm text-foreground/80">{{ review.body }}</blockquote>
              </figure>
            </Marquee>
          </div>

          <div class="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
          <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>

      </div>
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Source Code Slot               -->
    <!-- ========================================== -->
    <template #code>
      <CodeBlock language="vue" :code="activeCodeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Settings Panel Slot            -->
    <!-- ========================================== -->
    <template #settings>
      <!-- Panel Header & Reset -->
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Example Switcher -->
      <div class="flex flex-col gap-2 mb-6 border-b border-border pb-6">
        <label class="text-sm font-medium text-foreground">Example Variant</label>
        <div class="relative">
          <select v-model="activeExample" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="horizontal">Horizontal (Default)</option>
            <option value="vertical">Vertical</option>
            <option value="3d">3D Perspective</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Duration Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Duration</label>
          <span class="text-xs font-mono text-muted-foreground">{{ duration }}s</span>
        </div>
        <input type="range" v-model.number="duration" min="5" max="50" step="1" class="w-full accent-foreground" />
      </div>

      <!-- Pause On Hover Toggle -->
      <div class="flex items-center justify-between mb-5">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="pauseOnHover = !pauseOnHover">Pause on Hover</label>
        <button @click="pauseOnHover = !pauseOnHover" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', pauseOnHover ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', pauseOnHover ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Reverse Toggle -->
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="reverse = !reverse">Reverse Direction</label>
        <button @click="reverse = !reverse" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', reverse ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', reverse ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

    </template>
  </NuxtLayout>
</template>
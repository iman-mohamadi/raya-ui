<script setup lang="ts">
import { Marquee } from '@/components/ui/marquee'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { cn } from '@/lib/utils'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

const PREVIEW_TABS = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/marquee.json`,
  manual: `npm install clsx tailwind-merge`
}

const cssCode = `@theme inline {
  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }

  @keyframes marquee-vertical {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - var(--gap)));
    }
  }
}`

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

// --- Code Snippets ---

const horizontalCode = `<script setup lang="ts">
import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  // ... other reviews
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)
<\/script>

<template>
  <div class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
    <Marquee pause-on-hover class="[--duration:20s]">
      <figure
        v-for="review in firstRow"
        :key="review.username"
        :class="cn(
          'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
          'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
          'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
        )"
      >
        <div class="flex flex-row items-center gap-2">
          <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
          <div class="flex flex-col">
            <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
            <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
          </div>
        </div>
        <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
      </figure>
    </Marquee>

    <Marquee reverse pause-on-hover class="[--duration:20s]">
      <figure
        v-for="review in secondRow"
        :key="review.username"
        :class="cn(
          'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
          'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
          'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
        )"
      >
        <div class="flex flex-row items-center gap-2">
          <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
          <div class="flex flex-col">
            <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
            <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
          </div>
        </div>
        <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
      </figure>
    </Marquee>

    <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
  </div>
</template>`

const verticalCode = `<template>
  <div class="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
    <Marquee pause-on-hover vertical class="[--duration:20s]">
      <figure
        v-for="review in firstRow"
        :key="review.username"
        :class="cn(
          'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
          'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
          'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
        )"
      >
        <div class="flex flex-row items-center gap-2">
          <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
          <div class="flex flex-col">
            <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
            <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
          </div>
        </div>
        <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
      </figure>
    </Marquee>

    <Marquee reverse pause-on-hover vertical class="[--duration:20s]">
      <figure
        v-for="review in secondRow"
        :key="review.username"
        :class="cn(
          'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
          'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
          'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
        )"
      >
        <div class="flex flex-row items-center gap-2">
          <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
          <div class="flex flex-col">
            <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
            <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
          </div>
        </div>
        <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
      </figure>
    </Marquee>

    <div class="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white dark:from-background"></div>
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-background"></div>
  </div>
</template>`

const code3D = `<template>
  <div class="relative flex h-[600px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px] rounded-lg border bg-background md:shadow-xl">
    <div
      class="flex flex-row items-center gap-4"
      style="transform: translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg);"
    >
      <Marquee pause-on-hover vertical class="[--duration:20s]">
        <figure v-for="review in firstRow" :key="review.username" class="...card-classes...">
           </figure>
      </Marquee>
      <Marquee reverse pause-on-hover vertical class="[--duration:20s]">
        <figure v-for="review in secondRow" :key="review.username" class="...card-classes...">
           </figure>
      </Marquee>
      <Marquee reverse pause-on-hover vertical class="[--duration:20s]">
        <figure v-for="review in firstRow" :key="review.username" class="...card-classes...">
           </figure>
      </Marquee>
      <Marquee pause-on-hover vertical class="[--duration:20s]">
        <figure v-for="review in secondRow" :key="review.username" class="...card-classes...">
           </figure>
      </Marquee>
    </div>

    <div class="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white dark:from-background"></div>
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white dark:from-background"></div>
    <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background"></div>
  </div>
</template>`

useSeoMeta({
  title: 'Marquee Component for Vue & Nuxt',
  description: 'An infinite scrolling component that can be paused on hover, supporting horizontal and vertical orientations.',
  ogTitle: 'Marquee Component for Vue & Nuxt',
  ogDescription: 'An infinite scrolling component that can be paused on hover, supporting horizontal and vertical orientations.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Marquee"
        description="An infinite scrolling component that handles content loops effortlessly."
    />
    <Divider/>

    <div class="mt-4">
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
            <Marquee pause-on-hover class="[--duration:20s]">
              <figure
                  v-for="review in firstRow"
                  :key="review.username"
                  :class="cn(
                  'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
                  'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                  'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                )"
              >
                <div class="flex flex-row items-center gap-2">
                  <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                    <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                  </div>
                </div>
                <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
              </figure>
            </Marquee>

            <Marquee reverse pause-on-hover class="[--duration:20s]">
              <figure
                  v-for="review in secondRow"
                  :key="review.username"
                  :class="cn(
                  'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
                  'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                  'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                )"
              >
                <div class="flex flex-row items-center gap-2">
                  <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                    <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                  </div>
                </div>
                <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
              </figure>
            </Marquee>

            <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="horizontalCode" lang="html"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>

      <div class="space-y-4">
        <h3 class="text-lg font-semibold">1. Add Component</h3>
        <CodeBlock :code="installCommands.npm"/>
        <p class="text-sm text-zinc-400">Or manually:</p>
        <CodeBlock :code="installCommands.manual"/>
      </div>

      <div class="space-y-4 mt-6">
        <h3 class="text-lg font-semibold">2. Update CSS</h3>
        <p class="text-sm text-zinc-400">Add the following animations to your global CSS file (e.g., <code>app/assets/css/main.css</code>) within the <code>@theme</code> block (Tailwind v4).</p>
        <CodeBlock :code="cssCode" lang="css"/>
      </div>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Vertical</h3>
        <p class="text-zinc-400 text-sm">
          Vertical scrolling useful for sidebars or mobile views.
        </p>
        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
              <Marquee pause-on-hover vertical class="[--duration:20s]">
                <figure
                    v-for="review in firstRow"
                    :key="review.username"
                    :class="cn(
                    'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
                    'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                    'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                  )"
                >
                  <div class="flex flex-row items-center gap-2">
                    <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                    <div class="flex flex-col">
                      <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                      <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                    </div>
                  </div>
                  <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
                </figure>
              </Marquee>

              <Marquee reverse pause-on-hover vertical class="[--duration:20s]">
                <figure
                    v-for="review in secondRow"
                    :key="review.username"
                    :class="cn(
                    'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
                    'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                    'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                  )"
                >
                  <div class="flex flex-row items-center gap-2">
                    <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                    <div class="flex flex-col">
                      <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                      <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                    </div>
                  </div>
                  <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
                </figure>
              </Marquee>

              <div class="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background"></div>
              <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background"></div>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="verticalCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">3D Perspective</h3>
        <p class="text-zinc-400 text-sm">
          Using CSS transforms to create a 3D wall of marquees.
        </p>
        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="relative flex h-[600px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px] rounded-lg border bg-background md:shadow-xl">
              <div
                  class="flex flex-row items-center gap-4"
                  style="transform: translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg);"
              >
                <Marquee pause-on-hover vertical class="[--duration:20s]">
                  <figure
                      v-for="review in firstRow"
                      :key="review.username"
                      :class="cn(
                      'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
                      'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                      'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                    )"
                  >
                    <div class="flex flex-row items-center gap-2">
                      <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                      <div class="flex flex-col">
                        <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                        <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                      </div>
                    </div>
                    <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
                  </figure>
                </Marquee>
                <Marquee reverse pause-on-hover vertical class="[--duration:20s]">
                  <figure
                      v-for="review in secondRow"
                      :key="review.username"
                      :class="cn(
                      'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
                      'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                      'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                    )"
                  >
                    <div class="flex flex-row items-center gap-2">
                      <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                      <div class="flex flex-col">
                        <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                        <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                      </div>
                    </div>
                    <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
                  </figure>
                </Marquee>
                <Marquee reverse pause-on-hover vertical class="[--duration:20s]">
                  <figure
                      v-for="review in firstRow"
                      :key="review.username"
                      :class="cn(
                      'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
                      'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                      'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                    )"
                  >
                    <div class="flex flex-row items-center gap-2">
                      <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                      <div class="flex flex-col">
                        <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                        <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                      </div>
                    </div>
                    <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
                  </figure>
                </Marquee>
                <Marquee pause-on-hover vertical class="[--duration:20s]">
                  <figure
                      v-for="review in secondRow"
                      :key="review.username"
                      :class="cn(
                      'relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4',
                      'border-zinc-950/[.1] bg-zinc-950/[.01] hover:bg-zinc-950/[.05]',
                      'dark:border-zinc-50/[.1] dark:bg-zinc-50/[.10] dark:hover:bg-zinc-50/[.15]'
                    )"
                  >
                    <div class="flex flex-row items-center gap-2">
                      <img class="rounded-full" width="32" height="32" :src="review.img" :alt="review.name" />
                      <div class="flex flex-col">
                        <span class="text-sm font-medium dark:text-white">{{ review.name }}</span>
                        <p class="text-xs font-medium dark:text-white/40">{{ review.username }}</p>
                      </div>
                    </div>
                    <blockquote class="mt-2 text-sm">{{ review.body }}</blockquote>
                  </figure>
                </Marquee>
              </div>

              <div class="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
              <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
              <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
              <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="code3D" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">reverse</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">false</td>
            <td class="px-4 py-3">Reverses the animation direction.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">pauseOnHover</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">false</td>
            <td class="px-4 py-3">Pauses the animation when the mouse hovers over the container.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">vertical</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">false</td>
            <td class="px-4 py-3">Changes orientation to vertical.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">repeat</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">4</td>
            <td class="px-4 py-3">Number of times to duplicate the content for seamless looping.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">class</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">''</td>
            <td class="px-4 py-3">Custom classes. Use <code>[--duration:20s]</code> or <code>[--gap:1rem]</code> here to customize.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
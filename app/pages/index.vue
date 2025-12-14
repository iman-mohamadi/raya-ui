<script setup lang="ts">
import { ArrowRight, Github, Copy, Check } from 'lucide-vue-next'

// --- Hero Demo Data ---
const adj = ['Modern', 'Playful', 'Robust', 'Fast', 'Sleek'].map(l => ({ value: l, label: l }))
const nouns = ['UI', 'Components', 'Library', 'Tools', 'Kit'].map(l => ({ value: l, label: l }))
const framework = ['for Vue', 'for Nuxt', 'for Web', 'for You', 'for App'].map(l => ({ value: l, label: l }))

const state = ref({
  adj: 'Playful',
  noun: 'Components',
  framework: 'for Vue'
})

// --- Copy Install Command ---
const config = useAppConfig().enzoui
const copied = ref(false)
const installCmd = 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/wheel-picker.json'

const copyInstall = () => {
  navigator.clipboard.writeText(installCmd)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">

    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
      <div class="absolute right-20 bottom-20 -z-10 h-[200px] w-[200px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
    </div>

    <header class="container relative z-10 mx-auto flex h-16 items-center justify-between px-6">
      <NuxtLink to="/" class="mr-6 flex items-center space-x-2 font-bold text-xl tracking-tight">
        <div class="h-6 w-6 rounded bg-white text-black flex items-center justify-center text-xs font-black">E</div>
        <span>{{ config?.name || 'EnzOUi' }}</span>
      </NuxtLink>
      <div class="flex items-center gap-6">
        <NuxtLink to="/docs/introduction" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Documentation
        </NuxtLink>
        <a :href="config?.github" target="_blank" class="text-zinc-400 hover:text-white transition-colors">
          <Github class="h-5 w-5" />
        </a>
      </div>
    </header>

    <main class="relative z-10 flex flex-col items-center">

      <section class="container mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 py-16 lg:py-28">

        <div class="flex-1 space-y-8 text-center lg:text-left">
          <div class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-md">
            <span class="mr-2 flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            v1.0.0 Now Available
          </div>

          <h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
            Make your UI <br class="hidden lg:block" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Pop & Roll.
            </span>
          </h1>

          <p class="mx-auto lg:mx-0 max-w-2xl text-lg text-zinc-400 leading-relaxed">
            A collection of beautifully crafted, copy-paste components for Vue & Nuxt.
            Built on top of Shadcn & Reka UI.
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <NuxtLink to="/docs/components/wheel-picker">
              <Button size="lg" class="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-transform hover:scale-105 active:scale-95">
                Browse Components
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </NuxtLink>

            <div class="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 p-1 pr-4 backdrop-blur-md transition-colors hover:border-white/20">
              <div class="rounded-full bg-zinc-800 p-2">
                <span class="text-zinc-400 text-xs font-mono">npm</span>
              </div>
              <code class="text-sm font-mono text-zinc-300">npx shadcn-vue@latest add...</code>
              <button @click="copyInstall" class="ml-2 text-zinc-400 hover:text-white transition-colors" title="Copy install command">
                <Check v-if="copied" class="h-4 w-4 text-green-500" />
                <Copy v-else class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex-1 w-full max-w-md lg:max-w-full flex justify-center perspective-[2000px]">
          <div class="relative w-full max-w-[400px] aspect-square rounded-[2.5rem] border border-white/10 bg-zinc-900/40 backdrop-blur-xl shadow-2xl p-8 flex flex-col items-center justify-center transform transition-transform hover:rotate-1 hover:scale-[1.01] duration-500">

            <div class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 opacity-20 blur-2xl animate-pulse"></div>
            <div class="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-blue-500 opacity-20 blur-2xl"></div>

            <div class="relative w-full rounded-2xl border border-white/5 bg-black/80 overflow-hidden shadow-inner flex items-center justify-center">

              <WheelPickerWrapper class="h-full w-full items-center px-6 z-10">
                <WheelPicker
                    v-model="state.adj"
                    :options="adj"
                    infinite
                    class="flex-1"
                />
                <WheelPicker
                    v-model="state.noun"
                    :options="nouns"
                    infinite
                    class="flex-1"
                />
                <WheelPicker
                    v-model="state.framework"
                    :options="framework"
                    infinite
                    class="flex-1"
                />
              </WheelPickerWrapper>
            </div>

            <div class="mt-8 text-center space-y-1">
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Interactive Demo</p>
              <div class="h-8 flex items-center justify-center">
                <p class="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                  {{ state.adj }} {{ state.noun }} {{ state.framework }}
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>

      <section class="container mx-auto px-6 py-24 border-t border-white/5">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-3xl font-bold tracking-tight md:text-4xl">Why EnzOUi?</h2>
          <p class="text-zinc-400 max-w-2xl mx-auto">Not just another library. A collection of meticulously designed primitives.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1">
            <h3 class="text-xl font-bold mb-3 text-white">Copy & Paste</h3>
            <p class="text-zinc-400 leading-relaxed">No heavy npm packages or black boxes. Just copy the source code directly into your project.</p>
          </div>
          <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1">
            <h3 class="text-xl font-bold mb-3 text-white">Accessible</h3>
            <p class="text-zinc-400 leading-relaxed">Built on top of unstyled primitives (Reka UI) for full keyboard and screen reader support.</p>
          </div>
          <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1">
            <h3 class="text-xl font-bold mb-3 text-white">Themable</h3>
            <p class="text-zinc-400 leading-relaxed">Styled with Tailwind CSS. Design tokens map to your theme configurations automatically.</p>
          </div>
        </div>
      </section>

    </main>

    <footer class="border-t border-white/10 bg-black/50 backdrop-blur py-8">
      <div class="container mx-auto px-6 text-center">
        <p class="text-sm text-zinc-500">&copy; {{ new Date().getFullYear() }} EnzOUi.</p>
      </div>
    </footer>
  </div>
</template>
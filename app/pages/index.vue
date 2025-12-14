<script setup lang="ts">
import { Github, Copy, Check } from 'lucide-vue-next'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { Button } from '@/components/ui/button'

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
const config = useAppConfig().raya
const copied = ref(false)
const installCmd = `npx shadcn-vue@latest add ${config.baseUrl}/wheel-picker.json`

const copyInstall = () => {
  navigator.clipboard.writeText(installCmd)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-teal-500/30 font-sans">

    <div class="absolute inset-0 z-0">
      <BackgroundRippleEffect
          :cell-size="50"
          :interactive="true"
          class="opacity-40"
          fill
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />
    </div>

    <header class="container relative z-50 mx-auto flex h-20 items-center justify-between px-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all group-hover:bg-teal-500/20 group-hover:scale-105">
          <span class="font-black text-xl">R</span>
        </div>
        <span class="text-xl font-bold tracking-tight text-white group-hover:text-teal-50 transition-colors">
          {{ config.name }}
        </span>
      </NuxtLink>

      <div class="flex items-center gap-6">
        <NuxtLink to="/docs/introduction" class="text-sm font-medium text-zinc-400 hover:text-teal-400 transition-colors hidden sm:block">
          مستندات
        </NuxtLink>
        <a :href="config?.github" target="_blank" class="text-zinc-400 hover:text-white transition-colors">
          <Github class="h-6 w-6" />
        </a>
      </div>
    </header>

    <main class="relative z-10 flex flex-col items-center justify-center pt-16 lg:pt-24 px-4 text-center">

      <div class="animate-in fade-in zoom-in-95 duration-1000 delay-100 mb-8">
        <div class="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/30 px-4 py-1.5 text-sm text-teal-300 backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:border-teal-400/50 transition-colors cursor-default">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span>نسخه ۱.۰ منتشر شد</span>
        </div>
      </div>

      <div class="max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <h1 class="text-6xl md:text-8xl font-black tracking-tight leading-none">
          <span class="text-white drop-shadow-2xl">RAYA UI</span>
        </h1>
        <h2 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-400 to-emerald-400 pb-2">
          اندیشه‌ای نو در طراحی
        </h2>

        <p class="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mt-8 px-4" dir="rtl">
          <span class="text-teal-400 font-bold">رایا</span> واژه‌ای اصیل ایرانی به معنای
          <span class="text-white font-semibold">اندیشه</span> و <span class="text-white font-semibold">فکر</span> است.
          <br class="hidden md:block" />
          مجموعه‌ای از ابزارهای رابط کاربری که با ظرافت و تفکر برای توسعه‌دهندگان طراحی شده است.
        </p>
      </div>

      <div class="mt-16 w-full max-w-xl perspective-[1000px] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        <LiquidGlass
            class="mx-auto w-full"
            :radius="30"
            :blur="10"
            :scale="-15"
            :lightness="10"
            :g-offset="15"
            :b-offset="15"
        >
          <div class="flex flex-col items-center gap-8 bg-black/40 p-8 sm:p-10 backdrop-blur-xl">

            <div class="w-full space-y-3">
              <div class="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>نصب با Shadcn CLI</span>
                <span class="text-teal-500/80 font-mono">Terminal</span>
              </div>
              <div class="relative group flex items-center gap-3 rounded-xl bg-zinc-950/80 border border-white/10 p-1 pl-1 pr-4 transition-all hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                <div class="text-teal-500 select-none opacity-50">$</div>
                <code class="flex-1 font-mono text-sm text-zinc-300 bg-transparent outline-none overflow-x-auto whitespace-nowrap scrollbar-hide py-3">
                  npx shadcn-vue@latest add ...
                </code>
                <Button
                    size="icon"
                    variant="ghost"
                    class="h-9 w-9 shrink-0 rounded-lg text-zinc-400 hover:bg-teal-500/20 hover:text-teal-400 transition-all active:scale-90"
                    @click="copyInstall"
                >
                  <Check v-if="copied" class="h-5 w-5" />
                  <Copy v-else class="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 w-full">
              <NuxtLink to="/docs/components/liquid-glass" class="w-full">
                <Button variant="outline" class="w-full h-12 text-base border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all hover:-translate-y-1">
                  کامپوننت‌ها
                </Button>
              </NuxtLink>
              <NuxtLink to="/docs/introduction" class="w-full">
                <Button class="w-full h-12 text-base bg-teal-500 text-teal-950 hover:bg-teal-400 font-bold transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                  شروع کنید
                </Button>
              </NuxtLink>
            </div>

          </div>
        </LiquidGlass>
      </div>

    </main>

    <div class="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-teal-950/20 to-transparent pointer-events-none z-0"></div>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
/* RTL Direction fix for specific texts */
.dir-rtl {
  direction: rtl;
}
</style>
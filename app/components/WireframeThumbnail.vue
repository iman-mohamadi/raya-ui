<script setup lang="ts">
defineProps<{
  component: string
}>()
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">

    <div v-if="component === 'Animated Background'" class="flex w-48 flex-col gap-4">
      <div class="flex grow flex-col gap-3">
        <div class="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10"></div>
        <div class="block h-2 w-9/12 rounded-full bg-black/10 dark:bg-white/10"></div>
      </div>
      <div class="flex gap-2">
        <div class="bg-background grow space-y-4 rounded-md p-3 shadow-sm border border-black/5 dark:border-white/5">
          <div class="flex flex-col gap-3">
            <div class="block h-2 w-9/12 rounded-full bg-black/10 dark:bg-white/10"></div>
            <div class="block h-2 w-6/12 rounded-full bg-black/10 dark:bg-white/10"></div>
          </div>
          <div class="bg-primary flex items-center justify-center gap-2 rounded-md p-2 shadow-sm">
            <div class="block h-2 w-full rounded-full bg-white/30 dark:bg-white/10"></div>
          </div>
        </div>
        <div class="bg-background grow space-y-4 rounded-md p-3 shadow-sm border border-black/5 dark:border-white/5">
          <div class="flex flex-col gap-3">
            <div class="block h-2 w-9/12 rounded-full bg-black/10 dark:bg-white/10"></div>
            <div class="block h-2 w-6/12 rounded-full bg-black/10 dark:bg-white/10"></div>
          </div>
          <div class="bg-primary flex items-center justify-center gap-2 rounded-md p-2 shadow-sm">
            <div class="block h-2 w-full rounded-full bg-white/30 dark:bg-white/10"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="component === 'File Upload'" class="flex h-24 w-40 flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
      <div class="size-6 rounded-full bg-black/10 dark:bg-white/10"></div>
      <div class="block h-1.5 w-8/12 rounded-full bg-black/10 dark:bg-white/10"></div>
      <div class="block h-1 w-5/12 rounded-full bg-black/5 dark:bg-white/5"></div>
    </div>

    <div v-else-if="component === 'Code Block'" class="flex h-28 w-44 flex-col overflow-hidden rounded-lg bg-zinc-900 shadow-md">
      <div class="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-2">
        <div class="size-2 rounded-full bg-red-500/70"></div>
        <div class="size-2 rounded-full bg-yellow-500/70"></div>
        <div class="size-2 rounded-full bg-green-500/70"></div>
      </div>
      <div class="flex flex-col gap-2 p-3">
        <div class="block h-1.5 w-10/12 rounded-full bg-white/20"></div>
        <div class="block h-1.5 w-7/12 ml-4 rounded-full bg-white/20"></div>
        <div class="block h-1.5 w-5/12 ml-4 rounded-full bg-white/20"></div>
        <div class="block h-1.5 w-8/12 rounded-full bg-white/20"></div>
      </div>
    </div>

    <div v-else-if="component === 'Floating Dock'" class="flex w-48 h-full flex-col items-center justify-end pb-4">
      <div class="flex items-end gap-2.5 rounded-2xl bg-black/10 p-2 backdrop-blur-md dark:bg-white/10">
        <div class="size-5 rounded-full bg-black/20 dark:bg-white/20"></div>
        <div class="size-7 rounded-full bg-black/20 dark:bg-white/20"></div>
        <div class="size-5 rounded-full bg-black/20 dark:bg-white/20"></div>
        <div class="size-5 rounded-full bg-black/20 dark:bg-white/20"></div>
      </div>
    </div>

    <div v-else-if="component === 'Animated Tabs'" class="flex w-40 items-center justify-center">
      <div class="flex w-full items-center gap-1 rounded-full bg-black/5 p-1 dark:bg-white/5 shadow-inner">
        <div class="h-5 w-12 rounded-full bg-background shadow-sm border border-black/5 dark:border-white/5"></div>
        <div class="h-5 grow rounded-full bg-transparent"></div>
        <div class="h-5 grow rounded-full bg-transparent"></div>
      </div>
    </div>

    <div v-else-if="component === 'Liquid Glass'" class="relative flex h-28 w-44 items-center justify-center overflow-hidden">
      <div class="absolute -left-2 top-2 size-12 rounded-full bg-gradient-to-br from-primary to-purple-500 blur-xl opacity-60"></div>
      <div class="absolute -right-2 bottom-2 size-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 blur-xl opacity-60"></div>
      <div class="relative z-10 h-16 w-32 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg dark:border-white/10 dark:bg-black/10 p-2.5 flex flex-col justify-between">
        <div class="size-3 rounded-full bg-white/30"></div>
        <div class="block h-1 w-1/2 rounded-full bg-white/30"></div>
      </div>
    </div>

    <div v-else-if="component === 'Bar Visualizer'" class="flex h-16 w-40 items-end justify-center gap-1.5 pb-2">
      <div class="h-1/3 w-2 rounded-t-sm bg-primary/60"></div>
      <div class="h-2/3 w-2 rounded-t-sm bg-primary/80"></div>
      <div class="h-full w-2 rounded-t-sm bg-primary"></div>
      <div class="h-1/2 w-2 rounded-t-sm bg-primary/80"></div>
      <div class="h-4/5 w-2 rounded-t-sm bg-primary"></div>
      <div class="h-1/4 w-2 rounded-t-sm bg-primary/60"></div>
    </div>

    <div v-else-if="component === 'Marquee'" class="relative flex w-48 items-center gap-2 overflow-hidden" style="mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent)">
      <div class="size-8 shrink-0 rounded-lg bg-black/10 dark:bg-white/10"></div>
      <div class="size-8 shrink-0 rounded-lg bg-black/10 dark:bg-white/10"></div>
      <div class="size-8 shrink-0 rounded-lg bg-black/10 dark:bg-white/10 border-2 border-primary/50"></div>
      <div class="size-8 shrink-0 rounded-lg bg-black/10 dark:bg-white/10"></div>
      <div class="size-8 shrink-0 rounded-lg bg-black/10 dark:bg-white/10"></div>
    </div>

    <div v-else-if="component === 'Partition Bar'" class="flex w-40 flex-col gap-2">
      <div class="flex h-2.5 w-full overflow-hidden rounded-full">
        <div class="w-1/2 bg-primary"></div>
        <div class="w-1/3 bg-primary/60"></div>
        <div class="w-1/6 bg-primary/20"></div>
      </div>
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-1"><div class="size-1.5 rounded-full bg-primary"></div><div class="h-1 w-5 rounded-full bg-black/10 dark:bg-white/10"></div></div>
        <div class="flex items-center gap-1"><div class="size-1.5 rounded-full bg-primary/60"></div><div class="h-1 w-5 rounded-full bg-black/10 dark:bg-white/10"></div></div>
      </div>
    </div>

    <div v-else-if="component === 'Tree'" class="flex w-36 flex-col gap-2">
      <div class="flex items-center gap-2">
        <div class="size-2.5 shrink-0 rounded-sm bg-black/20 dark:bg-white/20"></div>
        <div class="block h-1.5 w-8/12 rounded-full bg-black/10 dark:bg-white/10"></div>
      </div>
      <div class="flex items-center gap-2 pl-3 border-l-2 border-black/5 dark:border-white/5 ml-1">
        <div class="h-px w-2 bg-black/5 dark:bg-white/5"></div>
        <div class="size-1.5 shrink-0 rounded-full bg-black/20 dark:bg-white/20"></div>
        <div class="block h-1.5 w-6/12 rounded-full bg-black/10 dark:bg-white/10"></div>
      </div>
      <div class="flex items-center gap-2 pl-3 border-l-2 border-black/5 dark:border-white/5 ml-1">
        <div class="h-px w-2 bg-black/5 dark:bg-white/5"></div>
        <div class="size-1.5 shrink-0 rounded-full bg-black/20 dark:bg-white/20"></div>
        <div class="block h-1.5 w-7/12 rounded-full bg-black/10 dark:bg-white/10"></div>
      </div>
    </div>

    <div v-else-if="component === 'Flip Clock'" class="flex w-40 items-center justify-center gap-2">
      <div class="relative flex size-12 flex-col items-center justify-center rounded-lg bg-black/10 dark:bg-white/10 shadow-inner">
        <div class="absolute top-1/2 h-px w-full -translate-y-1/2 bg-background/80"></div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="size-1 rounded-full bg-black/20 dark:bg-white/20"></div>
        <div class="size-1 rounded-full bg-black/20 dark:bg-white/20"></div>
      </div>
      <div class="relative flex size-12 flex-col items-center justify-center rounded-lg bg-black/10 dark:bg-white/10 shadow-inner">
        <div class="absolute top-1/2 h-px w-full -translate-y-1/2 bg-background/80"></div>
      </div>
    </div>

    <div v-else class="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
      No Preview
    </div>

  </div>
</template>
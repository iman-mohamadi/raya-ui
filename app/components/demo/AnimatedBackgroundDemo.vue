<script setup lang="ts">
import {AnimatedBackground} from "~/components/ui/animated-background";

const CARDS = [
  {
    id: 1,
    title: 'Dialog',
  },
  {
    id: 2,
    title: 'Popover',
  },
];
</script>

<template>
  <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 flex justify-center">
    <div class="w-full flex justify-center items-center">
      <AnimatedBackground
          :items="CARDS"
          :enable-hover="true"
          class="grid grid-cols-2 p-5"
          :transition="{
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.6,
                    }"
      >
        <template #default="{ item }">
          <div class="flex select-none flex-col space-y-1 p-4">
            <h3 class="text-base font-medium text-zinc-800 dark:text-zinc-50">
              {{ item.title }}
            </h3>
          </div>
        </template>
        <template #background>
          <div class="absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-800"/>
        </template>
      </AnimatedBackground>
    </div>
  </div>
</template>

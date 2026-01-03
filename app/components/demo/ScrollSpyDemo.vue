<script setup lang="ts">
import {
  ScrollSpy,
  ScrollSpyNav,
  ScrollSpyLink,
  ScrollSpyViewport,
  ScrollSpySection
} from '@/components/ui/scroll-spy'
</script>

<template>
  <div class="w-full h-[500px] border border-zinc-800 rounded-xl overflow-hidden relative">
    <ScrollSpy class="h-full flex-row" orientation="horizontal">

      <div class="w-48 border-r border-zinc-800 p-4 bg-zinc-950/50 backdrop-blur">
        <ScrollSpyNav>
          <ScrollSpyLink value="introduction">Introduction</ScrollSpyLink>
          <ScrollSpyLink value="installation">Installation</ScrollSpyLink>
          <ScrollSpyLink value="usage">Usage</ScrollSpyLink>
          <ScrollSpyLink value="api">API Reference</ScrollSpyLink>
        </ScrollSpyNav>
      </div>

      <div id="scroll-container" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
        <ScrollSpyViewport>

          <ScrollSpySection value="introduction" class="min-h-[300px] space-y-4">
            <h2 class="text-2xl font-bold">Introduction</h2>
            <p class="text-zinc-400">ScrollSpy is a utility component that automatically highlights navigation links based on the scroll position.</p>
            <div class="h-32 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed" />
          </ScrollSpySection>

          <ScrollSpySection value="installation" class="min-h-[300px] space-y-4">
            <h2 class="text-2xl font-bold">Installation</h2>
            <p class="text-zinc-400">Install the component via your package manager.</p>
            <div class="h-32 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed" />
          </ScrollSpySection>

          <ScrollSpySection value="usage" class="min-h-[300px] space-y-4">
            <h2 class="text-2xl font-bold">Usage</h2>
            <p class="text-zinc-400">Wrap your navigation and content in the ScrollSpy component.</p>
            <div class="h-32 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed" />
          </ScrollSpySection>

          <ScrollSpySection value="api" class="min-h-[300px] space-y-4">
            <h2 class="text-2xl font-bold">API Reference</h2>
            <p class="text-zinc-400">Detailed documentation of props and methods.</p>
            <div class="h-32 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed" />
          </ScrollSpySection>

          <div class="h-[200px]" /> </ScrollSpyViewport>
      </div>

    </ScrollSpy>
  </div>
</template>

<script lang="ts">
// Since we need to pass the scroll container to ScrollSpy props,
// but it's inside the slot, we might need a small adjustment or use window scroll.
// However, for nested scrolling like this, let's update the ScrollSpy usage in the demo:

import { ref, onMounted } from 'vue'

const container = ref<HTMLElement | null>(null)

// Note: In the template above, I didn't bind :container="container" because
// ref resolution order can be tricky.
// A robust way is to put the ScrollSpy around the container,
// and in ScrollSpy.vue, allow it to find the scroll container if not passed,
// or simply pass it via a ref that we attach to the div.
</script>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'

const route = useRoute()
const navStore = useNavigationStore()

// Dynamically build the navigation array from the Pinia store
const navigation = computed(() => {
  // 1. Extract the groups from the store
  const guideGroup = navStore.navGroups.find(g => g.title === 'Guide')
  const componentsGroup = navStore.navGroups.find(g => g.title === 'Core Components')
  const backgroundsGroup = navStore.navGroups.find(g => g.title === 'Backgrounds')

  // Helper to map store keys (label/to) to template keys (title/path)
  const mapItems = (items: any[]) => items.map(item => ({ title: item.label, path: item.to }))

  return [
    {
      title: 'Getting Started',
      items: [
        { title: 'Home', path: '/' }, // Injected at the very top
        // Reverses the sort so Introduction comes before Installation natively
        ...mapItems(guideGroup?.items || []).sort((a, b) => b.title.localeCompare(a.title))
      ]
    },
    {
      title: 'Components',
      items: mapItems(componentsGroup?.items || [])
    },
    {
      title: 'Backgrounds & Shaders',
      items: mapItems(backgroundsGroup?.items || [])
    }
  ]
})
</script>

<template>
  <nav class="relative z-30 flex flex-col gap-1 px-3 pt-15 pb-32 h-full overflow-y-auto no-scrollbar top-5">

    <div v-for="group in navigation" :key="group.title" class="flex flex-col gap-0 mb-2">

      <span class="px-0 py-4 text-base font-medium text-muted-foreground flex justify-baseline gap-2">
        {{ group.title }}
        <span class="text-xs font-normal tabular-nums opacity-60">{{ group.items.length }}</span>
      </span>

      <NuxtLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          custom
          v-slot="{ href, navigate, isExactActive }"
      >
        <div class="relative group cursor-pointer" @click="navigate">

          <span
              class="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[1.8px] rounded-full z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-left"
              :class="isExactActive
              ? 'w-[30px] opacity-100 bg-primary shadow-md shadow-primary/30'
              : 'w-0 opacity-0 bg-foreground group-hover:w-[24px] group-hover:opacity-100'"
          ></span>

          <span
              class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-px bg-muted-foreground/50 transition-all duration-300"
              :style="{ width: isExactActive ? '0px' : '18px' }"
          ></span>

          <span class="pointer-events-none absolute w-[13px] left-0 top-1/4 h-px bg-muted-foreground/30"></span>
          <span class="pointer-events-none absolute w-[16px] left-0 top-0 h-px bg-muted-foreground/30"></span>
          <span class="pointer-events-none absolute w-[13px] left-0 top-3/4 h-px bg-muted-foreground/30"></span>

          <div
              class="origin-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              :class="isExactActive
              ? 'translate-x-[8px] opacity-100'
              : 'opacity-60 group-hover:translate-x-[8px] group-hover:opacity-100'"
          >
            <NuxtLink :to="href" class="relative flex items-center pl-8 pr-3 py-0.5 select-none">
              <span
                  class="text-base truncate transition-colors duration-300 text-foreground"
                  :class="isExactActive ? 'font-medium' : ''"
              >
                {{ item.title }}
              </span>
            </NuxtLink>
          </div>

        </div>
      </NuxtLink>

    </div>
  </nav>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
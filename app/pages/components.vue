<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationStore } from "~/stores/navigation";

definePageMeta({layout: 'docs'})

const navStore = useNavigationStore()

const groups = computed(() => {
  return navStore.navGroups.filter(g => g.title !== 'Guide')
})
</script>

<template>
  <div>
    <PageTitle
        title="Shadcn components"
        subtitle="Build, customise, ship, repeat"
        description="Copy and paste expertly crafted, fully customisable, responsive, components, powered by shadcn-vue, Tailwind & Vue."
    />
    <Divider/>

    <div class="grid relative row-line before:hidden" v-for="group in groups" :key="group.title">
      <div class="h-g"/>

      <div class="blocks-list-grid-lines">
        <div class="col-line line-1"></div>
        <div class="col-line line-2"></div>
        <div class="col-line line-3"></div>
      </div>

      <div class="grid relative grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-g">
        <div
            v-for="item in group.items"
            :key="item.to"
            class="group"
        >
          <NuxtLink
              :to="item.to"
              class="row-line bg-zinc-50/50 dark:bg-zinc-900/40 aspect-390/200 overflow-hidden relative flex items-center justify-center p-6
                   group-hover:bg-indigo-50/80 dark:group-hover:bg-primary/10 transition-all duration-500 ease-out"
          >
            <span class="text-2xl md:text-3xl font-playful text-muted-foreground/70
                         group-hover:text-primary dark:group-hover:text-primary/70 group-hover:scale-110
                         transition-all duration-300 text-center leading-tight">
              {{ item.label }}
            </span>
          </NuxtLink>

          <NuxtLink :to="item.to" class="pl-m py-2 row-line before:hidden pb-8 block">
            <p class="text-sm text-foreground first-letter:uppercase font-medium group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
              {{ item.label }}
            </p>
            <p class="text-xs text-muted-foreground font-mono truncate pr-2">
              {{ item.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
      <div class="h-g"></div>
    </div>
  </div>
</template>

<style scoped>
/* Import a playful, rounded font */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.font-playful {
  font-family: 'Fredoka', sans-serif;
  letter-spacing: 0.02em;
}
</style>
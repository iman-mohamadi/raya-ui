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

    <div class="relative" v-for="group in groups" :key="group.title">
      <div class="row-line py-4 text-primary text-lg">
        {{group.title}}
      </div>
      <div class="blocks-list-grid-lines">
        <div class="col-line line-1"></div>
        <div class="col-line line-2"></div>
        <div class="col-line line-3"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-g">
        <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="group row-line"
        >
          <div class="bg-background aspect-390/200 overflow-hidden relative flex items-center justify-center p-6  transition-all duration-500 ease-out wrapper-line-after">
            <NuxtImg :src="item.img"  :alt="item.label" class="w-full object-center mix-blend-exclusion"/>
          </div>

          <div class="pl-m py-2 before:hidden pb-8 block">
            <p class="text-sm text-foreground first-letter:uppercase font-medium group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
              {{ item.label }}
            </p>
            <p class="text-xs text-muted-foreground font-mono truncate pr-2">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </div>
      <div class="h-g"></div>
    </div>
  </div>
</template>
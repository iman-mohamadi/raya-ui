<script setup lang="ts">
import {computed} from 'vue'
import {useNavigationStore} from "~/stores/navigation";

definePageMeta({layout: 'docs'})

const navStore = useNavigationStore()

// Filter out 'Guide' to show only Components and Backgrounds
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

      <div class="grid relative xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-g">
        <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
        >
          <div class="row-line grid items-center bg-primary-50/40 aspect-390/200">
            <div class="relative rounded-sm aspect-390/200">
              <div
                  v-if="item?.img"
                  class="absolute inset-0 bg-contain bg-center bg-no-repeat"
                  :style="`background-image: url('${item?.img}');`"
              ></div>
            </div>
          </div>
          <div class="pl-m py-2 row-line before:hidden pb-8">
            <p class="text-sm text-foreground first-letter:uppercase">
              {{ item.label }}
            </p>
            <p class="text-xs text-muted-foreground font-mono">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </div>
      <div class="h-g"></div>
    </div>
  </div>
</template>
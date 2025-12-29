<script setup lang="ts">
import {computed} from 'vue'
import {useNavigationStore} from "~/stores/navigation";

const navStore = useNavigationStore()

// Filter out 'Guide' to show only Components and Backgrounds
const groups = computed(() => {
  return navStore.navGroups.filter(g => g.title !== 'Guide')
})
</script>

<template>
  <div>
    <AppNav/>
    <div class="h-12"></div>
    <div class="container">
      <Divider/>
      <PageTitle title="Components"/>
      <div class="screen-line-after p-4">
        <p class="text-muted-foreground text-lg">
          Beautifully designed components and backgrounds for your next project.
        </p>
      </div>
      <Divider/>
      <div v-for="group in groups" :key="group.title" class="mb-16">
        <Subtitle :text="group.title" :icon="group.icon"/>
        <Divider/>
        <div class="relative">
          <div class="absolute inset-0 -z-1 grid grid-cols-1 gap-2 max-sm:hidden sm:grid-cols-2">
            <div class="border-r border-edge"></div>
            <div class="border-l border-edge"></div>
          </div>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <NuxtLink
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="group/post flex items-center gap-4 p-4 transition-[background-color] ease-out hover:bg-accent2 max-sm:screen-line-before max-sm:screen-line-after sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
            >
              <h3 class="font-semibold text-lg group-hover:text-primary transition-colors">
                {{ item.label }}
              </h3>
            </NuxtLink>
          </div>
        </div>


      </div>
    </div>
  </div>

</template>
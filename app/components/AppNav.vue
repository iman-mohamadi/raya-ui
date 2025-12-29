<script setup lang="ts">
import { Github, Book, Package, Image as ImageIcon, Menu, ChevronDown } from 'lucide-vue-next'
import {useRoute} from "vue-router";

const config = useAppConfig().raya
const route = useRoute()
const props = defineProps({
  showDoc: {
    type: Boolean,
    default: true
  },
  sortedNavGroups: {
    type: Array,
    default: () => []
  }
})

// --- Mobile Menu State ---
const isMobileMenuOpen = ref(false)

// Close mobile menu when route changes
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header class="fixed w-full left-0 top-0 z-50 max-w-screen overflow-x-hidden pt-2 data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black] not-dark:data-[affix=true]:**:data-header-container:after:bg-border transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container">
      <div class="screen-line-before px-2 screen-line-after flex h-12 items-center justify-between after:z-1 after:transition-[background-color]">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" >
            <NuxtImg src="/logo.svg" class="w-20"/>
          </NuxtLink>
          <VersionBadge />
        </div>

        <div class="flex items-center gap-4">
          <div
              v-if="!showDoc"
              class="md:hidden w-fit"
          >
            <Sheet v-model:open="isMobileMenuOpen">
              <SheetTrigger as-child>
                <Button variant="outline" size="icon" class="h-8 w-8">
                  <Menu class="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" class="bg-black border-r border-white/10 text-white w-[80%] sm:w-[350px] p-0">
                <ScrollArea class="h-full px-6 py-6">
                  <SheetHeader class="mb-6 text-left">
                    <SheetTitle class="text-white">Documentation</SheetTitle>
                  </SheetHeader>

                  <nav class="space-y-6">
                    <Collapsible
                        v-for="group in sortedNavGroups"
                        :key="group.title"
                        :default-open="true"
                        class="group/collapsible"
                    >
                      <CollapsibleTrigger class="flex w-full items-center justify-between mb-3 px-1 text-sm font-semibold text-white/90">
                        <div class="flex items-center gap-2">
                          <component :is="group.icon" class="h-4 w-4 text-zinc-400" />
                          {{ group.title }}
                        </div>
                        <ChevronDown class="h-4 w-4 text-zinc-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div class="flex flex-col space-y-1 ml-3 border-l border-zinc-800/50 pl-3">
                          <NuxtLink
                              v-for="item in group.items"
                              :key="item.to"
                              :to="item.to"
                              class="text-sm text-zinc-400 transition hover:text-white py-1"
                              active-class="!text-white font-medium"
                          >
                            {{ item.label }}
                          </NuxtLink>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <nav class="hidden md:flex items-center gap-4">
            <NuxtLink to="/docs/installation" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors" active-class="text-[oklch(0.82_0.16_195)]">
              Installation
            </NuxtLink>
            <NuxtLink to="/docs/introduction" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors" active-class="text-[oklch(0.82_0.16_195)]">
              Introduction
            </NuxtLink>
            <NuxtLink to="/components" class="text-sm font-medium text-zinc-500 hover:text-[oklch(0.82_0.16_195)] transition-colors" active-class="text-[oklch(0.82_0.16_195)]">
              Components
            </NuxtLink>
          </nav>

          <a :href="config?.github" target="_blank" class="text-zinc-500 hover:text-white transition-colors">
            <Github class="h-5 w-5" />
          </a>
        </div>

      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import {ref, onMounted, nextTick, watch, computed} from 'vue'
import {useRoute} from 'vue-router'
import {ArrowLeft, ArrowRight, LayoutGrid} from 'lucide-vue-next'
import Divider from "~/components/Divider.vue";
import Button from "~/components/ui/button/Button.vue";
import {useNavigationStore} from "~/stores/navigation";

const route = useRoute()
const navStore = useNavigationStore()

// Access the store constant directly
const sortedNavGroups = computed(() => navStore.sortedNavGroups)

// --- Tracking Logic (Desktop) ---
const itemRefs = ref<Record<string, HTMLElement>>({})
const indicatorStyle = ref<Record<string, string>>({})

const setIndicator = (groupTitle: string, el: HTMLElement | null) => {
  if (!el) {
    indicatorStyle.value[groupTitle] = `opacity: 0;`
    return
  }
  const top = el.offsetTop + (el.offsetHeight / 2) - 8
  indicatorStyle.value[groupTitle] = `
    transform: translateY(${top}px);
    opacity: 1;
    height: 16px;
  `
}

const handleHover = (groupTitle: string, path: string) => {
  const el = itemRefs.value[`${groupTitle}-${path}`]
  if (el) setIndicator(groupTitle, el)
}

const handleLeave = (groupTitle: string, items: any[]) => {
  const activeItem = items.find(i => i.to === route.path)
  if (activeItem) {
    const el = itemRefs.value[`${groupTitle}-${activeItem.to}`]
    setIndicator(groupTitle, el)
  } else {
    indicatorStyle.value[groupTitle] = `opacity: 0;`
  }
}

const updateAllIndicators = () => {
  sortedNavGroups.value.forEach(group => {
    handleLeave(group.title, group.items)
  })
}

onMounted(() => {
  nextTick(updateAllIndicators)
})

watch(() => route.path, () => {
  nextTick(updateAllIndicators)
})

// --- Navigation Logic (Prev/Next) ---
const flatNavItems = computed(() => navStore.flatNavItems)

const currentIndex = computed(() => {
  return flatNavItems.value.findIndex(item => item.to === route.path)
})

const prevItem = computed(() => currentIndex.value > 0 ? flatNavItems.value[currentIndex.value - 1] : null)
const nextItem = computed(() => currentIndex.value < flatNavItems.value.length - 1 ? flatNavItems.value[currentIndex.value + 1] : null)

</script>

<template>
  <div
      class="@container/root grid min-h-[100vh] grid-cols-[1fr_--spacing(4)_minmax(0,var(--breakpoint-2xl))_--spacing(4)_1fr] md:grid-cols-[1fr_--spacing(10)_minmax(0,var(--breakpoint-2xl))_--spacing(10)_1fr] grid-rows-[auto_1fr_auto] relative overflow-clip">
    <div class="col-span-full sticky top-0 z-30">
      <div class="z-30">
        <header class="">
          <AppNav :showDoc="false"/>
        </header>
      </div>
    </div>
    <div
        class="col-start-2 row-span-full row-start-2 text-edge border-x border-x-current bg-patterned"></div>
    <div class="col-start-3">
      <div>
        <Divider/>
        <div
            class="sticky top-12 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 screen-line-after">
          <div class="flex h-14 items-center justify-between px-4">
            <Button variant="ghost" size="sm" as-child class="gap-2 text-muted-foreground hover:text-foreground">
              <NuxtLink to="/components">
                <LayoutGrid class="h-4 w-4"/>
                <span class="hidden sm:inline">Components</span>
              </NuxtLink>
            </Button>

            <div class="flex items-center gap-2">
              <Button v-if="prevItem" variant="ghost" size="sm" as-child class="gap-2">
                <NuxtLink :to="prevItem.to">
                  <ArrowLeft class="h-4 w-4"/>
                  <span class="hidden sm:inline">{{ prevItem.label }}</span>
                </NuxtLink>
              </Button>

              <Button v-if="nextItem" variant="ghost" size="sm" as-child class="gap-2">
                <NuxtLink :to="nextItem.to">
                  <span class="hidden sm:inline">{{ nextItem.label }}</span>
                  <ArrowRight class="h-4 w-4"/>
                </NuxtLink>
              </Button>
            </div>
          </div>
        </div>
        <div class="container mx-auto px-4 relative z-1">
          <slot />
        </div>
      </div>
    </div>
    <AppFooter />
    <div
        class="col-start-4 row-span-full row-start-2 text-edge border-x border-x-current bg-patterned"></div>
  </div>
</template>



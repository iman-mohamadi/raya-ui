<script setup lang="ts">
import { ref } from 'vue'
import AppNav from '~/components/app/AppNav.vue'
import ThemeSwitcher from '~/components/app/ThemeSwitcher.vue'

const isExpanded = ref(false)
const showCode = ref(false)
const isSidebarOpen = ref(false)
const showSettings = ref(false)

const previewKey = ref(0)
const refreshPreview = () => {
  previewKey.value++
}
</script>

<template>
  <div class="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">

    <!-- HOVER SIDEBAR OVERLAY -->
    <div
        class="fixed top-0 left-0 w-8 h-full z-190 hidden lg:block"
        @mouseenter="isSidebarOpen = true"
    ></div>

    <!-- The Sliding Sidebar -->
    <aside
        class="fixed top-0 left-0 h-full w-65 lg:w-72 z-999 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        @mouseleave="isSidebarOpen = false"
    >
      <div class="isolate pointer-events-none absolute inset-0 z-0 w-full h-full">
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 0%, black 25%, black 50%, transparent 75%); backdrop-filter: blur(4px);"></div>
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 25%, black 50%, black 75%, transparent 100%); backdrop-filter: blur(10px);"></div>
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 50%, black 75%, black 100%); backdrop-filter: blur(26px);"></div>
        <div class="absolute inset-0" style="mask-image: linear-gradient(to left, transparent 75%, black 100%); backdrop-filter: blur(40px);"></div>
      </div>
      <AppNav />
    </aside>

    <!-- Mobile Overlay Backdrop -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm lg:hidden"></div>

    <!-- MAIN CONTENT ENGINE -->
    <main class="flex-1 flex flex-col relative min-w-0 w-full z-0">
      <div class="relative flex flex-col lg:flex-row h-[calc(100vh)] overflow-hidden w-full bg-transparent">

        <!-- Top Header & Breadcrumb -->
        <div :class="isSidebarOpen ? 'z-[1000]' : 'z-[60]'" class="absolute top-0 left-0 right-0 h-12 flex items-center pointer-events-none select-none w-1/2">
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-50 bg-transparent" style="height: 106px; width: 100%; top: 0px; left: 0px; mask-image: linear-gradient(black 50%, transparent 100%); backdrop-filter: blur(4px);"></div>

          <div class="relative flex items-center z-[150] gap-3 pt-6 px-6 pointer-events-auto">
            <button @click="isSidebarOpen = true" class="inline-flex shrink-0 items-center justify-center gap-2 text-sm font-medium transition-all text-muted-foreground hover:bg-background hover:text-foreground size-8 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="size-5">
                <path d="M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.2288 21 5.3431 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z" fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M10 5.5 C10 4.793 10 4.439 9.780 4.220 C9.560 4 9.207 4 8.5 4 H8.5 C6.379 4 5.318 4 4.659 4.659 C4 5.318 4 6.379 4 8.5 V15.5 C4 17.621 4 18.682 4.659 19.341 C5.318 20 6.379 20 8.5 20 H8.5 C9.207 20 9.561 20 9.780 19.780 C10 19.561 10 19.207 10 18.5 V5.5 Z" class="fill-background"></path>
              </svg>
            </button>

            <nav aria-label="breadcrumb">
              <ol class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm sm:gap-2.5">
                <li class="inline-flex items-center gap-1.5">
                  <NuxtLink to="/components" class="hover:text-foreground transition-colors text-sm">Components</NuxtLink>
                </li>
                <li role="presentation" aria-hidden="true" class="[&>svg]:size-3.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
                </li>
                <li class="inline-flex items-center gap-1.5">
                  <slot name="breadcrumb-title">
                    <span class="text-foreground text-sm font-medium">Component</span>
                  </slot>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <!-- Bottom Blur Mask -->
        <div aria-hidden="true" class="pointer-events-none absolute z-50 bottom-0 left-0 w-full bg-gradient-to-t from-background to-transparent" style="height: 92px; mask-image: linear-gradient(to top, black 50%, transparent 100%); backdrop-filter: blur(2px);"></div>

        <!-- LEFT PANE: Documentation Text -->
        <div
            class="order-2 lg:order-1 flex-1 lg:flex-none h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden relative z-10"
            :class="isExpanded ? 'lg:w-0 lg:opacity-0' : 'lg:w-1/2 lg:opacity-100'"
        >
          <div class="w-full lg:w-[50vw] h-full overflow-y-auto min-w-0 overflow-x-hidden pt-6 lg:pt-12 no-scrollbar">
            <div class="w-full flex justify-center">
              <div class="w-full px-4 sm:px-8 md:px-16 max-w-4xl py-8 md:py-14 flex flex-col gap-6 md:gap-10 min-w-0 pb-32">
                <slot />
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANE: Interactive Preview & Code -->
        <div
            class="order-1 lg:order-2 h-[50vh] lg:h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] p-4 pt-20 lg:pt-6 lg:p-6 z-[100] flex flex-col"
            :class="isExpanded ? 'lg:w-full' : 'lg:w-1/2'"
        >
          <div class="flex flex-col h-full z-20">

            <!-- Preview Block -->
            <div class="relative flex-1 min-h-0 flex flex-col rounded-[32px] overflow-hidden bg-pane-background border border-border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">

              <div :key="previewKey" class="relative flex-1 min-h-0 flex overflow-hidden items-center justify-center w-full h-full pb-20">
                <slot name="preview" />
              </div>

              <!-- FLOATING CONTROL PILL -->
              <div class="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                <div
                    class="bg-background border-border shadow-xl border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden rounded-[24px]"
                    :class="showSettings ? 'w-[320px]' : 'w-auto'"
                >
                  <div class="grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" :class="showSettings ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
                    <div class="overflow-hidden w-full">
                      <div class="p-5 border-b border-border w-[320px]">
                        <slot name="settings" />
                      </div>
                    </div>
                  </div>

                  <div class="flex h-[48px] items-center justify-between px-2 w-full shrink-0">
                    <button @click="isExpanded = !isExpanded" class="hidden lg:flex h-9 w-10 cursor-pointer items-center justify-center rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300">
                      <svg v-if="!isExpanded" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M15 3h6v6"></path><path d="m21 3-7 7"></path><path d="m3 21 7-7"></path><path d="M9 21H3v-6"></path></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M9 9L3 3m0 6V3h6m6 12l6 6m0-6v6h-6"/></svg>
                    </button>

                    <button @click="refreshPreview" class="flex h-9 w-10 cursor-pointer items-center justify-center rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </button>

                    <div class="flex items-center justify-center h-9 w-10 text-muted-foreground hover:text-foreground transition-colors">
                      <ThemeSwitcher />
                    </div>

                    <div class="w-px h-5 bg-border mx-0.5"></div>

                    <button
                        v-if="$slots.settings"
                        @click="showSettings = !showSettings"
                        :class="['flex h-9 cursor-pointer items-center justify-center rounded-2xl transition-all duration-300 gap-2', showSettings ? 'px-3 bg-muted text-foreground' : 'w-10 text-muted-foreground hover:bg-muted hover:text-foreground']"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-4.5"><path d="M14 17H5"></path><path d="M19 7h-9"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                      <span v-if="showSettings" class="text-sm font-medium tracking-tight">Settings</span>
                    </button>

                    <button
                        @click="showCode = !showCode"
                        :class="['flex h-9 w-10 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300', showCode ? 'text-success bg-success/10 hover:bg-success/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground']"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" class="size-4.5"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code Block Pane -->
            <div
                aria-hidden="true"
                class="overflow-hidden rounded-2xl flex-shrink-0 bg-background relative transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                :class="showCode ? 'h-[50%] mt-3 opacity-100 border border-border' : 'h-0 mt-0 opacity-0 border-0'"
            >
              <div aria-hidden="true" class="pointer-events-none absolute z-10 w-full bg-gradient-to-b from-background to-transparent" style="height: 76px; top: 0px; left: 0px; mask-image: linear-gradient(black 50%, transparent 100%); backdrop-filter: blur(4px);"></div>
              <div class="flex absolute w-full top-2 z-20 right-0 items-center justify-between gap-2 px-6 h-12 shrink-0">
                <span class="flex-1 truncate text-xs font-mono text-muted-foreground font-medium pl-2">source-code.vue</span>
              </div>
              <div class="flex-1 overflow-auto h-full pt-16 pb-4 px-6 no-scrollbar">
                <slot name="code" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
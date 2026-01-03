<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationStore } from "~/stores/navigation";

// --- Demo Imports ---
import AnimatedBackgroundDemo from "~/components/demo/AnimatedBackgroundDemo.vue";
import AnimatedInputDemo from '@/components/demo/AnimatedInputDemo.vue'
import AnimatedTabsDemo from '@/components/demo/AnimatedTabsDemo.vue'
import BarVisualizerDemo from '@/components/demo/BarVisualizerDemo.vue'
import CodeBlockDemo from '@/components/demo/CodeBlockDemo.vue'
import EncryptedTextDemo from '@/components/demo/EncryptedTextDemo.vue'
import FloatingDockDemo from '@/components/demo/FloatingDockDemo.vue'
import LiquidGlassDemo from '@/components/demo/LiquidGlassDemo.vue'
import MagneticDemo from '@/components/demo/MagneticDemo.vue'
import MorphingTextDemo from '@/components/demo/MorphingTextDemo.vue'
import PixelatedButtonDemo from '@/components/demo/PixelatedButtonDemo.vue'
import RayaButtonDemo from '@/components/demo/RayaButtonDemo.vue'
import TreeDemo from '@/components/demo/TreeDemo.vue'
import WheelPickerDemo from '@/components/demo/WheelPickerDemo.vue'
import FlipClockDemo from '@/components/demo/FlipClockDemo.vue'
import PartitionBarDemo from '@/components/demo/PartitionBarDemo.vue'
import ScrollSpyDemo from '@/components/demo/ScrollSpyDemo.vue'

// --- Background Imports ---
import { AmbientGrid } from '@/components/ui/ambient-grid'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'
import { GravityStars } from '@/components/ui/gravity-stars'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { SnowEffect } from '@/components/ui/snow-effect'

definePageMeta({layout: 'docs'})

const navStore = useNavigationStore()

const groups = computed(() => {
  return navStore.navGroups.filter(g => g.title !== 'Guide')
})

const componentMap: Record<string, any> = {
  'Animated Background': AnimatedBackgroundDemo,
  'Animated Input': AnimatedInputDemo,
  'Animated Tabs': AnimatedTabsDemo,
  'Bar Visualizer': BarVisualizerDemo,
  'Code Block': CodeBlockDemo,
  'Encrypted Text': EncryptedTextDemo,
  'Floating Dock': FloatingDockDemo,
  'Liquid Glass': LiquidGlassDemo,
  'Magnetic': MagneticDemo,
  'Morphing Text': MorphingTextDemo,
  'Pixelated Button': PixelatedButtonDemo,
  'Raya Button': RayaButtonDemo,
  'Tree': TreeDemo,
  'Wheel Picker': WheelPickerDemo,
  'Ambient Grid': AmbientGrid,
  'Background Beams': BackgroundBeams,
  'Dotted Glow': DottedGlowBackground,
  'Gravity Stars': GravityStars,
  'Ripple Effect': BackgroundRippleEffect,
  'Snow Effect': SnowEffect,
  'Flip Clock': FlipClockDemo,
  'Partition Bar': PartitionBarDemo,
  'Scroll Spy': ScrollSpyDemo
}

const getComponent = (label: string) => componentMap[label]
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
          <div class="row-line bg-primary-50/40 aspect-390/200 overflow-hidden relative">

            <component
                v-if="getComponent(item.label)"
                :is="getComponent(item.label)"
                class="w-full h-full"
            />

            <div
                v-else
                class="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-mono"
            >
              <div
                  v-if="item?.img"
                  class="absolute inset-0 bg-contain bg-center bg-no-repeat"
                  :style="`background-image: url('${item?.img}');`"
              ></div>
              <span v-else>Preview</span>
            </div>

          </div>

          <NuxtLink :to="item.to" class="pl-m py-2 row-line before:hidden pb-8 block">
            <p class="text-sm text-foreground first-letter:uppercase font-medium">
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
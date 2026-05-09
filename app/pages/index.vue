<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Copy,
  Check,
  Terminal,
  ArrowRight,
  Layers,
  Code2,
  Sparkles,
  Box, Settings, Lock, Search
} from 'lucide-vue-next'
import DefaulAppNav from '@/components/DefaulAppNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import Marquee from '@/components/ui/marquee/Marquee.vue'
import { GlowingEffect } from '@/components/ui/glowing-effect'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Raya UI | Premium Registry', description: 'Titanium-grade UI primitives for modern engineering.' })

const copied = ref(false)
const copyCommand = async (text: string) => {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

// --- THE ARSENAL DATA ARRAY (Semantic Colors) ---
const arsenalItems = [
  {
    id: '01',
    category: 'Shader',
    title: 'Liquid Glass',
    link: '/docs/components/liquid-glass',
    bgClass: 'bg-card'
  },
  {
    id: '02',
    category: 'Physics',
    title: 'Gravity Stars',
    link: '/docs/backgrounds/gravity-stars',
    bgClass: 'bg-card/80'
  },
  {
    id: '03',
    category: 'Sound',
    title: 'Bar Visualizer',
    link: '/docs/backgrounds/bar-visualizer',
    bgClass: 'bg-card/60'
  },
  {
    id: '04',
    category: 'Interaction',
    title: 'Magnetic',
    link: '/docs/components/magnetic',
    bgClass: 'bg-card/50'
  },
  {
    id: '05',
    category: 'Backgrounds',
    title: 'Background Beams',
    link: '/docs/backgrounds/background-beams',
    bgClass: 'bg-card/40'
  }
]

const gridItems = [
  {
    area: 'md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]',
    icon: Box,
    title: 'Raya UI Core',
    description: "The foundation of modern Vue interfaces, architected by Iman Mohammadi."
  },
  {
    area: 'md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]',
    icon: Settings,
    title: 'Battle Tested',
    description: "Powering complex production environments like Woodcoder.com."
  },
  {
    area: 'md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]',
    icon: Lock,
    title: 'Enterprise Reliability',
    description: "Trusted by industry leaders including Hotelyar.com for mission-critical UIs."
  },
  {
    area: 'md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]',
    icon: Sparkles,
    title: 'Modern Aesthetics',
    description: "Crafted with the latest design trends and OKLCH color spaces."
  },
  {
    area: 'md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]',
    icon: Search,
    title: 'Nuxt 4 Ready',
    description: "Built for the future of the Vue ecosystem with best-in-class performance."
  },
]

// --- MAGNETIC TILT LOGIC ---
const initMagneticCards = () => {
  const cards = document.querySelectorAll('.magnetic-card') as NodeListOf<HTMLElement>
  cards.forEach(card => {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const rotateX = (((e.clientY - rect.top) - (rect.height / 2)) / (rect.height / 2)) * -4
      const rotateY = (((e.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2)) * 4
      gsap.to(card, { rotateX, rotateY, duration: 0.5, ease: 'power2.out', transformPerspective: 1200 })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' })
    })
  })
}

// --- THREE.JS: THEME-ADAPTIVE PARTICLE DUST ---
const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let particlesMesh: THREE.Points
let animationId: number

const initThreeJS = () => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 4000
  const posArray = new Float32Array(particlesCount * 3)

  for(let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 12

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  // Neutral gray works beautifully as ambient dust in both light and dark modes
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.003, color: 0x888888, transparent: true, opacity: 0.4,
  })

  particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  let scrollY = 0
  window.addEventListener('scroll', () => scrollY = window.scrollY, { passive: true })
  const clock = new THREE.Clock()

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()
    particlesMesh.rotation.y = t * 0.015
    particlesMesh.rotation.x = t * 0.01
    particlesMesh.position.y = scrollY * 0.0008
    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

// --- GSAP ANIMATIONS ---
const initGSAP = () => {
  gsap.registerPlugin(ScrollTrigger)

  gsap.fromTo('.hero-load-anim',
      { y: 40, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
  )

  gsap.to('.hero-text', {
    y: -100, opacity: 0, scale: 0.95,
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
  })

  // Fade to full opacity (handles both light/dark theme natively)
  const revealWords = gsap.utils.toArray('.reveal-word')
  gsap.to(revealWords, {
    opacity: 1, stagger: 1,
    scrollTrigger: { trigger: '.statement-section', start: 'top 75%', end: 'bottom 65%', scrub: true }
  })

  // PINNED TERMINAL SECTION
  ScrollTrigger.create({
    trigger: '.dx-section',
    start: 'top 120px',
    end: 'bottom bottom',
    pin: '.terminal-box',
    pinSpacing: false
  })

  const steps = gsap.utils.toArray('.dx-step')
  const termGroups = gsap.utils.toArray('.term-group') as HTMLElement[]

  const showTermGroup = (index: number) => {
    termGroups.forEach((group, i) => {
      gsap.killTweensOf(group)
      const lines = group.querySelectorAll('.term-line')
      gsap.killTweensOf(lines)

      if (i === index) {
        gsap.set(group, { display: 'block', opacity: 1 })
        gsap.fromTo(lines, { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.15, duration: 0.4, ease: 'power2.out' })
      } else {
        gsap.set(group, { display: 'none', opacity: 0 })
      }
    })
  }
  showTermGroup(0)

  steps.forEach((step: any, i) => {
    ScrollTrigger.create({
      trigger: step, start: 'top 50%', end: 'bottom 50%',
      onEnter: () => showTermGroup(i),
      onEnterBack: () => showTermGroup(i),
    })
  })

  // APPLE HORIZONTAL SCROLL FOR ARSENAL
  const track = document.querySelector('.horizontal-track') as HTMLElement
  if (track) {
    const scrollWidth = track.scrollWidth - window.innerWidth + 120
    gsap.to(track, {
      x: -scrollWidth, ease: 'none',
      scrollTrigger: {
        trigger: '.horizontal-section',
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        pin: true,
        scrub: 1
      }
    })
  }
}

onMounted(() => {
  initThreeJS()
  initMagneticCards()
  setTimeout(initGSAP, 100)
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div class="relative bg-background text-foreground selection:bg-primary/30 selection:text-primary font-sans custom-scroll overflow-hidden transition-colors duration-500">

    <DefaulAppNav />

    <canvas ref="canvasRef" class="fixed inset-0 w-full h-full pointer-events-none z-0 transform-gpu will-change-transform"></canvas>

    <div class="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_150%)] pointer-events-none z-0"></div>
    <div class="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-primary/5 blur-3xl rounded-full pointer-events-none z-0"></div>

    <main class="relative z-10 w-full">

      <section class="hero-section h-screen flex flex-col items-center justify-center px-6 relative border-b border-border">
        <div class="hero-text text-center space-y-8 mt-10 w-full max-w-5xl transform-gpu will-change-transform">

          <div class="hero-load-anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mx-auto shadow-sm">
            <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-40"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span></span>
            Vue 3.5 & Nuxt 4 Architecture
          </div>

          <h1 class="hero-load-anim text-[13vw] md:text-[140px] font-bold tracking-[-0.03em] leading-none text-transparent bg-clip-text animate-gradient bg-[linear-gradient(to_right,var(--color-foreground),var(--color-muted-foreground),var(--color-foreground))] pb-2">
            Raya.
          </h1>

          <p class="hero-load-anim text-xl md:text-2xl font-medium text-muted-foreground tracking-tight max-w-2xl mx-auto leading-relaxed">
            A highly disciplined registry of UI primitives. <br class="hidden md:block" /> Built for modern engineering.
          </p>

          <div class="hero-load-anim pt-12 flex justify-center">
            <div class="flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-2xl border border-border shadow-md rounded-full hover:border-foreground/30 hover:shadow-lg transition-all duration-500 cursor-pointer group transform-gpu active:scale-95"
                 @click="copyCommand('npx shadcn-vue@latest add https://raya-ui.com/registry/pixelated-button.json')">
              <div class="flex items-center gap-4">
                <Terminal class="size-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                <code class="font-mono text-xs md:text-sm text-foreground truncate max-w-[200px] md:max-w-none">npx shadcn-vue@latest add https://raya-ui.com/registry/pixelated-button.json</code>
              </div>
              <button class="ml-6 shrink-0 transition-transform duration-300" :class="copied ? 'scale-110' : 'scale-100'">
                <Check v-if="copied" class="size-4 text-success" />
                <Copy v-else class="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <div class="hero-load-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span class="font-mono text-[9px] uppercase tracking-widest text-foreground">Scroll</span>
          <div class="w-[1px] h-10 bg-gradient-to-b from-foreground to-transparent"></div>
        </div>
      </section>

      <div class="py-5 border-b border-border bg-muted/30 backdrop-blur-md">
        <Marquee class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span class="mx-8">Zero NPM Dependencies</span><span class="mx-8">•</span>
          <span class="mx-8">Tailwind Native</span><span class="mx-8">•</span>
          <span class="mx-8">Reka UI Core</span><span class="mx-8">•</span>
          <span class="mx-8">WAI-ARIA Compliant</span><span class="mx-8">•</span>
          <span class="mx-8">GSAP & Three.js Ready</span><span class="mx-8">•</span>
        </Marquee>
      </div>

      <section class="statement-section min-h-[120vh] flex items-center justify-center px-6 md:px-20 max-w-7xl mx-auto py-32">
        <p class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] leading-[1.15] text-foreground text-center max-w-5xl">
          <span class="reveal-word opacity-20 transition-opacity duration-300">Raya</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> bypasses</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> the</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> bloat.</span><br/><br/>
          <span class="reveal-word opacity-20 transition-opacity duration-300">You</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> fetch</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> highly</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> engineered</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> Vue</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> components</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> directly</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> into</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> your</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> codebase.</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> Complete</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> control.</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> Total</span>
          <span class="reveal-word opacity-20 transition-opacity duration-300"> ownership.</span>
        </p>
      </section>

      <section class="dx-section max-w-7xl mx-auto px-6 py-32 relative border-t border-border">
        <div class="flex flex-col lg:flex-row gap-16 relative items-start">

          <div class="w-full lg:w-[45%] z-20">
            <div class="terminal-box bg-card border border-border shadow-xl rounded-[28px] p-8 h-[450px] overflow-hidden relative">
              <div class="flex gap-2 mb-8">
                <div class="size-3 rounded-full bg-border"></div>
                <div class="size-3 rounded-full bg-border"></div>
                <div class="size-3 rounded-full bg-border"></div>
              </div>
              <div class="font-mono text-xs md:text-[13px] text-foreground leading-loose break-all">

                <div class="term-group hidden">
                  <div class="term-line"><span class="text-primary">~/app</span> $ npx shadcn-vue@latest add https://raya-ui.com/registry/pixelated-button.json</div>
                  <div class="term-line text-muted-foreground mt-4 animate-pulse">Fetching registry data...</div>
                </div>

                <div class="term-group hidden">
                  <div class="term-line"><span class="text-success">✔</span> Component configuration mapped.</div>
                  <div class="term-line"><span class="text-success">✔</span> Installing dependencies <span class="text-muted-foreground">(motion-v)</span>...</div>
                  <div class="term-line text-success mt-4">✔ Created components/ui/pixelated-button.vue</div>
                  <div class="term-line text-success">✔ Created components/ui/index.ts</div>
                </div>

                <div class="term-group hidden text-muted-foreground">
                  <div class="term-line"><span class="text-primary">&lt;script setup lang="ts"&gt;</span></div>
                  <div class="term-line">import { PixelatedButton } from '@/components/ui/pixelated-button'</div>
                  <div class="term-line"><span class="text-primary">&lt;/script&gt;</span><br/><br/></div>
                  <div class="term-line"><span class="text-primary">&lt;template&gt;</span></div>
                  <div class="term-line">&nbsp;&nbsp;&lt;<span class="text-foreground">PixelatedButton</span>&gt;</div>
                  <div class="term-line">&nbsp;&nbsp;&nbsp;&nbsp;Initialize Engine</div>
                  <div class="term-line">&nbsp;&nbsp;&lt;/<span class="text-foreground">PixelatedButton</span>&gt;</div>
                  <div class="term-line"><span class="text-primary">&lt;/template&gt;</span></div>
                </div>

              </div>
            </div>
          </div>

          <div class="w-full lg:w-[55%] pb-[20vh] dx-steps-wrapper">
            <div class="dx-step h-[80vh] flex flex-col justify-center space-y-6 pr-4">
              <div class="size-12 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-sm"><Code2 class="size-5 text-foreground" /></div>
              <h3 class="text-3xl md:text-4xl font-bold tracking-tight">CLI Integration.</h3>
              <p class="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">Raya acts as a remote Shadcn registry. A single command pulls the raw, uncompiled component directly into your project structure.</p>
            </div>
            <div class="dx-step h-[80vh] flex flex-col justify-center space-y-6 pr-4">
              <div class="size-12 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-sm"><Layers class="size-5 text-foreground" /></div>
              <h3 class="text-3xl md:text-4xl font-bold tracking-tight">Zero Black Boxes.</h3>
              <p class="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">No hidden `node_modules`. You have absolute freedom to adjust the Tailwind classes, the GSAP logic, and the Reka UI props directly in the Vue file.</p>
            </div>
            <div class="dx-step h-[80vh] flex flex-col justify-center space-y-6 pr-4">
              <div class="size-12 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-sm"><Sparkles class="size-5 text-foreground" /></div>
              <h3 class="text-3xl md:text-4xl font-bold tracking-tight">Immediate Results.</h3>
              <p class="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">Drop it into your template and it works flawlessly on the first render. Accessible, styled, and perfectly animated.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="horizontal-section h-screen bg-muted/10 flex flex-col justify-center overflow-hidden border-y border-border shadow-inner">
        <div class="pl-6 md:pl-24 mb-12 relative z-20">
          <h2 class="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">The Arsenal.</h2>
          <p class="text-xl text-muted-foreground mt-2 font-medium">Complex interactions, simplified.</p>
        </div>

        <div class="horizontal-track flex gap-8 px-6 md:px-24 w-max">

          <NuxtLink v-for="(item, index) in arsenalItems" :key="item.id" :to="item.link"
                    class="magnetic-card w-[85vw] md:w-[600px] h-[500px] shrink-0 rounded-[40px] border border-border p-12 flex flex-col justify-between relative overflow-hidden group hover:border-foreground/30 transition-colors cursor-pointer shadow-lg"
                    :class="item.bgClass">
            <div class="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none"></div>
            <div class="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">
              <div class="flex justify-between items-start">
                <span class="font-mono text-sm text-muted-foreground uppercase tracking-widest">{{ item.category }}</span>
                <ArrowRight class="size-8 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 class="text-6xl md:text-7xl font-bold tracking-[-0.03em]">{{ item.title }}.</h3>
            </div>
          </NuxtLink>

          <div class="w-[10vw] shrink-0"></div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-6 py-40 border-t border-border">
        <div class="text-center mb-24">
          <h2 class="text-5xl md:text-7xl font-bold tracking-tighter">Radically simple.</h2>
          <p class="text-xl text-muted-foreground mt-4 font-medium">Built on Reka UI. Styled with Tailwind.</p>
        </div>

        <ul class="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-3 w-full shrink-0">
          <li
              v-for="(item, index) in gridItems"
              :key="index"
              class="min-h-[14rem] list-none"
              :class="item.area"
          >
            <!-- Note: Background removed from outer div so it doesn't cover the absolute glow layer -->
            <div class="relative h-full rounded-2xl border border-border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                  :glow="true"
                  :disabled="false"
                  :spread="40"
                  :proximity="64"
                  :inactive-zone="0.01"
                  :border-width="3"
              />
              <!-- Solid bg-background on inner div to mask the center and only reveal borders -->
              <div class="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm">
                <div class="relative flex flex-1 flex-col justify-between gap-3">
                  <div class="w-fit rounded-lg border border-border bg-muted/50 p-2">
                    <component :is="item.icon" class="h-4 w-4 text-foreground" />
                  </div>
                  <div class="space-y-3">
                    <h3 class="pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-foreground md:text-2xl/[1.875rem]">
                      {{ item.title }}
                    </h3>
                    <h2 class="font-sans text-sm/[1.125rem] text-muted-foreground md:text-base/[1.375rem]">
                      {{ item.description }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <section class="py-40 flex flex-col items-center justify-center text-center relative border-t border-border bg-muted/10">
        <h2 class="text-6xl md:text-8xl font-bold tracking-tighter mb-10 text-transparent bg-clip-text animate-gradient bg-[linear-gradient(to_right,var(--color-foreground),var(--color-muted-foreground),var(--color-foreground))]">Ready to build?</h2>
        <NuxtLink to="/docs/components/tree">
          <button class="h-16 px-10 bg-foreground text-background text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl will-change-transform transform-gpu">
            Explore Registry
          </button>
        </NuxtLink>
      </section>

    </main>
    <AppFooter />
  </div>
</template>

<style>
/* CSS RESET FOR STICKY + GSAP SCROLLING */
html, body, #__nuxt { overflow-x: visible !important; }

/* CUSTOM SCROLLBAR (Mapped to Theme) */
.custom-scroll::-webkit-scrollbar { width: 8px; }
.custom-scroll::-webkit-scrollbar-track { background: var(--color-background); }
.custom-scroll::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--color-muted-foreground); }

/* GRADIENT TEXT ANIMATION */
@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.animate-gradient { background-size: 200% 200%; animation: gradient 8s ease infinite; }
</style>
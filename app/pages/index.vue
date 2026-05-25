<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ArrowRight, ArrowDownRight, Github, Plus, Minus, CheckCircle2 } from 'lucide-vue-next'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

definePageMeta({ layout: false })
useSeoMeta({
  title: 'Raya UI | Uncompromising Digital Craft',
  description: 'The cinematic, titanium-grade UI component library for ambitious engineering teams.'
})

// --- STATE ---
const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let terrainMesh: THREE.Points
let lenis: Lenis
let mouseX = 0, mouseY = 0
let animationId: number

const loadingProgress = ref(0)
const isLoaded = ref(false)
const activeFeature = ref<number | null>(null)

// --- 1. PRELOADER ---
const initPreloader = () => {
  gsap.to(loadingProgress, {
    value: 100,
    duration: 2,
    ease: 'power3.inOut',
    onUpdate: () => { loadingProgress.value = Math.round(loadingProgress.value) },
    onComplete: () => {
      gsap.to('#preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => { isLoaded.value = true }
      })
      initGSAP()
    }
  })
}

// --- 2. SOTD CUSTOM CURSOR & FOLLOWER ---
const initCursorAndFollower = () => {
  const cursor = document.querySelector('.sotd-cursor') as HTMLElement
  const follower = document.querySelector('.hover-follower-preview') as HTMLElement

  let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2
  let followerX = window.innerWidth / 2, followerY = window.innerHeight / 2

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY
  })

  gsap.ticker.add(() => {
    // Cursor Physics (Fast)
    cursorX += (mouseX - cursorX) * 0.2
    cursorY += (mouseY - cursorY) * 0.2
    gsap.set(cursor, { x: cursorX, y: cursorY })

    // Follower Physics (Slightly delayed, springy)
    followerX += (mouseX - followerX) * 0.08
    followerY += (mouseY - followerY) * 0.08

    // Tilt the phone based on velocity/position
    const tiltX = ((followerY - mouseY) * 0.05)
    const tiltY = ((mouseX - followerX) * 0.05)

    gsap.set(follower, {
      x: followerX,
      y: followerY,
      rotateX: tiltX,
      rotateY: tiltY
    })
  })

  // Cursor interactions
  document.querySelectorAll('a, button, .hover-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 4, duration: 0.4, ease: 'expo.out', mixBlendMode: 'difference' }))
    el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.4, ease: 'expo.out', mixBlendMode: 'difference' }))
  })

  // Magic Follower Triggers (Made In Evolve style)
  const features = document.querySelectorAll('.feature-row')
  features.forEach((el, index) => {
    el.addEventListener('mouseenter', () => {
      activeFeature.value = index
      gsap.to(follower, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' })
      gsap.to(cursor, { opacity: 0, duration: 0.2 }) // Hide dot when phone shows
    })
    el.addEventListener('mouseleave', () => {
      activeFeature.value = null
      gsap.to(follower, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' })
      gsap.to(cursor, { opacity: 1, duration: 0.2 })
    })
  })
}

// --- 3. THREE.JS SPATIAL TOPOGRAPHY ---
const initThreeJS = () => {
  if (!canvasRef.value) return
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 2, 8)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const geometry = new THREE.PlaneGeometry(40, 40, 90, 90)
  const material = new THREE.PointsMaterial({
    size: 0.025, color: 0x8892b0, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending
  })
  terrainMesh = new THREE.Points(geometry, material)
  terrainMesh.rotation.x = -Math.PI / 2
  terrainMesh.position.y = -2
  scene.add(terrainMesh)

  const clock = new THREE.Clock()
  let scrollY = 0
  window.addEventListener('scroll', () => scrollY = window.scrollY, { passive: true })

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime() * 0.4

    const pos = geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      // Complex wave math
      const z = Math.sin(x * 0.3 + t) * Math.cos(y * 0.3 + t) * 1.2
      pos.setZ(i, z)
    }
    pos.needsUpdate = true

    // Parallax
    camera.position.x += ((mouseX / window.innerWidth - 0.5) * 4 - camera.position.x) * 0.02
    camera.position.y += (2 + (mouseY / window.innerHeight - 0.5) * -2 + (scrollY * 0.001) - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
  }
  animate()
}

// --- 4. STRICT LENIS ---
const initLenis = () => {
  gsap.registerPlugin(ScrollTrigger)
  gsap.ticker.lagSmoothing(0)

  lenis = new Lenis({
    duration: 1.2, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.5,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

// --- 5. CHOREOGRAPHY ---
const initGSAP = () => {

  // A. HERO EDITORIAL REVEAL (The "Old One" brought back to glory)
  const heroTl = gsap.timeline()
  heroTl.fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' })
      .fromTo('.hero-line', { y: '120%', rotateX: -40, opacity: 0 }, { y: '0%', rotateX: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: 'expo.out' }, "-=0.8")
      .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out' }, "-=1")

  // Shrink hero on scroll
  gsap.to('.hero-content', { y: 150, opacity: 0, scale: 0.95, filter: 'blur(10px)', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })

  // LOGO MORPH
  gsap.fromTo('.dynamic-logo',
      { top: '45%', left: '50%', xPercent: -50, yPercent: -50, fontSize: '25vw', fontWeight: 900, color: '#ffffff' },
      { top: '32px', left: '40px', xPercent: 0, yPercent: 0, fontSize: '24px', fontWeight: 700, color: '#ffffff', ease: 'power3.out', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } }
  )

  // B. PARALLAX
  document.querySelectorAll('[data-speed]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed') || '0.5')
    gsap.to(el, { y: () => -100 * speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
  })

  // C. THE MASSIVE BRUTALIST SCROLL (Ashley Brooke Inspiration)
  const brutalTl = gsap.timeline({ scrollTrigger: { trigger: '#brutalist-section', start: 'top top', end: '+=2000', pin: true, scrub: 1 } })
  brutALTextSplits.forEach((line, i) => {
    brutalTl.fromTo(line, { opacity: 0.1, y: 50, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 })
        .to(line, { scale: 1.1, opacity: i === brutALTextSplits.length - 1 ? 1 : 0.3, duration: 1 })
  })

  // D. THE COMPARE STACK (Oryzo/Evolve Split Sticky)
  ScrollTrigger.create({
    trigger: '#compare-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.compare-left-sticky',
  })

  // E. HORIZONTAL SCROLL
  const track = document.querySelector('.horizontal-track') as HTMLElement
  if (track) {
    const scrollWidth = track.scrollWidth - window.innerWidth + 200
    gsap.to(track, { x: -scrollWidth, ease: 'none', scrollTrigger: { trigger: '#horizontal-wrapper', start: 'top top', end: () => `+=${scrollWidth}`, pin: true, scrub: 1 } })
  }

  // F. FOOTER CURTAIN
  gsap.fromTo('.footer-inner', { yPercent: -50 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } })

  // DOCK REVEAL
  gsap.fromTo('.bottom-dock', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#hero', start: '40% top', toggleActions: 'play none none reverse' } })
}

let brutALTextSplits: Element[] = []

onMounted(() => {
  initCursorAndFollower()
  initLenis()
  initThreeJS()

  // Setup elements for Brutalist Scroll
  brutALTextSplits = Array.from(document.querySelectorAll('.brutal-line'))

  initPreloader()
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  lenis?.destroy()
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div id="preloader" class="fixed inset-0 bg-[#020202] z-[999] flex flex-col items-center justify-center">
    <div class="text-[12vw] font-black tracking-tighter text-white leading-none mix-blend-difference">{{ loadingProgress }}</div>
    <div class="text-white/40 font-mono uppercase tracking-[0.4em] text-[10px] mt-6">Initializing Architecture</div>
  </div>

  <div class="sotd-cursor hidden md:flex fixed top-0 left-0 size-3 bg-white rounded-full pointer-events-none z-[110] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"></div>

  <div class="hover-follower-preview hidden lg:flex fixed top-0 left-0 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-75 perspective-1000">
    <div class="w-[320px] h-[680px] rounded-[50px] border-[12px] border-[#1f1f1f] bg-black shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ring-1 ring-white/20 transform-gpu">
      <div class="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-50 shadow-[inset_0_-2px_10px_rgba(255,255,255,0.15)]"></div>

      <div class="flex-1 w-full bg-[#050505] p-6 pt-24 relative flex flex-col gap-4">
        <div class="text-[10px] font-mono text-[#C3FF00] uppercase tracking-widest mb-4">Live Render</div>

        <div class="absolute inset-0 p-6 pt-24 flex flex-col gap-4 transition-opacity duration-300" :class="activeFeature === 0 ? 'opacity-100' : 'opacity-0'">
          <div class="w-full bg-[#111] rounded-2xl p-6 border border-white/5 animate-pulse">
            <div class="w-full h-4 bg-white/10 rounded mb-2"></div>
            <div class="w-2/3 h-4 bg-white/10 rounded"></div>
          </div>
          <div class="w-full bg-[#111] rounded-2xl p-6 border border-white/5 animate-pulse delay-75">
            <div class="w-3/4 h-4 bg-white/10 rounded mb-2"></div>
            <div class="w-1/2 h-4 bg-white/10 rounded"></div>
          </div>
        </div>

        <div class="absolute inset-0 p-6 pt-24 flex flex-col justify-center items-center transition-opacity duration-300" :class="activeFeature === 1 ? 'opacity-100' : 'opacity-0'">
          <div class="size-32 rounded-full border border-[#C3FF00]/50 flex items-center justify-center relative">
            <div class="absolute inset-0 bg-[#C3FF00]/10 rounded-full animate-ping"></div>
            <div class="size-16 rounded-full bg-[#C3FF00] shadow-[0_0_40px_rgba(195,255,0,0.5)]"></div>
          </div>
        </div>

        <div class="absolute inset-0 p-6 pt-24 flex flex-col gap-4 transition-opacity duration-300" :class="activeFeature === 2 ? 'opacity-100' : 'opacity-0'">
          <div class="w-full bg-white text-black p-4 rounded-xl flex justify-between items-center ring-2 ring-[#C3FF00] ring-offset-2 ring-offset-black">
            <span class="font-bold">Focused Element</span>
            <CheckCircle2 class="size-5 text-black" />
          </div>
          <div class="w-full bg-[#111] text-white/50 p-4 rounded-xl flex justify-between items-center border border-white/10">
            <span>Standard Element</span>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="fixed inset-0 z-[110] pointer-events-none opacity-[0.04] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

  <div class="dynamic-logo fixed z-[90] pointer-events-none mix-blend-difference tracking-tighter select-none">RAYA</div>

  <nav class="bottom-dock fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-6 px-8 py-4 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] mix-blend-difference opacity-0">
    <NuxtLink to="/docs/components/tree" class="hover-trigger text-[11px] uppercase tracking-[0.2em] font-bold text-white hover:text-[#C3FF00] transition-colors">Registry</NuxtLink>
    <div class="size-1 rounded-full bg-white/20"></div>
    <NuxtLink to="/docs/introduction" class="hover-trigger text-[11px] uppercase tracking-[0.2em] font-bold text-white hover:text-[#C3FF00] transition-colors">Docs</NuxtLink>
    <div class="size-1 rounded-full bg-white/20"></div>
    <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="hover-trigger text-[11px] uppercase tracking-[0.2em] font-bold text-white hover:text-[#C3FF00] transition-colors flex items-center gap-2"><Github class="size-3"/> GitHub</a>
  </nav>

  <div class="relative bg-transparent text-white font-sans overflow-hidden cursor-none">

    <canvas ref="canvasRef" class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>

    <main class="relative z-10 bg-transparent shadow-[0_40px_100px_rgba(0,0,0,1)] rounded-b-[40px] md:rounded-b-[80px] mb-[100vh]">

      <section id="hero" class="h-[100svh] w-full relative flex flex-col items-center justify-center px-6 border-b border-white/5 bg-transparent">
        <div class="hero-content flex flex-col items-center text-center max-w-7xl z-10 perspective-1000 mt-20">

          <div class="hero-badge flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md text-[10px] font-mono tracking-[0.2em] uppercase text-white/60 mb-12 shadow-2xl">
            <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3FF00] opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-[#C3FF00]"></span></span>
            The Modern Vue OS
          </div>

          <h1 class="text-[12vw] md:text-[9vw] font-bold tracking-[-0.04em] leading-[0.85] uppercase flex flex-col items-center select-none">
            <div class="overflow-hidden pb-2"><div class="hero-line origin-bottom text-white">Design Interfaces</div></div>
            <div class="overflow-hidden pb-4 flex items-center gap-4 md:gap-8">
              <div class="hero-line origin-bottom text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/30">That feel</div>
              <div class="hero-line origin-bottom font-serif italic text-[#C3FF00] lowercase tracking-normal -mt-2">alive.</div>
            </div>
          </h1>

          <p class="hero-desc mt-12 text-lg md:text-2xl font-medium text-white/40 tracking-tight max-w-2xl leading-relaxed">
            Highly disciplined primitives. Fluid motion logic.<br class="hidden md:block"/> Built for developers who refuse to compromise on craft.
          </p>
        </div>
      </section>

      <div class="bg-[#030303] relative z-10 border-t border-white/5">

        <section id="brutalist-section" class="h-screen w-full relative overflow-hidden flex flex-col justify-center px-6 md:px-20 border-b border-white/5 bg-[#030303] z-20">
          <div class="max-w-7xl w-full mx-auto">
            <h2 class="text-[6vw] md:text-[5vw] font-black tracking-tighter uppercase leading-[0.9] text-white">
              <div class="brutal-line">We take pride in</div>
              <div class="brutal-line text-white/40">challenging norms,</div>
              <div class="brutal-line">building primitives that</div>
              <div class="brutal-line text-[#C3FF00] font-serif italic lowercase tracking-normal">refuse to behave.</div>
            </h2>
          </div>
        </section>

        <section class="py-32 px-6 max-w-7xl mx-auto border-b border-white/5 relative z-20">
          <div class="mb-20">
            <div class="text-[#C3FF00] font-mono text-xs uppercase tracking-widest mb-4">( The Architecture )</div>
            <h2 class="text-5xl md:text-7xl font-bold tracking-tighter uppercase">Premium <br> <span class="font-serif italic text-white/40 lowercase tracking-normal">primitives.</span></h2>
          </div>

          <div class="flex flex-col border-t border-white/10">

            <div class="feature-row group border-b border-white/10 py-10 flex flex-col md:flex-row md:items-center justify-between hover-trigger cursor-none">
              <div class="flex items-center gap-8">
                <span class="font-mono text-sm text-white/40 group-hover:text-[#C3FF00] transition-colors">( 01 )</span>
                <h3 class="text-3xl md:text-5xl font-bold tracking-tighter uppercase group-hover:translate-x-4 transition-transform duration-500">Component Scanning</h3>
              </div>
              <div class="mt-4 md:mt-0 max-w-sm text-white/40 font-medium text-sm md:text-base leading-relaxed md:text-right group-hover:text-white/80 transition-colors">
                No bloated lock-ins. We rely on Nuxt's automated local bundling logic.
              </div>
            </div>

            <div class="feature-row group border-b border-white/10 py-10 flex flex-col md:flex-row md:items-center justify-between hover-trigger cursor-none">
              <div class="flex items-center gap-8">
                <span class="font-mono text-sm text-white/40 group-hover:text-[#C3FF00] transition-colors">( 02 )</span>
                <h3 class="text-3xl md:text-5xl font-bold tracking-tighter uppercase group-hover:translate-x-4 transition-transform duration-500">Spatial Physics</h3>
              </div>
              <div class="mt-4 md:mt-0 max-w-sm text-white/40 font-medium text-sm md:text-base leading-relaxed md:text-right group-hover:text-white/80 transition-colors">
                Deep integration with GSAP for organic, velocity-based hardware motion.
              </div>
            </div>

            <div class="feature-row group border-b border-white/10 py-10 flex flex-col md:flex-row md:items-center justify-between hover-trigger cursor-none">
              <div class="flex items-center gap-8">
                <span class="font-mono text-sm text-white/40 group-hover:text-[#C3FF00] transition-colors">( 03 )</span>
                <h3 class="text-3xl md:text-5xl font-bold tracking-tighter uppercase group-hover:translate-x-4 transition-transform duration-500">WAI-ARIA Core</h3>
              </div>
              <div class="mt-4 md:mt-0 max-w-sm text-white/40 font-medium text-sm md:text-base leading-relaxed md:text-right group-hover:text-white/80 transition-colors">
                Uncompromising accessibility standards powered underneath by Reka UI.
              </div>
            </div>

          </div>
        </section>

        <section id="compare-wrapper" class="min-h-[150vh] relative bg-[#030303] border-b border-white/5">
          <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 relative h-full">

            <div class="compare-left-sticky hidden lg:flex flex-col justify-center h-screen p-12 lg:pr-24 border-r border-white/10">
              <h5 class="text-[#C3FF00] font-mono text-xs uppercase tracking-widest mb-6">( The Alternative )</h5>
              <h2 class="text-6xl font-black tracking-tighter uppercase text-white/20 mb-8 leading-[0.9]">Traditional <br> Libraries.</h2>
              <ul class="space-y-6 text-white/30 font-medium text-xl">
                <li class="flex items-center gap-4"><div class="w-2 h-px bg-white/20"></div> Bloated `node_modules`</li>
                <li class="flex items-center gap-4"><div class="w-2 h-px bg-white/20"></div> Generic SaaS aesthetics</li>
                <li class="flex items-center gap-4"><div class="w-2 h-px bg-white/20"></div> CSS-only basic transitions</li>
                <li class="flex items-center gap-4"><div class="w-2 h-px bg-white/20"></div> Poor accessibility routing</li>
              </ul>
            </div>

            <div class="flex flex-col py-32 px-6 lg:px-24">
              <div class="lg:hidden mb-20">
                <h5 class="text-[#C3FF00] font-mono text-xs uppercase tracking-widest mb-6">( The Matchup )</h5>
                <h2 class="text-5xl font-black tracking-tighter uppercase text-white mb-8">Compare <br> Stacks.</h2>
              </div>

              <div class="space-y-40">
                <div class="flex flex-col gap-6" data-speed="0.8">
                  <div class="text-[#C3FF00] font-mono text-sm uppercase tracking-widest">Installation</div>
                  <h3 class="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Total Ownership</h3>
                  <p class="text-xl text-white/50 leading-relaxed">Raya acts as a raw registry. You pull components directly into your local directory. You own the code, eliminating black boxes.</p>
                </div>

                <div class="flex flex-col gap-6" data-speed="1.1">
                  <div class="text-[#C3FF00] font-mono text-sm uppercase tracking-widest">Aesthetics</div>
                  <h3 class="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Studio Grade</h3>
                  <p class="text-xl text-white/50 leading-relaxed">Say goodbye to generic dashboards. We implement hardware-accelerated shaders, deep blurs, and liquid glass out of the box.</p>
                </div>

                <div class="flex flex-col gap-6" data-speed="0.9">
                  <div class="text-[#C3FF00] font-mono text-sm uppercase tracking-widest">Motion Logic</div>
                  <h3 class="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Physics First</h3>
                  <p class="text-xl text-white/50 leading-relaxed">Powered by GSAP and Framer Motion for Vue. Elements don't just fade; they react organically to spatial intent and velocity.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section id="horizontal-wrapper" class="h-screen bg-[#050505] flex flex-col justify-center overflow-hidden border-b border-white/5 relative z-10">
          <div class="pl-6 md:pl-20 mb-16 relative z-20 max-w-4xl">
            <h2 class="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9]">
              Engineered for <br/> <span class="font-serif italic text-white/40 font-normal lowercase tracking-normal">immersion.</span>
            </h2>
          </div>

          <div class="horizontal-track flex gap-10 px-6 md:px-20 w-max perspective-1000">
            <div v-for="i in 4" :key="i" class="w-[85vw] md:w-[700px] h-[550px] shrink-0 rounded-[40px] border border-white/10 bg-[#0a0a0a] flex flex-col justify-between relative overflow-hidden group hover-trigger cursor-none p-12 transform-gpu">

              <div class="absolute inset-0 bg-[#C3FF00] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-expo z-0"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 group-hover:opacity-0 transition-opacity duration-500"></div>

              <div class="relative z-20 flex justify-between items-start text-white group-hover:text-black transition-colors duration-500">
                <span class="font-mono text-[12px] uppercase tracking-[0.2em] border border-current rounded-full px-4 py-2">Layout Concept 0{{i}}</span>
                <ArrowRight class="size-8 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
              </div>

              <div class="relative z-20 text-white group-hover:text-black transition-colors duration-500">
                <h3 class="text-5xl font-black uppercase tracking-tighter mb-4">Cinematic Dashboards</h3>
                <p class="font-medium text-base opacity-50 max-w-md">Combining raw Nuxt performance with WebGL aesthetics to create software that feels like a physical experience.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <footer class="relative z-0 bg-[#000000] overflow-hidden">
      <div class="footer-inner h-screen w-full flex flex-col justify-between py-12 px-6 md:px-20">

        <div class="flex flex-col lg:flex-row justify-between items-start mt-20 w-full max-w-7xl mx-auto">
          <div class="max-w-2xl">
            <div class="text-[#C3FF00] font-mono text-xs uppercase tracking-widest mb-6">( Initialize Engine )</div>
            <h3 class="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase">
              Build <br> <span class="font-serif italic text-white/40 font-normal lowercase tracking-normal">different.</span>
            </h3>
          </div>

          <div class="flex flex-col sm:flex-row gap-16 mt-16 lg:mt-0 font-mono text-sm uppercase tracking-widest">
            <div class="flex flex-col gap-6">
              <span class="text-white/30">Architecture</span>
              <NuxtLink to="/docs/components/tree" class="text-white hover:text-[#C3FF00] transition-colors hover-trigger">Registry</NuxtLink>
              <NuxtLink to="/docs/introduction" class="text-white hover:text-[#C3FF00] transition-colors hover-trigger">Documentation</NuxtLink>
            </div>
            <div class="flex flex-col gap-6">
              <span class="text-white/30">Network</span>
              <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="text-white hover:text-[#C3FF00] transition-colors hover-trigger flex items-center gap-3"><Github class="size-4"/> GitHub</a>
              <a href="#" class="text-white hover:text-[#C3FF00] transition-colors hover-trigger">Twitter / X</a>
            </div>
          </div>
        </div>

        <div class="w-full text-center relative mt-auto pt-12">
          <h1 class="text-[18vw] font-black tracking-tighter leading-none text-white opacity-[0.02] uppercase select-none pointer-events-none">
            RAYA UI
          </h1>
          <div class="absolute bottom-4 left-0 w-full flex flex-col md:flex-row justify-between text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/30 px-6 md:px-20">
            <span>© 2026 Architected by Iman Mohammadi</span>
            <span class="mt-2 md:mt-0 text-[#C3FF00]/50">Titanium Grade Open Source</span>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style>
/* SOTD RESET */
html, body, #__nuxt {
  background-color: #030303;
  cursor: none;
}

::-webkit-scrollbar { display: none; }

.perspective-1000 { perspective: 1000px; }

.ease-expo {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeNav from "~/components/landing/HomeNav.vue";
import WireframeThumbnail from "~/components/WireframeThumbnail.vue";

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Raya UI — The Architecture of Systems',
  description: 'Beautifully engineered, high-end components built with Vue & Nuxt. Copy the code. Own the architecture.',
  ogImage: 'https://raya-ui.com/og-image.png',
})

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// REFS
// ─────────────────────────────────────────────────────────────────────────────
const cursorRef = ref<HTMLDivElement | null>(null)
const cursorDotRef = ref<HTMLDivElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// Preloader Refs
const preloaderRef = ref<HTMLElement | null>(null)
const preloaderTop = ref<HTMLElement | null>(null)
const preloaderBottom = ref<HTMLElement | null>(null)
const loadPercent = ref(0)
const isLoaded = ref(false)

let lenis: Lenis | null = null
let raf: ((time: number) => void) | null = null
let animFrame: number | null = null
let particles: Particle[] = []

// Particle system
class Particle {
  x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string;
  constructor(w: number, h: number) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.8 // Increased speed slightly
    this.vy = (Math.random() - 0.5) * 0.8
    this.size = Math.random() * 1.5 + 0.5
    this.opacity = Math.random() * 0.6 + 0.2
    this.color = Math.random() > 0.85 ? '#FF4A00' : '#ffffff'
  }
  update(w: number, h: number, mx: number, my: number) {
    const dx = mx - this.x
    const dy = my - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    // Magnetic repel from mouse
    if (dist < 150) {
      const force = (150 - dist) / 150 * 0.02
      this.vx -= dx * force
      this.vy -= dy * force
    }
    // Fluid drag
    this.vx *= 0.98
    this.vy *= 0.98
    this.x += this.vx
    this.y += this.vy

    // Wrap around screen
    if (this.x < 0) this.x = w
    if (this.x > w) this.x = 0
    if (this.y < 0) this.y = h
    if (this.y > h) this.y = 0
  }
}

let mouseX = -1000
let mouseY = -1000

// ─────────────────────────────────────────────────────────────────────────────
// FLUID CANVAS PARTICLE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150)
    particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height))
  }
  resize()
  window.addEventListener('resize', resize)

  const draw = () => {
    if (!canvas || !ctx) return

    // AWARD WINNING TRICK: Use rgba clear for light trails instead of hard clearRect
    ctx.fillStyle = 'rgba(4, 4, 4, 0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 110) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 110) * 0.08})`
          ctx.lineWidth = 0.8
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.update(canvas.width, canvas.height, mouseX, mouseY)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color === '#FF4A00'
          ? `rgba(255,74,0,${p.opacity})`
          : `rgba(255,255,255,${p.opacity})`
      ctx.fill()
    })

    animFrame = requestAnimationFrame(draw)
  }
  draw()
}

// ─────────────────────────────────────────────────────────────────────────────
// SOTD PRELOADER SEQUENCE
// ─────────────────────────────────────────────────────────────────────────────
const runPreloader = () => {
  // Lock scroll immediately
  if (lenis) lenis.stop()

  const tl = gsap.timeline({
    onComplete: () => {
      isLoaded.value = true
      if (lenis) lenis.start() // Unlock scroll
      initMotion() // Start normal page animations
    }
  })

  // 1. Simulate data fetching / system boot
  tl.to({ val: 0 }, {
    val: 100,
    duration: 2.5,
    ease: 'power3.inOut',
    onUpdate: function() {
      loadPercent.value = Math.floor(this.targets()[0].val)
    }
  })

  // 2. Glitch out text
  tl.to('.preloader-text', { opacity: 0, scale: 1.1, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' })

  // 3. Physically split the screen apart
  tl.to(preloaderTop.value, { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, 'split')
  tl.to(preloaderBottom.value, { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, 'split')

  // 4. Hero content flies in from the void
  tl.fromTo('.raya-logo-text',
      { scale: 0.8, opacity: 0, filter: 'blur(20px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }, 'split+=0.4')

  tl.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 'split+=0.8')
  tl.fromTo('.hero-meta-content', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, 'split+=0.9')
}


// ─────────────────────────────────────────────────────────────────────────────
// GSAP SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────
const initMotion = () => {
  ScrollTrigger.getAll().forEach(t => t.kill())

  // NAV shrink on scroll
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onEnter: () => gsap.to(navRef.value, { backdropFilter: 'blur(32px)', backgroundColor: 'rgba(4,4,4,0.7)', duration: 0.5 }),
    onLeaveBack: () => gsap.to(navRef.value, { backdropFilter: 'blur(16px)', backgroundColor: 'rgba(4,4,4,0.2)', duration: 0.5 }),
  })

  // RAYA word logo: fixed centered → shrinks to nav
  gsap.set('.raya-logo-text', {
    position: 'fixed',
    top: '50%',
    left: '50%',
    xPercent: -50,
    yPercent: -50,
    scale: 1,
    transformOrigin: 'center center',
    willChange: 'transform',
  })

  gsap.to('.raya-logo-text', {
    scale: 0.10,
    top: '0%',
    left: '0%',
    xPercent: -30,
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      invalidateOnRefresh: true,
    }
  })

  // Hero subtitles fade on scroll
  gsap.to('.hero-meta-content', {
    opacity: 0,
    y: -40,
    filter: 'blur(10px)',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: '60% top',
      scrub: true,
    }
  })

  // 3D KINETIC TYPOGRAPHY (Manifesto)
  const manifestoLines = gsap.utils.toArray('.manifesto-line')
  gsap.set(manifestoLines, { transformPerspective: 800, transformOrigin: '50% 100%' })

  const manifestoTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#manifesto',
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  })
  manifestoTl
      .fromTo(manifestoLines,
          { y: 80, opacity: 0, rotationX: -60, filter: 'blur(10px)' },
          { y: 0, opacity: 1, rotationX: 0, filter: 'blur(0px)', stagger: 0.2, ease: 'power3.out' }
      )
      .to(manifestoLines.slice(0, -1), { opacity: 0.12, stagger: 0.15, ease: 'none' }, '+=0.4')

  // FEATURES cards stagger reveal
  gsap.utils.toArray('.feature-card').forEach((card: any, i) => {
    gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
    )
  })

  // SWAP panels (three full-screen overlays)
  const panels = gsap.utils.toArray('.swap-panel')
  if (panels.length >= 3) {
    const swapTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#swap-section',
        start: 'top top',
        end: '+=250%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    })
    swapTl
        .fromTo(panels[1], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
        .fromTo(panels[2], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
  }

  // MARQUEE scroll parallax + velocity skew
  gsap.to('.marquee-track', {
    xPercent: -35,
    ease: 'none',
    scrollTrigger: {
      trigger: '.marquee-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
    }
  })
  const proxy = { skew: 0 }
  const skewSetter = gsap.quickSetter('.marquee-text', 'skewX', 'deg')
  const clamp = gsap.utils.clamp(-20, 20)
  ScrollTrigger.create({
    onUpdate: (self) => {
      const skew = clamp(self.getVelocity() / -180)
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew
        gsap.to(proxy, { skew: 0, duration: 0.8, ease: 'power3.out', overwrite: true, onUpdate: () => skewSetter(proxy.skew) })
      }
    }
  })

  // HORIZONTAL component showcase
  const hTrack = document.querySelector('.h-track') as HTMLElement
  if (hTrack) {
    const dist = hTrack.scrollWidth - window.innerWidth + 200
    gsap.to(hTrack, {
      x: -dist,
      ease: 'none',
      scrollTrigger: {
        trigger: '#horizontal-worlds',
        start: 'top top',
        end: `+=${dist}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    })
  }

  // SVG path draw-in for blueprint lines
  gsap.utils.toArray('.bp-line').forEach((el: any) => {
    const len = el.getTotalLength ? el.getTotalLength() : 200
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
    gsap.to(el, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.blueprint-section') || el,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      }
    })
  })

  requestAnimationFrame(() => ScrollTrigger.refresh())
}

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC BUTTON & HOVER LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const magneticEl = ref<HTMLElement | null>(null)
const onMagneticEnter = (e: MouseEvent) => {
  const el = magneticEl.value
  if (!el) return
  el.addEventListener('mousemove', onMagneticMove)
}
const onMagneticLeave = () => {
  const el = magneticEl.value
  if (!el) return
  el.removeEventListener('mousemove', onMagneticMove)
  gsap.to(el.querySelector('.mag-inner'), { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
}
const onMagneticMove = (e: MouseEvent) => {
  const el = magneticEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  gsap.to(el.querySelector('.mag-inner'), {
    x: (e.clientX - cx) * 0.45,
    y: (e.clientY - cy) * 0.45,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const handleTilt = (e: MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  gsap.to(el, {
    rotationY: x * 14,
    rotationX: -y * 14,
    transformPerspective: 600,
    duration: 0.3,
    ease: 'power2.out'
  })
}
const resetTilt = (el: HTMLElement) => {
  gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
}

// ─────────────────────────────────────────────────────────────────────────────
// MOUNT
// ─────────────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await nextTick()

  // 1. Setup Lenis smooth scroll (keep stopped during preloader)
  lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  raf = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  // 2. Canvas particle system starts in background
  initCanvas()

  // 3. Custom Cursor Logic
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    gsap.to(cursorRef.value, { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power2.out' })
    gsap.to(cursorDotRef.value, { x: e.clientX, y: e.clientY, duration: 0.06 })
  })

  // Cursor hover states
  document.querySelectorAll('a, button, .hover-target').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorRef.value, { scale: 3.5, opacity: 0.15, duration: 0.35 })
      gsap.to(cursorDotRef.value, { scale: 0.5, duration: 0.3 })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(cursorRef.value, { scale: 1, opacity: 1, duration: 0.35 })
      gsap.to(cursorDotRef.value, { scale: 1, duration: 0.3 })
    })
  })

  // 4. Trigger Preloader (which triggers everything else)
  runPreloader()

  window.addEventListener('resize', () => ScrollTrigger.refresh())
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  if (raf) gsap.ticker.remove(raf)
  lenis?.destroy()
  if (animFrame) cancelAnimationFrame(animFrame)
})

// Data arrays
const components = [
  { name: 'Liquid Glass', tag: 'glassmorphism', color: '#4FC3F7' },
  { name: 'Magnetic', tag: 'physics', color: '#FF4A00' },
  { name: 'Morphing Text', tag: 'typography', color: '#B39DDB' },
  { name: 'Bar Visualizer', tag: 'audio-reactive', color: '#81C784' },
  { name: 'Flip Clock', tag: 'mechanical', color: '#FFD54F' },
  { name: 'Gravity Stars', tag: 'particle', color: '#4DD0E1' },
  { name: 'Floating Dock', tag: 'navigation', color: '#FF8A65' },
  { name: 'Glowing Effect', tag: 'ambient', color: '#F48FB1' },
]

const features = [
  { num: '01', title: 'Copy-Paste Architecture', body: 'No black-box npm packages. Take the source, own every line. Zero runtime surprises.', icon: '⌗' },
  { num: '02', title: 'WAI-ARIA Bedrock', body: 'Reka UI primitives underneath. Screen-reader native. Keyboard navigation first.', icon: '◈' },
  { num: '03', title: 'GSAP Motion Engine', body: 'Spring-physics interactions. Scroll-driven narratives. Every interaction alive.', icon: '⟳' },
  { num: '04', title: 'Vue 3.5 Native', body: 'Written from scratch for the latest Vue macros, Nuxt 4 and the Composition API.', icon: '⬡' },
]
</script>

<template>
  <div
      class="bg-[#040404] text-[#FAFAFA] min-h-screen overflow-x-hidden font-sans relative selection:bg-[#FF4A00]/30 selection:text-[#FF4A00]"
      style="cursor: none;"
  >
    <div v-show="!isLoaded" ref="preloaderRef" class="fixed inset-0 z-[9999] pointer-events-none flex flex-col font-mono text-[10px] tracking-[0.4em] uppercase text-white/50">
      <div ref="preloaderTop" class="h-1/2 w-full bg-[#040404] flex items-end justify-center pb-2 border-b border-white/5 relative overflow-hidden">
        <div class="preloader-text absolute bottom-4 flex flex-col items-center gap-2">
          <span class="text-[#FF4A00]">Initializing System</span>
          <div class="w-48 h-px bg-white/10 overflow-hidden rounded-full">
            <div class="h-full bg-[#FF4A00]" :style="`width: ${loadPercent}%`" />
          </div>
        </div>
      </div>
      <div ref="preloaderBottom" class="h-1/2 w-full bg-[#040404] flex items-start justify-center pt-4 relative overflow-hidden">
        <span class="preloader-text">{{ loadPercent }}%</span>
      </div>
    </div>

    <div class="fixed inset-0 grid grid-cols-4 md:grid-cols-12 gap-px px-6 md:px-12 pointer-events-none z-[1]">
      <div v-for="i in 12" :key="i" class="h-full border-r border-white/[0.025] hidden md:block last:border-none" />
      <div v-for="i in 4" :key="'m'+i" class="h-full border-r border-white/[0.03] md:hidden last:border-none" />
    </div>

    <div
        ref="cursorRef"
        class="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/60 z-[9999] pointer-events-none mix-blend-difference"
        style="transform: translate(-50%, -50%)"
    />
    <div
        ref="cursorDotRef"
        class="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white z-[9999] pointer-events-none"
        style="transform: translate(-50%, -50%)"
    />

    <canvas
        ref="canvasRef"
        class="fixed inset-0 z-[2] pointer-events-none opacity-60 mix-blend-screen"
    />

    <HomeNav />

    <div class="fixed inset-0 pointer-events-none z-[120] mix-blend-difference">
      <div class="raya-logo-text absolute text-white select-none">
        <h1
            class="font-black uppercase tracking-tighter leading-none"
            style="font-size: clamp(72px, 18vw, 280px);"
        >
          RAYA
        </h1>
      </div>
    </div>

    <nav class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-6 px-8 py-3.5 rounded-full border border-white/10 bg-[#040404]/50 backdrop-blur-2xl shadow-2xl">
      <NuxtLink
          to="/components"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:text-[#FF4A00] transition-colors duration-300 hover-target"
      >
        Components
      </NuxtLink>
      <div class="w-px h-3 bg-white/20" />
      <NuxtLink
          to="/docs/introduction"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:text-[#FF4A00] transition-colors duration-300 hover-target"
      >
        Docs
      </NuxtLink>
      <div class="w-px h-3 bg-white/20" />
      <a
          href="https://github.com/iman-mohamadi/raya-ui"
          target="_blank"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF4A00] hover:opacity-70 transition-opacity duration-300 hover-target"
      >
        GitHub ↗
      </a>
    </nav>

    <main class="relative z-10">

      <section
          id="hero-section"
          ref="heroRef"
          class="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF4A00]/5 blur-[120px]" />
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/3 blur-[80px]" />
        </div>

        <div class="absolute bottom-[12vh] left-1/2 -translate-x-1/2 text-center w-full z-10 px-6 pointer-events-none">
          <div class="hero-meta-content flex flex-col items-center gap-4 w-full">
            <div class="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-[#FF4A00] animate-pulse" />
              <span class="font-mono text-[9px] tracking-[0.4em] uppercase text-white/60">Vue · Nuxt · Tailwind</span>
            </div>

            <p class="font-serif italic text-white/40 text-lg md:text-2xl font-light">
              user interfaces that breathe
            </p>

            <div
                ref="magneticEl"
                class="mt-4 inline-block hover-target pointer-events-auto"
                @mouseenter="onMagneticEnter"
                @mouseleave="onMagneticLeave"
            >
              <NuxtLink to="/components">
                <div class="mag-inner relative flex items-center gap-3 px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md group hover:border-[#FF4A00]/40 hover:bg-[#FF4A00]/8 transition-all duration-500">
                  <span class="font-mono text-[11px] tracking-[0.3em] uppercase font-semibold text-white">
                    Explore Registry
                  </span>
                  <span class="text-white/40 group-hover:text-[#FF4A00] group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </NuxtLink>
            </div>

            <div class="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mt-2">
              Vue OS · Digital Matter · v1.0.0
            </div>
          </div>
        </div>

        <div class="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-2 opacity-30">
          <div class="w-px h-12 bg-white/60 origin-top" style="animation: scrollLine 2s ease-in-out infinite;" />
          <span class="font-mono text-[8px] tracking-[0.3em] uppercase rotate-90 origin-center">scroll</span>
        </div>
      </section>

      <section id="manifesto" class="relative h-screen flex items-center px-6 md:px-24 bg-[#040404]" style="perspective: 1200px;">
        <div class="absolute top-8 right-12 opacity-10 pointer-events-none">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" stroke="#FF4A00" stroke-width="0.5" stroke-dasharray="4 4"/>
            <line x1="40" y1="0" x2="40" y2="80" stroke="#FF4A00" stroke-width="0.5"/>
            <line x1="0" y1="40" x2="80" y2="40" stroke="#FF4A00" stroke-width="0.5"/>
            <circle cx="40" cy="40" r="4" stroke="#FF4A00" stroke-width="0.5"/>
          </svg>
        </div>

        <div class="max-w-5xl relative z-10">
          <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-[#FF4A00]/80 mb-14 flex items-center gap-4">
            <div class="w-8 h-px bg-[#FF4A00]/40" />
            Philosophy
          </div>

          <div class="space-y-3">
            <div class="manifesto-line text-white font-black uppercase tracking-tighter leading-none" style="font-size: clamp(40px, 6vw, 96px);">
              We refuse
            </div>
            <div class="manifesto-line text-white/20 italic font-light font-serif tracking-tight leading-none" style="font-size: clamp(40px, 6vw, 96px);">
              the mediocre.
            </div>
            <div class="manifesto-line text-white font-black uppercase tracking-tighter leading-none" style="font-size: clamp(40px, 6vw, 96px);">
              Every primitive is
            </div>
            <div class="manifesto-line text-[#FF4A00] font-black uppercase tracking-tighter leading-none" style="font-size: clamp(40px, 6vw, 96px);">
              a deliberate act.
            </div>
          </div>
        </div>
      </section>

      <section id="swap-section" class="relative h-screen overflow-hidden">
        <div class="swap-panel absolute inset-0 bg-[#040404] flex items-center justify-center p-6">
          <div class="text-center max-w-4xl">
            <h2 class="text-[clamp(38px,8vw,120px)] font-black uppercase tracking-tighter leading-none mb-6">
              Copy <span class="font-serif italic text-white/25 lowercase font-light">the</span><br /> Code.
            </h2>
            <p class="text-white/35 font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
              Zero NPM black boxes. Total ownership.
            </p>
          </div>
        </div>

        <div class="swap-panel absolute inset-0 bg-[#F5F5F0] text-[#040404] flex items-center justify-center p-6" style="clip-path: inset(100% 0% 0% 0%)">
          <div class="text-center max-w-4xl relative z-10">
            <h2 class="text-[clamp(38px,8vw,120px)] font-black uppercase tracking-tighter leading-none mb-6">
              Own <span class="font-serif italic text-[#FF4A00] lowercase font-light">the</span> Physics.
            </h2>
            <p class="text-black/35 font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
              GSAP-powered motion architecture.
            </p>
          </div>
        </div>

        <div class="swap-panel absolute inset-0 bg-[#FF4A00] text-black flex items-center justify-center p-6" style="clip-path: inset(100% 0% 0% 0%)">
          <div class="text-center max-w-4xl">
            <h2 class="text-[clamp(38px,8vw,120px)] font-black uppercase tracking-tighter leading-none mb-6">
              Build <span class="font-serif italic text-black/30 lowercase font-light">the</span> Unseen.
            </h2>
            <p class="text-black/50 font-mono text-xs md:text-sm uppercase tracking-[0.2em] font-bold">
              WAI-ARIA bedrock. Screen-reader native.
            </p>
          </div>
        </div>
      </section>

      <section class="relative py-32 px-6 md:px-12 bg-[#040404]">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[#FF4A00]/4 blur-[150px]" />
          <div class="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px]" />
        </div>

        <div class="max-w-7xl mx-auto relative z-10">
          <div class="mb-20">
            <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4 flex items-center gap-4">
              <div class="w-8 h-px bg-white/20" />
              Why Raya
            </div>
            <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
              Engineered<br/>
              <span class="text-[#FF4A00]">differently.</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            <div
                v-for="(feat, i) in features"
                :key="feat.num"
                class="feature-card relative bg-[#040404] p-10 md:p-14 group overflow-hidden hover-target"
                @mousemove="(e) => handleTilt(e, $event.currentTarget as HTMLElement)"
                @mouseleave="(e) => resetTilt($event.currentTarget as HTMLElement)"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-[#FF4A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <span class="font-mono text-[10px] tracking-[0.4em] text-white/15 block mb-6">{{ feat.num }}</span>
              <div class="text-3xl mb-5 text-white/20 group-hover:text-[#FF4A00] transition-colors duration-500">{{ feat.icon }}</div>
              <h3 class="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors">{{ feat.title }}</h3>
              <p class="text-white/40 leading-relaxed text-sm md:text-base">{{ feat.body }}</p>
              <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <div class="w-6 h-6 border border-white/20 rounded-sm flex items-center justify-center">
                  <span class="text-white/40 text-xs">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="marquee-section py-20 bg-[#F5F5F0] text-[#040404] overflow-hidden relative z-20 border-y border-black/8">
        <div class="marquee-track flex whitespace-nowrap font-black uppercase tracking-tighter leading-none select-none" style="font-size: clamp(48px, 8vw, 140px)">
          <span class="marquee-text mx-8 block origin-bottom shrink-0">COPY · PASTE · OWN THE CODE ·&nbsp;</span>
          <span class="marquee-text mx-8 block origin-bottom text-transparent shrink-0" style="-webkit-text-stroke: 1.5px #040404;">COPY · PASTE · OWN THE CODE ·&nbsp;</span>
          <span class="marquee-text mx-8 block origin-bottom text-[#FF4A00] shrink-0">COPY · PASTE · OWN THE CODE ·&nbsp;</span>
          <span class="marquee-text mx-8 block origin-bottom shrink-0">COPY · PASTE · OWN THE CODE ·&nbsp;</span>
        </div>
      </section>

      <section
          id="horizontal-worlds"
          class="relative h-screen bg-[#040404] overflow-hidden flex items-center blueprint-section"
      >
        <div class="absolute top-16 left-6 md:left-12 font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase z-10">
          ( Component Architecture )
        </div>

        <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: linear-gradient(#4FC3F7 1px, transparent 1px), linear-gradient(90deg, #4FC3F7 1px, transparent 1px); background-size: 60px 60px;" />

        <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path class="bp-line" d="M0 200 Q360 100 720 250 T1440 200" stroke="#FF4A00" stroke-width="0.8" fill="none"/>
          <path class="bp-line" d="M0 700 Q360 600 720 650 T1440 700" stroke="#4FC3F7" stroke-width="0.8" fill="none"/>
          <path class="bp-line" d="M200 0 Q300 450 200 900" stroke="#ffffff" stroke-width="0.5" fill="none"/>
        </svg>

        <div class="h-track flex items-center gap-6 px-6 md:px-12 w-max">
          <div class="shrink-0 w-[80vw] md:w-[500px] pr-8">
            <div class="font-mono text-[9px] tracking-[0.4em] uppercase text-[#FF4A00]/70 mb-6 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#FF4A00" stroke-width="0.8" fill="none" stroke-dasharray="2 2"/><circle cx="10" cy="10" r="2" fill="#FF4A00" opacity="0.6"/></svg>
              Inventory
            </div>
            <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white mb-6">
              {{ components.length }}+<br/>
              <span class="text-white/20 font-light font-serif italic normal-case">primitives</span>
            </h2>
            <p class="text-white/40 text-sm leading-relaxed max-w-xs">
              Scroll to explore. Each component is copy-paste ready with full TypeScript support.
            </p>
          </div>

          <div
              v-for="comp in components"
              :key="comp.name"
              class="shrink-0 w-[280px] md:w-[320px] h-[420px] relative overflow-hidden border border-white/8 bg-white/3 backdrop-blur-sm group hover-target"
              style="border-radius: 2px;"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div class="absolute top-0 left-0 right-0 h-px transition-all duration-500 group-hover:h-0.5"
                 :style="`background-color: ${comp.color}; opacity: 0.5;`" />

            <div class="absolute inset-0 p-8 flex flex-col justify-between">
              <div>
                <div class="font-mono text-[9px] tracking-[0.3em] uppercase mb-6"
                     :style="`color: ${comp.color}; opacity: 0.7`">
                  {{ comp.tag }}
                </div>
                <div class="relative h-24 w-full flex items-center justify-start mb-8 opacity-50 group-hover:opacity-100 transition-all duration-500 pointer-events-none transform-gpu group-hover:translate-x-2" :style="`color: ${comp.color}`">
                  <WireframeThumbnail :component="comp.name" />
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {{ comp.name }}
                </h3>
                <NuxtLink
                    :to="`/components`"
                    class="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 group-hover:text-white/70 transition-colors duration-300 hover-target"
                >
                  View source
                  <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="shrink-0 w-[280px] md:w-[320px] h-[420px] flex flex-col items-center justify-center gap-6 border border-dashed border-white/10" style="border-radius: 2px;">
            <div class="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25">That's the registry</div>
            <NuxtLink
                to="/components"
                class="px-6 py-3 border border-white/20 font-mono text-[10px] tracking-[0.2em] uppercase text-white hover:border-[#FF4A00] hover:text-[#FF4A00] transition-all duration-300 hover-target"
            >
              View All →
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="relative py-32 px-6 md:px-12 bg-[#040404] overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-0 left-1/3 w-[800px] h-[800px] rounded-full bg-[#FF4A00]/3 blur-[200px]" />
        </div>

        <div class="max-w-7xl mx-auto relative z-10">
          <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/25 mb-4 flex items-center gap-4">
                <div class="w-8 h-px bg-white/15" />
                Aesthetic System
              </div>
              <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                Glass.<br/>
                <span class="font-serif italic font-light normal-case text-white/30">and beyond.</span>
              </h2>
            </div>
            <p class="text-white/30 text-sm leading-relaxed max-w-sm md:text-right">
              Glassmorphism, depth, and spring physics — not as decoration, but as a visual language that communicates hierarchy.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="feature-card relative h-80 overflow-hidden group border border-white/8" style="border-radius: 2px;">
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div class="absolute inset-0 backdrop-blur-md" />
              <div class="absolute top-8 left-8 w-24 h-24 rounded-full bg-[#FF4A00]/30 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div class="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-blue-500/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-36 h-24 border border-white/15 bg-white/8 backdrop-blur-xl rounded-lg flex items-center justify-center group-hover:border-white/25 transition-all duration-500">
                  <span class="font-mono text-xs text-white/60 tracking-widest uppercase">Liquid Glass</span>
                </div>
              </div>
              <div class="absolute bottom-6 left-6">
                <span class="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">Glassmorphism</span>
              </div>
            </div>

            <div class="feature-card relative h-80 overflow-hidden group border border-white/8 bg-[#0a0a0a]" style="border-radius: 2px;">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="absolute w-40 h-40 rounded-full border border-[#FF4A00]/20 animate-ping" style="animation-duration: 3s;" />
                <div class="absolute w-28 h-28 rounded-full border border-[#FF4A00]/30 animate-ping" style="animation-duration: 2.5s; animation-delay: 0.5s" />
                <div class="absolute w-16 h-16 rounded-full border border-[#FF4A00]/50 animate-ping" style="animation-duration: 2s; animation-delay: 1s" />
                <div class="w-8 h-8 rounded-full bg-[#FF4A00]/80 blur-sm" />
              </div>
              <div class="absolute bottom-6 left-6">
                <span class="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">Spring Physics</span>
              </div>
            </div>

            <div class="feature-card relative h-80 overflow-hidden group border border-white/8 bg-[#050505]" style="border-radius: 2px;">
              <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 20px 20px;" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative">
                  <svg width="120" height="120" viewBox="0 0 120 120" class="opacity-40 group-hover:opacity-70 transition-opacity duration-500">
                    <rect x="20" y="20" width="80" height="80" stroke="white" stroke-width="0.5" fill="none" stroke-dasharray="4 4"/>
                    <circle cx="60" cy="60" r="20" stroke="#FF4A00" stroke-width="0.5" fill="none"/>
                    <line x1="20" y1="60" x2="100" y2="60" stroke="white" stroke-width="0.5" opacity="0.3"/>
                    <line x1="60" y1="20" x2="60" y2="100" stroke="white" stroke-width="0.5" opacity="0.3"/>
                    <circle cx="60" cy="60" r="3" fill="#FF4A00" opacity="0.8"/>
                  </svg>
                </div>
              </div>
              <div class="absolute bottom-6 left-6">
                <span class="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">Blueprint Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="marquee-section py-16 bg-[#040404] overflow-hidden border-y border-white/5">
        <div class="marquee-track flex whitespace-nowrap select-none" style="font-size: clamp(12px, 1.8vw, 22px)">
          <span class="marquee-text mx-6 block origin-bottom font-mono text-white/10 uppercase tracking-[0.3em] shrink-0">
            WAI-ARIA · ACCESSIBLE · KEYBOARD NATIVE · SCREEN-READER TESTED · TAILWIND CSS · VUE 3.5 · NUXT 4 ·&nbsp;
          </span>
          <span class="marquee-text mx-6 block origin-bottom font-mono text-[#FF4A00]/20 uppercase tracking-[0.3em] shrink-0">
            WAI-ARIA · ACCESSIBLE · KEYBOARD NATIVE · SCREEN-READER TESTED · TAILWIND CSS · VUE 3.5 · NUXT 4 ·&nbsp;
          </span>
          <span class="marquee-text mx-6 block origin-bottom font-mono text-white/10 uppercase tracking-[0.3em] shrink-0">
            WAI-ARIA · ACCESSIBLE · KEYBOARD NATIVE · SCREEN-READER TESTED · TAILWIND CSS · VUE 3.5 · NUXT 4 ·&nbsp;
          </span>
        </div>
      </section>

      <footer class="relative min-h-screen bg-[#020202] flex flex-col justify-between p-6 md:p-12 pb-[8vh] border-t border-white/5 overflow-hidden">
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-t from-[#FF4A00]/20 to-transparent" />
          <div class="absolute bottom-0 left-1/3 w-px h-3/4 bg-gradient-to-t from-[#FF4A00]/10 to-transparent rotate-6 origin-bottom" />
          <div class="absolute bottom-0 right-1/3 w-px h-3/4 bg-gradient-to-t from-[#FF4A00]/10 to-transparent -rotate-6 origin-bottom" />
          <div class="absolute bottom-0 left-1/4 w-px h-1/2 bg-gradient-to-t from-white/5 to-transparent rotate-12 origin-bottom" />
          <div class="absolute bottom-0 right-1/4 w-px h-1/2 bg-gradient-to-t from-white/5 to-transparent -rotate-12 origin-bottom" />
        </div>

        <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          <div class="md:col-span-2">
            <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-[#FF4A00]/70 mb-8 flex items-center gap-4">
              <div class="w-8 h-px bg-[#FF4A00]/40" />
              Initialization
            </div>

            <h2 class="font-black uppercase tracking-tighter leading-[0.85] mb-10"
                style="font-size: clamp(48px, 8vw, 130px);">
              Start<br/>
              <span class="font-serif italic font-light lowercase tracking-normal text-white/20">
                building.
              </span>
            </h2>

            <div class="flex flex-col sm:flex-row items-start gap-4">
              <NuxtLink to="/docs/installation" class="hover-target group">
                <div class="relative px-8 py-4 border-2 border-dotted border-white/30 bg-transparent hover:border-[#FF4A00] hover:bg-[#FF4A00]/5 transition-all duration-300">
                  <span class="font-mono text-[11px] tracking-[0.3em] uppercase font-bold text-white group-hover:text-[#FF4A00] transition-colors duration-300">
                    Get Started →
                  </span>
                  <div class="absolute -top-px -left-px w-2 h-2 border-t border-l border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div class="absolute -top-px -right-px w-2 h-2 border-t border-r border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div class="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div class="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </NuxtLink>

              <NuxtLink to="/components" class="hover-target flex items-center gap-2 px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors duration-300 border border-white/8 hover:border-white/20">
                View Components
              </NuxtLink>
            </div>
          </div>

          <div class="flex flex-col justify-end gap-8">
            <div>
              <h4 class="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-4">Directory</h4>
              <ul class="space-y-2">
                <li><NuxtLink to="/docs/introduction" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target">Introduction</NuxtLink></li>
                <li><NuxtLink to="/docs/installation" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target">Installation</NuxtLink></li>
                <li><NuxtLink to="/components" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target">Components</NuxtLink></li>
              </ul>
            </div>
            <div>
              <h4 class="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-4">Network</h4>
              <ul class="space-y-2">
                <li>
                  <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-[#FF4A00] transition-colors duration-300 hover-target">
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a href="https://iman-mhmdi.ir" target="_blank" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target">
                    Creator ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="relative z-10 w-full mt-16 border-t border-white/5 pt-8 flex items-center justify-center pointer-events-none select-none">
          <h1 class="font-black italic tracking-tighter uppercase leading-none text-transparent opacity-[0.04]"
              style="font-size: 18vw; -webkit-text-stroke: 1px rgba(255,255,255,1);">
            RAYA UI
          </h1>
        </div>

        <p class="absolute bottom-8 left-6 md:left-12 font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">
          © {{ new Date().getFullYear() }} Architected by
          <a href="https://iman-mhmdi.ir" target="_blank" class="text-[#FF4A00]/60 hover:text-[#FF4A00] transition-colors duration-300">Iman</a>
          · MIT License
        </p>
      </footer>

    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,300;1,400&display=swap');

html, body {
  overflow-x: hidden;
  background: #040404;
}

body { margin: 0; }

.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; box-sizing: border-box; }

.feature-card {
  transform-style: preserve-3d;
}

@keyframes scrollLine {
  0%, 100% { transform: scaleY(0); opacity: 0; transform-origin: top; }
  50% { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(0); opacity: 0; transform-origin: bottom; }
}

#hero-section,
#manifesto,
#swap-section,
#horizontal-worlds {
  position: relative;
  will-change: transform;
}

.raya-logo-text {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.swap-panel {
  backface-visibility: hidden;
  transform: translateZ(0);
}

.bp-line {
  will-change: stroke-dashoffset;
}

@media (max-width: 768px) {
  .h-track {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  #horizontal-worlds {
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
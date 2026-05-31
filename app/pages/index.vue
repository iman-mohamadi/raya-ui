<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Raya UI — The Architecture of Systems',
  description: 'Interfaces that breathe. A cinematic spatial architecture for Nuxt & Vue.'
})

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// REFS
// ─────────────────────────────────────────────────────────────────────────────
const cursorRef = ref<HTMLDivElement | null>(null)
const bottomDockRef = ref<HTMLElement | null>(null)

let lenis: Lenis | null = null
let raf: ((time: number) => void) | null = null

// ─────────────────────────────────────────────────────────────────────────────
// GSAP
// ─────────────────────────────────────────────────────────────────────────────
const initMotion = () => {

  ScrollTrigger.getAll().forEach(t => t.kill())

  // ─────────────────────────────────────────────────────────────────────────
  // RAYA LOGO
  // ─────────────────────────────────────────────────────────────────────────
  gsap.set('.raya-logo-text', {
    position: 'fixed',
    top: '50%',
    left: '50%',
    xPercent: -50,
    yPercent: -50,
    scale: 1,
    transformOrigin: 'center center',
    willChange: 'transform'
  })

  gsap.to('.raya-logo-text', {
    scale: 0.12,
    top: '0%',
    left: '0%',
    xPercent: -30,
    yPercent: -30,
    ease: 'none',

    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      invalidateOnRefresh: true,
    }
  })

  // ─────────────────────────────────────────────────────────────────────────
  // HERO META
  // ─────────────────────────────────────────────────────────────────────────
  gsap.to('.hero-subtitles', {
    opacity: 0,
    y: -60,
    filter: 'blur(8px)',
    ease: 'none',

    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    }
  })

  // ─────────────────────────────────────────────────────────────────────────
  // MANIFESTO
  // ─────────────────────────────────────────────────────────────────────────
  const manifestoLines = gsap.utils.toArray('.manifesto-line')

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
      .fromTo(
          manifestoLines,
          {
            y: 120,
            opacity: 0,
            filter: 'blur(12px)'
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.25,
            ease: 'power3.out'
          }
      )
      .to(
          manifestoLines.slice(0, -1),
          {
            opacity: 0.15,
            stagger: 0.2,
            ease: 'none'
          },
          '+=0.5'
      )

  // ─────────────────────────────────────────────────────────────────────────
  // SWAP PANELS
  // ─────────────────────────────────────────────────────────────────────────
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
        .fromTo(
            panels[1],
            {
              clipPath: 'inset(100% 0% 0% 0%)'
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none'
            }
        )
        .fromTo(
            panels[2],
            {
              clipPath: 'inset(100% 0% 0% 0%)'
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none'
            }
        )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MARQUEE
  // ─────────────────────────────────────────────────────────────────────────
  gsap.to('.marquee-track', {
    xPercent: -35,
    ease: 'none',

    scrollTrigger: {
      trigger: '.marquee-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      invalidateOnRefresh: true,
    }
  })

  // ─────────────────────────────────────────────────────────────────────────
  // VELOCITY SKEW
  // ─────────────────────────────────────────────────────────────────────────
  const proxy = { skew: 0 }

  const skewSetter = gsap.quickSetter(
      '.marquee-text',
      'skewX',
      'deg'
  )

  const clamp = gsap.utils.clamp(-20, 20)

  ScrollTrigger.create({
    onUpdate: (self) => {

      const skew = clamp(self.getVelocity() / -180)

      if (Math.abs(skew) > Math.abs(proxy.skew)) {

        proxy.skew = skew

        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true,

          onUpdate: () => {
            skewSetter(proxy.skew)
          }
        })
      }
    }
  })

  // ─────────────────────────────────────────────────────────────────────────
  // HORIZONTAL
  // ─────────────────────────────────────────────────────────────────────────
  const track = document.querySelector('.h-track') as HTMLElement

  if (track) {

    const dist =
        track.scrollWidth -
        window.innerWidth +
        200

    gsap.to(track, {
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

  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// MOUNT
// ─────────────────────────────────────────────────────────────────────────────
onMounted(async () => {

  await nextTick()

  // ─────────────────────────────────────────────────────────────────────────
  // LENIS
  // ─────────────────────────────────────────────────────────────────────────
  lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 0.9,
  })

  lenis.on('scroll', ScrollTrigger.update)

  raf = (time: number) => {
    lenis?.raf(time * 1000)
  }

  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  // ─────────────────────────────────────────────────────────────────────────
  // CURSOR
  // ─────────────────────────────────────────────────────────────────────────
  window.addEventListener('mousemove', (e) => {

    gsap.to(cursorRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.25,
      ease: 'power2.out'
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // HOVER STATES
  // ─────────────────────────────────────────────────────────────────────────
  document.querySelectorAll('a, button, .hover-target').forEach(el => {

    el.addEventListener('mouseenter', () => {

      gsap.to(cursorRef.value, {
        scale: 3.5,
        backgroundColor: '#fff',
        duration: 0.4
      })
    })

    el.addEventListener('mouseleave', () => {

      gsap.to(cursorRef.value, {
        scale: 1,
        backgroundColor: '#fff',
        duration: 0.4
      })
    })
  })

  requestAnimationFrame(() => {
    initMotion()
  })

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// UNMOUNT
// ─────────────────────────────────────────────────────────────────────────────
onBeforeUnmount(() => {

  ScrollTrigger.getAll().forEach(t => t.kill())

  if (raf) {
    gsap.ticker.remove(raf)
  }

  lenis?.destroy()
})
</script>

<template>
  <div
      class="bg-[#040404] text-[#FAFAFA] min-h-screen overflow-x-hidden font-sans relative selection:bg-[#FF4A00] selection:text-black"
      style="cursor: none;"
  >

    <!-- GRID -->
    <div class="fixed inset-0 grid grid-cols-4 md:grid-cols-12 gap-px px-6 md:px-12 pointer-events-none z-[1]">
      <div
          v-for="i in 12"
          :key="i"
          class="h-full border-r border-white/[0.02] hidden md:block last:border-none"
      />

      <div
          v-for="i in 4"
          :key="'m'+i"
          class="h-full border-r border-white/[0.03] md:hidden last:border-none"
      />
    </div>

    <!-- CURSOR -->
    <div
        ref="cursorRef"
        class="fixed top-0 left-0 w-3 h-3 rounded-full bg-white mix-blend-difference z-[9999] pointer-events-none"
        style="transform: translate(-50%, -50%)"
    />

    <!-- TOP NAV -->
    <div class="fixed top-0 right-0 p-8 md:p-10 z-[200] flex gap-8 font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mix-blend-difference">

      <NuxtLink
          to="/components"
          class="hover:text-white transition-colors duration-500 hover-target"
      >
        Registry
      </NuxtLink>

      <NuxtLink
          to="/docs/introduction"
          class="hover:text-white transition-colors duration-500 hover-target"
      >
        Manifesto
      </NuxtLink>

    </div>

    <!-- RAYA -->
    <div class="fixed inset-0 pointer-events-none z-[120]">

      <div class="raya-logo-text absolute text-white mix-blend-difference select-none">

        <h1
            class="font-black uppercase tracking-tighter leading-none"
            style="font-size: clamp(80px, 20vw, 300px);"
        >
          RAYA
        </h1>

      </div>

    </div>

    <!-- DOCK -->
    <nav
        ref="bottomDockRef"
        class="bottom-dock fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-8 px-10 py-4 rounded-full border border-white/10 bg-[#040404]/40 backdrop-blur-xl shadow-2xl transition-all duration-500"
    >

      <NuxtLink
          to="/components"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:text-[#FF4A00] transition-colors duration-300 hover-target"
      >
        Components
      </NuxtLink>

      <div class="dock-divider w-px h-3 bg-white/20" />

      <NuxtLink
          to="/docs/introduction"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:text-[#FF4A00] transition-colors duration-300 hover-target"
      >
        Docs
      </NuxtLink>

      <div class="dock-divider w-px h-3 bg-white/20" />

      <a
          href="https://github.com/iman-mohamadi/raya-ui"
          target="_blank"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF4A00] hover:text-[#FF4A00]/70 transition-colors duration-300 hover-target"
      >
        GitHub
      </a>

    </nav>

    <!-- MAIN -->
    <main class="relative z-10 bg-[#040404]">

      <!-- HERO -->
      <section
          id="hero-section"
          class="relative h-screen flex items-center justify-center overflow-hidden"
      >

        <div class="hero-subtitles absolute top-[65%] left-1/2 -translate-x-1/2 text-center w-full z-10 flex flex-col items-center gap-2 pointer-events-none">

          <div class="font-serif italic text-[#FF4A00] text-3xl md:text-5xl font-light">
            user interfaces
          </div>

          <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 mt-4">
            Vue OS · Digital Matter
          </div>

        </div>

      </section>

      <!-- MANIFESTO -->
      <section
          id="manifesto"
          class="relative h-screen flex items-center px-6 md:px-24 bg-[#040404]"
      >

        <div class="max-w-5xl relative z-10">

          <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-[#FF4A00] mb-16">
            ( Philosophy )
          </div>

          <div class="space-y-4">

            <div
                class="manifesto-line text-white"
                style="font-size: clamp(42px, 6vw, 96px); font-weight: 900; letter-spacing: -0.04em; line-height: 1;"
            >
              We refuse
            </div>

            <div
                class="manifesto-line text-white/30 italic font-light font-serif"
                style="font-size: clamp(42px, 6vw, 96px); letter-spacing: -0.02em; line-height: 1;"
            >
              the mediocre.
            </div>

            <div
                class="manifesto-line text-white"
                style="font-size: clamp(42px, 6vw, 96px); font-weight: 900; letter-spacing: -0.04em; line-height: 1;"
            >
              Every primitive is
            </div>

            <div
                class="manifesto-line text-[#FF4A00]"
                style="font-size: clamp(42px, 6vw, 96px); font-weight: 900; letter-spacing: -0.04em; line-height: 1;"
            >
              a deliberate act.
            </div>

          </div>

        </div>

      </section>

      <!-- SWAP -->
      <section
          id="swap-section"
          class="relative h-screen overflow-hidden"
      >

        <div class="swap-panel absolute inset-0 bg-[#040404] flex items-center justify-center p-6">
          <div class="text-center max-w-4xl">
            <h2 class="text-[clamp(40px,8vw,120px)] font-black uppercase tracking-tighter leading-none mb-6">
              Copy <span class="font-serif italic text-white/30 lowercase font-light">the</span><br /> Code.
            </h2>

            <p class="text-white/40 font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
              Zero NPM Black Boxes. Total Control.
            </p>
          </div>
        </div>

        <div
            class="swap-panel swap-panel-white absolute inset-0 bg-[#FAFAFA] text-[#040404] flex items-center justify-center p-6"
            style="clip-path: inset(100% 0% 0% 0%)"
        >
          <div class="text-center max-w-4xl relative z-10">
            <h2 class="text-[clamp(40px,8vw,120px)] font-black uppercase tracking-tighter leading-none mb-6">
              Own <span class="font-serif italic text-[#FF4A00] lowercase font-light">the</span> Physics.
            </h2>

            <p class="text-black/40 font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
              GSAP powered motion architecture.
            </p>
          </div>
        </div>

        <div
            class="swap-panel absolute inset-0 bg-[#FF4A00] text-black flex items-center justify-center p-6"
            style="clip-path: inset(100% 0% 0% 0%)"
        >
          <div class="text-center max-w-4xl">
            <h2 class="text-[clamp(40px,8vw,120px)] font-black uppercase tracking-tighter leading-none mb-6">
              Build <span class="font-serif italic text-white lowercase font-light">the</span> Unseen.
            </h2>

            <p class="text-black/60 font-mono text-xs md:text-sm uppercase tracking-[0.2em] font-bold">
              Wai-Aria Bedrock. Screen-Reader Native.
            </p>
          </div>
        </div>

      </section>

      <!-- MARQUEE -->
      <section class="marquee-section py-24 bg-[#FAFAFA] text-[#040404] overflow-hidden relative z-20 border-y border-black/5">
        <div class="marquee-track flex whitespace-nowrap font-black uppercase text-[clamp(50px,9vw,150px)] tracking-tighter leading-none">
          <span class="marquee-text mx-6 block origin-bottom">EVERY GOOD IDEA NEEDS PEOPLE, PROCESS, AND SYSTEMS TO SHIP.</span>
          <span class="marquee-text mx-6 block origin-bottom text-transparent" style="-webkit-text-stroke: 2px #040404;">
            EVERY GOOD IDEA NEEDS PEOPLE, PROCESS, AND SYSTEMS TO SHIP.
          </span>
          <span class="marquee-text mx-6 block origin-bottom text-[#FF4A00]">
            EVERY GOOD IDEA NEEDS PEOPLE, PROCESS, AND SYSTEMS TO SHIP.
          </span>
        </div>
      </section>

      <!-- HORIZONTAL -->
      <section
          id="horizontal-worlds"
          class="relative h-screen bg-[#040404] overflow-hidden flex items-center"
      >
        <div class="absolute top-16 left-6 md:left-12 font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase z-10">
          ( Component Architecture )
        </div>

        <div class="h-track flex items-center gap-8 px-6 md:px-12 w-max">
          <!-- KEEP YOUR EXISTING CARDS HERE -->
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="relative min-h-screen bg-[#020202] flex flex-col justify-end p-6 md:p-12 pb-[5vh] border-t border-white/5">

        <div class="relative z-10 flex flex-col md:flex-row justify-between items-end gap-12 w-full">
          <div>
            <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-[#FF4A00] mb-8">
              ( 007 — Initialization )
            </div>

            <h2 class="text-[clamp(40px,8vw,120px)] font-black uppercase tracking-tighter leading-[0.8] mb-8">
              Start<br>
              <span class="font-serif italic font-light lowercase text-white/30 tracking-normal">
                building.
              </span>
            </h2>
          </div>
        </div>

      </footer>
    </main>

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,300;1,400&display=swap');

html,
body {
  overflow-x: hidden;
  background: #040404;
}

body {
  margin: 0;
}

.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

::-webkit-scrollbar {
  display: none;
}

* {
  scrollbar-width: none;
  box-sizing: border-box;
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

.dock-invert {
  background-color: rgba(255,255,255,0.7) !important;
  border-color: rgba(0,0,0,0.08) !important;
}

.dock-invert .dock-link {
  color: #040404 !important;
}

.dock-invert .dock-link:hover {
  color: #FF4A00 !important;
}

.dock-invert .dock-divider {
  background-color: rgba(0,0,0,0.15) !important;
}
</style>
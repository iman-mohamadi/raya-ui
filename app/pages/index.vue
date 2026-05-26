<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Raya UI — Digital Matter',
  description: 'A living interface system. Beautifully engineered components for Vue & Nuxt. Not a library. A material.'
})

// --- REFS ---
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isLoaded = ref(false)
const loadCount = ref(0)
const cursorRef = ref<HTMLElement | null>(null)
const cursorTrailRef = ref<HTMLElement | null>(null)

// --- THREE.JS STATE ---
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animId: number
let lenis: Lenis
let mouseX = 0, mouseY = 0
let normX = 0, normY = 0

// --- CURSOR ---
const initCursor = () => {
  const cursor = cursorRef.value
  const trail = cursorTrailRef.value
  if (!cursor || !trail) return

  let tx = 0, ty = 0, fx = 0, fy = 0

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX
    ty = e.clientY
    mouseX = e.clientX
    mouseY = e.clientY
    normX = (e.clientX / window.innerWidth) * 2 - 1
    normY = -(e.clientY / window.innerHeight) * 2 + 1
    gsap.set(cursor, { x: tx, y: ty })
  })

  gsap.ticker.add(() => {
    fx += (tx - fx) * 0.06
    fy += (ty - fy) * 0.06
    gsap.set(trail, { x: fx, y: fy })
  })

  // Magnetic hover for links
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 3.5, opacity: 0.4, duration: 0.4, ease: 'expo.out' })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out' })
    })
  })
}

// --- THREE.JS: HOLOGRAPHIC GRID PLANE ---
const initThree = () => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200)
  camera.position.set(0, 3.5, 12)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

  // Procedural grid
  const gridGeo = new THREE.PlaneGeometry(60, 60, 80, 80)
  const gridMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 }
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      varying vec2 vUv;
      varying float vElevation;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float dist = length(pos.xy - uMouse * 15.0);
        float wave1 = sin(pos.x * 0.3 + uTime * 0.6) * cos(pos.y * 0.3 + uTime * 0.4) * 1.8;
        float wave2 = sin(pos.x * 0.15 - uTime * 0.3) * 0.9;
        float ripple = sin(dist * 0.5 - uTime * 2.0) * (1.0 / (dist * 0.3 + 1.0)) * 2.5;
        pos.z = wave1 + wave2 + ripple;
        vElevation = pos.z;
        pos.y -= uScroll * 4.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vElevation;
      void main() {
        float g = abs(fract(vUv.x * 80.0 + 0.5) - 0.5);
        float h = abs(fract(vUv.y * 80.0 + 0.5) - 0.5);
        float grid = min(g, h);
        float line = 1.0 - smoothstep(0.0, 0.05, grid);
        float elevation = clamp((vElevation + 2.0) / 4.0, 0.0, 1.0);
        vec3 baseColor = mix(vec3(0.04, 0.06, 0.12), vec3(0.18, 0.55, 0.95), elevation);
        vec3 hotColor = mix(baseColor, vec3(0.6, 0.9, 1.0), elevation * 0.5);
        float alpha = line * (0.12 + elevation * 0.35);
        gl_FragColor = vec4(hotColor, alpha);
      }
    `
  })

  const grid = new THREE.Mesh(gridGeo, gridMat)
  grid.rotation.x = -Math.PI / 2.2
  grid.position.y = -2
  scene.add(grid)

  // Floating holographic shards
  const shards: THREE.Mesh[] = []
  for (let i = 0; i < 12; i++) {
    const geo = new THREE.PlaneGeometry(
        Math.random() * 1.5 + 0.3,
        Math.random() * 0.8 + 0.2
    )
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.58 + Math.random() * 0.08, 0.8, 0.6),
      transparent: true,
      opacity: Math.random() * 0.08 + 0.02,
      side: THREE.DoubleSide
    })
    const shard = new THREE.Mesh(geo, mat)
    shard.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2
    )
    shard.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    )
    scene.add(shard)
    shards.push(shard)
  }

  const clock = new THREE.Clock()
  let scrollY = 0
  window.addEventListener('scroll', () => { scrollY = window.scrollY }, { passive: true })

  const animate = () => {
    animId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()

    ;(gridMat.uniforms.uTime as any).value = t
    ;(gridMat.uniforms.uMouse as any).value.set(normX, normY)
    ;(gridMat.uniforms.uScroll as any).value += (scrollY * 0.001 - (gridMat.uniforms.uScroll as any).value) * 0.05

    // Drift camera
    camera.position.x += (normX * 1.5 - camera.position.x) * 0.02
    camera.position.y += (3.5 + normY * 0.8 - camera.position.y) * 0.02
    camera.lookAt(0, -1, 0)

    // Animate shards
    shards.forEach((shard, i) => {
      shard.rotation.x += 0.001 * (i % 2 === 0 ? 1 : -1)
      shard.rotation.y += 0.0015
      shard.position.y += Math.sin(t * 0.4 + i) * 0.002
    })

    renderer.render(scene, camera)
  }

  animate()
}

// --- LENIS SMOOTH SCROLL ---
const initLenis = () => {
  gsap.registerPlugin(ScrollTrigger)
  gsap.ticker.lagSmoothing(0)

  lenis = new Lenis({ duration: 1.4, smoothWheel: true, wheelMultiplier: 0.85 })
  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

// --- GSAP CHOREOGRAPHY ---
const initAnimations = () => {

  // ── HERO: Staggered character reveal ──
  const heroTl = gsap.timeline({ delay: 0.2 })

  heroTl
      .from('.h-badge', {
        y: 24, opacity: 0, duration: 1.2, ease: 'expo.out'
      })
      .from('.h-word', {
        y: '110%',
        rotateX: -60,
        opacity: 0,
        stagger: 0.06,
        duration: 1.4,
        ease: 'expo.out'
      }, '-=0.7')
      .from('.h-sub', {
        y: 20,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
      }, '-=0.9')
      .from('.h-cta', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out'
      }, '-=0.8')

  // ── HERO: Scroll parallax ──
  gsap.to('.hero-body', {
    y: 200,
    opacity: 0,
    filter: 'blur(12px)',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    }
  })

  // ── LOGO morph: large center → small nav ──
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress
      const logoEl = document.querySelector('.logo-morph') as HTMLElement
      if (!logoEl) return
      const size = 80 - p * 68  // 80vmin → 12px
      logoEl.style.fontSize = p < 0.98 ? `${Math.max(12, size)}px` : '14px'
      logoEl.style.opacity = p > 0.85 ? '0' : '1'
    }
  })

  // ── MANIFESTO: pinned scroll text ──
  const manifestoLines = gsap.utils.toArray('.manifesto-line') as HTMLElement[]
  gsap.timeline({
    scrollTrigger: {
      trigger: '#manifesto',
      start: 'top top',
      end: '+=260%',
      pin: true,
      scrub: 0.8
    }
  }).from(manifestoLines, {
    y: 60,
    opacity: 0,
    stagger: 0.3,
    filter: 'blur(10px)',
    ease: 'none'
  }).to(manifestoLines.slice(0, -1), {
    opacity: 0.1,
    scale: 0.96,
    stagger: 0.2,
    ease: 'none'
  }, '+=0.4')

  // ── FEATURES: staggered reveal ──
  gsap.utils.toArray('.feat-row').forEach((row: any, i) => {
    gsap.from(row, {
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // ── INTERFACE WORLDS: horizontal ──
  const track = document.querySelector('.h-track') as HTMLElement
  if (track) {
    const dist = track.scrollWidth - window.innerWidth
    gsap.to(track, {
      x: -dist,
      ease: 'none',
      scrollTrigger: {
        trigger: '#h-scroll',
        start: 'top top',
        end: () => `+=${dist}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1
      }
    })
  }

  // ── COUNTER: number morph ──
  gsap.utils.toArray('.stat-num').forEach((el: any) => {
    const target = parseInt(el.dataset.val)
    gsap.from({ val: 0 }, {
      val: target,
      duration: 2,
      ease: 'power3.out',
      onUpdate: function() {
        el.textContent = Math.round(this.targets()[0].val)
      },
      scrollTrigger: { trigger: el, start: 'top 80%' }
    })
  })

  // ── FOOTER curtain ──
  gsap.fromTo('.footer-reveal',
      { yPercent: -30 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true
        }
      }
  )

  // ── Bottom nav dock ──
  gsap.from('.bottom-dock', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#hero',
      start: '50% top',
      toggleActions: 'play none none reverse'
    }
  })
}

// --- RESIZE ---
const handleResize = () => {
  if (!renderer || !camera) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  ScrollTrigger.refresh()
}

// --- PRELOADER ---
const runPreloader = () => {
  const tl = gsap.timeline()
  tl.to('.pre-bar', {
    scaleX: 1,
    duration: 1.6,
    ease: 'expo.inOut',
    transformOrigin: 'left center'
  }).to('.pre-overlay', {
    yPercent: -100,
    duration: 1,
    ease: 'expo.inOut',
    onComplete: () => {
      isLoaded.value = true
      initAnimations()
      initCursor()
    }
  })
  tl.from('.pre-text', {
    opacity: 0, y: 20, duration: 0.8, ease: 'expo.out'
  }, 0)
}

onMounted(() => {
  initLenis()
  initThree()

  // Simulate asset load
  setTimeout(runPreloader, 300)

  window.addEventListener('resize', handleResize, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  lenis?.destroy()
  ScrollTrigger.getAll().forEach(t => t.kill())
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <!-- PRELOADER -->
  <div class="pre-overlay fixed inset-0 z-[999] bg-[#040404] flex flex-col items-center justify-center overflow-hidden">
    <div class="pre-text font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 mb-8">
      Initializing Digital Matter
    </div>
    <div class="w-48 h-px bg-white/10 relative overflow-hidden">
      <div class="pre-bar absolute inset-0 bg-gradient-to-r from-sky-400/80 to-blue-500/80 scale-x-0"></div>
    </div>
  </div>

  <!-- CUSTOM CURSOR -->
  <div ref="cursorRef" class="fixed top-0 left-0 z-[200] pointer-events-none hidden md:block -translate-x-1/2 -translate-y-1/2">
    <div class="size-2 rounded-full bg-white mix-blend-difference"></div>
  </div>
  <div ref="cursorTrailRef" class="fixed top-0 left-0 z-[199] pointer-events-none hidden md:block -translate-x-1/2 -translate-y-1/2">
    <div class="size-8 rounded-full border border-white/20 mix-blend-difference"></div>
  </div>

  <!-- CANVAS: Three.js holographic grid -->
  <canvas ref="canvasRef" class="fixed inset-0 z-0 pointer-events-none w-full h-full"></canvas>

  <!-- FILM GRAIN OVERLAY -->
  <div class="fixed inset-0 z-[2] pointer-events-none opacity-[0.035] mix-blend-overlay"
       style="background-image: url('data:image/svg+xml,%3Csvg viewBox=&quot;0 0 512 512&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;n&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; stitchTiles=&quot;stitch&quot;/%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23n)&quot;/%3E%3C/svg%3E')">
  </div>

  <!-- SCANLINES -->
  <div class="fixed inset-0 z-[1] pointer-events-none"
       style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)">
  </div>

  <!-- AMBIENT LIGHT ORBS -->
  <div class="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
    <div class="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full"
         style="background: radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%); animation: drift 12s ease-in-out infinite alternate;">
    </div>
    <div class="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full"
         style="background: radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%); animation: drift 16s ease-in-out infinite alternate-reverse;">
    </div>
  </div>

  <div class="relative text-white overflow-hidden" style="cursor: none; background: #040404;">

    <!-- ═══════════════════════════════════════════
         MORPHING LOGO (fixed, transforms on scroll)
    ═══════════════════════════════════════════ -->
    <div class="logo-morph fixed z-50 pointer-events-none select-none font-black tracking-tighter leading-none text-white"
         style="top: 32px; left: 40px; font-size: 14px; transition: none;">
      R
    </div>

    <!-- FLOATING DOCK NAV -->
    <nav class="bottom-dock fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-8 px-10 py-4 rounded-full"
         style="background: rgba(255,255,255,0.04); backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);">
      <NuxtLink to="/components" class="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300">Components</NuxtLink>
      <div class="w-px h-3 bg-white/10"></div>
      <NuxtLink to="/docs/introduction" class="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300">Docs</NuxtLink>
      <div class="w-px h-3 bg-white/10"></div>
      <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300">GitHub</a>
    </nav>

    <!-- ═══════════════════════════════════════════
         SECTION 1: HERO — The Atmosphere
    ═══════════════════════════════════════════ -->
    <section id="hero" class="h-screen w-full relative flex items-center overflow-hidden"
             style="padding: 0 6vw;">
      <div class="hero-body relative z-10 flex flex-col w-full max-w-[1600px] mx-auto">

        <!-- Badge -->
        <div class="h-badge inline-flex self-start items-center gap-3 mb-12 px-5 py-2.5 rounded-full"
             style="border: 1px solid rgba(56,189,248,0.2); background: rgba(56,189,248,0.04);">
          <span class="size-1.5 rounded-full bg-sky-400" style="box-shadow: 0 0 6px rgba(56,189,248,0.8); animation: pulse 2s infinite;"></span>
          <span class="font-mono text-[10px] tracking-[0.3em] uppercase text-sky-400/80">Digital Matter — Vue OS</span>
        </div>

        <!-- Headline: split words for parallax -->
        <h1 class="leading-[0.88] tracking-tighter uppercase mb-10" style="font-size: clamp(56px, 10vw, 160px); font-weight: 900;">
          <div class="overflow-hidden">
            <div class="h-word block" style="transform-origin: bottom left;">Interfaces</div>
          </div>
          <div class="overflow-hidden flex items-baseline gap-4 md:gap-8">
            <div class="h-word block text-white/20">That</div>
            <div class="h-word block italic font-light" style="font-family: 'Georgia', serif; color: rgb(56,189,248);">breathe.</div>
          </div>
        </h1>

        <!-- Sub -->
        <p class="h-sub max-w-xl text-white/35 leading-relaxed mb-14" style="font-size: clamp(15px, 1.4vw, 20px);">
          Holographic UI primitives. Physics-aware motion logic.<br>
          For engineers who refuse to build the ordinary.
        </p>

        <!-- CTAs -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/docs/installation" class="h-cta group relative flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden"
                    style="background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.25);">
            <span class="relative z-10 font-mono text-xs tracking-[0.2em] uppercase text-sky-300">Initialize</span>
            <svg class="relative z-10 size-3 text-sky-300 group-hover:translate-x-1 transition-transform" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6.5 1L11 6L6.5 11M11 6H1"/>
            </svg>
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style="background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.15))"></div>
          </NuxtLink>
          <NuxtLink to="/components" class="h-cta font-mono text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors duration-300">
            View Registry →
          </NuxtLink>
        </div>

      </div>

      <!-- Right side: Floating interface fragment -->
      <div class="hero-body absolute right-[4vw] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none" style="width: 38vw; max-width: 580px;">
        <div class="relative" style="transform: perspective(1000px) rotateY(-8deg) rotateX(3deg);">

          <!-- Holographic dashboard card -->
          <div class="rounded-3xl overflow-hidden relative"
               style="background: rgba(255,255,255,0.02); border: 1px solid rgba(56,189,248,0.12); backdrop-filter: blur(20px); box-shadow: 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);">

            <!-- Card header -->
            <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <div class="flex items-center gap-2">
                <div class="size-2 rounded-full" style="background: rgba(56,189,248,0.6); box-shadow: 0 0 8px rgba(56,189,248,0.4);"></div>
                <span class="font-mono text-[10px] tracking-widest uppercase text-white/25">RayaOS — v1.0</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-white/10"></div>
                <div class="w-2 h-2 rounded-full bg-white/10"></div>
                <div class="w-2 h-2 rounded-full bg-white/10"></div>
              </div>
            </div>

            <!-- Content area -->
            <div class="p-6 space-y-4">
              <!-- Metric row -->
              <div class="grid grid-cols-3 gap-3">
                <div v-for="(m, i) in [['24', 'Components'], ['6', 'Backgrounds'], ['∞', 'Potential']]" :key="i"
                     class="rounded-2xl p-4"
                     :style="`background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,${i===0?'0.1':'0.04'}); animation: float-card ${3+i*0.5}s ease-in-out infinite alternate;`">
                  <div class="text-2xl font-black tracking-tight text-white/90">{{ m[0] }}</div>
                  <div class="font-mono text-[8px] tracking-widest uppercase text-white/25 mt-1">{{ m[1] }}</div>
                </div>
              </div>

              <!-- Code snippet decoration -->
              <div class="rounded-2xl p-4" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); font-family: monospace;">
                <div class="text-[11px] leading-relaxed space-y-1">
                  <div><span class="text-sky-400/70">npx</span> <span class="text-white/40">raya-ui@latest</span></div>
                  <div class="text-white/60">  add <span class="text-violet-400/80">liquid-glass</span></div>
                </div>
              </div>

              <!-- Animated bar chart -->
              <div class="flex items-end gap-2 h-16 pt-2">
                <div v-for="(h, i) in [40, 75, 55, 90, 65, 85, 50, 95, 70, 80]" :key="i"
                     class="flex-1 rounded-sm"
                     :style="`height: ${h}%; background: linear-gradient(to top, rgba(56,189,248,${0.3+i*0.03}), rgba(99,102,241,0.2)); animation: bar-grow 0.8s ${i*0.05}s ease-out both;`">
                </div>
              </div>
            </div>
          </div>

          <!-- Floating elements around card -->
          <div class="absolute -top-4 -right-4 rounded-xl px-3 py-2 font-mono text-[9px] tracking-wider text-sky-300/70"
               style="background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.15); animation: float-card 4s ease-in-out infinite alternate;">
            GSAP + Vue 3.5
          </div>
          <div class="absolute -bottom-3 -left-6 rounded-xl px-3 py-2 font-mono text-[9px] tracking-wider text-violet-300/70"
               style="background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15); animation: float-card 5s ease-in-out infinite alternate-reverse;">
            WebGL · Three.js
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <span class="font-mono text-[9px] tracking-widest uppercase">Scroll</span>
        <div class="w-px h-12 bg-gradient-to-b from-white to-transparent" style="animation: shrink 2s ease-in-out infinite;"></div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 2: MANIFESTO — The Philosophy
    ═══════════════════════════════════════════ -->
    <section id="manifesto" class="h-screen w-full flex items-center justify-start overflow-hidden relative"
             style="padding: 0 6vw; background: #040404;">

      <div class="absolute left-0 top-0 h-full w-px opacity-20"
           style="background: linear-gradient(to bottom, transparent, rgba(56,189,248,0.5) 50%, transparent)"></div>

      <div class="max-w-5xl w-full">
        <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-16">( 002 — Philosophy )</div>

        <div class="space-y-3">
          <div class="manifesto-line text-white" style="font-size: clamp(36px, 5.5vw, 88px); font-weight: 900; letter-spacing: -0.04em; line-height: 1;">
            We refuse
          </div>
          <div class="manifesto-line text-white/20 italic font-light" style="font-size: clamp(36px, 5.5vw, 88px); font-family: 'Georgia', serif; letter-spacing: -0.02em; line-height: 1;">
            the mediocre.
          </div>
          <div class="manifesto-line text-white" style="font-size: clamp(36px, 5.5vw, 88px); font-weight: 900; letter-spacing: -0.04em; line-height: 1;">
            Every primitive is
          </div>
          <div class="manifesto-line" style="font-size: clamp(36px, 5.5vw, 88px); font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: rgb(56,189,248);">
            a deliberate act.
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 3: SPATIAL INTERFACES — Features
    ═══════════════════════════════════════════ -->
    <section class="relative py-40" style="background: #040404; padding-left: 6vw; padding-right: 6vw;">

      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-24">
          <div>
            <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-6">( 003 — Architecture )</div>
            <h2 style="font-size: clamp(40px, 6vw, 96px); font-weight: 900; letter-spacing: -0.04em; line-height: 0.9;">
              Precision<br>
              <span class="text-white/20 italic font-light" style="font-family: 'Georgia', serif;">primitives.</span>
            </h2>
          </div>
          <div class="hidden md:block max-w-xs">
            <p class="text-white/30 text-sm leading-relaxed">
              Not a library. A material. Copy the code, own the architecture. Zero black boxes.
            </p>
          </div>
        </div>

        <!-- Feature rows -->
        <div class="border-t" style="border-color: rgba(255,255,255,0.06);">

          <div v-for="(feat, i) in [
            { num: '01', title: 'Copy-Paste Architecture', desc: 'Zero dependency locks. The code enters your codebase and becomes yours entirely.', accent: 'rgba(56,189,248,0.6)' },
            { num: '02', title: 'Spatial Physics Engine', desc: 'GSAP-powered hardware-accelerated motion that responds to velocity and intent.', accent: 'rgba(99,102,241,0.6)' },
            { num: '03', title: 'WAI-ARIA Bedrock', desc: 'Reka UI primitives. Full keyboard navigation. Screen-reader certified.', accent: 'rgba(34,197,94,0.6)' },
            { num: '04', title: 'Holographic Aesthetics', desc: 'Liquid glass, ambient grids, WebGL shaders. Beauty as a feature, not an afterthought.', accent: 'rgba(244,114,182,0.6)' },
          ]" :key="i"
               class="feat-row group flex items-center gap-8 py-10 border-b"
               style="border-color: rgba(255,255,255,0.06);">

            <div class="font-mono text-xs text-white/15 group-hover:text-white/40 transition-colors w-12 shrink-0"
                 style="font-size: 10px; letter-spacing: 0.2em;">
              ({{ feat.num }})
            </div>

            <div class="flex-1">
              <h3 class="font-black tracking-tight text-white/90 group-hover:text-white transition-colors duration-500 uppercase mb-1"
                  style="font-size: clamp(20px, 2.8vw, 44px); letter-spacing: -0.03em; line-height: 1;">
                {{ feat.title }}
              </h3>
            </div>

            <div class="hidden md:block max-w-xs text-white/30 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-500">
              {{ feat.desc }}
            </div>

            <div class="size-2 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 :style="`background: ${feat.accent}; box-shadow: 0 0 12px ${feat.accent};`">
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 4: INTERFACE WORLDS — Horizontal
    ═══════════════════════════════════════════ -->
    <section id="h-scroll" class="h-screen overflow-hidden" style="background: #040404;">
      <div class="h-full flex flex-col justify-end pb-16 pl-[6vw] mb-16 absolute pointer-events-none z-10" style="top: 50%; transform: translateY(-50%);">
        <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4">( 004 — Worlds )</div>
        <h2 class="text-white font-black tracking-tighter uppercase" style="font-size: clamp(32px, 4.5vw, 72px); letter-spacing: -0.04em;">
          Interface<br>
          <span class="text-white/20 italic font-light" style="font-family: 'Georgia', serif;">environments.</span>
        </h2>
      </div>

      <div class="h-track flex items-center gap-8 h-full" style="padding: 0 6vw; will-change: transform; width: max-content; padding-top: 12vh;">

        <div v-for="(world, i) in [
          { title: 'Neural Dashboard', tag: 'Fintech OS', color: 'from-sky-500/20 to-blue-600/10', accent: 'rgb(56,189,248)' },
          { title: 'Spatial IDE', tag: 'Developer Tools', color: 'from-violet-500/20 to-purple-600/10', accent: 'rgb(139,92,246)' },
          { title: 'Data Observatory', tag: 'Analytics Suite', color: 'from-emerald-500/20 to-green-600/10', accent: 'rgb(34,197,94)' },
          { title: 'Motion Studio', tag: 'Creative Platform', color: 'from-pink-500/20 to-rose-600/10', accent: 'rgb(244,114,182)' },
        ]" :key="i"
             class="shrink-0 rounded-3xl relative overflow-hidden group"
             style="width: min(76vw, 680px); height: 480px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); cursor: none;">

          <!-- Hover fill -->
          <div :class="`absolute inset-0 bg-gradient-to-br ${world.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`"></div>

          <!-- Content -->
          <div class="relative z-10 h-full flex flex-col justify-between p-10">
            <div class="flex justify-between items-start">
              <span class="font-mono text-[10px] tracking-[0.25em] uppercase text-white/25">{{ world.tag }}</span>
              <div class="size-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0"
                   :style="`border: 1px solid ${world.accent}40; background: ${world.accent}10`">
                <svg viewBox="0 0 12 12" fill="none" class="size-3" :stroke="world.accent" stroke-width="1.5">
                  <path d="M2 10L10 2M10 2H4M10 2V8"/>
                </svg>
              </div>
            </div>

            <!-- Fake UI inside card -->
            <div class="space-y-2.5 opacity-60 group-hover:opacity-90 transition-opacity duration-500">
              <!-- Fake bars -->
              <div class="flex items-center gap-3">
                <div class="h-1 rounded-full bg-white/20" :style="`width: ${60+i*10}%`"></div>
              </div>
              <div class="flex items-center gap-3">
                <div class="h-1 rounded-full bg-white/10" :style="`width: ${40+i*8}%`"></div>
              </div>
              <div class="grid grid-cols-4 gap-2 mt-4">
                <div v-for="j in 8" :key="j" class="h-12 rounded-xl bg-white/5"
                     :style="`opacity: ${0.3+Math.random()*0.5};`"></div>
              </div>
            </div>

            <div>
              <h3 class="font-black tracking-tight text-white text-3xl uppercase mb-1">{{ world.title }}</h3>
              <div class="flex items-center gap-2">
                <div class="size-1.5 rounded-full" :style="`background: ${world.accent}`"></div>
                <span class="font-mono text-[10px] tracking-widest uppercase text-white/25">Live Interface</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 5: STATS — Motion Systems
    ═══════════════════════════════════════════ -->
    <section class="relative py-40 overflow-hidden" style="background: #040404; padding-left: 6vw; padding-right: 6vw;">

      <div class="absolute inset-0 pointer-events-none"
           style="background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(56,189,248,0.04) 0%, transparent 70%)">
      </div>

      <div class="max-w-7xl mx-auto">
        <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-20">( 005 — Signal )</div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-px" style="border: 1px solid rgba(255,255,255,0.05);">
          <div v-for="(stat, i) in [
            { val: 24, label: 'Components', suffix: '+' },
            { val: 6, label: 'Backgrounds', suffix: '' },
            { val: 100, label: 'WAI-ARIA Score', suffix: '%' },
            { val: 0, label: 'Runtime Lock-ins', suffix: '' },
          ]" :key="i"
               class="p-10 md:p-14"
               style="border: 1px solid rgba(255,255,255,0.05);">
            <div class="flex items-end gap-1 mb-3">
              <div class="stat-num font-black text-white" :data-val="stat.val"
                   style="font-size: clamp(48px, 6vw, 88px); letter-spacing: -0.04em; line-height: 1;">
                0
              </div>
              <div class="text-white/30 font-bold text-3xl mb-2">{{ stat.suffix }}</div>
            </div>
            <div class="font-mono text-[10px] tracking-widest uppercase text-white/25">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 6: INTERACTION DESIGN
    ═══════════════════════════════════════════ -->
    <section class="relative py-40" style="background: #040404; padding-left: 6vw; padding-right: 6vw;">
      <div class="max-w-7xl mx-auto">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-10">( 006 — Interaction )</div>
            <h2 class="font-black tracking-tight text-white uppercase mb-8"
                style="font-size: clamp(36px, 5vw, 76px); letter-spacing: -0.04em; line-height: 0.9;">
              Living<br>
              <span class="text-white/20 italic font-light" style="font-family: 'Georgia', serif;">interfaces.</span>
            </h2>
            <p class="text-white/30 text-base leading-relaxed max-w-md mb-12">
              Magnetic interactions. Cursor distortion. Glass reflections. Velocity-based physics. Every touch point responds with intention.
            </p>
            <NuxtLink to="/components" class="inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase text-white/40 hover:text-sky-400 transition-colors duration-300 group">
              <span>Explore Components</span>
              <svg class="size-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6.5 1L11 6L6.5 11M11 6H1"/>
              </svg>
            </NuxtLink>
          </div>

          <!-- Interaction demo panel -->
          <div class="relative">
            <div class="rounded-3xl p-8 relative overflow-hidden"
                 style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); min-height: 380px;">

              <!-- Simulated interactions -->
              <div class="space-y-4">
                <div v-for="(item, i) in [
                  { label: 'Magnetic Hover', color: 'sky', active: i===0 },
                  { label: 'Liquid Glass', color: 'violet', active: false },
                  { label: 'Scroll Reveal', color: 'emerald', active: false },
                  { label: 'Physics Motion', color: 'pink', active: false },
                  { label: 'Cursor Distortion', color: 'amber', active: false },
                ]" :key="i"
                     class="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500"
                     :style="`background: rgba(255,255,255,${item.active?'0.05':'0.02'}); border: 1px solid rgba(255,255,255,${item.active?'0.08':'0.04'});`">

                  <div class="size-2 rounded-full shrink-0 transition-all duration-500"
                       :style="`background: ${item.active?'rgb(56,189,248)':'rgba(255,255,255,0.1)'}; ${item.active?'box-shadow: 0 0 8px rgba(56,189,248,0.6);':''}`">
                  </div>

                  <span class="text-sm font-medium tracking-tight text-white/50"
                        :style="item.active?'color: rgba(255,255,255,0.9);':''">
                    {{ item.label }}
                  </span>

                  <div class="ml-auto font-mono text-[9px] tracking-wider uppercase"
                       :style="`color: rgba(255,255,255,${item.active?'0.25':'0.1'})`">
                    {{ item.active ? 'Active' : 'Ready' }}
                  </div>
                </div>
              </div>

              <!-- Decorative corner light -->
              <div class="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
                   style="background: radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 7: EMOTIONAL CTA — The Future
    ═══════════════════════════════════════════ -->
    <section class="relative py-40 overflow-hidden" style="background: #040404; padding-left: 6vw; padding-right: 6vw;">

      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full"
             style="background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(56,189,248,0.05) 0%, transparent 60%)">
        </div>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-12">( 007 — Initialize )</div>

        <div class="flex flex-col items-start">
          <h2 class="font-black tracking-tighter text-white uppercase mb-8"
              style="font-size: clamp(52px, 9vw, 144px); letter-spacing: -0.05em; line-height: 0.85;">
            Build<br>
            <span class="text-white/15 italic font-light" style="font-family: 'Georgia', serif; font-size: 0.9em;">beyond.</span>
          </h2>

          <p class="text-white/25 max-w-md text-base leading-relaxed mb-16">
            Stop using generic dashboards. Start building digital matter that responds, breathes, and lives.
          </p>

          <div class="flex items-center gap-6 flex-wrap">
            <NuxtLink to="/docs/installation"
                      class="group relative flex items-center gap-4 px-10 py-5 rounded-full overflow-hidden"
                      style="background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.1)); border: 1px solid rgba(56,189,248,0.2);">
              <span class="font-mono text-xs tracking-[0.25em] uppercase text-sky-300 relative z-10">Get Started</span>
              <div class="size-5 rounded-full flex items-center justify-center relative z-10"
                   style="border: 1px solid rgba(56,189,248,0.4); background: rgba(56,189,248,0.1);">
                <svg viewBox="0 0 8 8" fill="none" class="size-2.5" stroke="rgb(56,189,248)" stroke-width="1.2">
                  <path d="M1 7L7 1M7 1H3M7 1V5"/>
                </svg>
              </div>
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style="background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.15))">
              </div>
            </NuxtLink>

            <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank"
               class="font-mono text-xs tracking-[0.2em] uppercase text-white/20 hover:text-white/60 transition-colors duration-300">
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         FOOTER
    ═══════════════════════════════════════════ -->
    <footer class="relative overflow-hidden" style="background: #020202; min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end;">
      <div class="footer-reveal flex flex-col h-full">
        <div class="flex-1 flex flex-col lg:flex-row justify-between items-start pt-24 pb-20"
             style="padding-left: 6vw; padding-right: 6vw; max-width: 1600px; margin: 0 auto; width: 100%;">

          <div class="max-w-sm mb-20 lg:mb-0">
            <div class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/15 mb-8">Raya UI — v1.0</div>
            <p class="text-white/20 text-sm leading-relaxed">
              An exclusive, high-performance component registry for Vue and Nuxt engineers. Copy the code. Own the architecture.
            </p>
            <p class="font-mono text-[10px] tracking-[0.25em] uppercase text-white/15 mt-8">
              © {{ new Date().getFullYear() }} —
              <a href="https://iman-mhmdi.ir" target="_blank" class="text-sky-500/60 hover:text-sky-400 transition-colors">Iman</a>
            </p>
          </div>

          <div class="flex gap-20 font-mono text-xs tracking-widest uppercase">
            <div class="flex flex-col gap-5">
              <span class="text-white/15 mb-2">Directory</span>
              <NuxtLink to="/docs/introduction" class="text-white/35 hover:text-white transition-colors">Introduction</NuxtLink>
              <NuxtLink to="/docs/installation" class="text-white/35 hover:text-white transition-colors">Installation</NuxtLink>
              <NuxtLink to="/components" class="text-white/35 hover:text-white transition-colors">Components</NuxtLink>
            </div>
            <div class="flex flex-col gap-5">
              <span class="text-white/15 mb-2">Network</span>
              <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="text-white/35 hover:text-white transition-colors">GitHub</a>
              <a href="https://iman-mhmdi.ir" target="_blank" class="text-white/35 hover:text-white transition-colors">Creator</a>
            </div>
          </div>
        </div>

        <!-- Giant wordmark -->
        <div class="w-full flex items-end justify-center overflow-hidden pb-0 pointer-events-none select-none">
          <div class="font-black tracking-tighter uppercase leading-none text-transparent"
               style="font-size: 17vw; -webkit-text-stroke: 1px rgba(255,255,255,0.04); letter-spacing: -0.06em;">
            RAYA UI
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style>
/* ── GLOBAL RESET ── */
html, body, #__nuxt {
  background: #040404;
  cursor: none;
  -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

/* ── ANIMATIONS ── */
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, -20px) scale(1.1); }
}
@keyframes float-card {
  from { transform: translateY(0px); }
  to   { transform: translateY(-8px); }
}
@keyframes bar-grow {
  from { transform: scaleY(0); transform-origin: bottom; }
  to   { transform: scaleY(1); transform-origin: bottom; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(56,189,248,0.8); }
  50%       { opacity: 0.5; box-shadow: 0 0 2px rgba(56,189,248,0.3); }
}
@keyframes shrink {
  0%   { height: 48px; opacity: 0.4; }
  50%  { height: 20px; opacity: 0.1; }
  100% { height: 48px; opacity: 0.4; }
}

/* ── SELECTION ── */
::selection {
  background: rgba(56,189,248,0.2);
  color: #fff;
}
</style>
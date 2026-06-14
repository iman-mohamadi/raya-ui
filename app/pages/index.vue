<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeNav from "~/components/landing/HomeNav.vue";
import WireframeThumbnail from "~/components/WireframeThumbnail.vue";
import RegistryLivePreview from "~/components/RegistryLivePreview.vue";
import EncryptedText from "~/components/ui/encrypted-text/EncryptedText.vue";

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Raya UI — The Architecture of Systems',
  description: 'Beautifully engineered, high-end components built with Vue & Nuxt. Copy the code. Own the architecture.',
  ogTitle: 'Raya UI — The Architecture of Systems',
  ogDescription: 'Beautifully engineered, high-end components built with Vue & Nuxt. Copy the code. Own the architecture.',
  ogType: 'website',
  ogUrl: 'https://raya-ui.com',
  ogImage: 'https://raya-ui.com/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: 'Raya UI — The Architecture of Systems',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Raya UI — The Architecture of Systems',
  twitterDescription: 'Beautifully engineered, high-end components built with Vue & Nuxt. Copy the code. Own the architecture.',
  twitterImage: 'https://raya-ui.com/og-image.png',
})

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// REFS
// ─────────────────────────────────────────────────────────────────────────────
const cursorRef = ref<HTMLDivElement | null>(null)
const cursorDotRef = ref<HTMLDivElement | null>(null)
const cursorTextRef = ref<HTMLDivElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// ── System HUD state ─────────────────────────────────────────────────────────
const scrollProgress = ref(0)
const systemTime = ref('00:00:00')
const coords = ref('0000 · 0000')
const activeSection = ref(0)
const sections = [
  { id: 'hero-section', label: 'Index' },
  { id: 'manifesto', label: 'Philosophy' },
  { id: 'swap-section', label: 'Principles' },
  { id: 'feature-section', label: 'Why Raya' },
  { id: 'horizontal-worlds', label: 'Registry' },
  { id: 'aesthetic-section', label: 'Aesthetic' },
  { id: 'footer-section', label: 'Initialize' },
]
let clockTimer: ReturnType<typeof setInterval> | null = null
let manifestoST: ScrollTrigger | null = null

// Preloader Refs
const preloaderRef = ref<HTMLElement | null>(null)
const preloaderTop = ref<HTMLElement | null>(null)
const preloaderBottom = ref<HTMLElement | null>(null)
const loadPercent = ref(0)
const isLoaded = ref(false)

let lenis: Lenis | null = null
let raf: ((time: number) => void) | null = null
let animFrame: number | null = null
let sparks: Spark[] = []

let mouseX = -1000
let mouseY = -1000
let scrollVelocity = 0

const reducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ─────────────────────────────────────────────────────────────────────────────
// "DATA SPARKS" — orange points drifting along a pseudo-curl flow field
// ─────────────────────────────────────────────────────────────────────────────
class Spark {
  x = 0; y = 0; vx = 0; vy = 0; size = 1; life = 0; maxLife = 1
  constructor(w: number, h: number) { this.reset(w, h, true) }
  reset(w: number, h: number, initial = false) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = 0
    this.vy = 0
    this.size = Math.random() * 1.1 + 0.4
    this.maxLife = 220 + Math.random() * 320
    this.life = initial ? Math.random() * this.maxLife : 0
  }
  update(w: number, h: number, t: number) {
    // Layered sines approximate a curl-noise flow, giving organic motion.
    const angle = (Math.sin(this.x * 0.0016 + t) + Math.cos(this.y * 0.0015 - t)) * Math.PI
    this.vx += Math.cos(angle) * 0.06
    this.vy += Math.sin(angle) * 0.06

    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const dist = Math.hypot(dx, dy)
    if (dist < 240) {
      const f = (1 - dist / 240) * 0.14
      this.vx += (dx / (dist || 1)) * f
      this.vy += (dy / (dist || 1)) * f
    }

    this.vx *= 0.93
    this.vy *= 0.93
    this.x += this.vx
    this.y += this.vy
    this.life++

    if (this.life > this.maxLife || this.x < -30 || this.x > w + 30 || this.y < -30 || this.y > h + 30) {
      this.reset(w, h)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BLUEPRINT FIELD — a precision grid that ignites around the cursor,
// woven with drifting orange data sparks. Bespoke, on-brand, no clichés.
// ─────────────────────────────────────────────────────────────────────────────
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let dpr = Math.min(window.devicePixelRatio || 1, 2)

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 90)
    sparks = Array.from({ length: count }, () => new Spark(window.innerWidth, window.innerHeight))
  }
  resize()
  window.addEventListener('resize', resize)

  const spacing = 54
  const influence = 210
  let t = 0

  const renderGrid = (w: number, h: number) => {
    for (let x = 0; x <= w; x += spacing) {
      for (let y = 0; y <= h; y += spacing) {
        const dx = mouseX - x
        const dy = mouseY - y
        const dist = Math.hypot(dx, dy)
        if (dist < influence) {
          const f = 1 - dist / influence
          const s = 1.5 + f * 6
          ctx.strokeStyle = `rgba(255,74,0,${0.05 + f * 0.55})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(x - s, y); ctx.lineTo(x + s, y)
          ctx.moveTo(x, y - s); ctx.lineTo(x, y + s)
          ctx.stroke()
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.035)'
          ctx.fillRect(x - 0.5, y - 0.5, 1, 1)
        }
      }
    }
  }

  const draw = () => {
    if (!canvas || !ctx) return
    const w = window.innerWidth
    const h = window.innerHeight

    // Near-black trail fade (invisible over screen blend, leaves spark tails).
    ctx.fillStyle = 'rgba(4,4,4,0.18)'
    ctx.fillRect(0, 0, w, h)

    t += 0.0016 + Math.min(Math.abs(scrollVelocity) * 0.00002, 0.012)
    scrollVelocity *= 0.92

    renderGrid(w, h)

    for (const sp of sparks) {
      sp.update(w, h, t)
      const lf = Math.sin((sp.life / sp.maxLife) * Math.PI)
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,74,0,${0.55 * lf})`
      ctx.fill()
    }

    animFrame = requestAnimationFrame(draw)
  }

  if (reducedMotion()) {
    // Static, calm frame — no animation loop.
    ctx.fillStyle = '#040404'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    renderGrid(window.innerWidth, window.innerHeight)
    return
  }

  draw()
}

// ─────────────────────────────────────────────────────────────────────────────
// SOTD PRELOADER SEQUENCE
// ─────────────────────────────────────────────────────────────────────────────
const runPreloader = () => {
  if (lenis) lenis.stop()

  if (reducedMotion()) {
    loadPercent.value = 100
    gsap.set([preloaderTop.value, preloaderBottom.value], { autoAlpha: 0 })
    gsap.set('.raya-logo-text', { opacity: 1, scale: 1, filter: 'blur(0px)' })
    gsap.set(['.hero-badge', '.hero-meta-content'], { opacity: 1, y: 0, filter: 'blur(0px)' })
    gsap.set('.hero-frame-inner', { opacity: 1, scaleX: 1 })
    isLoaded.value = true
    if (lenis) lenis.start()
    initMotion()
    return
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isLoaded.value = true
      if (lenis) lenis.start()
      initMotion()
    }
  })

  tl.to({ val: 0 }, {
    val: 100,
    duration: 2.5,
    ease: 'power3.inOut',
    onUpdate: function() {
      loadPercent.value = Math.floor(this.targets()[0].val)
    }
  })

  tl.to('.preloader-text', { opacity: 0, scale: 1.1, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' })
  tl.to(preloaderTop.value, { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, 'split')
  tl.to(preloaderBottom.value, { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, 'split')

  tl.fromTo('.raya-logo-text',
      { scale: 0.8, opacity: 0, filter: 'blur(20px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }, 'split+=0.4')

  tl.fromTo('.hero-frame-inner', { opacity: 0, scaleX: 0.9 }, { opacity: 1, scaleX: 1, duration: 1.3, ease: 'power3.out' }, 'split+=0.55')
  tl.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 'split+=0.8')
  tl.fromTo('.hero-meta-content', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, 'split+=0.9')
}

// ─────────────────────────────────────────────────────────────────────────────
// GSAP SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────
const initMotion = () => {
  ScrollTrigger.getAll().forEach(t => t.kill())

  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onEnter: () => gsap.to(navRef.value, { backdropFilter: 'blur(32px)', backgroundColor: 'rgba(4,4,4,0.7)', duration: 0.5 }),
    onLeaveBack: () => gsap.to(navRef.value, { backdropFilter: 'blur(16px)', backgroundColor: 'rgba(4,4,4,0.2)', duration: 0.5 }),
  })

  // The rail is synced via a geometry check (updateActiveSection) driven by the
  // Lenis scroll loop — this is robust even while sections are pinned/scrubbing,
  // because a pinned element's rect keeps covering the viewport for its duration.
  ScrollTrigger.addEventListener('refreshInit', updateActiveSection)

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

  gsap.to('.hero-frame', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: '40% top',
      scrub: true,
    }
  })

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
  manifestoST = manifestoTl.scrollTrigger ?? null

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

  const panels = gsap.utils.toArray<HTMLElement>('.swap-panel')
  const [p0, p1, p2] = panels
  if (p0 && p1 && p2) {
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
    const h0 = p0.querySelector('h2')
    const h1 = p1.querySelector('h2')
    const h2 = p2.querySelector('h2')
    // Each panel clips up into view while its headline counter-rises and the
    // outgoing one drifts — turning a flat swap into a layered, kinetic reveal.
    swapTl
        .fromTo(p1, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
    if (h1) swapTl.fromTo(h1, { yPercent: 60, opacity: 0.4 }, { yPercent: 0, opacity: 1, ease: 'power2.out' }, '<')
    if (h0) swapTl.to(h0, { yPercent: -25, ease: 'none' }, '<')
    swapTl.fromTo(p2, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
    if (h2) swapTl.fromTo(h2, { yPercent: 60, opacity: 0.4 }, { yPercent: 0, opacity: 1, ease: 'power2.out' }, '<')
    if (h1) swapTl.to(h1, { yPercent: -25, ease: 'none' }, '<')
  }

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

  // Desktop only: pin the Registry and translate it horizontally on scroll.
  // On touch/small screens we fall back to a native horizontal swipe strip
  // (see the media query in <style>), which avoids the well-known pinned-
  // horizontal jank on mobile. gsap.matchMedia auto-reverts on resize.
  const mm = gsap.matchMedia()
  mm.add('(min-width: 769px)', () => {
    const hTrack = document.querySelector('.h-track') as HTMLElement | null
    if (!hTrack) return
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
  })

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

// Geometry-based active-section detection: find the section straddling the
// viewport midline. Works while sections are pinned (their rect stays put).
const updateActiveSection = () => {
  const mid = window.innerHeight * 0.5
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i]
    if (!sec) continue
    const el = document.getElementById(sec.id)
    if (!el) continue
    const r = el.getBoundingClientRect()
    if (r.top <= mid && r.bottom > mid) {
      activeSection.value = i
      return
    }
  }
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return

  // The manifesto pins and reveals its text via scrub, so its top is "empty".
  // Jump partway into its scroll range to land on the fully-revealed copy.
  let target: number | HTMLElement = el
  if (id === 'manifesto' && manifestoST) {
    target = manifestoST.start + (manifestoST.end - manifestoST.start) * 0.5
  }

  if (lenis) lenis.scrollTo(target as any, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

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
// AUDIO: IDM Bypass & Ambient System
// ─────────────────────────────────────────────────────────────────────────────
const isAudioMuted = useState('isAudioMuted', () => false)
const ambientAudioRef = ref<HTMLAudioElement | null>(null)
const hoverAudioRef = ref<HTMLAudioElement | null>(null)
let ambientStarted = false
const userInteracted = ref(false)

const startAmbientAudio = async () => {
  if (!userInteracted.value) {
    userInteracted.value = true
    gsap.to(cursorTextRef.value, { opacity: 0, duration: 0.3, onComplete: () => {
      if (cursorTextRef.value) cursorTextRef.value.style.display = 'none'
    }})
  }
  
  if (ambientStarted || !ambientAudioRef.value || !ambientAudioRef.value.src) return
  
  ambientStarted = true

  try {
    ambientAudioRef.value.volume = 0.5
    ambientAudioRef.value.muted = isAudioMuted.value
    ambientAudioRef.value.play().catch(() => {})
  } catch (err) {
    console.error("Audio initialization failed:", err)
  }
}

watch(isAudioMuted, (muted) => {
  if (ambientAudioRef.value) {
    ambientAudioRef.value.muted = muted
  }
})

// Object URLs are released on unmount.
const objectUrls: string[] = []

// Fetched as a blob (never as a media URL), so download managers like IDM
// can't intercept it, and we skip the costly base64 conversion entirely.
const loadAudioSecurely = async (audioRef: any, path: string): Promise<void> => {
  try {
    const res = await fetch(path, { cache: 'force-cache' })
    if (!res.ok) return
    const raw = await res.blob()
    const url = URL.createObjectURL(new Blob([raw], { type: 'audio/wav' }))
    objectUrls.push(url)
    if (audioRef.value) audioRef.value.src = url
  } catch {
    /* network/decoding errors are non-fatal — the page works without audio */
  }
}

const playAudio = (audioEl: HTMLAudioElement | null, volume: number = 0.2) => {
  if (audioEl && audioEl.src && !isAudioMuted.value) {
    audioEl.volume = volume
    audioEl.currentTime = 0
    audioEl.play().catch(() => {})
  }
}

const toggleMute = () => {
  isAudioMuted.value = !isAudioMuted.value
}

// ─────────────────────────────────────────────────────────────────────────────
// MOUNT
// ─────────────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await nextTick()

  // Load ambient audio as a blob (no media URL → invisible to IDM, no base64 bloat).
  ;(async () => {
    try {
      const res = await fetch('/audio/ambient-loop.txt', { cache: 'force-cache' })
      if (!res.ok) return
      const raw = await res.blob()
      const url = URL.createObjectURL(new Blob([raw], { type: 'audio/mpeg' }))
      objectUrls.push(url)
      if (ambientAudioRef.value) {
        ambientAudioRef.value.src = url
        if (userInteracted.value && !ambientStarted) {
          ambientStarted = true
          ambientAudioRef.value.volume = 0.5
          ambientAudioRef.value.muted = isAudioMuted.value
          ambientAudioRef.value.play().catch(() => {})
        }
      }
    } catch { /* audio is optional */ }
  })()

  loadAudioSecurely(hoverAudioRef, '/audio/secondary-hover.txt')

  // Initialize Ambient Audio specifically on the first interaction
  window.addEventListener('click', startAmbientAudio)

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

  lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis.on('scroll', (e: any) => {
    ScrollTrigger.update()
    scrollVelocity = e?.velocity ?? 0
    scrollProgress.value = e?.progress ?? 0
    updateActiveSection()
  })
  raf = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  initCanvas()

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    coords.value = `${String(Math.round(e.clientX)).padStart(4, '0')} · ${String(Math.round(e.clientY)).padStart(4, '0')}`
    gsap.to(cursorRef.value, { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power2.out' })
    gsap.to(cursorDotRef.value, { x: e.clientX, y: e.clientY, duration: 0.06 })
    
    if (!userInteracted.value && cursorTextRef.value) {
      gsap.to(cursorTextRef.value, { x: e.clientX + 20, y: e.clientY + 20, duration: 0.18, ease: 'power2.out' })
    }
  })

  document.querySelectorAll('a, button, .hover-target').forEach(el => {
    el.addEventListener('mouseenter', () => {
      playAudio(hoverAudioRef.value, 0.1)
      gsap.to(cursorRef.value, { scale: 3.5, opacity: 0.15, duration: 0.35 })
      gsap.to(cursorDotRef.value, { scale: 0.5, duration: 0.3 })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(cursorRef.value, { scale: 1, opacity: 1, duration: 0.35 })
      gsap.to(cursorDotRef.value, { scale: 1, duration: 0.3 })
    })
  })

  const tick = () => {
    const d = new Date()
    systemTime.value =
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  }
  tick()
  clockTimer = setInterval(tick, 1000)

  runPreloader()

  window.addEventListener('resize', () => ScrollTrigger.refresh())
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  if (raf) gsap.ticker.remove(raf)
  lenis?.destroy()
  if (animFrame) cancelAnimationFrame(animFrame)
  if (clockTimer) clearInterval(clockTimer)
  objectUrls.forEach(URL.revokeObjectURL)
  window.removeEventListener('click', startAmbientAudio)
})

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
      class="home-root bg-[#040404] text-[#FAFAFA] min-h-screen overflow-x-hidden font-sans relative selection:bg-[#FF4A00]/30 selection:text-[#FF4A00]"
      style="cursor: none;"
  >
    <audio ref="ambientAudioRef" loop style="display: none;"></audio>
    <audio ref="hoverAudioRef" style="display: none;"></audio>

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
        class="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border border-white/60 z-[9999] pointer-events-none mix-blend-difference"
        style="transform: translate(-50%, -50%)"
    />
    <div
        ref="cursorDotRef"
        class="custom-cursor fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white z-[9999] pointer-events-none"
        style="transform: translate(-50%, -50%)"
    />

    <div
        ref="cursorTextRef"
        class="custom-cursor fixed top-0 left-0 font-mono text-[9px] tracking-[0.2em] uppercase text-[#FF4A00] z-[9999] pointer-events-none mix-blend-difference whitespace-nowrap opacity-70"
        style="transform: translate(-1000px, -1000px);"
    >
      Click to enable audio
    </div>

    <canvas
        ref="canvasRef"
        class="fixed inset-0 z-[2] pointer-events-none opacity-70 mix-blend-screen"
    />

    <div
        class="fixed inset-0 z-[3] pointer-events-none"
        aria-hidden="true"
        style="background: radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%);"
    />

    <div class="grain-overlay fixed inset-0 z-[400] pointer-events-none" aria-hidden="true" />

    <div class="fixed top-0 left-0 right-0 h-[2px] z-[8500] pointer-events-none">
      <div class="h-full bg-[#FF4A00] origin-left" :style="{ transform: `scaleX(${scrollProgress})` }" />
    </div>

    <div class="fixed inset-0 z-[150] pointer-events-none hidden md:block mix-blend-difference" aria-hidden="true">
      <div class="absolute top-6 left-6 w-3 h-3 border-t border-l border-white/25" />
      <div class="absolute top-6 right-6 w-3 h-3 border-t border-r border-white/25" />
      <div class="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-white/25" />
      <div class="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-white/25" />

      <div class="absolute top-[26px] left-11 flex items-center gap-3 font-mono text-[9px] tracking-[0.25em] uppercase text-white/45">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-white system-pulse" />
          SYS·ONLINE
        </span>
        <span class="w-px h-3 bg-white/20" />
        <span class="tabular-nums">{{ systemTime }}</span>
      </div>

      <div class="absolute bottom-[22px] left-11 font-mono text-[9px] tracking-[0.25em] uppercase text-white/35 tabular-nums">
        CRD {{ coords }}
      </div>
    </div>

    <div class="fixed right-8 top-1/2 -translate-y-1/2 z-[150] hidden lg:flex flex-col items-end gap-3.5 mix-blend-difference">
      <button
          v-for="(sec, i) in sections"
          :key="sec.id"
          type="button"
          @click="scrollToSection(sec.id)"
          class="hover-target group flex items-center gap-2.5 pointer-events-auto"
          :aria-label="`Jump to ${sec.label}`"
      >
        <span
            class="font-mono text-[8px] tracking-[0.25em] uppercase transition-all duration-300 text-white"
            :class="activeSection === i ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'"
        ><EncryptedText :text="sec.label" trigger="hover" /></span>
        <span
            class="h-px bg-white transition-all duration-300"
            :class="activeSection === i ? 'w-7 opacity-100' : 'w-3 opacity-40 group-hover:w-5'"
        />
      </button>
    </div>

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
        <EncryptedText text="Components" trigger="hover" />
      </NuxtLink>
      <div class="w-px h-3 bg-white/20" />
      <NuxtLink
          to="/docs/introduction"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:text-[#FF4A00] transition-colors duration-300 hover-target"
      >
        <EncryptedText text="Docs" trigger="hover" />
      </NuxtLink>
      <div class="w-px h-3 bg-white/20" />
      <a
          href="https://github.com/iman-mohamadi/raya-ui"
          target="_blank"
          class="dock-link text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF4A00] hover:opacity-70 transition-opacity duration-300 hover-target"
      >
        <EncryptedText text="GitHub ↗" trigger="hover" />
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

        <div class="hero-frame absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 md:px-12 z-[5] pointer-events-none">
          <div class="hero-frame-inner max-w-[1500px] mx-auto flex items-center gap-5 opacity-0">
            <span class="font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 whitespace-nowrap">Fig. 00 — Wordmark</span>
            <span class="relative h-px flex-1 bg-gradient-to-r from-white/5 via-white/20 to-white/5">
              <span class="absolute left-1/4 -top-1.5 w-px h-3 bg-white/15" />
              <span class="absolute left-1/2 -top-1.5 w-px h-3 bg-white/15" />
              <span class="absolute left-3/4 -top-1.5 w-px h-3 bg-white/15" />
            </span>
            <span class="font-mono text-[9px] tracking-[0.35em] uppercase text-[#FF4A00]/60 whitespace-nowrap">Vue · Nuxt · TS</span>
          </div>
        </div>

        <div class="absolute bottom-[12vh] left-1/2 -translate-x-1/2 text-center w-full z-10 px-6 pointer-events-none">
          <div class="hero-meta-content flex flex-col items-center gap-4 w-full">
            <div class="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-[#FF4A00] animate-pulse" />
              <span class="font-mono text-[9px] tracking-[0.4em] uppercase text-white/60">Vue · Nuxt · Tailwind</span>
            </div>

            <div class="flex items-center gap-3 font-mono text-[9px] tracking-[0.4em] uppercase text-white/25">
              <span class="w-5 h-px bg-white/20" />
              <span>00 / The Architecture of Systems</span>
              <span class="w-5 h-px bg-white/20" />
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
                    <EncryptedText text="Explore Registry" trigger="hover" />
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
              Own <span class="font-serif italic text-[#FF4A00] lowercase font-light">the</span> <br /> Physics.
            </h2>
            <p class="text-black/35 font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
              GSAP-powered motion architecture.
            </p>
          </div>
        </div>

        <div class="swap-panel absolute inset-0 bg-[#FF4A00] text-black flex items-center justify-center p-6" style="clip-path: inset(100% 0% 0% 0%)">
          <div class="text-center max-w-4xl">
            <h2 class="text-[clamp(38px,8vw,120px)] font-black uppercase tracking-tighter leading-none mb-6">
              Build <span class="font-serif italic text-black/30 lowercase font-light">the</span> <br /> Unseen.
            </h2>
            <p class="text-black/50 font-mono text-xs md:text-sm uppercase tracking-[0.2em] font-bold">
              WAI-ARIA bedrock. Screen-reader native.
            </p>
          </div>
        </div>
      </section>

      <section id="feature-section" class="relative py-32 px-6 md:px-12 bg-[#040404]">
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
                @mousemove="handleTilt($event, $event.currentTarget as HTMLElement)"
                @mouseleave="resetTilt($event.currentTarget as HTMLElement)"
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
                <div class="relative h-24 w-full flex items-center justify-start mb-8 opacity-60 group-hover:opacity-100 transition-all duration-500 transform-gpu group-hover:translate-x-2" :style="`color: ${comp.color}`">
                  <RegistryLivePreview :component="comp.name" :color="comp.color" />
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
                  <EncryptedText text="View source" trigger="hover" />
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
              <EncryptedText text="View All →" trigger="hover" />
            </NuxtLink>
          </div>
        </div>
      </section>

      <section id="aesthetic-section" class="relative py-32 px-6 md:px-12 bg-[#040404] overflow-hidden">
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

      <footer id="footer-section" class="relative min-h-screen bg-[#020202] flex flex-col justify-between p-6 md:p-12 pb-[8vh] border-t border-white/5 overflow-hidden">
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
                    <EncryptedText text="Get Started →" trigger="hover" />
                  </span>
                  <div class="absolute -top-px -left-px w-2 h-2 border-t border-l border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div class="absolute -top-px -right-px w-2 h-2 border-t border-r border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div class="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div class="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-[#FF4A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </NuxtLink>

              <NuxtLink to="/components" class="hover-target flex items-center gap-2 px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors duration-300 border border-white/8 hover:border-white/20">
                <EncryptedText text="View Components" trigger="hover" />
              </NuxtLink>
            </div>
          </div>

          <div class="flex flex-col justify-end gap-8">
            <div>
              <h4 class="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-4">Directory</h4>
              <ul class="space-y-2">
                <li><NuxtLink to="/docs/introduction" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target"><EncryptedText text="Introduction" trigger="hover" /></NuxtLink></li>
                <li><NuxtLink to="/docs/installation" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target"><EncryptedText text="Installation" trigger="hover" /></NuxtLink></li>
                <li><NuxtLink to="/components" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target"><EncryptedText text="Components" trigger="hover" /></NuxtLink></li>
              </ul>
            </div>
            <div>
              <h4 class="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-4">Network</h4>
              <ul class="space-y-2">
                <li>
                  <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-[#FF4A00] transition-colors duration-300 hover-target">
                    <EncryptedText text="GitHub ↗" trigger="hover" />
                  </a>
                </li>
                <li>
                  <a href="https://iman-mhmdi.ir" target="_blank" class="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300 hover-target">
                    <EncryptedText text="Creator ↗" trigger="hover" />
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
          <a href="https://iman-mhmdi.ir" target="_blank" class="text-[#FF4A00]/60 hover:text-[#FF4A00] transition-colors duration-300"><EncryptedText text="Iman" trigger="hover" /></a>
          · MIT License
        </p>
      </footer>

      <!-- Global Audio Mute/Unmute Button -->
      <button
          @click="toggleMute"
          @mouseenter="playAudio(hoverAudioRef, 0.1)"
          class="fixed bottom-8 right-6 md:right-12 z-[9000] w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-[#040404]/50 backdrop-blur-md group hover-target hover:border-[#FF4A00]/50 transition-all duration-300 pointer-events-auto"
      >
        <svg v-if="!isAudioMuted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white group-hover:text-[#FF4A00] transition-colors">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/40 group-hover:text-[#FF4A00] transition-colors">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="1" x2="1" y2="23"></line>
        </svg>
      </button>

    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Playfair+Display:ital,wght@1,300;1,400&display=swap');

html, body {
  overflow-x: hidden;
  background: #040404;
}

body { margin: 0; }

.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

/* ── Display voice: a distinctive grotesque for the headline system, paired
   with the mono HUD and Playfair italic accents. Serif accent words keep
   their own face (excluded below). ──────────────────────────────────────── */
.font-display,
#hero-section h1,
.manifesto-line:not(.font-serif),
#swap-section h2,
#feature-section h2,
#aesthetic-section h2,
#horizontal-worlds h2,
#footer-section h2,
.marquee-text {
  font-family: 'Bricolage Grotesque', 'Geist', sans-serif;
  font-weight: 800;
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

/* ── Film grain: kills banding in the big blurs, adds analog texture ───────── */
.grain-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.055;
  mix-blend-mode: overlay;
  animation: grainShift 0.7s steps(1) infinite;
}

@keyframes grainShift {
  0%   { background-position: 0 0; }
  10%  { background-position: -12% -8%; }
  20%  { background-position: 8% -14%; }
  30%  { background-position: -8% 12%; }
  40%  { background-position: 14% 6%; }
  50%  { background-position: -14% -10%; }
  60%  { background-position: 10% 14%; }
  70%  { background-position: -10% 8%; }
  80%  { background-position: 12% -12%; }
  90%  { background-position: -6% 10%; }
  100% { background-position: 0 0; }
}

.system-pulse {
  animation: systemPulse 2.4s ease-in-out infinite;
}
@keyframes systemPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* ── Keyboard accessibility ────────────────────────────────────────────────── */
:focus:not(:focus-visible) { outline: none; }
:focus-visible {
  outline: 2px solid #FF4A00;
  outline-offset: 3px;
  border-radius: 2px;
}

/* ── Restore native cursor where a custom one makes no sense ───────────────── */
@media (hover: none), (pointer: coarse) {
  .home-root { cursor: auto !important; }
  .custom-cursor { display: none !important; }
}

/* ── Honour reduced-motion preference ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .grain-overlay,
  .system-pulse,
  .animate-ping,
  .animate-pulse {
    animation: none !important;
  }
  /* Neutralise the decorative scroll-hint line. */
  #hero-section [style*="scrollLine"] {
    animation: none !important;
    opacity: 0;
  }
  .home-root { cursor: auto !important; }
  .custom-cursor { display: none !important; }
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }
}

@media (max-width: 768px) {
  /* Native horizontal swipe strip for the Registry (no GSAP pin on mobile). */
  #horizontal-worlds {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    scroll-padding-left: 1.5rem;
  }
  #horizontal-worlds .h-track {
    width: max-content;
    padding-right: 1.5rem;
  }
  #horizontal-worlds .h-track > * {
    scroll-snap-align: start;
  }
}
</style>
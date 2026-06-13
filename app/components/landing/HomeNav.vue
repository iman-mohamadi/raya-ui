<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const menuRef = ref<HTMLDivElement | null>(null)
const isMenuOpen = ref(false)
const encryptedRefs = ref<HTMLSpanElement[]>([])
const menuBtnRef = ref<HTMLButtonElement | null>(null)

// ─── AUDIO ENGINE ─────────────────────────────────────────────────────────────
let ctx: AudioContext | null = null
let bgDroneNode: OscillatorNode | null = null
let bgDroneGain: GainNode | null = null
let bgStarted = false

const ac = () => {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx
}

// Master compressor — glues everything together, prevents clipping
const getMaster = () => {
  const c = ac()
  const comp = c.createDynamicsCompressor()
  comp.threshold.value = -12
  comp.knee.value = 6
  comp.ratio.value = 4
  comp.attack.value = 0.003
  comp.release.value = 0.15
  comp.connect(c.destination)
  return comp
}

// ── BACKGROUND AMBIENT DRONE ──────────────────────────────────────────────────
// Layered: sub drone (40Hz) + harmonic shimmer (80Hz) + high shimmer (2400Hz noise)
const startAmbientDrone = () => {
  if (bgStarted) return
  bgStarted = true
  const c = ac()
  const master = getMaster()

  bgDroneGain = c.createGain()
  bgDroneGain.gain.setValueAtTime(0, c.currentTime)
  bgDroneGain.gain.linearRampToValueAtTime(0.06, c.currentTime + 3)
  bgDroneGain.connect(master)

  // Sub oscillator
  const sub = c.createOscillator()
  sub.type = 'sine'
  sub.frequency.value = 42
  sub.connect(bgDroneGain)
  sub.start()
  bgDroneNode = sub

  // Harmonic 2nd
  const h2 = c.createOscillator()
  const h2g = c.createGain()
  h2g.gain.value = 0.35
  h2.type = 'sine'
  h2.frequency.value = 84
  h2.connect(h2g)
  h2g.connect(bgDroneGain)
  h2.start()

  // Harmonic 3rd (very soft)
  const h3 = c.createOscillator()
  const h3g = c.createGain()
  h3g.gain.value = 0.12
  h3.type = 'sine'
  h3.frequency.value = 126
  h3.connect(h3g)
  h3g.connect(bgDroneGain)
  h3.start()

  // High-freq shimmer — filtered noise
  const bufSz = c.sampleRate * 3
  const buf = c.createBuffer(1, bufSz, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < bufSz; i++) d[i] = Math.random() * 2 - 1
  const shimmerSrc = c.createBufferSource()
  shimmerSrc.buffer = buf
  shimmerSrc.loop = true
  const hpf = c.createBiquadFilter()
  hpf.type = 'highpass'
  hpf.frequency.value = 3200
  hpf.Q.value = 0.7
  const shimmerGain = c.createGain()
  shimmerGain.gain.value = 0.018
  shimmerSrc.connect(hpf)
  hpf.connect(shimmerGain)
  shimmerGain.connect(bgDroneGain)
  shimmerSrc.start()

  // Very slow LFO on sub freq for living feel
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfoGain.gain.value = 1.5
  lfo.type = 'sine'
  lfo.frequency.value = 0.08
  lfo.connect(lfoGain)
  lfoGain.connect(sub.frequency)
  lfo.start()
}

const stopAmbientDrone = () => {
  if (!bgDroneGain || !ctx) return
  bgDroneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
}

// ── MENU HOVER BIP ────────────────────────────────────────────────────────────
// Hubtown: clean sine ping, very short, slight upward pitch
const playBip = () => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime

  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g); g.connect(m)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(900, now)
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.06)

  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.18, now + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

  osc.start(now); osc.stop(now + 0.1)
}

// ── MENU OPEN: WHOOSH + PER-CHAR TYPING TICKS ─────────────────────────────────
// This is the key Hubtown sound: a whoosh as the panel opens,
// then each character ticks as it types in.
let openTickIntervals: ReturnType<typeof setInterval>[] = []

const clearOpenTicks = () => {
  openTickIntervals.forEach(clearInterval)
  openTickIntervals = []
}

const playMenuOpenWhoosh = () => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime

  // Low whoosh sweep — the "door opening" feeling
  const bufSz = Math.floor(c.sampleRate * 0.6)
  const buf = c.createBuffer(1, bufSz, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSz; i++) {
    const env = Math.sin((i / bufSz) * Math.PI) // bell envelope
    data[i] = (Math.random() * 2 - 1) * env
  }
  const src = c.createBufferSource()
  src.buffer = buf
  const lpf = c.createBiquadFilter()
  lpf.type = 'lowpass'
  lpf.frequency.setValueAtTime(120, now)
  lpf.frequency.exponentialRampToValueAtTime(800, now + 0.4)
  lpf.frequency.exponentialRampToValueAtTime(80, now + 0.6)
  const whooshGain = c.createGain()
  whooshGain.gain.value = 0.22
  src.connect(lpf); lpf.connect(whooshGain); whooshGain.connect(m)
  src.start(now)

  // Air release hiss
  const hissBuf = c.createBuffer(1, Math.floor(c.sampleRate * 0.3), c.sampleRate)
  const hissData = hissBuf.getChannelData(0)
  for (let i = 0; i < hissData.length; i++) hissData[i] = Math.random() * 2 - 1
  const hissSrc = c.createBufferSource()
  hissSrc.buffer = hissBuf
  const hpf = c.createBiquadFilter()
  hpf.type = 'highpass'
  hpf.frequency.value = 3000
  const hissGain = c.createGain()
  hissGain.gain.setValueAtTime(0.07, now)
  hissGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
  hissSrc.connect(hpf); hpf.connect(hissGain); hissGain.connect(m)
  hissSrc.start(now)
}

// One tick per character — the Hubtown "typewriter" render sound
const playCharTick = (charIndex: number) => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime

  // Pitch slightly randomized per char for organic feel
  const baseFreq = 900 + (charIndex % 5) * 60
  const freq = baseFreq + (Math.random() * 80 - 40)

  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g); g.connect(m)
  osc.type = 'square'
  osc.frequency.value = freq

  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.04, now + 0.002)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)

  osc.start(now); osc.stop(now + 0.045)
}

// ── LINK HOVER TICK ───────────────────────────────────────────────────────────
// Hubtown: extremely short, high-pitched, almost subliminal
const playHoverTick = () => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime

  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g); g.connect(m)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1400, now)
  osc.frequency.exponentialRampToValueAtTime(1800, now + 0.025)
  g.gain.setValueAtTime(0.07, now)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)
  osc.start(now); osc.stop(now + 0.04)
}

// ── MENU CLOSE ────────────────────────────────────────────────────────────────
const playMenuClose = () => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime

  // Reverse whoosh
  const bufSz = Math.floor(c.sampleRate * 0.3)
  const buf = c.createBuffer(1, bufSz, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSz; i++) {
    const env = 1 - (i / bufSz)
    data[i] = (Math.random() * 2 - 1) * env * 0.5
  }
  const src = c.createBufferSource()
  src.buffer = buf
  const lpf = c.createBiquadFilter()
  lpf.type = 'lowpass'
  lpf.frequency.setValueAtTime(600, now)
  lpf.frequency.exponentialRampToValueAtTime(80, now + 0.3)
  const g = c.createGain()
  g.gain.value = 0.15
  src.connect(lpf); lpf.connect(g); g.connect(m)
  src.start(now)

  // Low confirmation thud
  const thud = c.createOscillator()
  const tg = c.createGain()
  thud.connect(tg); tg.connect(m)
  thud.type = 'sine'
  thud.frequency.setValueAtTime(80, now)
  thud.frequency.exponentialRampToValueAtTime(30, now + 0.12)
  tg.gain.setValueAtTime(0.2, now)
  tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)
  thud.start(now); thud.stop(now + 0.18)
}

// ─── ENCRYPTED TEXT EFFECT ────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}~|¥§'

const encryptReveal = (el: HTMLSpanElement, finalText: string, onChar?: (i: number) => void) => {
  const chars = finalText.split('')
  const totalMs = 650
  const msPerChar = totalMs / chars.length
  let revealed = 0

  const scramble = () => {
    let result = ''
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ' ') { result += ' '; continue }
      if (i < revealed) {
        result += chars[i]
      } else {
        result += CHARS[Math.floor(Math.random() * CHARS.length)]
      }
    }
    el.textContent = result
  }

  // Scramble fast at start, then reveal left→right
  let scrambleCount = 0
  const scrambleInterval = setInterval(() => {
    scramble()
    scrambleCount++
    if (scrambleCount > 6) clearInterval(scrambleInterval)
  }, 40)

  const revealInterval = setInterval(() => {
    if (revealed >= chars.length) {
      clearInterval(revealInterval)
      el.textContent = finalText
      return
    }
    if (onChar) onChar(revealed)
    revealed++
    scramble()
  }, msPerChar)

  return revealInterval
}

const navLinks = [
  { name: 'COMPONENTS', href: '/components' },
  { name: 'DOCUMENTATION', href: '/docs/introduction' },
  { name: 'GITHUB', href: 'https://github.com/iman-mohamadi/raya-ui', external: true }
]

// ─── MENU OPEN / CLOSE ────────────────────────────────────────────────────────
let revealIntervals: ReturnType<typeof setInterval>[] = []

const clearRevealIntervals = () => {
  revealIntervals.forEach(clearInterval)
  revealIntervals = []
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  startAmbientDrone()

  if (isMenuOpen.value) {
    playMenuOpenWhoosh()
    clearRevealIntervals()

    gsap.set(menuRef.value, { display: 'flex' })
    gsap.to(menuRef.value, {
      clipPath: 'circle(170% at 94% 4%)',
      duration: 1.2,
      ease: 'expo.inOut'
    })

    // Stagger each link, each with per-char tick
    encryptedRefs.value.forEach((el, i) => {
      if (!el) return
      const text = navLinks[i].name
      el.textContent = Array.from({ length: text.length }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('')

      const itemEl = el.closest('.menu-item-wrap') as HTMLElement
      gsap.fromTo(itemEl,
          { y: 70, opacity: 0, skewX: '4deg' },
          {
            y: 0, opacity: 1, skewX: '0deg',
            duration: 1.0,
            ease: 'expo.out',
            delay: 0.3 + i * 0.14,
            onStart: () => {
              const iv = encryptReveal(el, text, (charIdx) => playCharTick(charIdx))
              revealIntervals.push(iv)
            }
          }
      )
    })

    gsap.fromTo('.menu-meta-line',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.85, ease: 'power2.out' }
    )

  } else {
    playMenuClose()
    clearRevealIntervals()

    const items = encryptedRefs.value
        .map(el => el?.closest('.menu-item-wrap'))
        .filter(Boolean) as HTMLElement[]

    gsap.to(items, {
      y: -40, opacity: 0, skewX: '-3deg',
      stagger: 0.05, duration: 0.3, ease: 'power2.in'
    })
    gsap.to('.menu-meta-line', { opacity: 0, duration: 0.2 })
    gsap.to(menuRef.value, {
      clipPath: 'circle(0% at 94% 4%)',
      duration: 1.0,
      ease: 'expo.inOut',
      delay: 0.12,
      onComplete: () => gsap.set(menuRef.value, { display: 'none' })
    })
  }
}

const onMenuBtnEnter = () => {
  startAmbientDrone()
  playBip()
}

const onLinkEnter = (i: number) => {
  playHoverTick()
  const el = encryptedRefs.value[i]
  if (!el || !isMenuOpen.value) return
  const text = navLinks[i].name
  encryptReveal(el, text)
}

const onLinkLeave = (i: number) => {
  const el = encryptedRefs.value[i]
  if (!el) return
  el.textContent = navLinks[i].name
}

// Init: start drone on first any click on page
onMounted(() => {
  const firstTouch = () => {
    startAmbientDrone()
    window.removeEventListener('click', firstTouch)
    window.removeEventListener('touchstart', firstTouch)
  }
  window.addEventListener('click', firstTouch)
  window.addEventListener('touchstart', firstTouch)
})

onBeforeUnmount(() => {
  clearRevealIntervals()
  clearOpenTicks()
  stopAmbientDrone()
})
</script>

<template>
  <nav
      class="fixed top-0 left-0 right-0 z-[8000] px-8 py-8 flex justify-between items-center pointer-events-none"
  >
    <span />

    <!-- Menu Toggle Button -->
    <button
        ref="menuBtnRef"
        @click="toggleMenu"
        @mouseenter="onMenuBtnEnter"
        class="pointer-events-auto relative w-14 h-14 flex flex-col items-center justify-center gap-[7px] group mix-blend-difference"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isMenuOpen"
    >
      <!-- Ripple ring on hover -->
      <span
          class="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/30 group-hover:scale-125 transition-all duration-500 ease-out"
      />
      <div
          class="w-8 h-[1.5px] bg-white transition-all duration-500 origin-center"
          :class="isMenuOpen ? 'rotate-45 translate-y-[4.25px]' : ''"
      />
      <div
          class="h-[1.5px] bg-white transition-all duration-500 origin-right"
          :class="isMenuOpen
          ? 'w-8 -rotate-45 -translate-y-[4.25px]'
          : 'w-5 self-end'"
      />
    </button>
  </nav>

  <!-- Full-screen overlay -->
  <Teleport to="body">
    <div
        ref="menuRef"
        class="fixed inset-0 z-[7500] hidden items-center justify-center overflow-hidden"
        :style="{ background: '#FF4500', clipPath: 'circle(0% at 94% 4%)' }"
        :aria-hidden="!isMenuOpen"
    >
      <!-- Scan-line texture -->
      <div
          class="absolute inset-0 pointer-events-none opacity-[0.04]"
          style="background: repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 3px)"
      />

      <!-- Vertical grid lines -->
      <div class="absolute inset-0 flex pointer-events-none">
        <div
            v-for="n in 8" :key="n"
            class="flex-1 border-r border-black/10"
        />
      </div>

      <!-- Content -->
      <div class="relative z-10 w-full max-w-6xl px-12 md:px-24">

        <!-- Top label -->
        <div class="menu-meta-line mb-10 flex items-center gap-3 font-mono text-[10px] tracking-[0.5em] uppercase text-black/35 opacity-0">
          <span class="block w-8 h-px bg-black/25" />
          Navigation / System
          <span class="block w-8 h-px bg-black/25" />
        </div>

        <!-- Nav links -->
        <nav>
          <div
              v-for="(link, i) in navLinks"
              :key="link.href"
              class="menu-item-wrap overflow-hidden opacity-0"
          >
            <component
                :is="link.external ? 'a' : 'NuxtLink'"
                :href="link.external ? link.href : undefined"
                :to="link.external ? undefined : link.href"
                :target="link.external ? '_blank' : undefined"
                @mouseenter="onLinkEnter(i)"
                @mouseleave="onLinkLeave(i)"
                class="group relative flex items-baseline gap-5 py-1 cursor-pointer"
            >
              <!-- Index number -->
              <span class="font-mono text-[12px] tracking-widest text-black/30 mb-1 shrink-0 tabular-nums">
                {{ String(i + 1).padStart(2, '0') }}.
              </span>

              <!-- Main text with encrypt -->
              <span
                  :ref="(el) => { if (el) encryptedRefs[i] = el as HTMLSpanElement }"
                  class="block font-black uppercase tracking-tighter leading-none text-black group-hover:text-white transition-colors duration-300"
                  style="font-size: clamp(48px, 9vw, 136px); font-variant-numeric: tabular-nums;"
              >
                {{ link.name }}
              </span>

              <!-- Arrow on hover -->
              <span
                  class="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-3 font-mono text-white"
                  style="font-size: clamp(24px, 3vw, 42px);"
              >
                ↗
              </span>

              <!-- Bottom line -->
              <span
                  class="absolute bottom-0 left-0 h-[1.5px] bg-black/20 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              />
            </component>
          </div>
        </nav>

        <!-- Bottom meta -->
        <div class="menu-meta-line mt-14 flex items-center gap-8 font-mono text-[10px] tracking-[0.35em] uppercase text-black/30 opacity-0">
          <span>© {{ new Date().getFullYear() }} Raya UI</span>
          <span>·</span>
          <span>MIT License</span>
          <span>·</span>
          <a href="https://iman-mhmdi.ir" target="_blank" class="hover:text-black transition-colors">
            By Iman ↗
          </a>
        </div>
      </div>

      <!-- Background watermark -->
      <div class="absolute -bottom-8 -right-8 pointer-events-none select-none overflow-hidden leading-none">
        <span
            class="font-black italic uppercase text-transparent opacity-[0.07]"
            style="font-size: 32vw; -webkit-text-stroke: 1.5px rgba(0,0,0,0.6);"
        >
          R
        </span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.menu-item-wrap {
  transform: translateY(70px);
}
</style>
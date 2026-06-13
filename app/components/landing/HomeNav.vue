<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import EncryptedText from '~/components/ui/encrypted-text/EncryptedText.vue'

const menuRef = ref<HTMLDivElement | null>(null)
const isMenuOpen = ref(false)
const menuBtnRef = ref<HTMLButtonElement | null>(null)
const linkRefs = ref<InstanceType<typeof EncryptedText>[]>([])

// ─── UI AUDIO ENGINE (Local interaction sounds only) ─────────────────────────
let ctx: AudioContext | null = null

const ac = () => {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx
}

const getMaster = () => {
  const c = ac()
  const comp = c.createDynamicsCompressor()
  comp.threshold.value = -12
  comp.connect(c.destination)
  return comp
}

const playBip = () => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g); g.connect(m)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, now)
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04)

  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.12, now + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

  osc.start(now); osc.stop(now + 0.06)
}

const playMenuOpenWhoosh = () => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime

  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g); g.connect(m)

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(40, now)
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.3)

  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.15, now + 0.1)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)

  osc.start(now); osc.stop(now + 0.45)
}

const playMenuClose = () => {
  const c = ac()
  const m = getMaster()
  const now = c.currentTime
  const thud = c.createOscillator()
  const tg = c.createGain()
  thud.connect(tg); tg.connect(m)

  thud.type = 'sine'
  thud.frequency.setValueAtTime(150, now)
  thud.frequency.exponentialRampToValueAtTime(30, now + 0.15)

  tg.gain.setValueAtTime(0.2, now)
  tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)

  thud.start(now); thud.stop(now + 0.25)
}

const navLinks = [
  { name: 'COMPONENTS', href: '/components' },
  { name: 'DOCUMENTATION', href: '/docs/introduction' },
  { name: 'GITHUB', href: 'https://github.com/iman-mohamadi/raya-ui', external: true }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  // We ping the context in case it was suspended
  ac().resume()

  if (isMenuOpen.value) {
    playMenuOpenWhoosh()
    gsap.set(menuRef.value, { display: 'flex' })
    gsap.to(menuRef.value, { clipPath: 'circle(170% at 94% 4%)', duration: 1.2, ease: 'expo.inOut' })

    gsap.utils.toArray('.menu-item-wrap').forEach((el: any, i) => {
      gsap.fromTo(el,
          { y: 70, opacity: 0, skewX: '4deg' },
          {
            y: 0, opacity: 1, skewX: '0deg',
            duration: 1.0, ease: 'expo.out', delay: 0.3 + i * 0.14,
            onStart: () => {
              if (linkRefs.value[i]) linkRefs.value[i].start()
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
    gsap.to('.menu-item-wrap', { y: -40, opacity: 0, skewX: '-3deg', stagger: 0.05, duration: 0.3, ease: 'power2.in' })
    gsap.to('.menu-meta-line', { opacity: 0, duration: 0.2 })
    gsap.to(menuRef.value, {
      clipPath: 'circle(0% at 94% 4%)',
      duration: 1.0, ease: 'expo.inOut', delay: 0.12,
      onComplete: () => gsap.set(menuRef.value, { display: 'none' })
    })
  }
}

const onMenuBtnEnter = () => {
  playBip()
}

onBeforeUnmount(() => {
  if (ctx) ctx.close()
})
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-[8000] px-8 py-8 flex justify-between items-center pointer-events-none">
    <span />
    <button
        ref="menuBtnRef"
        @click="toggleMenu"
        @mouseenter="onMenuBtnEnter"
        class="pointer-events-auto relative w-14 h-14 flex flex-col items-center justify-center gap-[7px] group mix-blend-difference"
    >
      <span class="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/30 group-hover:scale-125 transition-all duration-500 ease-out" />
      <div class="w-8 h-[1.5px] bg-white transition-all duration-500 origin-center" :class="isMenuOpen ? 'rotate-45 translate-y-[4.25px]' : ''" />
      <div class="h-[1.5px] bg-white transition-all duration-500 origin-right" :class="isMenuOpen ? 'w-8 -rotate-45 -translate-y-[4.25px]' : 'w-5 self-end'" />
    </button>
  </nav>

  <Teleport to="body">
    <div
        ref="menuRef"
        class="fixed inset-0 z-[7500] hidden items-center justify-center overflow-hidden"
        :style="{ background: '#FF4A00', clipPath: 'circle(0% at 94% 4%)' }"
    >
      <div class="absolute inset-0 pointer-events-none opacity-[0.04]" style="background: repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 3px)" />

      <div class="relative z-10 w-full max-w-6xl px-12 md:px-24">
        <div class="menu-meta-line mb-10 flex items-center gap-3 font-mono text-[10px] tracking-[0.5em] uppercase text-black/35 opacity-0">
          <span class="block w-8 h-px bg-black/25" /> Navigation / System <span class="block w-8 h-px bg-black/25" />
        </div>

        <nav>
          <div v-for="(link, i) in navLinks" :key="link.href" class="menu-item-wrap overflow-hidden opacity-0">
            <component
                :is="link.external ? 'a' : 'NuxtLink'"
                :href="link.external ? link.href : undefined"
                :to="link.external ? undefined : link.href"
                :target="link.external ? '_blank' : undefined"
                @mouseenter="playBip"
                class="group relative flex items-baseline gap-5 py-1 cursor-pointer"
            >
              <span class="font-mono text-[12px] tracking-widest text-black/30 mb-1 shrink-0 tabular-nums">
                {{ String(i + 1).padStart(2, '0') }}.
              </span>

              <EncryptedText
                  :ref="el => { if (el) linkRefs[i] = el as InstanceType<typeof EncryptedText> }"
                  :text="link.name"
                  trigger="hover"
                  :revealDelayMs="40"
                  class="block font-black uppercase tracking-tighter leading-none text-black group-hover:text-white transition-colors duration-300"
                  style="font-size: clamp(48px, 9vw, 136px);"
              />

              <span class="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-3 font-mono text-white" style="font-size: clamp(24px, 3vw, 42px);">↗</span>
              <span class="absolute bottom-0 left-0 h-[1.5px] bg-black/20 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
            </component>
          </div>
        </nav>
      </div>
    </div>
  </Teleport>
</template>
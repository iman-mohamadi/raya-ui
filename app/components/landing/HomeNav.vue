<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, resolveComponent } from 'vue'
import gsap from 'gsap'
import EncryptedText from '~/components/ui/encrypted-text/EncryptedText.vue'

const menuRef = ref<HTMLDivElement | null>(null)
const isMenuOpen = ref(false)
const menuBtnRef = ref<HTMLButtonElement | null>(null)
const linkRefs = ref<InstanceType<typeof EncryptedText>[]>([])

const isAudioMuted = useState('isAudioMuted', () => false)

// ─── AUDIO ENGINE (HTML Audio Element Refs for reliability) ──────────────────
const hoverAudioRef = ref<HTMLAudioElement | null>(null)
const secondaryAudioRef = ref<HTMLAudioElement | null>(null)
const modalOpenAudioRef = ref<HTMLAudioElement | null>(null)
const clickAudioRef = ref<HTMLAudioElement | null>(null)

const objectUrls: string[] = []

// Fetched as a blob (not a media URL) so download managers like IDM can't grab
// it, and we avoid the heavy base64 data-URL conversion.
const loadAudioSecurely = async (audioRef: any, path: string): Promise<void> => {
  try {
    const res = await fetch(path, { cache: 'force-cache' })
    if (!res.ok) return
    const raw = await res.blob()
    const url = URL.createObjectURL(new Blob([raw], { type: 'audio/wav' }))
    objectUrls.push(url)
    if (audioRef.value) audioRef.value.src = url
  } catch {
    /* audio is optional */
  }
}

const playAudio = (audioEl: HTMLAudioElement | null, volume: number = 0.2) => {
  if (audioEl && audioEl.src && !isAudioMuted.value) {
    audioEl.volume = volume
    audioEl.currentTime = 0
    audioEl.play().catch(() => {})
  }
}

// Resolve NuxtLink to a real component reference. Passing the string 'NuxtLink'
// to <component :is> renders a literal <nuxtlink> element that never navigates.
const NuxtLinkComponent = resolveComponent('NuxtLink')

const navLinks = [
  { name: 'COMPONENTS', href: '/components' },
  { name: 'DOCUMENTATION', href: '/docs/introduction' },
  { name: 'GITHUB', href: 'https://github.com/iman-mohamadi/raya-ui', external: true }
]

onMounted(() => {
  loadAudioSecurely(hoverAudioRef, '/audio/hover.txt')
  loadAudioSecurely(secondaryAudioRef, '/audio/secondary-hover.txt')
  loadAudioSecurely(modalOpenAudioRef, '/audio/modal-open.txt')
  loadAudioSecurely(clickAudioRef, '/audio/click.txt')
})

onBeforeUnmount(() => {
  objectUrls.forEach(URL.revokeObjectURL)
})

const toggleMenu = () => {
  playAudio(clickAudioRef.value, 0.3)

  isMenuOpen.value = !isMenuOpen.value

  const btnRect = menuBtnRef.value?.getBoundingClientRect()
  const originX = btnRect ? btnRect.left + btnRect.width / 2 : window.innerWidth - 64
  const originY = btnRect ? btnRect.top + btnRect.height / 2 : 64
  
  // Calculate the maximum pixel radius needed to cover the entire screen from the button's origin
  const maxRadius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  )

  const startClipPath = `circle(0px at ${originX}px ${originY}px)`
  const endClipPath = `circle(${Math.ceil(maxRadius) + 30}px at ${originX}px ${originY}px)`

  if (isMenuOpen.value) {
    // Play modal open sound
    // Give it a 50ms buffer to ensure it doesn't overlap exactly with click.wav
    setTimeout(() => {
      playAudio(modalOpenAudioRef.value, 0.3)
    }, 50)

    gsap.set(menuRef.value, { display: 'flex', clipPath: startClipPath })
    gsap.to(menuRef.value, { clipPath: endClipPath, duration: 1.2, ease: 'expo.inOut' })

    gsap.utils.toArray('.menu-item-wrap').forEach((el: any, i) => {
      gsap.fromTo(el,
          { y: 70, opacity: 0, skewX: '4deg' },
          {
            y: 0, opacity: 1, skewX: '0deg',
            duration: 1.0, ease: 'expo.out', delay: 0.3 + i * 0.14,
          }
      )
    })

    // Encrypted-text reveal: kicks off after the panel begins opening, then
    // each link scrambles in one short beat after the previous.
    const REVEAL_START = 0.5
    const REVEAL_STAGGER = 0.22
    linkRefs.value.forEach((linkRef, i) => {
      gsap.delayedCall(REVEAL_START + i * REVEAL_STAGGER, () => {
        if (isMenuOpen.value) linkRef?.start()
      })
    })

    gsap.fromTo('.menu-meta-line',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.85, ease: 'power2.out' }
    )

  } else {
    gsap.to('.menu-item-wrap', { y: -40, opacity: 0, skewX: '-3deg', stagger: 0.05, duration: 0.3, ease: 'power2.in' })
    gsap.to('.menu-meta-line', { opacity: 0, duration: 0.2 })
    gsap.to(menuRef.value, {
      clipPath: startClipPath,
      duration: 1.0, ease: 'expo.inOut', delay: 0.12,
      onComplete: () => gsap.set(menuRef.value, { display: 'none' })
    })
  }
}
</script>

<template>
  <audio ref="hoverAudioRef" style="display: none;"></audio>
  <audio ref="secondaryAudioRef" style="display: none;"></audio>
  <audio ref="modalOpenAudioRef" style="display: none;"></audio>
  <audio ref="clickAudioRef" style="display: none;"></audio>

  <nav class="fixed top-0 left-0 right-0 z-[8000] px-8 py-8 flex justify-between items-center pointer-events-none">
    <span />
    <button
        ref="menuBtnRef"
        @click="toggleMenu"
        @mouseenter="playAudio(hoverAudioRef, 0.1)"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isMenuOpen"
        class="pointer-events-auto relative w-14 h-14 flex items-center justify-center group mix-blend-difference"
    >
      <span class="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/30 group-hover:scale-110 transition-all duration-500 ease-out" />
      <div class="relative w-8 h-[14px]">
        <div class="absolute right-0 h-[1.5px] bg-white transition-all duration-500"
             :class="isMenuOpen ? 'w-8 top-1/2 -translate-y-1/2 rotate-45' : 'w-8 top-0'" />
        <div class="absolute right-0 h-[1.5px] bg-white transition-all duration-500"
             :class="isMenuOpen ? 'w-8 top-1/2 -translate-y-1/2 -rotate-45' : 'w-5 bottom-0 group-hover:w-8'" />
      </div>
    </button>
  </nav>

  <Teleport to="body">
    <div
        ref="menuRef"
        class="fixed inset-0 z-[7500] hidden items-center justify-center overflow-hidden"
        :style="{ background: 'var(--primary)', clipPath: 'circle(0px at 94% 4%)' }"
    >
      <div class="absolute inset-0 pointer-events-none opacity-[0.04]" style="background: repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 3px)" />

      <div class="relative z-10 w-full max-w-6xl px-12 md:px-24">
        <div class="menu-meta-line mb-10 flex items-center gap-3 font-mono text-[10px] tracking-[0.5em] uppercase text-black/35 opacity-0">
          <span class="block w-8 h-px bg-black/25" /> Navigation / System <span class="block w-8 h-px bg-black/25" />
        </div>

        <nav>
          <div v-for="(link, i) in navLinks" :key="link.href" class="menu-item-wrap overflow-hidden opacity-0">
            <component
                :is="link.external ? 'a' : NuxtLinkComponent"
                :href="link.external ? link.href : undefined"
                :to="link.external ? undefined : link.href"
                :target="link.external ? '_blank' : undefined"
                @mouseenter="playAudio(secondaryAudioRef, 0.1)"
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
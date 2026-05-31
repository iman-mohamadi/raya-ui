import { ref, onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollManager() {
    const lenis = ref<Lenis | null>(null)
    const masterTimeline = ref<gsap.core.Timeline | null>(null)
    const scrollProgress = ref(0)

    onMounted(() => {
        lenis.value = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        })

        lenis.value.on('scroll', (e: any) => {
            scrollProgress.value = e.progress
            ScrollTrigger.update()
        })

        gsap.ticker.add((time) => {
            lenis.value?.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0)

        // Master timeline to drive the entire homepage experience
        masterTimeline.value = gsap.timeline({
            scrollTrigger: {
                trigger: '#homepage-scroll-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // Smooth scrubbing
            }
        })
    })

    onUnmounted(() => {
        lenis.value?.destroy()
        masterTimeline.value?.kill()
        ScrollTrigger.getAll().forEach(t => t.kill())
    })

    return { lenis, masterTimeline, scrollProgress }
}
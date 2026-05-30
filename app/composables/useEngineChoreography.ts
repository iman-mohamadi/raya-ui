import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useEngineChoreography() {

    // Notice we pass the timeline up so the WebGL component can inject its 3D tweens into it
    const initEngineChoreography = (sectionRef: HTMLElement, inject3D: (tl: gsap.core.Timeline) => void) => {
        const q = gsap.utils.selector(sectionRef)

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=15000', // Massive scroll area for the 7-stage assembly
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Pulse the global cinematic glow during assembly
                    const p = self.progress
                    const intensity = 0.1 + (Math.sin(p * Math.PI * 10) * 0.05)
                    document.documentElement.style.setProperty('--primary-rgb', `0, 229, 255`)
                }
            }
        })

        // Let the WebGL component register its 3D moves perfectly into this exact timeline
        inject3D(tl)

        // PHASE 0: Descent Text
        tl.to(q('.el-0'), { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, 0)
        tl.to(q('.el-0'), { opacity: 0, y: -30, duration: 1, stagger: 0.1 }, 1.5)

        // PHASE 1-5: Module Explanations (Syncs perfectly with `inject3D` timings)
        // Mod 1 (Starts at 2s in timeline)
        tl.to(q('.mb-vue .engine-line'), { opacity: 1, y: 0, duration: 0.5 }, 2)
        tl.to(q('.mb-vue .engine-line'), { opacity: 0, filter: 'blur(5px)', duration: 0.5 }, 3.5)

        // Mod 2 (Starts at 4s)
        tl.to(q('.mb-nuxt .engine-line'), { opacity: 1, y: 0, duration: 0.5 }, 4)
        tl.to(q('.mb-nuxt .engine-line'), { opacity: 0, filter: 'blur(5px)', duration: 0.5 }, 5.5)

        // Mod 3 (Starts at 6s)
        tl.to(q('.mb-tailwind .engine-line'), { opacity: 1, y: 0, duration: 0.5 }, 6)
        tl.to(q('.mb-tailwind .engine-line'), { opacity: 0, filter: 'blur(5px)', duration: 0.5 }, 7.5)

        // Mod 4 (Starts at 8s)
        tl.to(q('.mb-reka .engine-line'), { opacity: 1, y: 0, duration: 0.5 }, 8)
        tl.to(q('.mb-reka .engine-line'), { opacity: 0, filter: 'blur(5px)', duration: 0.5 }, 9.5)

        // Mod 5 (Starts at 10s)
        tl.to(q('.mb-gsap .engine-line'), { opacity: 1, y: 0, duration: 0.5 }, 10)
        tl.to(q('.mb-gsap .engine-line'), { opacity: 0, filter: 'blur(5px)', duration: 0.5 }, 11.5)

        // PHASE 6: The Climax (Starts at 13s)
        tl.to(q('.e-phase-climax'), { opacity: 1, duration: 2 }, 13) // Darken edges
        tl.to(q('.el-climax'), { opacity: 1, y: 0, duration: 2, stagger: 0.5, ease: 'expo.out' }, 13.5)
    }

    return { initEngineChoreography }
}
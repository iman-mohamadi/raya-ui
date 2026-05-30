import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useGalaxyChoreography() {
    const initGalaxyChoreography = (sectionRef: HTMLElement, inject3D: (tl: gsap.core.Timeline) => void) => {
        const q = gsap.utils.selector(sectionRef)

        // Initial DOM States
        gsap.set(q('.g-phase'), { autoAlpha: 0 })
        gsap.set(q('.g-line'), { y: '100%', opacity: 0 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=25000', // Massive cinematic timeline
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Keep the global ambient light a deep, resonant cyan/purple mix
                    document.documentElement.style.setProperty('--primary-rgb', '168, 85, 247') // Accent purple
                }
            }
        })

        // Inject the WebGL 3D Sequence
        inject3D(tl)

        const animatePhase = (phaseClass: string, startTime: number, duration: number = 2) => {
            tl.to(q(`.${phaseClass}`), { autoAlpha: 1, duration: 0.1 }, startTime)
            tl.to(q(`.${phaseClass} .g-line`), { y: '0%', opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }, startTime)
            tl.to(q(`.${phaseClass} .g-line`), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1, ease: 'power2.in' }, startTime + duration)
            tl.to(q(`.${phaseClass}`), { autoAlpha: 0, duration: 0.1 }, startTime + duration + 1)
        }

        // PHASE 1: The Opening (We are not alone)
        animatePhase('g-intro', 1, 3)

        // PHASE 2: Commit Streams & Evolution
        animatePhase('g-commits', 6, 3)

        // PHASE 3: Global Scale Realization
        tl.to(q('.g-scale'), { autoAlpha: 1, duration: 0.1 }, 11)
        tl.to(q('.g-scale .g-line'), { y: '0%', opacity: 1, duration: 1, stagger: 0.5, ease: 'power3.out' }, 11) // Slower stagger
        tl.to(q('.g-scale .g-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1, ease: 'power2.in' }, 16)
        tl.to(q('.g-scale'), { autoAlpha: 0, duration: 0.1 }, 17)

        // PHASE 4: The Heartbeat
        tl.to(q('.g-heartbeat'), { autoAlpha: 1, duration: 0.1 }, 18)
        tl.to(q('.g-heartbeat .g-line'), { y: '0%', opacity: 1, duration: 1, stagger: 0.3, ease: 'expo.out' }, 18)
        tl.to(q('.g-heartbeat .g-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1, ease: 'power2.in' }, 21)
        tl.to(q('.g-heartbeat'), { autoAlpha: 0, duration: 0.1 }, 22)

        // PHASE 5: Convergence (Ending)
        tl.to(q('.g-ending'), { autoAlpha: 1, duration: 1 }, 23)
        tl.to(q('.g-ending .g-line'), { y: '0%', opacity: 1, duration: 2, stagger: 0.2, ease: 'power4.out' }, 23.5)
    }

    return { initGalaxyChoreography }
}
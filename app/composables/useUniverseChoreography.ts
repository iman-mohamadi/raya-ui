import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useUniverseChoreography() {
    const initUniverseChoreography = (sectionRef: HTMLElement, inject3D: (tl: gsap.core.Timeline) => void) => {
        const q = gsap.utils.selector(sectionRef)

        // Setup initial DOM states
        gsap.set(q('.uni-line'), { y: '100%', opacity: 0 })
        gsap.set(q('.uni-fade'), { opacity: 0, filter: 'blur(20px)', scale: 0.9 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=20000', // 20,000px for a massive cinematic journey
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
            }
        })

        // Connect the WebGL Camera and Object animations to this scroll timeline
        inject3D(tl)

        // PHASE 1: The Big Bang & Opening Statement
        tl.to(q('.u-phase-1 .uni-line'), { y: '0%', opacity: 1, duration: 1, stagger: 0.2, ease: 'expo.out' }, 1)
        tl.to(q('.u-phase-1 .uni-line'), { y: '-100%', opacity: 0, duration: 1, stagger: 0.1 }, 3)

        // PHASE 2: Input Constellation
        tl.to(q('.constellation-input'), { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1 }, 4)
        tl.to(q('.constellation-input'), { opacity: 0, filter: 'blur(20px)', scale: 1.1, duration: 1 }, 6)

        // PHASE 3: Interaction Constellation
        tl.to(q('.constellation-interaction'), { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1 }, 7)
        tl.to(q('.constellation-interaction'), { opacity: 0, filter: 'blur(20px)', scale: 1.1, duration: 1 }, 9)

        // PHASE 4: The Morphing Product Moment
        tl.to(q('.u-phase-morph .uni-line'), { y: '0%', opacity: 1, duration: 1, stagger: 0.2 }, 10)
        tl.to(q('.u-phase-morph .uni-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1 }, 13)

        // PHASE 5: Overwhelming Scale (Zoom out)
        tl.to(q('.u-phase-scale .uni-fade'), { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.5 }, 14)
        tl.to(q('.u-phase-scale .uni-fade'), { opacity: 0, filter: 'blur(10px)', scale: 1.1, duration: 1 }, 16)

        // PHASE 6: The Ending
        tl.to(q('.u-phase-ending .uni-line'), { y: '0%', opacity: 1, duration: 1.5, stagger: 0.3, ease: 'power3.out' }, 17.5)
    }

    return { initUniverseChoreography }
}
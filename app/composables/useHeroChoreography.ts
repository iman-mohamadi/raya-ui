import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useHeroChoreography() {
    const initTimeline = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

        // PHASE 1 & 2: Void to Grid (Handled by fading in the container)

        // PHASE 3: Glass Interface Fragments emerge from depth
        tl.fromTo('.fragment',
            { y: '20vh', z: -500, opacity: 0, rotateX: 15 },
            { y: 0, z: 0, opacity: 1, rotateX: 0, duration: 2.5, stagger: 0.15 },
            0.5
        )

        // PHASE 4: Typography cinematic reveal
        tl.to('.hero-title .line',
            { y: 0, rotation: 0, duration: 2, ease: "expo.out", stagger: 0.1 },
            1.2
        )
        tl.to('.hero-sub .line',
            { y: 0, rotation: 0, duration: 1.5, ease: "power3.out", stagger: 0.05 },
            1.8
        )
        tl.fromTo('.micro-copy',
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 2 },
            2
        )

        // PHASE 7: Scroll Transformation System (Parallel Parallax)
        ScrollTrigger.create({
            trigger: '.cinematic-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            animation: gsap.timeline()
                .to('.primary-cluster', { y: '-30vh', filter: 'blur(15px)', opacity: 0 }, 0)
                .to('.secondary-cluster', { y: '-15vh', opacity: 0 }, 0)
                .to('.webgl-container', { y: '20vh', scale: 0.9, opacity: 0.5 }, 0)
                .to('.fragment-alpha', { y: '-40vh', rotateZ: -10, scale: 1.1 }, 0)
                .to('.fragment-beta', { y: '-20vh', rotateZ: 5 }, 0)
                .to('.fragment-gamma', { y: '-50vh' }, 0)
        })
    }

    return { initTimeline }
}
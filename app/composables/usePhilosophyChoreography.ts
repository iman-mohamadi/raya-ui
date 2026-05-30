import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function usePhilosophyChoreography() {
    const initPhilosophyChoreography = (sectionRef: HTMLElement) => {
        const q = gsap.utils.selector(sectionRef)

        // Initial states
        gsap.set(q('.p4-fade'), { opacity: 0, y: 50 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=10000', // 10,000px of scrolling for a slow, meditative pace
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Force global environment to pure Diamond White during this section
                    // for maximum luxury contrast
                    if (self.isActive) {
                        document.documentElement.style.setProperty('--primary-rgb', '255, 255, 255')
                        document.documentElement.style.setProperty('--primary', 'rgb(255, 255, 255)')
                    }
                }
            }
        })

        // Phase 1: Reveal "Interfaces are Emotion"
        tl.to(q('.p1-line'), { y: 0, rotation: 0, duration: 2, stagger: 0.2, ease: 'power3.out' }, 0.5)

        // Hold... then dissolve
        tl.to(q('.p1-line'), { y: '-50%', opacity: 0, filter: 'blur(10px)', duration: 2, stagger: 0.1 }, 3.5)

        // Phases 2 & 3: Pure Visual (The WebGL component handles its own camera push here automatically via the same scroll distance)

        // Phase 4: Reveal Interaction Showcase
        tl.to(q('.p4-fade'), { opacity: 1, y: 0, duration: 2, stagger: 0.2, ease: 'power2.out' }, 7)

        // Hold... then fade out
        tl.to(q('.p4-fade'), { opacity: 0, y: -30, duration: 1.5 }, 10)

        // Phase 5: The Final Manifesto Reveal
        tl.to(q('.p5-line'), { y: 0, rotation: 0, duration: 3, stagger: 0.4, ease: 'expo.out' }, 12)
    }

    return { initPhilosophyChoreography }
}
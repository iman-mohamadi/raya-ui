import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useFinaleChoreography() {
    const initFinaleChoreography = (sectionRef: HTMLElement, inject3D: (tl: gsap.core.Timeline) => void) => {
        const q = gsap.utils.selector(sectionRef)

        // Initial DOM States
        gsap.set(q('.f-phase'), { autoAlpha: 0 })
        gsap.set(q('.f-line'), { y: '100%', opacity: 0 })
        gsap.set(q('.glass-artifact'), { y: 100, opacity: 0, scale: 0.9, filter: 'blur(20px)' })
        gsap.set(q('.footer-environment'), { opacity: 0, y: 50 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=25000', // Massive scroll area for the grand finale
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // As we enter the silence, drain all color from the global environment to pure black/white
                    const p = self.progress
                    if (p > 0.4) {
                        document.documentElement.style.setProperty('--primary-rgb', '255, 255, 255')
                        document.documentElement.style.setProperty('--primary', 'rgb(255, 255, 255)')
                    }
                }
            }
        })

        // Inject WebGL 3D Assembly & Camera Moves
        inject3D(tl)

        // PHASE 1: The Assembly (3D handles this, DOM stays empty)

        // PHASE 2: The Silence & Message 1
        tl.to(q('.f-msg-1'), { autoAlpha: 1, duration: 0.1 }, 10)
        tl.to(q('.f-msg-1 .f-line'), { y: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' }, 10)
        tl.to(q('.f-msg-1 .f-line'), { y: '-50%', opacity: 0, duration: 1.5, ease: 'power2.in' }, 13)
        tl.to(q('.f-msg-1'), { autoAlpha: 0, duration: 0.1 }, 14.5)

        // PHASE 3: Message 2
        tl.to(q('.f-msg-2'), { autoAlpha: 1, duration: 0.1 }, 15)
        tl.to(q('.f-msg-2 .f-line'), { y: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' }, 15)
        tl.to(q('.f-msg-2 .f-line'), { y: '-50%', opacity: 0, duration: 1.5, ease: 'power2.in' }, 18)
        tl.to(q('.f-msg-2'), { autoAlpha: 0, duration: 0.1 }, 19.5)

        // PHASE 4: The Climax Message
        tl.to(q('.f-climax'), { autoAlpha: 1, duration: 0.1 }, 20)
        tl.to(q('.f-climax .f-line'), { y: '0%', opacity: 1, duration: 2, ease: 'expo.out' }, 20)
        tl.to(q('.f-climax'), { autoAlpha: 0, duration: 1 }, 23) // Slow fade out

        // PHASE 5: The Artifact CTA Reveals
        tl.to(q('.f-cta'), { autoAlpha: 1, duration: 0.1 }, 24)
        tl.to(q('.glass-artifact'), { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: 'power4.out' }, 24)

        // PHASE 6: The Final Pullback & Footer
        tl.to(q('.glass-artifact'), { scale: 0.7, y: -50, duration: 3, ease: 'none' }, 26)
        tl.to(q('.f-ending .f-line'), { y: '0%', opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out' }, 27)
        tl.to(q('.footer-environment'), { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 28)
    }

    return { initFinaleChoreography }
}
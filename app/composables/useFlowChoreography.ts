import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useFlowChoreography() {
    const initFlowChoreography = (sectionRef: HTMLElement, inject3D: (tl: gsap.core.Timeline) => void) => {
        const q = gsap.utils.selector(sectionRef)

        // Initial DOM States
        gsap.set(q('.ui-phase'), { autoAlpha: 0 })
        gsap.set(q('.flow-morph-core'), {
            left: '50%', top: '50%', xPercent: -50, yPercent: -50,
            width: '0px', height: '0px', borderRadius: '50%', opacity: 0
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=20000', // Massive scroll area for 7 phases
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Shift global ambient glow to a pure, electric white/silver during FLOW
                    document.documentElement.style.setProperty('--primary-rgb', '255, 255, 255')
                    document.documentElement.style.setProperty('--primary', 'rgb(255, 255, 255)')
                }
            }
        })

        // Inject WebGL 3D Timeline
        inject3D(tl)

        // PHASE 1: The Command
        tl.to(q('.flow-morph-core'), { width: '500px', height: '80px', borderRadius: '16px', opacity: 1, duration: 1.5, ease: 'expo.out' }, 1)
        tl.to(q('.phase-terminal'), { autoAlpha: 1, duration: 0.5 }, 1.5)

        // Typewriter effect for terminal
        tl.fromTo(q('.typing-text'), { width: 0 }, { width: '100%', duration: 2, ease: 'steps(20)' }, 2)
        tl.to(q('.t-phase-1 .flow-line'), { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 3)
        tl.to(q('.t-phase-1 .flow-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1 }, 5)

        // PHASE 2: Registry Connection
        tl.to(q('.phase-terminal'), { autoAlpha: 0, duration: 0.5 }, 6)
        tl.to(q('.flow-morph-core'), { width: '120px', height: '120px', borderRadius: '50%', duration: 2, ease: 'power3.inOut' }, 6)
        tl.to(q('.t-phase-2 .flow-line'), { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 7)
        tl.to(q('.t-phase-2 .flow-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1 }, 9)

        // PHASE 3: Generation (Button Assembles)
        tl.to(q('.flow-morph-core'), { width: '220px', height: '64px', borderRadius: '32px', duration: 2, ease: 'back.out(1.2)' }, 10)
        tl.to(q('.phase-component'), { autoAlpha: 1, duration: 0.5 }, 11)
        tl.to(q('.t-phase-3 .flow-line'), { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 11)
        tl.to(q('.t-phase-3 .flow-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1 }, 13)

        // PHASE 4: Customization
        tl.to(q('.flow-morph-core'), { width: '350px', height: '400px', borderRadius: '24px', duration: 2.5, ease: 'power4.inOut' }, 14)
        tl.to(q('.phase-component'), { autoAlpha: 0, duration: 0.5 }, 14)
        tl.to(q('.phase-card'), { autoAlpha: 1, duration: 1 }, 15)
        tl.to(q('.t-phase-4 .flow-line'), { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 15)
        tl.to(q('.t-phase-4 .flow-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1 }, 17)

        // PHASE 5: Application Scale
        tl.to(q('.flow-morph-core'), { width: '90vw', height: '85vh', borderRadius: '16px', duration: 3, ease: 'expo.inOut' }, 18)
        tl.to(q('.phase-card'), { autoAlpha: 0, duration: 0.5 }, 18)
        tl.to(q('.phase-app'), { autoAlpha: 1, duration: 1 }, 20)
        tl.to(q('.t-phase-5 .flow-line'), { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 20)
        tl.to(q('.t-phase-5 .flow-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1 }, 22)

        // PHASE 6: Production Deployment & Endless Scale
        tl.to(q('.t-phase-6 .flow-line'), { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 23)
        tl.to(q('.t-phase-6 .flow-line'), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1 }, 25)

        // ENDING: Fade to Ecosystem
        tl.to(q('.flow-morph-core'), { opacity: 0, scale: 0.8, filter: 'blur(20px)', duration: 2 }, 26)
        tl.to(q('.t-phase-end .flow-line'), { y: 0, opacity: 1, duration: 2, stagger: 0.4, ease: 'power2.out' }, 27)
    }

    return { initFlowChoreography }
}
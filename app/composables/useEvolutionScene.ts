import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useEvolutionScene() {
    const initEvolutionChoreography = (sectionRef: HTMLElement) => {

        // THE FIX: Scope all GSAP selections exclusively to THIS section.
        // This guarantees it will never accidentally grab Section 3's SVGs.
        const q = gsap.utils.selector(sectionRef)

        gsap.set(q('.ui-phase-button'), { autoAlpha: 0, scale: 0.8 })
        gsap.set(q('.ui-phase-card'), { autoAlpha: 0, y: 30 })
        gsap.set(q('.ui-phase-os'), { autoAlpha: 0, scale: 0.95 })
        gsap.set(q('.anim-path, .anim-ring'), { strokeDashoffset: 100 })

        gsap.set(q('.morph-core'), {
            left: '50%', top: '50%',
            xPercent: -50, yPercent: -50,
            width: '200px', height: '60px',
            borderRadius: '30px',
            scale: 0.8,
            opacity: 0
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=7000',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            }
        })

        // Notice every target is now wrapped in q()
        tl.to(q('.evo-title-left'), { x: '-15vw', filter: 'blur(20px)', opacity: 0, duration: 2 }, 0)
        tl.to(q('.evo-title-right'), { x: '15vw', filter: 'blur(20px)', opacity: 0, duration: 2 }, 0)
        tl.to(q('.evo-micro-copy'), { y: '5vh', opacity: 0, duration: 1.5 }, 0)

        tl.to(q('.morph-core'), { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 1)
        tl.to(q('.ui-phase-button'), { autoAlpha: 1, scale: 1, duration: 0.5 }, 1.5)

        tl.to(q('.ui-phase-button'), { autoAlpha: 0, scale: 0.8, duration: 0.5 }, 3)
        tl.to(q('.morph-core'), {
            width: '450px', height: '260px', borderRadius: '24px', duration: 2.5, ease: 'power3.inOut'
        }, 3)

        tl.to(q('.ui-phase-card'), { autoAlpha: 1, y: 0, duration: 1 }, 4)
        tl.to(q('.wave-path'), { strokeDashoffset: 0, duration: 2, ease: 'none' }, 4.5)
        tl.to(q('.wave-path'), {
            stroke: 'var(--primary, #00e5ff)',
            filter: 'drop-shadow(0px 0px 8px var(--primary, #00e5ff))',
            duration: 0.1
        }, 6.5)
        tl.to(q('.stat-number'), { color: 'var(--primary, #00e5ff)', duration: 0.1 }, 6.5)

        tl.to(q('.ui-phase-card'), { autoAlpha: 0, y: -20, duration: 0.8 }, 8.5)
        tl.to(q('.morph-core'), {
            width: '90vw', height: '85vh', borderRadius: '16px', duration: 3, ease: 'expo.inOut'
        }, 9)

        tl.to(q('.ui-phase-os'), { autoAlpha: 1, scale: 1, duration: 1.5 }, 11)

        tl.to(q('.primary-ring'), { strokeDashoffset: 0, duration: 2.5, ease: 'power4.out' }, 11.5)
        tl.to(q('.secondary-ring'), { strokeDashoffset: 0, duration: 2.5, ease: 'power3.out' }, 11.7)
        tl.to(q('.node-line'), { strokeDashoffset: 0, duration: 2, ease: 'none' }, 11.5)
        tl.to(q('.node-point'), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 12.5)

        tl.fromTo(q('.anim-log'),
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.2 }, 12.5
        )

        tl.to(q('.anim-bar'), {
            scaleY: () => 0.3 + Math.random() * 0.7, opacity: 1, duration: 1, stagger: 0.05, ease: 'elastic.out(1, 0.5)'
        }, 13)

        tl.to(q('.webgl-evolution canvas'), { scale: 1.15, opacity: 0.5, duration: 12 }, 0)
    }

    return { initEvolutionChoreography }
}
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useProofChoreography() {
    const initProofChoreography = (sectionRef: HTMLElement, inject3D: (tl: gsap.core.Timeline) => void) => {
        const q = gsap.utils.selector(sectionRef)

        // Initial DOM States
        gsap.set(q('.proof-phase'), { autoAlpha: 0 })
        gsap.set(q('.proof-line'), { y: '100%', opacity: 0 })
        gsap.set(q('.proof-scale'), { scale: 0.8, opacity: 0, filter: 'blur(20px)' })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=25000', // Colossal journey
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const p = self.progress
                    let r = 255, g = 255, b = 255 // Default White

                    // Color Morphing Logic
                    if (p > 0.05 && p < 0.2) { // Finance: Gold
                        r = 234; g = 179; b = 8;
                    } else if (p >= 0.2 && p < 0.35) { // AI: Magenta
                        r = 217; g = 70; b = 239;
                    } else if (p >= 0.35 && p < 0.5) { // Commerce: Silver/White
                        r = 240; g = 240; b = 255;
                    } else if (p >= 0.5 && p < 0.65) { // Music: Cyan
                        r = 6; g = 182; b = 212;
                    } else if (p >= 0.65 && p < 0.8) { // Workspace: Deep Blue
                        r = 59; g = 130; b = 246;
                    } else if (p >= 0.8) { // Reveal: Bright White
                        r = 255; g = 255; b = 255;
                    }

                    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
                    document.documentElement.style.setProperty('--primary', `rgb(${r}, ${g}, ${b})`)
                }
            }
        })

        // Inject the 3D Transformations
        inject3D(tl)

        // Helper to animate text blocks in and out
        const animatePhase = (phaseClass: string, startTime: number) => {
            tl.to(q(`.${phaseClass}`), { autoAlpha: 1, duration: 0.1 }, startTime)
            tl.to(q(`.${phaseClass} .proof-line`), { y: '0%', opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }, startTime)
            tl.to(q(`.${phaseClass} .proof-line`), { y: '-50%', opacity: 0, duration: 1, stagger: 0.1, ease: 'power2.in' }, startTime + 2)
            tl.to(q(`.${phaseClass}`), { autoAlpha: 0, duration: 0.1 }, startTime + 3)
        }

        // PHASE 0: Opening
        animatePhase('p-intro', 0.5)

        // PHASE 1: Finance
        animatePhase('p-finance', 4)

        // PHASE 2: AI
        animatePhase('p-ai', 8)

        // PHASE 3: Commerce
        animatePhase('p-commerce', 12)

        // PHASE 4: Music
        animatePhase('p-music', 16)

        // PHASE 5: Workspace
        animatePhase('p-workspace', 20)

        // PHASE 6: The Grand Reveal
        tl.to(q('.p-reveal'), { autoAlpha: 1, duration: 0.5 }, 24)
        tl.to(q('.p-reveal .proof-scale'), { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'expo.out' }, 24)
        tl.to(q('.p-reveal .proof-scale'), { scale: 1.1, opacity: 0, filter: 'blur(10px)', duration: 1.5, ease: 'power2.in' }, 27)

        // ENDING: The Constellation
        tl.to(q('.p-ending'), { autoAlpha: 1, duration: 1 }, 28.5)
        tl.to(q('.p-ending .proof-line'), { y: '0%', opacity: 1, duration: 2, ease: 'power4.out' }, 29)
    }

    return { initProofChoreography }
}
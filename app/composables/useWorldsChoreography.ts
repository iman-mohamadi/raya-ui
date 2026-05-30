import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useWorldsChoreography() {
    const initWorldsChoreography = (sectionRef: HTMLElement, trackRef: HTMLElement) => {

        // 1. The Main Horizontal Scroll Timeline
        const scrollTween = gsap.to(trackRef, {
            xPercent: -75, // Move 3 out of 4 viewports left (to show all 4 worlds)
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef,
                start: 'top top',
                end: '+=8000', // Massive scroll duration for slow, cinematic exploration
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                // The genius part: Shifting the GLOBAL layout glow color based on the world
                onUpdate: (self) => {
                    const p = self.progress
                    let r, g, b

                    if (p < 0.25) {
                        // WORLD 1: Fintech Gold (234, 179, 8)
                        r = 234; g = 179; b = 8;
                    } else if (p < 0.5) {
                        // WORLD 2: AI Magenta (217, 70, 239)
                        // Interpolate from Gold to Magenta
                        const localP = (p - 0.25) * 4
                        r = 234 + (217 - 234) * localP
                        g = 179 + (70 - 179) * localP
                        b = 8 + (239 - 8) * localP
                    } else if (p < 0.75) {
                        // WORLD 3: Analytics Cyan (6, 182, 212)
                        const localP = (p - 0.5) * 4
                        r = 217 + (6 - 217) * localP
                        g = 70 + (182 - 70) * localP
                        b = 239 + (212 - 239) * localP
                    } else {
                        // WORLD 4: Luxury Silver/White (255, 255, 255)
                        const localP = (p - 0.75) * 4
                        r = 6 + (255 - 6) * localP
                        g = 182 + (255 - 182) * localP
                        b = 212 + (255 - 212) * localP
                    }

                    // Apply to the global CSS variables powering the ambient layout
                    document.documentElement.style.setProperty('--primary-rgb', `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`)
                    document.documentElement.style.setProperty('--primary', `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`)
                }
            }
        })

        // 2. Internal World Parallax & SVG Drawing
        // We use the horizontal scrollTween as the "containerAnimation" trigger.
        const worlds = ['.world-fintech', '.world-ai', '.world-analytics', '.world-commerce']

        worlds.forEach((world) => {
            // Massive Typography Parallax (Moves opposite to the scroll for extreme depth)
            gsap.to(`${world} .world-title-bg`, {
                x: '30vw',
                ease: 'none',
                scrollTrigger: {
                    trigger: world,
                    containerAnimation: scrollTween,
                    start: 'left right',
                    end: 'right left',
                    scrub: true
                }
            })

            // Foreground Glass UI Parallax (Moves slightly faster left)
            gsap.to(`${world} .glass-architecture`, {
                x: '-15vw',
                ease: 'none',
                scrollTrigger: {
                    trigger: world,
                    containerAnimation: scrollTween,
                    start: 'left right',
                    end: 'right left',
                    scrub: true
                }
            })

            // Draw specific SVGs when the world enters the center of the screen
            gsap.to(`${world} .anim-path`, {
                strokeDashoffset: 0,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: world,
                    containerAnimation: scrollTween,
                    start: 'left center',
                    end: 'center center',
                    scrub: 1
                }
            })
        })
    }

    return { initWorldsChoreography }
}
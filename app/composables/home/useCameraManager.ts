import { reactive, onMounted } from 'vue'
import { Vector3 } from 'three'
import { gsap } from 'gsap'

export function useCameraManager() {
    const cameraPosition = reactive({ x: 0, y: 0, z: 20 })
    const cameraLookAt = reactive({ x: 0, y: 0, z: 0 })

    let isTouchDevice = false
    let xTo: gsap.QuickToFunc | null = null
    let yTo: gsap.QuickToFunc | null = null

    onMounted(() => {
        isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))

        // Initialize GSAP spring physics trackers for desktop parallax
        if (!isTouchDevice) {
            xTo = gsap.quickTo(cameraPosition, "x", { duration: 1.2, ease: "power4.out" })
            yTo = gsap.quickTo(cameraPosition, "y", { duration: 1.2, ease: "power4.out" })
        }
    })

    const applyMouseParallax = (basePos: Vector3, mouseX: number, mouseY: number) => {
        // Bypass parallax completely on mobile
        if (isTouchDevice) {
            cameraPosition.x = basePos.x
            cameraPosition.y = basePos.y
            return
        }

        const targetX = basePos.x + (mouseX * 2.0)
        const targetY = basePos.y - (mouseY * 2.0)

        // Apply physical mass/spring tracking
        if (xTo && yTo) {
            xTo(targetX)
            yTo(targetY)
        }
    }

    return { cameraPosition, cameraLookAt, applyMouseParallax }
}
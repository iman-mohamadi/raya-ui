import { reactive, onMounted } from 'vue'
import { Vector3 } from 'three'

export function useCameraManager() {
    const cameraPosition = reactive({ x: 0, y: 0, z: 20 })
    const cameraLookAt = reactive({ x: 0, y: 0, z: 0 })

    let isTouchDevice = false

    onMounted(() => {
        // Detect if the user is on a touch device
        isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
    })

    const applyMouseParallax = (basePos: Vector3, mouseX: number, mouseY: number) => {
        // Bypass parallax completely on mobile to prevent the "Camera Jerk"
        if (isTouchDevice) {
            cameraPosition.x = basePos.x
            cameraPosition.y = basePos.y
            return
        }

        // Extremely subtle, high-end parallax for desktop
        const targetX = basePos.x + (mouseX * 2.0)
        const targetY = basePos.y - (mouseY * 2.0)

        // Smooth interpolation so the camera glides, never snaps
        cameraPosition.x += (targetX - cameraPosition.x) * 0.05
        cameraPosition.y += (targetY - cameraPosition.y) * 0.05
    }

    return { cameraPosition, cameraLookAt, applyMouseParallax }
}
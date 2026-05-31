import { ref } from 'vue'
import { Vector3 } from 'three'

export function useCameraManager() {
    const cameraPosition = ref(new Vector3(0, 0, 10))
    const cameraLookAt = ref(new Vector3(0, 0, 0))

    // Parallax multipliers for the magic mouse system
    const parallaxDepth = 0.5
    const parallaxOrbit = 0.2

    const applyMouseParallax = (basePosition: Vector3, mouseX: number, mouseY: number) => {
        // Subtle cinematic camera shifts based on premium mouse tracking
        const targetX = basePosition.x + mouseX * parallaxOrbit
        const targetY = basePosition.y + mouseY * parallaxOrbit
        cameraPosition.value.lerp(new Vector3(targetX, targetY, basePosition.z), 0.05)
    }

    return { cameraPosition, cameraLookAt, applyMouseParallax }
}
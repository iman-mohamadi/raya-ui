import { reactive, onMounted, onUnmounted } from 'vue'
import { lerp } from 'three/src/math/MathUtils'

export function useMouseManager() {
    const mouse = reactive({ x: 0, y: 0, targetX: 0, targetY: 0 })

    const updateMouse = (e: MouseEvent) => {
        // Normalize mouse coordinates to -1 to +1
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const updateTick = () => {
        // Premium subtle lerping
        mouse.x = lerp(mouse.x, mouse.targetX, 0.05)
        mouse.y = lerp(mouse.y, mouse.targetY, 0.05)
    }

    onMounted(() => {
        window.addEventListener('mousemove', updateMouse)
    })

    onUnmounted(() => {
        window.removeEventListener('mousemove', updateMouse)
    })

    return { mouse, updateTick }
}
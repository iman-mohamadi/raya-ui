import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

export function useCinematicMouse() {
    const mouse = ref({ x: 0, y: 0, targetX: 0, targetY: 0 })
    const smoothMouse = ref({ x: 0, y: 0 })
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
        // Normalize coordinates between -1 and 1
        mouse.value.targetX = (e.clientX / window.innerWidth) * 2 - 1
        mouse.value.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const render = () => {
        // Premium cinematic lerp (slow, heavy feeling)
        smoothMouse.value.x = gsap.utils.interpolate(smoothMouse.value.x, mouse.value.targetX, 0.03)
        smoothMouse.value.y = gsap.utils.interpolate(smoothMouse.value.y, mouse.value.targetY, 0.03)
        rafId = requestAnimationFrame(render)
    }

    onMounted(() => {
        window.addEventListener('mousemove', onMouseMove)
        render()
    })

    onUnmounted(() => {
        window.removeEventListener('mousemove', onMouseMove)
        cancelAnimationFrame(rafId)
    })

    return { smoothMouse }
}
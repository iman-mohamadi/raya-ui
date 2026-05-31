import { reactive } from 'vue'

export const raya3D = reactive({
    morph: 0, // 0=Chaos, 1=R, 2=Wave, 3=Civilizations, 4=Engine
    cameraX: 0,
    cameraY: 0,
    cameraZ: 20,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
    turbulence: 0.05,
    particleColor: '#FF4A00'
})

export const useRayaState = () => {
    return { raya3D }
}
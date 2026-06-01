// app/composables/home/useRayaState.ts
// Decoupled from Vue's 'reactive' to eliminate micro-stutters during GSAP animations
export const raya3D = {
    morph: 0,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 20,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
    turbulence: 0.05,
    particleColor: '#00E5FF',
    particleOpacity: 0.8
}

export const useRayaState = () => {
    return { raya3D }
}
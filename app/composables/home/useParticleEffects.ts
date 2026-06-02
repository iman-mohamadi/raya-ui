/**
 * Composable for managing particle effects, morphing, and transitions
 * Integrates adaptive system, physics, and smooth animations
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Vector3 } from 'three'
import { adaptiveSystem, AdaptiveParticleSystem } from '~/utils/adaptiveParticleSystem'
import { SimplexNoise, easing } from '~/utils/noiseGenerator'
import { MousePhysicsSystem } from '~/utils/mousePhysics'

export interface ParticleTransition {
  fromShapeIndex: number
  toShapeIndex: number
  duration: number
  easeFunction: (t: number) => number
  startTime: number
}

export const useParticleEffects = () => {
  // Systems
  const adaptiveParticleSystem = ref<AdaptiveParticleSystem>(adaptiveSystem)
  const noiseGen = ref<SimplexNoise>(new SimplexNoise(Math.random() * 65536))
  const mousePhysics = ref<MousePhysicsSystem>(new MousePhysicsSystem({
    repulsionRadius: 15,
    repulsionForce: 12,
    attractionRadius: 10,
    attractionForce: 8,
    vortexForce: 18,
    velocityInfluence: 2.5,
    dampening: 0.88,
    trailLength: 40
  }))

  // State
  const particleCount = ref(adaptiveParticleSystem.value.getParticleCount())
  const morphProgress = ref(0)
  const turbulenceAmount = ref(0.08)
  const turbulenceSpeed = ref(2.0)
  const morphSpeed = ref(1.0)
  
  // Transitions
  const transitions = ref<ParticleTransition[]>([])
  const activeTransition = computed(() => transitions.value[0] || null)

  // Performance tracking
  const currentFPS = ref(60)
  const lastFrameTime = ref(Date.now())

  /**
   * Initialize particle effects system
   */
  const initialize = () => {
    window.addEventListener('resize', handleWindowResize)
    return {
      particleCount: particleCount.value,
      dpr: adaptiveParticleSystem.value.getDPR()
    }
  }

  /**
   * Handle window resize - recalculate particle count
   */
  const handleWindowResize = () => {
    const newConfig = adaptiveParticleSystem.value.handleResize()
    particleCount.value = newConfig.particleCount
  }

  /**
   * Update particle effects each frame
   */
  const update = (deltaTime: number = 0.016) => {
    const now = Date.now()
    const frameTime = now - lastFrameTime.value
    lastFrameTime.value = now

    // Calculate FPS
    currentFPS.value = Math.round(1000 / frameTime)

    // Update adaptive system performance tracking
    adaptiveParticleSystem.value.updatePerformance(frameTime)

    // Update noise for ambient drift
    updateTurbulence(frameTime)

    // Process active transitions
    if (activeTransition.value) {
      processTransition(deltaTime)
    }

    // Clamp morph progress
    morphProgress.value = Math.max(0, Math.min(morphProgress.value, 1))
  }

  /**
   * Update turbulence/drift effect
   */
  const updateTurbulence = (frameTime: number) => {
    // Dynamically adjust turbulence based on performance
    const targetTurbulence = currentFPS.value < 50 ? 0.04 : 0.08
    turbulenceAmount.value += (targetTurbulence - turbulenceAmount.value) * 0.1
  }

  /**
   * Process active transition
   */
  const processTransition = (deltaTime: number) => {
    const transition = activeTransition.value
    if (!transition) return

    const elapsed = Date.now() - transition.startTime
    const progress = Math.min(1, elapsed / transition.duration)
    const easedProgress = transition.easeFunction(progress)

    morphProgress.value = easedProgress

    // Remove transition when complete
    if (progress >= 1) {
      transitions.value.shift()
    }
  }

  /**
   * Schedule a morph transition between shapes
   */
  const scheduleMorph = (
    fromIndex: number,
    toIndex: number,
    duration: number = 1000,
    easeFunc: (t: number) => number = easing.easeInOutCubic
  ) => {
    transitions.value.push({
      fromShapeIndex: fromIndex,
      toShapeIndex: toIndex,
      duration,
      easeFunction: easeFunc,
      startTime: Date.now()
    })
  }

  /**
   * Get noise value for particle animation
   */
  const getNoise = (x: number, y: number, z: number, scale: number = 1): number => {
    return noiseGen.value.noise3D(x * scale, y * scale, z * scale)
  }

  /**
   * Get FBM noise for multi-scale effects
   */
  const getFBM = (x: number, y: number, octaves: number = 4): number => {
    return noiseGen.value.fbm(x, y, octaves, 0.5, 2)
  }

  /**
   * Get ambient drift for particles
   */
  const getAmbientDrift = (particleIndex: number, time: number): Vector3 => {
    const drift = new Vector3(
      Math.sin(time * turbulenceSpeed.value + particleIndex * 0.1) * turbulenceAmount.value,
      Math.cos(time * turbulenceSpeed.value * 0.7 + particleIndex * 0.15) * turbulenceAmount.value,
      Math.sin(time * turbulenceSpeed.value * 0.5 + particleIndex * 0.2) * turbulenceAmount.value * 0.5
    )

    // Add fractal noise for organic feel
    const fbmValue = noiseGen.value.fbm(
      particleIndex * 0.1,
      time * 0.5,
      3,
      0.6,
      2
    )
    drift.addScalar(fbmValue * turbulenceAmount.value * 0.3)

    return drift
  }

  /**
   * Update mouse position
   */
  const updateMousePosition = (screenX: number, screenY: number) => {
    mousePhysics.value.updateMousePosition(
      screenX,
      screenY,
      window.innerWidth,
      window.innerHeight
    )
  }

  /**
   * Update mouse world position from raycast
   */
  const updateMouseWorldPosition = (worldPos: Vector3) => {
    mousePhysics.value.updateWorldPosition(worldPos)
  }

  /**
   * Get force applied by mouse to particle
   */
  const getMouseForce = (particlePos: Vector3): { force: Vector3; intensity: number } => {
    return mousePhysics.value.calculateForce(particlePos)
  }

  /**
   * Check if particle is in mouse interaction range
   */
  const isInMouseRange = (particlePos: Vector3): boolean => {
    return mousePhysics.value.isInRange(particlePos)
  }

  /**
   * Set mouse interaction mode
   */
  const setMouseMode = (mode: 'repulsion' | 'attraction' | 'vortex') => {
    mousePhysics.value.setForceMode(mode)
  }

  /**
   * Toggle between mouse modes
   */
  const toggleMouseMode = () => {
    mousePhysics.value.toggleForceMode()
  }

  /**
   * Deactivate mouse interactions
   */
  const deactivateMouse = () => {
    mousePhysics.value.deactivate()
  }

  /**
   * Get mouse trail for visualization
   */
  const getMouseTrail = (): Vector3[] => {
    return mousePhysics.value.getTrail()
  }

  /**
   * Cleanup
   */
  const cleanup = () => {
    window.removeEventListener('resize', handleWindowResize)
    mousePhysics.value.reset()
  }

  // Register cleanup on unmount
  onUnmounted(cleanup)

  return {
    // State
    particleCount,
    morphProgress,
    turbulenceAmount,
    currentFPS,

    // Initialization
    initialize,

    // Updates
    update,
    updateMousePosition,
    updateMouseWorldPosition,

    // Morphing
    scheduleMorph,
    morphProgress,

    // Noise & effects
    getNoise,
    getFBM,
    getAmbientDrift,

    // Mouse interactions
    getMouseForce,
    isInMouseRange,
    setMouseMode,
    toggleMouseMode,
    deactivateMouse,
    getMouseTrail,

    // Utilities
    cleanup
  }
}

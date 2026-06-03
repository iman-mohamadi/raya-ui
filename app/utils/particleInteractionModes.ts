/**
 * Particle Interaction Modes for SOTD-winning effects
 * 4 creative modes with unique physics, colors, and visual feedback
 */

export type InteractionMode = 'explosion' | 'vortex' | 'magnet' | 'chaos'

export interface InteractionConfig {
  mode: InteractionMode
  mouseRadius: number
  mouseForce: number
  colorShift: [number, number, number] // RGB offset
  glowIntensity: number
  particleTrailLength: number
  velocityDamping: number
}

const ModeConfigs: Record<InteractionMode, InteractionConfig> = {
  explosion: {
    mode: 'explosion',
    mouseRadius: 40,
    mouseForce: 35,
    colorShift: [1, 0.3, 0], // Orange/red shift
    glowIntensity: 1.5,
    particleTrailLength: 15,
    velocityDamping: 0.92,
  },
  vortex: {
    mode: 'vortex',
    mouseRadius: 50,
    mouseForce: 28,
    colorShift: [0.5, 0, 1], // Purple/blue shift
    glowIntensity: 1.8,
    particleTrailLength: 25,
    velocityDamping: 0.85,
  },
  magnet: {
    mode: 'magnet',
    mouseRadius: 35,
    mouseForce: 20,
    colorShift: [0, 0.8, 1], // Cyan/blue shift
    glowIntensity: 1.2,
    particleTrailLength: 10,
    velocityDamping: 0.88,
  },
  chaos: {
    mode: 'chaos',
    mouseRadius: 60,
    mouseForce: 40,
    colorShift: [1, 0.5, 0.2], // Golden/orange shift
    glowIntensity: 2.0,
    particleTrailLength: 30,
    velocityDamping: 0.80,
  },
}

export class ParticleInteractionManager {
  currentMode: InteractionMode = 'explosion'
  private modeHistory: InteractionMode[] = []
  private transitionProgress: number = 0
  private transitionDuration: number = 300 // ms

  constructor() {
    this.modeHistory = ['explosion']
  }

  getConfig(): InteractionConfig {
    return ModeConfigs[this.currentMode]
  }

  getCurrentMode(): InteractionMode {
    return this.currentMode
  }

  switchMode(newMode: InteractionMode): void {
    if (newMode !== this.currentMode) {
      this.modeHistory.push(newMode)
      this.currentMode = newMode
      this.transitionProgress = 0
    }
  }

  nextMode(): InteractionMode {
    const modes: InteractionMode[] = ['explosion', 'vortex', 'magnet', 'chaos']
    const currentIndex = modes.indexOf(this.currentMode)
    const nextIndex = (currentIndex + 1) % modes.length
    this.switchMode(modes[nextIndex])
    return this.currentMode
  }

  getTransitionProgress(): number {
    this.transitionProgress = Math.min(1, this.transitionProgress + 0.016) // Assume 60fps
    return this.transitionProgress
  }

  getModeLabel(): string {
    const labels: Record<InteractionMode, string> = {
      explosion: 'EXPLOSION',
      vortex: 'VORTEX',
      magnet: 'MAGNET',
      chaos: 'CHAOS',
    }
    return labels[this.currentMode]
  }

  getModeDescription(): string {
    const descriptions: Record<InteractionMode, string> = {
      explosion: 'Violent outward particle burst',
      vortex: 'Swirling tornado vortex effect',
      magnet: 'Smooth attraction to cursor',
      chaos: 'Turbulent chaotic storm',
    }
    return descriptions[this.currentMode]
  }

  /**
   * Calculate physics force based on interaction mode
   */
  calculateForce(
    distance: number,
    mode: InteractionMode,
    mouseVelocity: number = 1
  ): {
    x: number
    y: number
    z: number
  } {
    const config = ModeConfigs[mode]
    const intensity =
      Math.max(0, 1 - distance / config.mouseRadius) ** 2

    let forceX = 0
    let forceY = 0
    let forceZ = 0

    switch (mode) {
      case 'explosion':
        // Violent outward push with Z depth
        forceX = intensity * config.mouseForce * 2
        forceY = intensity * config.mouseForce * 2
        forceZ = -intensity * config.mouseForce * 0.8
        break

      case 'vortex':
        // Swirling tangential force with lift
        forceX = intensity * config.mouseForce * 1.5
        forceY = intensity * config.mouseForce * 1.5
        forceZ = intensity * config.mouseForce * 0.6 // Lift effect
        break

      case 'magnet':
        // Smooth attraction toward cursor
        forceX = -intensity * config.mouseForce * 0.8
        forceY = -intensity * config.mouseForce * 0.8
        forceZ = -intensity * config.mouseForce * 0.4
        break

      case 'chaos':
        // Turbulent, chaotic motion
        forceX = (intensity * config.mouseForce * 1.8) * Math.sin(Date.now() * 0.001)
        forceY = (intensity * config.mouseForce * 1.8) * Math.cos(Date.now() * 0.0008)
        forceZ = (intensity * config.mouseForce * 0.9) * Math.sin(Date.now() * 0.0015)
        break
    }

    // Apply velocity influence
    forceX *= (1 + mouseVelocity * 0.5)
    forceY *= (1 + mouseVelocity * 0.5)

    return { x: forceX, y: forceY, z: forceZ }
  }
}

export const interactionManager = new ParticleInteractionManager()

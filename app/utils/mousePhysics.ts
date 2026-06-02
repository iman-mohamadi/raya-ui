/**
 * Advanced Mouse Physics System
 * Handles repulsion/attraction, vortex, velocity-based forces, trailing particles
 */

import { Vector3, Vector2 } from 'three'

export interface MousePhysicsConfig {
  repulsionRadius: number
  repulsionForce: number
  attractionRadius: number
  attractionForce: number
  vortexForce: number
  velocityInfluence: number
  dampening: number
  trailLength: number
}

export interface MouseState {
  position: Vector3
  prevPosition: Vector3
  velocity: Vector2
  isActive: boolean
  force: 'repulsion' | 'attraction' | 'vortex'
  trail: Vector3[]
}

export class MousePhysicsSystem {
  private mouseState: MouseState
  private config: MousePhysicsConfig
  private frameCount: number = 0

  constructor(config: Partial<MousePhysicsConfig> = {}) {
    this.mouseState = {
      position: new Vector3(9999, 9999, 9999),
      prevPosition: new Vector3(9999, 9999, 9999),
      velocity: new Vector2(0, 0),
      isActive: false,
      force: 'repulsion',
      trail: []
    }

    this.config = {
      repulsionRadius: 12,
      repulsionForce: 10,
      attractionRadius: 8,
      attractionForce: 6,
      vortexForce: 15,
      velocityInfluence: 2,
      dampening: 0.92,
      trailLength: 30,
      ...config
    }
  }

  /**
   * Update mouse state with screen position
   */
  updateMousePosition(screenX: number, screenY: number, width: number, height: number): void {
    // Store previous position
    this.mouseState.prevPosition.copy(this.mouseState.position)

    // Calculate velocity (in normalized screen space)
    const newVelX = (screenX / width) * 2 - 1
    const newVelY = -(screenY / height) * 2 + 1

    this.mouseState.velocity.x = (newVelX - this.mouseState.position.x) * 0.5
    this.mouseState.velocity.y = (newVelY - this.mouseState.position.y) * 0.5
    this.mouseState.velocity.multiplyScalar(this.config.velocityInfluence)

    this.mouseState.isActive = true
  }

  /**
   * Update mouse world position from raycast
   */
  updateWorldPosition(worldPos: Vector3): void {
    this.mouseState.prevPosition.copy(this.mouseState.position)
    this.mouseState.position.copy(worldPos)

    // Add to trail
    this.mouseState.trail.push(worldPos.clone())
    if (this.mouseState.trail.length > this.config.trailLength) {
      this.mouseState.trail.shift()
    }

    this.mouseState.isActive = true
  }

  /**
   * Set force mode
   */
  setForceMode(mode: 'repulsion' | 'attraction' | 'vortex'): void {
    this.mouseState.force = mode
  }

  /**
   * Toggle force mode (cycle through modes)
   */
  toggleForceMode(): void {
    const modes: Array<'repulsion' | 'attraction' | 'vortex'> = ['repulsion', 'attraction', 'vortex']
    const currentIndex = modes.indexOf(this.mouseState.force)
    this.mouseState.force = modes[(currentIndex + 1) % modes.length]
  }

  /**
   * Calculate force applied to a particle at given position
   */
  calculateForce(particlePos: Vector3, deltaTime: number = 0.016): { force: Vector3; intensity: number } {
    if (!this.mouseState.isActive) {
      return { force: new Vector3(0, 0, 0), intensity: 0 }
    }

    const toParticle = particlePos.clone().sub(this.mouseState.position)
    const distance = toParticle.length()

    let force = new Vector3(0, 0, 0)
    let intensity = 0

    switch (this.mouseState.force) {
      case 'repulsion': {
        const radius = this.config.repulsionRadius
        if (distance < radius) {
          intensity = (radius - distance) / radius
          const normalizedDir = toParticle.normalize()

          // Base repulsion
          force = normalizedDir.multiplyScalar(intensity * intensity * this.config.repulsionForce)

          // Add Z-depth push for 3D effect
          force.z -= intensity * intensity * (this.config.repulsionForce * 0.6)

          // Velocity-based enhancement
          const velocityMagnitude = this.mouseState.velocity.length()
          if (velocityMagnitude > 0.01) {
            const velocityInfluence = new Vector3(
              this.mouseState.velocity.x * intensity * this.config.velocityInfluence * 0.5,
              this.mouseState.velocity.y * intensity * this.config.velocityInfluence * 0.5,
              0
            )
            force.add(velocityInfluence)
          }
        }
        break
      }

      case 'attraction': {
        const radius = this.config.attractionRadius
        if (distance < radius && distance > 0.1) {
          intensity = 1 - distance / radius
          const normalizedDir = toParticle.normalize().multiplyScalar(-1)

          // Attraction pull
          force = normalizedDir.multiplyScalar(intensity * this.config.attractionForce)

          // Dampening effect (particles cluster near mouse)
          const velDir = new Vector3(
            this.mouseState.velocity.x,
            this.mouseState.velocity.y,
            0
          )
          force.add(velDir.multiplyScalar(intensity * 0.3))
        }
        break
      }

      case 'vortex': {
        const radius = this.config.repulsionRadius
        if (distance < radius) {
          intensity = (radius - distance) / radius

          // Tangential force (perpendicular to particle-mouse vector)
          const tangent = new Vector3(-toParticle.y, toParticle.x, toParticle.z * 0.5).normalize()
          force = tangent.multiplyScalar(intensity * intensity * this.config.vortexForce)

          // Add slight outward push
          force.add(toParticle.clone().normalize().multiplyScalar(intensity * 2))

          // Swirling effect based on velocity
          if (this.mouseState.velocity.length() > 0.01) {
            const swirl = new Vector3(
              Math.sin(this.frameCount * 0.05) * intensity,
              Math.cos(this.frameCount * 0.05) * intensity,
              0
            )
            force.add(swirl.multiplyScalar(this.config.vortexForce * 0.3))
          }
        }
        break
      }
    }

    // Velocity dampening
    this.mouseState.velocity.multiplyScalar(this.config.dampening)

    this.frameCount++
    return { force, intensity }
  }

  /**
   * Get particle trail for visualization
   */
  getTrail(): Vector3[] {
    return this.mouseState.trail
  }

  /**
   * Check if particle is within interaction range
   */
  isInRange(particlePos: Vector3): boolean {
    if (!this.mouseState.isActive) return false

    const distance = particlePos.distanceTo(this.mouseState.position)
    const radius = this.mouseState.force === 'attraction' 
      ? this.config.attractionRadius 
      : this.config.repulsionRadius

    return distance < radius
  }

  /**
   * Deactivate mouse (when mouse leaves window or on mobile)
   */
  deactivate(): void {
    this.mouseState.isActive = false
    this.mouseState.velocity.set(0, 0)
  }

  /**
   * Get current mouse state
   */
  getState(): MouseState {
    return { ...this.mouseState }
  }

  /**
   * Update configuration
   */
  setConfig(newConfig: Partial<MousePhysicsConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.mouseState.position.set(9999, 9999, 9999)
    this.mouseState.prevPosition.set(9999, 9999, 9999)
    this.mouseState.velocity.set(0, 0)
    this.mouseState.trail = []
    this.mouseState.isActive = false
    this.frameCount = 0
  }
}

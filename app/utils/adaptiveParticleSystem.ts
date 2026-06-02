/**
 * Adaptive Particle System
 * Dynamically adjusts particle count based on device capabilities, window size, and performance.
 * Ensures consistent behavior across desktop, tablet, and mobile devices.
 */

export interface ParticleConfig {
  particleCount: number
  maxParticleCount: number
  minParticleCount: number
  currentDPR: number
  targetFPS: number
}

export class AdaptiveParticleSystem {
  private config: ParticleConfig
  private frameCount: number = 0
  private lastFrameTime: number = Date.now()
  private frameTimings: number[] = []
  private readonly maxTimings: number = 60

  constructor() {
    this.config = this.detectDeviceCapabilities()
  }

  /**
   * Detect device capabilities and determine optimal particle count
   */
  private detectDeviceCapabilities(): ParticleConfig {
    if (typeof window === 'undefined') {
      return {
        particleCount: 8000,
        maxParticleCount: 8000,
        minParticleCount: 4000,
        currentDPR: 1,
        targetFPS: 60
      }
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight
    const screenArea = width * height
    const isHighEndDevice = this.isHighEndDevice()
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024

    let baseCount: number
    let maxCount: number
    let minCount: number

    if (isMobile) {
      // Mobile: 4K–8K particles, can't handle more
      baseCount = screenArea > 360000 ? 6000 : 4000
      maxCount = 8000
      minCount = 3000
    } else if (isTablet) {
      // Tablet: 8K–12K particles
      baseCount = 10000
      maxCount = 12000
      minCount = 6000
    } else if (isHighEndDevice) {
      // Desktop High-End: 20K–25K particles
      baseCount = screenArea > 2073600 ? 25000 : 20000
      maxCount = 25000
      minCount = 12000
    } else {
      // Desktop Low-End: 12K–16K particles
      baseCount = 16000
      maxCount = 18000
      minCount = 8000
    }

    // Scale by DPR
    const scaledCount = Math.round(baseCount * (dpr === 2 ? 1.2 : 1))
    const scaledMax = Math.round(maxCount * (dpr === 2 ? 1.2 : 1))
    const scaledMin = Math.round(minCount * (dpr === 2 ? 0.8 : 1))

    return {
      particleCount: Math.max(scaledMin, Math.min(scaledCount, scaledMax)),
      maxParticleCount: scaledMax,
      minParticleCount: scaledMin,
      currentDPR: dpr,
      targetFPS: isMobile ? 50 : 60
    }
  }

  /**
   * Detect if device is high-end based on GPU capabilities
   */
  private isHighEndDevice(): boolean {
    if (typeof window === 'undefined') return false

    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) return false

      // Check GPU capabilities
      const maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
      const maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS)
      const renderer = gl.getParameter(gl.RENDERER).toLowerCase()

      // High-end indicators
      const hasGoodGPU = maxTexSize >= 16384 && maxVaryings >= 15
      const isGamingGPU =
        renderer.includes('rtx') ||
        renderer.includes('rtx 30') ||
        renderer.includes('radeon') ||
        renderer.includes('apple') // M-series

      return hasGoodGPU || isGamingGPU
    } catch {
      return false
    }
  }

  /**
   * Update particle count based on current FPS
   * Adapts in real-time if performance drops
   */
  updatePerformance(deltaTime: number): void {
    this.frameTimings.push(deltaTime)
    if (this.frameTimings.length > this.maxTimings) {
      this.frameTimings.shift()
    }

    // Only adjust every 60 frames to avoid jitter
    if (this.frameCount % 60 === 0 && this.frameTimings.length >= 30) {
      const avgFrameTime = this.frameTimings.reduce((a, b) => a + b) / this.frameTimings.length
      const currentFPS = 1000 / avgFrameTime

      // If FPS drops below target, reduce particle count
      if (currentFPS < this.config.targetFPS * 0.9) {
        const newCount = Math.max(
          this.config.minParticleCount,
          Math.round(this.config.particleCount * 0.85)
        )
        this.config.particleCount = newCount
      }

      // If FPS is stable and high, can increase particle count
      if (currentFPS > this.config.targetFPS * 1.1) {
        const newCount = Math.min(
          this.config.maxParticleCount,
          Math.round(this.config.particleCount * 1.1)
        )
        this.config.particleCount = newCount
      }
    }

    this.frameCount++
  }

  /**
   * Handle window resize and regenerate particle count
   */
  handleResize(): ParticleConfig {
    const newConfig = this.detectDeviceCapabilities()
    this.config = newConfig
    this.frameTimings = [] // Reset FPS calculation
    return this.config
  }

  /**
   * Get current configuration
   */
  getConfig(): ParticleConfig {
    return { ...this.config }
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.config.particleCount
  }

  /**
   * Get device pixel ratio
   */
  getDPR(): number {
    return this.config.currentDPR
  }

  /**
   * Force particle count (useful for testing)
   */
  setParticleCount(count: number): void {
    this.config.particleCount = Math.max(
      this.config.minParticleCount,
      Math.min(count, this.config.maxParticleCount)
    )
  }

  /**
   * Reset to optimal defaults
   */
  reset(): void {
    this.config = this.detectDeviceCapabilities()
    this.frameTimings = []
    this.frameCount = 0
  }
}

// Singleton instance
export const adaptiveSystem = new AdaptiveParticleSystem()

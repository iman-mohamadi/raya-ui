/**
 * Simplex Noise & Perlin Noise Implementation
 * Generates smooth, organic noise for particle drift, morphing, and dynamic effects
 */

/**
 * Fast Simplex Noise implementation
 * Based on the algorithm by Stefan Gustavson
 */
export class SimplexNoise {
  private permutation: number[]
  private p: number[]

  constructor(seed: number = Math.random() * 65536) {
    const p = Array.from({ length: 256 }, (_, i) => i)

    // Fisher-Yates shuffle with seed
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed + i * 73) % (i + 1))
      ;[p[i], p[j]] = [p[j], p[i]]
    }

    this.permutation = p
    this.p = [...p, ...p]
  }

  /**
   * 2D Simplex noise
   */
  noise2D(x: number, y: number): number {
    const n0: number = 0
    const n1: number = 0
    const n2: number = 0

    // Skew the input space to determine which simplex cell we're in
    const s = (x + y) * 0.5 * (Math.sqrt(3) - 1)
    const i = Math.floor(x + s)
    const j = Math.floor(y + s)

    const t = (i + j) * (3 - Math.sqrt(3)) / 6
    const x0 = x - (i - t)
    const y0 = y - (j - t)

    const i1 = x0 > y0 ? 1 : 0
    const j1 = x0 > y0 ? 0 : 1

    const x1 = x0 - i1 + (3 - Math.sqrt(3)) / 6
    const y1 = y0 - j1 + (3 - Math.sqrt(3)) / 6
    const x2 = x0 - 1 + 2 * (3 - Math.sqrt(3)) / 6
    const y2 = y0 - 1 + 2 * (3 - Math.sqrt(3)) / 6

    const ii = i & 255
    const jj = j & 255

    const gi0 = this.permutation[(ii + this.permutation[jj]) & 255] % 12
    const gi1 = this.permutation[(ii + i1 + this.permutation[(jj + j1) & 255]) & 255] % 12
    const gi2 = this.permutation[(ii + 1 + this.permutation[(jj + 1) & 255]) & 255] % 12

    let t0 = 0.5 - x0 * x0 - y0 * y0
    const n0_computed = t0 < 0 ? 0 : Math.pow(t0, 4) * this.dotProduct(gi0, x0, y0)

    let t1 = 0.5 - x1 * x1 - y1 * y1
    const n1_computed = t1 < 0 ? 0 : Math.pow(t1, 4) * this.dotProduct(gi1, x1, y1)

    let t2 = 0.5 - x2 * x2 - y2 * y2
    const n2_computed = t2 < 0 ? 0 : Math.pow(t2, 4) * this.dotProduct(gi2, x2, y2)

    return 70 * (n0_computed + n1_computed + n2_computed)
  }

  /**
   * 3D Simplex noise
   */
  noise3D(x: number, y: number, z: number): number {
    const s = (x + y + z) / 3
    const i = Math.floor(x + s)
    const j = Math.floor(y + s)
    const k = Math.floor(z + s)

    const t = (i + j + k) / 6
    const x0 = x - (i - t)
    const y0 = y - (j - t)
    const z0 = z - (k - t)

    const i1 = x0 >= y0 ? (y0 >= z0 ? 1 : y0 > x0 ? 0 : 2) : y0 < z0 ? 1 : z0 > x0 ? 2 : 0
    const j1 = y0 >= z0 ? (z0 >= x0 ? 1 : z0 > y0 ? 0 : 2) : z0 < x0 ? 1 : x0 > y0 ? 2 : 0
    const k1 = z0 >= x0 ? (x0 >= y0 ? 1 : x0 > z0 ? 0 : 2) : x0 < y0 ? 1 : y0 > z0 ? 2 : 0

    const x1 = x0 - i1 + 1 / 6
    const y1 = y0 - j1 + 1 / 6
    const z1 = z0 - k1 + 1 / 6
    const x2 = x0 - 1 + 2 / 6
    const y2 = y0 - 1 + 2 / 6
    const z2 = z0 - 1 + 2 / 6
    const x3 = x0 - 1 + 3 / 6
    const y3 = y0 - 1 + 3 / 6
    const z3 = z0 - 1 + 3 / 6

    const ii = i & 255
    const jj = j & 255
    const kk = k & 255

    const n0 = this.falloff3D(x0, y0, z0, ii, jj, kk)
    const n1 = this.falloff3D(x1, y1, z1, ii + i1, jj + j1, kk + k1)
    const n2 = this.falloff3D(x2, y2, z2, ii + 1, jj + 1, kk + 1)
    const n3 = this.falloff3D(x3, y3, z3, ii + 1, jj + 1, kk + 1)

    return 32 * (n0 + n1 + n2 + n3)
  }

  /**
   * Fractional Brownian Motion (fBm) for multi-scale noise
   */
  fbm(x: number, y: number, octaves: number = 4, persistence: number = 0.5, lacunarity: number = 2): number {
    let value = 0
    let amplitude = 1
    let frequency = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise2D(x * frequency, y * frequency)
      maxValue += amplitude
      amplitude *= persistence
      frequency *= lacunarity
    }

    return value / maxValue
  }

  /**
   * Fractional Brownian Motion for 3D
   */
  fbm3D(x: number, y: number, z: number, octaves: number = 4, persistence: number = 0.5, lacunarity: number = 2): number {
    let value = 0
    let amplitude = 1
    let frequency = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise3D(x * frequency, y * frequency, z * frequency)
      maxValue += amplitude
      amplitude *= persistence
      frequency *= lacunarity
    }

    return value / maxValue
  }

  private falloff3D(x: number, y: number, z: number, i: number, j: number, k: number): number {
    let t = 0.6 - x * x - y * y - z * z
    if (t < 0) return 0

    const gi = this.permutation[(i + this.permutation[(j + this.permutation[k & 255]) & 255]) & 255] % 12
    return Math.pow(t, 4) * this.dotProduct(gi, x, y, z)
  }

  private dotProduct(g: number, x: number, y: number, z: number = 0): number {
    const gradients = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ]
    const grad = gradients[g]
    return grad[0] * x + grad[1] * y + grad[2] * z
  }
}

/**
 * Easing functions for smooth animations
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeOutCirc: (t: number) => Math.sqrt(1 - (--t) * t),
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }
}

/**
 * Color interpolation helpers
 */
export const colorUtils = {
  hexToRgb: (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [0, 0, 0]
  },

  rgbToHex: (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)).toString(16).slice(1)
  },

  lerpColor: (color1: [number, number, number], color2: [number, number, number], t: number): [number, number, number] => {
    return [
      color1[0] + (color2[0] - color1[0]) * t,
      color1[1] + (color2[1] - color1[1]) * t,
      color1[2] + (color2[2] - color1[2]) * t
    ]
  }
}

<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted, ref } from 'vue'
import { AdditiveBlending, Vector3, Color, BufferAttribute, Raycaster, Plane, Vector2 } from 'three'
import { useLoop, useTresContext } from '@tresjs/core'
import { raya3D } from '~/composables/home/useRayaState'
import { adaptiveSystem } from '~/utils/adaptiveParticleSystem'
import { SimplexNoise, easing } from '~/utils/noiseGenerator'
import { MousePhysicsSystem } from '~/utils/mousePhysics'

// Initialize adaptive particle system
let particleCount = adaptiveSystem.getParticleCount()
let currentDPR = adaptiveSystem.getDPR()
let needsBufferRegeneration = true
let mouseMode = ref<0 | 1 | 2>(0) // 0 = repulsion, 1 = attraction, 2 = vortex

// Initialize noise and physics systems
const noiseGen = new SimplexNoise(Math.random() * 65536)
const mousePhysics = new MousePhysicsSystem({
  repulsionRadius: 15,
  repulsionForce: 12,
  attractionRadius: 10,
  attractionForce: 8,
  vortexForce: 18,
  velocityInfluence: 2.5,
  dampening: 0.88,
  trailLength: 40
})

// Add keyboard listener for mouse mode switching
const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'KeyM' || e.code === 'Space') {
    mouseMode.value = ((mouseMode.value + 1) % 3) as 0 | 1 | 2
    mousePhysics.setForceMode(['repulsion', 'attraction', 'vortex'][mouseMode.value] as any)
    
    // Emit event for mode change
    const event = new CustomEvent('mouseModeChanged', {
      detail: { mode: mouseMode.value }
    })
    window.dispatchEvent(event)
  }
}

// ==========================================
// 1. MATHEMATICAL SHAPE GENERATORS (Dynamic with proper buffer sizing)
// ==========================================

const genChaos = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100
  }
  return positions
}

const genR = (count: number = particleCount) => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new Float32Array(count * 3)

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, 1024, 1024)
  ctx.font = 'bold 800px "Playfair Display", serif'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('R', 512, 512)

  const imgData = ctx.getImageData(0, 0, 1024, 1024).data
  const pts = []
  for (let y = 0; y < 1024; y += 4) {
    for (let x = 0; x < 1024; x += 4) {
      if (imgData[(y * 1024 + x) * 4] > 128) {
        pts.push({ x: (x / 1024 - 0.5) * 16, y: -(y / 1024 - 0.5) * 16 })
      }
    }
  }

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const pt = pts[Math.floor(Math.random() * pts.length)] || { x: 0, y: 0 }
    positions[i * 3]     = pt.x + (Math.random() - 0.5) * 0.4
    positions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.4
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3.0
  }
  return positions
}

let cachedRShape: Float32Array | null = null

const genWave = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 60
    const z = (Math.random() - 0.5) * 60
    const y = Math.sin(x * 0.2) * 2 + Math.cos(z * 0.2) * 2 - 5
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  return positions
}

const genAI = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    const r = Math.random() > 0.8 ? Math.random() * 12 : Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

const genFintech = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    const y = (Math.random() - 0.5) * 16
    const radius = 8 - Math.abs(y)
    const theta = Math.random() * Math.PI * 2
    positions[i * 3] = radius * Math.cos(theta)
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = radius * Math.sin(theta)
  }
  return positions
}

const genCommerce = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2
    const v = Math.random() * Math.PI * 2
    const R = 6
    const r = 2 + (Math.random() - 0.5)
    positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u)
    positions[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u)
    positions[i * 3 + 2] = r * Math.sin(v)
  }
  return positions
}

const genCreative = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    const y = (Math.random() - 0.5) * 20
    const offset = Math.random() > 0.5 ? 0 : Math.PI
    positions[i * 3] = Math.sin(y + offset) * 5
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.cos(y + offset) * 5
  }
  return positions
}

const genAnalytics = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    positions[i * 3] = Math.round((Math.random() - 0.5) * 10) * 1.5
    positions[i * 3 + 1] = Math.round((Math.random() - 0.5) * 10) * 1.5
    positions[i * 3 + 2] = Math.round((Math.random() - 0.5) * 10) * 1.5
  }
  return positions
}

const genMacro = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  const centers = [{ x: -20, y: 0, z: -10 }, { x: 20, y: 0, z: -10 }, { x: 0, y: 15, z: -20 }, { x: -12, y: -15, z: 0 }, { x: 12, y: -15, z: 0 }]
  for(let i = 0; i < count; i++) {
    const center = centers[i % 5]
    const r = 3 + Math.random() * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[i * 3] = center.x + r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = center.z + r * Math.cos(phi)
  }
  return positions
}

const genEngine = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    if (Math.random() > 0.4) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const r = 2 + Math.random() * 3
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    } else {
      const ringRadius = 10 + Math.floor(Math.random() * 3) * 2
      const theta = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(theta) * ringRadius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      positions[i * 3 + 2] = Math.sin(theta) * ringRadius
    }
  }
  return positions
}

const genUI = (seed: number, count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for(let i = 0; i < count; i++) {
    if (Math.random() > 0.2) {
      const panelCount = 3 + (seed % 3)
      const panelId = i % panelCount
      const w = 4 + (Math.random() * 4 * seed) % 6
      const h = 2 + (Math.random() * 8 * seed) % 10
      const px = -10 + ((panelId * 7 * seed) % 20)
      const py = -5 + ((panelId * 3 * seed) % 10)
      const pz = -5 + (panelId * 2)
      positions[i * 3] = px + (Math.random() - 0.5) * w
      positions[i * 3 + 1] = py + (Math.random() - 0.5) * h
      positions[i * 3 + 2] = pz + (Math.random() - 0.5) * 0.5
    } else {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
  }
  return positions
}

const genEvolvedR = (count: number = particleCount) => {
  const base = cachedRShape || new Float32Array(count * 3)
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    if (i < base.length / 3 && Math.random() > 0.7) {
      positions[i * 3] = base[i * 3]
      positions[i * 3 + 1] = base[i * 3 + 1]
      positions[i * 3 + 2] = base[i * 3 + 2]
    } else {
      const u = Math.random() * Math.PI * 2
      const v = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 8
      positions[i * 3] = (radius + Math.cos(v)) * Math.cos(u)
      positions[i * 3 + 1] = (radius + Math.cos(v)) * Math.sin(u) * 0.5
      positions[i * 3 + 2] = Math.sin(v) + Math.sin(u * 3) * 2
    }
  }
  return positions
}

const genSingularity = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - 2 * (i / count))
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const ripple = Math.sin(theta * 8) * Math.cos(phi * 8) * 1.5
    const r = 12 + ripple
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

const genInfiniteVoid = (count: number = particleCount) => {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2.0 * Math.PI
    const phi = Math.acos(2.0 * v - 1.0)
    const r = 50 + Math.random() * 400
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

/**
 * Build shapes array - regenerated when particle count changes
 */
const buildShapes = (count: number) => {
  cachedRShape = genR(count)
  return [
    genChaos(count), cachedRShape, genWave(count), genAI(count), genFintech(count),
    genCommerce(count), genCreative(count), genAnalytics(count), genMacro(count), genEngine(count),
    genUI(1, count), genUI(2, count), genUI(3, count), genUI(4, count), genUI(5, count),
    cachedRShape, genEvolvedR(count), genSingularity(count), genInfiniteVoid(count)
  ]
}

let shapes = buildShapes(particleCount)

const geometryRef = shallowRef<any>(null)
const materialRef = shallowRef<any>(null)
const rotationY = shallowRef(0)

let currentStartIndex = -1
let currentEndIndex = -1

// ==========================================
// 2. MOUSE RAYCASTING SETUP
// ==========================================

const { camera } = useTresContext()
const mouse3D = new Vector3(9999, 9999, 9999)
const mouse2D = new Vector2(-9999, -9999)
const raycaster = new Raycaster()
const invisiblePlane = new Plane(new Vector3(0, 0, 1), 0)

const onMouseMove = (event: MouseEvent) => {
  mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1
}

// Initialize with proper adaptive system and event listeners
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', () => {
    const newConfig = adaptiveSystem.handleResize()
    particleCount = newConfig.particleCount
    currentDPR = newConfig.currentDPR
    shapes = buildShapes(particleCount)
    needsBufferRegeneration = true
  })

  // Handle mouse leave (disable interactions when mouse leaves window)
  window.addEventListener('mouseleave', () => {
    mousePhysics.deactivate()
  })

  // Initialize first two shapes
  if (cachedRShape === null) {
    cachedRShape = genR(particleCount)
    shapes = buildShapes(particleCount)
  }

  if (geometryRef.value) {
    geometryRef.value.setAttribute('position', new BufferAttribute(shapes[0], 3))
    geometryRef.value.setAttribute('aTargetPosition', new BufferAttribute(shapes[1], 3))
    currentStartIndex = 0
    currentEndIndex = 1
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('mouseleave', () => {})
  mousePhysics.reset()
})

// ==========================================
// 3. GPU-ACCELERATED SHADERS
// ==========================================

const vertexShader = `
  uniform float uMorphFraction;
  uniform float uTime;
  uniform float uTurbulence;
  uniform float uPixelRatio;
  uniform float uTurbulenceSpeed;

  uniform vec3 uMousePos;
  uniform float uMouseRadius;
  uniform float uMouseForce;
  uniform int uMouseMode;

  attribute vec3 aTargetPosition;

  // Simplex noise approximation
  float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  // Multi-octave Perlin-like noise
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      if (i >= octaves) break;
      value += amplitude * sin(dot(p * frequency, vec3(12.9898, 78.233, 45.164)));
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    // Advanced smooth morphing - cubic Hermite easing for silky transitions
    float t = uMorphFraction;
    float easeProgress = t * t * (3.0 - 2.0 * t);
    
    // Multi-stage smooth interpolation
    vec3 morphedPos = mix(position, aTargetPosition, easeProgress);
    
    // Add secondary smoothing pass for ultra-smooth transitions
    morphedPos = mix(morphedPos, aTargetPosition, easeProgress * easeProgress * 0.1);

    // Multi-layer organic turbulence for cinematic drift
    float timePhase = uTime * uTurbulenceSpeed;
    vec3 noiseInput = vec3(
      morphedPos.x * 0.5 + timePhase * 0.3,
      morphedPos.y * 0.5 + timePhase,
      float(gl_VertexID) * 0.1 + timePhase * 0.2
    );
    
    // Complex FBM sampling for natural looking motion
    float noiseFactor = fbm(noiseInput, 3) * uTurbulence;
    
    // Staggered, phase-shifted drift for organic feel
    float noiseX = sin(timePhase + float(gl_VertexID) * 0.1 + noiseFactor) * uTurbulence;
    float noiseY = cos(timePhase * 0.7 + float(gl_VertexID) * 0.15 + noiseFactor) * uTurbulence;
    float noiseZ = sin(timePhase * 0.5 + float(gl_VertexID) * 0.2) * uTurbulence * 0.5;
    
    // Add secondary wave layer for complexity
    noiseX += sin(timePhase * 3.0 + float(gl_VertexID) * 0.05) * uTurbulence * 0.3;
    noiseY += cos(timePhase * 2.3 + float(gl_VertexID) * 0.08) * uTurbulence * 0.3;

    // Apply drift with subtle acceleration/deceleration
    morphedPos.x += noiseX * (0.8 + 0.2 * sin(timePhase * 0.5));
    morphedPos.y += noiseY * (0.8 + 0.2 * cos(timePhase * 0.3));
    morphedPos.z += noiseZ;

    // Convert to World Space for accurate physics
    vec4 worldPos = modelMatrix * vec4(morphedPos, 1.0);

    // Advanced Mouse Physics with three force modes and velocity influence
    vec3 diffVec = worldPos.xyz - uMousePos;
    float distance = length(diffVec);
    
    if (distance < uMouseRadius) {
      // Smooth intensity falloff with easing for natural feel
      float t = 1.0 - (distance / uMouseRadius);
      float intensity = t * t * t * (t * (t * 6.0 - 15.0) + 10.0); // Smoothstep variant
      
      vec3 direction = normalize(diffVec + vec3(0.0001));
      
      if (uMouseMode == 0) {
        // Repulsion: Push outward in XY, inward in Z with velocity influence
        vec2 directionXY = normalize(diffVec.xy + vec2(0.0001));
        vec3 repulsionForce = vec3(directionXY, -0.6);
        
        // Enhanced force with cubic intensity curve for dramatic effect
        float forceMagnitude = intensity * intensity * intensity * uMouseForce;
        worldPos.xyz += repulsionForce * forceMagnitude;
        
        // Add secondary ripple effect
        worldPos.z += sin(distance * 3.0 - uTime * 5.0) * intensity * 0.5;
        
      } else if (uMouseMode == 1) {
        // Attraction: Pull toward mouse with spiral damping
        float attractionMagnitude = intensity * intensity * uMouseForce;
        worldPos -= direction * attractionMagnitude;
        
        // Add slight clockwise spiral to make attraction more cinematic
        vec3 tangent = normalize(vec3(-diffVec.y, diffVec.x, 0.0));
        worldPos += tangent * intensity * intensity * uMouseForce * 0.2;
        
      } else if (uMouseMode == 2) {
        // Vortex: Tangential spinning motion with layered swirl
        vec3 tangent = normalize(vec3(-diffVec.y, diffVec.x, diffVec.z * 0.5));
        float vortexForce = intensity * intensity * intensity * uMouseForce;
        worldPos.xyz += tangent * vortexForce;
        
        // Add layered orbital swirl with harmonics
        float baseSwirl = sin(uTime * 5.0 + float(gl_VertexID) * 0.05) * intensity;
        float harmonic = cos(uTime * 3.0 + float(gl_VertexID) * 0.1) * intensity * 0.5;
        
        worldPos.x += (baseSwirl + harmonic) * uMouseForce * 0.4;
        worldPos.y += cos(uTime * 5.0 + float(gl_VertexID) * 0.05 + 1.57) * (baseSwirl + harmonic) * uMouseForce * 0.4;
        
        // Centrifugal lift
        worldPos.z += abs(baseSwirl) * intensity * uMouseForce * 0.3;
      }
    }

    vec4 mvPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPosition;

    // Enhanced depth-based size with smoothing
    float baseSize = (40.0 / -mvPosition.z) * uPixelRatio;
    gl_PointSize = max(baseSize, 1.5);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    // Calculate distance from particle center
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    // Multi-layer anti-aliased edge for smooth appearance
    float alpha = smoothstep(0.52, 0.0, dist);
    
    // Radial gradient bloom effect - intense at center, fades smoothly
    float bloom = exp(-dist * dist * 8.0);
    
    // Secondary bloom layer for depth
    float subBloom = exp(-dist * dist * 3.0) * 0.5;
    
    // Combine effects for HDR-like glow
    float finalAlpha = alpha * 0.7 + bloom * 0.4 + subBloom * 0.2;
    finalAlpha *= uOpacity;
    
    // Color enhancement - slightly boost saturation at edges
    vec3 finalColor = uColor;
    if (dist < 0.3) {
      finalColor *= (1.0 + bloom * 0.2); // Brighten core
    }
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

const uniforms = {
  uMorphFraction: { value: 0 },
  uTime: { value: 0 },
  uTurbulence: { value: raya3D.turbulence },
  uTurbulenceSpeed: { value: 2.0 },
  uColor: { value: new Color(raya3D.particleColor) },
  uOpacity: { value: raya3D.particleOpacity },
  uPixelRatio: { value: currentDPR },
  uMousePos: { value: new Vector3(9999, 9999, 9999) },
  uMouseRadius: { value: 15.0 },
  uMouseForce: { value: 12.0 },
  uMouseMode: { value: 0 } // 0 = repulsion, 1 = attraction, 2 = vortex
}

// ==========================================
// 4. RENDER LOOP WITH ADAPTIVE SYSTEMS
// ==========================================

const { onBeforeRender } = useLoop()

const currentCamPos = new Vector3(0, 0, 20)
const currentLookAt = new Vector3(0, 0, 0)
const targetCamPos = new Vector3()
const targetLookAt = new Vector3()
let lastResizeCheckTime = 0

// Performance tracking for adaptive quality
let frameTimeAccumulator = 0
let frameCounter = 0
const FRAME_WINDOW = 30

onBeforeRender(({ delta, elapsed }) => {
  // Performance monitoring
  frameTimeAccumulator += delta
  frameCounter++
  
  // Check FPS every 30 frames and adapt if needed
  if (frameCounter >= FRAME_WINDOW) {
    const avgFrameTime = frameTimeAccumulator / frameCounter
    const fps = 1 / avgFrameTime
    
    // Dynamically adjust turbulence for performance
    if (fps < 45) {
      // Reduce detail for better performance on low-end devices
      uniforms.uTurbulence.value *= 0.95
    } else if (fps > 55) {
      // Increase detail if performance is good
      uniforms.uTurbulence.value = Math.min(uniforms.uTurbulence.value * 1.05, raya3D.turbulence)
    }
    
    frameTimeAccumulator = 0
    frameCounter = 0
  }
  
  rotationY.value += delta * 0.05

  // Check for resize every 500ms
  const now = Date.now()
  if (now - lastResizeCheckTime > 500) {
    lastResizeCheckTime = now
    if (typeof window !== 'undefined') {
      const newDPR = Math.min(window.devicePixelRatio || 1, 2)
      const newConfig = adaptiveSystem.getConfig()
      
      // If DPR or particle count changed significantly, regenerate
      if (newDPR !== currentDPR || newConfig.particleCount !== particleCount) {
        currentDPR = newDPR
        particleCount = newConfig.particleCount
        shapes = buildShapes(particleCount)
        needsBufferRegeneration = true
      }
    }
  }

  // Update adaptive performance tracking
  adaptiveSystem.updatePerformance(delta * 1000)

  if (camera.value) {
    targetCamPos.set(raya3D.cameraX, raya3D.cameraY, raya3D.cameraZ)
    targetLookAt.set(raya3D.lookAtX, raya3D.lookAtY, raya3D.lookAtZ)
    currentCamPos.lerp(targetCamPos, 0.03)
    currentLookAt.lerp(targetLookAt, 0.05)
    camera.value.position.copy(currentCamPos)
    camera.value.lookAt(currentLookAt)

    // MOUSE PHYSICS RAYCAST - Advanced System
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
    if (!isMobile && mouse2D.x !== -9999) {
      raycaster.setFromCamera(mouse2D, camera.value)
      const targetHit = raycaster.ray.intersectPlane(invisiblePlane, new Vector3())
      if (targetHit) {
        mouse3D.lerp(targetHit, 0.15)
        mousePhysics.updateMouseWorldPosition(targetHit)
      }
    }
  }

  // Handle buffer regeneration when particle count changes
  if (needsBufferRegeneration && geometryRef.value) {
    geometryRef.value.setAttribute('position', new BufferAttribute(shapes[0], 3))
    geometryRef.value.setAttribute('aTargetPosition', new BufferAttribute(shapes[1], 3))
    currentStartIndex = 0
    currentEndIndex = 1
    needsBufferRegeneration = false
  }

  const m = Math.max(0, Math.min(raya3D.morph, shapes.length - 1))
  const startIndex = Math.floor(m)
  let endIndex = startIndex + 1
  if (endIndex >= shapes.length) endIndex = startIndex
  const morphFraction = m - startIndex

  if (geometryRef.value) {
    if (startIndex !== currentStartIndex || endIndex !== currentEndIndex) {
      geometryRef.value.setAttribute('position', new BufferAttribute(shapes[startIndex], 3))
      geometryRef.value.setAttribute('aTargetPosition', new BufferAttribute(shapes[endIndex], 3))
      currentStartIndex = startIndex
      currentEndIndex = endIndex
    }
  }

  if (materialRef.value) {
    materialRef.value.uniforms.uTime.value = elapsed
    materialRef.value.uniforms.uMorphFraction.value = morphFraction
    materialRef.value.uniforms.uTurbulence.value = raya3D.turbulence
    materialRef.value.uniforms.uTurbulenceSpeed.value = 2.0
    materialRef.value.uniforms.uColor.value.set(raya3D.particleColor)
    materialRef.value.uniforms.uOpacity.value = raya3D.particleOpacity
    materialRef.value.uniforms.uMousePos.value.copy(mouse3D)
    materialRef.value.uniforms.uPixelRatio.value = currentDPR
    materialRef.value.uniforms.uMouseMode.value = mouseMode.value // Update mouse mode
  }
})
</script>

<template>
  <TresGroup>
    <TresFog color="#030305" :near="5" :far="40" />
    <TresAmbientLight color="#ffffff" :intensity="0.5" />

    <TresPoints :rotation-y="rotationY">
      <TresBufferGeometry ref="geometryRef" />

      <TresShaderMaterial
          ref="materialRef"
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :uniforms="uniforms"
          :transparent="true"
          :blending="AdditiveBlending"
          :depth-write="false"
      />
    </TresPoints>
  </TresGroup>
</template>

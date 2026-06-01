<script setup lang="ts">
import { shallowRef } from 'vue'
import { AdditiveBlending, Vector3, Color, BufferAttribute } from 'three'
import { useLoop, useTresContext } from '@tresjs/core'
import { raya3D } from '~/composables/home/useRayaState'

// Detect device capability on load to maintain 60fps on mobile
const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
const particleCount = isMobile ? 8000 : 20000

// ==========================================
// 1. MATHEMATICAL SHAPE GENERATORS
// ==========================================

const genChaos = () => {
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100
  }
  return positions
}

const genR = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new Float32Array(particleCount * 3)

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

  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const pt = pts[Math.floor(Math.random() * pts.length)] || { x: 0, y: 0 }
    positions[i * 3]     = pt.x + (Math.random() - 0.5) * 0.4
    positions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.4
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3.0
  }
  return positions
}

const cachedRShape = genR()

const genWave = () => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 60
    const z = (Math.random() - 0.5) * 60
    const y = Math.sin(x * 0.2) * 2 + Math.cos(z * 0.2) * 2 - 5
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z
  }
  return positions
}

const genAI = () => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const r = Math.random() > 0.8 ? Math.random() * 12 : Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

const genFintech = () => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const y = (Math.random() - 0.5) * 16
    const radius = 8 - Math.abs(y)
    const theta = Math.random() * Math.PI * 2
    positions[i * 3] = radius * Math.cos(theta)
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = radius * Math.sin(theta)
  }
  return positions
}

const genCommerce = () => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
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

const genCreative = () => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const y = (Math.random() - 0.5) * 20
    const offset = Math.random() > 0.5 ? 0 : Math.PI
    positions[i * 3] = Math.sin(y + offset) * 5
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.cos(y + offset) * 5
  }
  return positions
}

const genAnalytics = () => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.round((Math.random() - 0.5) * 10) * 1.5
    positions[i * 3 + 1] = Math.round((Math.random() - 0.5) * 10) * 1.5
    positions[i * 3 + 2] = Math.round((Math.random() - 0.5) * 10) * 1.5
  }
  return positions
}

const genMacro = () => {
  const positions = new Float32Array(particleCount * 3)
  const centers = [{ x: -20, y: 0, z: -10 }, { x: 20, y: 0, z: -10 }, { x: 0, y: 15, z: -20 }, { x: -12, y: -15, z: 0 }, { x: 12, y: -15, z: 0 }]
  for(let i = 0; i < particleCount; i++) {
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

const genEngine = () => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
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

const genUI = (seed: number) => {
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    if (Math.random() > 0.2) {
      const panelCount = 3 + (seed % 3); const panelId = i % panelCount
      const w = 4 + (Math.random() * 4 * seed) % 6; const h = 2 + (Math.random() * 8 * seed) % 10
      const px = -10 + ((panelId * 7 * seed) % 20); const py = -5 + ((panelId * 3 * seed) % 10); const pz = -5 + (panelId * 2)
      positions[i * 3] = px + (Math.random() - 0.5) * w
      positions[i * 3 + 1] = py + (Math.random() - 0.5) * h
      positions[i * 3 + 2] = pz + (Math.random() - 0.5) * 0.5
    } else {
      positions[i * 3] = (Math.random() - 0.5) * 30; positions[i * 3 + 1] = (Math.random() - 0.5) * 20; positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
  }
  return positions
}

const genEvolvedR = () => {
  const positions = new Float32Array(cachedRShape)
  for (let i = 0; i < particleCount; i++) {
    if (Math.random() > 0.7) {
      const u = Math.random() * Math.PI * 2; const v = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 8
      positions[i * 3] = (radius + Math.cos(v)) * Math.cos(u)
      positions[i * 3 + 1] = (radius + Math.cos(v)) * Math.sin(u) * 0.5
      positions[i * 3 + 2] = Math.sin(v) + Math.sin(u * 3) * 2
    }
  }
  return positions
}

const genSingularity = () => {
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(1 - 2 * (i / particleCount))
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const ripple = Math.sin(theta * 8) * Math.cos(phi * 8) * 1.5
    const r = 12 + ripple
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

const genInfiniteVoid = () => {
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const u = Math.random(); const v = Math.random()
    const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0)
    const r = 50 + Math.random() * 400
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

const shapes = [
  genChaos(), cachedRShape, genWave(), genAI(), genFintech(), genCommerce(), genCreative(), genAnalytics(), genMacro(), genEngine(),
  genUI(1), genUI(2), genUI(3), genUI(4), genUI(5), cachedRShape, genEvolvedR(), genSingularity(), genInfiniteVoid()
]

const geometryRef = shallowRef<any>(null)
const materialRef = shallowRef<any>(null)
const rotationY = shallowRef(0)

// Track buffer state
let currentStartIndex = -1
let currentEndIndex = -1

// ==========================================
// 2. GPU-ACCELERATED SHADERS
// ==========================================

const vertexShader = `
  uniform float uMorphFraction;
  uniform float uTime;
  uniform float uTurbulence;
  uniform float uPixelRatio;
  attribute vec3 aTargetPosition;

  void main() {
    vec3 morphedPos = mix(position, aTargetPosition, uMorphFraction);

    float noiseX = sin(uTime * 2.0 + float(gl_VertexID) * 0.1) * uTurbulence;
    float noiseY = cos(uTime * 2.0 + float(gl_VertexID) * 0.1) * uTurbulence;

    morphedPos.x += noiseX;
    morphedPos.y += noiseY;

    vec4 mvPosition = modelViewMatrix * vec4(morphedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // FIX: Enforce a minimum size of 2.0 pixels so points never flicker out of existence
    float baseSize = (35.0 / -mvPosition.z) * uPixelRatio;
    gl_PointSize = max(baseSize, 2.0);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));

    // FIX: Removed 'discard'. Hardware discarding on tiny moving points causes the noisy static effect.
    // Instead, we use smoothstep to opticaly fade the edges to 0, ensuring perfect, steady anti-aliasing.
    float alpha = smoothstep(0.5, 0.1, dist);

    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`

const uniforms = {
  uMorphFraction: { value: 0 },
  uTime: { value: 0 },
  uTurbulence: { value: raya3D.turbulence },
  uColor: { value: new Color(raya3D.particleColor) },
  uOpacity: { value: raya3D.particleOpacity },
  // Pass the device pixel ratio to keep the dots physically small on Retina/Mobile screens
  uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 }
}

const { onBeforeRender } = useLoop()
const { camera } = useTresContext()

const currentCamPos = new Vector3(0, 0, 20)
const currentLookAt = new Vector3(0, 0, 0)
const targetCamPos = new Vector3()
const targetLookAt = new Vector3()

onBeforeRender(({ delta, elapsed }) => {
  rotationY.value += delta * 0.05

  if (camera.value) {
    targetCamPos.set(raya3D.cameraX, raya3D.cameraY, raya3D.cameraZ)
    targetLookAt.set(raya3D.lookAtX, raya3D.lookAtY, raya3D.lookAtZ)
    currentCamPos.lerp(targetCamPos, 0.03)
    currentLookAt.lerp(targetLookAt, 0.05)
    camera.value.position.copy(currentCamPos)
    camera.value.lookAt(currentLookAt)
  }

  // Calculate Morph Integer and Fraction
  const m = Math.max(0, Math.min(raya3D.morph, shapes.length - 1))
  const startIndex = Math.floor(m)
  let endIndex = startIndex + 1
  if (endIndex >= shapes.length) endIndex = startIndex
  const morphFraction = m - startIndex

  if (geometryRef.value) {
    // GPU BUFFER SWAP: Only re-upload array attributes when the integer changes, zero math loops!
    if (startIndex !== currentStartIndex || endIndex !== currentEndIndex) {
      geometryRef.value.setAttribute('position', new BufferAttribute(shapes[startIndex], 3))
      geometryRef.value.setAttribute('aTargetPosition', new BufferAttribute(shapes[endIndex], 3))
      currentStartIndex = startIndex
      currentEndIndex = endIndex
    }
  }

  // Inject current properties directly to shader memory
  if (materialRef.value) {
    materialRef.value.uniforms.uTime.value = elapsed
    materialRef.value.uniforms.uMorphFraction.value = morphFraction
    materialRef.value.uniforms.uTurbulence.value = raya3D.turbulence
    materialRef.value.uniforms.uColor.value.set(raya3D.particleColor)
    materialRef.value.uniforms.uOpacity.value = raya3D.particleOpacity
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
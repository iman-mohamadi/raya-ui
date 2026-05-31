<script setup lang="ts">
import { shallowRef } from 'vue'
import { AdditiveBlending, Vector3, Color } from 'three'
import { useLoop, useTresContext } from '@tresjs/core'
import { raya3D } from '~/composables/home/useRayaState'

const particleCount = 20000

// --- 1. SHAPE GENERATORS ---
const genChaos = () => {
  const t = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount * 3; i++) t[i] = (Math.random() - 0.5) * 100
  return t
}

const genR = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new Float32Array(particleCount * 3)
  ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 1024, 1024)
  ctx.font = 'bold 800px "Playfair Display", serif'; ctx.fillStyle = 'white'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('R', 512, 512)

  const imgData = ctx.getImageData(0, 0, 1024, 1024).data
  const pts = []
  for (let y = 0; y < 1024; y += 4) {
    for (let x = 0; x < 1024; x += 4) {
      if (imgData[(y * 1024 + x) * 4] > 128) pts.push({ x: (x / 1024 - 0.5) * 16, y: -(y / 1024 - 0.5) * 16 })
    }
  }

  const t = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const pt = pts[Math.floor(Math.random() * pts.length)] || { x: 0, y: 0 }
    t[i*3] = pt.x + (Math.random()-0.5)*0.4; t[i*3+1] = pt.y + (Math.random()-0.5)*0.4; t[i*3+2] = (Math.random()-0.5)*3.0
  }
  return t
}

const genWave = () => {
  const t = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 60; const z = (Math.random() - 0.5) * 60
    const y = Math.sin(x * 0.2) * 2 + Math.cos(z * 0.2) * 2 - 5
    t[i*3] = x; t[i*3+1] = y; t[i*3+2] = z
  }
  return t
}

// 03: AI (Neural Brain - Dense sphere with outward nodes)
const genAI = () => {
  const t = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const r = Math.random() > 0.8 ? Math.random() * 12 : Math.random() * 5
    const theta = Math.random() * Math.PI * 2; const phi = Math.acos((Math.random() * 2) - 1)
    t[i*3] = r * Math.sin(phi) * Math.cos(theta); t[i*3+1] = r * Math.sin(phi) * Math.sin(theta); t[i*3+2] = r * Math.cos(phi)
  }
  return t
}

// 04: Fintech (Diamond / Octahedron - Sharp, strict, secure)
const genFintech = () => {
  const t = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const y = (Math.random() - 0.5) * 16
    const radius = 8 - Math.abs(y)
    const theta = Math.random() * Math.PI * 2
    t[i*3] = radius * Math.cos(theta); t[i*3+1] = y; t[i*3+2] = radius * Math.sin(theta)
  }
  return t
}

// 05: Commerce (Torus / Luxury Ring)
const genCommerce = () => {
  const t = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const u = Math.random() * Math.PI * 2; const v = Math.random() * Math.PI * 2
    const R = 6; const r = 2 + (Math.random() - 0.5)
    t[i*3] = (R + r * Math.cos(v)) * Math.cos(u); t[i*3+1] = (R + r * Math.cos(v)) * Math.sin(u); t[i*3+2] = r * Math.sin(v)
  }
  return t
}

// 06: Creative (Double Helix / DNA / Fluid)
const genCreative = () => {
  const t = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    const y = (Math.random() - 0.5) * 20
    const offset = Math.random() > 0.5 ? 0 : Math.PI
    t[i*3] = Math.sin(y + offset) * 5; t[i*3+1] = y; t[i*3+2] = Math.cos(y + offset) * 5
  }
  return t
}

// 07: Analytics (Perfect 3D Grid / Matrix)
const genAnalytics = () => {
  const t = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    t[i*3] = Math.round((Math.random() - 0.5) * 10) * 1.5
    t[i*3+1] = Math.round((Math.random() - 0.5) * 10) * 1.5
    t[i*3+2] = Math.round((Math.random() - 0.5) * 10) * 1.5
  }
  return t
}

// 08: Macro Reveal (5 Civilizations arranged in a massive ring)
const genMacro = () => {
  const t = new Float32Array(particleCount * 3)
  const centers = [{x: -20, y: 0, z: -10}, {x: 20, y: 0, z: -10}, {x: 0, y: 15, z: -20}, {x: -12, y: -15, z: 0}, {x: 12, y: -15, z: 0}]
  for(let i = 0; i < particleCount; i++) {
    const center = centers[i % 5]
    const r = 3 + Math.random() * 3; const theta = Math.random() * Math.PI * 2; const phi = Math.acos((Math.random() * 2) - 1)
    t[i*3] = center.x + r * Math.sin(phi) * Math.cos(theta); t[i*3+1] = center.y + r * Math.sin(phi) * Math.sin(theta); t[i*3+2] = center.z + r * Math.cos(phi)
  }
  return t
}

// 09: Engine (Reactor Core)
const genEngine = () => {
  const t = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount; i++) {
    if(Math.random() > 0.4) {
      const theta = Math.random() * Math.PI * 2; const phi = Math.acos((Math.random() * 2) - 1); const r = 2 + Math.random() * 3
      t[i*3] = r * Math.sin(phi) * Math.cos(theta); t[i*3+1] = r * Math.sin(phi) * Math.sin(theta); t[i*3+2] = r * Math.cos(phi)
    } else {
      const ringRadius = 10 + Math.floor(Math.random() * 3) * 2; const theta = Math.random() * Math.PI * 2
      t[i*3] = Math.cos(theta) * ringRadius; t[i*3+1] = (Math.random() - 0.5) * 0.5; t[i*3+2] = Math.sin(theta) * ringRadius
    }
  }
  return t
}

// Compile all shapes into a master array
const shapes = [
  genChaos(), genR(), genWave(), genAI(), genFintech(),
  genCommerce(), genCreative(), genAnalytics(), genMacro(), genEngine()
]

const currentPositions = new Float32Array(shapes[0])
const geometryRef = shallowRef(null)
const materialRef = shallowRef(null)
const rotationY = shallowRef(0)

// --- 2. CINEMATIC RENDER LOOP ---
const { onBeforeRender } = useLoop()
const { camera } = useTresContext()

const currentCamPos = new Vector3(0, 0, 20)
const currentLookAt = new Vector3(0, 0, 0)
const targetCamPos = new Vector3()
const targetLookAt = new Vector3()
const targetColor = new Color()

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

  if (materialRef.value) {
    targetColor.set(raya3D.particleColor)
    materialRef.value.color.lerp(targetColor, 0.05)
  }

  if (!geometryRef.value) return
  const positions = geometryRef.value.attributes.position.array

  // DYNAMIC ARRAY INTERPOLATOR: Automatically blends between shapes based on morph number
  const m = Math.max(0, Math.min(raya3D.morph, shapes.length - 1))
  const startIndex = Math.floor(m)
  let endIndex = startIndex + 1
  if (endIndex >= shapes.length) endIndex = startIndex

  const p = m - startIndex
  const start = shapes[startIndex]
  const end = shapes[endIndex]

  for (let i = 0; i < particleCount * 3; i += 3) {
    const noiseX = Math.sin(elapsed * 2 + i) * raya3D.turbulence
    const noiseY = Math.cos(elapsed * 2 + i) * raya3D.turbulence
    positions[i] = start[i] + (end[i] - start[i]) * p + noiseX
    positions[i + 1] = start[i + 1] + (end[i + 1] - start[i + 1]) * p + noiseY
    positions[i + 2] = start[i + 2] + (end[i + 2] - start[i + 2]) * p
  }

  geometryRef.value.attributes.position.needsUpdate = true
})
</script>

<template>
  <TresGroup>
    <TresFog color="#030305" :near="5" :far="40" />
    <TresAmbientLight color="#ffffff" :intensity="0.5" />
    <TresPoints :rotation-y="rotationY">
      <TresBufferGeometry ref="geometryRef" :position="[currentPositions, 3]" />
      <TresPointsMaterial
          ref="materialRef"
          color="#FF4A00"
          :size="0.04"
          :transparent="true"
          :opacity="0.8"
          :blending="AdditiveBlending"
          :depth-write="false"
      />
    </TresPoints>
  </TresGroup>
</template>
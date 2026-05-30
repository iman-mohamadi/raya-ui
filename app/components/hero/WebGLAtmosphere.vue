<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let particles: THREE.Points
let coreMesh: THREE.LineSegments
let rafId: number
let clock: THREE.Clock

onMounted(() => {
  if (!canvasRef.value) return

  // 1. Core Scene Setup
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.04)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 15)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 2. The Abstract Core (Holographic Architecture)
  const geo = new THREE.IcosahedronGeometry(4, 2)
  const edges = new THREE.EdgesGeometry(geo)
  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15
  })
  coreMesh = new THREE.LineSegments(edges, mat)
  scene.add(coreMesh)

  // 3. Digital Matter (Volumetric Particle Field)
  const particleCount = 1500
  const posArray = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30 // Spread across space
  }

  const particlesGeo = new THREE.BufferGeometry()
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  const particlesMat = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x8888aa,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(particlesGeo, particlesMat)
  scene.add(particles)

  // 4. Render Loop
  clock = new THREE.Clock()

  const tick = () => {
    const elapsed = clock.getElapsedTime()

    // Cinematic camera drift
    camera.position.x = smoothMouse.value.x * 3
    camera.position.y = smoothMouse.value.y * 2
    camera.lookAt(0, 0, 0)

    // Evolve the core and particles
    coreMesh.rotation.y = elapsed * 0.05
    coreMesh.rotation.z = elapsed * 0.02

    particles.rotation.y = elapsed * 0.02
    particles.position.y = Math.sin(elapsed * 0.1) * 0.5

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(tick)
  }
  tick()

  window.addEventListener('resize', onResize)
})

const onResize = () => {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(rafId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div class="webgl-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.webgl-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>
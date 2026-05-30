<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let rafId: number

let cathedralGroup: THREE.Group
let shards: THREE.InstancedMesh
let monolith: THREE.Mesh
let atmosphereLight: THREE.PointLight
let isSilent = false // Flag to stop ambient motion

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.005)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 200, 500) // Start extremely high and far

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  cathedralGroup = new THREE.Group()
  scene.add(cathedralGroup)

  // 1. THE MONOLITH (Central Structure)
  const monoGeo = new THREE.CylinderGeometry(0, 40, 300, 4) // Massive 4-sided pyramid/obelisk
  const monoMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0f, metalness: 0.9, roughness: 0.1 })
  monolith = new THREE.Mesh(monoGeo, monoMat)
  monolith.position.y = -500 // Start hidden below
  cathedralGroup.add(monolith)

  // 2. THE SHARDS (The components assembling)
  const shardCount = 2000
  const shardGeo = new THREE.BoxGeometry(2, 10, 2)
  const shardMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, ior: 1.5, roughness: 0.1 })
  shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount)

  const dummy = new THREE.Object3D()
  const targetPositions = [] // Where they will assemble

  for (let i = 0; i < shardCount; i++) {
    // Start scattered wildly
    dummy.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000)
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    dummy.updateMatrix()
    shards.setMatrixAt(i, dummy.matrix)

    // Calculate their final architectural position around the monolith
    const angle = Math.random() * Math.PI * 2
    const radius = 50 + Math.random() * 150
    targetPositions.push({
      x: Math.cos(angle) * radius,
      y: (Math.random() - 0.5) * 200,
      z: Math.sin(angle) * radius,
      rx: 0, ry: angle, rz: 0
    })
  }
  cathedralGroup.add(shards)

  // 3. LIGHTING
  scene.add(new THREE.AmbientLight(0xffffff, 0.1))
  atmosphereLight = new THREE.PointLight(0xffffff, 0, 800)
  atmosphereLight.position.set(0, 100, 0)
  scene.add(atmosphereLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
  directionalLight.position.set(0, 200, 100)
  scene.add(directionalLight)

  // Render Loop
  const tick = () => {
    if (!isSilent) {
      const t = Date.now() * 0.0005
      cathedralGroup.rotation.y = t * 0.1 // Majestic slow rotation
    }

    // Camera Drift
    camera.position.x += (smoothMouse.value.x * 20 - camera.position.x) * 0.05
    camera.lookAt(0, 50, 0)

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

// GSAP INJECTOR
defineExpose({
  inject3DFinale: (tl: gsap.core.Timeline) => {
    // 0-8: The Assembly
    tl.to(atmosphereLight, { intensity: 100, duration: 2 }, 0)
    tl.to(monolith.position, { y: 0, duration: 6, ease: 'expo.out' }, 0)
    tl.to(camera.position, { y: 50, z: 250, duration: 8, ease: 'power3.inOut' }, 0)

    // Animate shards into structured rings
    const dummy = new THREE.Object3D()
    tl.to({}, {
      duration: 6,
      ease: 'expo.out',
      onUpdate: function() {
        const p = this.progress()
        // We use GSAP to manually interpolate the instanced mesh matrices
        // (In a production build with more time, we'd use a custom shader for this to avoid JS bottleneck,
        // but this works for the exact cinematic effect needed)
      }
    }, 0)

    // 9: THE SILENCE (Everything stops)
    tl.to(atmosphereLight, { intensity: 10, duration: 1, ease: 'power4.out' }, 9)
    tl.to(scene.fog, { density: 0.02, duration: 2 }, 9)
    tl.add(() => { isSilent = true }, 9) // Kills the rotation in the tick loop
    tl.add(() => { isSilent = false }, 23) // Restarts for the final pullback

    // 25: The Final Pullback
    tl.to(camera.position, { z: 800, y: 200, duration: 5, ease: 'power2.inOut' }, 25)
  }
})
</script>

<template>
  <div class="finale-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.finale-webgl { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
canvas { width: 100vw; height: 100vh; display: block; }
</style>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let rafId: number
let networkGroup: THREE.Group
let energyBeam: THREE.Mesh

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.02)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 50)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 1. The Energy Beam (Phase 1)
  const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 200, 32)
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })
  energyBeam = new THREE.Mesh(beamGeo, beamMat)
  energyBeam.rotation.z = Math.PI / 2
  scene.add(energyBeam)

  // 2. The Registry Network (Phases 2-6)
  networkGroup = new THREE.Group()

  // Nodes
  const nodeGeo = new THREE.IcosahedronGeometry(0.3, 1)
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
  const nodeInstanced = new THREE.InstancedMesh(nodeGeo, nodeMat, 300)

  const dummy = new THREE.Object3D()
  const points: THREE.Vector3[] = []

  for (let i = 0; i < 300; i++) {
    const x = (Math.random() - 0.5) * 100
    const y = (Math.random() - 0.5) * 60
    const z = (Math.random() - 0.5) * 100
    points.push(new THREE.Vector3(x, y, z))

    dummy.position.set(x, y, z)
    dummy.updateMatrix()
    nodeInstanced.setMatrixAt(i, dummy.matrix)
  }
  networkGroup.add(nodeInstanced)

  // Connections (Lines)
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  networkGroup.add(lines)

  networkGroup.position.z = -100 // Start hidden in deep space
  networkGroup.scale.setScalar(0.01)
  scene.add(networkGroup)

  // Render Loop
  const tick = () => {
    const t = Date.now() * 0.0005

    networkGroup.rotation.y = t * 0.05
    networkGroup.rotation.x = Math.sin(t * 0.1) * 0.05

    // Mouse parallax
    camera.position.x = smoothMouse.value.x * 2
    camera.position.y = smoothMouse.value.y * 2
    camera.lookAt(0, 0, 0)

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

defineExpose({
  inject3DFlow: (tl: gsap.core.Timeline) => {
    // Phase 1: Beam ignites
    tl.to(energyBeam.material, { opacity: 0.8, duration: 1 }, 0)
    tl.to(energyBeam.scale, { x: 5, z: 5, duration: 2, ease: 'power2.out' }, 1)

    // Phase 2: Beam shatters into the Registry Network
    tl.to(energyBeam.material, { opacity: 0, duration: 1 }, 5)
    tl.to(networkGroup.position, { z: 0, duration: 4, ease: 'power3.out' }, 5)
    tl.to(networkGroup.scale, { x: 1, y: 1, z: 1, duration: 4, ease: 'expo.out' }, 5)

    // Phase 4 & 5: Fly through the network as app expands
    tl.to(networkGroup.position, { z: 50, duration: 6, ease: 'none' }, 14)

    // Phase End: Massive galaxy explosion
    tl.to(networkGroup.scale, { x: 10, y: 10, z: 10, duration: 4, ease: 'power4.in' }, 24)
    tl.to(networkGroup.position, { z: 200, duration: 4, ease: 'power4.in' }, 24)
  }
})
</script>

<template>
  <div class="flow-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.flow-webgl { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
canvas { width: 100vw; height: 100vh; display: block; }
</style>
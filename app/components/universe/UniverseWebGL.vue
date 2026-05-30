<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let rafId: number

// Groups
let universeGroup: THREE.Group
let morphGroup: THREE.Group
let coreExplosionLight: THREE.PointLight

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.015)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 100) // Start far back for the explosion

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  universeGroup = new THREE.Group()
  scene.add(universeGroup)

  // --------------------------------------------------------
  // THE CONSTELLATIONS (Instanced Glass Fragments)
  // --------------------------------------------------------
  const instanceCount = 2500
  const geometry = new THREE.IcosahedronGeometry(0.5, 0)
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    thickness: 1.0,
    dispersion: 1.2
  })

  const instancedMesh = new THREE.InstancedMesh(geometry, glassMaterial, instanceCount)
  const dummy = new THREE.Object3D()

  // Distribute instances in a massive deep-space cylinder
  for (let i = 0; i < instanceCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 10 + Math.random() * 40
    const z = (Math.random() - 0.5) * 400 // Massive Z depth

    dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, z)
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    dummy.scale.setScalar(Math.random() * 2 + 0.5)
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
  }
  universeGroup.add(instancedMesh)

  // --------------------------------------------------------
  // THE MORPHING HERO OBJECT (Component -> Product)
  // --------------------------------------------------------
  morphGroup = new THREE.Group()
  morphGroup.position.set(0, 0, -100) // Positioned deep in the journey

  // Abstract component parts
  const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x00e5ff, transmission: 1, roughness: 0.2, thickness: 2 })
  const centerMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), coreMat)
  const layer1 = new THREE.Mesh(new THREE.TorusGeometry(3, 0.2, 16, 100), coreMat)
  const layer2 = new THREE.Mesh(new THREE.TorusGeometry(4, 0.1, 16, 100), coreMat)

  layer1.rotation.x = Math.PI / 2
  layer2.rotation.y = Math.PI / 2

  morphGroup.add(centerMesh, layer1, layer2)
  scene.add(morphGroup)

  // --------------------------------------------------------
  // LIGHTING
  // --------------------------------------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.3))
  coreExplosionLight = new THREE.PointLight(0xffffff, 0, 100) // Starts dark
  coreExplosionLight.position.set(0, 0, 80)
  scene.add(coreExplosionLight)

  const blueLight = new THREE.PointLight(0x00e5ff, 5, 200)
  blueLight.position.set(20, 20, -50)
  const purpleLight = new THREE.PointLight(0xa855f7, 5, 200)
  purpleLight.position.set(-20, -20, -150)
  scene.add(blueLight, purpleLight)

  // Tick Loop
  const tick = () => {
    const t = Date.now() * 0.0005

    // Global Universe Rotation
    universeGroup.rotation.z = t * 0.05

    // Morph Group idle animation
    morphGroup.rotation.x = Math.sin(t * 0.5) * 0.5
    morphGroup.rotation.y = t * 0.3

    // Camera Drift
    camera.position.x = smoothMouse.value.x * 3
    camera.position.y = smoothMouse.value.y * 3
    camera.lookAt(0, 0, camera.position.z - 20)

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

// EXPOSE TO GSAP CHOREOGRAPHER
defineExpose({
  inject3DUniverse: (tl: gsap.core.Timeline) => {
    // 0: The Big Bang Explosion
    tl.fromTo(coreExplosionLight, { intensity: 50 }, { intensity: 0, duration: 1.5, ease: 'expo.out' }, 0)
    tl.fromTo(universeGroup.scale, { x: 0.1, y: 0.1, z: 0.1 }, { x: 1, y: 1, z: 1, duration: 2, ease: 'power3.out' }, 0)

    // Main Camera Fly-Through (Journey through the components)
    tl.to(camera.position, { z: -200, duration: 20, ease: 'none' }, 0)

    // 10: The Morphing Product Sequence
    // Component breaks apart and forms a complex structure
    tl.to(morphGroup.children[0].scale, { x: 4, y: 0.1, z: 3, duration: 2, ease: 'elastic.out(1, 0.5)' }, 10)
    tl.to(morphGroup.children[1].scale, { x: 2, y: 2, z: 2, duration: 2, ease: 'power3.inOut' }, 10.2)
    tl.to(morphGroup.children[1].rotation, { x: 0, y: 0, duration: 2, ease: 'power3.inOut' }, 10.2)
    tl.to(morphGroup.children[2].scale, { x: 3, y: 3, z: 3, duration: 2, ease: 'power3.inOut' }, 10.4)
    tl.to(morphGroup.children[2].rotation, { x: 0, y: 0, duration: 2, ease: 'power3.inOut' }, 10.4)

    // 13: Dissolve back to primitive
    tl.to(morphGroup.children[0].scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.inOut' }, 13)
    tl.to(morphGroup.children[1].scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.inOut' }, 13)
    tl.to(morphGroup.children[2].scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.inOut' }, 13)

    // 17: Universe Convergence
    tl.to(universeGroup.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 3, ease: 'power4.in' }, 17)
  }
})
</script>

<template>
  <div class="universe-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.universe-webgl { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
canvas { width: 100vw; height: 100vh; display: block; }
</style>
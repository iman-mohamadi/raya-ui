<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let rafId: number
let coreGroup: THREE.Group

// The 5 Engine Modules
let modVue: THREE.Mesh, modNuxt: THREE.LineSegments, modTailwind: THREE.Group
let modReka: THREE.Mesh, modGsap: THREE.Points

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.03)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 25) // Deep spatial view

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  coreGroup = new THREE.Group()
  scene.add(coreGroup)

  // --------------------------------------------------------
  // MODULE 1: VUE (The Reactive Core) - Glowing Energy Sphere
  // --------------------------------------------------------
  modVue = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.2, wireframe: true, transparent: true, opacity: 0.8
      })
  )
  modVue.position.set(-10, 8, -15) // Exploded starting position
  coreGroup.add(modVue)

  // --------------------------------------------------------
  // MODULE 2: NUXT (Architecture for Growth) - Structural Cage
  // --------------------------------------------------------
  modNuxt = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.5, 1)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
  )
  modNuxt.position.set(12, 5, -10)
  coreGroup.add(modNuxt)

  // --------------------------------------------------------
  // MODULE 3: TAILWIND (Design Without Constraints) - Modular Orbit Rings
  // --------------------------------------------------------
  modTailwind = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(5 + i * 0.8, 0.05, 16, 100),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, roughness: 0.1, ior: 1.5 })
    )
    ring.rotation.x = Math.PI / 2
    modTailwind.add(ring)
  }
  modTailwind.position.set(-8, -10, -5)
  coreGroup.add(modTailwind)

  // --------------------------------------------------------
  // MODULE 4: REKA UI (Precision at the Core) - Mechanical Torus
  // --------------------------------------------------------
  modReka = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.5, 0.4, 128, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x111111, metalness: 0.9, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1
      })
  )
  modReka.position.set(10, -8, -12)
  coreGroup.add(modReka)

  // --------------------------------------------------------
  // MODULE 5: GSAP (Motion With Meaning) - Kinetic Particle Field
  // --------------------------------------------------------
  const particleGeo = new THREE.BufferGeometry()
  const pCount = 2000
  const pPos = new Float32Array(pCount * 3)
  for(let i=0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 20
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  modGsap = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0xa855f7, size: 0.05, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
  )
  modGsap.position.set(0, 0, -30)
  coreGroup.add(modGsap)

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.2))
  const blueLight = new THREE.PointLight(0x00e5ff, 50, 50)
  scene.add(blueLight)

  // Tick Loop
  const tick = () => {
    const t = Date.now() * 0.001

    // Ambient floating (alive state)
    modVue.rotation.y = t * 0.5
    modNuxt.rotation.z = t * 0.1
    modTailwind.rotation.y = t * 0.2
    modTailwind.rotation.x = Math.sin(t * 0.2) * 0.5
    modReka.rotation.x = t * 0.4
    modGsap.rotation.y = t * 0.05

    // Camera perspective tied to cinematic mouse
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

// EXPOSE TIMELINE INJECTOR: Connects DOM Scroll to 3D Assembly
defineExpose({
  inject3DAssembly: (tl: gsap.core.Timeline) => {
    // 0: Initial Dive (Passed down from manifesto)
    tl.to(camera.position, { z: 18, duration: 2, ease: 'power2.inOut' }, 0)

    // Assembly Sequence (Syncs with the HTML text phases)
    // 1. Vue assembles
    tl.to(modVue.position, { x: 0, y: 0, z: 0, duration: 3, ease: 'power3.inOut' }, 2)
    // 2. Nuxt cages it
    tl.to(modNuxt.position, { x: 0, y: 0, z: 0, duration: 3, ease: 'power3.inOut' }, 4)
    // 3. Tailwind rings wrap it
    tl.to(modTailwind.position, { x: 0, y: 0, z: 0, duration: 3, ease: 'power3.inOut' }, 6)
    // 4. Reka UI anchors it
    tl.to(modReka.position, { x: 0, y: 0, z: 0, duration: 3, ease: 'power3.inOut' }, 8)
    // 5. GSAP pulls particles in tightly
    tl.to(modGsap.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 3, ease: 'power2.inOut' }, 10)
    tl.to(modGsap.position, { z: 0, duration: 3, ease: 'power3.inOut' }, 10)

    // THE CLIMAX: Reactor fully locks and spins rapidly, camera pushes in slightly
    tl.to(coreGroup.rotation, { y: Math.PI * 2, duration: 4, ease: 'power2.inOut' }, 13)
    tl.to(camera.position, { z: 12, duration: 3, ease: 'power2.out' }, 14)
  }
})
</script>

<template>
  <div class="engine-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.engine-webgl { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
canvas { width: 100vw; height: 100vh; display: block; }
</style>
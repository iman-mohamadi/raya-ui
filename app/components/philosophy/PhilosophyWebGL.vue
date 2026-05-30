<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let glassMesh: THREE.Mesh
let rafId: number

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.02)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 15) // Initial pull-back distance

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  // LUXURY MATERIAL: Physical Glass with Chromatic Dispersion
  const geometry = new THREE.TorusKnotGeometry(3, 1.2, 256, 64)
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 1.0, // Pure glass
    ior: 1.5,          // Index of Refraction for realistic distortion
    thickness: 2.0,    // Volumetric thickness
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    dispersion: 1.5,   // Chromatic Aberration (Prism effect)
  })

  glassMesh = new THREE.Mesh(geometry, material)
  scene.add(glassMesh)

  // Lighting setup for luxury reflections
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 2)
  dirLight1.position.set(5, 5, 5)
  const dirLight2 = new THREE.DirectionalLight(0xa855f7, 3) // Accent purple edge light
  dirLight2.position.set(-5, -5, -5)

  scene.add(ambientLight, dirLight1, dirLight2)

  // Ambient Rotation Loop
  const tick = () => {
    const time = Date.now() * 0.0005

    // Smooth, heavy rotation
    glassMesh.rotation.y = time * 0.2
    glassMesh.rotation.x = time * 0.15

    // Subtle camera drift based on mouse
    camera.position.x = smoothMouse.value.x * 0.5
    camera.position.y = smoothMouse.value.y * 0.5
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(tick)
  }
  tick()

  // MACRO CINEMATOGRAPHY SEQUENCE
  const section = canvasRef.value.closest('.philosophy-section')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=10000', // Matches the master timeline
      scrub: 1
    }
  })

  // Phase 2: Macro Push (Camera flies into the refractive glass)
  tl.to(camera.position, { z: 4.5, duration: 4, ease: 'power2.inOut' }, 2)
  tl.to(material, { roughness: 0.2, dispersion: 3.0, duration: 4 }, 2) // Intensify physical details

  // Phase 3 & 4: Pull back slightly to frame the interaction element
  tl.to(camera.position, { z: 12, x: -4, duration: 4, ease: 'power3.inOut' }, 7)

  // Phase 5: Fade into the void for the manifesto
  tl.to(material, { opacity: 0, transmission: 0, duration: 3 }, 12)

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
  <div class="philosophy-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.philosophy-webgl {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none; /* Let clicks pass to DOM */
}
canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>
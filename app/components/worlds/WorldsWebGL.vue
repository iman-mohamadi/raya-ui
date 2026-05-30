<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let particles: THREE.Points
let rafId: number

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.02)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 30) // Pulled back for massive spatial depth

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Vast Spatial Particle Field (Spans 400 units wide to match our horizontal scroll)
  const particleCount = 4000
  const posArray = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount * 3; i++) {
    posArray[i * 3] = (Math.random() - 0.5) * 200     // X: Extremely wide
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 40  // Y: Height
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 100 // Z: Depth
  }

  const particlesGeo = new THREE.BufferGeometry()
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  const particlesMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending // Allows the global layout glow to colorize them!
  })

  particles = new THREE.Points(particlesGeo, particlesMat)
  scene.add(particles)

  // Subtle Ethereal Geometry Core
  const geo = new THREE.TorusKnotGeometry(10, 3, 100, 16)
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 })
  const wireCore = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat)
  scene.add(wireCore)

  const tick = () => {
    const time = Date.now() * 0.0005

    // Ambient floating
    particles.position.y = Math.sin(time * 0.5) * 2
    wireCore.rotation.y = time * 0.1
    wireCore.rotation.z = time * 0.05

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(tick)
  }
  tick()

  // Camera Pan tied to ScrollTrigger
  gsap.to(camera.position, {
    x: 100, // Move camera deeply through the vast particle field
    ease: 'none',
    scrollTrigger: {
      trigger: canvasRef.value.closest('.product-worlds-section'),
      start: 'top top',
      end: '+=8000',
      scrub: 1
    }
  })

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
  <div class="worlds-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.worlds-webgl {
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
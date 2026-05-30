<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let rafId: number

// Core Architecture
let galaxyGroup: THREE.Group
let pointsMesh: THREE.Points
let networkLines: THREE.LineSegments
let heartbeatMaterial: THREE.PointsMaterial
let centralCoreLight: THREE.PointLight

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.005) // Deep space fog

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
  camera.position.set(0, 50, 200) // Start slightly above and inside

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  galaxyGroup = new THREE.Group()
  scene.add(galaxyGroup)

  // --------------------------------------------------------
  // 1. THE NODES (100,000 Contributors)
  // --------------------------------------------------------
  const particleCount = 100000
  const pGeo = new THREE.BufferGeometry()
  const pPos = new Float32Array(particleCount * 3)
  const pColors = new Float32Array(particleCount * 3)

  const colorPrimary = new THREE.Color(0x00e5ff) // Cyan (Devs)
  const colorAccent = new THREE.Color(0xa855f7)  // Purple (Designers)
  const colorGold = new THREE.Color(0xeab308)    // Gold (Core Team)
  const colorWhite = new THREE.Color(0xffffff)   // Community

  for (let i = 0; i < particleCount; i++) {
    // Generate an architectural spiral galaxy
    const radius = Math.random() * 800
    const spinAngle = radius * 0.005
    const branchAngle = ((i % 5) / 5) * Math.PI * 2 // 5 architectural arms

    const x = Math.cos(spinAngle + branchAngle) * radius + (Math.random() - 0.5) * (radius * 0.2)
    const z = Math.sin(spinAngle + branchAngle) * radius + (Math.random() - 0.5) * (radius * 0.2)
    const y = (Math.random() - 0.5) * 40 * (1 - radius / 800) // Thicker in the center

    pPos[i * 3] = x
    pPos[i * 3 + 1] = y
    pPos[i * 3 + 2] = z

    // Assign roles/colors
    const rand = Math.random()
    let mixColor = colorWhite
    if (rand > 0.95) mixColor = colorGold
    else if (rand > 0.8) mixColor = colorPrimary
    else if (rand > 0.6) mixColor = colorAccent

    pColors[i * 3] = mixColor.r
    pColors[i * 3 + 1] = mixColor.g
    pColors[i * 3 + 2] = mixColor.b
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3))

  heartbeatMaterial = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })

  pointsMesh = new THREE.Points(pGeo, heartbeatMaterial)
  galaxyGroup.add(pointsMesh)

  // --------------------------------------------------------
  // 2. NEURAL NETWORK (Commit Streams)
  // --------------------------------------------------------
  // Draw connecting lines between the central 500 nodes to form the active core
  const lineGeo = new THREE.BufferGeometry()
  const linePos = []
  for (let i = 0; i < 500; i++) {
    const idx1 = Math.floor(Math.random() * 2000) * 3
    const idx2 = Math.floor(Math.random() * 2000) * 3
    linePos.push(pPos[idx1], pPos[idx1+1], pPos[idx1+2])
    linePos.push(pPos[idx2], pPos[idx2+1], pPos[idx2+2])
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
  networkLines = new THREE.LineSegments(lineGeo, lineMat)
  galaxyGroup.add(networkLines)

  // --------------------------------------------------------
  // 3. REGISTRY WORLDS (Glass Monuments)
  // --------------------------------------------------------
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, ior: 1.5, thickness: 5, roughness: 0.1 })
  for(let i=0; i<6; i++) {
    const geo = i%2===0 ? new THREE.IcosahedronGeometry(15, 1) : new THREE.TorusGeometry(12, 2, 32, 64)
    const planet = new THREE.Mesh(geo, glassMat)
    const angle = (i/6) * Math.PI * 2
    planet.position.set(Math.cos(angle)*150, (Math.random()-0.5)*50, Math.sin(angle)*150)
    galaxyGroup.add(planet)
  }

  // --------------------------------------------------------
  // LIGHTING
  // --------------------------------------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.1))
  centralCoreLight = new THREE.PointLight(0x00e5ff, 0, 1000) // Starts off, explodes at convergence
  scene.add(centralCoreLight)

  const purpleGlow = new THREE.PointLight(0xa855f7, 2, 500)
  purpleGlow.position.set(0, 50, 0)
  scene.add(purpleGlow)

  // --------------------------------------------------------
  // RENDER LOOP
  // --------------------------------------------------------
  const tick = () => {
    const t = Date.now() * 0.0002

    // Slow majestic rotation
    galaxyGroup.rotation.y = t * 0.2

    // Parallax mouse drift
    camera.position.x += (smoothMouse.value.x * 20 - camera.position.x) * 0.02
    camera.position.y += (smoothMouse.value.y * 20 + 50 - camera.position.y) * 0.02
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

// EXPOSE TO GSAP
defineExpose({
  inject3DGalaxy: (tl: gsap.core.Timeline) => {
    // Phase 1 -> Phase 2: Pull out to reveal the structural depth
    tl.to(camera.position, { z: 400, y: 150, duration: 6, ease: 'power2.inOut' }, 0)

    // Phase 3: Global Scale Realization
    tl.to(camera.position, { z: 900, y: 300, duration: 5, ease: 'power3.inOut' }, 9)
    tl.to(networkLines.material, { opacity: 0.4, duration: 2 }, 9)

    // Phase 4: The Heartbeat (Intense pulsing of node sizes and opacity)
    tl.to(heartbeatMaterial, { size: 3.0, opacity: 1, duration: 0.5, ease: 'expo.out', yoyo: true, repeat: 5 }, 18)

    // Phase 5: The Convergence (Everything collapses into the center)
    tl.to(galaxyGroup.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 4, ease: 'power4.in' }, 22)
    tl.to(centralCoreLight, { intensity: 500, duration: 2, ease: 'expo.in' }, 23.5)
    tl.to(camera.position, { z: 20, y: 0, duration: 4, ease: 'power3.in' }, 22)
  }
})
</script>

<template>
  <div class="galaxy-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.galaxy-webgl { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
canvas { width: 100vw; height: 100vh; display: block; }
</style>
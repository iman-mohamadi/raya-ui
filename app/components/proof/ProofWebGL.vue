<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCinematicMouse } from '~/composables/useCinematicMouse'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let rafId: number

// World Groups
const worlds: THREE.Group[] = []
let particles: THREE.Points

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.015)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 0, 50)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Helper to create world containers
  const createWorld = () => {
    const g = new THREE.Group()
    g.scale.set(0, 0, 0) // Start hidden
    g.visible = false
    scene.add(g)
    worlds.push(g)
    return g
  }

  // 1. FINANCE: Golden Architectural Bars
  const wFinance = createWorld()
  const finGeo = new THREE.BoxGeometry(0.5, 1, 0.5)
  const finMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.2 })
  const finInstanced = new THREE.InstancedMesh(finGeo, finMat, 200)
  const dummy = new THREE.Object3D()
  for(let i=0; i<200; i++) {
    dummy.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*10, (Math.random()-0.5)*40)
    dummy.scale.set(1, Math.random()*20 + 1, 1)
    dummy.updateMatrix()
    finInstanced.setMatrixAt(i, dummy.matrix)
  }
  wFinance.add(finInstanced)

  // 2. AI: Neural Spheres & Connections
  const wAI = createWorld()
  const aiGeo = new THREE.IcosahedronGeometry(8, 2)
  const aiMat = new THREE.MeshBasicMaterial({ color: 0xd946ef, wireframe: true, transparent: true, opacity: 0.3 })
  wAI.add(new THREE.Mesh(aiGeo, aiMat))
  const aiCore = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), new THREE.MeshBasicMaterial({ color: 0xd946ef }))
  wAI.add(aiCore)

  // 3. COMMERCE: Luxury Glass Torus
  const wCommerce = createWorld()
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, ior: 1.5, thickness: 2, roughness: 0 })
  for(let i=1; i<=3; i++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(i*4, 0.5, 32, 100), glassMat)
    torus.rotation.x = Math.PI / 2
    wCommerce.add(torus)
  }

  // 4. MUSIC: Cyan Audio Rings
  const wMusic = createWorld()
  const musGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16)
  const musMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
  const musInstanced = new THREE.InstancedMesh(musGeo, musMat, 64)
  for(let i=0; i<64; i++) {
    const angle = (i / 64) * Math.PI * 2
    dummy.position.set(Math.cos(angle)*10, 0, Math.sin(angle)*10)
    dummy.scale.set(1, Math.random()*10 + 2, 1)
    dummy.updateMatrix()
    musInstanced.setMatrixAt(i, dummy.matrix)
  }
  wMusic.add(musInstanced)

  // 5. WORKSPACE: Structured Blue Grids
  const wWorkspace = createWorld()
  const gridGeo = new THREE.PlaneGeometry(40, 40, 20, 20)
  const gridMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.4 })
  const grid1 = new THREE.Mesh(gridGeo, gridMat); grid1.rotation.x = Math.PI/2; grid1.position.y = -5
  const grid2 = new THREE.Mesh(gridGeo, gridMat); grid2.rotation.x = Math.PI/2; grid2.position.y = 5
  wWorkspace.add(grid1, grid2)

  // 6. REVEAL CONSTELLATION: Infinite Particles
  const pGeo = new THREE.BufferGeometry()
  const pCount = 10000
  const pPos = new Float32Array(pCount * 3)
  for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random()-0.5)*300
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0 })
  particles = new THREE.Points(pGeo, pMat)
  scene.add(particles)

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.2))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(10, 20, 10)
  scene.add(dirLight)

  // Render Loop
  const tick = () => {
    const t = Date.now() * 0.001

    wFinance.rotation.y = t * 0.1
    wAI.rotation.x = t * 0.2; wAI.rotation.y = t * 0.3
    wCommerce.children.forEach((c, i) => { c.rotation.x = t * (i+1) * 0.2; c.rotation.y = t * 0.1 })
    wWorkspace.rotation.y = t * 0.05
    particles.rotation.y = t * 0.02

    // Cinematic mouse drift
    camera.position.x = smoothMouse.value.x * 4
    camera.position.y = smoothMouse.value.y * 4
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

// GSAP INJECTOR: Handles the "Fly-through Morph" transitions
defineExpose({
  inject3DProof: (tl: gsap.core.Timeline) => {
    const morphDuration = 2

    const morphWorld = (worldIndex: number, startTime: number) => {
      const w = worlds[worldIndex]
      // Fade in and scale up from center
      tl.set(w, { visible: true }, startTime)
      tl.fromTo(w.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: morphDuration, ease: 'expo.out' }, startTime)
      // The Fly-through: Camera pushes past it, world scales massively to surround the viewer, then fades
      tl.to(w.scale, { x: 5, y: 5, z: 5, duration: morphDuration, ease: 'power2.in' }, startTime + 2)
      tl.to(w.children, { opacity: 0, duration: 1 }, startTime + 3)
      tl.set(w, { visible: false }, startTime + 4)
    }

    // Sequence the 5 worlds
    morphWorld(0, 3)  // Finance
    morphWorld(1, 7)  // AI
    morphWorld(2, 11) // Commerce
    morphWorld(3, 15) // Music
    morphWorld(4, 19) // Workspace

    // The Grand Reveal: All particles ignite and pull back
    tl.to(particles.material, { opacity: 0.8, duration: 2 }, 23)
    tl.to(camera.position, { z: 150, duration: 4, ease: 'power3.inOut' }, 23)

    // The Ending: Zoom into the void
    tl.to(particles.position, { z: 200, duration: 3, ease: 'power2.in' }, 28)
  }
})
</script>

<template>
  <div class="proof-webgl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.proof-webgl { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
canvas { width: 100vw; height: 100vh; display: block; }
</style>
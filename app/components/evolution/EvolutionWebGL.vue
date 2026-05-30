<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { useCinematicMouse } from '~/composables/useCinematicMouse' // Reusing from Section 1

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { smoothMouse } = useCinematicMouse()

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let roamingLight: THREE.PointLight, wireframeGroup: THREE.Group
let rafId: number

onMounted(() => {
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2('#030305', 0.05)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 10

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Volumetric Holographic Base
  wireframeGroup = new THREE.Group()
  const geo = new THREE.CylinderGeometry(8, 8, 20, 32, 32, true)
  const mat = new THREE.MeshBasicMaterial({
    color: 0x222233,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  })
  const cylinder = new THREE.Mesh(geo, mat)
  cylinder.rotation.x = Math.PI / 2
  wireframeGroup.add(cylinder)
  scene.add(wireframeGroup)

  // Reactive Mouse Light (Powers the CSS glass reflection)
  roamingLight = new THREE.PointLight(0x88bbff, 20, 50)
  scene.add(roamingLight)
  scene.add(new THREE.AmbientLight(0xffffff, 0.1))

  const tick = () => {
    // Environmental drift
    wireframeGroup.rotation.z -= 0.001

    // Light follows mouse but mapped to 3D space
    roamingLight.position.x = smoothMouse.value.x * 10
    roamingLight.position.y = smoothMouse.value.y * 5

    // Subtle camera parallax
    camera.position.x = smoothMouse.value.x * 1
    camera.position.y = smoothMouse.value.y * 1
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(tick)
  }
  tick()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div class="webgl-evolution">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.webgl-evolution {
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
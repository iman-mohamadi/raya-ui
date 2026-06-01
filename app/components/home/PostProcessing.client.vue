<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue'
import { useTresContext, useLoop } from '@tresjs/core'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { Vector2 } from 'three'

const { renderer, scene, camera, sizes } = useTresContext()
const { onBeforeRender } = useLoop()

const composer = shallowRef<EffectComposer | null>(null)

watchEffect(() => {
  if (!renderer.value || !scene.value || !camera.value) return

  // Setup Effect Composer
  const effectComposer = new EffectComposer(renderer.value)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  effectComposer.setSize(sizes.width.value, sizes.height.value)

  // 1. Render the base 3D scene
  const renderPass = new RenderPass(scene.value, camera.value)
  effectComposer.addPass(renderPass)

  // 2. Add Physical Light Bleed (Bloom)
  const bloomPass = new UnrealBloomPass(
      new Vector2(sizes.width.value, sizes.height.value),
      1.5,  // Intensity: How bright the glow is
      0.4,  // Radius: How far the light bleeds
      0.85  // Threshold: What brightness triggers the bloom
  )
  effectComposer.addPass(bloomPass)

  composer.value = effectComposer
})

// Hijack the render loop to output the composited image
onBeforeRender(({ renderer }) => {
  if (composer.value) {
    // Disable auto-render on the main renderer
    renderer.autoClear = false
    renderer.clear()
    composer.value.render()
  }
})
</script>

<template>
</template>
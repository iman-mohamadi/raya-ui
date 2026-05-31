<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { Vector3, AdditiveBlending, Color, BufferGeometry, ShaderMaterial } from 'three'

// Composables
import { useScrollManager } from '~/composables/home/useScrollManager'
import { useMouseManager } from '~/composables/home/useMouseManager'
import { useChapterManager } from '~/composables/home/useChapterManager'
import { useCameraManager } from '~/composables/home/useCameraManager'

const { scrollProgress } = useScrollManager()
const { mouse, updateTick } = useMouseManager()
const { currentChapter, updateChapterByProgress } = useChapterManager()
const { cameraPosition, cameraLookAt, applyMouseParallax } = useCameraManager()

// Particle System Logic
const geometry = shallowRef<BufferGeometry | null>(null)
const material = shallowRef<ShaderMaterial | null>(null)
const internalColor = ref(new Color('#ffffff'))

const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (100.0 / -mvPosition.z);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist);
    gl_FragColor = vec4(uColor, alpha * 0.8);
  }
`

const uniforms = {
  uProgress: { value: 0 },
  uTime: { value: 0 },
  uColor: { value: internalColor.value }
}

// Single Global Render Loop
const onRenderLoop = ({ elapsed }: any) => {
  // 1. Update Managers
  updateTick()
  updateChapterByProgress(scrollProgress.value || 0)
  applyMouseParallax(new Vector3(0, 0, 10), mouse.x, mouse.y)

  // 2. Safely Update Shader Uniforms
  if (material.value) {
    material.value.uniforms.uTime.value = elapsed
    material.value.uniforms.uProgress.value = scrollProgress.value || 0
  }

  // 3. Update Particle Color smoothly based on Chapter config
  if (currentChapter.value?.colorPalette?.particles) {
    internalColor.value.set(currentChapter.value.colorPalette.particles)
  }
}
</script>

<template>
  <div class="fixed inset-0 w-full h-full pointer-events-none z-0 bg-black">
    <TresCanvas clear-color="#050505" window-size @render="onRenderLoop">

      <TresPerspectiveCamera
          :position="[cameraPosition.x, cameraPosition.y, cameraPosition.z]"
          :look-at="[cameraLookAt.x, cameraLookAt.y, cameraLookAt.z]"
          :fov="45"
      />

      <TresFog
          :color="currentChapter?.colorPalette?.fog || '#050505'"
          :near="10"
          :far="50"
      />
      <TresAmbientLight
          :color="currentChapter?.colorPalette?.ambient || '#ffffff'"
          :intensity="0.5"
      />
      <TresDirectionalLight
          :position="[5, 5, 5]"
          :intensity="1"
          cast-shadow
      />

      <TresPoints>
        <TresBufferGeometry ref="geometry" />
        <TresShaderMaterial
            ref="material"
            :vertex-shader="vertexShader"
            :fragment-shader="fragmentShader"
            :uniforms="uniforms"
            :transparent="true"
            :depth-write="false"
            :blending="AdditiveBlending"
        />
      </TresPoints>

    </TresCanvas>
  </div>
</template>
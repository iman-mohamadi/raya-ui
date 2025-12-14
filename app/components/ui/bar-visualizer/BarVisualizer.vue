{
type: uploaded file
fileName: iman-mohamadi/enzoui/EnzOUi-481682bc4f3f825c0131815bd4179e5da136063e/app/components/ui/bar-visualizer/BarVisualizer.vue
fullContent:
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import { cn } from '@/lib/utils'

// --- Types ---
export type AgentState = "connecting" | "initializing" | "listening" | "speaking" | "thinking"

interface AudioAnalyserOptions {
  fftSize?: number
  smoothingTimeConstant?: number
  minDecibels?: number
  maxDecibels?: number
}

interface MultiBandVolumeOptions {
  bands?: number
  loPass?: number
  hiPass?: number
  updateInterval?: number
  analyserOptions?: AudioAnalyserOptions
}

interface Props {
  state?: AgentState
  barCount?: number
  mediaStream?: MediaStream | null
  minHeight?: number
  maxHeight?: number
  demo?: boolean
  centerAlign?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  barCount: 15,
  minHeight: 20,
  maxHeight: 100,
  demo: false,
  centerAlign: false
})

// --- Audio Logic ---

function createAudioAnalyser(stream: MediaStream, options: AudioAnalyserOptions = {}) {
  // Ensure this only runs in the browser
  if (typeof window === 'undefined') return { analyser: null, cleanup: () => {} }

  const AudioContext = window.AudioContext || (window as any).webkitAudioContext
  const audioContext = new AudioContext()
  const source = audioContext.createMediaStreamSource(stream)
  const analyser = audioContext.createAnalyser()

  if (options.fftSize) analyser.fftSize = options.fftSize
  if (options.smoothingTimeConstant !== undefined) analyser.smoothingTimeConstant = options.smoothingTimeConstant
  if (options.minDecibels !== undefined) analyser.minDecibels = options.minDecibels
  if (options.maxDecibels !== undefined) analyser.maxDecibels = options.maxDecibels

  source.connect(analyser)

  return {
    analyser,
    cleanup: () => {
      source.disconnect()
      if (audioContext.state !== 'closed') audioContext.close()
    }
  }
}

const normalizeDb = (value: number) => {
  if (value === -Infinity) return 0
  const minDb = -100
  const maxDb = -10
  const db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100
  return Math.sqrt(db)
}

function useMultibandVolume(
    streamRef: Ref<MediaStream | null | undefined>,
    options: MultiBandVolumeOptions = {}
) {
  const bands = options.bands ?? 5
  const loPass = options.loPass ?? 100
  const hiPass = options.hiPass ?? 600
  const updateInterval = options.updateInterval ?? 32
  const analyserOpts = options.analyserOptions ?? { fftSize: 2048 }

  const frequencyBands = ref<number[]>(new Array(bands).fill(0))
  let frameId: number | undefined
  let cleanupFn: (() => void) | null = null

  const stop = () => {
    if (typeof window !== 'undefined' && frameId) cancelAnimationFrame(frameId)
    if (cleanupFn) cleanupFn()
    cleanupFn = null
  }

  watch(streamRef, (stream) => {
    // SSR Guard
    if (typeof window === 'undefined') return

    stop()
    if (!stream) {
      frequencyBands.value = new Array(bands).fill(0)
      return
    }

    const { analyser, cleanup } = createAudioAnalyser(stream, analyserOpts)
    if (!analyser) return // Should not happen due to SSR guard above, but safe to check

    cleanupFn = cleanup

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    const sliceStart = loPass
    const sliceEnd = hiPass
    const sliceLength = sliceEnd - sliceStart
    const chunkSize = Math.ceil(sliceLength / bands)

    let lastUpdate = 0

    const update = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        analyser.getFloatFrequencyData(dataArray)
        const chunks = new Array(bands)

        for (let i = 0; i < bands; i++) {
          let sum = 0
          let count = 0
          const startIdx = sliceStart + i * chunkSize
          const endIdx = Math.min(sliceStart + (i + 1) * chunkSize, sliceEnd)

          for (let j = startIdx; j < endIdx; j++) {
            sum += normalizeDb(dataArray[j])
            count++
          }
          chunks[i] = count > 0 ? sum / count : 0
        }

        // Check change threshold (simple optimization)
        let hasChanged = false
        for(let i=0; i<bands; i++) {
          if (Math.abs(chunks[i] - frequencyBands.value[i]) > 0.01) {
            hasChanged = true
            break
          }
        }

        if (hasChanged) frequencyBands.value = chunks
        lastUpdate = timestamp
      }
      frameId = requestAnimationFrame(update)
    }
    frameId = requestAnimationFrame(update)
  }, { immediate: true })

  onUnmounted(stop)

  return frequencyBands
}

// --- Animation Logic ---

const generateConnectingSequenceBar = (columns: number) => {
  const seq = []
  for (let x = 0; x < columns; x++) {
    seq.push([x, columns - 1 - x])
  }
  return seq
}

const generateListeningSequenceBar = (columns: number) => {
  const center = Math.floor(columns / 2)
  return [[center], [-1]]
}

function useBarAnimator(stateRef: Ref<AgentState | undefined>, columnsRef: Ref<number>, intervalRef: Ref<number>) {
  const currentFrame = ref<number[]>([])
  let frameId: number | undefined
  let startTime = 0
  let index = 0

  const sequence = computed(() => {
    const state = stateRef.value
    const cols = columnsRef.value
    if (state === 'thinking' || state === 'listening') return generateListeningSequenceBar(cols)
    if (state === 'connecting' || state === 'initializing') return generateConnectingSequenceBar(cols)
    if (state === undefined || state === 'speaking') return [Array.from({ length: cols }, (_, i) => i)]
    return [[]]
  })

  const animate = (time: number) => {
    const interval = intervalRef.value
    if (time - startTime >= interval) {
      index = (index + 1) % sequence.value.length
      currentFrame.value = sequence.value[index] || []
      startTime = time
    }
    frameId = requestAnimationFrame(animate)
  }

  watch([stateRef, columnsRef], () => {
    index = 0
    currentFrame.value = sequence.value[0] || []
  })

  onMounted(() => {
    startTime = performance.now()
    frameId = requestAnimationFrame(animate)
  })

  onUnmounted(() => {
    if (frameId) cancelAnimationFrame(frameId)
  })

  return currentFrame
}

// --- Main Logic ---

// Real Volume
const mediaStreamRef = computed(() => props.mediaStream)
const realVolumeBands = useMultibandVolume(mediaStreamRef, {
  bands: props.barCount,
  loPass: 100,
  hiPass: 200
})

// Fake Volume (Demo)
const fakeVolumeBands = ref<number[]>(new Array(props.barCount).fill(0.2))
let fakeAnimId: number | undefined

const startFakeAnimation = () => {
  if (typeof window === 'undefined') return // SSR Check

  let lastUpdate = 0
  const updateInterval = 50
  const startTime = Date.now() / 1000

  const update = (timestamp: number) => {
    if (timestamp - lastUpdate >= updateInterval) {
      const time = Date.now() / 1000 - startTime
      const newBands = new Array(props.barCount)
      for (let i = 0; i < props.barCount; i++) {
        const waveOffset = i * 0.5
        const baseVolume = Math.sin(time * 2 + waveOffset) * 0.3 + 0.5
        const randomNoise = Math.random() * 0.2
        newBands[i] = Math.max(0.1, Math.min(1, baseVolume + randomNoise))
      }
      fakeVolumeBands.value = newBands
      lastUpdate = timestamp
    }
    fakeAnimId = requestAnimationFrame(update)
  }
  fakeAnimId = requestAnimationFrame(update)
}

watch(() => [props.demo, props.state, props.barCount], () => {
  // SSR Guard for Watcher with immediate: true
  if (typeof window === 'undefined') return

  if (fakeAnimId) cancelAnimationFrame(fakeAnimId)

  if (props.demo && (props.state === 'speaking' || props.state === 'listening')) {
    startFakeAnimation()
  } else {
    fakeVolumeBands.value = new Array(props.barCount).fill(0.2)
  }
}, { immediate: true })

onUnmounted(() => {
  if (typeof window !== 'undefined' && fakeAnimId) cancelAnimationFrame(fakeAnimId)
})

const volumeBands = computed(() => props.demo ? fakeVolumeBands.value : realVolumeBands.value)

// Animator
const stateRef = computed(() => props.state)
const barCountRef = computed(() => props.barCount)
const intervalRef = computed(() => {
  if (props.state === 'connecting') return 2000 / props.barCount
  if (props.state === 'thinking') return 150
  if (props.state === 'listening') return 500
  return 1000
})

const highlightedIndices = useBarAnimator(stateRef, barCountRef, intervalRef)

</script>

<template>
  <div
      :class="cn(
      'relative flex justify-center gap-1.5',
      centerAlign ? 'items-center' : 'items-end',
      'bg-muted h-32 w-full overflow-hidden rounded-lg p-4',
      props.class
    )"
      :data-state="state"
  >
    <div
        v-for="(volume, index) in volumeBands"
        :key="index"
        :data-highlighted="highlightedIndices.includes(index)"
        :class="cn(
        'max-w-[12px] min-w-[8px] flex-1 transition-all duration-150 rounded-full',
        'bg-border data-[highlighted=true]:bg-primary',
        state === 'speaking' && 'bg-primary',
        state === 'thinking' && highlightedIndices.includes(index) && 'animate-pulse'
      )"
        :style="{
        height: `${Math.min(maxHeight, Math.max(minHeight, volume * 100 + 5))}%`,
        animationDuration: state === 'thinking' ? '300ms' : undefined
      }"
    ></div>
  </div>
</template>
}
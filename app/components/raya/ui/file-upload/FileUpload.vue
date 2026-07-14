<script setup lang="ts">
import { type HTMLAttributes, provide, ref, reactive, useId, toRef, onBeforeUnmount, toRaw } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'

export type UploadHelpers = {
  onProgress: (file: File, progress: number) => void
  onSuccess: (file: File) => void
  onError: (file: File, error: Error) => void
}

const props = withDefaults(defineProps<PrimitiveProps & {
  modelValue?: File[]
  defaultValue?: File[]
  accept?: string
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  dir?: 'ltr' | 'rtl'
  class?: HTMLAttributes['class']
  name?: string
  // Callbacks
  onValueChange?: (files: File[]) => void
  onAccept?: (files: File[]) => void
  onReject?: (file: File, message: string) => void
  onValidate?: (file: File) => string | null | undefined
  onUpload?: (files: File[], helpers: UploadHelpers) => Promise<void> | void
}>(), {
  modelValue: undefined,
  defaultValue: () => [],
  disabled: false,
  required: false,
  multiple: false,
  dir: 'ltr'
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: File[]): void
}>()

const files = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue
})

// State: Use Raw File objects as keys
const fileStates = reactive(new Map<File, {
  progress: number
  status: 'idle' | 'uploading' | 'error' | 'success'
  error?: string
}>())

const dragOver = ref(false)
const invalid = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const urlCache = new WeakMap<File, string>()

onBeforeUnmount(() => {
  files.value.forEach(file => {
    const rawFile = toRaw(file)
    if (urlCache.has(rawFile)) {
      URL.revokeObjectURL(urlCache.get(rawFile)!)
    }
  })
})

const id = useId()
const inputId = `file-upload-input-${id}`
const labelId = `file-upload-label-${id}`
const dropzoneId = `file-upload-dropzone-${id}`
const listId = `file-upload-list-${id}`

const context = {
  inputId,
  labelId,
  dropzoneId,
  listId,
  inputRef,
  files,
  fileStates,
  dragOver,
  invalid,
  urlCache,
  props: toRef(props),
  setDragOver: (v: boolean) => dragOver.value = v,
  setInvalid: (v: boolean) => invalid.value = v,
  removeFile: (file: File) => {
    const rawFile = toRaw(file)
    if (urlCache.has(rawFile)) {
      URL.revokeObjectURL(urlCache.get(rawFile)!)
      urlCache.delete(rawFile)
    }
    const newFiles = files.value.filter(f => toRaw(f) !== rawFile)
    files.value = newFiles
    fileStates.delete(rawFile)
  },
  clearFiles: () => {
    files.value.forEach(file => {
      const rawFile = toRaw(file)
      if (urlCache.has(rawFile)) {
        URL.revokeObjectURL(urlCache.get(rawFile)!)
        urlCache.delete(rawFile)
      }
    })
    files.value = []
    fileStates.clear()
  },
  handleFileChange: (newFiles: File[]) => {
    if (props.disabled) return

    let candidates = [...newFiles]
    let isInvalid = false

    if (props.maxFiles) {
      const currentCount = files.value.length
      const remaining = Math.max(0, props.maxFiles - currentCount)
      if (remaining < candidates.length) {
        const rejected = candidates.slice(remaining)
        candidates = candidates.slice(0, remaining)
        rejected.forEach(f => props.onReject?.(f, `Maximum ${props.maxFiles} files allowed`))
        isInvalid = true
      }
    }

    const accepted: File[] = []

    candidates.forEach(file => {
      let rejected = false
      let msg = ''

      if (props.onValidate) {
        const res = props.onValidate(file)
        if (res) {
          msg = res
          rejected = true
        }
      }

      if (!rejected && props.maxSize && file.size > props.maxSize) {
        msg = 'File too large'
        rejected = true
      }

      if (!rejected && props.accept) {
        const types = props.accept.split(',').map(t => t.trim())
        const fileType = file.type
        const ext = '.' + file.name.split('.').pop()
        const isMatch = types.some(t => {
          if (t === fileType) return true
          if (t === ext) return true
          if (t.endsWith('/*') && fileType.startsWith(t.slice(0, -2))) return true
          return false
        })
        if (!isMatch) {
          msg = 'File type not accepted'
          rejected = true
        }
      }

      if (rejected) {
        props.onReject?.(file, msg)
        isInvalid = true
      } else {
        accepted.push(file)
      }
    })

    if (isInvalid) {
      invalid.value = true
      setTimeout(() => invalid.value = false, 2000)
    }

    if (accepted.length > 0) {
      // Use toRaw for map keys to be safe, though input files are usually raw
      accepted.forEach(f => {
        fileStates.set(toRaw(f), { progress: 0, status: 'idle' })
      })
      files.value = [...files.value, ...accepted]
      props.onAccept?.(accepted)

      if (props.onUpload) {
        props.onUpload(accepted, {
          onProgress: (file, progress) => {
            const rawFile = toRaw(file)
            const state = fileStates.get(rawFile)
            if (state) {
              state.progress = progress
              state.status = 'uploading'
            }
          },
          onSuccess: (file) => {
            const rawFile = toRaw(file)
            const state = fileStates.get(rawFile)
            if (state) {
              state.status = 'success'
              state.progress = 100
            }
          },
          onError: (file, err) => {
            const rawFile = toRaw(file)
            const state = fileStates.get(rawFile)
            if (state) {
              state.status = 'error'
              state.error = err.message
            }
          }
        })
      }
    }
  }
}

provide('FileUploadContext', context)

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    context.handleFileChange(Array.from(target.files))
  }
  target.value = ''
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      :class="cn('relative flex flex-col gap-2', props.class)"
      :dir="dir"
      :data-disabled="disabled ? '' : undefined"
  >
    <slot :files="files" :handle-file-change="context.handleFileChange" />

    <input
        ref="inputRef"
        :id="inputId"
        type="file"
        class="sr-only"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :required="required"
        :name="name"
        tabindex="-1"
        @change="onInputChange"
    />
  </Primitive>
</template>
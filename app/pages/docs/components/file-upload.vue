<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete
} from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CodeBlock } from '@/components/ui/code-block'
import { CloudUpload, X, Upload, Paperclip, ArrowUp } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'File Upload Component for Vue & Nuxt',
  description: 'A comprehensive file upload component with drag & drop, validation, and progress tracking.',
  ogTitle: 'File Upload Component for Vue & Nuxt',
  ogDescription: 'A comprehensive file upload component with drag & drop, validation, and progress tracking.',
})

// --- Interactive Settings State ---
const activeExample = ref('validation') // validation, direct, circular, fill, chat, form

const resetSettings = () => {
  activeExample.value = 'validation'
  validationFiles.value = []
  directFiles.value = []
  circularFiles.value = []
  fillFiles.value = []
  chatFiles.value = []
  formFiles.value = []
  chatInput.value = ''
  formError.value = null
}

// --- State for Examples ---
const validationFiles = ref<File[]>([])
const directFiles = ref<File[]>([])
const circularFiles = ref<File[]>([])
const fillFiles = ref<File[]>([])
const chatFiles = ref<File[]>([])
const chatInput = ref('')
const isChatUploading = ref(false)

const formFiles = ref<File[]>([])
const formError = ref<string | null>(null)

// --- Validations ---
const onValidate = (file: File) => {
  if (validationFiles.value.length >= 2) return "You can only upload up to 2 files"
  if (!file.type.startsWith("image/")) return "Only image files are allowed"
  if (file.size > 2 * 1024 * 1024) return "File size must be less than 2MB"
  return null
}

const onReject = (file: File, msg: string) => {
  toast.error(`${file.name}: ${msg}`)
}

// --- Upload Simulation ---
async function simulateUpload(files: File[], { onProgress, onSuccess, onError }: any) {
  const promises = files.map(async (file) => {
    try {
      const totalChunks = 10
      let uploaded = 0
      for (let i = 0; i < totalChunks; i++) {
        await new Promise(r => setTimeout(r, Math.random() * 200 + 100))
        uploaded++
        onProgress(file, (uploaded / totalChunks) * 100)
      }
      await new Promise(r => setTimeout(r, 500))
      onSuccess(file)
    } catch (e) {
      onError(file, e)
    }
  })
  await Promise.all(promises)
}

// --- Chat Input Handlers ---
const onChatUpload = async (files: File[], helpers: any) => {
  isChatUploading.value = true
  await simulateUpload(files, helpers)
  isChatUploading.value = false
}

const onChatSubmit = () => {
  if (!chatInput.value.trim() && chatFiles.value.length === 0) return
  toast.success("Message sent with attachments")
  chatInput.value = ''
  chatFiles.value = []
}

// --- Form Submit Handler ---
const onFormSubmit = (e: Event) => {
  e.preventDefault()

  if (formFiles.value.length === 0) {
    formError.value = "Please select at least one file"
    return
  }

  if (formFiles.value.length > 2) {
    formError.value = "Please select up to 2 files"
    return
  }

  const invalidFile = formFiles.value.find(f => f.size > 5 * 1024 * 1024)
  if (invalidFile) {
    formError.value = "All files must be less than 5MB"
    return
  }

  formError.value = null
  toast.success('Submitted: ' + formFiles.value.map(f => f.name).join(', '))
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add file-upload'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add file-upload'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add file-upload'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add file-upload'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install lucide-vue-next @vueuse/core reka-ui`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Code Strings ---
const validationCode = `<script setup lang="ts">
import { FileUpload, FileUploadDropzone, FileUploadTrigger, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemDelete } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const files = ref<File[]>([])

const onValidate = (file: File) => {
  if (files.value.length >= 2) return "Max 2 files"
  if (!file.type.startsWith("image/")) return "Only images allowed"
  if (file.size > 2 * 1024 * 1024) return "Max 2MB"
  return null
}

const onReject = (file: File, msg: string) => toast.error(\`\${file.name}: \${msg}\`)
<\/script>

<template>
  <FileUpload
    v-model="files"
    accept="image/*"
    :max-files="2"
    :on-validate="onValidate"
    :on-reject="onReject"
    class="w-full max-w-md"
  >
    <FileUploadDropzone>
       <div class="flex flex-col items-center gap-1">
         <div class="flex items-center justify-center rounded-full border border-border p-2.5 bg-background">
           <Upload class="size-6 text-muted-foreground" />
         </div>
         <p class="font-medium text-sm text-foreground">Drag & drop files here</p>
         <p class="text-muted-foreground text-xs">Or click to browse (max 2 files)</p>
       </div>
       <FileUploadTrigger asChild>
         <Button variant="outline" size="sm" class="mt-2 w-fit">Browse files</Button>
       </FileUploadTrigger>
    </FileUploadDropzone>
    <FileUploadList>
      <FileUploadItem v-for="file in files" :key="file.name" :file="file">
        <FileUploadItemPreview />
        <FileUploadItemMetadata />
        <FileUploadItemDelete asChild>
          <Button variant="ghost" size="icon" class="size-7"><X class="size-4" /></Button>
        </FileUploadItemDelete>
      </FileUploadItem>
    </FileUploadList>
  </FileUpload>
</template>`

const directUploadCode = `<script setup lang="ts">
import { ref } from 'vue'
import { FileUpload, FileUploadDropzone, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemProgress, FileUploadItemDelete } from '@/components/ui/file-upload'

const files = ref<File[]>([])

const onUpload = async (files, { onProgress, onSuccess, onError }) => {
  const promises = files.map(async (file) => {
      const total = 10
      for (let i = 0; i < total; i++) {
         await new Promise(r => setTimeout(r, 200))
         onProgress(file, ((i+1)/total)*100)
      }
      onSuccess(file)
  })
  await Promise.all(promises)
}
<\/script>

<template>
  <FileUpload v-model="files" :on-upload="onUpload" multiple class="w-full max-w-md">
      <FileUploadDropzone>
        <!-- Dropzone content... -->
      </FileUploadDropzone>
      <FileUploadList>
        <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="flex-col items-start gap-1">
           <div class="flex w-full items-center gap-2">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete />
           </div>
           <FileUploadItemProgress />
        </FileUploadItem>
      </FileUploadList>
  </FileUpload>
</template>`

const circularCode = `<template>
  <FileUpload v-model="files" :max-files="5" :on-upload="simulateUpload" multiple class="w-full max-w-md">
     <FileUploadDropzone>
        <!-- Dropzone content... -->
     </FileUploadDropzone>
     <FileUploadList orientation="horizontal" class="flex-wrap">
        <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="p-0 border-none bg-transparent">
           <FileUploadItemPreview class="size-20 [&>svg]:size-10 relative">
              <FileUploadItemProgress variant="circular" :size="40" class="absolute inset-0 flex items-center justify-center z-10" />
           </FileUploadItemPreview>
           <FileUploadItemDelete asChild>
              <Button variant="secondary" size="icon" class="absolute -top-1 -right-1 size-5 rounded-full shadow-sm">
                 <X class="size-3" />
              </Button>
           </FileUploadItemDelete>
        </FileUploadItem>
     </FileUploadList>
  </FileUpload>
</template>`

const fillCode = `<template>
  <FileUpload v-model="files" :max-files="5" :on-upload="simulateUpload" multiple class="w-full max-w-md">
     <FileUploadDropzone>
        <!-- Dropzone content... -->
     </FileUploadDropzone>
     <FileUploadList orientation="horizontal" class="flex-wrap">
        <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="p-0 border-none bg-transparent">
           <FileUploadItemPreview class="size-20">
              <FileUploadItemProgress variant="fill" />
           </FileUploadItemPreview>
           <FileUploadItemDelete asChild>
              <Button variant="secondary" size="icon" class="absolute -top-1 -right-1 size-5 rounded-full shadow-sm">
                 <X class="size-3" />
              </Button>
           </FileUploadItemDelete>
        </FileUploadItem>
     </FileUploadList>
  </FileUpload>
</template>`

const chatCode = `<script setup lang="ts">
const input = ref('')
const files = ref([])
const isUploading = ref(false)

const onUpload = async (files, helpers) => {
   isUploading.value = true
   // simulate upload...
   isUploading.value = false
}
<\/script>

<template>
  <FileUpload v-model="files" :on-upload="onUpload" :disabled="isUploading" class="relative h-[400px] w-full items-center justify-center p-8 border rounded-lg bg-muted/10">
    <FileUploadDropzone class="absolute inset-0 z-0 flex size-full items-center justify-center rounded-none border-none bg-background/50 p-0 opacity-0 backdrop-blur transition-opacity duration-200 ease-out data-[dragging]:z-10 data-[dragging]:opacity-100">
       <p>Drop here</p>
    </FileUploadDropzone>

    <form @submit.prevent="onChatSubmit" class="relative z-0 flex w-full max-w-md flex-col gap-2.5 rounded-md border border-input bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
       <FileUploadList orientation="horizontal" class="px-0 py-1 overflow-x-auto">
          <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="max-w-52 p-1.5 shrink-0">
             <FileUploadItemPreview class="size-8 [&>svg]:size-5"><FileUploadItemProgress variant="fill"/></FileUploadItemPreview>
             <FileUploadItemMetadata size="sm" />
             <FileUploadItemDelete asChild><Button size="icon" variant="secondary" class="absolute -top-1 -right-1 size-4 rounded-full shadow-sm"><X class="size-2.5"/></Button></FileUploadItemDelete>
          </FileUploadItem>
       </FileUploadList>

       <Textarea v-model="input" placeholder="Type message..." class="min-h-10 w-full resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />

       <div class="flex items-center justify-end gap-1.5">
          <FileUploadTrigger asChild><Button type="button" variant="ghost" size="icon" class="size-7 rounded-sm"><Paperclip class="size-3.5"/></Button></FileUploadTrigger>
          <Button size="icon" class="size-7 rounded-sm"><ArrowUp class="size-3.5"/></Button>
       </div>
    </form>
  </FileUpload>
</template>`

const formCode = `<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const files = ref<File[]>([])
const error = ref<string | null>(null)

const onSubmit = (e: Event) => {
  if (files.value.length === 0) {
    error.value = "Please select at least one file"
    return
  }
  error.value = null
  toast.success('Submitted')
}
<\/script>

<template>
  <form @submit.prevent="onSubmit" class="w-full max-w-md space-y-4">
    <div class="space-y-2">
      <label class="text-sm font-medium">Attachments</label>
      <FileUpload
        v-model="files"
        accept="image/*"
        :max-files="2"
        multiple
      >
         <FileUploadDropzone class="flex-row flex-wrap border-dotted text-center min-h-24">
            <CloudUpload class="size-4 mr-2" />
            <span>Drag and drop or </span>
            <FileUploadTrigger asChild><Button variant="link" size="sm" class="p-0 mx-1">choose files</Button></FileUploadTrigger>
            <span> to upload</span>
         </FileUploadDropzone>
         <FileUploadList>...</FileUploadList>
      </FileUpload>
      <p v-if="error" class="text-xs font-medium text-destructive">{{ error }}</p>
    </div>
    <Button type="submit">Submit</Button>
  </form>
</template>`

const activeCodeString = computed(() => {
  switch (activeExample.value) {
    case 'direct': return directUploadCode;
    case 'circular': return circularCode;
    case 'fill': return fillCode;
    case 'chat': return chatCode;
    case 'form': return formCode;
    case 'validation':
    default: return validationCode;
  }
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">File Upload</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">File Upload</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A comprehensive, headless file upload component with drag & drop, rich validation, and multi-state progress tracking.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <!-- Main Install Tabs -->
      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual', 'css']"
            :key="tab"
            @click="activeInstallTab = tab"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- CLI Install -->
      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                @click="activeCliTab = tab"
                class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
                :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" />
        </div>
      </div>

      <!-- Manual Install -->
      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/file-upload</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography and layout colors seamlessly from your <code>main.css</code> theme variables.
        </div>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">
            <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            your-project
          </div>
          <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
            <div class="flex items-center gap-2 py-2">
              <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              components
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                ui
              </div>
              <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                <div class="flex items-center gap-2 py-2 text-pink-500">
                  <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  file-upload
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FileUpload.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FileUploadDropzone.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FileUploadList.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FileUploadItem.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">FileUpload Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">v-model</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">File[]</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">[]</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Array binding for the selected files.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">accept</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Native HTML accept attribute (e.g., <code>"image/*"</code>).</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">max-files</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Limits the total number of selectable files.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">on-validate</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">(file: File) => string | null</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Custom validation function. Return an error string to reject a file, or null to accept it.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">on-upload</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Function</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Callback that provides <code>onProgress</code>, <code>onSuccess</code>, and <code>onError</code> handlers for tracking async uploads.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full flex items-center justify-center p-6">

        <!-- Validation Example -->
        <FileUpload
            v-if="activeExample === 'validation'"
            v-model="validationFiles"
            accept="image/*"
            :max-files="2"
            :on-validate="onValidate"
            :on-reject="onReject"
            class="w-full max-w-md"
        >
          <FileUploadDropzone>
            <div class="flex flex-col items-center gap-1">
              <div class="flex items-center justify-center rounded-full border border-border p-2.5 bg-background">
                <Upload class="size-6 text-muted-foreground" />
              </div>
              <p class="font-medium text-sm text-foreground">Drag & drop files here</p>
              <p class="text-muted-foreground text-xs">Or click to browse (max 2 files)</p>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" class="mt-2 w-fit">Browse files</Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            <FileUploadItem v-for="file in validationFiles" :key="file.name" :file="file">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" class="size-7"><X class="size-4"/></Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          </FileUploadList>
        </FileUpload>

        <!-- Direct Upload Example -->
        <FileUpload
            v-else-if="activeExample === 'direct'"
            v-model="directFiles"
            :max-files="2"
            :on-upload="simulateUpload"
            multiple
            class="w-full max-w-md"
        >
          <FileUploadDropzone>
            <div class="flex flex-col items-center gap-1 text-center">
              <div class="flex items-center justify-center rounded-full border border-border p-2.5 bg-background">
                <Upload class="size-6 text-muted-foreground" />
              </div>
              <p class="font-medium text-sm text-foreground">Drag & drop files here</p>
              <p class="text-muted-foreground text-xs">Or click to browse</p>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" class="mt-2 w-fit">Browse files</Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            <FileUploadItem v-for="file in directFiles" :key="file.name" :file="file" class="flex-col items-start gap-1">
              <div class="flex w-full items-center gap-2">
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <Button variant="ghost" size="icon" class="size-7"><X class="size-4"/></Button>
                </FileUploadItemDelete>
              </div>
              <FileUploadItemProgress />
            </FileUploadItem>
          </FileUploadList>
        </FileUpload>

        <!-- Circular Progress Example -->
        <FileUpload
            v-else-if="activeExample === 'circular'"
            v-model="circularFiles"
            :max-files="5"
            :on-upload="simulateUpload"
            multiple
            class="w-full max-w-md"
        >
          <FileUploadDropzone>
            <div class="flex flex-col items-center gap-1 text-center">
              <div class="flex items-center justify-center rounded-full border border-border p-2.5 bg-background">
                <Upload class="size-6 text-muted-foreground" />
              </div>
              <p class="font-medium text-sm text-foreground">Drag & drop files here</p>
              <p class="text-muted-foreground text-xs">Or click to browse</p>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" class="mt-2 w-fit">Browse files</Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList orientation="horizontal" class="flex-wrap">
            <FileUploadItem v-for="file in circularFiles" :key="file.name" :file="file" class="p-0 border-none bg-transparent">
              <FileUploadItemPreview class="size-20 [&>svg]:size-10 relative">
                <FileUploadItemProgress variant="circular" :size="40" class="absolute inset-0 flex items-center justify-center z-10" />
              </FileUploadItemPreview>
              <FileUploadItemDelete asChild>
                <Button variant="secondary" size="icon" class="absolute -top-1 -right-1 size-5 rounded-full shadow-sm"><X class="size-3"/></Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          </FileUploadList>
        </FileUpload>

        <!-- Fill Progress Example -->
        <FileUpload
            v-else-if="activeExample === 'fill'"
            v-model="fillFiles"
            :max-files="5"
            :on-upload="simulateUpload"
            multiple
            class="w-full max-w-md"
        >
          <FileUploadDropzone>
            <div class="flex flex-col items-center gap-1 text-center">
              <div class="flex items-center justify-center rounded-full border border-border p-2.5 bg-background">
                <Upload class="size-6 text-muted-foreground" />
              </div>
              <p class="font-medium text-sm text-foreground">Drag & drop files here</p>
              <p class="text-muted-foreground text-xs">Or click to browse</p>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" class="mt-2 w-fit">Browse files</Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList orientation="horizontal" class="flex-wrap">
            <FileUploadItem v-for="file in fillFiles" :key="file.name" :file="file" class="p-0 border-none bg-transparent">
              <FileUploadItemPreview class="size-20">
                <FileUploadItemProgress variant="fill" />
              </FileUploadItemPreview>
              <FileUploadItemDelete asChild>
                <Button variant="secondary" size="icon" class="absolute -top-1 -right-1 size-5 rounded-full shadow-sm"><X class="size-3"/></Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          </FileUploadList>
        </FileUpload>

        <!-- Chat Integration Example -->
        <FileUpload
            v-else-if="activeExample === 'chat'"
            v-model="chatFiles"
            :on-upload="onChatUpload"
            :disabled="isChatUploading"
            class="relative h-[300px] w-full items-center justify-center border border-border rounded-lg bg-muted/30"
        >
          <FileUploadDropzone class="absolute inset-0 z-0 flex size-full items-center justify-center rounded-none border-none bg-background/50 p-0 opacity-0 backdrop-blur transition-opacity duration-200 ease-out data-[dragging]:z-10 data-[dragging]:opacity-100">
            <div class="flex flex-col items-center gap-1 text-center">
              <div class="flex items-center justify-center rounded-full border border-border p-2.5 bg-background">
                <Upload class="size-6 text-muted-foreground" />
              </div>
              <p class="font-medium text-sm text-foreground">Drop to attach to message</p>
            </div>
          </FileUploadDropzone>

          <form @submit.prevent="onChatSubmit" class="relative z-0 flex w-full max-w-sm flex-col gap-2.5 rounded-xl border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-border">
            <FileUploadList orientation="horizontal" class="px-0 py-1 overflow-x-auto">
              <FileUploadItem v-for="file in chatFiles" :key="file.name" :file="file" class="max-w-52 p-1.5 shrink-0">
                <FileUploadItemPreview class="size-8 [&>svg]:size-5">
                  <FileUploadItemProgress variant="fill" />
                </FileUploadItemPreview>
                <FileUploadItemMetadata size="sm" />
                <FileUploadItemDelete asChild>
                  <Button variant="secondary" size="icon" class="absolute -top-1 -right-1 size-4 rounded-full shadow-sm"><X class="size-2.5"/></Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            </FileUploadList>

            <Textarea v-model="chatInput" placeholder="Type your message here..." class="min-h-10 w-full resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" :disabled="isChatUploading" />

            <div class="flex items-center justify-end gap-1.5 border-t border-border pt-2">
              <FileUploadTrigger asChild>
                <Button type="button" size="icon" variant="ghost" class="size-7 rounded-sm">
                  <Paperclip class="size-3.5 text-muted-foreground" /><span class="sr-only">Attach</span>
                </Button>
              </FileUploadTrigger>
              <Button size="icon" class="size-7 rounded-sm" :disabled="!chatInput.trim() && chatFiles.length === 0">
                <ArrowUp class="size-3.5" /><span class="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </FileUpload>

        <!-- Form Integration Example -->
        <form v-else-if="activeExample === 'form'" @submit="onFormSubmit" class="w-full max-w-md space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Attachments</label>
            <FileUpload
                v-model="formFiles"
                accept="image/*"
                :max-files="2"
                :on-reject="(f, m) => toast.error(m)"
                multiple
            >
              <FileUploadDropzone class="flex-row flex-wrap border-dotted text-center min-h-24">
                <CloudUpload class="size-4 mr-2 text-muted-foreground" />
                <span class="text-muted-foreground text-sm">Drag and drop or </span>
                <FileUploadTrigger asChild>
                  <Button variant="link" size="sm" class="p-0 mx-1">choose files</Button>
                </FileUploadTrigger>
                <span class="text-muted-foreground text-sm"> to upload</span>
              </FileUploadDropzone>
              <FileUploadList>
                <FileUploadItem v-for="file in formFiles" :key="file.name" :file="file">
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" class="size-7"><X class="size-4" /></Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              </FileUploadList>
            </FileUpload>
            <p v-if="formError" class="text-xs font-medium text-error">{{ formError }}</p>
            <p class="text-xs text-muted-foreground">Upload up to 2 images up to 5MB each.</p>
          </div>
          <Button type="submit">Submit Form</Button>
        </form>

      </div>
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Source Code Slot               -->
    <!-- ========================================== -->
    <template #code>
      <CodeBlock language="vue" :code="activeCodeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Settings Panel Slot            -->
    <!-- ========================================== -->
    <template #settings>
      <!-- Panel Header & Reset -->
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Example Switcher -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Example Variant</label>
        <div class="relative">
          <select v-model="activeExample" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="validation">Validation</option>
            <option value="direct">Direct Upload & Progress</option>
            <option value="circular">Circular Progress</option>
            <option value="fill">Fill Progress</option>
            <option value="chat">Chat Input Integration</option>
            <option value="form">Form Integration</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>
<script setup lang="ts">
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
import { ref } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- State for Examples ---
const validationFiles = ref<File[]>([])
const directFiles = ref<File[]>([])
const circularFiles = ref<File[]>([])
const fillFiles = ref<File[]>([])
const uploadThingFiles = ref<File[]>([])
const chatFiles = ref<File[]>([])
const chatInput = ref('')
const isChatUploading = ref(false)
const isThingUploading = ref(false)

// Form State (No vee-validate/zod)
const formFiles = ref<File[]>([])
const formError = ref<string | null>(null)

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/file-upload.json`,
  manual: `npm install lucide-vue-next @vueuse/core reka-ui`
}

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
  if (!chatInput.value.trim()) return
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

  // Check file sizes
  const invalidFile = formFiles.value.find(f => f.size > 5 * 1024 * 1024)
  if (invalidFile) {
    formError.value = "All files must be less than 5MB"
    return
  }

  formError.value = null
  toast.success('Submitted: ' + formFiles.value.map(f => f.name).join(', '))
}

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
         <div class="flex items-center justify-center rounded-full border p-2.5">
           <Upload class="size-6 text-muted-foreground" />
         </div>
         <p class="font-medium text-sm">Drag & drop files here</p>
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
          <Button variant="ghost" size="icon" class="size-7"><X /></Button>
        </FileUploadItemDelete>
      </FileUploadItem>
    </FileUploadList>
  </FileUpload>
</template>`

const directUploadCode = `<script setup lang="ts">
import { FileUpload, FileUploadDropzone, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemProgress, FileUploadItemDelete } from '@/components/ui/file-upload'
// ... imports

const files = ref<File[]>([])

const onUpload = async (files, { onProgress, onSuccess, onError }) => {
  const promises = files.map(async (file) => {
      // Simulate upload
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
  <FileUpload v-model="files" :on-upload="onUpload" multiple>
      <FileUploadList>
        <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="flex-col items-start">
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
  <FileUpload v-model="files" :on-upload="onUpload" multiple>
     <FileUploadList orientation="horizontal">
        <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="p-0">
           <FileUploadItemPreview class="size-20 [&>svg]:size-12">
              <FileUploadItemProgress variant="circular" :size="40" />
           </FileUploadItemPreview>
           <FileUploadItemDelete asChild>
              <Button variant="secondary" size="icon" class="absolute -top-1 -right-1 size-5 rounded-full">
                 <X class="size-3" />
              </Button>
           </FileUploadItemDelete>
        </FileUploadItem>
     </FileUploadList>
  </FileUpload>
</template>`

const fillCode = `<template>
  <FileUpload v-model="files" :on-upload="onUpload" multiple>
     <FileUploadList orientation="horizontal">
        <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="p-0">
           <FileUploadItemPreview class="size-20">
              <FileUploadItemProgress variant="fill" />
           </FileUploadItemPreview>
           <FileUploadItemDelete asChild>
              <Button variant="secondary" size="icon" class="absolute -top-1 -right-1 size-5 rounded-full">
                 <X class="size-3" />
              </Button>
           </FileUploadItemDelete>
        </FileUploadItem>
     </FileUploadList>
  </FileUpload>
</template>`

const chatCode = `<script setup lang="ts">
// imports ...
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
  <FileUpload v-model="files" :on-upload="onUpload" :disabled="isUploading" class="relative h-[400px] items-center p-8">
    <FileUploadDropzone class="absolute inset-0 opacity-0 z-0 data-[dragging]:opacity-100 data-[dragging]:z-10 transition-opacity bg-background/80 backdrop-blur">
       </FileUploadDropzone>

    <div class="relative flex w-full max-w-md flex-col gap-2 rounded-md border p-2">
       <FileUploadList orientation="horizontal" class="px-0 py-1">
          <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="max-w-52 p-1.5">
             <FileUploadItemPreview class="size-8"><FileUploadItemProgress variant="fill"/></FileUploadItemPreview>
             <FileUploadItemMetadata size="sm" />
             <FileUploadItemDelete asChild><Button size="icon" variant="secondary" class="absolute -top-1 -right-1 size-4 rounded-full"><X class="size-2.5"/></Button></FileUploadItemDelete>
          </FileUploadItem>
       </FileUploadList>

       <Textarea v-model="input" placeholder="Type message..." class="min-h-10 resize-none border-0 shadow-none" />

       <div class="flex justify-end gap-2">
          <FileUploadTrigger asChild><Button variant="ghost" size="icon"><Paperclip /></Button></FileUploadTrigger>
          <Button size="icon"><ArrowUp /></Button>
       </div>
    </div>
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
  <form @submit.prevent="onSubmit">
    <FileUpload
      v-model="files"
      accept="image/*"
      :max-files="2"
      multiple
    >
       <FileUploadDropzone>
          <CloudUpload /> Drag and drop or <FileUploadTrigger asChild><Button variant="link">choose</Button></FileUploadTrigger>
       </FileUploadDropzone>
       <FileUploadList>...</FileUploadList>
    </FileUpload>
    <span v-if="error" class="text-red-500 text-sm">{{ error }}</span>
    <Button type="submit">Submit</Button>
  </form>
</template>`
</script>

<template>
  <div class="pb-10">
    <PageTitle title="File Upload" description="A comprehensive file upload component with drag & drop, validation, and progress tracking." />
    <Divider />

    <div class="space-y-12 mt-8">

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Validation</h3>
        <p class="text-sm text-muted-foreground">Validates file type (images only), max files (2), and max size (2MB).</p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border rounded-xl">
            <FileUpload v-model="validationFiles" accept="image/*" :max-files="2" :on-validate="onValidate" :on-reject="onReject" class="w-full max-w-md">
              <FileUploadDropzone>
                <div class="flex flex-col items-center gap-1">
                  <div class="flex items-center justify-center rounded-full border p-2.5 bg-background">
                    <Upload class="size-6 text-muted-foreground" />
                  </div>
                  <p class="font-medium text-sm">Drag & drop files here</p>
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
          </TabsContent>
          <TabsContent value="code"><CodeBlock :code="validationCode" lang="html" /></TabsContent>
        </Tabs>
      </div>

      <div class="h-g"/>
      <Divider/>

      <div class="space-y-6 mt-4">
        <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
        <div class="space-y-4">
          <CodeBlock :code="installCommands.npm"/>
        </div>
      </div>

      <div class="h-g"/>
      <Divider/>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Direct Upload with Progress</h3>
        <p class="text-sm text-muted-foreground">Simulates chunked upload progress.</p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border rounded-xl">
            <FileUpload v-model="directFiles" :max-files="2" :on-upload="simulateUpload" multiple class="w-full max-w-md">
              <FileUploadDropzone>
                <div class="flex flex-col items-center gap-1 text-center">
                  <div class="flex items-center justify-center rounded-full border p-2.5 bg-background">
                    <Upload class="size-6 text-muted-foreground" />
                  </div>
                  <p class="font-medium text-sm">Drag & drop files here</p>
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
          </TabsContent>
          <TabsContent value="code"><CodeBlock :code="directUploadCode" lang="html" /></TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Circular Progress</h3>
        <p class="text-sm text-muted-foreground">Uses the <code>circular</code> variant for the progress indicator.</p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border rounded-xl">
            <FileUpload v-model="circularFiles" :max-files="5" :on-upload="simulateUpload" multiple class="w-full max-w-md">
              <FileUploadDropzone>
                <div class="flex flex-col items-center gap-1 text-center">
                  <div class="flex items-center justify-center rounded-full border p-2.5 bg-background">
                    <Upload class="size-6 text-muted-foreground" />
                  </div>
                  <p class="font-medium text-sm">Drag & drop files here</p>
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
          </TabsContent>
          <TabsContent value="code"><CodeBlock :code="circularCode" lang="html" /></TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Fill Progress</h3>
        <p class="text-sm text-muted-foreground">Uses the <code>fill</code> variant which overlays the preview.</p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border rounded-xl">
            <FileUpload v-model="fillFiles" :max-files="5" :on-upload="simulateUpload" multiple class="w-full max-w-md">
              <FileUploadDropzone>
                <div class="flex flex-col items-center gap-1 text-center">
                  <div class="flex items-center justify-center rounded-full border p-2.5 bg-background">
                    <Upload class="size-6 text-muted-foreground" />
                  </div>
                  <p class="font-medium text-sm">Drag & drop files here</p>
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
          </TabsContent>
          <TabsContent value="code"><CodeBlock :code="fillCode" lang="html" /></TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">UploadThing Integration</h3>
        <p class="text-sm text-muted-foreground">Demo of how it would look with UploadThing (simulated).</p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border rounded-xl">
            <FileUpload v-model="uploadThingFiles" :max-files="2" :on-upload="simulateUpload" :disabled="isThingUploading" multiple class="w-full max-w-md">
              <FileUploadDropzone>
                <div class="flex flex-col items-center gap-1 text-center">
                  <div class="flex items-center justify-center rounded-full border p-2.5 bg-background">
                    <Upload class="size-6 text-muted-foreground" />
                  </div>
                  <p class="font-medium text-sm">Drag & drop files here</p>
                  <p class="text-muted-foreground text-xs">Or click to browse</p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" class="mt-2 w-fit">Browse files</Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
              <FileUploadList>
                <FileUploadItem v-for="file in uploadThingFiles" :key="file.name" :file="file">
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
          </TabsContent>
          <TabsContent value="code"><CodeBlock :code="directUploadCode" lang="html" /></TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Chat Input Integration</h3>
        <p class="text-sm text-muted-foreground">Complex composition with a textarea and overlay dropzone.</p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border rounded-xl">
            <FileUpload v-model="chatFiles" :on-upload="onChatUpload" :disabled="isChatUploading" class="relative h-[400px] w-full items-center justify-center p-8 border rounded-lg bg-muted/10">
              <FileUploadDropzone class="absolute inset-0 z-0 flex size-full items-center justify-center rounded-none border-none bg-background/50 p-0 opacity-0 backdrop-blur transition-opacity duration-200 ease-out data-[dragging]:z-10 data-[dragging]:opacity-100">
                <div class="flex flex-col items-center gap-1 text-center">
                  <div class="flex items-center justify-center rounded-full border p-2.5 bg-background">
                    <Upload class="size-6 text-muted-foreground" />
                  </div>
                  <p class="font-medium text-sm">Drag & drop files here</p>
                </div>
              </FileUploadDropzone>

              <form @submit.prevent="onChatSubmit" class="relative z-0 flex w-full max-w-md flex-col gap-2.5 rounded-md border border-input bg-background px-3 py-2 shadow-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
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

                <div class="flex items-center justify-end gap-1.5">
                  <FileUploadTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" class="size-7 rounded-sm">
                      <Paperclip class="size-3.5" /><span class="sr-only">Attach</span>
                    </Button>
                  </FileUploadTrigger>
                  <Button size="icon" class="size-7 rounded-sm" :disabled="!chatInput.trim() && chatFiles.length === 0">
                    <ArrowUp class="size-3.5" /><span class="sr-only">Send</span>
                  </Button>
                </div>
              </form>
            </FileUpload>
          </TabsContent>
          <TabsContent value="code"><CodeBlock :code="chatCode" lang="html" /></TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Form Integration</h3>
        <p class="text-sm text-muted-foreground">Simple form validation without external libraries.</p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border rounded-xl">
            <form @submit="onFormSubmit" class="w-full max-w-md space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Attachments</label>
                <FileUpload
                    v-model="formFiles"
                    accept="image/*"
                    :max-files="2"
                    :on-reject="(f, m) => toast.error(m)"
                    multiple
                >
                  <FileUploadDropzone class="flex-row flex-wrap border-dotted text-center min-h-24">
                    <CloudUpload class="size-4 mr-2" />
                    <span>Drag and drop or </span>
                    <FileUploadTrigger asChild>
                      <Button variant="link" size="sm" class="p-0 mx-1">choose files</Button>
                    </FileUploadTrigger>
                    <span> to upload</span>
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
                <p v-if="formError" class="text-xs font-medium text-destructive">{{ formError }}</p>
                <p class="text-xs text-muted-foreground">Upload up to 2 images up to 5MB each.</p>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </TabsContent>
          <TabsContent value="code"><CodeBlock :code="formCode" lang="html" /></TabsContent>
        </Tabs>
      </div>

    </div>
  </div>
</template>
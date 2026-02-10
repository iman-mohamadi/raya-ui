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
import { CloudUpload, X, Upload, Paperclip, ArrowUp, FileIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- Main Hero State ---
const heroFiles = ref<File[]>([])

// --- Example States ---
const validationFiles = ref<File[]>([])
const directFiles = ref<File[]>([])
const circularFiles = ref<File[]>([])
const fillFiles = ref<File[]>([])
const chatFiles = ref<File[]>([])
const chatInput = ref('')
const isChatUploading = ref(false)
const formFiles = ref<File[]>([])
const formError = ref<string | null>(null)

// --- Helper: Simulate Upload ---
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

// --- Handlers ---
const onValidate = (file: File) => {
  if (validationFiles.value.length >= 2) return "You can only upload up to 2 files"
  if (!file.type.startsWith("image/")) return "Only image files are allowed"
  if (file.size > 2 * 1024 * 1024) return "File size must be less than 2MB"
  return null
}

const onReject = (file: File, msg: string) => {
  toast.error(`${file.name}: ${msg}`)
}

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

const onFormSubmit = (e: Event) => {
  e.preventDefault()
  if (formFiles.value.length === 0) {
    formError.value = "Please select at least one file"
    return
  }
  formError.value = null
  toast.success('Submitted: ' + formFiles.value.map(f => f.name).join(', '))
}

// --- Installation & Code Snippets ---
const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/file-upload.json`,
  manual: `npm install lucide-vue-next @vueuse/core reka-ui`
}

const heroCode = `<script setup lang="ts">
import { FileUpload, FileUploadDropzone, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemProgress, FileUploadItemDelete } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { CloudUpload, X } from 'lucide-vue-next'
import { ref } from 'vue'

const files = ref<File[]>([])

const onUpload = async (files, { onProgress, onSuccess }) => {
  // Simulate upload
  files.forEach(async (file) => {
    for (let i = 0; i <= 100; i+=10) {
      await new Promise(r => setTimeout(r, 100))
      onProgress(file, i)
    }
    onSuccess(file)
  })
}
<\/script>

<template>
  <FileUpload v-model="files" :on-upload="onUpload" class="w-full max-w-lg">
    <FileUploadDropzone class="h-64 transition-all hover:bg-muted/20">
      <div class="flex flex-col items-center justify-center gap-4 text-center">
        <div class="rounded-full bg-primary/10 p-3">
            <CloudUpload class="size-6 text-primary" />
        </div>
        <div class="space-y-1">
            <p class="text-sm font-medium">Click to upload or drag and drop</p>
            <p class="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      </div>
    </FileUploadDropzone>

    <FileUploadList>
      <FileUploadItem v-for="file in files" :key="file.name" :file="file">
        <FileUploadItemPreview />
        <FileUploadItemMetadata />
        <FileUploadItemProgress />
        <FileUploadItemDelete asChild>
           <Button variant="ghost" size="icon"><X class="size-4" /></Button>
        </FileUploadItemDelete>
      </FileUploadItem>
    </FileUploadList>
  </FileUpload>
</template>`

const validationCode = `<FileUpload
  v-model="files"
  accept="image/*"
  :max-files="2"
  :on-validate="onValidate"
  :on-reject="onReject"
>
  </FileUpload>`

const circularCode = `<FileUploadList orientation="horizontal" class="flex-wrap">
   <FileUploadItem v-for="file in files" :key="file.name" :file="file" class="p-0 border-none bg-transparent">
      <FileUploadItemPreview class="size-20 [&>svg]:size-10 relative">
         <FileUploadItemProgress variant="circular" :size="40" class="absolute inset-0 z-10" />
      </FileUploadItemPreview>
   </FileUploadItem>
</FileUploadList>`

const chatCode = `<FileUpload class="relative h-[400px]">
   <FileUploadDropzone class="absolute inset-0 opacity-0 z-0 data-[dragging]:opacity-100 data-[dragging]:z-10 bg-background/80 backdrop-blur" />

   <div class="relative z-10 border rounded-md p-2">
      <FileUploadList orientation="horizontal" class="px-0 py-1" />
      <Textarea placeholder="Type message..." />
   </div>
</FileUpload>`
</script>

<template>
  <div class="pb-10">
    <PageTitle
        title="File Upload"
        description="A composable, accessible file upload component with drag & drop support, file validation, and progress tracking."
    />
    <Divider/>

    <div class="mt-4">
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="flex min-h-[450px] items-center justify-center rounded-xl border border-edge bg-background p-10">
            <FileUpload v-model="heroFiles" :on-upload="simulateUpload" class="w-full max-w-lg">
              <FileUploadDropzone class="h-64 transition-all hover:bg-muted/20">
                <div class="flex flex-col items-center justify-center gap-4 text-center">
                  <div class="rounded-full bg-primary/10 p-3">
                    <CloudUpload class="size-6 text-primary" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium">Click to upload or drag and drop</p>
                    <p class="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </div>
              </FileUploadDropzone>
              <FileUploadList>
                <FileUploadItem v-for="file in heroFiles" :key="file.name" :file="file">
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemProgress />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-foreground"><X class="size-4" /></Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              </FileUploadList>
            </FileUpload>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="heroCode" lang="html"/>
        </TabsContent>
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

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Validation & Restrictions</h3>
        <p class="text-sm text-muted-foreground">
          Restrict files by type (images only), count (max 2), and size (max 2MB).
        </p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border border-edge rounded-xl">
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

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Circular Progress</h3>
        <p class="text-sm text-muted-foreground">
          Use the <code>variant="circular"</code> prop on <code>FileUploadItemProgress</code> for a radial indicator.
        </p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border border-edge rounded-xl">
            <FileUpload v-model="circularFiles" :max-files="5" :on-upload="simulateUpload" multiple class="w-full max-w-md">
              <FileUploadDropzone>
                <div class="flex flex-col items-center gap-1 text-center">
                  <div class="flex items-center justify-center rounded-full border p-2.5 bg-background">
                    <Upload class="size-6 text-muted-foreground" />
                  </div>
                  <p class="font-medium text-sm">Drag & drop files here</p>
                </div>
              </FileUploadDropzone>
              <FileUploadList orientation="horizontal" class="flex-wrap gap-4 mt-4 justify-center">
                <FileUploadItem v-for="file in circularFiles" :key="file.name" :file="file" class="p-0 border-none bg-transparent">
                  <FileUploadItemPreview class="size-20 [&>svg]:size-10 relative bg-muted/30">
                    <FileUploadItemProgress variant="circular" :size="40" class="absolute inset-0 z-10 flex items-center justify-center" />
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
        <h3 class="text-xl font-semibold">Chat Input</h3>
        <p class="text-sm text-muted-foreground">
          An overlay dropzone integrated with a textarea, common in chat interfaces.
        </p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border border-edge rounded-xl">
            <FileUpload v-model="chatFiles" :on-upload="onChatUpload" :disabled="isChatUploading" class="relative h-[300px] w-full items-center justify-center p-8 border rounded-lg bg-muted/10">
              <FileUploadDropzone class="absolute inset-0 z-0 flex size-full items-center justify-center rounded-none border-none bg-background/50 p-0 opacity-0 backdrop-blur transition-opacity duration-200 ease-out data-[dragging]:z-10 data-[dragging]:opacity-100">
                <div class="flex flex-col items-center gap-1 text-center">
                  <p class="font-medium text-sm">Drop files to upload</p>
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

                <Textarea v-model="chatInput" placeholder="Type your message..." class="min-h-10 w-full resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" :disabled="isChatUploading" />

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
        <p class="text-sm text-muted-foreground">
          Using standard native form validation.
        </p>
        <Tabs default-value="preview">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
          <TabsContent value="preview" class="flex justify-center p-10 border border-edge rounded-xl">
            <form @submit="onFormSubmit" class="w-full max-w-md space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">Attachments</label>
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
          <TabsContent value="code"><CodeBlock :code="validationCode" lang="html" /></TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>
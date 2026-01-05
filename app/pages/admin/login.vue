<script setup>
import { authClient } from '~/lib/auth-client'
import { Spinner } from '@/components/ui/spinner'
import { Lock, Mail, ArrowRight } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

onMounted(async () => {
  const { data: session } = await authClient.getSession()
  if (session) navigateTo('/admin/dashboard')
})

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  await authClient.signIn.email({
    email: email.value,
    password: password.value,
    callbackURL: "/admin/dashboard",
    fetchOptions: {
      onError: (ctx) => {
        error.value = ctx.error.message || "Invalid email or password"
        isLoading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950 text-white font-sans p-4">
    <div class="bg-gray-900 p-8 rounded-xl border border-gray-800 w-full max-w-md shadow-2xl">

      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Raya Admin
        </h1>
        <p class="text-gray-500 mt-2 text-sm">Enter your credentials to access the core.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-400 uppercase">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
                v-model="email"
                type="email"
                required
                class="w-full bg-gray-950 border border-gray-800 rounded-lg py-2.5 pl-10 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                placeholder="admin@raya-ui.com"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-400 uppercase">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
                v-model="password"
                type="password"
                required
                class="w-full bg-gray-950 border border-gray-800 rounded-lg py-2.5 pl-10 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                placeholder="••••••••••••"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span> {{ error }}
        </div>

        <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Spinner v-if="isLoading" class="text-white w-4 h-4" />
          <span v-else>Login to Dashboard</span>
          <ArrowRight v-if="!isLoading" class="w-4 h-4" />
        </button>

      </form>
    </div>
  </div>
</template>
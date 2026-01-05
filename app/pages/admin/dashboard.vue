<script setup>
import {authClient} from '~/lib/auth-client'
import {Spinner} from '@/components/ui/spinner'
import {
  LogOut,
  RefreshCcw,
  Users,
  BarChart3,
  ShieldCheck,
  Plus,
  X,
  CheckCircle2,
  ChevronDown,
  Trash2
} from 'lucide-vue-next'

// --- State ---
const user = ref(null)
const pageLoading = ref(true)
const dataLoading = ref(false)

// Add Admin State
const showAddAdmin = ref(false)
const isCreating = ref(false)
const isRemoving = ref(false)
// Default to 'admin' role
const newAdmin = reactive({
  name: '',
  email: '',
  password: '',
  role: 'admin'
})

// --- 1. Auth Check ---
onMounted(async () => {
  try {
    const session = await authClient.getSession()
    if (!session.data) return navigateTo('/admin/login')

    user.value = session.data.user
    await fetchData()
  } catch (e) {
    navigateTo('/admin/login')
  } finally {
    pageLoading.value = false
  }
})

// --- 2. Data Fetching ---
const {data: components, execute: refetchStats} = await useFetch('/api/analytics/stats', {immediate: false})
const {data: users, execute: refetchUsers} = await useFetch('/api/admin/users', {immediate: false})

const fetchData = async () => {
  dataLoading.value = true
  await Promise.all([refetchStats(), refetchUsers()])
  dataLoading.value = false
}

// --- 3. Create Admin Logic ---
const createAdmin = async () => {
  isCreating.value = true
  try {
    await $fetch('/api/admin/create', {
      method: 'POST',
      body: newAdmin
    })

    // Success: Clear form and refresh list
    showAddAdmin.value = false
    newAdmin.name = ''
    newAdmin.email = ''
    newAdmin.password = ''
    newAdmin.role = 'admin' // Reset to default
    await refetchUsers()

  } catch (e) {
    alert(e.data?.message || "Failed to create user")
  } finally {
    isCreating.value = false
  }
}

const removeUser = async (userId) => {
  if (!confirm("Are you sure? This will remove their Admin access.")) return

  isRemoving.value = true
  try {
    await $fetch('/api/admin/demote', {
      method: 'POST',
      body: {userId}
    })

    // Refresh the list to show the new badge
    await refetchUsers()
  } catch (e) {
    alert(e.data?.message || "Failed to remove user")
  } finally {
    isRemoving.value = false
  }
}

// --- Helpers ---
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div v-if="pageLoading" class="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
    <Spinner class="text-blue-500 mb-4 scale-150"/>
    <p class="text-gray-500 animate-pulse mt-4">Verifying access...</p>
  </div>

  <div v-else class="min-h-screen bg-gray-950 text-white p-6 lg:p-10 font-sans">

    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
          Raya UI Admin
        </h1>
        <div class="flex items-center gap-3 mt-3">
          <div
              class="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
            {{ user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col">
            <p class="text-gray-300 text-sm font-medium leading-none">{{ user?.name }}</p>
            <p class="text-gray-500 text-xs font-mono mt-1">
              {{ user?.email }}
              <span class="ml-2 text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 uppercase tracking-wide">{{
                  user?.role
                }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <button
            @click="authClient.signOut().then(() => navigateTo('/admin/login'))"
            class="flex-1 md:flex-none justify-center bg-gray-900 hover:bg-red-950 hover:text-red-400 text-gray-400 text-sm px-4 py-2.5 rounded-lg border border-gray-800 transition flex items-center gap-2"
        >
          <LogOut class="w-4 h-4"/>
          Logout
        </button>

        <button
            @click="fetchData"
            :disabled="dataLoading"
            class="flex-1 md:flex-none justify-center bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg shadow-blue-900/20 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Spinner v-if="dataLoading" class="text-white w-4 h-4"/>
          <RefreshCcw v-else class="w-4 h-4"/>
          <span>{{ dataLoading ? 'Updating...' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col relative h-fit">
        <div class="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center backdrop-blur-sm">
          <h2 class="font-semibold text-gray-300 flex items-center gap-2 text-sm uppercase tracking-wider">
            <BarChart3 class="w-4 h-4 text-blue-400"/>
            Component Stats
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-900/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
            <tr>
              <th class="p-4 pl-6 font-medium w-16">Rank</th>
              <th class="p-4 font-medium">Component</th>
              <th class="p-4 text-right font-medium">Downloads</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/50">
            <tr v-for="(item, index) in components" :key="item.id" class="hover:bg-gray-800/50 transition">
              <td class="p-4 pl-6 font-mono text-gray-500">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span v-else>#{{ index + 1 }}</span>
              </td>
              <td class="p-4 font-medium text-blue-300">{{ item.name }}</td>
              <td class="p-4 text-right font-bold text-gray-200">{{ item.downloads }}</td>
            </tr>
            <tr v-if="!components?.length">
              <td colspan="3" class="p-8 text-center text-gray-500 text-sm">No data available.</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>


      <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col relative h-fit">

        <div class="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center backdrop-blur-sm">
          <h2 class="font-semibold text-gray-300 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Users class="w-4 h-4 text-purple-400"/>
            Team Members
          </h2>

          <button
              v-if="user?.role == 'founder'"
              @click="showAddAdmin = !showAddAdmin"
              class="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 transition font-medium border border-purple-500/50 shadow-lg shadow-purple-900/20"
          >
            <X v-if="showAddAdmin" class="w-3.5 h-3.5"/>
            <Plus v-else class="w-3.5 h-3.5"/>
            {{ showAddAdmin ? 'Cancel' : 'Add New' }}
          </button>
        </div>

        <div v-if="showAddAdmin" class="p-5 bg-gray-800/30 border-b border-gray-800 transition-all">
          <p class="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold">New User Details</p>
          <form @submit.prevent="createAdmin" class="space-y-3">

            <div class="grid grid-cols-2 gap-3">
              <input
                  v-model="newAdmin.name"
                  placeholder="Full Name"
                  required
                  class="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600"
              />

              <div class="relative">
                <select
                    v-model="newAdmin.role"
                    class="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none appearance-none"
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none"/>
              </div>
            </div>

            <input
                v-model="newAdmin.email"
                type="email"
                placeholder="Email Address"
                required
                class="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600"
            />

            <input
                v-model="newAdmin.password"
                type="text"
                placeholder="Set Password"
                required
                class="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600"
            />

            <button
                type="submit"
                :disabled="isCreating"
                class="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase py-2.5 rounded transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <Spinner v-if="isCreating" class="w-3 h-3 text-white"/>
              <template v-else>
                <CheckCircle2 class="w-3.5 h-3.5"/>
                <span>Create User</span>
              </template>
            </button>
          </form>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-900/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
            <tr>
              <th class="p-4 pl-6 font-medium">User Profile</th>
              <th class="p-4 text-right font-medium">Role</th>
              <th v-if="user?.role === 'founder'" class="p-4 text-right pr-6 font-medium w-10">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/50">
            <tr v-for="u in users" :key="u.id" class="hover:bg-gray-800/50 transition">
              <td class="p-4 pl-6">
                <div class="flex items-center gap-3">
                  <div
                      class="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 font-bold relative">
                    {{ u.name?.charAt(0).toUpperCase() }}
                    <ShieldCheck v-if="u.role === 'founder'"
                                 class="w-3 h-3 text-yellow-500 bg-gray-900 rounded-full absolute -bottom-1 -right-1"/>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-200">{{ u.name }}</span>
                    <span class="text-xs text-gray-500 font-mono">{{ u.email }}</span>
                  </div>
                </div>
              </td>
              <td class="p-4 text-right pr-6">
                    <span
                        v-if="u.role === 'founder'"
                        class="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20 font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                    >
                        Founder
                    </span>

                <span
                    v-else-if="u.role === 'admin'"
                    class="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 font-medium"
                >
                        Admin
                    </span>

                <span
                    v-else-if="u.role === 'moderator'"
                    class="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-medium"
                >
                        Moderator
                    </span>

                <span v-else class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        {{ u.role }}
                    </span>
              </td>
              <td v-if="user?.role === 'founder'" class="p-4 text-right pr-6">
                <button
                    v-if="u.role !== 'founder'"
                    @click="removeUser(u.id)"
                    :disabled="isRemoving"
                    class="text-gray-600 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10 transition disabled:opacity-50"
                    title="Revoke Admin Access"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>
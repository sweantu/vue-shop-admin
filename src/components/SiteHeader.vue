<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
})

const handleLogout = () => {
  userStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <header class="bg-white shadow">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-gray-900">Admin</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <template v-if="userStore.isLoggedIn">
            <div class="relative group">
              <button class="flex items-center gap-2">
                <img :src="userStore.user?.avatar || '/src/assets/default-avatar.png'" alt="User avatar"
                  class="w-8 h-8 rounded-full">
                <span class="text-gray-600">{{ userStore.user?.name || 'Name' }}</span>
              </button>

              <div
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <div class="py-1">
                  <router-link to="/account"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    Account Settings
                  </router-link>
                  <router-link to="/orders"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    Orders
                  </router-link>
                  <button @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </template>
          <router-link v-else to="/auth/login" class="text-gray-600 hover:text-gray-900">Login</router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

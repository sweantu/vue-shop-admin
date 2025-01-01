<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const user = computed(() => userStore.user)

const navigation = [
  { name: 'Account Settings', href: '/account', icon: 'UserCircle' },
  { name: 'Orders', href: '/account/orders', icon: 'ShoppingBag' },
  { name: 'Transactions', href: '/account/transactions', icon: 'CreditCard' }
]

const currentPath = computed(() => route.path)
</script>


<template>
  <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar Navigation -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <nav class="space-y-1">
          <router-link v-for="item in navigation" :key="item.name" :to="item.href" :class="[
            currentPath === item.href
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
          ]">
            <span class="truncate">{{ item.name }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-white shadow rounded-lg p-6">
        <div class="flex items-center space-x-6 mb-6">
          <img :src="user?.avatar || '/src/assets/default-avatar.png'" alt="Profile" class="w-24 h-24 rounded-full">
          <div>
            <h2 class="text-xl font-semibold">{{ user?.name }}</h2>
            <p class="text-gray-600">{{ user?.username }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="border-b pb-6">
            <h3 class="text-lg font-medium mb-4">Profile Information</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" :value="user?.username"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" :value="user?.name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" :value="user?.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled>
              </div>
            </div>
          </div>

          <div class="border-b pb-6">
            <h3 class="text-lg font-medium mb-4">Security</h3>
            <button
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Change Password
            </button>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">Account Actions</h3>
            <button
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

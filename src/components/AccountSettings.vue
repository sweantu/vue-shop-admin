<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const user = computed(() => userStore.user)
</script>


<template>
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
</template>

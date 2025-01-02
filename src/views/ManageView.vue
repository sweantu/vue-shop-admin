<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navigation = [
  { name: 'Account Settings', href: '/manage/account-settings', icon: 'UserCircle' },
  { name: 'Users', href: '/manage/users', icon: 'UserCircle' },
  { name: 'Orders', href: '/manage/orders', icon: 'ShoppingBag' },
  { name: 'Transactions', href: '/manage/transactions', icon: 'CreditCard' }
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
      <main class="flex-1 bg-white shadow rounded-lg p-6 overflow-x-auto">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  UserCircleIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()

const navigation = [
  { name: 'Account Settings', href: '/manage/account-settings', icon: UserCircleIcon },
  { name: 'Users', href: '/manage/users', icon: UsersIcon },
  { name: 'Products', href: '/manage/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/manage/orders', icon: ShoppingBagIcon },
  { name: 'Transactions', href: '/manage/transactions', icon: CreditCardIcon }
]

const currentPath = computed(() => route.path)
</script>
<template>
  <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row gap-8">
      <aside class="w-full md:w-64 flex-shrink-0">
        <nav class="space-y-1">
          <router-link v-for="item in navigation" :key="item.name" :to="item.href" :class="[
            currentPath === item.href
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
          ]">
            <component :is="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span class="truncate">{{ item.name }}</span>
          </router-link>
        </nav>
      </aside>
      <RouterView class="flex-1 bg-white shadow rounded-lg p-6" />
    </div>
  </div>
</template>

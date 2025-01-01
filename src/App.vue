<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <RouterLink to="/" class="text-xl font-bold">Logo</RouterLink>
            </div>
            <div class="ml-6 flex items-center space-x-4">
              <RouterLink to="/" class="px-3 py-2 text-gray-700 hover:text-gray-900">Home</RouterLink>
              <RouterLink to="/about" class="px-3 py-2 text-gray-700 hover:text-gray-900">About</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const users = ref([])
const isLoading = ref(true)
const error = ref(null)
const pagination = ref({
  total: 0,
  page: 1,
  size: 10,
  pages: 1
})

// Filter and sort states
const filters = ref({
  role: '',
  search: ''
})

const sorting = ref({
  column: 'name',
  order: 'asc'
})

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    const queryParams = new URLSearchParams({
      page: pagination.value.page.toString(),
      size: pagination.value.size.toString(),
      sort_order: sorting.value.order,
      sort_by: sorting.value.column
    })

    if (filters.value.role) {
      queryParams.append('role', filters.value.role)
    }
    if (filters.value.search) {
      queryParams.append('search', filters.value.search)
    }

    const response = await axios.get(`http://127.0.0.1:8000/admin/users/?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    users.value = response.data.items
    pagination.value = {
      total: response.data.total,
      page: response.data.page,
      size: response.data.size,
      pages: response.data.pages
    }
  } catch (err) {
    error.value = 'Failed to fetch users'
    console.error('Error fetching users:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSort = (column) => {
  if (sorting.value.column === column) {
    sorting.value.order = sorting.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sorting.value.column = column
    sorting.value.order = 'asc'
  }
  fetchUsers()
}

const getSortIcon = (column) => {
  if (sorting.value.column !== column) return ''
  return sorting.value.order === 'asc' ? '↑' : '↓'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

watch([filters], () => {
  fetchUsers()
}, { deep: true })

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Users</h1>
        <p class="mt-2 text-sm text-gray-700">
          Showing {{ users.length }} of {{ pagination.total }} users
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
          Add user
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <select v-model="filters.role"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
        <input type="text" v-model="filters.search"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search users...">
      </div>
    </div>

    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <div v-if="isLoading" class="p-4 text-center">Loading...</div>
            <div v-else-if="error" class="p-4 text-center text-red-600">{{ error }}</div>
            <table v-else class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" @click="handleSort('name')"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100">
                    Name {{ getSortIcon('name') }}
                  </th>
                  <th scope="col" @click="handleSort('username')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    Username {{ getSortIcon('username') }}
                  </th>
                  <th scope="col" @click="handleSort('email')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    Email {{ getSortIcon('email') }}
                  </th>
                  <th scope="col" @click="handleSort('role')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    Role {{ getSortIcon('role') }}
                  </th>
                  <th scope="col" @click="handleSort('created_at')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    Created {{ getSortIcon('created_at') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="user in users" :key="user.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ user.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.username }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.email }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      :class="[user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800', 'inline-flex rounded-full px-2 text-xs font-semibold leading-5']">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      :class="[!user.deleted_at ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'inline-flex rounded-full px-2 text-xs font-semibold leading-5']">
                      {{ !user.deleted_at ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                    <button class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
      <div class="flex flex-1 justify-between sm:hidden">
        <button :disabled="!pagination.has_prev"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': !pagination.has_prev }">
          Previous
        </button>
        <button :disabled="!pagination.has_next"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': !pagination.has_next }">
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (pagination.page - 1) * pagination.size + 1 }}</span> to
            <span class="font-medium">{{ Math.min(pagination.page * pagination.size, pagination.total) }}</span> of
            <span class="font-medium">{{ pagination.total }}</span> results
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

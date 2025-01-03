<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import TablePagination from './common/TablePagination.vue'
import { userService } from '../services/userService'

const users = ref([])
const isLoading = ref(false)
const error = ref(null)

// Filter and sort states
const filters = ref({
  role: '',
  search: ''
})

const sorting = ref({
  column: 'username',
  order: 'asc'
})

const pagination = ref({
  total: 0,
  page: 1,
  size: 10,
  pages: 1
})

const fetchData = async () => {
  const params = {
    page: pagination.value.page,
    size: pagination.value.size,
    sort_order: sorting.value.order,
    sort_by: sorting.value.column,
    ...(filters.value.role && { role: filters.value.role }),
    ...(filters.value.search && { search: filters.value.search })
  }

  const { data, error } = await userService.getUsers(params)
  if (error) {
    console.error('Error fetching users:', error)
    return
  }
  if (data) {
    users.value = data.items
    pagination.value = {
      total: data.total,
      page: data.page,
      size: data.size,
      pages: data.pages
    }
  }
}

const handleSort = (column) => {
  if (sorting.value.column === column) {
    sorting.value.order = sorting.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sorting.value.column = column
    sorting.value.order = 'asc'
  }
  fetchData()
}

const handlePageChange = (newPage) => {
  pagination.value.page = newPage
  fetchData()
}

const getSortIcon = (column) => {
  if (sorting.value.column !== column) return null
  return sorting.value.order === 'asc' ? ChevronUpIcon : ChevronDownIcon
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

watch([filters], () => {
  pagination.value.page = 1 // Reset to first page when filters change
  fetchData()
}, { deep: true })

onMounted(() => {
  fetchData()
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
          <PlusIcon class="h-4 w-4 mr-2" />
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
                    <div class="flex items-center">
                      Name
                      <component :is="getSortIcon('name')" v-if="getSortIcon('name')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('username')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Username
                      <component :is="getSortIcon('username')" v-if="getSortIcon('username')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('email')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Email
                      <component :is="getSortIcon('email')" v-if="getSortIcon('email')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('role')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Role
                      <component :is="getSortIcon('role')" v-if="getSortIcon('role')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('created_at')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Created
                      <component :is="getSortIcon('created_at')" v-if="getSortIcon('created_at')"
                        class="ml-2 h-4 w-4" />
                    </div>
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
                    <button class="text-indigo-600 hover:text-indigo-900 mr-2">
                      <PencilSquareIcon class="h-4 w-4" />
                    </button>
                    <button class="text-red-600 hover:text-red-900">
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <TablePagination :total="pagination.total" :current-page="pagination.page" :page-size="pagination.size"
      :total-pages="pagination.pages" @page-change="handlePageChange" />
  </div>
</template>

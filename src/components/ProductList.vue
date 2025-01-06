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
import { productService } from '../services/productService'
import { useRouter } from 'vue-router'
import ConfirmationModal from './common/ConfirmationModal.vue'

const router = useRouter()
const products = ref([])
const isLoading = ref(false)
const error = ref(null)

// Filter and sort states
const filters = ref({
  category: '',
  status: '',
  search: ''
})

const sorting = ref({
  column: 'name',
  order: 'asc'
})

const pagination = ref({
  total: 0,
  page: 1,
  size: 10,
  pages: 1
})

const deleteModal = ref({
  show: false,
  productId: null,
  productName: ''
})

const fetchData = async () => {
  const params = {
    page: pagination.value.page,
    size: pagination.value.size,
    sort_order: sorting.value.order,
    sort_by: sorting.value.column,
    ...(filters.value.category && { category: filters.value.category }),
    ...(filters.value.status && { status: filters.value.status }),
    ...(filters.value.search && { search: filters.value.search })
  }

  const { data, error } = await productService.getProducts(params)
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  if (data) {
    products.value = data.items
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


const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

watch([filters], () => {
  pagination.value.page = 1
  fetchData()
}, { deep: true })

onMounted(() => {
  fetchData()
})

const handleEdit = (productId) => {
  router.push(`/manage/products/${productId}/edit`)
}

const handleDeleteClick = (product) => {
  deleteModal.value = {
    show: true,
    productId: product.id,
    productName: product.name
  }
}

const handleDeleteConfirm = async () => {
  try {
    const { error } = await productService.deleteProduct(deleteModal.value.productId)
    if (error) throw new Error(error)

    // Refresh the product list
    await fetchData()

    // Show success message (you might want to add a toast notification here)
    console.log('Product deleted successfully')
  } catch (err) {
    console.error('Failed to delete product:', err)
    // Show error message (you might want to add a toast notification here)
  } finally {
    // Close the modal
    deleteModal.value.show = false
  }
}

const handleDeleteCancel = () => {
  deleteModal.value.show = false
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Products</h1>
        <p class="mt-2 text-sm text-gray-700">
          Showing {{ products.length }} of {{ pagination.total }} products
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button type="button" @click="router.push('/manage/products/add')"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
          <PlusIcon class="h-4 w-4 mr-2" />
          Add product
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <select v-model="filters.category"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="filters.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
        <input type="text" v-model="filters.search"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search products...">
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
                  <th scope="col" @click="handleSort('sku')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      SKU
                      <component :is="getSortIcon('sku')" v-if="getSortIcon('sku')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('price')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Price
                      <component :is="getSortIcon('price')" v-if="getSortIcon('price')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('stock')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Stock
                      <component :is="getSortIcon('stock')" v-if="getSortIcon('stock')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('category')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Category
                      <component :is="getSortIcon('category')" v-if="getSortIcon('category')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('status')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Status
                      <component :is="getSortIcon('status')" v-if="getSortIcon('status')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="product in products" :key="product.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ product.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ product.sku }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatPrice(product.price) }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ product.stock }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-gray-100 text-gray-800">
                      {{ product.category }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      product.status === 'published' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ product.status }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button @click="handleEdit(product.id)" class="text-indigo-600 hover:text-indigo-900 mr-2">
                      <PencilSquareIcon class="h-4 w-4" />
                    </button>
                    <button @click="handleDeleteClick(product)" class="text-red-600 hover:text-red-900">
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

    <!-- Add the confirmation modal -->
    <ConfirmationModal :show="deleteModal.show" title="Delete Product"
      :message="`Are you sure you want to delete '${deleteModal.productName}'? This action cannot be undone.`"
      @confirm="handleDeleteConfirm" @cancel="handleDeleteCancel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productService } from '../services/productService'
import UploadImages from './common/UploadImages.vue'

const router = useRouter()
const route = useRoute()
const isSubmitting = ref(false)
const error = ref(null)
const tagInput = ref('')
const isEditMode = ref(false)

const product = ref({
  name: '',
  description: '',
  price: '',
  stock: 0,
  sku: '',
  category: '',
  tags: [],
  status: 'draft',
  images: []
})

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'books', name: 'Books' },
  { id: 'accessories', name: 'Accessories' },
]

const statuses = [
  { id: 'draft', name: 'Draft' },
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
]

const uploadImagesRef = ref(null)

const addTag = () => {
  if (tagInput.value.trim()) {
    product.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  product.value.tags.splice(index, 1)
}

const validateForm = () => {
  const errors = []
  if (!product.value.name || product.value.name.length > 200) {
    errors.push('Name is required and must be less than 200 characters')
  }
  if (!product.value.description) {
    errors.push('Description is required')
  }
  if (!product.value.price || isNaN(product.value.price) || product.value.price < 0) {
    errors.push('Price must be a valid positive number')
  }
  if (!product.value.stock || isNaN(product.value.stock) || product.value.stock < 0) {
    errors.push('Stock must be a valid positive number')
  }
  if (!product.value.sku || product.value.sku.length < 3 || product.value.sku.length > 50) {
    errors.push('SKU must be between 3 and 50 characters')
  }
  if (!product.value.category) {
    errors.push('Category is required')
  }
  return errors
}

const loadProduct = async (id) => {
  try {
    const { data, error: apiError } = await productService.getProduct(id)
    if (apiError) throw new Error(apiError)

    product.value = {
      ...data,
      price: data.price.toString(), // Convert to string for input field
    }
  } catch (err) {
    error.value = 'Failed to load product'
    console.error(err)
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    error.value = null

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      error.value = validationErrors.join('. ')
      return
    }

    // Upload new images first
    const uploadedImageUrls = await uploadImagesRef.value.uploadImages()

    const formData = {
      ...product.value,
      price: parseFloat(product.value.price),
      stock: parseInt(product.value.stock),
      images: [
        ...product.value.images, // Keep existing images
        ...uploadedImageUrls // Add new uploaded images
      ]
    }

    const { error: apiError } = isEditMode.value
      ? await productService.updateProduct(route.params.id, formData)
      : await productService.createProduct(formData)

    if (apiError) throw new Error(apiError)

    router.push('/manage/products')
  } catch (err) {
    error.value = err.message || `Failed to ${isEditMode.value ? 'update' : 'create'} product`
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/manage/products')
}

onMounted(async () => {
  if (route.params.id) {
    isEditMode.value = true
    await loadProduct(route.params.id)
  }
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <form @submit.prevent="handleSubmit" class="space-y-8 divide-y divide-gray-200">
      <div class="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ isEditMode ? `Update the product information below.` : `Fill in the information below to create a new
              product.` }}
            </p>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="mt-4 bg-red-50 p-4 rounded-md">
            <div class="text-sm text-red-700">{{ error }}</div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Name -->
            <div class="sm:col-span-4">
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <div class="mt-1">
                <input type="text" v-model="product.name" id="name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required maxlength="200">
              </div>
            </div>

            <!-- SKU -->
            <div class="sm:col-span-2">
              <label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
              <div class="mt-1">
                <input type="text" v-model="product.sku" id="sku"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required minlength="3" maxlength="50">
              </div>
            </div>

            <!-- Description -->
            <div class="sm:col-span-6">
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <div class="mt-1">
                <textarea v-model="product.description" id="description" rows="3"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required></textarea>
              </div>
            </div>

            <!-- Price -->
            <div class="sm:col-span-2">
              <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
              <div class="mt-1">
                <input type="number" v-model="product.price" id="price" step="0.01" min="0"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required>
              </div>
            </div>

            <!-- Stock -->
            <div class="sm:col-span-2">
              <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
              <div class="mt-1">
                <input type="number" v-model="product.stock" id="stock" min="0"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required>
              </div>
            </div>

            <!-- Category -->
            <div class="sm:col-span-2">
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <div class="mt-1">
                <select v-model="product.category" id="category"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required>
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Status -->
            <div class="sm:col-span-2">
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <div class="mt-1">
                <select v-model="product.status" id="status"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option v-for="status in statuses" :key="status.id" :value="status.id">
                    {{ status.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Tags -->
            <div class="sm:col-span-6">
              <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
              <div class="mt-1">
                <div class="flex gap-2 mb-2">
                  <input type="text" v-model="tagInput" id="tags"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Add a tag" @keyup.enter="addTag">
                  <button type="button" @click="addTag"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(tag, index) in product.tags" :key="index"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {{ tag }}
                    <button type="button" @click="removeTag(index)"
                      class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500">
                      <span class="sr-only">Remove tag</span>
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Product Images -->
            <div class="sm:col-span-6">
              <UploadImages ref="uploadImagesRef" v-model:existingImages="product.images" @error="error = $event" />
            </div>
          </div>
        </div>
      </div>

      <div class="pt-5">
        <div class="flex justify-end gap-3">
          <button type="button" @click="handleCancel"
            class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Cancel
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :class="{ 'opacity-75 cursor-not-allowed': isSubmitting }">
            {{ isSubmitting ? (isEditMode ? `Updating...` : `Creating...`) : (isEditMode ? `Update Product` : `Create
            Product`) }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

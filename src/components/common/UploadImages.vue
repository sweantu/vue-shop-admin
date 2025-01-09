<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { uploadService } from '@/services/uploadService'
import {
  PhotoIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  existingImages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:existingImages', 'error'])

const newImages = ref([])
const isUploading = ref(false)

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      newImages.value.push({
        url: e.target.result,
        file: file,
        uploading: false
      })
    }
    reader.readAsDataURL(file)
  })
}

const removePreview = (index) => {
  newImages.value.splice(index, 1)
}

const removeExisting = (index) => {
  const updatedImages = [...props.existingImages]
  updatedImages.splice(index, 1)
  emit('update:existingImages', updatedImages)
}

const uploadImages = async () => {
  if (newImages.value.length === 0) return []

  const formData = new FormData()
  newImages.value.forEach(image => {
    if (image.url.startsWith('data:')) {
      formData.append('files', image.file)
    }
  })

  try {
    isUploading.value = true
    const { data, error } = await uploadService.uploadImages(formData)

    if (error) throw new Error(error)

    // Clear previews after successful upload
    newImages.value = []

    return data
  } catch (err) {
    emit('error', err.message || 'Failed to upload images')
    return []
  } finally {
    isUploading.value = false
  }
}

// Expose uploadImages method to parent
defineExpose({ uploadImages })
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">Product Images</label>
    <div class="mt-1 flex flex-col space-y-4">
      <!-- Image Upload Input -->
      <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div class="space-y-1 text-center">
          <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <label for="file-upload"
              class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>Upload files</span>
              <input id="file-upload" type="file" class="sr-only" multiple accept="image/*" @change="handleImageSelect">
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      <!-- Image Previews -->
      <div v-if="newImages.length > 0 || existingImages.length > 0"
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <!-- Existing Images -->
        <div v-for="(image, index) in existingImages" :key="`existing-${index}`"
          class="relative group aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
          <img :src="image" class="object-cover" />
          <button type="button" @click="removeExisting(index)"
            class="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- New Image Previews -->
        <div v-for="(preview, index) in newImages" :key="`preview-${index}`"
          class="relative group aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
          <img :src="preview.url" class="object-cover" />
          <button type="button" @click="removePreview(index)"
            class="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

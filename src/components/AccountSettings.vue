<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useUserStore } from '../stores/user'
import { userService } from '../services/userService'
import { uploadService } from '../services/uploadService'
import { PhotoIcon, PencilIcon } from '@heroicons/vue/24/solid'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const isUpdatingName = ref(false)
const isUpdatingAvatar = ref(false)
const error = ref(null)
const success = ref(null)
const nameInput = ref('')
const avatarFile = ref(null)
const avatarPreview = ref(null)
const isEditing = ref(false)
const nameInputRef = ref(null)

// Initialize name input with current value
nameInput.value = user.value?.name || ''

const handleAvatarSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarFile.value = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleUpdateAvatar = async () => {
  try {
    if (!avatarFile.value) return

    isUpdatingAvatar.value = true
    error.value = null
    success.value = null

    // Upload new avatar
    const formData = new FormData()
    formData.append('files', avatarFile.value)
    const { data, error: uploadError } = await uploadService.uploadImages(formData)
    if (uploadError) throw new Error(uploadError)

    // Update profile with new avatar
    const { error: updateError } = await userService.updateProfile({
      avatar: data[0]
    })
    if (updateError) throw new Error(updateError)

    // Update store
    await userStore.fetchUser()
    success.value = 'Avatar updated successfully'

    // Clear file input and preview
    avatarFile.value = null
    avatarPreview.value = null
  } catch (err) {
    error.value = err.message || 'Failed to update avatar'
  } finally {
    isUpdatingAvatar.value = false
  }
}

// Focus input when editing starts
watch(isEditing, (newValue) => {
  if (newValue) {
    nextTick(() => {
      nameInputRef.value?.focus()
    })
  }
})

const cancelEdit = () => {
  nameInput.value = user.value?.name || '' // Reset to current name
  isEditing.value = false
}

const handleUpdateName = async () => {
  try {
    if (!nameInput.value?.trim() || nameInput.value === user.value?.name) {
      cancelEdit()
      return
    }

    isUpdatingName.value = true
    error.value = null
    success.value = null

    const { error: updateError } = await userService.updateProfile({
      name: nameInput.value.trim()
    })

    if (updateError) throw new Error(updateError)

    // Update store
    await userStore.fetchUser()
    success.value = 'Name updated successfully'
    isEditing.value = false
  } catch (err) {
    error.value = err.message || 'Failed to update name'
    nameInput.value = user.value?.name || '' // Reset on error
  } finally {
    isUpdatingName.value = false
  }
}
</script>
<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Profile Header -->
    <div class="flex items-center space-x-6 mb-6">
      <div class="relative">
        <img :src="avatarPreview || user?.avatar || '/src/assets/default-avatar.png'" alt="Profile"
          class="w-24 h-24 rounded-full object-cover">
        <label class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
          for="avatar-upload">
          <PhotoIcon class="h-5 w-5 text-gray-600" />
          <input id="avatar-upload" type="file" class="sr-only" accept="image/*" @change="handleAvatarSelect">
        </label>
      </div>
      <div class="flex flex-col space-y-2">
        <div>
          <h2 class="text-xl font-semibold">{{ user?.name || user?.username }}</h2>
          <p class="text-gray-600">{{ user?.username }}</p>
        </div>
        <button v-if="avatarFile" type="button" @click="handleUpdateAvatar" :disabled="isUpdatingAvatar"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1 px-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :class="{ 'opacity-75 cursor-not-allowed': isUpdatingAvatar }">
          {{ isUpdatingAvatar ? 'Updating Avatar...' : 'Update Avatar' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Profile Information -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-medium mb-4">Profile Information</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Username (Read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" :value="user?.username"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled>
          </div>

          <!-- Name (Editable) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <div class="mt-1 relative group">
              <div v-if="!isEditing"
                class="flex items-center justify-between w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <span class="text-gray-900">{{ user?.name || '' }}</span>
                <button type="button" @click="isEditing = true"
                  class="invisible group-hover:visible text-gray-400 hover:text-gray-500">
                  <PencilIcon class="h-5 w-5" />
                </button>
              </div>

              <input v-else type="text" v-model="nameInput" placeholder="Enter your name"
                @keyup.enter="handleUpdateName" @keyup.esc="cancelEdit" @blur="cancelEdit" ref="nameInputRef"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                :disabled="isUpdatingName">
            </div>
          </div>

          <!-- Email (Read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" :value="user?.email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled>
          </div>
        </div>
      </div>

      <!-- Security Section -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-medium mb-4">Security</h3>
        <button
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Change Password
        </button>
      </div>

      <!-- Account Actions -->
      <div>
        <h3 class="text-lg font-medium mb-4">Account Actions</h3>
        <button
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          Delete Account
        </button>
      </div>

      <!-- Error/Success Messages -->
      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
      <div v-if="success" class="text-green-600 text-sm">{{ success }}</div>
    </div>
  </div>
</template>

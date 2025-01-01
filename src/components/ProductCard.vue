<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="group relative">
    <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
      <img :src="product.image" :alt="product.name"
        class="h-full w-full object-cover object-center lg:h-full lg:w-full">
    </div>
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-sm text-gray-700">
          <span>{{ product.name }}</span>
        </h3>
        <p class="mt-1 text-sm text-gray-500">{{ product.description }}</p>
      </div>
      <p class="text-sm font-medium text-gray-900">${{ product.price }}</p>
    </div>
    <button class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
      Add to Cart
    </button>
  </div>
</template>

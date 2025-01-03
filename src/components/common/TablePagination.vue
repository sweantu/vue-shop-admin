<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

defineEmits(['page-change'])

const getPageNumbers = () => {
  const current = props.currentPage
  const total = props.totalPages
  const delta = 2

  let pages = []

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
}

const currentRange = computed(() => ({
  start: (props.currentPage - 1) * props.pageSize + 1,
  end: Math.min(props.currentPage * props.pageSize, props.total)
}))
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
    <div class="flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ currentRange.start }}</span> to
          <span class="font-medium">{{ currentRange.end }}</span> of
          <span class="font-medium">{{ total }}</span> results
        </p>
      </div>
      <div v-if="totalPages > 1">
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <template v-for="pageNum in getPageNumbers()" :key="pageNum">
            <!-- Ellipsis -->
            <span v-if="pageNum === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              ...
            </span>
            <!-- Page numbers -->
            <button v-else @click="$emit('page-change', pageNum)" :class="[
              pageNum === currentPage
                ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20'
            ]">
              {{ pageNum }}
            </button>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>

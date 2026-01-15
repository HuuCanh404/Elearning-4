<script setup>
/**
 * ===========================================
 * BASE PAGINATION COMPONENT
 * Component phân trang dùng chung
 * ===========================================
 */
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisible: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])

const pages = computed(() => {
  const range = []
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisible / 2))
  const end = Math.min(props.totalPages, start + props.maxVisible - 1)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
})

const hasPrev = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<template>
  <nav class="flex items-center justify-center space-x-2">
    <!-- Previous -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="!hasPrev"
      class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- First Page -->
    <button
      v-if="pages[0] > 1"
      @click="goToPage(1)"
      class="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
    >
      1
    </button>

    <!-- Ellipsis -->
    <span v-if="pages[0] > 2" class="text-slate-400">...</span>

    <!-- Page Numbers -->
    <button
      v-for="page in pages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'w-10 h-10 rounded-lg font-medium transition-all',
        page === currentPage
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
      ]"
    >
      {{ page }}
    </button>

    <!-- Ellipsis -->
    <span v-if="pages[pages.length - 1] < totalPages - 1" class="text-slate-400">...</span>

    <!-- Last Page -->
    <button
      v-if="pages[pages.length - 1] < totalPages"
      @click="goToPage(totalPages)"
      class="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
    >
      {{ totalPages }}
    </button>

    <!-- Next -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="!hasNext"
      class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
</template>

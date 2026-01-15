<script setup>
/**
 * ===========================================
 * BLOG LIST VIEW
 * Danh sách bài viết (Public)
 * ===========================================
 */
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import BlogCard from '@/components/ui/BlogCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BasePagination from '@/components/ui/BasePagination.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const searchQuery = ref(route.query.search || '')
const sortBy = ref('created_at')
const sortOrder = ref('desc')

const sortOptions = [
  { value: 'created_at-desc', label: 'Mới nhất' },
  { value: 'created_at-asc', label: 'Cũ nhất' },
  { value: 'title-asc', label: 'Tiêu đề A-Z' },
  { value: 'title-desc', label: 'Tiêu đề Z-A' },
  { value: 'views-desc', label: 'Xem nhiều nhất' }
]

onMounted(async () => {
  if (route.query.search) {
    await blogStore.searchBlogs(route.query.search)
  } else {
    await blogStore.fetchBlogs()
  }
})

watch(() => route.query.search, async (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch
    await blogStore.searchBlogs(newSearch)
  }
})

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    router.push({ query: { search: searchQuery.value } })
    await blogStore.searchBlogs(searchQuery.value)
  } else {
    router.push({ query: {} })
    await blogStore.fetchBlogs()
  }
}

const handleSort = async (value) => {
  const [sort, order] = value.split('-')
  sortBy.value = sort
  sortOrder.value = order
  await blogStore.sortBlogs(sort, order)
}

const handlePageChange = async (page) => {
  await blogStore.goToPage(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearSearch = async () => {
  searchQuery.value = ''
  router.push({ query: {} })
  await blogStore.fetchBlogs()
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-800 mb-2">Tất cả bài viết</h1>
      <p class="text-slate-500">Khám phá các bài viết mới nhất từ cộng đồng</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-slate-100">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <form @submit.prevent="handleSearch">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Tìm kiếm bài viết..."
              class="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-transparent focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button 
              v-if="searchQuery"
              type="button"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>

        <!-- Sort -->
        <div class="flex items-center space-x-4">
          <span class="text-slate-500 text-sm">Sắp xếp:</span>
          <select 
            :value="`${sortBy}-${sortOrder}`"
            @change="handleSort($event.target.value)"
            class="px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Active Search -->
      <div v-if="route.query.search" class="mt-4 flex items-center space-x-2">
        <span class="text-sm text-slate-500">Kết quả tìm kiếm cho:</span>
        <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          "{{ route.query.search }}"
        </span>
        <button @click="clearSearch" class="text-slate-400 hover:text-slate-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-slate-500">
        <span class="font-semibold text-slate-800">{{ blogStore.totalBlogs }}</span> bài viết
      </p>
    </div>

    <!-- Loading -->
    <div v-if="blogStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-2xl p-4 animate-pulse">
        <div class="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
        <div class="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-slate-200 rounded w-full mb-4"></div>
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-slate-200 rounded-full"></div>
          <div class="h-4 bg-slate-200 rounded w-24"></div>
        </div>
      </div>
    </div>

    <!-- Blog Grid -->
    <div v-else-if="blogStore.blogs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogCard 
        v-for="blog in blogStore.blogs" 
        :key="blog.id" 
        :blog="blog"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl">
      <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
      </svg>
      <h3 class="text-lg font-semibold text-slate-800 mb-2">Không tìm thấy bài viết</h3>
      <p class="text-slate-500 mb-6">Thử tìm kiếm với từ khóa khác hoặc xem tất cả bài viết</p>
      <BaseButton @click="clearSearch">Xem tất cả</BaseButton>
    </div>

    <!-- Pagination -->
    <BasePagination 
      v-if="blogStore.totalPages > 1"
      :current-page="blogStore.currentPage"
      :total-pages="blogStore.totalPages"
      class="mt-8"
      @page-change="handlePageChange"
    />
  </div>
</template>

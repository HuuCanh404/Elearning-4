<script setup>
/**
 * ===========================================
 * MY BLOGS VIEW
 * Bài viết của tôi (Private)
 * ===========================================
 */
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import BaseButton from '@/components/ui/BaseButton.vue'
import BasePagination from '@/components/ui/BasePagination.vue'

const router = useRouter()
const blogStore = useBlogStore()

const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'Tất cả' },
  { id: 'published', label: 'Đã xuất bản' },
  { id: 'draft', label: 'Nháp' },
  { id: 'archived', label: 'Lưu trữ' }
]

const filteredBlogs = computed(() => {
  if (activeTab.value === 'all') return blogStore.myBlogs
  return blogStore.myBlogs.filter(blog => blog.status === activeTab.value)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusBadge = (status) => {
  const badges = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-slate-100 text-slate-700'
  }
  return badges[status] || badges.draft
}

const getStatusText = (status) => {
  const texts = {
    published: 'Đã xuất bản',
    draft: 'Nháp',
    archived: 'Lưu trữ'
  }
  return texts[status] || 'Nháp'
}

onMounted(async () => {
  await blogStore.fetchMyBlogs()
})

const handleEdit = (blog) => {
  router.push({ name: 'BlogEdit', params: { id: blog.id } })
}

const handleView = (blog) => {
  router.push({ name: 'BlogDetail', params: { id: blog.id } })
}

const handleDelete = async (blog) => {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
    await blogStore.deleteBlog(blog.id)
    await blogStore.fetchMyBlogs()
  }
}

const handlePageChange = async (page) => {
  blogStore.query.page = page
  await blogStore.fetchMyBlogs()
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Bài viết của tôi</h1>
        <p class="text-slate-500 mt-1">Quản lý tất cả bài viết của bạn</p>
      </div>
      <router-link to="/blogs/create">
        <BaseButton>
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Viết bài mới
        </BaseButton>
      </router-link>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-1 bg-slate-100 rounded-xl p-1 mb-6 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
          activeTab === tab.id 
            ? 'bg-white text-indigo-600 shadow-sm' 
            : 'text-slate-600 hover:text-slate-800'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="blogStore.isLoading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-6 animate-pulse">
        <div class="flex items-start space-x-4">
          <div class="w-20 h-20 bg-slate-200 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div class="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog List -->
    <div v-else-if="filteredBlogs.length" class="space-y-4">
      <div 
        v-for="blog in filteredBlogs" 
        :key="blog.id"
        class="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">
          <!-- Thumbnail -->
          <div class="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img 
              v-if="blog.thumbnail"
              :src="blog.thumbnail" 
              :alt="blog.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(blog.status)]">
                {{ getStatusText(blog.status) }}
              </span>
              <span class="text-slate-400 text-sm">{{ formatDate(blog.created_at) }}</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 mb-1 truncate">
              {{ blog.title }}
            </h3>
            <p class="text-slate-500 text-sm line-clamp-2">
              {{ blog.excerpt || 'Chưa có mô tả' }}
            </p>
            <div class="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ blog.views || 0 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex sm:flex-col gap-2">
            <BaseButton variant="outline" size="sm" @click="handleView(blog)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </BaseButton>
            <BaseButton variant="outline" size="sm" @click="handleEdit(blog)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </BaseButton>
            <BaseButton variant="danger" size="sm" @click="handleDelete(blog)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl">
      <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
      </svg>
      <h3 class="text-lg font-semibold text-slate-800 mb-2">Chưa có bài viết nào</h3>
      <p class="text-slate-500 mb-6">Bắt đầu viết bài viết đầu tiên của bạn ngay!</p>
      <router-link to="/blogs/create">
        <BaseButton>
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Viết bài mới
        </BaseButton>
      </router-link>
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

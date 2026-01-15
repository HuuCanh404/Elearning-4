<script setup>
/**
 * ===========================================
 * BLOG DETAIL VIEW
 * Chi tiết bài viết (Public - View)
 * ===========================================
 */
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import { useAuthStore } from '@/store/auth'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const blog = ref(null)

// Kiểm tra quyền: Owner HOẶC Admin
const canEdit = computed(() => {
  if (!authStore.isAuthenticated) return false
  // Admin có thể sửa/xóa tất cả bài viết
  if (authStore.isAdmin) return true
  // Owner có thể sửa/xóa bài viết của mình
  return authStore.user?.id === blog.value?.author?.id
})

const isOwner = computed(() => {
  return authStore.user?.id === blog.value?.author?.id
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  const result = await blogStore.fetchBlogById(route.params.id)
  if (result.success) {
    blog.value = result.data
  }
  isLoading.value = false
})

const handleEdit = () => {
  router.push({ name: 'BlogEdit', params: { id: blog.value.id } })
}

const handleDelete = async () => {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
    const result = await blogStore.deleteBlog(blog.value.id)
    if (result.success) {
      router.push({ name: 'BlogList' })
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4 animate-pulse">
      <div class="h-8 bg-slate-200 rounded w-3/4"></div>
      <div class="h-4 bg-slate-200 rounded w-1/4"></div>
      <div class="h-96 bg-slate-200 rounded-2xl"></div>
      <div class="space-y-2">
        <div class="h-4 bg-slate-200 rounded"></div>
        <div class="h-4 bg-slate-200 rounded"></div>
        <div class="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    </div>

    <!-- Blog Content -->
    <article v-else-if="blog" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      <!-- Thumbnail -->
      <div v-if="blog.thumbnail" class="relative h-64 md:h-96">
        <img 
          :src="blog.thumbnail" 
          :alt="blog.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div class="p-6 md:p-10">
        <!-- Category & Date -->
        <div class="flex items-center space-x-4 text-sm mb-4">
          <span 
            v-if="blog.category"
            class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium"
          >
            {{ blog.category.name }}
          </span>
          <span class="text-slate-500">{{ formatDate(blog.created_at) }}</span>
          <span class="text-slate-300">•</span>
          <span class="text-slate-500">{{ blog.views || 0 }} lượt xem</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
          {{ blog.title }}
        </h1>

        <!-- Author -->
        <div class="flex items-center justify-between py-6 border-y border-slate-100 mb-8">
          <div class="flex items-center space-x-4">
            <img 
              :src="blog.author?.avatar || '/default-avatar.png'" 
              :alt="blog.author?.name"
              class="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <p class="font-semibold text-slate-800">{{ blog.author?.name }}</p>
              <p class="text-sm text-slate-500">Tác giả</p>
            </div>
          </div>

          <!-- Actions - Admin hoặc Owner mới có quyền -->
          <div v-if="canEdit" class="flex items-center space-x-2">
            <BaseButton variant="outline" size="sm" @click="handleEdit">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Sửa
            </BaseButton>
            <BaseButton variant="danger" size="sm" @click="handleDelete">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa
            </BaseButton>
          </div>
        </div>

        <!-- Content -->
        <div 
          class="prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-indigo-600 prose-img:rounded-xl"
          v-html="blog.content"
        ></div>

        <!-- Tags -->
        <div v-if="blog.tags?.length" class="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-100">
          <span 
            v-for="tag in blog.tags" 
            :key="tag"
            class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 transition-colors cursor-pointer"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </article>

    <!-- Not Found -->
    <div v-else class="text-center py-16 bg-white rounded-2xl">
      <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-slate-800 mb-2">Không tìm thấy bài viết</h3>
      <p class="text-slate-500 mb-6">Bài viết có thể đã bị xóa hoặc không tồn tại</p>
      <router-link to="/blogs">
        <BaseButton>Xem bài viết khác</BaseButton>
      </router-link>
    </div>

    <!-- Back Button -->
    <div class="mt-8">
      <router-link to="/blogs">
        <BaseButton variant="outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách
        </BaseButton>
      </router-link>
    </div>
  </div>
</template>

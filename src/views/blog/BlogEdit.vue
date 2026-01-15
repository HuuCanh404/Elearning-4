<script setup>
/**
 * ===========================================
 * BLOG EDIT VIEW
 * Chỉnh sửa bài viết (Private)
 * ===========================================
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import { useAuthStore } from '@/store/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import ImageUpload from '@/components/ui/ImageUpload.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const form = ref({
  title: '',
  content: '',
  excerpt: '',
  thumbnail: '',
  category_id: '',
  tags: '',
  status: 'draft'
})

const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  const result = await blogStore.fetchBlogById(route.params.id)
  if (result.success) {
    const blog = result.data
    
    // Kiểm tra quyền: Chỉ Owner hoặc Admin mới được sửa
    const isOwner = authStore.user?.id === blog.author?.id
    const isAdmin = authStore.isAdmin
    
    if (!isOwner && !isAdmin) {
      errorMessage.value = 'Bạn không có quyền chỉnh sửa bài viết này'
      isLoading.value = false
      // Redirect sau 2 giây
      setTimeout(() => {
        router.push({ name: 'BlogDetail', params: { id: route.params.id } })
      }, 2000)
      return
    }
    
    form.value = {
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      thumbnail: blog.thumbnail || '',
      category_id: blog.category_id || '',
      tags: blog.tags?.join(', ') || '',
      status: blog.status || 'draft'
    }
  } else {
    errorMessage.value = 'Không tìm thấy bài viết'
  }
  isLoading.value = false
})

const handleImageUpload = (url) => {
  form.value.thumbnail = url
}

const handleSubmit = async (status = null) => {
  errors.value = {}
  errorMessage.value = ''
  successMessage.value = ''

  const blogData = {
    ...form.value,
    status: status || form.value.status,
    tags: form.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
  }

  const result = await blogStore.updateBlog(route.params.id, blogData)

  if (result.success) {
    successMessage.value = 'Cập nhật bài viết thành công!'
    setTimeout(() => {
      router.push({ name: 'BlogDetail', params: { id: route.params.id } })
    }, 1500)
  } else {
    errorMessage.value = result.message
    errors.value = result.errors || {}
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Chỉnh sửa bài viết</h1>
        <p class="text-slate-500 mt-1">Cập nhật nội dung bài viết của bạn</p>
      </div>
      <router-link :to="{ name: 'BlogDetail', params: { id: route.params.id } }">
        <BaseButton variant="outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </BaseButton>
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-2xl p-8 animate-pulse">
      <div class="h-64 bg-slate-200 rounded-xl mb-6"></div>
      <div class="h-10 bg-slate-200 rounded mb-4"></div>
      <div class="h-24 bg-slate-200 rounded mb-4"></div>
      <div class="h-64 bg-slate-200 rounded"></div>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <BaseAlert v-if="errorMessage" type="error" class="mb-6">
        {{ errorMessage }}
      </BaseAlert>

      <BaseAlert v-if="successMessage" type="success" class="mb-6">
        {{ successMessage }}
      </BaseAlert>

      <form @submit.prevent="handleSubmit()" class="space-y-6">
        <!-- Thumbnail -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Ảnh bìa</label>
          <ImageUpload 
            v-model="form.thumbnail"
            @uploaded="handleImageUpload"
          />
        </div>

        <!-- Title -->
        <BaseInput
          v-model="form.title"
          label="Tiêu đề"
          placeholder="Nhập tiêu đề bài viết"
          :error="errors.title"
          required
        />

        <!-- Excerpt -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Mô tả ngắn</label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
            placeholder="Viết mô tả ngắn về bài viết..."
          ></textarea>
          <p v-if="errors.excerpt" class="text-red-500 text-sm mt-1">{{ errors.excerpt[0] }}</p>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Nội dung <span class="text-red-500">*</span></label>
          <textarea
            v-model="form.content"
            rows="15"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none font-mono text-sm"
            placeholder="Viết nội dung bài viết... (Hỗ trợ HTML)"
            required
          ></textarea>
          <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content[0] }}</p>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
          <select 
            v-model="form.category_id"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer"
          >
            <option value="">Chọn danh mục</option>
            <option value="1">Lập trình</option>
            <option value="2">Công nghệ</option>
            <option value="3">Lifestyle</option>
            <option value="4">Học tập</option>
          </select>
        </div>

        <!-- Tags -->
        <BaseInput
          v-model="form.tags"
          label="Tags"
          placeholder="vue, javascript, web (phân cách bằng dấu phẩy)"
          :error="errors.tags"
        />

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="form.status" 
                value="draft"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-slate-700">Nháp</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="form.status" 
                value="published"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-slate-700">Xuất bản</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="form.status" 
                value="archived"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-slate-700">Lưu trữ</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end pt-6 border-t border-slate-100 space-x-3">
          <BaseButton 
            type="submit"
            :loading="blogStore.isLoading"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Lưu thay đổi
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/**
 * ===========================================
 * BLOG CREATE VIEW
 * Tạo bài viết mới (Private)
 * ===========================================
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import ImageUpload from '@/components/ui/ImageUpload.vue'

const router = useRouter()
const blogStore = useBlogStore()

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

const handleImageUpload = (url) => {
  form.value.thumbnail = url
}

const handleSubmit = async (status = 'draft') => {
  errors.value = {}
  errorMessage.value = ''
  successMessage.value = ''

  const blogData = {
    ...form.value,
    status,
    tags: form.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
  }

  const result = await blogStore.createBlog(blogData)

  if (result.success) {
    successMessage.value = 'Tạo bài viết thành công!'
    setTimeout(() => {
      router.push({ name: 'BlogDetail', params: { id: result.data.id } })
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
        <h1 class="text-3xl font-bold text-slate-800">Tạo bài viết mới</h1>
        <p class="text-slate-500 mt-1">Chia sẻ kiến thức của bạn với cộng đồng</p>
      </div>
      <router-link to="/my-blogs">
        <BaseButton variant="outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </BaseButton>
      </router-link>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <BaseAlert v-if="errorMessage" type="error" class="mb-6">
        {{ errorMessage }}
      </BaseAlert>

      <BaseAlert v-if="successMessage" type="success" class="mb-6">
        {{ successMessage }}
      </BaseAlert>

      <form @submit.prevent="handleSubmit('draft')" class="space-y-6">
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

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-slate-100">
          <p class="text-sm text-slate-500">
            <span class="text-red-500">*</span> Trường bắt buộc
          </p>
          <div class="flex items-center space-x-3">
            <BaseButton 
              type="button" 
              variant="outline"
              :loading="blogStore.isLoading"
              @click="handleSubmit('draft')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Lưu nháp
            </BaseButton>
            <BaseButton 
              type="button"
              :loading="blogStore.isLoading"
              @click="handleSubmit('published')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Xuất bản
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

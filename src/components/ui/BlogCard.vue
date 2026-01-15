<script setup>
/**
 * ===========================================
 * BLOG CARD COMPONENT
 * Card hiển thị bài viết
 * ===========================================
 */
import { computed } from 'vue'

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const excerpt = computed(() => {
  if (props.blog.excerpt) return props.blog.excerpt
  if (props.blog.content) {
    const text = props.blog.content.replace(/<[^>]*>/g, '')
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }
  return ''
})
</script>

<template>
  <router-link 
    :to="{ name: 'BlogDetail', params: { id: blog.id } }"
    class="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
  >
    <!-- Thumbnail -->
    <div class="relative h-48 overflow-hidden bg-slate-100">
      <img 
        v-if="blog.thumbnail"
        :src="blog.thumbnail" 
        :alt="blog.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Category Badge -->
      <div v-if="blog.category" class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-medium rounded-full shadow-sm">
          {{ blog.category.name }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Date & Views -->
      <div class="flex items-center text-sm text-slate-500 mb-3">
        <span>{{ formatDate(blog.created_at) }}</span>
        <span class="mx-2">•</span>
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ blog.views || 0 }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
        {{ blog.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-slate-500 text-sm line-clamp-2 mb-4">
        {{ excerpt }}
      </p>

      <!-- Author -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-100">
        <div class="flex items-center space-x-3">
          <img 
            :src="blog.author?.avatar || '/default-avatar.png'" 
            :alt="blog.author?.name"
            class="w-8 h-8 rounded-lg object-cover"
          />
          <span class="text-sm font-medium text-slate-700">{{ blog.author?.name || 'Anonymous' }}</span>
        </div>

        <!-- Read More -->
        <span class="text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
          Đọc thêm
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>

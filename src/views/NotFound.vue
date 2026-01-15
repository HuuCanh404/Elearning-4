<script setup>
/**
 * ===========================================
 * NOT FOUND VIEW
 * Trang 404
 * ===========================================
 */
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <div class="text-9xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
        404
      </div>
      <h1 class="text-2xl font-bold text-slate-800 mb-4">Oops! Trang không tồn tại</h1>
      <p class="text-slate-500 mb-8 max-w-md mx-auto">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
      </p>
      <router-link to="/">
        <BaseButton size="lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Về trang chủ
        </BaseButton>
      </router-link>
    </div>
  </div>
</template>

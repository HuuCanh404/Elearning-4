<script setup>
/**
 * ===========================================
 * HOME VIEW
 * Trang chủ
 * ===========================================
 */
import { ref, onMounted } from 'vue'
import { useBlogStore } from '@/store/blog'
import BlogCard from '@/components/ui/BlogCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const blogStore = useBlogStore()
const featuredBlogs = ref([])

onMounted(async () => {
  await blogStore.fetchBlogs()
  featuredBlogs.value = blogStore.blogs.slice(0, 6)
})
</script>

<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-16">
      <!-- Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Khám phá kiến thức,
          <br />
          <span class="text-yellow-300">Nâng tầm bản thân</span>
        </h1>
        <p class="text-white/80 text-lg md:text-xl mb-8 max-w-2xl">
          Nền tảng chia sẻ kiến thức hàng đầu với hàng nghìn bài viết chất lượng về công nghệ, lập trình và nhiều chủ đề thú vị khác.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link to="/blogs">
            <BaseButton size="lg" variant="secondary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
              </svg>
              Khám phá bài viết
            </BaseButton>
          </router-link>
          <router-link to="/auth/register">
            <BaseButton size="lg" variant="outline" class="border-white/30 text-white hover:bg-white/10">
              Tham gia ngay
            </BaseButton>
          </router-link>
        </div>
      </div>

      <!-- Stats -->
      <div class="relative z-10 grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
        <div class="text-center">
          <p class="text-3xl md:text-4xl font-bold text-white">1000+</p>
          <p class="text-white/60 text-sm">Bài viết</p>
        </div>
        <div class="text-center">
          <p class="text-3xl md:text-4xl font-bold text-white">500+</p>
          <p class="text-white/60 text-sm">Tác giả</p>
        </div>
        <div class="text-center">
          <p class="text-3xl md:text-4xl font-bold text-white">10K+</p>
          <p class="text-white/60 text-sm">Độc giả</p>
        </div>
      </div>
    </section>

    <!-- Featured Blogs -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-800">Bài viết nổi bật</h2>
          <p class="text-slate-500 mt-1">Khám phá những bài viết được yêu thích nhất</p>
        </div>
        <router-link to="/blogs">
          <BaseButton variant="outline">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </BaseButton>
        </router-link>
      </div>

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

      <div v-else-if="featuredBlogs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard 
          v-for="blog in featuredBlogs" 
          :key="blog.id" 
          :blog="blog"
        />
      </div>

      <div v-else class="text-center py-16 bg-white rounded-2xl">
        <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
        </svg>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">Chưa có bài viết nào</h3>
        <p class="text-slate-500">Hãy quay lại sau để xem các bài viết mới nhất!</p>
      </div>
    </section>

    <!-- Categories -->
    <section>
      <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mb-8">Danh mục phổ biến</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
            <svg class="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 class="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Lập trình</h3>
          <p class="text-sm text-slate-500 mt-1">250+ bài viết</p>
        </div>

        <div class="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
            <svg class="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">Công nghệ</h3>
          <p class="text-sm text-slate-500 mt-1">180+ bài viết</p>
        </div>

        <div class="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors">
            <svg class="w-6 h-6 text-pink-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="font-semibold text-slate-800 group-hover:text-pink-600 transition-colors">Lifestyle</h3>
          <p class="text-sm text-slate-500 mt-1">120+ bài viết</p>
        </div>

        <div class="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
            <svg class="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">Học tập</h3>
          <p class="text-sm text-slate-500 mt-1">200+ bài viết</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-slate-900 rounded-3xl p-8 md:p-12 text-center">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">Sẵn sàng chia sẻ kiến thức?</h2>
      <p class="text-slate-400 mb-8 max-w-2xl mx-auto">
        Tham gia cộng đồng của chúng tôi và bắt đầu viết những bài viết đầu tiên của bạn ngay hôm nay!
      </p>
      <router-link to="/auth/register">
        <BaseButton size="lg">
          Bắt đầu ngay
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </BaseButton>
      </router-link>
    </section>
  </div>
</template>

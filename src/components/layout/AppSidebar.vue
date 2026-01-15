<script setup>
/**
 * ===========================================
 * APP SIDEBAR
 * Mobile sidebar navigation
 * ===========================================
 */
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open'])

const authStore = useAuthStore()
const router = useRouter()

const closeSidebar = () => {
  emit('update:open', false)
}

const handleLogout = async () => {
  await authStore.logout()
  closeSidebar()
  router.push({ name: 'Login' })
}
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <transition name="fade">
      <div 
        v-if="open" 
        class="fixed inset-0 bg-black/50 z-40"
        @click="closeSidebar"
      ></div>
    </transition>

    <!-- Sidebar -->
    <transition name="slide">
      <div 
        v-if="open"
        class="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-xl font-bold text-slate-800">ELearning</span>
          </div>
          <button 
            @click="closeSidebar"
            class="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg class="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- User Info -->
        <div v-if="authStore.isAuthenticated" class="p-4 border-b bg-slate-50">
          <div class="flex items-center space-x-3">
            <img 
              :src="authStore.userAvatar" 
              :alt="authStore.userName"
              class="w-12 h-12 rounded-xl object-cover border-2 border-white shadow"
            />
            <div>
              <p class="font-semibold text-slate-800">{{ authStore.userName }}</p>
              <p class="text-sm text-slate-500">{{ authStore.userEmail }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-1">
            <li>
              <router-link 
                to="/"
                @click="closeSidebar"
                class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                active-class="bg-indigo-50 text-indigo-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Trang chủ</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/blogs"
                @click="closeSidebar"
                class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                active-class="bg-indigo-50 text-indigo-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                </svg>
                <span>Bài viết</span>
              </router-link>
            </li>

            <template v-if="authStore.isAuthenticated">
              <li>
                <router-link 
                  to="/blogs/create"
                  @click="closeSidebar"
                  class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  active-class="bg-indigo-50 text-indigo-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Viết bài mới</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/my-blogs"
                  @click="closeSidebar"
                  class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  active-class="bg-indigo-50 text-indigo-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Bài viết của tôi</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/profile"
                  @click="closeSidebar"
                  class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  active-class="bg-indigo-50 text-indigo-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Hồ sơ cá nhân</span>
                </router-link>
              </li>
            </template>
          </ul>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t">
          <template v-if="authStore.isAuthenticated">
            <button 
              @click="handleLogout"
              class="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </template>
          <template v-else>
            <div class="space-y-2">
              <router-link 
                to="/auth/login"
                @click="closeSidebar"
                class="flex items-center justify-center w-full px-4 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Đăng nhập
              </router-link>
              <router-link 
                to="/auth/register"
                @click="closeSidebar"
                class="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Đăng ký
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>

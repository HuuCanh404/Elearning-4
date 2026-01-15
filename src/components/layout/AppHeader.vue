<script setup>
/**
 * ===========================================
 * APP HEADER
 * Header component
 * ===========================================
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'BlogList', query: { search: searchQuery.value } })
    searchQuery.value = ''
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'Login' })
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>

<template>
  <header class="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Mobile Menu -->
        <div class="flex items-center space-x-4">
          <button 
            @click="emit('toggle-sidebar')"
            class="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              ELearning Blog
            </span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden lg:flex items-center space-x-1">
          <router-link 
            to="/" 
            class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
            active-class="text-indigo-600 bg-indigo-50"
          >
            Trang chủ
          </router-link>
          <router-link 
            to="/blogs" 
            class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
            active-class="text-indigo-600 bg-indigo-50"
          >
            Bài viết
          </router-link>
          <router-link 
            v-if="authStore.isAuthenticated"
            to="/my-blogs" 
            class="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
            active-class="text-indigo-600 bg-indigo-50"
          >
            Bài viết của tôi
          </router-link>
        </nav>

        <!-- Search Bar -->
        <div class="hidden md:flex items-center flex-1 max-w-md mx-8">
          <form @submit.prevent="handleSearch" class="w-full relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Tìm kiếm bài viết..."
              class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 border border-transparent focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <!-- Create Blog Button -->
            <router-link 
              to="/blogs/create"
              class="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Viết bài</span>
            </router-link>

            <!-- User Dropdown -->
            <div class="relative">
              <button 
                @click="toggleDropdown"
                class="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <img 
                  :src="authStore.userAvatar" 
                  :alt="authStore.userName"
                  class="w-9 h-9 rounded-lg object-cover border-2 border-slate-200"
                />
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <transition name="dropdown">
                <div 
                  v-if="isDropdownOpen"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  @click="isDropdownOpen = false"
                >
                  <div class="px-4 py-3 border-b border-slate-100">
                    <p class="font-semibold text-slate-800">{{ authStore.userName }}</p>
                    <p class="text-sm text-slate-500">{{ authStore.userEmail }}</p>
                  </div>
                  <router-link 
                    to="/profile"
                    class="flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Hồ sơ cá nhân</span>
                  </router-link>
                  <router-link 
                    to="/my-blogs"
                    class="flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Bài viết của tôi</span>
                  </router-link>
                  <hr class="my-2 border-slate-100" />
                  <button 
                    @click="handleLogout"
                    class="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </transition>
            </div>
          </template>

          <!-- Guest Actions -->
          <template v-else>
            <router-link 
              to="/auth/login"
              class="px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Đăng nhập
            </router-link>
            <router-link 
              to="/auth/register"
              class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all font-medium"
            >
              Đăng ký
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}
.dropdown-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<script setup>
/**
 * ===========================================
 * DEFAULT LAYOUT
 * Layout chính cho ứng dụng
 * ===========================================
 */
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { ref } from 'vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleSidebar" />

    <!-- Main Content -->
    <div class="flex flex-1">
      <!-- Sidebar (Mobile) -->
      <AppSidebar 
        v-model:open="isSidebarOpen" 
        class="lg:hidden"
      />

      <!-- Main Area -->
      <main class="flex-1 container mx-auto px-4 py-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

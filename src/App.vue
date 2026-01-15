<script setup>
/**
 * ===========================================
 * APP.VUE - Root Component
 * ===========================================
 */
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Check authentication status on app mount
  authStore.checkAuth()
})
</script>

<template>
  <router-view />
</template>

<style>
#app {
  min-height: 100vh;
}
</style>

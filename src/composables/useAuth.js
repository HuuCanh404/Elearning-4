/**
 * ===========================================
 * USE AUTH COMPOSABLE
 * Custom hook cho authentication
 * ===========================================
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Computed properties
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const isLoading = computed(() => authStore.isLoading)

  // Methods
  const login = async (credentials) => {
    const result = await authStore.login(credentials)
    if (result.success) {
      router.push('/')
    }
    return result
  }

  const register = async (userData) => {
    const result = await authStore.register(userData)
    if (result.success) {
      router.push('/')
    }
    return result
  }

  const logout = async () => {
    await authStore.logout()
    router.push('/auth/login')
  }

  const checkAuth = () => {
    return authStore.checkAuth()
  }

  // Guard helper
  const requireAuth = (callback) => {
    if (!isAuthenticated.value) {
      router.push('/auth/login')
      return
    }
    callback?.()
  }

  const requireAdmin = (callback) => {
    if (!isAuthenticated.value) {
      router.push('/auth/login')
      return
    }
    if (!isAdmin.value) {
      router.push('/')
      return
    }
    callback?.()
  }

  return {
    // State
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    // Methods
    login,
    register,
    logout,
    checkAuth,
    requireAuth,
    requireAdmin
  }
}

export default useAuth

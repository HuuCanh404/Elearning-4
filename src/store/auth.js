/**
 * ===========================================
 * AUTH STORE
 * Pinia Store - Quan ly xac thuc
 * State: user, token, isAuthenticated, isAdmin
 * ===========================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthApi from '@/api/auth'
import { AUTH_CONFIG } from '@/config/env'

export const useAuthStore = defineStore('auth', () => {
  // =====================
  // STATE
  // =====================
  const user = ref(null)
  const token = ref(null)
  const refreshToken = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // =====================
  // GETTERS
  // =====================
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name || 'Guest')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '/default-avatar.png')

  // =====================
  // ACTIONS
  // =====================

  /**
   * Initialize auth from localStorage
   */
  const initAuth = () => {
    const storedToken = localStorage.getItem(AUTH_CONFIG.tokenKey)
    const storedRefreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
    const storedUser = localStorage.getItem(AUTH_CONFIG.userKey)

    if (storedToken) {
      token.value = storedToken
      refreshToken.value = storedRefreshToken
      user.value = storedUser ? JSON.parse(storedUser) : null
    }
  }

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    initAuth()
    
    if (token.value) {
      try {
        const response = await AuthApi.getCurrentUser()
        user.value = response.getData()
        localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user.value))
      } catch (err) {
        // Token invalid - clear auth
        clearAuth()
      }
    }
  }

  /**
   * Login
   * @param {object} credentials - { email, password }
   */
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await AuthApi.login(credentials)
      const data = response.getData()

      // Store tokens
      token.value = data.access_token
      refreshToken.value = data.refresh_token
      user.value = data.user

      // Save to localStorage
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.access_token)
      localStorage.setItem(AUTH_CONFIG.refreshTokenKey, data.refresh_token)
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))

      return { success: true, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage(), errors: err.getFieldErrors() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Register
   * @param {object} userData - { name, email, password, password_confirmation }
   */
  const register = async (userData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await AuthApi.register(userData)
      const data = response.getData()

      // Store tokens
      token.value = data.access_token
      refreshToken.value = data.refresh_token
      user.value = data.user

      // Save to localStorage
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.access_token)
      localStorage.setItem(AUTH_CONFIG.refreshTokenKey, data.refresh_token)
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))

      return { success: true, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage(), errors: err.getFieldErrors() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    isLoading.value = true

    try {
      await AuthApi.logout()
    } catch (err) {
      // Ignore logout errors
      console.warn('Logout error:', err)
    } finally {
      clearAuth()
      isLoading.value = false
    }

    return { success: true, message: 'Logged out successfully' }
  }

  /**
   * Clear authentication data
   */
  const clearAuth = () => {
    token.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem(AUTH_CONFIG.tokenKey)
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    localStorage.removeItem(AUTH_CONFIG.userKey)
  }

  /**
   * Update user profile
   * @param {object} profileData
   */
  const updateProfile = (profileData) => {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    userName,
    userEmail,
    userAvatar,
    // Actions
    initAuth,
    checkAuth,
    login,
    register,
    logout,
    clearAuth,
    updateProfile
  }
})

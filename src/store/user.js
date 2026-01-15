/**
 * ===========================================
 * USER STORE
 * Pinia Store - Quản lý người dùng
 * ===========================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserApi from '@/api/user'
import { PAGINATION_CONFIG } from '@/config/env'

export const useUserStore = defineStore('user', () => {
  // =====================
  // STATE
  // =====================
  const users = ref([])
  const currentUser = ref(null)
  const meta = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Query state
  const query = ref({
    page: 1,
    perPage: PAGINATION_CONFIG.defaultPageSize,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    filters: {}
  })

  // =====================
  // GETTERS
  // =====================
  const totalUsers = computed(() => meta.value?.total || 0)
  const totalPages = computed(() => meta.value?.total_pages || 0)
  const currentPage = computed(() => meta.value?.page || 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  // =====================
  // ACTIONS
  // =====================

  /**
   * Fetch all users
   */
  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await UserApi.getAll(query.value)
      users.value = response.getData()
      meta.value = response.getMeta()
      return { success: true }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch user by ID
   * @param {number} id
   */
  const fetchUserById = async (id) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await UserApi.getById(id)
      currentUser.value = response.getData()
      return { success: true, data: currentUser.value }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create user
   * @param {object} userData
   */
  const createUser = async (userData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await UserApi.create(userData)
      const newUser = response.getData()
      users.value.unshift(newUser)
      return { success: true, data: newUser, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage(), errors: err.getFieldErrors() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update user
   * @param {number} id
   * @param {object} userData
   */
  const updateUser = async (id, userData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await UserApi.update(id, userData)
      const updatedUser = response.getData()
      
      // Update in list
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      
      // Update current user if same
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser
      }

      return { success: true, data: updatedUser, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage(), errors: err.getFieldErrors() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete user
   * @param {number} id
   */
  const deleteUser = async (id) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await UserApi.delete(id)
      
      // Remove from list
      users.value = users.value.filter(u => u.id !== id)
      
      // Clear current if same
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }

      return { success: true, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set query and fetch
   * @param {object} newQuery
   */
  const setQuery = async (newQuery) => {
    query.value = { ...query.value, ...newQuery }
    return await fetchUsers()
  }

  /**
   * Go to page
   * @param {number} page
   */
  const goToPage = async (page) => {
    return await setQuery({ page })
  }

  /**
   * Search users
   * @param {string} search
   */
  const searchUsers = async (search) => {
    return await setQuery({ search, page: 1 })
  }

  /**
   * Sort users
   * @param {string} sortBy
   * @param {string} sortOrder
   */
  const sortUsers = async (sortBy, sortOrder = 'desc') => {
    return await setQuery({ sortBy, sortOrder, page: 1 })
  }

  /**
   * Reset query
   */
  const resetQuery = () => {
    query.value = {
      page: 1,
      perPage: PAGINATION_CONFIG.defaultPageSize,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      filters: {}
    }
  }

  /**
   * Clear state
   */
  const clearState = () => {
    users.value = []
    currentUser.value = null
    meta.value = null
    error.value = null
    resetQuery()
  }

  return {
    // State
    users,
    currentUser,
    meta,
    isLoading,
    error,
    query,
    // Getters
    totalUsers,
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    setQuery,
    goToPage,
    searchUsers,
    sortUsers,
    resetQuery,
    clearState
  }
})

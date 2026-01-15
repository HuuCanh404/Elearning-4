/**
 * ===========================================
 * BLOG STORE
 * Pinia Store - Quản lý Blog
 * ===========================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import BlogApi from '@/api/blog'
import { PAGINATION_CONFIG, GLOBAL_VARS } from '@/config/env'

export const useBlogStore = defineStore('blog', () => {
  // =====================
  // STATE
  // =====================
  const blogs = ref([])
  const currentBlog = ref(null)
  const myBlogs = ref([])
  const meta = ref(null)
  const isLoading = ref(false)
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref(null)

  // Query state
  const query = ref({
    page: 1,
    perPage: PAGINATION_CONFIG.defaultPageSize,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    filters: {
      status: null,
      category_id: null,
      author_id: null
    }
  })

  // =====================
  // GETTERS
  // =====================
  const totalBlogs = computed(() => meta.value?.total || 0)
  const totalPages = computed(() => meta.value?.total_pages || 0)
  const currentPage = computed(() => meta.value?.page || 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)
  
  const publishedBlogs = computed(() => 
    blogs.value.filter(b => b.status === GLOBAL_VARS.BLOG_STATUS.PUBLISHED)
  )
  const draftBlogs = computed(() => 
    blogs.value.filter(b => b.status === GLOBAL_VARS.BLOG_STATUS.DRAFT)
  )

  // =====================
  // ACTIONS
  // =====================

  /**
   * Fetch all blogs (Public)
   */
  const fetchBlogs = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await BlogApi.getAll(query.value)
      blogs.value = response.getData()
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
   * Fetch blog by ID (Public - View)
   * @param {number} id
   */
  const fetchBlogById = async (id) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await BlogApi.getById(id)
      currentBlog.value = response.getData()
      return { success: true, data: currentBlog.value }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch blog by slug (Public - View)
   * @param {string} slug
   */
  const fetchBlogBySlug = async (slug) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await BlogApi.getBySlug(slug)
      currentBlog.value = response.getData()
      return { success: true, data: currentBlog.value }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Search blogs (Public)
   * @param {string} keyword
   */
  const searchBlogs = async (keyword) => {
    query.value.search = keyword
    query.value.page = 1
    return await fetchBlogs()
  }

  /**
   * Sort blogs
   * @param {string} sortBy - 'created_at', 'updated_at', 'title', 'views'
   * @param {string} sortOrder - 'asc' | 'desc'
   */
  const sortBlogs = async (sortBy, sortOrder = 'desc') => {
    query.value.sortBy = sortBy
    query.value.sortOrder = sortOrder
    query.value.page = 1
    return await fetchBlogs()
  }

  /**
   * Create blog (Private)
   * @param {object} blogData
   */
  const createBlog = async (blogData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await BlogApi.create(blogData)
      const newBlog = response.getData()
      blogs.value.unshift(newBlog)
      return { success: true, data: newBlog, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage(), errors: err.getFieldErrors() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update blog (Private)
   * @param {number} id
   * @param {object} blogData
   */
  const updateBlog = async (id, blogData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await BlogApi.update(id, blogData)
      const updatedBlog = response.getData()
      
      // Update in list
      const index = blogs.value.findIndex(b => b.id === id)
      if (index !== -1) {
        blogs.value[index] = updatedBlog
      }
      
      // Update current blog if same
      if (currentBlog.value?.id === id) {
        currentBlog.value = updatedBlog
      }

      return { success: true, data: updatedBlog, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage(), errors: err.getFieldErrors() }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete blog (Private)
   * @param {number} id
   */
  const deleteBlog = async (id) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await BlogApi.delete(id)
      
      // Remove from list
      blogs.value = blogs.value.filter(b => b.id !== id)
      
      // Clear current if same
      if (currentBlog.value?.id === id) {
        currentBlog.value = null
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
   * Upload blog image (Private)
   * @param {File} file
   */
  const uploadImage = async (file) => {
    isUploading.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      const response = await BlogApi.uploadImage(file, (progress) => {
        uploadProgress.value = progress
      })
      
      const data = response.getData()
      return { success: true, data, message: response.getMessage() }
    } catch (err) {
      error.value = err.getMessage()
      return { success: false, message: err.getMessage() }
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Fetch my blogs (Private)
   */
  const fetchMyBlogs = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await BlogApi.getMyBlogs(query.value)
      myBlogs.value = response.getData()
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
   * Filter by category
   * @param {number|null} categoryId
   */
  const filterByCategory = async (categoryId) => {
    query.value.filters.category_id = categoryId
    query.value.page = 1
    return await fetchBlogs()
  }

  /**
   * Filter by status
   * @param {string|null} status
   */
  const filterByStatus = async (status) => {
    query.value.filters.status = status
    query.value.page = 1
    return await fetchBlogs()
  }

  /**
   * Go to page
   * @param {number} page
   */
  const goToPage = async (page) => {
    query.value.page = page
    return await fetchBlogs()
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
      filters: {
        status: null,
        category_id: null,
        author_id: null
      }
    }
  }

  /**
   * Clear state
   */
  const clearState = () => {
    blogs.value = []
    currentBlog.value = null
    myBlogs.value = []
    meta.value = null
    error.value = null
    resetQuery()
  }

  return {
    // State
    blogs,
    currentBlog,
    myBlogs,
    meta,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    query,
    // Getters
    totalBlogs,
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
    publishedBlogs,
    draftBlogs,
    // Actions
    fetchBlogs,
    fetchBlogById,
    fetchBlogBySlug,
    searchBlogs,
    sortBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    uploadImage,
    fetchMyBlogs,
    filterByCategory,
    filterByStatus,
    goToPage,
    resetQuery,
    clearState
  }
})

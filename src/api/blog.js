/**
 * ===========================================
 * BLOG API
 * API quan ly Blog - Public & Private API
 * CRUD, Upload, Search, Sort
 * ===========================================
 */

import ApiRequest, { buildQueryParams } from './request'

/**
 * Blog API Endpoints
 * Public: GET (View, Search)
 * Private: POST, PUT, DELETE (Create, Update, Delete, Upload)
 */
const BlogApi = {
  /**
   * =====================
   * PUBLIC APIs
   * =====================
   */

  /**
   * Get All Blogs - Lấy danh sách bài viết (Public)
   * @param {object} options - { page, perPage, search, sortBy, sortOrder, filters }
   * @returns {Promise} - { blogs[], meta }
   * 
   * Request:
   * GET /blogs?page=1&per_page=10&search=vue&sort_by=created_at&sort_order=desc&status=published
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": 1,
   *       "title": "Blog Title",
   *       "slug": "blog-title",
   *       "excerpt": "Short description...",
   *       "content": "Full content...",
   *       "thumbnail": "https://...",
   *       "status": "published",
   *       "author": { "id": 1, "name": "John" },
   *       "category": { "id": 1, "name": "Technology" },
   *       "tags": ["vue", "javascript"],
   *       "views": 100,
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z"
   *     }
   *   ],
   *   "meta": { "page": 1, "per_page": 10, "total": 100, "total_pages": 10 }
   * }
   */
  getAll(options = {}) {
    const params = buildQueryParams(options)
    return ApiRequest.get('/blogs', params)
  },

  /**
   * Get Blog by ID - Xem chi tiết bài viết (Public)
   * @param {number} id - Blog ID
   * @returns {Promise} - { blog }
   * 
   * Request:
   * GET /blogs/{id}
   */
  getById(id) {
    return ApiRequest.get(`/blogs/${id}`)
  },

  /**
   * Get Blog by Slug - Xem chi tiết bài viết theo slug (Public)
   * @param {string} slug - Blog slug
   * @returns {Promise} - { blog }
   */
  getBySlug(slug) {
    return ApiRequest.get(`/blogs/slug/${slug}`)
  },

  /**
   * Search Blogs - Tìm kiếm bài viết (Public)
   * @param {string} keyword - Từ khóa tìm kiếm
   * @param {object} options - { page, perPage, sortBy, sortOrder }
   * @returns {Promise} - { blogs[], meta }
   * 
   * Request:
   * GET /blogs/search?q=keyword&page=1&per_page=10
   */
  search(keyword, options = {}) {
    const params = buildQueryParams({ ...options, search: keyword })
    return ApiRequest.get('/blogs/search', params)
  },

  /**
   * =====================
   * PRIVATE APIs
   * =====================
   */

  /**
   * Create Blog - Tạo bài viết mới (Private)
   * @param {object} blogData - Blog data
   * @returns {Promise} - { blog }
   * 
   * Request:
   * POST /blogs
   * Headers: Authorization: Bearer {token}
   * Body:
   * {
   *   "title": "Blog Title",
   *   "content": "Blog content...",
   *   "excerpt": "Short description",
   *   "thumbnail": "image_url",
   *   "category_id": 1,
   *   "tags": ["vue", "javascript"],
   *   "status": "draft" | "published"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "message": "Blog created successfully",
   *   "data": { ... }
   * }
   */
  create(blogData) {
    return ApiRequest.post('/blogs', blogData)
  },

  /**
   * Update Blog - Cập nhật bài viết (Private)
   * @param {number} id - Blog ID
   * @param {object} blogData - Blog data
   * @returns {Promise} - { blog }
   * 
   * Request:
   * PUT /blogs/{id}
   * Headers: Authorization: Bearer {token}
   */
  update(id, blogData) {
    return ApiRequest.put(`/blogs/${id}`, blogData)
  },

  /**
   * Delete Blog - Xóa bài viết (Private)
   * @param {number} id - Blog ID
   * @returns {Promise}
   * 
   * Request:
   * DELETE /blogs/{id}
   * Headers: Authorization: Bearer {token}
   */
  delete(id) {
    return ApiRequest.delete(`/blogs/${id}`)
  },

  /**
   * Upload Blog Image - Upload ảnh cho bài viết (Private)
   * @param {File} file - Image file
   * @param {function} onProgress - Progress callback
   * @returns {Promise} - { url }
   * 
   * Request:
   * POST /blogs/upload
   * Headers: 
   *   Authorization: Bearer {token}
   *   Content-Type: multipart/form-data
   * Body: FormData with 'image' field
   * 
   * Response:
   * {
   *   "success": true,
   *   "message": "Image uploaded successfully",
   *   "data": {
   *     "url": "https://...",
   *     "filename": "image.jpg",
   *     "size": 1024
   *   }
   * }
   */
  uploadImage(file, onProgress = null) {
    const formData = new FormData()
    formData.append('image', file)
    return ApiRequest.upload('/blogs/upload', formData, onProgress)
  },

  /**
   * =====================
   * SORT & FILTER OPTIONS
   * =====================
   */

  /**
   * Get Blogs with Sort - Sắp xếp bài viết
   * @param {string} sortBy - Field to sort: 'created_at', 'updated_at', 'title', 'views'
   * @param {string} sortOrder - 'asc' | 'desc'
   * @param {object} options - Other options
   * @returns {Promise}
   * 
   * Example:
   * BlogApi.sort('created_at', 'desc', { page: 1 })
   * BlogApi.sort('views', 'desc', { page: 1 }) // Popular blogs
   * BlogApi.sort('title', 'asc', { page: 1 }) // Alphabetical
   */
  sort(sortBy, sortOrder = 'desc', options = {}) {
    return this.getAll({ ...options, sortBy, sortOrder })
  },

  /**
   * Get Blogs by Category - Lọc theo danh mục
   * @param {number} categoryId - Category ID
   * @param {object} options - Other options
   * @returns {Promise}
   */
  getByCategory(categoryId, options = {}) {
    return this.getAll({
      ...options,
      filters: { ...options.filters, category_id: categoryId }
    })
  },

  /**
   * Get Blogs by Status - Lọc theo trạng thái
   * @param {string} status - 'draft' | 'published' | 'archived'
   * @param {object} options - Other options
   * @returns {Promise}
   */
  getByStatus(status, options = {}) {
    return this.getAll({
      ...options,
      filters: { ...options.filters, status }
    })
  },

  /**
   * Get Blogs by Author - Lọc theo tác giả
   * @param {number} authorId - Author ID
   * @param {object} options - Other options
   * @returns {Promise}
   */
  getByAuthor(authorId, options = {}) {
    return this.getAll({
      ...options,
      filters: { ...options.filters, author_id: authorId }
    })
  },

  /**
   * Get My Blogs - Lấy bài viết của user đang đăng nhập
   * @param {object} options - Query options
   * @returns {Promise}
   */
  getMyBlogs(options = {}) {
    const params = buildQueryParams(options)
    return ApiRequest.get('/blogs/my-blogs', params)
  }
}

export default BlogApi

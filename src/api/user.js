/**
 * ===========================================
 * USER API
 * API quản lý người dùng - Private API
 * ===========================================
 */

import ApiRequest, { buildQueryParams } from './request'

/**
 * User API Endpoints
 * Private APIs - Cần token
 */
const UserApi = {
  /**
   * Get All Users - Lấy danh sách người dùng
   * @param {object} options - { page, perPage, search, sortBy, sortOrder, filters }
   * @returns {Promise} - { users[], meta }
   * 
   * Request:
   * GET /users?page=1&per_page=10&search=john&sort_by=created_at&sort_order=desc
   * Headers: Authorization: Bearer {token}
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": [...],
   *   "meta": { "page": 1, "per_page": 10, "total": 100, "total_pages": 10 }
   * }
   */
  getAll(options = {}) {
    const params = buildQueryParams(options)
    return ApiRequest.get('/users', params)
  },

  /**
   * Get User by ID - Lấy thông tin user theo ID
   * @param {number} id - User ID
   * @returns {Promise} - { user }
   */
  getById(id) {
    return ApiRequest.get(`/users/${id}`)
  },

  /**
   * Create User - Tạo user mới
   * @param {object} userData - { name, email, password, role }
   * @returns {Promise} - { user }
   */
  create(userData) {
    return ApiRequest.post('/users', userData)
  },

  /**
   * Update User - Cập nhật thông tin user
   * @param {number} id - User ID
   * @param {object} userData - { name, email, role }
   * @returns {Promise} - { user }
   */
  update(id, userData) {
    return ApiRequest.put(`/users/${id}`, userData)
  },

  /**
   * Delete User - Xóa user
   * @param {number} id - User ID
   * @returns {Promise}
   */
  delete(id) {
    return ApiRequest.delete(`/users/${id}`)
  },

  /**
   * Update Profile - Cập nhật profile
   * @param {object} profileData - { name, avatar, bio }
   * @returns {Promise} - { user }
   */
  updateProfile(profileData) {
    return ApiRequest.put('/users/profile', profileData)
  },

  /**
   * Upload Avatar - Upload ảnh đại diện
   * @param {File} file - Image file
   * @param {function} onProgress - Progress callback
   * @returns {Promise} - { avatar_url }
   */
  uploadAvatar(file, onProgress = null) {
    const formData = new FormData()
    formData.append('avatar', file)
    return ApiRequest.upload('/users/avatar', formData, onProgress)
  }
}

export default UserApi

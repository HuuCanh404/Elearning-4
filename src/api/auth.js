/**
 * ===========================================
 * AUTH API
 * API xác thực - Public API
 * ===========================================
 */

import ApiRequest from './request'

/**
 * Authentication API Endpoints
 * Public APIs - Không cần token
 */
const AuthApi = {
  /**
   * Login - Đăng nhập
   * @param {object} credentials - { email, password }
   * @returns {Promise} - { user, access_token, refresh_token }
   * 
   * Request:
   * POST /auth/login
   * {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "message": "Login successful",
   *   "data": {
   *     "user": { "id": 1, "name": "John", "email": "user@example.com" },
   *     "access_token": "eyJ...",
   *     "refresh_token": "eyJ...",
   *     "token_type": "Bearer",
   *     "expires_in": 3600
   *   }
   * }
   */
  login(credentials) {
    return ApiRequest.post('/auth/login', credentials)
  },

  /**
   * Register - Đăng ký
   * @param {object} userData - { name, email, password, password_confirmation }
   * @returns {Promise} - { user, access_token }
   * 
   * Request:
   * POST /auth/register
   * {
   *   "name": "John Doe",
   *   "email": "user@example.com",
   *   "password": "password123",
   *   "password_confirmation": "password123"
   * }
   */
  register(userData) {
    return ApiRequest.post('/auth/register', userData)
  },

  /**
   * Logout - Đăng xuất
   * @returns {Promise}
   * 
   * Request:
   * POST /auth/logout
   * Headers: Authorization: Bearer {token}
   */
  logout() {
    return ApiRequest.post('/auth/logout')
  },

  /**
   * Refresh Token - Làm mới token
   * @param {string} refreshToken
   * @returns {Promise} - { access_token, refresh_token }
   */
  refreshToken(refreshToken) {
    return ApiRequest.post('/auth/refresh', { refresh_token: refreshToken })
  },

  /**
   * Get Current User - Lấy thông tin user đang đăng nhập
   * @returns {Promise} - { user }
   * 
   * Request:
   * GET /auth/me
   * Headers: Authorization: Bearer {token}
   */
  getCurrentUser() {
    return ApiRequest.get('/auth/me')
  },

  /**
   * Forgot Password - Quên mật khẩu
   * @param {string} email
   * @returns {Promise}
   */
  forgotPassword(email) {
    return ApiRequest.post('/auth/forgot-password', { email })
  },

  /**
   * Reset Password - Đặt lại mật khẩu
   * @param {object} data - { token, email, password, password_confirmation }
   * @returns {Promise}
   */
  resetPassword(data) {
    return ApiRequest.post('/auth/reset-password', data)
  },

  /**
   * Change Password - Đổi mật khẩu
   * @param {object} data - { current_password, new_password, new_password_confirmation }
   * @returns {Promise}
   */
  changePassword(data) {
    return ApiRequest.post('/auth/change-password', data)
  }
}

export default AuthApi

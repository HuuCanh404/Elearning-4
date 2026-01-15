/**
 * ===========================================
 * AXIOS INSTANCE
 * Cấu hình Axios cho API calls
 * ===========================================
 */

import axios from 'axios'
import { API_CONFIG, AUTH_CONFIG } from '@/config/env'

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
})

/**
 * ===========================================
 * REQUEST INTERCEPTOR
 * Xử lý trước khi gửi request
 * ===========================================
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey)
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `${AUTH_CONFIG.tokenType} ${token}`
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 Request:', config.method?.toUpperCase(), config.url)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * ===========================================
 * RESPONSE INTERCEPTOR
 * Xử lý response trả về
 * ===========================================
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.status, response.config.url)
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
        
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refresh_token: refreshToken
          })
          
          const { access_token } = response.data.data
          localStorage.setItem(AUTH_CONFIG.tokenKey, access_token)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `${AUTH_CONFIG.tokenType} ${access_token}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token failed - redirect to login
        localStorage.removeItem(AUTH_CONFIG.tokenKey)
        localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
        localStorage.removeItem(AUTH_CONFIG.userKey)
        window.location.href = '/login'
      }
    }
    
    // Log error
    console.error('❌ Response Error:', error.response?.status, error.message)
    
    return Promise.reject(error)
  }
)

export default axiosInstance

/**
 * ===========================================
 * API INDEX
 * Export all APIs
 * ===========================================
 */

export { default as axiosInstance } from './axiosInstance'
export { default as AuthApi } from './auth'
export { default as UserApi } from './user'
export { default as BlogApi } from './blog'
export { default as ApiRequest } from './request'
export { ApiResponse, ApiError, handleResponse, handleError } from './response'

// Default export
export default {
  auth: () => import('./auth').then(m => m.default),
  user: () => import('./user').then(m => m.default),
  blog: () => import('./blog').then(m => m.default)
}

/**
 * ===========================================
 * STANDARD REQUEST STRUCTURE
 * Cấu trúc chuẩn cho Request
 * ===========================================
 */

import axiosInstance from './axiosInstance'
import { handleResponse, handleError } from './response'

/**
 * Request Structure:
 * {
 *   method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
 *   url: '/endpoint',
 *   params: { key: value }, // Query parameters
 *   data: { key: value },   // Request body
 *   headers: { key: value } // Custom headers
 * }
 */

// Base Request Class
class ApiRequest {
  /**
   * GET Request (Public/Private)
   * @param {string} url - API endpoint
   * @param {object} params - Query parameters
   * @param {object} config - Additional config
   */
  static async get(url, params = {}, config = {}) {
    try {
      const response = await axiosInstance.get(url, { params, ...config })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  /**
   * POST Request (Public/Private)
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Additional config
   */
  static async post(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.post(url, data, config)
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  /**
   * PUT Request (Private)
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Additional config
   */
  static async put(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.put(url, data, config)
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  /**
   * PATCH Request (Private)
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Additional config
   */
  static async patch(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.patch(url, data, config)
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  /**
   * DELETE Request (Private)
   * @param {string} url - API endpoint
   * @param {object} config - Additional config
   */
  static async delete(url, config = {}) {
    try {
      const response = await axiosInstance.delete(url, config)
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  /**
   * Upload File Request
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {function} onProgress - Progress callback
   */
  static async upload(url, formData, onProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      }

      const response = await axiosInstance.post(url, formData, config)
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }
}

/**
 * Build query string for search, sort, filter
 * @param {object} options - Query options
 * @returns {object} - Query parameters
 */
export const buildQueryParams = (options = {}) => {
  const params = {}

  // Search
  if (options.search) {
    params.search = options.search
  }

  // Sort
  if (options.sortBy) {
    params.sort_by = options.sortBy
    params.sort_order = options.sortOrder || 'desc'
  }

  // Filter
  if (options.filters) {
    Object.keys(options.filters).forEach(key => {
      if (options.filters[key] !== null && options.filters[key] !== undefined) {
        params[key] = options.filters[key]
      }
    })
  }

  // Pagination
  if (options.page) {
    params.page = options.page
  }
  if (options.perPage) {
    params.per_page = options.perPage
  }

  return params
}

export default ApiRequest

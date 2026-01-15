/**
 * ===========================================
 * STANDARD RESPONSE STRUCTURE
 * Cấu trúc chuẩn cho Response
 * ===========================================
 */

/**
 * Success Response Structure
 * {
 *   success: true,
 *   message: "Operation successful",
 *   data: { ... },
 *   meta: {
 *     page: 1,
 *     per_page: 10,
 *     total: 100,
 *     total_pages: 10
 *   }
 * }
 */

/**
 * Error Response Structure
 * {
 *   success: false,
 *   message: "Error message",
 *   errors: {
 *     field_name: ["Error 1", "Error 2"]
 *   },
 *   code: "ERROR_CODE"
 * }
 */

// Response Handler Class
export class ApiResponse {
  constructor(response) {
    this.success = response?.data?.success ?? true
    this.message = response?.data?.message ?? ''
    this.data = response?.data?.data ?? response?.data ?? null
    this.meta = response?.data?.meta ?? null
    this.status = response?.status ?? 200
  }

  // Check if response is successful
  isSuccess() {
    return this.success && this.status >= 200 && this.status < 300
  }

  // Get data
  getData() {
    return this.data
  }

  // Get message
  getMessage() {
    return this.message
  }

  // Get pagination meta
  getMeta() {
    return this.meta
  }
}

// Error Handler Class
export class ApiError {
  constructor(error) {
    this.success = false
    this.message = error?.response?.data?.message || error?.message || 'Unknown error'
    this.errors = error?.response?.data?.errors || {}
    this.code = error?.response?.data?.code || 'UNKNOWN_ERROR'
    this.status = error?.response?.status || 500
  }

  // Get error message
  getMessage() {
    return this.message
  }

  // Get field errors
  getFieldErrors() {
    return this.errors
  }

  // Get error code
  getCode() {
    return this.code
  }

  // Get HTTP status
  getStatus() {
    return this.status
  }

  // Check if is validation error
  isValidationError() {
    return this.status === 422
  }

  // Check if is unauthorized
  isUnauthorized() {
    return this.status === 401
  }

  // Check if is forbidden
  isForbidden() {
    return this.status === 403
  }

  // Check if is not found
  isNotFound() {
    return this.status === 404
  }
}

/**
 * Helper function to handle API response
 */
export const handleResponse = (response) => {
  return new ApiResponse(response)
}

/**
 * Helper function to handle API error
 */
export const handleError = (error) => {
  return new ApiError(error)
}

export default {
  ApiResponse,
  ApiError,
  handleResponse,
  handleError
}

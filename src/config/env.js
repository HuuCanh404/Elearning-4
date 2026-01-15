/**
 * ===========================================
 * ENVIRONMENT CONFIGURATION
 * Global Variables & Environment Variables
 * ===========================================
 */

// Application Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'ELearning Blog',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  env: import.meta.env.VITE_APP_ENV || 'development',
  debug: import.meta.env.VITE_DEBUG === 'true'
}

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Authentication Configuration
export const AUTH_CONFIG = {
  tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  refreshTokenKey: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'refresh_token',
  userKey: import.meta.env.VITE_AUTH_USER_KEY || 'auth_user',
  tokenType: 'Bearer'
}

// Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',')
}

// Pagination Configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
  maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100
}

// Global Variables
export const GLOBAL_VARS = {
  // Status codes
  STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    DELETED: -1
  },
  
  // Blog status
  BLOG_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },
  
  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
  },
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
  }
}

export default {
  APP_CONFIG,
  API_CONFIG,
  AUTH_CONFIG,
  UPLOAD_CONFIG,
  PAGINATION_CONFIG,
  GLOBAL_VARS
}

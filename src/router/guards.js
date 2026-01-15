/**
 * ===========================================
 * NAVIGATION GUARDS
 * Bảo vệ routes
 * ===========================================
 */

import { useAuthStore } from '@/store/auth'

/**
 * Auth Guard - Yêu cầu đăng nhập
 * Redirect đến trang login nếu chưa đăng nhập
 */
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    // Lưu intended URL
    const redirect = to.fullPath !== '/' ? to.fullPath : undefined
    
    return next({
      name: 'Login',
      query: redirect ? { redirect } : {}
    })
  }

  next()
}

/**
 * Guest Guard - Chỉ cho guest
 * Redirect về home nếu đã đăng nhập
 */
export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    return next({ name: 'Home' })
  }

  next()
}

/**
 * Admin Guard - Chỉ cho admin
 * Redirect về home nếu không phải admin
 */
export const adminGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (!authStore.isAdmin) {
    return next({ name: 'Home' })
  }

  next()
}

/**
 * Role Guard - Kiểm tra role
 * @param {string[]} roles - Danh sách roles được phép
 */
export const roleGuard = (roles) => {
  return (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      return next({ name: 'Login' })
    }

    if (!roles.includes(authStore.user?.role)) {
      return next({ name: 'Home' })
    }

    next()
  }
}

export default {
  authGuard,
  guestGuard,
  adminGuard,
  roleGuard
}

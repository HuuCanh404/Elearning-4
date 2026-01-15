/**
 * ===========================================
 * VUE ROUTER - Configuration
 * ===========================================
 */

import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authGuard, guestGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} - ELearning Blog` 
    : 'ELearning Blog'

  // Auth guards
  if (to.meta.requiresAuth) {
    return authGuard(to, from, next)
  }

  if (to.meta.requiresGuest) {
    return guestGuard(to, from, next)
  }

  next()
})

// After navigation
router.afterEach((to, from) => {
  // Track page view or analytics
  if (import.meta.env.DEV) {
    console.log('📍 Navigation:', from.path, '→', to.path)
  }
})

export default router

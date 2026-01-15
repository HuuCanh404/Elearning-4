/**
 * ===========================================
 * AUTH ROUTES
 * Routes xác thực
 * ===========================================
 */

const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')

const authRoutes = [
  {
    path: 'login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Đăng nhập',
      requiresGuest: true
    }
  },
  {
    path: 'register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Đăng ký',
      requiresGuest: true
    }
  }
]

export default authRoutes

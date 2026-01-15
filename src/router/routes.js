/**
 * ===========================================
 * VUE ROUTER - Routes Definition
 * ===========================================
 */

import authRoutes from './auth'

// Layouts
const DefaultLayout = () => import('@/layouts/DefaultLayout.vue')
const AuthLayout = () => import('@/layouts/AuthLayout.vue')

// Views
const Home = () => import('@/views/Home.vue')
const Profile = () => import('@/views/Profile.vue')
const NotFound = () => import('@/views/NotFound.vue')

// Blog Views
const BlogList = () => import('@/views/blog/BlogList.vue')
const BlogDetail = () => import('@/views/blog/BlogDetail.vue')
const BlogCreate = () => import('@/views/blog/BlogCreate.vue')
const BlogEdit = () => import('@/views/blog/BlogEdit.vue')
const MyBlogs = () => import('@/views/blog/MyBlogs.vue')

const routes = [
  // =====================
  // PUBLIC ROUTES
  // =====================
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          title: 'Trang chủ'
        }
      },
      {
        path: 'blogs',
        name: 'BlogList',
        component: BlogList,
        meta: {
          title: 'Danh sách bài viết'
        }
      },
      {
        path: 'blogs/:id',
        name: 'BlogDetail',
        component: BlogDetail,
        props: true,
        meta: {
          title: 'Chi tiết bài viết'
        }
      }
    ]
  },

  // =====================
  // AUTH ROUTES (Guest only)
  // =====================
  {
    path: '/auth',
    component: AuthLayout,
    children: authRoutes
  },

  // =====================
  // PROTECTED ROUTES (Requires Auth)
  // =====================
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: 'Hồ sơ cá nhân',
          requiresAuth: true
        }
      },
      {
        path: 'blogs/create',
        name: 'BlogCreate',
        component: BlogCreate,
        meta: {
          title: 'Tạo bài viết mới',
          requiresAuth: true
        }
      },
      {
        path: 'blogs/:id/edit',
        name: 'BlogEdit',
        component: BlogEdit,
        props: true,
        meta: {
          title: 'Chỉnh sửa bài viết',
          requiresAuth: true
        }
      },
      {
        path: 'my-blogs',
        name: 'MyBlogs',
        component: MyBlogs,
        meta: {
          title: 'Bài viết của tôi',
          requiresAuth: true
        }
      }
    ]
  },

  // =====================
  // 404 NOT FOUND
  // =====================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404 - Không tìm thấy'
    }
  }
]

export default routes

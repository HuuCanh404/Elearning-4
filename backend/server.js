/**
 * ===========================================
 * EXPRESS SERVER
 * Backend API for ELearning Blog
 * ===========================================
 */

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 8000
const JWT_SECRET = 'elearning-blog-secret-key-2024'
const JWT_EXPIRES_IN = '24h'

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  }
})
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    cb(null, allowed.includes(file.mimetype))
  }
})

// ===========================================
// IN-MEMORY DATABASE
// ===========================================
const db = {
  users: [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('password', 10),
      avatar: null,
      bio: 'Quản trị viên hệ thống',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      password: bcrypt.hashSync('password', 10),
      avatar: null,
      bio: 'Người dùng thông thường',
      role: 'user',
      created_at: new Date().toISOString()
    }
  ],
  categories: [
    { id: 1, name: 'Lập trình', slug: 'lap-trinh' },
    { id: 2, name: 'Công nghệ', slug: 'cong-nghe' },
    { id: 3, name: 'Lifestyle', slug: 'lifestyle' },
    { id: 4, name: 'Học tập', slug: 'hoc-tap' }
  ],
  blogs: [
    {
      id: 1,
      title: 'Bắt đầu với Vue 3 - Hướng dẫn cho người mới',
      slug: 'bat-dau-voi-vue-3',
      excerpt: 'Hướng dẫn chi tiết cách bắt đầu với Vue 3, từ cài đặt đến tạo ứng dụng đầu tiên.',
      content: '<h2>Giới thiệu Vue 3</h2><p>Vue 3 là phiên bản mới nhất của Vue.js với nhiều cải tiến về hiệu năng.</p><h2>Cài đặt</h2><pre><code>npm create vite@latest my-vue-app -- --template vue</code></pre><p>Chạy ứng dụng:</p><pre><code>cd my-vue-app && npm install && npm run dev</code></pre>',
      thumbnail: 'https://picsum.photos/seed/vue3/800/400',
      author_id: 1,
      category_id: 1,
      tags: ['vue', 'javascript', 'frontend'],
      status: 'published',
      views: 150,
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      title: 'Tìm hiểu Pinia - State Management cho Vue 3',
      slug: 'tim-hieu-pinia',
      excerpt: 'Pinia là thư viện quản lý state chính thức cho Vue 3, thay thế Vuex.',
      content: '<h2>Pinia là gì?</h2><p>Pinia là thư viện state management nhẹ và dễ sử dụng.</p><ul><li>Cú pháp đơn giản</li><li>Hỗ trợ TypeScript</li><li>DevTools tích hợp</li></ul>',
      thumbnail: 'https://picsum.photos/seed/pinia/800/400',
      author_id: 1,
      category_id: 1,
      tags: ['vue', 'pinia', 'state-management'],
      status: 'published',
      views: 98,
      created_at: '2024-01-12T14:30:00Z',
      updated_at: '2024-01-12T14:30:00Z'
    },
    {
      id: 3,
      title: 'Thiết kế UI đẹp với TailwindCSS',
      slug: 'thiet-ke-ui-tailwindcss',
      excerpt: 'Hướng dẫn sử dụng TailwindCSS để tạo giao diện đẹp và responsive.',
      content: '<h2>TailwindCSS là gì?</h2><p>TailwindCSS là utility-first CSS framework giúp xây dựng giao diện nhanh chóng.</p><h2>Ưu điểm</h2><ul><li>Không cần viết CSS custom</li><li>Responsive dễ dàng</li><li>File CSS nhỏ gọn</li></ul>',
      thumbnail: 'https://picsum.photos/seed/tailwind/800/400',
      author_id: 2,
      category_id: 2,
      tags: ['css', 'tailwind', 'ui'],
      status: 'published',
      views: 75,
      created_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-14T09:15:00Z'
    },
    {
      id: 4,
      title: 'Học lập trình hiệu quả với phương pháp Pomodoro',
      slug: 'hoc-lap-trinh-pomodoro',
      excerpt: 'Áp dụng kỹ thuật Pomodoro để học lập trình hiệu quả hơn.',
      content: '<h2>Pomodoro là gì?</h2><p>Pomodoro là kỹ thuật quản lý thời gian với chu kỳ 25 phút làm việc, 5 phút nghỉ.</p>',
      thumbnail: 'https://picsum.photos/seed/pomodoro/800/400',
      author_id: 2,
      category_id: 4,
      tags: ['productivity', 'learning'],
      status: 'published',
      views: 120,
      created_at: '2024-01-15T16:00:00Z',
      updated_at: '2024-01-15T16:00:00Z'
    },
    {
      id: 5,
      title: 'Bài viết nháp - Đang soạn thảo',
      slug: 'bai-viet-nhap',
      excerpt: 'Đây là bài viết nháp chưa hoàn thành.',
      content: '<p>Nội dung đang được soạn thảo...</p>',
      thumbnail: null,
      author_id: 1,
      category_id: 1,
      tags: [],
      status: 'draft',
      views: 0,
      created_at: '2024-01-16T08:00:00Z',
      updated_at: '2024-01-16T08:00:00Z'
    }
  ],
  tokens: []
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Token required'
    })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Invalid token'
    })
  }

  req.user = db.users.find(u => u.id === decoded.id)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - User not found'
    })
  }

  next()
}

// Slug generator
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Response helper
const sendResponse = (res, status, data) => {
  res.status(status).json(data)
}

// ===========================================
// AUTH ROUTES (Public)
// ===========================================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return sendResponse(res, 400, {
      success: false,
      message: 'Email và mật khẩu là bắt buộc',
      errors: {
        email: !email ? ['Email là bắt buộc'] : [],
        password: !password ? ['Mật khẩu là bắt buộc'] : []
      }
    })
  }

  const user = db.users.find(u => u.email === email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return sendResponse(res, 401, {
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    })
  }

  const token = generateToken(user)
  const refreshToken = uuidv4()
  db.tokens.push({ userId: user.id, refreshToken })

  const { password: _, ...userWithoutPassword } = user

  sendResponse(res, 200, {
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      user: userWithoutPassword,
      access_token: token,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 86400
    }
  })
})

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, password_confirmation } = req.body
  const errors = {}

  if (!name) errors.name = ['Tên là bắt buộc']
  if (!email) errors.email = ['Email là bắt buộc']
  if (!password) errors.password = ['Mật khẩu là bắt buộc']
  if (password !== password_confirmation) {
    errors.password_confirmation = ['Mật khẩu không khớp']
  }

  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 422, {
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors
    })
  }

  if (db.users.find(u => u.email === email)) {
    return sendResponse(res, 422, {
      success: false,
      message: 'Email đã được sử dụng',
      errors: { email: ['Email đã tồn tại'] }
    })
  }

  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    avatar: null,
    bio: null,
    role: 'user',
    created_at: new Date().toISOString()
  }

  db.users.push(newUser)

  const token = generateToken(newUser)
  const refreshToken = uuidv4()
  db.tokens.push({ userId: newUser.id, refreshToken })

  const { password: _, ...userWithoutPassword } = newUser

  sendResponse(res, 201, {
    success: true,
    message: 'Đăng ký thành công',
    data: {
      user: userWithoutPassword,
      access_token: token,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 86400
    }
  })
})

// POST /api/auth/logout
app.post('/api/auth/logout', authMiddleware, (req, res) => {
  db.tokens = db.tokens.filter(t => t.userId !== req.user.id)
  sendResponse(res, 200, {
    success: true,
    message: 'Đăng xuất thành công'
  })
})

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user
  sendResponse(res, 200, {
    success: true,
    data: userWithoutPassword
  })
})

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  const { refresh_token } = req.body
  const tokenData = db.tokens.find(t => t.refreshToken === refresh_token)

  if (!tokenData) {
    return sendResponse(res, 401, {
      success: false,
      message: 'Invalid refresh token'
    })
  }

  const user = db.users.find(u => u.id === tokenData.userId)
  const newToken = generateToken(user)
  const newRefreshToken = uuidv4()

  db.tokens = db.tokens.filter(t => t.refreshToken !== refresh_token)
  db.tokens.push({ userId: user.id, refreshToken: newRefreshToken })

  sendResponse(res, 200, {
    success: true,
    data: {
      access_token: newToken,
      refresh_token: newRefreshToken
    }
  })
})

// ===========================================
// BLOG ROUTES (Public & Private)
// ===========================================

// GET /api/blogs - Get all blogs (Public)
app.get('/api/blogs', (req, res) => {
  let { page = 1, per_page = 10, search, sort_by = 'created_at', sort_order = 'desc', status, category_id, author_id } = req.query
  page = parseInt(page)
  per_page = parseInt(per_page)

  let filteredBlogs = [...db.blogs]

  // Filter by status (default: published for public)
  if (status) {
    filteredBlogs = filteredBlogs.filter(b => b.status === status)
  } else {
    filteredBlogs = filteredBlogs.filter(b => b.status === 'published')
  }

  // Filter by category
  if (category_id) {
    filteredBlogs = filteredBlogs.filter(b => b.category_id === parseInt(category_id))
  }

  // Filter by author
  if (author_id) {
    filteredBlogs = filteredBlogs.filter(b => b.author_id === parseInt(author_id))
  }

  // Search
  if (search) {
    const searchLower = search.toLowerCase()
    filteredBlogs = filteredBlogs.filter(b => 
      b.title.toLowerCase().includes(searchLower) ||
      b.excerpt?.toLowerCase().includes(searchLower) ||
      b.content.toLowerCase().includes(searchLower)
    )
  }

  // Sort
  filteredBlogs.sort((a, b) => {
    let valA = a[sort_by]
    let valB = b[sort_by]
    
    if (sort_by === 'created_at' || sort_by === 'updated_at') {
      valA = new Date(valA)
      valB = new Date(valB)
    }
    
    if (sort_order === 'asc') {
      return valA > valB ? 1 : -1
    }
    return valA < valB ? 1 : -1
  })

  // Pagination
  const total = filteredBlogs.length
  const total_pages = Math.ceil(total / per_page)
  const start = (page - 1) * per_page
  const paginatedBlogs = filteredBlogs.slice(start, start + per_page)

  // Add author and category info
  const blogsWithRelations = paginatedBlogs.map(blog => {
    const author = db.users.find(u => u.id === blog.author_id)
    const category = db.categories.find(c => c.id === blog.category_id)
    return {
      ...blog,
      author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
      category: category || null
    }
  })

  sendResponse(res, 200, {
    success: true,
    data: blogsWithRelations,
    meta: { page, per_page, total, total_pages }
  })
})

// GET /api/blogs/search - Search blogs (Public)
app.get('/api/blogs/search', (req, res) => {
  req.query.status = 'published'
  app._router.handle({ ...req, url: '/api/blogs', query: req.query }, res, () => {})
})

// GET /api/blogs/my-blogs - Get user's blogs (Private)
app.get('/api/blogs/my-blogs', authMiddleware, (req, res) => {
  req.query.author_id = req.user.id
  req.query.status = req.query.status || undefined // Allow all statuses

  let { page = 1, per_page = 10, sort_by = 'created_at', sort_order = 'desc', status } = req.query
  page = parseInt(page)
  per_page = parseInt(per_page)

  let userBlogs = db.blogs.filter(b => b.author_id === req.user.id)

  if (status) {
    userBlogs = userBlogs.filter(b => b.status === status)
  }

  userBlogs.sort((a, b) => {
    const valA = new Date(a[sort_by])
    const valB = new Date(b[sort_by])
    return sort_order === 'asc' ? valA - valB : valB - valA
  })

  const total = userBlogs.length
  const total_pages = Math.ceil(total / per_page)
  const start = (page - 1) * per_page
  const paginatedBlogs = userBlogs.slice(start, start + per_page)

  const blogsWithRelations = paginatedBlogs.map(blog => {
    const category = db.categories.find(c => c.id === blog.category_id)
    return { ...blog, category }
  })

  sendResponse(res, 200, {
    success: true,
    data: blogsWithRelations,
    meta: { page, per_page, total, total_pages }
  })
})

// GET /api/blogs/:id - Get blog by ID (Public - View)
app.get('/api/blogs/:id', (req, res) => {
  const blog = db.blogs.find(b => b.id === parseInt(req.params.id))
  
  if (!blog) {
    return sendResponse(res, 404, {
      success: false,
      message: 'Không tìm thấy bài viết'
    })
  }

  // Increment views
  blog.views++

  const author = db.users.find(u => u.id === blog.author_id)
  const category = db.categories.find(c => c.id === blog.category_id)

  sendResponse(res, 200, {
    success: true,
    data: {
      ...blog,
      author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
      category
    }
  })
})

// POST /api/blogs - Create blog (Private)
app.post('/api/blogs', authMiddleware, (req, res) => {
  const { title, content, excerpt, thumbnail, category_id, tags, status = 'draft' } = req.body
  const errors = {}

  if (!title) errors.title = ['Tiêu đề là bắt buộc']
  if (!content) errors.content = ['Nội dung là bắt buộc']

  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 422, {
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors
    })
  }

  const newBlog = {
    id: db.blogs.length + 1,
    title,
    slug: slugify(title) + '-' + Date.now(),
    excerpt: excerpt || '',
    content,
    thumbnail: thumbnail || null,
    author_id: req.user.id,
    category_id: category_id ? parseInt(category_id) : null,
    tags: tags || [],
    status,
    views: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  db.blogs.unshift(newBlog)

  sendResponse(res, 201, {
    success: true,
    message: 'Tạo bài viết thành công',
    data: newBlog
  })
})

// PUT /api/blogs/:id - Update blog (Private)
app.put('/api/blogs/:id', authMiddleware, (req, res) => {
  const blogIndex = db.blogs.findIndex(b => b.id === parseInt(req.params.id))
  
  if (blogIndex === -1) {
    return sendResponse(res, 404, {
      success: false,
      message: 'Không tìm thấy bài viết'
    })
  }

  const blog = db.blogs[blogIndex]

  // Check ownership
  if (blog.author_id !== req.user.id && req.user.role !== 'admin') {
    return sendResponse(res, 403, {
      success: false,
      message: 'Bạn không có quyền chỉnh sửa bài viết này'
    })
  }

  const { title, content, excerpt, thumbnail, category_id, tags, status } = req.body

  db.blogs[blogIndex] = {
    ...blog,
    title: title || blog.title,
    slug: title ? slugify(title) + '-' + blog.id : blog.slug,
    content: content || blog.content,
    excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
    thumbnail: thumbnail !== undefined ? thumbnail : blog.thumbnail,
    category_id: category_id !== undefined ? (category_id ? parseInt(category_id) : null) : blog.category_id,
    tags: tags || blog.tags,
    status: status || blog.status,
    updated_at: new Date().toISOString()
  }

  sendResponse(res, 200, {
    success: true,
    message: 'Cập nhật bài viết thành công',
    data: db.blogs[blogIndex]
  })
})

// DELETE /api/blogs/:id - Delete blog (Private)
app.delete('/api/blogs/:id', authMiddleware, (req, res) => {
  const blogIndex = db.blogs.findIndex(b => b.id === parseInt(req.params.id))
  
  if (blogIndex === -1) {
    return sendResponse(res, 404, {
      success: false,
      message: 'Không tìm thấy bài viết'
    })
  }

  const blog = db.blogs[blogIndex]

  // Check ownership
  if (blog.author_id !== req.user.id && req.user.role !== 'admin') {
    return sendResponse(res, 403, {
      success: false,
      message: 'Bạn không có quyền xóa bài viết này'
    })
  }

  db.blogs.splice(blogIndex, 1)

  sendResponse(res, 200, {
    success: true,
    message: 'Xóa bài viết thành công'
  })
})

// POST /api/blogs/upload - Upload image (Private)
app.post('/api/blogs/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return sendResponse(res, 400, {
      success: false,
      message: 'Không có file được tải lên'
    })
  }

  const url = `http://localhost:${PORT}/uploads/${req.file.filename}`

  sendResponse(res, 200, {
    success: true,
    message: 'Tải ảnh lên thành công',
    data: {
      url,
      filename: req.file.filename,
      size: req.file.size
    }
  })
})

// ===========================================
// USER ROUTES (Private)
// ===========================================

// GET /api/users
app.get('/api/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return sendResponse(res, 403, {
      success: false,
      message: 'Chỉ admin mới có quyền xem danh sách người dùng'
    })
  }

  const users = db.users.map(({ password, ...u }) => u)
  sendResponse(res, 200, {
    success: true,
    data: users,
    meta: { page: 1, per_page: 100, total: users.length, total_pages: 1 }
  })
})

// PUT /api/users/profile
app.put('/api/users/profile', authMiddleware, (req, res) => {
  const { name, bio } = req.body
  const userIndex = db.users.findIndex(u => u.id === req.user.id)

  if (name) db.users[userIndex].name = name
  if (bio !== undefined) db.users[userIndex].bio = bio

  const { password, ...userWithoutPassword } = db.users[userIndex]

  sendResponse(res, 200, {
    success: true,
    message: 'Cập nhật profile thành công',
    data: userWithoutPassword
  })
})

// POST /api/users/avatar
app.post('/api/users/avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return sendResponse(res, 400, {
      success: false,
      message: 'Không có file được tải lên'
    })
  }

  const userIndex = db.users.findIndex(u => u.id === req.user.id)
  const avatarUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`
  db.users[userIndex].avatar = avatarUrl

  sendResponse(res, 200, {
    success: true,
    message: 'Cập nhật avatar thành công',
    data: { avatar_url: avatarUrl }
  })
})

// ===========================================
// CATEGORIES ROUTES (Public)
// ===========================================
app.get('/api/categories', (req, res) => {
  sendResponse(res, 200, {
    success: true,
    data: db.categories
  })
})

// ===========================================
// START SERVER
// ===========================================
app.listen(PORT, () => {
  console.log('===========================================')
  console.log('🚀 ELearning Blog API Server')
  console.log('===========================================')
  console.log(`📡 Server running at: http://localhost:${PORT}`)
  console.log('')
  console.log('📋 Test Accounts:')
  console.log('   Admin: admin@example.com / password')
  console.log('   User:  user@example.com / password')
  console.log('')
  console.log('🔗 API Endpoints:')
  console.log('   POST /api/auth/login')
  console.log('   POST /api/auth/register')
  console.log('   POST /api/auth/logout')
  console.log('   GET  /api/auth/me')
  console.log('   GET  /api/blogs')
  console.log('   GET  /api/blogs/:id')
  console.log('   POST /api/blogs')
  console.log('   PUT  /api/blogs/:id')
  console.log('   DELETE /api/blogs/:id')
  console.log('   POST /api/blogs/upload')
  console.log('===========================================')
})

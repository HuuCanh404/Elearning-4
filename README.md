# ELearning Blog - Vue 3 Project

Bai tap 4 - Lap Trinh Mang
Dự án Vue 3 hoàn chỉnh với Blog Management System theo cấu trúc chuẩn.

## 📁 Cấu trúc dự án

```
elearning-vue3-project/
├── src/
│   ├── api/                          # API Layer
│   │   ├── axiosInstance.js          # Cấu hình Axios
│   │   ├── request.js                # Standard Request Structure
│   │   ├── response.js               # Standard Response Structure
│   │   ├── auth.js                   # API xác thực (Public)
│   │   ├── user.js                   # API người dùng (Private)
│   │   ├── blog.js                   # API Blog (Public & Private)
│   │   └── index.js                  # Export tất cả API
│   │
│   ├── assets/                       # Assets (images, icons, fonts)
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── ui/                       # UI Components dùng chung
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseAlert.vue
│   │   │   ├── BlogCard.vue
│   │   │   ├── BasePagination.vue
│   │   │   └── ImageUpload.vue
│   │   └── layout/                   # Layout Components
│   │       ├── AppHeader.vue
│   │       ├── AppFooter.vue
│   │       └── AppSidebar.vue
│   │
│   ├── composables/                  # Custom Hooks (Vue 3 Composition API)
│   │   ├── useAuth.js
│   │   └── useForm.js
│   │
│   ├── config/                       # Configuration
│   │   └── env.js                    # Environment Variables & Global Vars
│   │
│   ├── directives/                   # Custom Directives
│   │
│   ├── layouts/                      # Page Layouts
│   │   ├── DefaultLayout.vue
│   │   └── AuthLayout.vue
│   │
│   ├── router/
│   │   ├── index.js                  # Router Configuration
│   │   ├── routes.js                 # Route Definitions
│   │   ├── auth.js                   # Auth Routes
│   │   └── guards.js                 # Navigation Guards
│   │
│   ├── store/                        # Pinia Store (State Management)
│   │   ├── index.js
│   │   ├── auth.js                   # Auth Store
│   │   ├── user.js                   # User Store
│   │   └── blog.js                   # Blog Store
│   │
│   ├── styles/
│   │   └── main.css                  # Main CSS + TailwindCSS
│   │
│   ├── views/                        # Page Views
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Profile.vue
│   │   ├── NotFound.vue
│   │   └── blog/
│   │       ├── BlogList.vue
│   │       ├── BlogDetail.vue
│   │       ├── BlogCreate.vue
│   │       ├── BlogEdit.vue
│   │       └── MyBlogs.vue
│   │
│   ├── App.vue                       # Root Component
│   ├── main.js                       # Entry Point
│   └── i18n.js                       # Internationalization (vi, en)
│
├── database/
│   └── schema.sql                    # SQL Schema & Sample Data
│
├── postman/
│   └── ELearning_Blog_API.postman_collection.json
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Tính năng

### Authentication (Public API)
- ✅ Login - Đăng nhập
- ✅ Register - Đăng ký
- ✅ Logout - Đăng xuất
- ✅ Refresh Token - Làm mới token

### Blog Management
#### Public API
- ✅ View - Xem chi tiết bài viết
- ✅ Search - Tìm kiếm bài viết
- ✅ Sort - Sắp xếp bài viết

#### Private API (Yêu cầu xác thực)
- ✅ Create - Tạo bài viết mới
- ✅ Update - Cập nhật bài viết
- ✅ Delete - Xóa bài viết
- ✅ Upload - Tải ảnh lên

## 🛠 Cài đặt

```bash
# Clone project
git clone <repository-url>
cd elearning-vue3-project

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## ⚙️ Cấu hình Environment

Tạo file `.env` với nội dung:

```env
# Application
VITE_APP_NAME=ELearning Blog
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_AUTH_REFRESH_TOKEN_KEY=refresh_token
VITE_AUTH_USER_KEY=auth_user

# Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Pagination
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_PAGE_SIZE=100
```

## 📊 Database Setup

```bash
# Import SQL schema vào MySQL
mysql -u root -p < database/schema.sql
```

## 📮 Postman Collection

Import file `postman/ELearning_Blog_API.postman_collection.json` vào Postman để test API.

## 📐 Cấu trúc Request/Response

### Standard Request
```javascript
{
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: '/endpoint',
  params: { key: value },    // Query parameters
  data: { key: value },      // Request body
  headers: { key: value }    // Custom headers
}
```

### Standard Response (Success)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

### Standard Response (Error)
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error 1", "Error 2"]
  },
  "code": "ERROR_CODE"
}
```

## 🔐 API Authentication

### Public APIs (Không cần token)
- `POST /auth/login`
- `POST /auth/register`
- `GET /blogs`
- `GET /blogs/:id`
- `GET /blogs/search`

### Private APIs (Cần Bearer Token)
```
Authorization: Bearer <access_token>
```
- `POST /auth/logout`
- `GET /auth/me`
- `POST /blogs` (Create)
- `PUT /blogs/:id` (Update)
- `DELETE /blogs/:id` (Delete)
- `POST /blogs/upload` (Upload Image)
- `GET /blogs/my-blogs`

## 🎨 Tech Stack

- **Frontend**: Vue 3 + Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **CSS Framework**: TailwindCSS
- **i18n**: Vue I18n
- **Database**: MySQL

## 📝 License

MIT License

---

**Author**: ELearning 4 Assignment  
**Due Date**: Saturday, 24 January 2026

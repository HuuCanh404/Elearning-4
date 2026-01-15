/**
 * ===========================================
 * I18N.JS - Internationalization
 * Vue I18n Configuration
 * ===========================================
 */

import { createI18n } from 'vue-i18n'

// Vietnamese translations
const vi = {
  common: {
    loading: 'Đang tải...',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    create: 'Tạo mới',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    sort: 'Sắp xếp',
    submit: 'Gửi',
    back: 'Quay lại',
    confirm: 'Xác nhận',
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
    info: 'Thông tin'
  },
  auth: {
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    register: 'Đăng ký',
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    forgotPassword: 'Quên mật khẩu?',
    rememberMe: 'Ghi nhớ đăng nhập',
    loginSuccess: 'Đăng nhập thành công!',
    logoutSuccess: 'Đăng xuất thành công!',
    registerSuccess: 'Đăng ký thành công!'
  },
  blog: {
    title: 'Tiêu đề',
    content: 'Nội dung',
    category: 'Danh mục',
    tags: 'Thẻ',
    author: 'Tác giả',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    status: 'Trạng thái',
    draft: 'Nháp',
    published: 'Đã xuất bản',
    archived: 'Đã lưu trữ',
    uploadImage: 'Tải ảnh lên',
    noBlogs: 'Chưa có bài viết nào'
  },
  validation: {
    required: 'Trường này là bắt buộc',
    email: 'Email không hợp lệ',
    minLength: 'Tối thiểu {min} ký tự',
    maxLength: 'Tối đa {max} ký tự',
    passwordMatch: 'Mật khẩu không khớp'
  }
}

// English translations
const en = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    submit: 'Submit',
    back: 'Back',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    loginSuccess: 'Login successful!',
    logoutSuccess: 'Logout successful!',
    registerSuccess: 'Registration successful!'
  },
  blog: {
    title: 'Title',
    content: 'Content',
    category: 'Category',
    tags: 'Tags',
    author: 'Author',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    status: 'Status',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    uploadImage: 'Upload Image',
    noBlogs: 'No blogs yet'
  },
  validation: {
    required: 'This field is required',
    email: 'Invalid email address',
    minLength: 'Minimum {min} characters',
    maxLength: 'Maximum {max} characters',
    passwordMatch: 'Passwords do not match'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'en',
  messages: {
    vi,
    en
  }
})

export default i18n

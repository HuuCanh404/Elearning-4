-- ===========================================
-- DATABASE SCHEMA
-- ELearning Blog Database
-- ===========================================

-- Tạo Database
CREATE DATABASE IF NOT EXISTS elearning_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE elearning_blog;

-- ===========================================
-- TABLE: users
-- Bảng người dùng
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) NULL,
    bio TEXT NULL,
    role ENUM('admin', 'user', 'guest') DEFAULT 'user',
    status TINYINT DEFAULT 1 COMMENT '1: active, 0: inactive, -1: deleted',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLE: personal_access_tokens
-- Bảng lưu token xác thực (Laravel Sanctum style)
-- ===========================================
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLE: categories
-- Bảng danh mục bài viết
-- ===========================================
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    parent_id BIGINT UNSIGNED NULL,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLE: blogs
-- Bảng bài viết
-- ===========================================
CREATE TABLE IF NOT EXISTS blogs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT NULL COMMENT 'Mô tả ngắn',
    content LONGTEXT NOT NULL,
    thumbnail VARCHAR(500) NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views INT UNSIGNED DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_author (author_id),
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    FULLTEXT INDEX idx_search (title, excerpt, content),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLE: tags
-- Bảng thẻ (tags)
-- ===========================================
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLE: blog_tag
-- Bảng quan hệ blog - tag (Many to Many)
-- ===========================================
CREATE TABLE IF NOT EXISTS blog_tag (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    blog_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_blog_tag (blog_id, tag_id),
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLE: media
-- Bảng lưu trữ file upload
-- ===========================================
CREATE TABLE IF NOT EXISTS media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size BIGINT UNSIGNED NOT NULL COMMENT 'Size in bytes',
    user_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- SAMPLE DATA
-- Dữ liệu mẫu
-- ===========================================

-- Insert sample users
INSERT INTO users (name, email, password, role, status) VALUES
('Admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1),
('User Demo', 'user@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1),
('Nguyễn Văn A', 'nguyenvana@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1);
-- Password mặc định: password

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Lập trình', 'lap-trinh', 'Các bài viết về lập trình'),
('Công nghệ', 'cong-nghe', 'Tin tức công nghệ mới nhất'),
('Lifestyle', 'lifestyle', 'Phong cách sống'),
('Học tập', 'hoc-tap', 'Kiến thức và kỹ năng học tập');

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
('Vue.js', 'vuejs'),
('JavaScript', 'javascript'),
('Web Development', 'web-development'),
('Tutorial', 'tutorial'),
('Tips & Tricks', 'tips-tricks');

-- Insert sample blogs
INSERT INTO blogs (title, slug, excerpt, content, author_id, category_id, status, views, published_at) VALUES
(
    'Bắt đầu với Vue 3 - Hướng dẫn cho người mới',
    'bat-dau-voi-vue-3-huong-dan-cho-nguoi-moi',
    'Hướng dẫn chi tiết cách bắt đầu với Vue 3, từ cài đặt đến tạo ứng dụng đầu tiên.',
    '<h2>Giới thiệu Vue 3</h2>
<p>Vue 3 là phiên bản mới nhất của Vue.js với nhiều cải tiến về hiệu năng và tính năng mới.</p>
<h2>Cài đặt</h2>
<pre><code>npm create vite@latest my-vue-app -- --template vue</code></pre>
<p>Sau khi cài đặt, bạn có thể chạy ứng dụng với lệnh:</p>
<pre><code>cd my-vue-app
npm install
npm run dev</code></pre>
<h2>Composition API</h2>
<p>Vue 3 giới thiệu Composition API giúp tổ chức code tốt hơn...</p>',
    1,
    1,
    'published',
    150,
    NOW()
),
(
    'Tìm hiểu Pinia - State Management cho Vue 3',
    'tim-hieu-pinia-state-management-cho-vue-3',
    'Pinia là thư viện quản lý state chính thức cho Vue 3, thay thế Vuex.',
    '<h2>Pinia là gì?</h2>
<p>Pinia là thư viện state management nhẹ và dễ sử dụng cho Vue 3.</p>
<h2>Tại sao nên dùng Pinia?</h2>
<ul>
<li>Cú pháp đơn giản hơn Vuex</li>
<li>Hỗ trợ TypeScript tốt hơn</li>
<li>Không cần mutations</li>
<li>DevTools tích hợp</li>
</ul>
<h2>Cài đặt và sử dụng</h2>
<pre><code>npm install pinia</code></pre>',
    1,
    1,
    'published',
    98,
    NOW()
),
(
    'Thiết kế UI đẹp với TailwindCSS',
    'thiet-ke-ui-dep-voi-tailwindcss',
    'Hướng dẫn sử dụng TailwindCSS để tạo giao diện đẹp và responsive.',
    '<h2>TailwindCSS là gì?</h2>
<p>TailwindCSS là một utility-first CSS framework giúp bạn xây dựng giao diện nhanh chóng.</p>
<h2>Ưu điểm</h2>
<ul>
<li>Không cần viết CSS custom</li>
<li>Responsive dễ dàng</li>
<li>File CSS nhỏ gọn sau khi build</li>
</ul>',
    2,
    2,
    'published',
    75,
    NOW()
);

-- Insert blog_tag relationships
INSERT INTO blog_tag (blog_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 3), (3, 4);

-- ===========================================
-- VIEWS & STORED PROCEDURES
-- ===========================================

-- View: Lấy blog với thông tin đầy đủ
CREATE OR REPLACE VIEW v_blogs AS
SELECT 
    b.*,
    u.name as author_name,
    u.avatar as author_avatar,
    c.name as category_name,
    c.slug as category_slug
FROM blogs b
LEFT JOIN users u ON b.author_id = u.id
LEFT JOIN categories c ON b.category_id = c.id;

-- Stored Procedure: Tìm kiếm blog
DELIMITER //
CREATE PROCEDURE sp_search_blogs(
    IN p_keyword VARCHAR(255),
    IN p_category_id BIGINT,
    IN p_status VARCHAR(20),
    IN p_page INT,
    IN p_per_page INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_page - 1) * p_per_page;
    
    SELECT SQL_CALC_FOUND_ROWS 
        b.*,
        u.name as author_name,
        u.avatar as author_avatar,
        c.name as category_name
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE 
        (p_keyword IS NULL OR p_keyword = '' OR 
         MATCH(b.title, b.excerpt, b.content) AGAINST(p_keyword IN NATURAL LANGUAGE MODE))
        AND (p_category_id IS NULL OR p_category_id = 0 OR b.category_id = p_category_id)
        AND (p_status IS NULL OR p_status = '' OR b.status = p_status)
    ORDER BY b.created_at DESC
    LIMIT p_per_page OFFSET v_offset;
    
    SELECT FOUND_ROWS() as total;
END //
DELIMITER ;

-- Stored Procedure: Tăng lượt xem blog
DELIMITER //
CREATE PROCEDURE sp_increment_views(IN p_blog_id BIGINT)
BEGIN
    UPDATE blogs SET views = views + 1 WHERE id = p_blog_id;
END //
DELIMITER ;

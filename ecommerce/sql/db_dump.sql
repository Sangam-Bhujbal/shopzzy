-- E-Commerce Database Dump
-- Generated on: 2024-01-01 00:00:00
-- Version: 1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `ecommerce_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ecommerce_db`;

-- Users table
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `is_active` (`is_active`),
  KEY `is_verified` (`is_verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User roles table
CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role` enum('admin','user','seller') DEFAULT 'user',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User addresses table
CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('home','work','other') DEFAULT 'home',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  KEY `is_active` (`is_active`),
  KEY `sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `compare_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `track_quantity` tinyint(1) DEFAULT 1,
  `quantity` int(11) DEFAULT 0,
  `low_stock_threshold` int(11) DEFAULT 5,
  `weight` decimal(8,2) DEFAULT NULL,
  `dimensions` varchar(50) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_new` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `view_count` int(11) DEFAULT 0,
  `sales_count` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `is_featured` (`is_featured`),
  KEY `is_new` (`is_new`),
  KEY `is_active` (`is_active`),
  KEY `price` (`price`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product categories relationship table
CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_category` (`product_id`,`category_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product images table
CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `sort_order` (`sort_order`),
  KEY `is_primary` (`is_primary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product variants table
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `price_modifier` decimal(10,2) DEFAULT 0,
  `sku` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `billing_address` text NOT NULL,
  `shipping_address` text NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) DEFAULT 0,
  `shipping_amount` decimal(10,2) DEFAULT 0,
  `discount_amount` decimal(10,2) DEFAULT 0,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cod','upi','card','netbanking','wallet') NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `order_status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `tracking_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `user_id` (`user_id`),
  KEY `email` (`email`),
  KEY `payment_status` (`payment_status`),
  KEY `order_status` (`order_status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `variant_details` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart table
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `variant_details` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wishlist table
CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupons table
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('percentage','fixed') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `minimum_amount` decimal(10,2) DEFAULT 0,
  `maximum_discount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_count` int(11) DEFAULT 0,
  `user_limit` int(11) DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `is_active` (`is_active`),
  KEY `expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `rating` tinyint(1) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 1,
  `helpful_count` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  KEY `is_verified` (`is_verified`),
  KEY `is_approved` (`is_approved`),
  KEY `rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners table
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `position` enum('hero','sidebar','footer') DEFAULT 'hero',
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `position` (`position`),
  KEY `is_active` (`is_active`),
  KEY `sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings table
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `type` enum('string','number','boolean','json','file') DEFAULT 'string',
  `group` varchar(50) DEFAULT 'general',
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `group` (`group`),
  KEY `is_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Logs table
CREATE TABLE `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` enum('debug','info','warning','error','critical') DEFAULT 'info',
  `message` text NOT NULL,
  `context` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `level` (`level`),
  KEY `user_id` (`user_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter subscriptions table
CREATE TABLE `newsletter_subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `subscription_source` varchar(50) DEFAULT 'website',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data

-- Admin user
INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `phone`, `is_active`, `is_verified`) VALUES
('admin@example.com', '$argon2id$v=19$m=65536,t=4,p=3$QWRtaW5AMTIzNDU$example_hash_here', 'Admin', 'User', '9876543210', 1, 1);

INSERT INTO `user_roles` (`user_id`, `role`) VALUES
(1, 'admin');

-- Sample categories
INSERT INTO `categories` (`name`, `slug`, `description`, `sort_order`, `is_active`) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 1, 1),
('Fashion', 'fashion', 'Trendy clothing and accessories', 2, 1),
('Home & Garden', 'home-garden', 'Everything for your home and garden', 3, 1),
('Sports & Gaming', 'sports-gaming', 'Sports equipment and gaming gear', 4, 1),
('Books', 'books', 'Books and educational materials', 5, 1),
('Health & Beauty', 'health-beauty', 'Health, beauty and personal care products', 6, 1);

-- Sample products
INSERT INTO `products` (`name`, `slug`, `description`, `short_description`, `price`, `compare_price`, `quantity`, `is_featured`, `is_new`, `is_active`) VALUES
('iPhone 14 Pro Max', 'iphone-14-pro-max', 'Latest iPhone with advanced camera system and A16 Bionic chip.', '6.7-inch Super Retina XDR display, 48MP Main camera, A16 Bionic chip', 129900.00, 139900.00, 25, 1, 0, 1),
('Samsung Galaxy S23 Ultra', 'samsung-galaxy-s23-ultra', 'Premium Android smartphone with S Pen and professional cameras.', '6.8-inch Dynamic AMOLED 2X display, 200MP camera, Snapdragon 8 Gen 2', 124999.00, NULL, 18, 1, 1, 1),
('MacBook Pro 14-inch', 'macbook-pro-14-inch', 'Powerful laptop for professionals with M2 Pro chip.', '14.2-inch Liquid Retina XDR display, M2 Pro chip, up to 18 hours battery', 199900.00, NULL, 12, 1, 0, 1),
('Nike Air Max 270', 'nike-air-max-270', 'Comfortable running shoes with maximum Air cushioning.', 'Max Air unit, breathable mesh upper, foam midsole', 12995.00, 15995.00, 45, 0, 0, 1),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise canceling wireless headphones.', '30-hour battery life, quick charge, touch sensor controls', 29990.00, 34990.00, 30, 1, 1, 1),
('Dyson V15 Detect', 'dyson-v15-detect', 'Powerful cordless vacuum with laser dust detection.', 'Laser dust detection, 60 minutes run time, whole-machine filtration', 65900.00, NULL, 8, 0, 0, 1);

-- Product categories relationships
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 3);

-- Sample coupons
INSERT INTO `coupons` (`code`, `name`, `description`, `type`, `value`, `minimum_amount`, `usage_limit`, `expires_at`, `is_active`) VALUES
('WELCOME10', 'Welcome Discount', '10% off on first order', 'percentage', 10.00, 1000.00, 100, '2024-12-31 23:59:59', 1),
('SAVE500', 'Flat Discount', '₹500 off on orders above ₹5000', 'fixed', 500.00, 5000.00, 50, '2024-12-31 23:59:59', 1),
('FLASH20', 'Flash Sale', '20% off on electronics', 'percentage', 20.00, 2000.00, 200, '2024-01-15 23:59:59', 1);

-- Sample banners
INSERT INTO `banners` (`title`, `image`, `link`, `alt_text`, `position`, `sort_order`, `is_active`) VALUES
('Electronics Sale', 'assets/images/banner1.jpg', 'category.html?id=1', 'Electronics Sale Banner', 'hero', 1, 1),
('Fashion Sale', 'assets/images/banner2.jpg', 'category.html?id=2', 'Fashion Sale Banner', 'hero', 2, 1),
('Home Sale', 'assets/images/banner3.jpg', 'category.html?id=3', 'Home Sale Banner', 'hero', 3, 1);

-- Sample settings
INSERT INTO `settings` (`key`, `value`, `type`, `group`, `is_public`) VALUES
('site_name', 'E-Commerce Store', 'string', 'general', 1),
('site_description', 'Your one stop online shopping destination', 'string', 'general', 1),
('contact_email', 'support@estore.com', 'string', 'general', 1),
('contact_phone', '+91-1234567890', 'string', 'general', 1),
('currency', 'INR', 'string', 'general', 1),
('min_order_amount', '100', 'number', 'general', 1),
('free_shipping_threshold', '999', 'number', 'general', 1),
('items_per_page', '12', 'number', 'general', 1),
('enable_registration', '1', 'boolean', 'general', 1),
('enable_reviews', '1', 'boolean', 'general', 1);

-- Create indexes for better performance
CREATE INDEX idx_products_category_price ON products(category_id, price);
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_reviews_product_rating ON reviews(product_id, rating);
CREATE INDEX idx_cart_session ON cart(session_id);

-- Foreign key constraints (optional, can be added for data integrity)
-- ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE user_addresses ADD CONSTRAINT fk_user_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE product_categories ADD CONSTRAINT fk_product_categories_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
-- ALTER TABLE product_categories ADD CONSTRAINT fk_product_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
-- ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
-- ALTER TABLE product_variants ADD CONSTRAINT fk_product_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
-- ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
-- ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
-- ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
-- ALTER TABLE cart ADD CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE cart ADD CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
-- ALTER TABLE wishlist ADD CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE wishlist ADD CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
-- ALTER TABLE reviews ADD CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
-- ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE reviews ADD CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

COMMIT;

-- SQL script to create the points_of_interest table in Laravel/MySQL database
-- This script should be run via a Laravel migration or directly in the DB for demo purposes

CREATE TABLE IF NOT EXISTS points_of_interest (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    address VARCHAR(255) NULL,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    category ENUM('mosque','accommodation','food','transport','medical','other') NOT NULL DEFAULT 'other',
    is_open TINYINT(1) NOT NULL DEFAULT 0,
    opening_hours VARCHAR(100) NULL,
    phone VARCHAR(50) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);
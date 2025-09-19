-- SQL script to create the pilgrims table in Laravel/MySQL database
-- This script should be run in your Laravel migration or directly in the database

CREATE TABLE IF NOT EXISTS pilgrims (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    accommodation_type VARCHAR(100) NULL,
    special_needs TEXT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_country (country),
    INDEX idx_registration_date (registration_date)
);

-- Insert some sample data for testing
INSERT INTO pilgrims (first_name, last_name, email, phone, city, country, accommodation_type, special_needs, status) VALUES
('Amadou', 'Diop', 'amadou.diop@email.com', '+221 77 123 45 67', 'Dakar', 'senegal', 'family', '', 'confirmed'),
('Fatou', 'Sall', 'fatou.sall@email.com', '+221 76 987 65 43', 'Thiès', 'senegal', 'hotel', 'Mobilité réduite', 'pending'),
('Ousmane', 'Ba', 'ousmane.ba@email.com', '+221 78 456 78 90', 'Saint-Louis', 'senegal', 'guesthouse', '', 'confirmed'),
('Aïcha', 'Ndiaye', 'aicha.ndiaye@email.com', '+221 77 234 56 78', 'Kaolack', 'senegal', 'family', 'Régime végétarien', 'pending');

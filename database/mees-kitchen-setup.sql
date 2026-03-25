-- MEE'S KITCHEN Database Setup
-- Run this script in your Cloud SQL console or MySQL client

-- Create the database
CREATE DATABASE IF NOT EXISTS mees_kitchen_db;
USE mees_kitchen_db;

-- Create categories table
CREATE TABLE IF NOT EXISTS mees_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create food items table
CREATE TABLE IF NOT EXISTS mees_food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    image_url VARCHAR(500),
    image_public_id VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_available (is_available)
);

-- Insert default categories
INSERT IGNORE INTO mees_categories (name, description) VALUES
('Appetizers', 'Delicious starters to begin your meal'),
('Main Course', 'Hearty and satisfying main dishes'),
('Desserts', 'Sweet treats to end your meal perfectly'),
('Beverages', 'Refreshing drinks and beverages'),
('Snacks', 'Light bites and quick snacks'),
('Specials', 'Chef special dishes and seasonal items');

-- Insert sample food items
INSERT IGNORE INTO mees_food_items (name, description, category, price, image_url) VALUES
('Chicken Biryani', 'Aromatic basmati rice cooked with tender chicken and traditional spices', 'Main Course', 15.99, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop'),
('Samosas', 'Crispy pastry filled with spiced potatoes and peas', 'Appetizers', 6.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop'),
('Gulab Jamun', 'Soft milk dumplings in sweet cardamom syrup', 'Desserts', 4.99, 'https://images.unsplash.com/photo-1571167530149-c72f2b3d9f95?w=800&h=600&fit=crop'),
('Masala Chai', 'Traditional spiced tea with milk and aromatic spices', 'Beverages', 3.99, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop'),
('Butter Chicken', 'Creamy tomato-based curry with tender chicken pieces', 'Main Course', 16.99, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=600&fit=crop'),
('Pakoras', 'Crispy fritters made with vegetables and chickpea flour', 'Snacks', 7.99, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop');

-- Verify the setup
SELECT 'Categories created:' as status, COUNT(*) as count FROM mees_categories;
SELECT 'Food items created:' as status, COUNT(*) as count FROM mees_food_items;

-- Show all categories
SELECT * FROM mees_categories ORDER BY name;

-- Show all food items
SELECT id, name, category, price FROM mees_food_items ORDER BY category, name;
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration - using existing Clever Cloud database
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
};

async function setupMeesKitchenDatabase() {
  let connection;
  
  try {
    console.log('🔗 Connecting to Clever Cloud MySQL...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Create categories table for MEE'S KITCHEN (with prefix to avoid conflicts)
    console.log('📋 Creating mees_categories table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mees_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create food_items table for MEE'S KITCHEN (with prefix to avoid conflicts)
    console.log('🍽️ Creating mees_food_items table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mees_food_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        image_url VARCHAR(500),
        image_public_id VARCHAR(255),
        is_available BOOLEAN DEFAULT true,
        is_sample BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_available (is_available),
        INDEX idx_sample (is_sample)
      )
    `);

    // Create contact_info table for MEE'S KITCHEN
    console.log('📞 Creating mees_contact_info table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mees_contact_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(50),
        email VARCHAR(100),
        location TEXT,
        hours TEXT,
        facebook_url VARCHAR(255),
        instagram_url VARCHAR(255),
        twitter_url VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default categories
    console.log('🏷️ Adding default categories...');
    await connection.execute(`
      INSERT IGNORE INTO mees_categories (name, description) VALUES
      ('Appetizers', 'Delicious starters to begin your meal'),
      ('Main Course', 'Hearty and satisfying main dishes'),
      ('Desserts', 'Sweet treats to end your meal perfectly'),
      ('Beverages', 'Refreshing drinks and beverages'),
      ('Snacks', 'Light bites and quick snacks'),
      ('Specials', 'Chef special dishes and seasonal items')
    `);

    // Insert sample food items (marked as samples)
    console.log('🍛 Adding sample food items...');
    await connection.execute(`
      INSERT IGNORE INTO mees_food_items (name, description, category, price, image_url, is_sample) VALUES
      ('Chicken Biryani', 'Aromatic basmati rice cooked with tender chicken and traditional spices', 'Main Course', 15.99, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop', true),
      ('Samosas', 'Crispy pastry filled with spiced potatoes and peas', 'Appetizers', 6.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop', true),
      ('Gulab Jamun', 'Soft milk dumplings in sweet cardamom syrup', 'Desserts', 4.99, 'https://images.unsplash.com/photo-1571167530149-c72f2b3d9f95?w=800&h=600&fit=crop', true),
      ('Masala Chai', 'Traditional spiced tea with milk and aromatic spices', 'Beverages', 3.99, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop', true),
      ('Pakoras', 'Crispy fritters made with vegetables and chickpea flour', 'Snacks', 7.99, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop', true)
    `);

    // Insert default contact info if not exists
    console.log('📞 Adding default contact information...');
    const [contactExists] = await connection.execute('SELECT COUNT(*) as count FROM mees_contact_info');
    if (contactExists[0].count === 0) {
      await connection.execute(`
        INSERT INTO mees_contact_info (phone, email, location, hours, facebook_url, instagram_url, twitter_url) VALUES
        ('+1 (555) 123-4567', 'hello@meeskitchen.com', '123 Food Street, Flavor City', 'Mon-Sun: 9:00 AM - 9:00 PM', '', '', '')
      `);
    }

    // Verify setup
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM mees_categories');
    const [items] = await connection.execute('SELECT COUNT(*) as count FROM mees_food_items');

    console.log('✅ MEE\'S KITCHEN database setup completed successfully!');
    console.log('📊 Database:', process.env.DB_NAME);
    console.log('🏷️ Categories created:', categories[0].count);
    console.log('🍽️ Food items created:', items[0].count);
    console.log('');
    console.log('🚀 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('');
    console.log('💡 Error details:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupMeesKitchenDatabase();
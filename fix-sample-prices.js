const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
};

async function fixSamplePrices() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database. Updating sample prices...');
    
    // Update sample food items with proper Indian rupee prices
    const priceUpdates = [
      { name: 'Chicken Biryani', price: 299 },
      { name: 'Samosas', price: 149 },
      { name: 'Gulab Jamun', price: 99 },
      { name: 'Masala Chai', price: 79 },
      { name: 'Butter Chicken', price: 329 },
      { name: 'Pakoras', price: 159 }
    ];
    
    for (const item of priceUpdates) {
      await connection.execute(
        'UPDATE mees_food_items SET price = ? WHERE name = ? AND is_sample = true',
        [item.price, item.name]
      );
      console.log(`Updated ${item.name} price to ₹${item.price}`);
    }
    
    console.log('Sample prices updated successfully!');
    await connection.end();
    
  } catch (error) {
    console.error('Error updating sample prices:', error);
  }
}

fixSamplePrices();
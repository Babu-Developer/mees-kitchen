const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
};

async function cleanupSampleData() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!');
    
    // Get all categories
    console.log('📋 Getting categories...');
    const [categories] = await connection.execute('SELECT * FROM mees_categories ORDER BY name');
    
    console.log('🧹 Cleaning up sample food items...');
    
    // For each category, keep only the first item and delete the rest
    for (const category of categories) {
      console.log(`   Processing category: ${category.name}`);
      
      // Get all items in this category
      const [items] = await connection.execute(
        'SELECT id FROM mees_food_items WHERE category = ? ORDER BY id ASC',
        [category.name]
      );
      
      if (items.length > 1) {
        // Keep the first item, delete the rest
        const itemsToDelete = items.slice(1).map(item => item.id);
        
        if (itemsToDelete.length > 0) {
          const placeholders = itemsToDelete.map(() => '?').join(',');
          await connection.execute(
            `DELETE FROM mees_food_items WHERE id IN (${placeholders})`,
            itemsToDelete
          );
          
          console.log(`   ✅ Removed ${itemsToDelete.length} duplicate items from ${category.name}`);
        }
      } else if (items.length === 1) {
        console.log(`   ✅ ${category.name} already has only 1 item`);
      } else {
        console.log(`   ⚠️  ${category.name} has no items`);
      }
    }
    
    // Get final count
    const [finalCount] = await connection.execute('SELECT COUNT(*) as count FROM mees_food_items');
    const [categoryCount] = await connection.execute('SELECT COUNT(*) as count FROM mees_categories');
    
    console.log('✅ Cleanup completed successfully!');
    console.log(`📊 Final status:`);
    console.log(`   🏷️  Categories: ${categoryCount[0].count}`);
    console.log(`   🍽️  Food items: ${finalCount[0].count} (1 per category)`);
    console.log('');
    console.log('🎯 Your database is now clean with sample data for demonstration!');
    console.log('🚀 Customers can now add their own food items through the admin panel.');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the cleanup
cleanupSampleData();
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

async function addSampleFlag() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!');
    
    // Add is_sample column if it doesn't exist
    console.log('🔧 Adding is_sample column...');
    try {
      await connection.execute(`
        ALTER TABLE mees_food_items 
        ADD COLUMN is_sample BOOLEAN DEFAULT false
      `);
      console.log('✅ Added is_sample column successfully!');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ is_sample column already exists!');
      } else {
        throw error;
      }
    }
    
    // Mark existing items as samples
    console.log('🏷️ Marking existing items as samples...');
    const [result] = await connection.execute(`
      UPDATE mees_food_items 
      SET is_sample = true 
      WHERE is_sample = false
    `);
    
    console.log(`✅ Marked ${result.affectedRows} items as samples!`);
    
    // Get final count
    const [sampleCount] = await connection.execute('SELECT COUNT(*) as count FROM mees_food_items WHERE is_sample = true');
    const [totalCount] = await connection.execute('SELECT COUNT(*) as count FROM mees_food_items');
    
    console.log('✅ Migration completed successfully!');
    console.log(`📊 Status:`);
    console.log(`   🍽️  Total items: ${totalCount[0].count}`);
    console.log(`   📝  Sample items: ${sampleCount[0].count}`);
    console.log('');
    console.log('🎯 Now when customers add real food items, samples will be automatically hidden!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the migration
addSampleFlag();
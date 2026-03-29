const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
};

async function fixContactTable() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database. Adding missing columns to contact table...');
    
    // Add social media columns if they don't exist
    const alterQueries = [
      'ALTER TABLE mees_contact_info ADD COLUMN facebook_url VARCHAR(255) DEFAULT ""',
      'ALTER TABLE mees_contact_info ADD COLUMN instagram_url VARCHAR(255) DEFAULT ""',
      'ALTER TABLE mees_contact_info ADD COLUMN twitter_url VARCHAR(255) DEFAULT ""'
    ];
    
    for (const query of alterQueries) {
      try {
        await connection.execute(query);
        console.log('Added column:', query.split('ADD COLUMN ')[1].split(' ')[0]);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log('Column already exists:', query.split('ADD COLUMN ')[1].split(' ')[0]);
        } else {
          console.error('Error adding column:', error.message);
        }
      }
    }
    
    console.log('Contact table updated successfully!');
    await connection.end();
    
  } catch (error) {
    console.error('Error updating contact table:', error);
  }
}

fixContactTable();
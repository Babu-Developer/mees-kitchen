const express = require('express');
const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow any Netlify app
    if (origin.includes('.netlify.app')) return callback(null, true);
    
    // Allow specific domains
    const allowedOrigins = [
      'https://mees-kitchen.netlify.app',
      'https://mees-kitchen-admin.netlify.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mees-kitchen',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'fill' }]
  }
});

const upload = multer({ storage: storage });

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};

// Sample data for when database is not connected
const sampleFoodItems = [
  {
    id: 1,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken and traditional spices",
    category: "Main Course",
    price: 15.99,
    image_url: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop",
    is_available: true
  },
  {
    id: 2,
    name: "Samosas",
    description: "Crispy pastry filled with spiced potatoes and peas",
    category: "Appetizers",
    price: 6.99,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    is_available: true
  },
  {
    id: 3,
    name: "Gulab Jamun",
    description: "Soft milk dumplings in sweet cardamom syrup",
    category: "Desserts",
    price: 4.99,
    image_url: "https://images.unsplash.com/photo-1571167530149-c72f2b3d9f95?w=800&h=600&fit=crop",
    is_available: true
  },
  {
    id: 4,
    name: "Masala Chai",
    description: "Traditional spiced tea with milk and aromatic spices",
    category: "Beverages",
    price: 3.99,
    image_url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop",
    is_available: true
  },
  {
    id: 5,
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken pieces",
    category: "Main Course",
    price: 16.99,
    image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=600&fit=crop",
    is_available: true
  },
  {
    id: 6,
    name: "Pakoras",
    description: "Crispy fritters made with vegetables and chickpea flour",
    category: "Snacks",
    price: 7.99,
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop",
    is_available: true
  }
];

const sampleCategories = [
  { id: 1, name: "Appetizers", description: "Delicious starters to begin your meal" },
  { id: 2, name: "Main Course", description: "Hearty and satisfying main dishes" },
  { id: 3, name: "Desserts", description: "Sweet treats to end your meal perfectly" },
  { id: 4, name: "Beverages", description: "Refreshing drinks and beverages" },
  { id: 5, name: "Snacks", description: "Light bites and quick snacks" },
  { id: 6, name: "Specials", description: "Chef special dishes and seasonal items" }
];

const pool = mysql.createPool(dbConfig);

// Test database connection and initialize
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DB Config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    const connection = await pool.getConnection();
    
    // Test a simple query to ensure database is selected
    await connection.execute('SELECT 1 as test');
    console.log('Database connection successful!');
    connection.release();
    isDatabaseConnected = true;
    return true;
  } catch (error) {
    console.log('Database connection failed:', error.message);
    isDatabaseConnected = false;
    console.log('Using sample data instead');
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  const isConnected = await testDatabaseConnection();
  
  if (!isConnected) {
    console.log('Server will continue running with sample data. Configure database in .env file for full functionality.');
    return;
  }

  try {
    // Create tables with simpler approach
    const createTables = async () => {
      const connection = await pool.getConnection();
      
      try {
        // Create mees_food_items table
        const createFoodItemsTable = `
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
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `;
        
        await connection.query(createFoodItemsTable);
        console.log('mees_food_items table created/verified');

        // Create mees_categories table
        const createCategoriesTable = `
          CREATE TABLE IF NOT EXISTS mees_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        
        await connection.query(createCategoriesTable);
        console.log('mees_categories table created/verified');

        // Create mees_contact_info table
        const createContactTable = `
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
        `;
        
        await connection.query(createContactTable);
        console.log('mees_contact_info table created/verified');

        // Insert sample data if tables are empty
        await insertSampleDataIfNeeded(connection);
        
      } finally {
        connection.release();
      }
    };

    await createTables();
    console.log('MEE\'S KITCHEN database tables initialized successfully');
    
  } catch (error) {
    console.error('Database initialization error:', error.message);
    isDatabaseConnected = false;
    console.log('Server will continue running with sample data. Please configure your database credentials in .env file');
  }
}

// Insert sample data if needed
async function insertSampleDataIfNeeded(connection) {
  try {
    // Check if contact info exists
    const [contactRows] = await connection.query('SELECT COUNT(*) as count FROM mees_contact_info');
    if (contactRows[0].count === 0) {
      await connection.query(`
        INSERT INTO mees_contact_info (phone, email, location, hours, facebook_url, instagram_url, twitter_url) VALUES
        ('+1 (555) 123-4567', 'hello@meeskitchen.com', '123 Food Street, Flavor City', 'Mon-Sun: 9:00 AM - 9:00 PM', '', '', '')
      `);
      console.log('Default contact info inserted');
    }

    // Check if categories exist
    const [categoryRows] = await connection.query('SELECT COUNT(*) as count FROM mees_categories');
    if (categoryRows[0].count === 0) {
      const categories = [
        ['Appetizers', 'Delicious starters to begin your meal'],
        ['Main Course', 'Hearty and satisfying main dishes'],
        ['Desserts', 'Sweet treats to end your meal perfectly'],
        ['Beverages', 'Refreshing drinks and beverages'],
        ['Snacks', 'Light bites and quick snacks'],
        ['Specials', 'Chef special dishes and seasonal items']
      ];
      
      for (const [name, description] of categories) {
        await connection.query('INSERT INTO mees_categories (name, description) VALUES (?, ?)', [name, description]);
      }
      console.log('Sample categories inserted');
    }

    // Check if food items exist
    const [foodRows] = await connection.query('SELECT COUNT(*) as count FROM mees_food_items');
    if (foodRows[0].count === 0) {
      const sampleItems = [
        ['Chicken Biryani', 'Aromatic basmati rice cooked with tender chicken and traditional spices', 'Main Course', 15.99, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop', true, true],
        ['Samosas', 'Crispy pastry filled with spiced potatoes and peas', 'Appetizers', 6.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop', true, true],
        ['Gulab Jamun', 'Soft milk dumplings in sweet cardamom syrup', 'Desserts', 4.99, 'https://images.unsplash.com/photo-1571167530149-c72f2b3d9f95?w=800&h=600&fit=crop', true, true],
        ['Masala Chai', 'Traditional spiced tea with milk and aromatic spices', 'Beverages', 3.99, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop', true, true],
        ['Pakoras', 'Crispy fritters made with vegetables and chickpea flour', 'Snacks', 7.99, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop', true, true]
      ];
      
      for (const item of sampleItems) {
        await connection.query(
          'INSERT INTO mees_food_items (name, description, category, price, image_url, is_available, is_sample) VALUES (?, ?, ?, ?, ?, ?, ?)',
          item
        );
      }
      console.log('Sample food items inserted');
    }
    
  } catch (error) {
    console.log('Sample data insertion error:', error.message);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Get all food items (excluding samples if real data exists)
app.get('/api/food-items', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.json(sampleFoodItems);
    }
    
    // Check if there are any real (non-sample) items
    const [realItems] = await pool.execute(
      'SELECT COUNT(*) as count FROM mees_food_items WHERE is_available = true AND is_sample = false'
    );
    
    let query;
    if (realItems[0].count > 0) {
      // If real items exist, only show real items
      query = 'SELECT * FROM mees_food_items WHERE is_available = true AND is_sample = false ORDER BY created_at DESC';
    } else {
      // If no real items, show sample items
      query = 'SELECT * FROM mees_food_items WHERE is_available = true ORDER BY created_at DESC';
    }
    
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching food items:', error);
    // Fallback to sample data if database error
    res.json(sampleFoodItems);
  }
});

// Get food items by category (excluding samples if real data exists)
app.get('/api/food-items/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!isDatabaseConnected) {
      const filteredItems = sampleFoodItems.filter(item => item.category === category);
      return res.json(filteredItems);
    }
    
    // Check if there are any real (non-sample) items
    const [realItems] = await pool.execute(
      'SELECT COUNT(*) as count FROM mees_food_items WHERE is_available = true AND is_sample = false'
    );
    
    let query, params;
    if (realItems[0].count > 0) {
      // If real items exist, only show real items
      query = 'SELECT * FROM mees_food_items WHERE category = ? AND is_available = true AND is_sample = false ORDER BY created_at DESC';
      params = [category];
    } else {
      // If no real items, show sample items
      query = 'SELECT * FROM mees_food_items WHERE category = ? AND is_available = true ORDER BY created_at DESC';
      params = [category];
    }
    
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching food items by category:', error);
    const filteredItems = sampleFoodItems.filter(item => item.category === req.params.category);
    res.json(filteredItems);
  }
});

// Add new food item (automatically hides samples when real data is added)
app.post('/api/food-items', upload.single('image'), async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected. Please configure your database credentials in .env file to add items.' 
      });
    }
    
    const { name, description, category, price } = req.body;
    const image_url = req.file ? req.file.path : null;
    const image_public_id = req.file ? req.file.filename : null;

    // Add as real item (is_sample = false)
    const [result] = await pool.execute(
      'INSERT INTO mees_food_items (name, description, category, price, image_url, image_public_id, is_sample) VALUES (?, ?, ?, ?, ?, ?, false)',
      [name, description, category, price, image_url, image_public_id]
    );

    res.json({ 
      id: result.insertId, 
      message: 'Food item added successfully',
      image_url: image_url 
    });
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).json({ error: 'Failed to add food item' });
  }
});

// Clear all sample data (admin function)
app.delete('/api/sample-data', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected.' 
      });
    }
    
    await pool.execute('DELETE FROM mees_food_items WHERE is_sample = true');
    res.json({ message: 'Sample data cleared successfully' });
  } catch (error) {
    console.error('Error clearing sample data:', error);
    res.status(500).json({ error: 'Failed to clear sample data' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.json(sampleCategories);
    }
    
    const [rows] = await pool.execute('SELECT * FROM mees_categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to sample data if database error
    res.json(sampleCategories);
  }
});

// Add new category
app.post('/api/categories', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected. Please configure your database credentials in .env file to add categories.' 
      });
    }
    
    const { name, description } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO mees_categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.json({ id: result.insertId, message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Delete food item
app.delete('/api/food-items/:id', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected. Please configure your database credentials in .env file to delete items.' 
      });
    }
    
    const { id } = req.params;
    
    // Get image public_id before deleting
    const [rows] = await pool.execute('SELECT image_public_id FROM mees_food_items WHERE id = ?', [id]);
    
    if (rows.length > 0 && rows[0].image_public_id) {
      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(rows[0].image_public_id);
    }
    
    await pool.execute('DELETE FROM mees_food_items WHERE id = ?', [id]);
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ error: 'Failed to delete food item' });
  }
});

// Update food item
app.put('/api/food-items/:id', upload.single('image'), async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected. Please configure your database credentials in .env file to update items.' 
      });
    }
    
    const { id } = req.params;
    const { name, description, category, price } = req.body;
    
    let updateQuery = 'UPDATE mees_food_items SET name = ?, description = ?, category = ?, price = ? WHERE id = ?';
    let updateParams = [name, description, category, price, id];
    
    // If new image is uploaded
    if (req.file) {
      // Get old image public_id to delete from Cloudinary
      const [oldRows] = await pool.execute('SELECT image_public_id FROM mees_food_items WHERE id = ?', [id]);
      
      if (oldRows.length > 0 && oldRows[0].image_public_id) {
        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(oldRows[0].image_public_id);
      }
      
      // Update with new image
      updateQuery = 'UPDATE mees_food_items SET name = ?, description = ?, category = ?, price = ?, image_url = ?, image_public_id = ? WHERE id = ?';
      updateParams = [name, description, category, price, req.file.path, req.file.filename, id];
    }
    
    await pool.execute(updateQuery, updateParams);
    res.json({ message: 'Food item updated successfully' });
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ error: 'Failed to update food item' });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected. Please configure your database credentials in .env file to delete categories.' 
      });
    }
    
    const { id } = req.params;
    
    // Check if category is being used by any food items
    const [foodItems] = await pool.execute('SELECT COUNT(*) as count FROM mees_food_items WHERE category = (SELECT name FROM mees_categories WHERE id = ?)', [id]);
    
    if (foodItems[0].count > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. ${foodItems[0].count} food item(s) are using this category.` 
      });
    }
    
    await pool.execute('DELETE FROM mees_categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Update category
app.put('/api/categories/:id', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected. Please configure your database credentials in .env file to update categories.' 
      });
    }
    
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Get old category name to update food items
    const [oldCategory] = await pool.execute('SELECT name FROM mees_categories WHERE id = ?', [id]);
    
    if (oldCategory.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Update category
    await pool.execute('UPDATE mees_categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    
    // Update food items that use this category
    if (oldCategory[0].name !== name) {
      await pool.execute('UPDATE mees_food_items SET category = ? WHERE category = ?', [name, oldCategory[0].name]);
    }
    
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Get contact information
app.get('/api/contact-info', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.json({
        phone: '+1 (555) 123-4567',
        email: 'hello@meeskitchen.com',
        location: '123 Food Street, Flavor City',
        hours: 'Mon-Sun: 9:00 AM - 9:00 PM',
        facebook_url: '',
        instagram_url: '',
        twitter_url: ''
      });
    }
    
    const [rows] = await pool.execute('SELECT * FROM mees_contact_info LIMIT 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({
        phone: '',
        email: '',
        location: '',
        hours: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: ''
      });
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.json({
      phone: '+1 (555) 123-4567',
      email: 'hello@meeskitchen.com',
      location: '123 Food Street, Flavor City',
      hours: 'Mon-Sun: 9:00 AM - 9:00 PM',
      facebook_url: '',
      instagram_url: '',
      twitter_url: ''
    });
  }
});

// Update contact information
app.put('/api/contact-info', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.status(503).json({ 
        error: 'Database not connected. Please configure your database credentials in .env file to update contact info.' 
      });
    }
    
    const { phone, email, location, hours, facebook_url, instagram_url, twitter_url } = req.body;
    
    // Check if contact info exists
    const [existing] = await pool.execute('SELECT COUNT(*) as count FROM mees_contact_info');
    
    if (existing[0].count > 0) {
      // Update existing
      await pool.execute(
        'UPDATE mees_contact_info SET phone = ?, email = ?, location = ?, hours = ?, facebook_url = ?, instagram_url = ?, twitter_url = ? WHERE id = 1',
        [phone, email, location, hours, facebook_url, instagram_url, twitter_url]
      );
    } else {
      // Insert new
      await pool.execute(
        'INSERT INTO mees_contact_info (phone, email, location, hours, facebook_url, instagram_url, twitter_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [phone, email, location, hours, facebook_url, instagram_url, twitter_url]
      );
    }
    
    res.json({ message: 'Contact information updated successfully' });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ error: 'Failed to update contact information' });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`MEE'S KITCHEN server running on port ${PORT}`);
  });
});
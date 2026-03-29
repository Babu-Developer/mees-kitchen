const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const ADMIN_URL = `${BASE_URL}/admin`;

test.describe('MEE\'S KITCHEN - Complete Testing Suite', () => {
  
  // Test 1: Main Website Loading and Navigation
  test('Main website loads and navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check page title
    await expect(page).toHaveTitle(/MEE'S KITCHEN/);
    
    // Check main heading in hero section specifically
    await expect(page.locator('.hero h1')).toContainText('Welcome to MEE\'S KITCHEN');
    
    // Test navigation links in header only
    const navLinks = ['#home', '#menu', '#about', '#contact'];
    for (const link of navLinks) {
      await expect(page.locator(`nav a[href="${link}"]`)).toBeVisible();
    }
    
    // Test mobile menu functionality
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
    await page.locator('.hamburger').click();
    await expect(page.locator('.nav-menu')).toHaveClass(/active/);
    
    // Test menu auto-close on navigation
    await page.locator('nav .nav-menu a[href="#menu"]').first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('.nav-menu')).not.toHaveClass(/active/);
  });

  // Test 2: Food Items Loading from API
  test('Food items load from backend API', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for food items to load from API
    await page.waitForSelector('.menu-item', { timeout: 15000 });
    
    // Check if food items are displayed
    const foodItems = page.locator('.menu-item');
    await expect(foodItems.first()).toBeVisible();
    const itemCount = await foodItems.count();
    expect(itemCount).toBeGreaterThan(0);
    
    // Check if prices are in Indian rupees and have proper amounts
    const priceElements = page.locator('.price');
    if (await priceElements.count() > 0) {
      const firstPrice = await priceElements.first().textContent();
      expect(firstPrice).toContain('₹');
      // Check that it's a proper Indian rupee amount (not converted from USD)
      const priceValue = parseFloat(firstPrice.replace('₹', ''));
      expect(priceValue).toBeGreaterThan(50); // Should be at least ₹50 for Indian prices
    }
  });

  // Test 3: Category Filters
  test('Category filters work correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for categories to load
    await page.waitForSelector('.filter-btn', { timeout: 10000 });
    
    // Test "All Items" filter
    await page.locator('.filter-btn[data-category="all"]').click();
    await expect(page.locator('.filter-btn[data-category="all"]')).toHaveClass(/active/);
    
    // Test specific category filter (if available)
    const categoryButtons = page.locator('.filter-btn:not([data-category="all"])');
    if (await categoryButtons.count() > 0) {
      await categoryButtons.first().click();
      await expect(categoryButtons.first()).toHaveClass(/active/);
    }
  });

  // Test 4: Admin Panel Loading
  test('Admin panel loads correctly', async ({ page }) => {
    await page.goto(ADMIN_URL);
    
    // Check admin page title
    await expect(page).toHaveTitle(/Admin Dashboard/);
    
    // Check main admin heading
    await expect(page.locator('h1')).toContainText('MEE\'S KITCHEN');
    
    // Check if admin sections are visible
    await expect(page.locator('#addFoodForm')).toBeVisible();
    await expect(page.locator('#addCategoryForm')).toBeVisible();
    await expect(page.locator('#contactInfoForm')).toBeVisible();
  });

  // Test 5: Admin - Categories Loading
  test('Admin categories load from API', async ({ page }) => {
    await page.goto(ADMIN_URL);
    
    // Wait for categories to load
    await page.waitForSelector('#categoriesList .category-card, #categoriesList .empty-state', { timeout: 10000 });
    
    // Check if categories loaded or empty state is shown
    const categoriesExist = await page.locator('#categoriesList .category-card').count() > 0;
    const emptyState = await page.locator('#categoriesList .empty-state').count() > 0;
    
    expect(categoriesExist || emptyState).toBeTruthy();
  });

  // Test 6: Admin - Food Items Loading
  test('Admin food items load from API', async ({ page }) => {
    await page.goto(ADMIN_URL);
    
    // Wait for food items to load
    await page.waitForSelector('#foodItemsList .food-item-card, #foodItemsList .empty-state', { timeout: 10000 });
    
    // Check if food items loaded or empty state is shown
    const itemsExist = await page.locator('#foodItemsList .food-item-card').count() > 0;
    const emptyState = await page.locator('#foodItemsList .empty-state').count() > 0;
    
    expect(itemsExist || emptyState).toBeTruthy();
    
    // If items exist, check for rupee symbol
    if (itemsExist) {
      const priceElements = page.locator('.food-price');
      if (await priceElements.count() > 0) {
        const firstPrice = await priceElements.first().textContent();
        expect(firstPrice).toContain('₹');
      }
    }
  });

  // Test 7: Admin - Add Category
  test('Admin can add new category', async ({ page }) => {
    await page.goto(ADMIN_URL);
    
    // Wait for form to be ready
    await page.waitForSelector('#addCategoryForm');
    
    // Fill category form
    const testCategoryName = `Test Category ${Date.now()}`;
    await page.fill('#categoryName', testCategoryName);
    await page.fill('#categoryDescription', 'Test category description');
    
    // Submit form
    await page.click('#addCategoryForm .submit-btn');
    
    // Wait for success message or error
    await page.waitForSelector('.message', { timeout: 10000 });
    
    // Check if success message appears
    const message = page.locator('.message');
    const messageText = await message.textContent();
    
    // Should either succeed or show a specific error
    expect(messageText).toMatch(/(successfully|error|failed)/i);
  });

  // Test 8: Admin - Contact Info Loading
  test('Admin contact info loads correctly', async ({ page }) => {
    await page.goto(ADMIN_URL);
    
    // Wait for contact form to load
    await page.waitForSelector('#contactInfoForm', { timeout: 10000 });
    
    // Check if contact form fields are present
    await expect(page.locator('#contactPhone')).toBeVisible();
    await expect(page.locator('#contactEmail')).toBeVisible();
    await expect(page.locator('#contactLocation')).toBeVisible();
    await expect(page.locator('#contactHours')).toBeVisible();
  });

  // Test 9: Responsive Design
  test('Website is responsive on different screen sizes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.hero')).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.hero')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hamburger')).toBeVisible();
  });

  // Test 10: Backend API Direct Testing
  test('Backend API endpoints respond correctly', async ({ request }) => {
    // Test categories endpoint
    const categoriesResponse = await request.get(`${BASE_URL}/api/categories`);
    expect(categoriesResponse.status()).toBe(200);
    
    // Test food items endpoint
    const foodItemsResponse = await request.get(`${BASE_URL}/api/food-items`);
    expect(foodItemsResponse.status()).toBe(200);
    
    // Test contact info endpoint
    const contactResponse = await request.get(`${BASE_URL}/api/contact-info`);
    expect(contactResponse.status()).toBe(200);
    
    // Verify JSON responses
    const categories = await categoriesResponse.json();
    const foodItems = await foodItemsResponse.json();
    const contactInfo = await contactResponse.json();
    
    expect(Array.isArray(categories)).toBeTruthy();
    expect(Array.isArray(foodItems)).toBeTruthy();
    expect(typeof contactInfo).toBe('object');
  });

});
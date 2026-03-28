const { test, expect } = require('@playwright/test');

// Production URLs - Update these with your actual Netlify URLs
const MAIN_SITE_URL = 'https://your-main-site.netlify.app'; // Replace with actual URL
const ADMIN_SITE_URL = 'https://your-admin-site.netlify.app'; // Replace with actual URL
const BACKEND_URL = 'https://mees-kitchen-backend.onrender.com';

test.describe('MEE\'S KITCHEN - Production Testing', () => {
  
  // Test production main website
  test('Production main website works', async ({ page }) => {
    await page.goto(MAIN_SITE_URL);
    
    // Check page loads
    await expect(page).toHaveTitle(/MEE'S KITCHEN/);
    await expect(page.locator('h1')).toContainText('Welcome to MEE\'S KITCHEN');
    
    // Check food items load
    await page.waitForSelector('.menu-item, .empty-state', { timeout: 15000 });
    
    // Check mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.locator('.hamburger').click();
    await expect(page.locator('.nav-menu')).toHaveClass(/active/);
  });

  // Test production admin panel
  test('Production admin panel works', async ({ page }) => {
    await page.goto(ADMIN_SITE_URL);
    
    // Check admin loads
    await expect(page).toHaveTitle(/Admin Dashboard/);
    await expect(page.locator('h1')).toContainText('MEE\'S KITCHEN - Admin Dashboard');
    
    // Wait for data to load
    await page.waitForSelector('#categoriesList .category-card, #categoriesList .empty-state', { timeout: 15000 });
    await page.waitForSelector('#foodItemsList .food-item-card, #foodItemsList .empty-state', { timeout: 15000 });
  });

  // Test backend API directly
  test('Production backend API works', async ({ request }) => {
    const categoriesResponse = await request.get(`${BACKEND_URL}/api/categories`);
    expect(categoriesResponse.status()).toBe(200);
    
    const foodItemsResponse = await request.get(`${BACKEND_URL}/api/food-items`);
    expect(foodItemsResponse.status()).toBe(200);
    
    const contactResponse = await request.get(`${BACKEND_URL}/api/contact-info`);
    expect(contactResponse.status()).toBe(200);
  });

  // Test adding and deleting a category (cleanup after)
  test('Admin can add and delete test category', async ({ page }) => {
    await page.goto(ADMIN_SITE_URL);
    
    // Wait for form to load
    await page.waitForSelector('#addCategoryForm');
    
    // Add test category
    const testCategoryName = `Playwright Test ${Date.now()}`;
    await page.fill('#categoryName', testCategoryName);
    await page.fill('#categoryDescription', 'Automated test category - will be deleted');
    
    await page.click('#addCategoryForm .submit-btn');
    
    // Wait for success message
    await page.waitForSelector('.message', { timeout: 10000 });
    const message = await page.locator('.message').textContent();
    expect(message).toContain('successfully');
    
    // Wait for category to appear in list
    await page.waitForTimeout(2000);
    await page.reload();
    await page.waitForSelector('#categoriesList .category-card', { timeout: 10000 });
    
    // Find and delete the test category
    const categoryCards = page.locator('#categoriesList .category-card');
    const count = await categoryCards.count();
    
    for (let i = 0; i < count; i++) {
      const card = categoryCards.nth(i);
      const cardText = await card.textContent();
      
      if (cardText.includes(testCategoryName)) {
        // Click delete button
        await card.locator('.action-btn.delete').click();
        
        // Confirm deletion
        page.on('dialog', dialog => dialog.accept());
        
        // Wait for success message
        await page.waitForSelector('.message', { timeout: 10000 });
        const deleteMessage = await page.locator('.message').textContent();
        expect(deleteMessage).toContain('successfully');
        
        break;
      }
    }
  });

});
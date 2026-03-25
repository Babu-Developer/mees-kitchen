// Global variables
let foodItems = [];
let categories = [];

// DOM elements
const menuGrid = document.getElementById('menuGrid');
const categoryFilters = document.querySelector('.category-filters');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadFoodItems();
    loadCategories();
    loadContactInfo();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load food items from API
async function loadFoodItems() {
    try {
        const response = await fetch('/api/food-items');
        foodItems = await response.json();
        displayFoodItems(foodItems);
    } catch (error) {
        console.error('Error loading food items:', error);
        showMessage('Error loading menu items', 'error');
    }
}

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        updateCategoryFilters();
        updateCategorySelect();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Display food items in the menu grid
function displayFoodItems(items) {
    if (!menuGrid) return;
    
    if (items.length === 0) {
        menuGrid.innerHTML = '<div class="no-items"><p>No food items available at the moment.</p></div>';
        return;
    }

    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <img src="${item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop'}" 
                 alt="${item.name}" 
                 onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop'">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description || 'Delicious homemade food prepared with fresh ingredients.'}</p>
                <div class="menu-item-footer">
                    ${item.price ? `<span class="price">$${parseFloat(item.price).toFixed(2)}</span>` : ''}
                    ${item.category ? `<span class="category-tag">${item.category}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Update category filters
function updateCategoryFilters() {
    if (!categoryFilters) return;
    
    const uniqueCategories = [...new Set(categories.map(cat => cat.name))];
    
    categoryFilters.innerHTML = `
        <button class="filter-btn active" data-category="all">All Items</button>
        ${uniqueCategories.map(category => 
            `<button class="filter-btn" data-category="${category}">${category}</button>`
        ).join('')}
    `;

    // Add event listeners to filter buttons
    categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterItems(category);
            
            // Update active button
            categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Filter items by category
function filterItems(category) {
    const filteredItems = category === 'all' 
        ? foodItems 
        : foodItems.filter(item => item.category === category);
    displayFoodItems(filteredItems);
}

// Update category select in admin form
function updateCategorySelect() {
    const categorySelect = document.getElementById('categorySelect');
    if (!categorySelect) return;
    
    categorySelect.innerHTML = `
        <option value="">Select Category</option>
        ${categories.map(category => 
            `<option value="${category.name}">${category.name}</option>`
        ).join('')}
    `;
}

// Load contact information and update display
async function loadContactInfo() {
    try {
        const response = await fetch('/api/contact-info');
        if (response.ok) {
            const contactInfo = await response.json();
            updateContactDisplay(contactInfo);
        }
    } catch (error) {
        console.error('Error loading contact info:', error);
        // Keep default contact info if API fails
    }
}

// Update contact display based on available information
function updateContactDisplay(contactInfo) {
    const contactContainer = document.querySelector('.contact-info');
    if (!contactContainer) return;
    
    const contactItems = [];
    
    if (contactInfo.phone && contactInfo.phone.trim()) {
        contactItems.push(`
            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <div>
                    <h3>Phone</h3>
                    <p>${contactInfo.phone}</p>
                </div>
            </div>
        `);
    }
    
    if (contactInfo.email && contactInfo.email.trim()) {
        contactItems.push(`
            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <h3>Email</h3>
                    <p>${contactInfo.email}</p>
                </div>
            </div>
        `);
    }
    
    if (contactInfo.location && contactInfo.location.trim()) {
        contactItems.push(`
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <h3>Location</h3>
                    <p>${contactInfo.location}</p>
                </div>
            </div>
        `);
    }
    
    if (contactInfo.hours && contactInfo.hours.trim()) {
        contactItems.push(`
            <div class="contact-item">
                <i class="fas fa-clock"></i>
                <div>
                    <h3>Hours</h3>
                    <p>${contactInfo.hours}</p>
                </div>
            </div>
        `);
    }
    
    if (contactItems.length > 0) {
        contactContainer.innerHTML = contactItems.join('');
    } else {
        contactContainer.innerHTML = `
            <div class="contact-item">
                <i class="fas fa-info-circle"></i>
                <div>
                    <h3>Contact Information</h3>
                    <p>Contact details will be updated soon!</p>
                </div>
            </div>
        `;
    }
    
    // Update social media links
    updateSocialMediaLinks(contactInfo);
}
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.remove();
        style.remove();
    }, 3000);
}

// Update social media links
function updateSocialMediaLinks(contactInfo) {
    const socialLinksContainer = document.querySelector('.social-links');
    if (!socialLinksContainer) return;
    
    const socialLinks = [];
    
    if (contactInfo.facebook_url && contactInfo.facebook_url.trim()) {
        socialLinks.push(`
            <a href="${contactInfo.facebook_url}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-facebook"></i>
            </a>
        `);
    }
    
    if (contactInfo.instagram_url && contactInfo.instagram_url.trim()) {
        socialLinks.push(`
            <a href="${contactInfo.instagram_url}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-instagram"></i>
            </a>
        `);
    }
    
    if (contactInfo.twitter_url && contactInfo.twitter_url.trim()) {
        socialLinks.push(`
            <a href="${contactInfo.twitter_url}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-twitter"></i>
            </a>
        `);
    }
    
    if (socialLinks.length > 0) {
        socialLinksContainer.innerHTML = socialLinks.join('');
        socialLinksContainer.parentElement.style.display = 'block';
    } else {
        socialLinksContainer.parentElement.style.display = 'none';
    }
}
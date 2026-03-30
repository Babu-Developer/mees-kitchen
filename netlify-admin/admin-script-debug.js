// API Base URL - Use backend for deployment
const API_BASE_URL = 'https://mees-kitchen-backend.onrender.com';

// Debug: Check if script is loading
console.log('🔧 Admin script loaded successfully!');
console.log('API_BASE_URL:', API_BASE_URL);

// Global variables
let categories = [];
let foodItems = [];
let isEditingItem = false;
let isEditingCategory = false;

// DOM elements
const addFoodForm = document.getElementById('addFoodForm');
const addCategoryForm = document.getElementById('addCategoryForm');
const foodItemsList = document.getElementById('foodItemsList');
const categoriesList = document.getElementById('categoriesList');
const categorySelect = document.getElementById('foodCategory');
const imageInput = document.getElementById('foodImage');
const imagePreview = document.getElementById('imagePreview');
const messageContainer = document.getElementById('messageContainer');

// Edit form elements
const editItemId = document.getElementById('editItemId');
const submitItemBtn = document.getElementById('submitItemBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const imageRequired = document.getElementById('imageRequired');

const editCategoryId = document.getElementById('editCategoryId');
const submitCategoryBtn = document.getElementById('submitCategoryBtn');
const cancelCategoryEditBtn = document.getElementById('cancelCategoryEditBtn');

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Admin panel initializing...');
    console.log('Testing DOM elements:');
    console.log('addFoodForm:', addFoodForm);
    console.log('addCategoryForm:', addCategoryForm);
    
    loadCategories();
    loadFoodItems();
    loadContactInfo();
    setupEventListeners();
    
    console.log('✅ Initialization complete');
});

// Setup event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Form submissions with debugging
    if (addFoodForm) {
        addFoodForm.addEventListener('submit', function(e) {
            console.log('🍕 Food form submitted!');
            handleAddFood(e);
        });
        console.log('✅ Food form listener added');
    } else {
        console.error('❌ addFoodForm not found!');
    }
    
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(e) {
            console.log('📂 Category form submitted!');
            handleAddCategory(e);
        });
        console.log('✅ Category form listener added');
    } else {
        console.error('❌ addCategoryForm not found!');
    }
    
    const contactForm = document.getElementById('contactInfoForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('📞 Contact form submitted!');
            handleContactInfo(e);
        });
        console.log('✅ Contact form listener added');
    } else {
        console.error('❌ contactInfoForm not found!');
    }
    
    // Image preview
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
    
    // Refresh buttons
    const refreshItems = document.getElementById('refreshItems');
    const refreshCategories = document.getElementById('refreshCategories');
    const clearSampleData = document.getElementById('clearSampleData');
    
    if (refreshItems) refreshItems.addEventListener('click', loadFoodItems);
    if (refreshCategories) refreshCategories.addEventListener('click', loadCategories);
    if (clearSampleData) clearSampleData.addEventListener('click', clearSampleData);
    
    // Cancel edit buttons
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', cancelItemEdit);
    if (cancelCategoryEditBtn) cancelCategoryEditBtn.addEventListener('click', cancelCategoryEdit);
    
    console.log('✅ All event listeners set up');
}

// Handle add category form submission
async function handleAddCategory(e) {
    e.preventDefault();
    console.log('🚀 handleAddCategory called');
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        console.log('📝 Processing category form...');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> Adding Category...';
        
        const formData = new FormData(e.target);
        const categoryData = {
            name: formData.get('name'),
            description: formData.get('description')
        };
        
        console.log('📊 Category data:', categoryData);
        
        if (!categoryData.name) {
            throw new Error('Category name is required');
        }
        
        const url = `${API_BASE_URL}/api/categories`;
        console.log('🌐 Making API call to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });
        
        console.log('📡 API response status:', response.status);
        const result = await response.json();
        console.log('📋 API result:', result);
        
        if (response.ok) {
            console.log('✅ Category added successfully!');
            showMessage('Category added successfully! 🎉', 'success');
            e.target.reset();
            loadCategories();
        } else {
            throw new Error(result.error || 'Failed to add category');
        }
    } catch (error) {
        console.error('❌ Error with category:', error);
        showMessage(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Simplified message function for debugging
function showMessage(message, type = 'info') {
    console.log(`📢 Message (${type}):`, message);
    
    if (!messageContainer) {
        console.error('❌ messageContainer not found!');
        alert(`${type.toUpperCase()}: ${message}`);
        return;
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `<span>${message}</span>`;
    messageContainer.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Simplified load functions for debugging
async function loadCategories() {
    console.log('📂 Loading categories...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        console.log('Categories response:', response.status);
        if (response.ok) {
            categories = await response.json();
            console.log('Categories loaded:', categories.length);
            updateCategorySelect();
            displayCategories();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        displayEmptyState('categoriesList', 'No categories available');
    }
}

async function loadFoodItems() {
    console.log('🍕 Loading food items...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/food-items`);
        console.log('Food items response:', response.status);
        if (response.ok) {
            foodItems = await response.json();
            console.log('Food items loaded:', foodItems.length);
            displayFoodItems();
        }
    } catch (error) {
        console.error('Error loading food items:', error);
        displayEmptyState('foodItemsList', 'No food items available');
    }
}

async function loadContactInfo() {
    console.log('📞 Loading contact info...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact-info`);
        if (response.ok) {
            const contactInfo = await response.json();
            console.log('Contact info loaded:', contactInfo);
            
            // Fill form with contact data
            if (document.getElementById('contactPhone')) document.getElementById('contactPhone').value = contactInfo.phone || '';
            if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = contactInfo.email || '';
            if (document.getElementById('contactLocation')) document.getElementById('contactLocation').value = contactInfo.location || '';
            if (document.getElementById('contactHours')) document.getElementById('contactHours').value = contactInfo.hours || '';
            if (document.getElementById('facebookUrl')) document.getElementById('facebookUrl').value = contactInfo.facebook_url || '';
            if (document.getElementById('instagramUrl')) document.getElementById('instagramUrl').value = contactInfo.instagram_url || '';
            if (document.getElementById('twitterUrl')) document.getElementById('twitterUrl').value = contactInfo.twitter_url || '';
            
            // Update preview
            updateContactPreview();
        }
    } catch (error) {
        console.error('❌ Error loading contact info:', error);
    }
}

// Handle add food form submission
async function handleAddFood(e) {
    e.preventDefault();
    console.log('🍕 handleAddFood called');
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> ' + (isEditingItem ? 'Updating...' : 'Adding Food Item...');
        
        const formData = new FormData(e.target);
        const editId = editItemId.value;
        
        // Validate required fields
        if (!formData.get('name') || !formData.get('category')) {
            throw new Error('Please fill in all required fields');
        }
        
        // For new items, image is required
        if (!isEditingItem && !formData.get('image')) {
            throw new Error('Please select an image for the food item');
        }
        
        const url = isEditingItem ? `${API_BASE_URL}/api/food-items/${editId}` : `${API_BASE_URL}/api/food-items`;
        const method = isEditingItem ? 'PUT' : 'POST';
        
        console.log('🌐 Making API call to:', url, 'Method:', method);
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        console.log('📡 API response status:', response.status);
        const result = await response.json();
        console.log('📋 API result:', result);
        
        if (response.ok) {
            console.log('✅ Food item operation successful!');
            showMessage((isEditingItem ? 'Food item updated' : 'Food item added') + ' successfully! 🎉', 'success');
            e.target.reset();
            if (imagePreview) {
                imagePreview.style.display = 'none';
                imagePreview.innerHTML = '';
            }
            
            if (isEditingItem) {
                cancelItemEdit();
            }
            
            loadFoodItems(); // Refresh the list
        } else {
            throw new Error(result.error || 'Failed to ' + (isEditingItem ? 'update' : 'add') + ' food item');
        }
    } catch (error) {
        console.error('❌ Error with food item:', error);
        showMessage(error.message, 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Handle contact info form submission
async function handleContactInfo(e) {
    e.preventDefault();
    console.log('📞 handleContactInfo called');
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> Updating Contact Info...';
        
        const formData = new FormData(e.target);
        const contactData = {
            phone: formData.get('phone'),
            email: formData.get('email'),
            location: formData.get('location'),
            hours: formData.get('hours'),
            facebook_url: formData.get('facebook_url'),
            instagram_url: formData.get('instagram_url'),
            twitter_url: formData.get('twitter_url')
        };
        
        console.log('📊 Contact data:', contactData);
        console.log('🌐 Making API call to:', `${API_BASE_URL}/api/contact-info`);
        
        const response = await fetch(`${API_BASE_URL}/api/contact-info`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        console.log('📡 API response status:', response.status);
        const result = await response.json();
        console.log('📋 API result:', result);
        
        if (response.ok) {
            console.log('✅ Contact info updated successfully!');
            showMessage('Contact information updated successfully! 🎉', 'success');
            updateContactPreview();
        } else {
            throw new Error(result.error || 'Failed to update contact information');
        }
    } catch (error) {
        console.error('❌ Error updating contact info:', error);
        showMessage(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Handle image preview
function handleImagePreview(e) {
    console.log('🖼️ Image preview triggered');
    const file = e.target.files[0];
    if (file && imagePreview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else if (imagePreview) {
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
    }
}

function cancelItemEdit() {
    console.log('❌ Cancel item edit');
}

function cancelCategoryEdit() {
    console.log('❌ Cancel category edit');
}

console.log('🎯 Admin script fully loaded and ready!');

// Update category select dropdown
function updateCategorySelect() {
    if (!categorySelect) return;
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Display categories
function displayCategories() {
    if (!categoriesList) return;
    
    if (categories.length === 0) {
        displayEmptyState('categoriesList', 'No categories found. Add your first category!');
        return;
    }
    
    categoriesList.innerHTML = categories.map(category => `
        <div class="category-card">
            <h4>${category.name}</h4>
            <p>${category.description || 'No description provided'}</p>
            <div class="category-actions">
                <button class="action-btn edit" onclick="editCategory(${category.id})" title="Edit Category">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteCategory(${category.id})" title="Delete Category">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Display food items
function displayFoodItems() {
    if (!foodItemsList) return;
    
    if (foodItems.length === 0) {
        displayEmptyState('foodItemsList', 'No food items found. Add your first food item!');
        return;
    }
    
    foodItemsList.innerHTML = foodItems.map(item => `
        <div class="food-item-card">
            <img src="${item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop'}" 
                 alt="${item.name}"
                 onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop'">
            <div class="food-item-info">
                <h4>${item.name}</h4>
                <p>${item.description || 'No description provided'}</p>
                <div class="food-item-meta">
                    ${item.price ? `<span class="food-price">₹${parseFloat(item.price).toFixed(2)}</span>` : '<span class="food-price">Price not set</span>'}
                    ${item.category ? `<span class="food-category">${item.category}</span>` : '<span class="food-category">No category</span>'}
                </div>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editFood(${item.id})" title="Edit Item">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteFood(${item.id})" title="Delete Item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display empty state
function displayEmptyState(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>${message}</h3>
            <p>Get started by adding your first item!</p>
        </div>
    `;
}

// Update contact preview
function updateContactPreview() {
    const phone = document.getElementById('contactPhone')?.value || '';
    const email = document.getElementById('contactEmail')?.value || '';
    const location = document.getElementById('contactLocation')?.value || '';
    const hours = document.getElementById('contactHours')?.value || '';
    const facebook = document.getElementById('facebookUrl')?.value || '';
    const instagram = document.getElementById('instagramUrl')?.value || '';
    const twitter = document.getElementById('twitterUrl')?.value || '';
    
    const preview = document.getElementById('contactPreview');
    if (!preview) return;
    
    const contactItems = [
        { icon: 'fas fa-phone', label: 'Phone', value: phone },
        { icon: 'fas fa-envelope', label: 'Email', value: email },
        { icon: 'fas fa-map-marker-alt', label: 'Location', value: location },
        { icon: 'fas fa-clock', label: 'Hours', value: hours }
    ];
    
    let previewHTML = contactItems.map(item => {
        if (item.value.trim()) {
            return `
                <div class="contact-preview-item">
                    <i class="${item.icon}"></i>
                    <span><strong>${item.label}:</strong> ${item.value}</span>
                </div>
            `;
        } else {
            return `
                <div class="contact-preview-item empty">
                    <i class="${item.icon}"></i>
                    <span><strong>${item.label}:</strong> Not set</span>
                </div>
            `;
        }
    }).join('');
    
    preview.innerHTML = previewHTML;
}

// Placeholder functions for edit/delete operations
function editFood(id) { console.log('Edit food:', id); }
function deleteFood(id) { console.log('Delete food:', id); }
function editCategory(id) { console.log('Edit category:', id); }
function deleteCategory(id) { console.log('Delete category:', id); }
function cancelItemEdit() { console.log('Cancel item edit'); }
function cancelCategoryEdit() { console.log('Cancel category edit'); }
function clearSampleData() { console.log('Clear sample data'); }
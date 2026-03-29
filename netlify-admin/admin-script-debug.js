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
        }
    } catch (error) {
        console.error('Error loading categories:', error);
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
        }
    } catch (error) {
        console.error('Error loading food items:', error);
    }
}

async function loadContactInfo() {
    console.log('📞 Loading contact info...');
    // Simplified for debugging
}

// Placeholder functions
function handleAddFood(e) {
    console.log('🍕 handleAddFood called - not implemented in debug version');
    e.preventDefault();
}

function handleContactInfo(e) {
    console.log('📞 handleContactInfo called - not implemented in debug version');
    e.preventDefault();
}

function handleImagePreview(e) {
    console.log('🖼️ Image preview triggered');
}

function cancelItemEdit() {
    console.log('❌ Cancel item edit');
}

function cancelCategoryEdit() {
    console.log('❌ Cancel category edit');
}

console.log('🎯 Admin script fully loaded and ready!');
// API Base URL - Update this with your Render backend URL
const API_BASE_URL = 'https://mees-kitchen-backend.onrender.com';

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
    loadCategories();
    loadFoodItems();
    loadContactInfo();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submissions
    addFoodForm.addEventListener('submit', handleAddFood);
    addCategoryForm.addEventListener('submit', handleAddCategory);
    document.getElementById('contactInfoForm').addEventListener('submit', handleContactInfo);
    
    // Image preview
    imageInput.addEventListener('change', handleImagePreview);
    
    // Refresh buttons
    document.getElementById('refreshItems').addEventListener('click', loadFoodItems);
    document.getElementById('refreshCategories').addEventListener('click', loadCategories);
    document.getElementById('clearSampleData').addEventListener('click', clearSampleData);
    
    // Cancel edit buttons
    cancelEditBtn.addEventListener('click', cancelItemEdit);
    cancelCategoryEditBtn.addEventListener('click', cancelCategoryEdit);
    
    // Contact form inputs for live preview
    const contactInputs = ['contactPhone', 'contactEmail', 'contactLocation', 'contactHours', 'facebookUrl', 'instagramUrl', 'twitterUrl'];
    contactInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', updateContactPreview);
    });
    
    // File upload drag and drop
    const fileUploadArea = document.querySelector('.file-upload-area');
    
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#e74c3c';
        fileUploadArea.style.background = '#fff';
    });
    
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#e1e8ed';
        fileUploadArea.style.background = '#f8f9fa';
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#e1e8ed';
        fileUploadArea.style.background = '#f8f9fa';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageInput.files = files;
            handleImagePreview({ target: imageInput });
        }
    });
}

// Handle image preview
function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
    }
}

// Load categories from API
async function loadCategories() {
    try {
        showLoading('categories');
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        
        if (response.ok) {
            categories = await response.json();
            updateCategorySelect();
            displayCategories();
        } else {
            throw new Error('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        displayEmptyState('categoriesList', 'No categories available');
    } finally {
        hideLoading('categories');
    }
}

// Load food items from API
async function loadFoodItems() {
    try {
        showLoading('items');
        const response = await fetch(`${API_BASE_URL}/api/food-items`);
        
        if (response.ok) {
            foodItems = await response.json();
            displayFoodItems();
        } else {
            throw new Error('Failed to load food items');
        }
    } catch (error) {
        console.error('Error loading food items:', error);
        displayEmptyState('foodItemsList', 'No food items available');
    } finally {
        hideLoading('items');
    }
}

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
                    ${item.price ? `<span class="food-price">${parseFloat(item.price).toFixed(2)}</span>` : '<span class="food-price">Price not set</span>'}
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

// Handle add food form submission
async function handleAddFood(e) {
    e.preventDefault();
    
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
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage((isEditingItem ? 'Food item updated' : 'Food item added') + ' successfully! 🎉', 'success');
            e.target.reset();
            imagePreview.style.display = 'none';
            imagePreview.innerHTML = '';
            
            if (isEditingItem) {
                cancelItemEdit();
            }
            
            loadFoodItems(); // Refresh the list
        } else {
            throw new Error(result.error || 'Failed to ' + (isEditingItem ? 'update' : 'add') + ' food item');
        }
    } catch (error) {
        console.error('Error with food item:', error);
        showMessage(error.message, 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Handle add category form submission
async function handleAddCategory(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> ' + (isEditingCategory ? 'Updating...' : 'Adding Category...');
        
        const formData = new FormData(e.target);
        const editId = editCategoryId.value;
        const categoryData = {
            name: formData.get('name'),
            description: formData.get('description')
        };
        
        // Validate required fields
        if (!categoryData.name) {
            throw new Error('Category name is required');
        }
        
        const url = isEditingCategory ? `${API_BASE_URL}/api/categories/${editId}` : `${API_BASE_URL}/api/categories`;
        const method = isEditingCategory ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage((isEditingCategory ? 'Category updated' : 'Category added') + ' successfully! 🎉', 'success');
            e.target.reset();
            
            if (isEditingCategory) {
                cancelCategoryEdit();
            }
            
            loadCategories(); // Refresh the list and dropdown
        } else {
            throw new Error(result.error || 'Failed to ' + (isEditingCategory ? 'update' : 'add') + ' category');
        }
    } catch (error) {
        console.error('Error with category:', error);
        showMessage(error.message, 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Delete food item
async function deleteFood(id) {
    if (!confirm('Are you sure you want to delete this food item? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/food-items/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Food item deleted successfully', 'success');
            loadFoodItems(); // Refresh the list
        } else {
            throw new Error(result.error || 'Failed to delete food item');
        }
    } catch (error) {
        console.error('Error deleting food item:', error);
        showMessage(error.message, 'error');
    }
}

// Show loading state
function showLoading(type) {
    if (type === 'categories') {
        categoriesList.innerHTML = '<div class="empty-state"><div class="spinner"></div><h3>Loading categories...</h3></div>';
    } else if (type === 'items') {
        foodItemsList.innerHTML = '<div class="empty-state"><div class="spinner"></div><h3>Loading food items...</h3></div>';
    }
}

// Hide loading state
function hideLoading(type) {
    // Loading will be replaced by actual content or empty state
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

// Show message to user
function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    messageEl.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    messageContainer.appendChild(messageEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
    
    // Remove on click
    messageEl.addEventListener('click', () => {
        messageEl.remove();
    });
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    loadFoodItems();
    loadCategories();
}, 30000);

// Edit food item
async function editFood(id) {
    try {
        const item = foodItems.find(item => item.id === id);
        if (!item) {
            showMessage('Food item not found', 'error');
            return;
        }
        
        // Fill form with item data
        document.getElementById('foodName').value = item.name;
        document.getElementById('foodDescription').value = item.description || '';
        document.getElementById('foodCategory').value = item.category || '';
        document.getElementById('foodPrice').value = item.price || '';
        editItemId.value = id;
        
        // Show current image
        if (item.image_url) {
            imagePreview.innerHTML = `<img src="${item.image_url}" alt="Current image">`;
            imagePreview.style.display = 'block';
        }
        
        // Update UI for editing
        isEditingItem = true;
        submitItemBtn.innerHTML = '<i class="fas fa-save"></i> Update Food Item';
        cancelEditBtn.style.display = 'inline-block';
        imageRequired.textContent = ''; // Image not required for edit
        imageInput.removeAttribute('required');
        
        // Scroll to form
        document.querySelector('.admin-card').scrollIntoView({ behavior: 'smooth' });
        
        showMessage('Editing food item. Make changes and click Update.', 'info');
    } catch (error) {
        console.error('Error editing food item:', error);
        showMessage('Error loading food item for editing', 'error');
    }
}

// Cancel item edit
function cancelItemEdit() {
    isEditingItem = false;
    editItemId.value = '';
    addFoodForm.reset();
    imagePreview.style.display = 'none';
    imagePreview.innerHTML = '';
    
    // Reset UI
    submitItemBtn.innerHTML = '<i class="fas fa-save"></i> Add Food Item';
    cancelEditBtn.style.display = 'none';
    imageRequired.textContent = '*'; // Image required for new items
    imageInput.setAttribute('required', 'required');
}

// Edit category
async function editCategory(id) {
    try {
        const category = categories.find(cat => cat.id === id);
        if (!category) {
            showMessage('Category not found', 'error');
            return;
        }
        
        // Fill form with category data
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description || '';
        editCategoryId.value = id;
        
        // Update UI for editing
        isEditingCategory = true;
        submitCategoryBtn.innerHTML = '<i class="fas fa-save"></i> Update Category';
        cancelCategoryEditBtn.style.display = 'inline-block';
        
        // Scroll to form
        document.querySelectorAll('.admin-card')[1].scrollIntoView({ behavior: 'smooth' });
        
        showMessage('Editing category. Make changes and click Update.', 'info');
    } catch (error) {
        console.error('Error editing category:', error);
        showMessage('Error loading category for editing', 'error');
    }
}

// Cancel category edit
function cancelCategoryEdit() {
    isEditingCategory = false;
    editCategoryId.value = '';
    addCategoryForm.reset();
    
    // Reset UI
    submitCategoryBtn.innerHTML = '<i class="fas fa-plus"></i> Add Category';
    cancelCategoryEditBtn.style.display = 'none';
}

// Delete category
async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Category deleted successfully', 'success');
            loadCategories(); // Refresh the list and dropdown
        } else {
            throw new Error(result.error || 'Failed to delete category');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        showMessage(error.message, 'error');
    }
}

// Load contact information
async function loadContactInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact-info`);
        if (response.ok) {
            const contactInfo = await response.json();
            
            // Fill form with contact data
            document.getElementById('contactPhone').value = contactInfo.phone || '';
            document.getElementById('contactEmail').value = contactInfo.email || '';
            document.getElementById('contactLocation').value = contactInfo.location || '';
            document.getElementById('contactHours').value = contactInfo.hours || '';
            document.getElementById('facebookUrl').value = contactInfo.facebook_url || '';
            document.getElementById('instagramUrl').value = contactInfo.instagram_url || '';
            document.getElementById('twitterUrl').value = contactInfo.twitter_url || '';
            
            // Update preview
            updateContactPreview();
        }
    } catch (error) {
        console.error('Error loading contact info:', error);
    }
}

// Handle contact info form submission
async function handleContactInfo(e) {
    e.preventDefault();
    
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
        
        const response = await fetch(`${API_BASE_URL}/api/contact-info`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Contact information updated successfully! 🎉', 'success');
            updateContactPreview();
        } else {
            throw new Error(result.error || 'Failed to update contact information');
        }
    } catch (error) {
        console.error('Error updating contact info:', error);
        showMessage(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Update contact preview
function updateContactPreview() {
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    const location = document.getElementById('contactLocation').value;
    const hours = document.getElementById('contactHours').value;
    const facebook = document.getElementById('facebookUrl').value;
    const instagram = document.getElementById('instagramUrl').value;
    const twitter = document.getElementById('twitterUrl').value;
    
    const preview = document.getElementById('contactPreview');
    
    const contactItems = [
        { icon: 'fas fa-phone', label: 'Phone', value: phone },
        { icon: 'fas fa-envelope', label: 'Email', value: email },
        { icon: 'fas fa-map-marker-alt', label: 'Location', value: location },
        { icon: 'fas fa-clock', label: 'Hours', value: hours }
    ];
    
    const socialItems = [
        { icon: 'fab fa-facebook', label: 'Facebook', value: facebook, color: '#1877f2' },
        { icon: 'fab fa-instagram', label: 'Instagram', value: instagram, color: '#e4405f' },
        { icon: 'fab fa-twitter', label: 'Twitter', value: twitter, color: '#1da1f2' }
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
                    <span><strong>${item.label}:</strong> Not set (won't appear on website)</span>
                </div>
            `;
        }
    }).join('');
    
    // Add social media preview
    const activeSocial = socialItems.filter(item => item.value.trim());
    if (activeSocial.length > 0) {
        previewHTML += `
            <div style="grid-column: 1 / -1; margin-top: 1rem;">
                <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">Social Media Links:</h4>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${activeSocial.map(item => `
                        <div class="contact-preview-item" style="flex: none; min-width: auto;">
                            <i class="${item.icon}" style="color: ${item.color};"></i>
                            <span>${item.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        previewHTML += `
            <div style="grid-column: 1 / -1; margin-top: 1rem;">
                <div class="contact-preview-item empty">
                    <i class="fab fa-facebook"></i>
                    <span><strong>Social Media:</strong> No links set (social icons won't appear)</span>
                </div>
            </div>
        `;
    }
    
    preview.innerHTML = previewHTML;
}

// Clear sample data
async function clearSampleData() {
    if (!confirm('Are you sure you want to clear all sample data? This will remove the demo food items and show only your real items.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/sample-data`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Sample data cleared successfully! Only your real food items will now be displayed.', 'success');
            loadFoodItems(); // Refresh the list
        } else {
            throw new Error(result.error || 'Failed to clear sample data');
        }
    } catch (error) {
        console.error('Error clearing sample data:', error);
        showMessage(error.message, 'error');
    }
}
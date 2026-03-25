# MEE'S KITCHEN - Frontend

This is the frontend build for Netlify deployment.

## Quick Setup:

1. **Update API URL** in both `script.js` and `admin-script.js`:
```javascript
const API_BASE_URL = 'https://your-backend-app.onrender.com';
```

2. **Deploy to Netlify**:
   - Drag & drop this folder to Netlify
   - Or connect GitHub repo

## Files:
- `index.html` - Main website
- `admin.html` - Admin panel  
- `script.js` - Main website JavaScript
- `admin-script.js` - Admin panel JavaScript
- `styles.css` - Main website styles
- `admin-styles.css` - Admin panel styles
- `_redirects` - Netlify routing rules

## Admin Access:
Visit: `https://your-netlify-app.netlify.app/admin.html`
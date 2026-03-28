# 🚀 GITHUB SETUP & DEPLOYMENT

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Name: `mees-kitchen`
4. Make it Public
5. Don't initialize with README (we already have one)
6. Click "Create Repository"

## Step 2: Push Code to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mees-kitchen.git
git push -u origin main
```

## Step 3: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. **Configuration**:
   - **Name**: `mees-kitchen-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Auto-Deploy**: Yes

5. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
```
DB_HOST=btkrsd42xiodbipn2ukc-mysql.services.clever-cloud.com
DB_USER=ug3qze2xm0xdurgq
DB_PASSWORD=VfmY3wJaKn07E2Zu38Nv
DB_NAME=btkrsd42xiodbipn2ukc
DB_PORT=3306
CLOUDINARY_CLOUD_NAME=dik5am6gf
CLOUDINARY_API_KEY=354741549171373
CLOUDINARY_API_SECRET=0JvKEgop99PuApG4Hc-JD8qxnB4
NODE_ENV=production
```

6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `https://mees-kitchen-backend.onrender.com`)

## Step 4: Deploy Frontend to Netlify

1. **Update API URLs** in `netlify-frontend/script.js` and `netlify-frontend/admin-script.js`:
```javascript
const API_BASE_URL = 'https://mees-kitchen-backend.onrender.com'; // Your actual Render URL
```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Drag & drop the `netlify-frontend` folder
   - Or click "Add new site" → "Deploy manually"

3. **Get your Netlify URL** (e.g., `https://amazing-name-123456.netlify.app`)

## Step 5: Update CORS (Important!)

1. Update `server.js` with your actual Netlify URL:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-actual-netlify-url.netlify.app' // Replace with your actual URL
  ],
  credentials: true
}));
```

2. Commit and push changes:
```bash
git add .
git commit -m "Updated CORS for production"
git push origin main
```

3. Render will auto-deploy the backend update

## 🎉 DONE!

- **Main Website**: `https://your-app.netlify.app`
- **Admin Panel**: `https://your-app.netlify.app/admin.html`
- **Backend API**: `https://your-backend.onrender.com`

## ✅ Features Working:
- Smart sample data system
- Full admin CRUD operations
- Image upload with Cloudinary
- Contact & social media management
- Fully responsive design
- Separate frontend/backend architecture
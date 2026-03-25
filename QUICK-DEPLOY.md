# 🚀 QUICK DEPLOYMENT GUIDE

## Backend (Render) - DEPLOY FIRST

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy Backend on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - New → Web Service
   - Connect GitHub repo
   - **Settings**:
     - Name: `mees-kitchen-backend`
     - Build Command: `npm install`
     - Start Command: `npm start`
   
3. **Environment Variables** (Add in Render):
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

4. **Get Backend URL**: Copy your Render app URL (e.g., `https://mees-kitchen-backend.onrender.com`)

## Frontend (Netlify) - DEPLOY SECOND

1. **Update API URL** in `netlify-frontend/script.js` and `netlify-frontend/admin-script.js`:
```javascript
const API_BASE_URL = 'https://your-backend-app.onrender.com';
```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Drag & drop the `netlify-frontend` folder
   - Or connect GitHub and deploy from `netlify-frontend` folder

3. **Update CORS** in backend:
   - Add your Netlify URL to CORS origins in `server.js`
   - Redeploy backend

## 🎯 Result:
- **Frontend**: `https://your-app.netlify.app` (Customer website)
- **Admin**: `https://your-app.netlify.app/admin.html` (Admin panel)
- **Backend**: `https://your-backend.onrender.com` (API server)

## ✅ Features Ready:
- Smart sample data (auto-hides when real data added)
- Full CRUD operations
- Image upload with Cloudinary
- Contact & social media management
- Fully responsive design
- Production-ready with separate frontend/backend
# MEE'S KITCHEN - Food Portfolio Website

A beautiful, responsive food portfolio website built with Node.js, Express, MySQL, and Cloudinary for image management.

## 🎯 **Smart Sample Data System**

**Perfect Solution**: When customers add their real food items, sample data automatically disappears!

- **Shows Samples**: When no real food items exist
- **Hides Samples**: Automatically when real items are added  
- **Clean Experience**: Customers never see mixed sample + real data

## ✨ Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Food Portfolio**: Showcase delicious food items with high-quality images
- **Category Filtering**: Filter food items by categories
- **Admin Panel**: Add, manage, and delete food items and categories
- **Image Upload**: Cloudinary integration for optimized image storage
- **Contact Management**: Update contact info and social media links
- **Smart Sample Data**: Automatically hides when real data is added

## 🚀 **Ready for Deployment**

### **Current Status:**
- ✅ **Database**: Connected with Render MySQL
- ✅ **Cloudinary**: Updated with production credentials
- ✅ **Sample Data**: Smart system (auto-hides when real data added)
- ✅ **Responsive**: Perfect on all devices
- ✅ **Production Ready**: All features tested and working

### **Quick Deploy to Render:**

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "MEE'S KITCHEN - Production Ready"
git branch -M main
git remote add origin https://github.com/yourusername/mees-kitchen.git
git push -u origin main
```

2. **Deploy on Render**:
   - Connect GitHub repo
   - Set environment variables (see RENDER-DEPLOYMENT.md)
   - Deploy!

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (Render/Clever Cloud compatible)
- **Image Storage**: Cloudinary
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: Render ready

## 📱 Responsive Design

- **Desktop**: Full-featured layout
- **Tablet**: Adapted grid system
- **Mobile**: Touch-optimized interface
- **All Devices**: Perfect user experience

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migration (if needed)
npm run migrate

# Start development server
npm run dev
```

## 🎯 **How Sample Data Works:**

1. **Initial State**: Shows 5 sample food items (1 per category)
2. **Customer Adds Real Item**: Sample data automatically hidden
3. **Clean Experience**: Only real food items displayed
4. **Admin Control**: "Clear Samples" button to remove sample data permanently

## 📊 **Admin Features:**

- **Add/Edit/Delete**: Food items with image upload
- **Category Management**: Create and manage food categories
- **Contact Info**: Update phone, email, location, hours
- **Social Media**: Add Facebook, Instagram, Twitter links
- **Sample Data Control**: Clear sample data when ready

## 🌐 **Live URLs:**
- **Main Website**: `/` - Customer-facing food portfolio
- **Admin Panel**: `/admin` - Management interface

## 📞 **Support:**

The website is production-ready with smart sample data management. When customers add their first real food item, samples automatically disappear for a clean, professional experience.

## 🔒 **Security:**
- Environment variables for all credentials
- Separate database tables (mees_* prefix)
- Cloudinary image optimization
- Input validation and sanitization

---

**Ready to deploy and start showcasing delicious food!** 🍽️✨
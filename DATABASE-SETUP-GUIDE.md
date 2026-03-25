# MEE'S KITCHEN Database Setup Guide

Since the Cloud SQL connection is timing out, here's how to manually set up the database:

## Option 1: Using Google Cloud Console (Recommended)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/sql/instances
   - Select your Cloud SQL instance

2. **Start the Instance** (if stopped)
   - Click on your instance name
   - If it shows "STOPPED", click "START"
   - Wait for it to show "RUNNABLE"

3. **Open Cloud Shell or SQL Client**
   - Click "OPEN CLOUD SHELL" button
   - Or use the built-in SQL client in the console

4. **Run the Setup Script**
   - Copy the contents of `database/mees-kitchen-setup.sql`
   - Paste and execute in the SQL client

## Option 2: Using MySQL Workbench or phpMyAdmin

1. **Connect to your Cloud SQL instance**
   - Host: `34.93.186.28` (or current IP)
   - Username: `root`
   - Password: `Sanjay@123`
   - Port: `3306`

2. **Run the SQL Script**
   - Open `database/mees-kitchen-setup.sql`
   - Execute the entire script

## Option 3: Check Current IP Address

Your Cloud SQL instance IP might have changed:

1. **Get Current IP**
   - Go to Cloud SQL console
   - Click on your instance
   - Check the "Connect to this instance" section
   - Copy the new IP address

2. **Update .env file**
   ```
   DB_HOST=NEW_IP_ADDRESS_HERE
   ```

3. **Try setup again**
   ```bash
   npm run setup-db
   ```

## Verification

After running the setup, you should have:

- ✅ Database: `mees_kitchen_db`
- ✅ Table: `mees_categories` (6 categories)
- ✅ Table: `mees_food_items` (6 sample items)

## Test Connection

Once database is set up, restart the server:

```bash
npm run dev
```

You should see:
```
Database connection successful!
MEE'S KITCHEN database tables initialized successfully
MEE'S KITCHEN server running on port 3000
```

## Troubleshooting

**If still getting connection timeout:**

1. **Check Cloud SQL Status**
   - Instance might be stopped
   - IP address might have changed
   - Firewall rules might be blocking

2. **Check Network**
   - Try from different network
   - Check if your IP is whitelisted in Cloud SQL

3. **Alternative: Use Local MySQL**
   - Install MySQL locally
   - Update .env with local credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_local_password
     ```

## Current Status

- ✅ **Website Working**: Sample data loaded
- ✅ **Cloudinary Ready**: Image uploads configured
- ⏳ **Database**: Needs manual setup
- ✅ **Admin Portal**: Ready to use once DB connected

The website works perfectly with sample data. Once database is connected, you can add real food items through the admin portal!
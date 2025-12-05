# How to Fix Image Loading Issue on Production

## Quick Summary

The images are broken because the **production database has Korean filenames** (e.g., `/images/아메리카노.jpg`) but the **actual image files use English names** (e.g., `americano.jpg`).

## Solution

I've created a migration script that will fix all the image URLs in your production database.

## Steps to Fix

### 1. Deploy the Code

```bash
cd /Users/pommedev/Desktop/order-app
git add .
git commit -m "Fix image URLs in production database"
git push
```

Render will automatically deploy the updated backend.

### 2. Run the Migration on Render

**Option A: Using Render Shell (Recommended)**

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click on your **backend service** (order-app-backend)
3. Click on the **Shell** tab
4. Run the migration:
   ```bash
   npm run fix-images
   ```

**Option B: Using Render Console**

1. Go to your backend service settings
2. Add a one-time job or use the console to run:
   ```bash
   node src/scripts/fixImageUrls.js
   ```

### 3. Verify the Fix

After running the migration:

1. **Check the API**:
   ```bash
   curl https://order-app-backend-5n71.onrender.com/api/menus | grep image_url
   ```
   You should see English filenames like `/images/americano.jpg`

2. **Visit your site**: https://order-app-frontend-4f59.onrender.com/
   - Images should now load correctly ✓
   - No 404 errors in console ✓

## What Was Changed

1. **Created**: `server/src/scripts/fixImageUrls.js` - Migration script
2. **Updated**: `server/src/config/initDatabase.js` - Better conflict handling
3. **Updated**: `server/package.json` - Added `fix-images` script

## Need Help?

If you have any issues accessing the Render shell or running the migration, let me know!

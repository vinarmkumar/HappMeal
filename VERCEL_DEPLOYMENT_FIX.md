# Vercel Backend Deployment Fix Guide

## Problem Diagnosis
Your Vercel backend was failing with `FUNCTION_INVOCATION_FAILED` error due to:
1. **File System Operations**: The logging system was trying to create files in a read-only serverless environment
2. **Complex Middleware**: Heavy logging middleware causing initialization issues
3. **Environment Detection**: Server wasn't properly detecting serverless environment

## Solution Implemented

### 1. Created Serverless-Optimized Server (`server-serverless.js`)
- Simplified logging that works in serverless environments
- Conditional middleware loading
- Optimized MongoDB connection settings for serverless
- Better error handling for serverless constraints

### 2. Updated API Entry Point (`api/index.js`)
- Enhanced error handling
- Proper CORS header management
- Uses serverless-optimized server

### 3. Improved Vercel Configuration (`vercel.json`)
- Increased memory allocation to 1024MB
- Set maximum duration to 30 seconds
- Simplified function configuration

### 4. Created Serverless Logger (`utils/serverless-logger.js`)
- No file system operations
- Console-only logging
- Optimized for serverless performance

## Deployment Steps

1. **Deploy to Vercel:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `UNSPLASH_ACCESS_KEY`: Your Unsplash API key
   - `FRONTEND_URL`: https://meal-cart-phi.vercel.app
   - `NODE_ENV`: production

3. **Test Deployment:**
   ```bash
   ./test-deployment.sh
   ```

## Environment Variables Required

Make sure these are set in your Vercel project settings:

```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-key
UNSPLASH_ACCESS_KEY=your-unsplash-key
FRONTEND_URL=https://meal-cart-phi.vercel.app
NODE_ENV=production
```

## Testing Endpoints

After deployment, test these URLs:

1. **Health Check**: https://meal-cart-backend.vercel.app/api/health
2. **CORS Test**: Check browser network tab when accessing from frontend
3. **Auth Test**: Try login/signup from your frontend

## Common Issues & Solutions

### Issue: Still getting 500 errors
**Solution**: Check Vercel function logs in dashboard

### Issue: CORS errors
**Solution**: Verify `FRONTEND_URL` environment variable is correct

### Issue: Database connection timeout
**Solution**: Check `MONGODB_URI` is correct and accessible

### Issue: Missing dependencies
**Solution**: Ensure all packages are in `dependencies` (not `devDependencies`)

## Monitoring

- Check Vercel dashboard for function logs
- Monitor response times (should be < 10 seconds)
- Watch for memory usage (should stay under 1024MB)

## Rollback Plan

If issues persist, you can:
1. Revert to simpler server configuration
2. Use original `server.js` with logging disabled
3. Contact Vercel support for serverless function debugging

---

**Next Steps**: Deploy these changes to Vercel and test the health endpoint!

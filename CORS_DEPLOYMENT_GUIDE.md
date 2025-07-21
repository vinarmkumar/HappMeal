# MealCart Vercel Deployment Guide for CORS Issue Resolution

This guide will help you properly configure your Vercel deployment to resolve CORS issues between your frontend and backend.

## Environment Variables Setup in Vercel

When deploying your backend to Vercel, you need to configure these environment variables in the Vercel project settings:

1. Log in to your Vercel dashboard
2. Select your backend project (meal-cart-backend)
3. Go to "Settings" → "Environment Variables"
4. Add the following environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `FRONTEND_URL` | `https://meal-cart-phi.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |
| `MONGODB_URI` | `your-mongodb-connection-string` | Production |
| `JWT_SECRET` | `your-jwt-secret` | Production |
| `GEMINI_API_KEY` | `your-gemini-api-key` | Production |
| `UNSPLASH_ACCESS_KEY` | `your-unsplash-key` | Production |

## Checking CORS Configuration

After deploying your backend, you can test if CORS is properly configured with this curl command:

```bash
curl -X OPTIONS \
  -H "Origin: https://meal-cart-phi.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v https://meal-cart-backend.vercel.app/api/auth/login
```

You should see the Access-Control headers in the response.

## Debugging Steps If CORS Issues Persist

1. **Check browser console:** Look for detailed error messages

2. **Clear browser cache:** Try in incognito/private mode

3. **Verify request origin:** Make sure your frontend is making requests from the allowed origin

4. **Test with a standalone CORS test:** Run the `test_cors.js` script locally:
   ```
   node test_cors.js
   ```

5. **Check Vercel logs:** In your Vercel dashboard, look for any errors in the Function Logs

## Additional Tips

- Make sure your frontend code is using the correct backend URL
- In `frontend/.env.production`, verify `VITE_API_URL` is set to `https://meal-cart-backend.vercel.app`
- If using fetch or Axios, ensure credentials are included: `{ credentials: 'include' }` or `{ withCredentials: true }`

## Quick Fix for Testing

If you need a quick workaround to test functionality, you can temporarily set your CORS settings to allow all origins:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

**Note:** This is only for testing! Remember to revert to your specific origin for production.

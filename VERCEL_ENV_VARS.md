# Vercel Environment Variables Configuration Guide

## Backend Environment Variables

Navigate to your backend project in the Vercel dashboard and add these environment variables:

1. **MONGODB_URI**: `mongodb+srv://vercel-admin-user:HulK12@cluster0.d2r2u.mongodb.net/mealcart`
2. **JWT_SECRET**: `b31f37ba3fee67bcbcd64f053a81ac9810e06fbe4663a81feb38223c19a57ce693a44ed362e0d1e881d81173df122fb0b99c4db549bf6a2b963d0c7e3589cd3c`
3. **GEMINI_API_KEY**: `AIzaSyCgn3vHKcEj54rNV3o0z1tTPM52eC2pT8A`
4. **UNSPLASH_ACCESS_KEY**: `z3DQuUBASnqky2iEcWR30iVi5R_j_NY5o4yeZvd0s8o`
5. **FRONTEND_URL**: `https://meal-cart-phi.vercel.app`
6. **NODE_ENV**: `production`
7. **CLERK_PUBLISHABLE_KEY**: `pk_test_aW50ZW5zZS1tdXNrb3gtMTYuY2xlcmsuYWNjb3VudHMuZGV2JA`
8. **CLERK_SECRET_KEY**: `sk_test_x9jB514fIS1xUijuZun3HQpecZfXQg7w0HfAn61yTQ`

## Frontend Environment Variables

Navigate to your frontend project in the Vercel dashboard and add these environment variables:

1. **VITE_API_URL**: `https://meal-cart-backend.vercel.app/api`
2. **VITE_CLERK_PUBLISHABLE_KEY**: `pk_test_aW50ZW5zZS1tdXNrb3gtMTYuY2xlcmsuYWNjb3VudHMuZGV2JA`

## After Setting Variables

After setting these variables, redeploy both projects to ensure the changes take effect.

## Verifying Connection

After redeploying, visit your frontend at https://meal-cart-phi.vercel.app and check:
1. User authentication works
2. API calls to the backend are successful
3. All features function as expected

If you encounter CORS errors, double-check the backend's CORS configuration and environment variables.

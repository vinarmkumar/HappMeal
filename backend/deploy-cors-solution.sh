#!/bin/bash

echo "===================================================="
echo "   DEPLOYING BACKEND WITH COMPREHENSIVE CORS FIX"
echo "===================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "Checking Vercel login status..."
vercel whoami &> /dev/null || (echo "Please log in to Vercel:" && vercel login)

# Deploy to Vercel with production flag and non-interactive mode
echo "Deploying to Vercel..."
echo "Note: This deployment specifically addresses CORS issues with preflight requests"
vercel --prod

echo ""
echo "===================================================="
echo "   DEPLOYMENT COMPLETE - VERIFY IN VERCEL DASHBOARD"
echo "===================================================="
echo ""
echo "IMPORTANT: Check these settings in your Vercel project:"
echo ""
echo "1. Verify Environment Variables are correctly set:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET" 
echo "   - FRONTEND_URL = https://meal-cart-phi.vercel.app"
echo "   - NODE_ENV = production"
echo ""
echo "2. Test your API with curl to check CORS headers:"
echo "   curl -X OPTIONS -H 'Origin: https://meal-cart-phi.vercel.app' \\"
echo "        -H 'Access-Control-Request-Method: POST' \\"
echo "        -H 'Access-Control-Request-Headers: Content-Type, Authorization' \\"
echo "        -I https://meal-cart-backend.vercel.app/api/auth/login"
echo ""
echo "3. If issues persist, check Vercel Function logs in the dashboard"
echo "===================================================="

#!/bin/bash

echo "=========================================================="
echo "  DEPLOYING BACKEND WITH ENHANCED CORS HANDLING FOR VERCEL"
echo "=========================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "Checking Vercel login status..."
vercel whoami &> /dev/null || (echo "Please log in to Vercel:" && vercel login)

echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "=========================================================="
echo "    CORS FIX DEPLOYMENT COMPLETE - NEXT STEPS"
echo "=========================================================="
echo ""
echo "1. Verify these environment variables in your Vercel project:"
echo "   - NODE_ENV = production"
echo "   - FRONTEND_URL = https://meal-cart-phi.vercel.app"
echo "   - MONGODB_URI is correctly set"
echo "   - JWT_SECRET is correctly set"
echo ""
echo "2. If issues persist after deployment, try these steps:"
echo "   a. Clear your browser cache completely"
echo "   b. Try an incognito/private browsing window"
echo "   c. Check the Vercel deployment logs for any errors"
echo ""
echo "3. To test the CORS setup manually, run:"
echo "   curl -X OPTIONS -H 'Origin: https://meal-cart-phi.vercel.app' \\"
echo "        -H 'Access-Control-Request-Method: POST' \\"
echo "        -H 'Access-Control-Request-Headers: Content-Type, Authorization' \\"
echo "        -v https://meal-cart-backend.vercel.app/api/auth/login"
echo ""
echo "=========================================================="

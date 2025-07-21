#!/bin/bash

echo "=== MealCart Full Stack Deployment ==="
echo "This script will deploy both backend and frontend to Vercel."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "Checking Vercel login status..."
vercel whoami &> /dev/null || (echo "Please log in to Vercel:" && vercel login)

# Deploy backend
echo ""
echo "=== Deploying Backend ==="
cd backend
vercel --prod

# Deploy frontend
echo ""
echo "=== Deploying Frontend ==="
cd ../frontend
vercel --prod

echo ""
echo "=== Deployment Complete ==="
echo "Make sure to check these environment variables in your Vercel projects:"
echo ""
echo "BACKEND:"
echo "- MONGODB_URI"
echo "- JWT_SECRET"
echo "- GEMINI_API_KEY"
echo "- UNSPLASH_ACCESS_KEY"
echo "- FRONTEND_URL: https://meal-cart-phi.vercel.app"
echo "- NODE_ENV: production"
echo ""
echo "FRONTEND:"
echo "- VITE_API_URL: https://meal-cart-backend.vercel.app/api"
echo "- VITE_CLERK_PUBLISHABLE_KEY"

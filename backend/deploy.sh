#!/bin/bash

echo "Deploying MealCart Backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "Checking Vercel login status..."
vercel whoami &> /dev/null || (echo "Please log in to Vercel:" && vercel login)

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Backend deployment complete!"
echo "Don't forget to set these environment variables in your Vercel project settings:"
echo "- MONGODB_URI"
echo "- JWT_SECRET"
echo "- GEMINI_API_KEY"
echo "- UNSPLASH_ACCESS_KEY"
echo "- FRONTEND_URL (URL of your frontend deployment)"

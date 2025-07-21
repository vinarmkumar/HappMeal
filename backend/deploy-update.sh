#!/bin/bash

echo "Deploying updated MealCart Backend to Vercel..."

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

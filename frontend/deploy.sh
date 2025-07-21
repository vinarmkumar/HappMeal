#!/bin/bash

echo "Deploying MealCart Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "Checking Vercel login status..."
vercel whoami &> /dev/null || (echo "Please log in to Vercel:" && vercel login)

# Ask for backend URL
echo "Enter your backend API URL (e.g., https://mealcart-backend.vercel.app):"
read backend_url

# Create or update .env file with backend URL
echo "VITE_API_URL=${backend_url}/api" > .env.production

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Frontend deployment complete!"
echo "Make sure to set these environment variables in your Vercel project settings:"
echo "- VITE_API_URL: ${backend_url}/api"
echo "- VITE_CLERK_PUBLISHABLE_KEY (if using Clerk authentication)"

#!/bin/bash

echo "Deploying updated backend to fix CORS issues..."

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

echo "Backend deployment complete!"
echo "Now check your frontend application to see if the CORS issue is resolved."
echo "If you still have issues, you might need to check your Vercel environment variables and make sure they are correctly set."

# Deploying MealCart to Vercel

This guide will help you deploy both the frontend and backend of MealCart to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional but recommended)
3. A MongoDB database (MongoDB Atlas is recommended)

## Frontend Deployment Steps

1. **Set up environment variables in Vercel:**
   - Go to your Vercel dashboard
   - Create a new project and import your GitHub repository
   - Before deploying, add the following environment variables:
     - `VITE_API_URL`: The URL of your deployed backend + `/api` (e.g., https://mealcart-backend.vercel.app/api)
     - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key (if using Clerk auth)

2. **Deploy the frontend:**
   - Use the Vercel dashboard to deploy your frontend
   - Or use the Vercel CLI with the following command:
   ```bash
   cd frontend
   vercel
   ```

3. **Verify deployment:**
   - Once deployed, Vercel will provide you with a URL for your frontend
   - Test the frontend to make sure it's working correctly

## Backend Deployment Steps

1. **Set up environment variables in Vercel:**
   - Create a new project for the backend
   - Add the following environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT token generation
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `UNSPLASH_ACCESS_KEY`: Your Unsplash API key
     - `FRONTEND_URL`: The URL of your deployed frontend (for CORS)

2. **Deploy the backend:**
   - Use the Vercel dashboard to deploy your backend
   - Or use the Vercel CLI with the following command:
   ```bash
   cd backend
   vercel
   ```

3. **Verify deployment:**
   - Test the backend by making requests to the API endpoints
   - You can use tools like Postman or simply check if your frontend is able to connect to the backend

## Update Frontend with Backend URL

After deploying the backend, make sure to:

1. Update the `VITE_API_URL` environment variable in the frontend deployment on Vercel with the URL of your deployed backend + `/api`
2. Redeploy the frontend if necessary

## Troubleshooting

- **CORS issues**: Make sure the `FRONTEND_URL` in your backend environment variables matches your frontend's actual URL
- **Connection issues**: Check that your MongoDB connection string is correct and that your IP is whitelisted in MongoDB Atlas
- **API errors**: Check the Vercel logs for more details about any API errors

## Monitoring

You can monitor your application's performance and errors using the Vercel dashboard.

#!/bin/bash

echo "Testing CORS preflight request to your backend..."
echo ""

curl -X OPTIONS \
     -H "Origin: https://meal-cart-phi.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -v https://meal-cart-backend.vercel.app/api/auth/login

echo ""
echo "If you see 'Access-Control-Allow-Origin: https://meal-cart-phi.vercel.app' in the response headers, CORS is set up correctly!"
echo "Expected response status is 204 No Content or 200 OK for OPTIONS requests."

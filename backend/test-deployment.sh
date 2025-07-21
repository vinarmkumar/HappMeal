#!/bin/bash

# Vercel Backend Deployment Test Script

echo "🚀 Testing Vercel Backend Deployment..."

# Test health endpoint
echo "📡 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://meal-cart-backend.vercel.app/api/health)

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health endpoint working!"
    echo "📋 Health check response:"
    curl -s https://meal-cart-backend.vercel.app/api/health | jq '.'
else
    echo "❌ Health endpoint failed with status: $HEALTH_RESPONSE"
fi

echo ""
echo "🔍 Testing CORS preflight..."
CORS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS \
    -H "Origin: https://meal-cart-phi.vercel.app" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type, Authorization" \
    https://meal-cart-backend.vercel.app/api/auth/login)

if [ "$CORS_RESPONSE" = "200" ]; then
    echo "✅ CORS preflight working!"
else
    echo "❌ CORS preflight failed with status: $CORS_RESPONSE"
fi

echo ""
echo "📊 Deployment Summary:"
echo "- Backend URL: https://meal-cart-backend.vercel.app"
echo "- Health Status: $HEALTH_RESPONSE"
echo "- CORS Status: $CORS_RESPONSE"

if [ "$HEALTH_RESPONSE" = "200" ] && [ "$CORS_RESPONSE" = "200" ]; then
    echo "🎉 Deployment appears to be working correctly!"
else
    echo "⚠️  There may be issues with the deployment"
fi

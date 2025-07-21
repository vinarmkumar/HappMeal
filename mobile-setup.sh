#!/bin/bash

# Mobile Development Setup Script for MealCart
# This script configures the app for mobile access via port forwarding

echo "🚀 Setting up MealCart for mobile access..."

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)
echo "📱 Local IP detected: $LOCAL_IP"

# Frontend configuration
FRONTEND_ENV_FILE="frontend/.env.local"
echo "⚙️  Configuring frontend environment..."
cat > $FRONTEND_ENV_FILE << EOL
# Environment variables for mobile development
VITE_API_URL=http://$LOCAL_IP:5001/api
VITE_BACKEND_URL=http://$LOCAL_IP:5001
EOL

echo "✅ Frontend configured for mobile access"

# Start backend
echo "🔧 Starting backend server (accessible from mobile)..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server (accessible from mobile)..."
cd ../frontend && npm run dev -- --host &
FRONTEND_PID=$!

# Display access information
echo ""
echo "🎉 MealCart is now ready for mobile access!"
echo ""
echo "📱 Access from your mobile device:"
echo "   Frontend: http://$LOCAL_IP:5173/"
echo "   Backend:  http://$LOCAL_IP:5001/api/health"
echo ""
echo "💻 Access from your computer:"
echo "   Frontend: http://localhost:5173/"
echo "   Backend:  http://localhost:5001/api/health"
echo ""
echo "📋 To connect your mobile device:"
echo "   1. Make sure your phone is on the same WiFi network"
echo "   2. Open your mobile browser and go to: http://$LOCAL_IP:5173/"
echo "   3. If authentication fails, clear your browser cache/cookies"
echo ""
echo "⚠️  Note: If you still can't sign in on mobile:"
echo "   - Try opening in incognito/private mode"
echo "   - Clear browser data for this site"
echo "   - Make sure both devices are on the same network"
echo ""
echo "To stop the servers, press Ctrl+C"

# Keep script running
wait

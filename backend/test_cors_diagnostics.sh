#!/bin/bash

# CORS Test Script for MealCart
# This script helps diagnose CORS issues between frontend and backend

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}         MealCart CORS Diagnostic Tool              ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed. Please install it first.${NC}"
    exit 1
fi

# Backend URL
BACKEND_URL="https://meal-cart-backend.vercel.app"
FRONTEND_URL="https://meal-cart-phi.vercel.app"

# Function to test CORS preflight for a specific endpoint
test_cors_preflight() {
    local endpoint=$1
    local method=$2
    local full_url="${BACKEND_URL}${endpoint}"
    
    echo -e "\n${YELLOW}Testing CORS for ${method} ${full_url}${NC}"
    echo -e "${YELLOW}Simulating request from: ${FRONTEND_URL}${NC}\n"
    
    curl -s -o /dev/null -w "%{http_code}" -X OPTIONS \
        -H "Origin: ${FRONTEND_URL}" \
        -H "Access-Control-Request-Method: ${method}" \
        -H "Access-Control-Request-Headers: Content-Type, Authorization" \
        "${full_url}" > /tmp/cors_status
        
    STATUS=$(cat /tmp/cors_status)
    
    if [[ "$STATUS" == "200" || "$STATUS" == "204" ]]; then
        echo -e "${GREEN}✓ CORS preflight successful (HTTP ${STATUS})${NC}"
        # Now get the detailed headers for inspection
        echo -e "\n${YELLOW}Detailed Headers:${NC}"
        curl -s -I -X OPTIONS \
            -H "Origin: ${FRONTEND_URL}" \
            -H "Access-Control-Request-Method: ${method}" \
            -H "Access-Control-Request-Headers: Content-Type, Authorization" \
            "${full_url}" | grep -i 'Access-Control'
    else
        echo -e "${RED}✗ CORS preflight failed (HTTP ${STATUS})${NC}"
        echo -e "\n${YELLOW}Detailed Headers:${NC}"
        curl -v -X OPTIONS \
            -H "Origin: ${FRONTEND_URL}" \
            -H "Access-Control-Request-Method: ${method}" \
            -H "Access-Control-Request-Headers: Content-Type, Authorization" \
            "${full_url}" 2>&1 | grep -i 'Access-Control\|< HTTP'
    fi
}

# Test CORS for key endpoints
echo -e "\n${BLUE}Testing CORS for key API endpoints...${NC}"

# Auth endpoints - these are usually where CORS issues occur
test_cors_preflight "/api/auth/login" "POST"
test_cors_preflight "/api/auth/register" "POST"

# Recipe endpoints
test_cors_preflight "/api/recipes" "GET"
test_cors_preflight "/api/recipes" "POST"

# Additional checks
echo -e "\n${BLUE}====================================================${NC}"
echo -e "${BLUE}         Additional CORS Checks                     ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Check if backend responds at all
echo -e "\n${YELLOW}Checking if backend is accessible...${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}/api/health)

if [[ "$STATUS" == "200" ]]; then
    echo -e "${GREEN}✓ Backend is accessible (HTTP ${STATUS})${NC}"
else
    echo -e "${RED}✗ Backend is not accessible or health endpoint missing (HTTP ${STATUS})${NC}"
fi

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${BLUE}         CORS Test Complete                         ${NC}"
echo -e "${BLUE}====================================================${NC}"

echo -e "\n${YELLOW}NEXT STEPS:${NC}"
echo "1. Check for 200/204 responses on OPTIONS requests"
echo "2. Ensure Access-Control-Allow-Origin includes your frontend domain"
echo "3. Verify Access-Control-Allow-Methods includes needed HTTP methods"
echo "4. If tests fail, see CORS_DEPLOYMENT_GUIDE.md for fixes"

#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}      MealCart Full Stack Log Viewer      ${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Function to display logs with service prefix
show_logs() {
    local service=$1
    local color=$2
    local log_command=$3
    
    echo -e "${color}[$service]${NC} $log_command"
    eval $log_command 2>/dev/null || echo -e "${RED}[$service] No logs available${NC}"
    echo ""
}

# Function to check if processes are running
check_process() {
    local service=$1
    local pattern=$2
    
    if pgrep -f "$pattern" > /dev/null; then
        echo -e "${GREEN}✓ $service is running${NC}"
        return 0
    else
        echo -e "${RED}✗ $service is not running${NC}"
        return 1
    fi
}

echo -e "${WHITE}Checking running services...${NC}"
echo ""

# Check backend
cd "$BACKEND_DIR" 2>/dev/null
if [ $? -eq 0 ]; then
    check_process "Backend" "node.*server.js"
    if [ $? -ne 0 ]; then
        check_process "Backend (nodemon)" "nodemon.*server.js"
    fi
else
    echo -e "${RED}✗ Backend directory not found${NC}"
fi

# Check frontend  
cd "$FRONTEND_DIR" 2>/dev/null
if [ $? -eq 0 ]; then
    check_process "Frontend (Vite)" "vite"
    if [ $? -ne 0 ]; then
        check_process "Frontend (npm run dev)" "npm.*dev"
    fi
else
    echo -e "${RED}✗ Frontend directory not found${NC}"
fi

echo ""
echo -e "${WHITE}Recent Backend Logs:${NC}"
echo -e "${MAGENTA}================================================${NC}"

# Show backend logs
cd "$BACKEND_DIR" 2>/dev/null
if [ $? -eq 0 ]; then
    TODAY=$(date +%Y-%m-%d)
    BACKEND_LOG="logs/app-$TODAY.log"
    
    if [ -f "$BACKEND_LOG" ]; then
        echo -e "${BLUE}[BACKEND]${NC} Last 20 lines from $BACKEND_LOG:"
        tail -20 "$BACKEND_LOG" | while IFS= read -r line; do
            # Color code log levels
            if [[ $line == *"ERROR"* ]]; then
                echo -e "${RED}[BACKEND]${NC} $line"
            elif [[ $line == *"WARN"* ]]; then
                echo -e "${YELLOW}[BACKEND]${NC} $line"
            elif [[ $line == *"INFO"* ]]; then
                echo -e "${GREEN}[BACKEND]${NC} $line"
            elif [[ $line == *"DEBUG"* ]]; then
                echo -e "${BLUE}[BACKEND]${NC} $line"
            elif [[ $line == *"TRACE"* ]]; then
                echo -e "${MAGENTA}[BACKEND]${NC} $line"
            else
                echo -e "${NC}[BACKEND]${NC} $line"
            fi
        done
    else
        echo -e "${YELLOW}[BACKEND]${NC} No log file found for today ($BACKEND_LOG)"
        echo -e "${YELLOW}[BACKEND]${NC} Logs will appear once the backend server starts"
    fi
else
    echo -e "${RED}[BACKEND]${NC} Backend directory not accessible"
fi

echo ""
echo -e "${WHITE}Recent Frontend Development Server Output:${NC}"
echo -e "${MAGENTA}================================================${NC}"

# For frontend, we'll check for Vite dev server output in terminal
cd "$FRONTEND_DIR" 2>/dev/null
if [ $? -eq 0 ]; then
    # Check if Vite is running and try to get recent output
    if pgrep -f "vite" > /dev/null; then
        echo -e "${GREEN}[FRONTEND]${NC} Vite development server is running"
        echo -e "${BLUE}[FRONTEND]${NC} For real-time frontend logs, check the terminal where 'npm run dev' is running"
    else
        echo -e "${YELLOW}[FRONTEND]${NC} Vite development server is not running"
        echo -e "${BLUE}[FRONTEND]${NC} To start: cd frontend && npm run dev"
    fi
else
    echo -e "${RED}[FRONTEND]${NC} Frontend directory not accessible"
fi

echo ""
echo -e "${WHITE}Quick Commands:${NC}"
echo -e "${CYAN}================================================${NC}"
echo -e "${GREEN}Backend:${NC}"
echo "  Start server:     cd backend && npm run dev"
echo "  Start with debug: cd backend && npm run dev:debug"
echo "  View logs:        cd backend && ./view-logs.sh"
echo ""
echo -e "${GREEN}Frontend:${NC}"
echo "  Start dev server: cd frontend && npm run dev"
echo "  Build:           cd frontend && npm run build"
echo ""
echo -e "${GREEN}Both:${NC}"
echo "  View this dashboard: ./show-logs.sh"
echo ""

# Function to monitor logs in real-time
if [ "$1" = "--follow" ] || [ "$1" = "-f" ]; then
    echo -e "${CYAN}Starting real-time log monitoring...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    echo ""
    
    # Start backend log monitoring in background if file exists
    cd "$BACKEND_DIR" 2>/dev/null
    if [ $? -eq 0 ] && [ -f "logs/app-$(date +%Y-%m-%d).log" ]; then
        tail -f "logs/app-$(date +%Y-%m-%d).log" | while IFS= read -r line; do
            # Color code and prefix backend logs
            if [[ $line == *"ERROR"* ]]; then
                echo -e "${RED}[BACKEND]${NC} $line"
            elif [[ $line == *"WARN"* ]]; then
                echo -e "${YELLOW}[BACKEND]${NC} $line"
            elif [[ $line == *"INFO"* ]]; then
                echo -e "${GREEN}[BACKEND]${NC} $line"
            elif [[ $line == *"DEBUG"* ]]; then
                echo -e "${BLUE}[BACKEND]${NC} $line"
            elif [[ $line == *"TRACE"* ]]; then
                echo -e "${MAGENTA}[BACKEND]${NC} $line"
            else
                echo -e "${NC}[BACKEND]${NC} $line"
            fi
        done &
        BACKEND_PID=$!
        
        # Cleanup function
        cleanup() {
            echo ""
            echo -e "${CYAN}Stopping log monitoring...${NC}"
            kill $BACKEND_PID 2>/dev/null
            exit 0
        }
        
        trap cleanup SIGINT SIGTERM
        wait
    else
        echo -e "${YELLOW}No backend log file to follow. Start the backend server first.${NC}"
    fi
fi

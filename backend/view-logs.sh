#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}        MealCart Backend Log Viewer        ${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
TODAY=$(date +%Y-%m-%d)
LOG_FILE="$LOG_DIR/app-$TODAY.log"

echo -e "${BLUE}Log directory: ${NC}$LOG_DIR"
echo -e "${BLUE}Today's log file: ${NC}$LOG_FILE"
echo ""

# Create logs directory if it doesn't exist
if [ ! -d "$LOG_DIR" ]; then
    echo -e "${YELLOW}Creating logs directory...${NC}"
    mkdir -p "$LOG_DIR"
fi

# Check if log file exists
if [ ! -f "$LOG_FILE" ]; then
    echo -e "${YELLOW}No log file found for today. Starting to monitor...${NC}"
    echo -e "${YELLOW}Logs will appear here once the server starts generating them.${NC}"
    echo ""
fi

# Function to clean up on exit
cleanup() {
    echo ""
    echo -e "${CYAN}Log monitoring stopped.${NC}"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Monitoring logs in real-time (Press Ctrl+C to stop)...${NC}"
echo -e "${MAGENTA}========================================================${NC}"

# Start monitoring - create the file if it doesn't exist and tail it
touch "$LOG_FILE"
tail -f "$LOG_FILE" 2>/dev/null || {
    echo -e "${RED}Error: Could not monitor log file${NC}"
    exit 1
}

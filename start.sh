#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define API URLs
REALWORLD_IO_API_URL="https://api.realworld.io/api"
NODE_EXPRESS_API_URL="https://node-express-conduit.appspot.com/api"
LOCAL_API_URL="http://localhost:3000/api"

echo -e "${BLUE}RealWorld Setup${NC}"

# API URL Selection
echo "Please choose which API endpoint to use:"
echo -e "${GREEN}1)${NC} realworld.io (${REALWORLD_IO_API_URL}) (May be offline)"
echo -e "${GREEN}2)${NC} node-express-conduit (${NODE_EXPRESS_API_URL})"
echo -e "${GREEN}3)${NC} Local (${LOCAL_API_URL})"

read -p "Enter your choice (1-3): " api_choice

API_URL_TO_USE=""
case $api_choice in
    1)
        API_URL_TO_USE=$REALWORLD_IO_API_URL
        echo -e "${BLUE}Using realworld.io API endpoint: ${API_URL_TO_USE}${NC}"
        ;;
    2)
        API_URL_TO_USE=$NODE_EXPRESS_API_URL
        echo -e "${BLUE}Using node-express-conduit API endpoint: ${API_URL_TO_USE}${NC}"
        ;;
    3)
        API_URL_TO_USE=$LOCAL_API_URL
        echo -e "${BLUE}Using Local API endpoint: ${API_URL_TO_USE}${NC}"
        ;;
    *)
        echo "Invalid API choice. Exiting."
        exit 1
        ;;
esac

echo ""

# Client Selection
echo "Please choose which client you want to run:"
echo -e "${GREEN}1)${NC} MobX-based client"
echo -e "${GREEN}2)${NC} Remx-based client"
echo -e "${GREEN}3)${NC} Exit"

read -p "Enter your choice (1-3): " client_choice

case $client_choice in
    1)
        echo -e "${BLUE}Starting MobX-based client using API: ${API_URL_TO_USE}...${NC}"
        EXPO_PUBLIC_API_URL=$API_URL_TO_USE yarn start:mobx
        ;;
    2)
        echo -e "${BLUE}Starting Remx-based client using API: ${API_URL_TO_USE}...${NC}"
        EXPO_PUBLIC_API_URL=$API_URL_TO_USE yarn start:remx
        ;;
    3)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid client choice. Please run the script again."
        exit 1
        ;;
esac 

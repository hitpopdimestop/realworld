#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}RealWorld Setup${NC}"
echo ""

# API URL Selection
echo -e "${BLUE}Please choose which API endpoint to use:${NC}"
echo -e "${GREEN}1)${NC} Local (http://localhost:3000/api)"
echo -e "${GREEN}2)${NC} node-express-conduit (https://node-express-conduit.appspot.com/api)"
echo -e "${GREEN}3)${NC} realworld.io (https://api.realworld.io/api) - May be offline"
echo ""

while true; do
    read -p "Enter your choice (1-3) or press Enter for default [1]: " api_choice
    
    # Default to 1 if empty
    if [ -z "$api_choice" ]; then
        api_choice=1
    fi
    
    case $api_choice in
        1)
            API_URL_TO_USE="http://localhost:3000/api"
            API_NAME="Local"
            break
            ;;
        2)
            API_URL_TO_USE="https://node-express-conduit.appspot.com/api"
            API_NAME="node-express-conduit"
            break
            ;;
        3)
            API_URL_TO_USE="https://api.realworld.io/api"
            API_NAME="realworld.io"
            break
            ;;
        *)
            echo -e "${RED}Invalid choice. Please enter 1, 2, or 3.${NC}"
            ;;
    esac
done

echo -e "${BLUE}Using API endpoint: ${API_NAME} (${API_URL_TO_USE})${NC}"
echo ""

# Client Selection
echo -e "${BLUE}Please choose which client you want to run:${NC}"
echo -e "${GREEN}1)${NC} Context-based client"
echo -e "${GREEN}2)${NC} MobX-based client"
echo -e "${GREEN}3)${NC} Remx-based client"
echo -e "${GREEN}4)${NC} Exit"
echo ""

while true; do
    read -p "Enter your choice (1-4) or press Enter for default [1]: " client_choice
    
    # Default to 1 if empty
    if [ -z "$client_choice" ]; then
        client_choice=1
    fi
    
    case $client_choice in
        1)
            echo -e "${BLUE}Starting Context-based client using API: ${API_URL_TO_USE}...${NC}"
            EXPO_PUBLIC_API_URL=$API_URL_TO_USE yarn start:context --clear
            break
            ;;
        2)
            echo -e "${BLUE}Starting MobX-based client using API: ${API_URL_TO_USE}...${NC}"
            EXPO_PUBLIC_API_URL=$API_URL_TO_USE yarn start:mobx
            break
            ;;
        3)
            echo -e "${BLUE}Starting Remx-based client using API: ${API_URL_TO_USE}...${NC}"
            EXPO_PUBLIC_API_URL=$API_URL_TO_USE yarn start:remx
            break
            ;;
        4)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please enter 1, 2, 3, or 4.${NC}"
            ;;
    esac
done 

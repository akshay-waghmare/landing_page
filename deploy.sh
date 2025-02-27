#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment to Cloudflare Pages...${NC}"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}Wrangler is not installed. Installing globally...${NC}"
    npm install -g wrangler
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

# Ensure routing files are in the build directory
echo -e "${YELLOW}Ensuring routing files are in the build directory...${NC}"
cp -f public/_redirects build/ 2>/dev/null || echo -e "${RED}Warning: _redirects file not found${NC}"
cp -f public/_headers build/ 2>/dev/null || echo -e "${RED}Warning: _headers file not found${NC}"
cp -f public/_routes.json build/ 2>/dev/null || echo -e "${RED}Warning: _routes.json file not found${NC}"
cp -f public/404.html build/ 2>/dev/null || echo -e "${RED}Warning: 404.html file not found${NC}"

# Deploy to Cloudflare Pages
echo -e "${YELLOW}Deploying to Cloudflare Pages...${NC}"
wrangler pages deploy build

# Check if deployment was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the errors above.${NC}"
    exit 1
else
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${YELLOW}Note: It may take a few minutes for the changes to propagate.${NC}"
    echo -e "${YELLOW}If you encounter 404 errors, please check the CLOUDFLARE_DEPLOYMENT.md file for troubleshooting steps.${NC}"
fi 
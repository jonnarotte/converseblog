#!/bin/bash

# 🚀 Quick Build Script
# Builds the app locally using npx next build
# Usage: ./scripts/quick-build.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏗️  Building application with npx next build...${NC}"

# Pre-flight checks
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Run from project root.${NC}"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Build might fail.${NC}"
fi

# Clean previous build
echo -e "${YELLOW}Cleaning previous build...${NC}"
rm -rf .next

# Build using npx
echo -e "${BLUE}Running: npx next build --webpack${NC}"
npx next build --webpack

# Verify build
if [ ! -d ".next/standalone" ]; then
    echo -e "${RED}❌ Build failed: .next/standalone not found${NC}"
    exit 1
fi

# Check chunks
CHUNK_COUNT=$(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l)
if [ "$CHUNK_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ No JavaScript chunks found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo -e "${GREEN}✓ Found $CHUNK_COUNT JavaScript chunks${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  • Test locally: npm start"
echo "  • Deploy: ./scripts/build-and-deploy.sh user@vm-ip"
echo ""

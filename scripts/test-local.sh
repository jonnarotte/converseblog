#!/bin/bash

# Local Testing Script
# Run this before pushing to ensure everything works

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Running Local Test Suite${NC}"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo -e "${YELLOW}   Copy .env.example to .env.local and fill in values${NC}"
    echo ""
fi

# Step 1: Type check
echo -e "${BLUE}1. Running TypeScript type check...${NC}"
if npm run type-check; then
    echo -e "${GREEN}✓ Type check passed${NC}"
else
    echo -e "${RED}❌ Type check failed${NC}"
    exit 1
fi
echo ""

# Step 2: Unit tests
echo -e "${BLUE}2. Running unit tests...${NC}"
echo -e "${YELLOW}   Note: Coverage thresholds are set to 20% (minimum)${NC}"
if npm run test:ci; then
    echo -e "${GREEN}✓ Unit tests passed${NC}"
else
    echo -e "${RED}❌ Unit tests failed${NC}"
    exit 1
fi
echo ""

# Step 3: Build test
echo -e "${BLUE}3. Testing production build...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 4: E2E tests (optional - can be skipped)
echo -e "${BLUE}4. E2E tests...${NC}"
echo -e "${YELLOW}   E2E tests require dev server running and Playwright browsers installed${NC}"
echo -e "${YELLOW}   Run manually: npm run test:e2e${NC}"
echo -e "${YELLOW}   ⏭️  Skipping E2E tests in pre-push check${NC}"
echo ""

echo -e "${GREEN}✅ All tests passed! Ready to push.${NC}"

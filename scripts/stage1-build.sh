#!/bin/bash

# 🏗️  STAGE 1: LOCAL BUILD
# Builds the application locally and creates deployment package
# Usage: ./scripts/stage1-build.sh

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BUILD_DIR=".next/standalone"
DEPLOY_DIR=".deploy"
TARBALL="deploy.tar.gz"

echo -e "${BLUE}🏗️  STAGE 1: Local Build${NC}"
echo ""

# Pre-flight checks
echo -e "${BLUE}🔍 Pre-flight checks...${NC}"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Run from project root.${NC}"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found. Create it first.${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"

# Verify env vars
source .env.local
if [ -z "${NEXT_PUBLIC_SANITY_PROJECT_ID:-}" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables configured${NC}"
echo ""

# Step 0: Clean everything (CRITICAL for fresh build)
echo -e "${BLUE}🧹 Step 0: Cleaning old build...${NC}"
rm -rf .next
rm -rf node_modules/.cache
rm -f deploy.tar.gz
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 1: Clean install
echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Clean build
echo -e "${BLUE}🏗️  Step 2: Building application...${NC}"
rm -rf .next
# Use --webpack flag to explicitly use webpack (required for custom webpack config)
npx next build --webpack

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed: $BUILD_DIR not found${NC}"
    exit 1
fi

if [ ! -f "$BUILD_DIR/server.js" ]; then
    echo -e "${RED}❌ Build failed: server.js not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Step 3: Ensure postbuild script runs
echo -e "${BLUE}🔍 Step 3: Verifying static files...${NC}"
if [ ! -d ".next/static/chunks" ]; then
    echo -e "${RED}❌ .next/static/chunks not found${NC}"
    exit 1
fi

CHUNK_COUNT=$(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l | tr -d ' ')
if [ "$CHUNK_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ No JavaScript chunks found!${NC}"
    exit 1
fi

# ALWAYS run postbuild script (copy static files and public files to standalone)
echo -e "${BLUE}📋 Running postbuild script (copy static & public files)...${NC}"
if ! node scripts/copy-static.js; then
    echo -e "${RED}❌ Postbuild script failed${NC}"
    exit 1
fi

# Verify chunks were copied
STANDALONE_CHUNKS=$(find "$BUILD_DIR/.next/static/chunks" -name "*.js" 2>/dev/null | wc -l | tr -d ' ')
if [ "$STANDALONE_CHUNKS" -eq 0 ]; then
    echo -e "${RED}❌ Failed to copy chunks to standalone directory${NC}"
    exit 1
fi

# Verify we have chunks (allow some variance due to chunk splitting)
if [ "$STANDALONE_CHUNKS" -lt 5 ]; then
    echo -e "${YELLOW}⚠️  Warning: Only $STANDALONE_CHUNKS chunks found (expected more)${NC}"
else
    echo -e "${GREEN}✓ Verified $STANDALONE_CHUNKS JavaScript chunks${NC}"
fi
echo ""

# Step 4: Prepare deployment package
echo -e "${BLUE}📦 Step 4: Creating deployment package...${NC}"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy standalone build
cp -r "$BUILD_DIR" "$DEPLOY_DIR/standalone"

# Copy .env.local
cp ".env.local" "$DEPLOY_DIR/.env.local"

# Copy deployment script for Stage 3
mkdir -p "$DEPLOY_DIR/scripts"
cp "scripts/stage3-deploy.sh" "$DEPLOY_DIR/scripts/stage3-deploy.sh"
chmod +x "$DEPLOY_DIR/scripts/stage3-deploy.sh"

# Copy config file
if [ -f ".deploy-config" ]; then
    cp ".deploy-config" "$DEPLOY_DIR/.deploy-config"
fi

# Create deployment info
cat > "$DEPLOY_DIR/deploy-info.txt" << EOF
Build Date: $(date)
Node Version: $(node --version)
NPM Version: $(npm --version)
Chunks: $STANDALONE_CHUNKS
Build Size: $(du -sh "$DEPLOY_DIR/standalone" | cut -f1)
EOF

echo -e "${GREEN}✓ Deployment package prepared${NC}"
echo ""

# Step 5: Create tarball with maximum compression
echo -e "${BLUE}📦 Step 5: Creating tarball (with maximum compression)...${NC}"
cd "$DEPLOY_DIR"
# Use maximum compression (slower but smaller file)
tar -czf "../$TARBALL" --exclude='*.map' --exclude='*.test.*' --exclude='*.spec.*' .
cd - > /dev/null

TARBALL_SIZE=$(du -h "$TARBALL" | cut -f1)
echo -e "${GREEN}✓ Tarball created: $TARBALL ($TARBALL_SIZE)${NC}"
echo ""

# Summary
echo -e "${GREEN}✅ STAGE 1 COMPLETE!${NC}"
echo ""
echo -e "${BLUE}📊 Build Summary:${NC}"
cat "$DEPLOY_DIR/deploy-info.txt"
echo ""
echo -e "${YELLOW}📋 Next Step:${NC}"
echo "  Run: ./scripts/stage2-transfer.sh"
echo ""

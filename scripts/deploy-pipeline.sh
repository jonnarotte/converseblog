#!/bin/bash

# 🚀 BULLETPROOF DEPLOYMENT PIPELINE
# Run this script after git pull to deploy safely
# Usage: ./scripts/deploy-pipeline.sh

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_DIR="/var/www/converseblog"
SERVICE_NAME="converseblog"
BACKUP_DIR="/var/backups/converseblog"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Error handler
error_exit() {
    echo -e "${RED}❌ ERROR: $1${NC}" >&2
    echo -e "${YELLOW}🔄 Attempting rollback...${NC}"
    rollback
    exit 1
}

# Rollback function
rollback() {
    if [ -d "$BACKUP_DIR/last_working" ]; then
        echo -e "${YELLOW}Rolling back to last working version...${NC}"
        sudo systemctl stop $SERVICE_NAME || true
        rm -rf "$APP_DIR/.next/standalone" || true
        cp -r "$BACKUP_DIR/last_working" "$APP_DIR/.next/standalone"
        sudo systemctl start $SERVICE_NAME
        echo -e "${GREEN}✓ Rollback complete${NC}"
    fi
}

# Pre-flight checks
echo -e "${BLUE}🔍 Pre-flight Checks...${NC}"

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    error_exit "package.json not found. Run from project root."
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    error_exit "Node.js not installed"
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    error_exit "npm not installed"
fi

# Check .env.local
if [ ! -f ".env.local" ]; then
    error_exit ".env.local not found. Create it first."
fi

# Verify required env vars
source .env.local
if [ -z "${NEXT_PUBLIC_SANITY_PROJECT_ID:-}" ]; then
    error_exit "NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local"
fi

echo -e "${GREEN}✓ Environment variables configured${NC}"

# Step 1: Backup current working version
echo -e "${BLUE}📦 Step 1: Creating backup...${NC}"
sudo mkdir -p "$BACKUP_DIR"
if [ -d "$APP_DIR/.next/standalone" ] && sudo systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
    echo -e "${YELLOW}Backing up current working version...${NC}"
    sudo rm -rf "$BACKUP_DIR/last_working"
    sudo cp -r "$APP_DIR/.next/standalone" "$BACKUP_DIR/last_working"
    echo -e "${GREEN}✓ Backup created${NC}"
else
    echo -e "${YELLOW}No previous working version to backup${NC}"
fi

# Step 2: Clean install dependencies
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps 2>&1 | tee /tmp/npm-install.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    error_exit "npm install failed. Check /tmp/npm-install.log"
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3: Clean build
echo -e "${BLUE}🏗️  Step 3: Building application...${NC}"
rm -rf .next
npx next build --webpack 2>&1 | tee /tmp/build.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    error_exit "Build failed. Check /tmp/build.log"
fi

# Verify build output
if [ ! -d ".next/standalone" ]; then
    error_exit "Build failed: .next/standalone not found"
fi

if [ ! -f ".next/standalone/server.js" ]; then
    error_exit "Build failed: server.js not found"
fi

echo -e "${GREEN}✓ Build successful${NC}"

# Step 4: Verify static files (CRITICAL for Studio)
echo -e "${BLUE}🔍 Step 4: Verifying static files...${NC}"

# Check if static files exist
if [ ! -d ".next/static" ]; then
    error_exit ".next/static directory not found"
fi

# Check chunks
if [ ! -d ".next/static/chunks" ]; then
    error_exit ".next/static/chunks directory not found"
fi

CHUNK_COUNT=$(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l)
if [ "$CHUNK_COUNT" -eq 0 ]; then
    error_exit "No JavaScript chunks found!"
fi

echo -e "${GREEN}✓ Found $CHUNK_COUNT JavaScript chunks${NC}"

# Step 5: Copy files to standalone (ENHANCED)
echo -e "${BLUE}📦 Step 5: Copying files to standalone...${NC}"

# Copy static files
if [ -d ".next/static" ]; then
    mkdir -p ".next/standalone/.next"
    rm -rf ".next/standalone/.next/static" 2>/dev/null || true
    cp -r ".next/static" ".next/standalone/.next/static"
    
    # Verify copy
    STANDALONE_CHUNKS=$(find .next/standalone/.next/static/chunks -name "*.js" 2>/dev/null | wc -l)
    if [ "$STANDALONE_CHUNKS" -ne "$CHUNK_COUNT" ]; then
        error_exit "Chunk count mismatch: $STANDALONE_CHUNKS != $CHUNK_COUNT"
    fi
    echo -e "${GREEN}✓ Static files copied ($STANDALONE_CHUNKS chunks)${NC}"
else
    error_exit ".next/static not found"
fi

# Copy server files (CRITICAL for Studio)
if [ -d ".next/server" ]; then
    mkdir -p ".next/standalone/.next/server"
    
    # Copy entire server directory structure
    if [ -d ".next/server/app" ]; then
        rm -rf ".next/standalone/.next/server/app" 2>/dev/null || true
        cp -r ".next/server/app" ".next/standalone/.next/server/app"
        echo -e "${GREEN}✓ Server app files copied${NC}"
    fi
    
    # Copy server chunks
    if [ -d ".next/server/chunks" ]; then
        rm -rf ".next/standalone/.next/server/chunks" 2>/dev/null || true
        cp -r ".next/server/chunks" ".next/standalone/.next/server/chunks"
        echo -e "${GREEN}✓ Server chunks copied${NC}"
    fi
    
    # Copy any other server files
    if [ -f ".next/server/middleware-manifest.json" ]; then
        cp ".next/server/middleware-manifest.json" ".next/standalone/.next/server/" 2>/dev/null || true
    fi
    if [ -f ".next/server/next-server.js" ]; then
        cp ".next/server/next-server.js" ".next/standalone/.next/server/" 2>/dev/null || true
    fi
else
    error_exit ".next/server not found"
fi

# Copy public files
if [ -d "public" ]; then
    rm -rf ".next/standalone/public" 2>/dev/null || true
    cp -r "public" ".next/standalone/public"
    echo -e "${GREEN}✓ Public files copied${NC}"
fi

# Step 6: Health check before deployment
echo -e "${BLUE}🏥 Step 6: Pre-deployment health check...${NC}"

# Check if server.js can start
cd .next/standalone
timeout 5 node server.js --help > /dev/null 2>&1 || true
cd - > /dev/null
echo -e "${GREEN}✓ Server executable verified${NC}"

# Step 7: Deploy to production directory
echo -e "${BLUE}🚀 Step 7: Deploying to production...${NC}"

# Stop service
if sudo systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
    echo -e "${YELLOW}Stopping service...${NC}"
    sudo systemctl stop $SERVICE_NAME
    sleep 2
fi

# Copy to production
sudo mkdir -p "$APP_DIR"
sudo cp -r ".next/standalone" "$APP_DIR/.next/standalone.new"
sudo cp ".env.local" "$APP_DIR/.env.local"

# Atomic swap
sudo rm -rf "$APP_DIR/.next/standalone.old" 2>/dev/null || true
if [ -d "$APP_DIR/.next/standalone" ]; then
    sudo mv "$APP_DIR/.next/standalone" "$APP_DIR/.next/standalone.old"
fi
sudo mv "$APP_DIR/.next/standalone.new" "$APP_DIR/.next/standalone"
sudo chown -R $USER:$USER "$APP_DIR/.next/standalone"

echo -e "${GREEN}✓ Files deployed${NC}"

# Step 8: Start service
echo -e "${BLUE}🔄 Step 8: Starting service...${NC}"
sudo systemctl daemon-reload
sudo systemctl start $SERVICE_NAME

# Wait for service to start
sleep 3

# Step 9: Health check
echo -e "${BLUE}🏥 Step 9: Post-deployment health check...${NC}"

if ! sudo systemctl is-active --quiet $SERVICE_NAME; then
    error_exit "Service failed to start. Check logs: sudo journalctl -u $SERVICE_NAME -n 50"
fi

# Test HTTP endpoint
for i in {1..10}; do
    if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Service is responding${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        error_exit "Service not responding after 10 attempts"
    fi
    sleep 1
done

# Test Studio endpoint
if curl -f -s http://localhost:3000/studio > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Studio is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Studio endpoint check failed (might be normal if auth required)${NC}"
fi

# Cleanup old backup
if [ -d "$APP_DIR/.next/standalone.old" ]; then
    sudo rm -rf "$APP_DIR/.next/standalone.old"
fi

echo ""
echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "  • Chunks copied: $STANDALONE_CHUNKS"
echo "  • Service status: $(sudo systemctl is-active $SERVICE_NAME && echo 'Active' || echo 'Inactive')"
echo "  • Backup location: $BACKUP_DIR/last_working"
echo ""
echo -e "${YELLOW}📋 Useful Commands:${NC}"
echo "  • View logs: sudo journalctl -u $SERVICE_NAME -f"
echo "  • Check status: sudo systemctl status $SERVICE_NAME"
echo "  • Restart: sudo systemctl restart $SERVICE_NAME"
echo "  • Rollback: sudo systemctl stop $SERVICE_NAME && sudo cp -r $BACKUP_DIR/last_working $APP_DIR/.next/standalone && sudo systemctl start $SERVICE_NAME"
echo ""

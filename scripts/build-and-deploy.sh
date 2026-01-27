#!/bin/bash

# 🏗️  LOCAL BUILD + DEPLOY SCRIPT
# Build locally and deploy only the build to GCloud VM
# Usage: ./scripts/build-and-deploy.sh [vm-user@vm-ip]

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
VM_USER="${1:-}"
VM_IP="${2:-}"
APP_DIR="/var/www/converseblog"
SERVICE_NAME="converseblog"
BUILD_DIR=".next/standalone"
TARBALL="deploy.tar.gz"

# Check if VM info provided
if [ -z "$VM_USER" ] || [ -z "$VM_IP" ]; then
    echo -e "${RED}Usage: $0 <vm-user> <vm-ip>${NC}"
    echo -e "${YELLOW}Example: $0 ubuntu 34.123.45.67${NC}"
    exit 1
fi

VM="$VM_USER@$VM_IP"

echo -e "${BLUE}🏗️  Local Build + Deploy Pipeline${NC}"
echo -e "${YELLOW}Target: $VM${NC}"
echo ""

# Step 1: Pre-flight checks
echo -e "${BLUE}🔍 Step 1: Pre-flight checks...${NC}"

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

echo -e "${GREEN}✓ Pre-flight checks passed${NC}"

# Step 2: Clean install
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3: Build
echo -e "${BLUE}🏗️  Step 3: Building application...${NC}"
rm -rf .next
npx next build --webpack

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed: $BUILD_DIR not found${NC}"
    exit 1
fi

# Verify chunks
CHUNK_COUNT=$(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l)
if [ "$CHUNK_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ No JavaScript chunks found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful ($CHUNK_COUNT chunks)${NC}"

# Step 4: Verify static files copied
echo -e "${BLUE}🔍 Step 4: Verifying static files...${NC}"
STANDALONE_CHUNKS=$(find "$BUILD_DIR/.next/static/chunks" -name "*.js" 2>/dev/null | wc -l)
if [ "$STANDALONE_CHUNKS" -ne "$CHUNK_COUNT" ]; then
    echo -e "${RED}❌ Chunk mismatch: $STANDALONE_CHUNKS != $CHUNK_COUNT${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Static files verified ($STANDALONE_CHUNKS chunks)${NC}"

# Step 5: Create tarball
echo -e "${BLUE}📦 Step 5: Creating deployment package...${NC}"
cd "$BUILD_DIR"
tar -czf "../../$TARBALL" . .env.local 2>/dev/null || tar -czf "../../$TARBALL" .
cd - > /dev/null
TARBALL_SIZE=$(du -h "$TARBALL" | cut -f1)
echo -e "${GREEN}✓ Package created ($TARBALL_SIZE)${NC}"

# Step 6: Deploy to VM
echo -e "${BLUE}🚀 Step 6: Deploying to VM...${NC}"

# Test SSH connection
if ! ssh -o ConnectTimeout=5 "$VM" "echo 'Connection test'" > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to $VM${NC}"
    echo -e "${YELLOW}Make sure SSH key is set up: ssh-copy-id $VM${NC}"
    exit 1
fi

# Create backup on VM
echo -e "${YELLOW}Creating backup on VM...${NC}"
ssh "$VM" "sudo mkdir -p /var/backups/converseblog && \
    if [ -d $APP_DIR/.next/standalone ] && sudo systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
        sudo rm -rf /var/backups/converseblog/last_working
        sudo cp -r $APP_DIR/.next/standalone /var/backups/converseblog/last_working
        echo 'Backup created'
    else
        echo 'No previous version to backup'
    fi"

# Stop service
echo -e "${YELLOW}Stopping service...${NC}"
ssh "$VM" "sudo systemctl stop $SERVICE_NAME || true"

# Upload tarball
echo -e "${YELLOW}Uploading package...${NC}"
scp "$TARBALL" "$VM:/tmp/"

# Extract on VM
echo -e "${YELLOW}Extracting on VM...${NC}"
ssh "$VM" "
    sudo mkdir -p $APP_DIR
    cd /tmp
    sudo rm -rf $APP_DIR/.next/standalone.old
    if [ -d $APP_DIR/.next/standalone ]; then
        sudo mv $APP_DIR/.next/standalone $APP_DIR/.next/standalone.old
    fi
    sudo mkdir -p $APP_DIR/.next/standalone
    sudo tar -xzf $TARBALL -C $APP_DIR/.next/standalone
    sudo chown -R \$(whoami):\$(whoami) $APP_DIR/.next/standalone
    sudo cp $APP_DIR/.env.local $APP_DIR/.next/standalone/.env.local 2>/dev/null || true
    rm -f $TARBALL
"

# Start service
echo -e "${YELLOW}Starting service...${NC}"
ssh "$VM" "
    sudo systemctl daemon-reload
    sudo systemctl start $SERVICE_NAME
    sleep 3
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo 'Service started'
    else
        echo 'Service failed to start'
        exit 1
    fi
"

# Health check
echo -e "${BLUE}🏥 Step 7: Health check...${NC}"
sleep 2
if ssh "$VM" "curl -f -s http://localhost:3000 > /dev/null"; then
    echo -e "${GREEN}✓ Service is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed (service might still be starting)${NC}"
fi

# Cleanup
rm -f "$TARBALL"

echo ""
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "  • Built locally with $CHUNK_COUNT chunks"
echo "  • Deployed to $VM"
echo "  • Package size: $TARBALL_SIZE"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  • Check logs: ssh $VM 'sudo journalctl -u $SERVICE_NAME -f'"
echo "  • Visit: http://$VM_IP"
echo ""

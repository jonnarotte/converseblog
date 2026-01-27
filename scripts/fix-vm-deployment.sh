#!/bin/bash

# 🔧 FIX VM DEPLOYMENT
# Fixes missing chunks and redeploys properly
# Usage: ./scripts/fix-vm-deployment.sh

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load config
if [ ! -f ".deploy-config" ]; then
    echo -e "${RED}❌ .deploy-config not found${NC}"
    exit 1
fi

source .deploy-config
VM="$VM_USER@$VM_IP"
SSH_KEY="${SSH_KEY/#\~/$HOME}"

echo -e "${BLUE}🔧 Fixing VM Deployment${NC}"
echo ""

# Step 1: Rebuild locally with proper chunks
echo -e "${BLUE}🏗️  Step 1: Rebuilding locally...${NC}"
./scripts/stage1-build.sh

if [ ! -f "deploy.tar.gz" ]; then
    echo -e "${RED}❌ Build failed - no tarball created${NC}"
    exit 1
fi

echo ""

# Step 2: Transfer to VM
echo -e "${BLUE}📤 Step 2: Transferring to VM...${NC}"
./scripts/stage2-transfer.sh

echo ""

# Step 3: Verify chunks on VM
echo -e "${BLUE}🔍 Step 3: Verifying chunks on VM...${NC}"
CHUNKS_ON_VM=$(ssh -i "$SSH_KEY" "$VM" "find /var/www/converseblog/standalone/.next/static/chunks -name '*.js' 2>/dev/null | wc -l" | tr -d ' ')

if [ "$CHUNKS_ON_VM" -eq 0 ]; then
    echo -e "${RED}❌ Chunks still missing on VM!${NC}"
    echo -e "${YELLOW}Checking what's in standalone...${NC}"
    ssh -i "$SSH_KEY" "$VM" "ls -la /var/www/converseblog/standalone/.next/static/ 2>/dev/null || echo 'No static directory'"
    exit 1
fi

echo -e "${GREEN}✓ Found $CHUNKS_ON_VM chunks on VM${NC}"
echo ""

# Step 4: Restart service
echo -e "${BLUE}🔄 Step 4: Restarting service...${NC}"
ssh -i "$SSH_KEY" "$VM" "sudo systemctl restart converseblog && sleep 2 && sudo systemctl status converseblog --no-pager | head -10"

echo ""
echo -e "${GREEN}✅ Deployment fixed!${NC}"
echo ""
echo -e "${BLUE}📋 Verification:${NC}"
echo "  - Chunks: $CHUNKS_ON_VM files"
echo "  - Service: Check with: sudo systemctl status converseblog"
echo "  - Logs: Check with: sudo journalctl -u converseblog -n 20"

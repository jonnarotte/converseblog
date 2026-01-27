#!/bin/bash

# 🚀 COMPLETE 3-STAGE DEPLOYMENT
# Runs all 3 stages in sequence
# Usage: ./scripts/deploy-all.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Complete 3-Stage Deployment${NC}"
echo ""

# Check config
if [ ! -f ".deploy-config" ]; then
    echo -e "${RED}❌ Configuration not found${NC}"
    echo -e "${YELLOW}Run: ./scripts/setup-deployment.sh first${NC}"
    exit 1
fi

source .deploy-config
VM="$VM_USER@$VM_IP"
SSH_KEY="${SSH_KEY/#\~/$HOME}"

# Stage 1
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STAGE 1: Local Build${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
./scripts/stage1-build.sh

# Stage 2
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STAGE 2: Transfer to VM${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
./scripts/stage2-transfer.sh

# Stage 3
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STAGE 3: Deploy on VM${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
ssh -i "$SSH_KEY" "$VM" "cd $VM_APP_DIR && bash -s" < scripts/stage3-deploy.sh

echo ""
echo -e "${GREEN}✅ ALL STAGES COMPLETE!${NC}"
echo ""
echo -e "${YELLOW}🎉 Deployment successful!${NC}"
echo ""

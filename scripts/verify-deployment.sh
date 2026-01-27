#!/bin/bash

# ✅ Verify Deployment Configuration
# Checks if everything is ready for deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Verifying Deployment Configuration...${NC}"
echo ""

ERRORS=0

# Check config file
if [ -f ".deploy-config" ]; then
    source .deploy-config
    echo -e "${GREEN}✓ Configuration file found${NC}"
    echo "  VM: $VM_USER@$VM_IP"
    echo "  App Dir: $VM_APP_DIR"
    echo "  Service: $SERVICE_NAME"
    echo "  Domain: ${DOMAIN:-not set}"
else
    echo -e "${RED}❌ Configuration file not found${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check .env.local
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local found${NC}"
    source .env.local
    if [ -z "${NEXT_PUBLIC_SANITY_PROJECT_ID:-}" ]; then
        echo -e "${RED}❌ NEXT_PUBLIC_SANITY_PROJECT_ID not set${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓ NEXT_PUBLIC_SANITY_PROJECT_ID is set${NC}"
    fi
else
    echo -e "${RED}❌ .env.local not found${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check SSH connection
if [ -f ".deploy-config" ]; then
    source .deploy-config
    SSH_KEY="${SSH_KEY/#\~/$HOME}"
    VM="$VM_USER@$VM_IP"
    
    echo -e "${BLUE}Testing SSH connection...${NC}"
    if [ -f "$SSH_KEY" ]; then
        if ssh -i "$SSH_KEY" -o ConnectTimeout=5 -o BatchMode=yes "$VM" "echo 'OK'" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ SSH connection successful${NC}"
        else
            echo -e "${YELLOW}⚠️  SSH connection failed${NC}"
            echo -e "${YELLOW}   Test manually: ssh -i $SSH_KEY $VM${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${YELLOW}⚠️  SSH key not found: $SSH_KEY${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

# Check scripts
SCRIPTS=("stage1-build.sh" "stage2-transfer.sh" "stage3-deploy.sh" "deploy-all.sh")
for script in "${SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ] && [ -x "scripts/$script" ]; then
        echo -e "${GREEN}✓ scripts/$script${NC}"
    else
        echo -e "${RED}❌ scripts/$script missing or not executable${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# Summary
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    echo ""
    echo -e "${YELLOW}Run: ./scripts/deploy-all.sh${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s). Please fix before deploying.${NC}"
    exit 1
fi

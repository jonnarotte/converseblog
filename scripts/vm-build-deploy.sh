#!/bin/bash

# 🏗️  BUILD ON VM (Alternative Deployment)
# Builds directly on VM instead of transferring large files
# Use this if file transfers keep failing
# Usage: ./scripts/vm-build-deploy.sh

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
SSH_OPTS="-i $SSH_KEY -o ConnectTimeout=10 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no"

echo -e "${BLUE}🏗️  Build on VM Deployment${NC}"
echo -e "${YELLOW}This builds directly on VM to avoid large file transfers${NC}"
echo ""

# Test SSH
echo -e "${BLUE}🔍 Testing SSH connection...${NC}"
if ! ssh $SSH_OPTS "$VM" "echo 'Connected'" &>/dev/null; then
    echo -e "${RED}❌ Cannot connect to VM${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connected${NC}"
echo ""

# Check if git repo is accessible
echo -e "${BLUE}📋 Checking requirements...${NC}"
GIT_REPO=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$GIT_REPO" ]; then
    echo -e "${RED}❌ Git repository not found${NC}"
    echo -e "${YELLOW}Please provide your git repository URL:${NC}"
    read -p "Git URL: " GIT_REPO
fi

echo -e "${GREEN}✓ Git repo: $GIT_REPO${NC}"
echo ""

# Check VM has git and node
echo -e "${BLUE}🔍 Checking VM prerequisites...${NC}"
ssh $SSH_OPTS "$VM" "
    if ! command -v git &> /dev/null; then
        echo 'Installing git...'
        sudo apt-get update && sudo apt-get install -y git
    fi
    if ! command -v node &> /dev/null; then
        echo 'Installing Node.js...'
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    echo '✓ Prerequisites OK'
"
echo ""

# Create app directory
echo -e "${BLUE}📁 Setting up app directory...${NC}"
ssh $SSH_OPTS "$VM" "
    sudo mkdir -p $VM_APP_DIR
    sudo chown -R \$(whoami):\$(whoami) $VM_APP_DIR
    cd $VM_APP_DIR
    
    # Clone or update repo
    if [ -d .git ]; then
        echo 'Updating existing repository...'
        git pull origin main || git pull origin master
    else
        echo 'Cloning repository...'
        git clone $GIT_REPO .
    fi
"
echo -e "${GREEN}✓ Repository ready${NC}"
echo ""

# Transfer .env.local
echo -e "${BLUE}📤 Transferring .env.local...${NC}"
if [ -f ".env.local" ]; then
    scp $SSH_OPTS -C ".env.local" "$VM:$VM_APP_DIR/.env.local"
    echo -e "${GREEN}✓ .env.local transferred${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
fi
echo ""

# Build on VM
echo -e "${BLUE}🏗️  Building on VM...${NC}"
echo -e "${YELLOW}This may take 5-10 minutes...${NC}"
ssh $SSH_OPTS "$VM" "
    cd $VM_APP_DIR
    
    # Install dependencies
    echo 'Installing dependencies...'
    npm install --legacy-peer-deps
    
    # Build
    echo 'Building application...'
    npx next build --webpack
    
    # Run postbuild script
    if [ -f scripts/copy-static.js ]; then
        echo 'Running postbuild script...'
        node scripts/copy-static.js
    fi
    
    echo '✓ Build complete'
"
echo ""

# Verify build
echo -e "${BLUE}🔍 Verifying build...${NC}"
ssh $SSH_OPTS "$VM" "
    if [ -f $VM_APP_DIR/.next/standalone/server.js ]; then
        echo '✓ server.js found'
    else
        echo '❌ Build failed - server.js not found'
        exit 1
    fi
    
    CHUNKS=\$(find $VM_APP_DIR/.next/standalone/.next/static/chunks -name '*.js' 2>/dev/null | wc -l)
    echo \"✓ Found \$CHUNKS JavaScript chunks\"
"
echo ""

# Deploy
echo -e "${BLUE}🚀 Deploying...${NC}"
ssh $SSH_OPTS "$VM" "
    cd $VM_APP_DIR
    
    # Copy .env.local to standalone
    if [ -f .env.local ]; then
        cp .env.local .next/standalone/.env.local
    fi
    
    # Run stage3 deploy script
    if [ -f scripts/stage3-deploy.sh ]; then
        bash scripts/stage3-deploy.sh
    else
        echo '⚠️  stage3-deploy.sh not found, manual deployment needed'
    fi
"

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "  • Built directly on VM (no large file transfer)"
echo "  • Repository: $GIT_REPO"
echo "  • App directory: $VM_APP_DIR"
echo ""

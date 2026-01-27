#!/bin/bash

# 🚀 STAGE 2: TRANSFER BUILD TO VM
# Transfers the build package from local to GCloud VM
# Usage: ./scripts/stage2-transfer.sh

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load configuration
CONFIG_FILE=".deploy-config"
TARBALL="deploy.tar.gz"

# Expand SSH key path
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
    SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"
    SSH_KEY="${SSH_KEY/#\~/$HOME}"
else
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
    echo -e "${YELLOW}Run: ./scripts/setup-deployment.sh${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 STAGE 2: Transfer Build to VM${NC}"
echo ""

# Verify all required variables are set
if [ -z "${VM_USER:-}" ] || [ -z "${VM_IP:-}" ] || [ -z "${VM_APP_DIR:-}" ]; then
    echo -e "${RED}❌ Missing required configuration variables${NC}"
    exit 1
fi

VM="$VM_USER@$VM_IP"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o ConnectTimeout=30 -o TCPKeepAlive=yes -o ServerAliveCountMax=10 -o Compression=yes"

# Check if tarball exists
if [ ! -f "$TARBALL" ]; then
    echo -e "${RED}❌ Deployment tarball not found: $TARBALL${NC}"
    echo -e "${YELLOW}Run: ./scripts/stage1-build.sh first${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  VM: $VM"
echo "  App Directory: $VM_APP_DIR"
echo "  Tarball: $TARBALL ($(du -h "$TARBALL" | cut -f1))"
echo ""

# Test SSH connection
echo -e "${BLUE}🔍 Testing SSH connection...${NC}"
if ! ssh $SSH_OPTS "$VM" "echo 'Connection OK'" > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to $VM${NC}"
    exit 1
fi
echo -e "${GREEN}✓ SSH connection OK${NC}"
echo ""

# Stop service on VM
echo -e "${BLUE}🛑 Stopping service on VM...${NC}"
ssh $SSH_OPTS "$VM" "sudo systemctl stop ${SERVICE_NAME:-converseblog} || true"
echo -e "${GREEN}✓ Service stopped${NC}"
echo ""

# Upload tarball
echo -e "${BLUE}📤 Uploading package to VM...${NC}"
TARBALL_SIZE=$(du -h "$TARBALL" | cut -f1)
LOCAL_SIZE=$(stat -f%z "$TARBALL" 2>/dev/null || stat -c%s "$TARBALL" 2>/dev/null)
echo "  Size: $TARBALL_SIZE"
echo "  This may take a few minutes..."
echo ""

# Check if file already exists and is complete
REMOTE_SIZE=$(ssh $SSH_OPTS "$VM" "stat -c%s /tmp/deploy.tar.gz 2>/dev/null || echo 0" 2>/dev/null || echo "0")
REMOTE_SIZE=$(echo "$REMOTE_SIZE" | tr -d ' ')

# Always re-upload to ensure latest version (don't trust cached file)
echo -e "${YELLOW}Removing old tarball on VM (if exists) to ensure fresh upload...${NC}"
ssh $SSH_OPTS "$VM" "rm -f /tmp/deploy.tar.gz" 2>/dev/null || true
echo ""
    # Try rsync first (more reliable for large files) - check both local and remote
    if command -v rsync &> /dev/null && ssh $SSH_OPTS "$VM" "command -v rsync" &>/dev/null; then
        echo -e "${BLUE}Using rsync (more reliable for large files)...${NC}"
        if rsync -avz --progress -e "ssh $SSH_OPTS" "$TARBALL" "$VM:/tmp/deploy.tar.gz" 2>&1; then
            echo -e "${GREEN}✓ Upload successful${NC}"
        else
            echo -e "${YELLOW}⚠️  rsync failed, trying SCP...${NC}"
            SCP_OPTS="$SSH_OPTS -C" # Compression enabled
            if ! scp $SCP_OPTS "$TARBALL" "$VM:/tmp/deploy.tar.gz"; then
                echo -e "${RED}❌ Upload failed${NC}"
                echo ""
                echo -e "${YELLOW}💡 Solutions:${NC}"
                echo "  1. Install rsync on VM: ssh $VM 'sudo apt-get install -y rsync'"
                echo "  2. Use CI/CD pipeline (GitHub Actions) - more reliable"
                echo "  3. Try manual upload: scp $SCP_OPTS $TARBALL $VM:/tmp/deploy.tar.gz"
                exit 1
            fi
        fi
    else
        # Fallback to SCP
        echo -e "${BLUE}Using SCP (rsync not available on VM)...${NC}"
        echo -e "${YELLOW}Tip: Install rsync on VM for more reliable uploads:${NC}"
        echo "  ssh $VM 'sudo apt-get install -y rsync'"
        echo ""
        SCP_OPTS="$SSH_OPTS -C" # Compression enabled
        if ! scp $SCP_OPTS "$TARBALL" "$VM:/tmp/deploy.tar.gz"; then
            echo -e "${RED}❌ Upload failed${NC}"
            echo ""
            echo -e "${YELLOW}💡 Your network connection is unstable. Options:${NC}"
            echo "  1. Use CI/CD pipeline (GitHub Actions) - recommended"
            echo "  2. Install rsync on VM: ssh $VM 'sudo apt-get install -y rsync'"
            echo "  3. Try again later when network is stable"
            exit 1
        fi
    fi
    echo ""

# Extract on VM
echo -e "${BLUE}📦 Extracting on VM...${NC}"
ssh $SSH_OPTS "$VM" "
    sudo mkdir -p $VM_APP_DIR
    cd /tmp
    
    # Extract to temp directory
    TEMP_DIR=\$(mktemp -d)
    tar -xzf deploy.tar.gz -C \$TEMP_DIR
    
    # Move standalone build
    if [ -d \$TEMP_DIR/standalone ]; then
        sudo rm -rf $VM_APP_DIR/standalone.old
        if [ -d $VM_APP_DIR/standalone ]; then
            sudo mv $VM_APP_DIR/standalone $VM_APP_DIR/standalone.old
        fi
        sudo mkdir -p $VM_APP_DIR
        sudo mv \$TEMP_DIR/standalone $VM_APP_DIR/standalone
    else
        echo '❌ Error: standalone directory not found in tarball'
        exit 1
    fi
    
    # Copy .env.local
    if [ -f \$TEMP_DIR/.env.local ]; then
        sudo cp \$TEMP_DIR/.env.local $VM_APP_DIR/standalone/.env.local
    elif [ -f $VM_APP_DIR/.env.local ]; then
        sudo cp $VM_APP_DIR/.env.local $VM_APP_DIR/standalone/.env.local
    fi
    
    # Copy scripts
    if [ -d \$TEMP_DIR/scripts ]; then
        sudo mkdir -p $VM_APP_DIR/scripts
        sudo cp -r \$TEMP_DIR/scripts/* $VM_APP_DIR/scripts/
        sudo chmod +x $VM_APP_DIR/scripts/*.sh
    fi
    
    # Set permissions
    sudo chown -R \$(whoami):\$(whoami) $VM_APP_DIR/standalone
    
    # Cleanup
    sudo rm -rf \$TEMP_DIR
    rm -f deploy.tar.gz
    
    echo 'Extraction complete'
"

echo -e "${GREEN}✓ Extraction complete${NC}"
echo ""

# Verify on VM
echo -e "${BLUE}🔍 Verifying on VM...${NC}"
ssh $SSH_OPTS "$VM" "
    if [ -f $VM_APP_DIR/standalone/server.js ]; then
        echo '✓ server.js found'
    else
        echo '❌ server.js not found'
        exit 1
    fi
    
    CHUNKS=\$(find $VM_APP_DIR/standalone/.next/static/chunks -name '*.js' 2>/dev/null | wc -l)
    echo \"✓ Found \$CHUNKS JavaScript chunks\"
"

echo ""
echo -e "${GREEN}✅ STAGE 2 COMPLETE!${NC}"
echo ""
echo -e "${YELLOW}Next: Run stage3-deploy.sh on VM${NC}"
echo "  ssh $SSH_OPTS $VM 'cd $VM_APP_DIR && bash scripts/stage3-deploy.sh'"

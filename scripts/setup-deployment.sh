#!/bin/bash

# 🔧 SETUP DEPLOYMENT CONFIGURATION
# Interactive setup for 3-stage deployment
# Usage: ./scripts/setup-deployment.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONFIG_FILE=".deploy-config"

echo -e "${BLUE}🔧 Deployment Configuration Setup${NC}"
echo ""
echo "This will configure your 3-stage deployment pipeline."
echo ""

# Collect information
read -p "VM Username (e.g., ubuntu): " VM_USER
read -p "VM IP Address (e.g., 34.123.45.67): " VM_IP
read -p "VM App Directory (e.g., /var/www/converseblog): " VM_APP_DIR
read -p "Service Name (e.g., converseblog) [default: converseblog]: " SERVICE_NAME
SERVICE_NAME=${SERVICE_NAME:-converseblog}
read -p "Port (default: 3000) [default: 3000]: " PORT
PORT=${PORT:-3000}

# SSH key
read -p "SSH Key Path [default: ~/.ssh/google_compute_engine]: " SSH_KEY
SSH_KEY=${SSH_KEY:-~/.ssh/google_compute_engine}

# Expand ~ in paths
SSH_KEY="${SSH_KEY/#\~/$HOME}"
VM_APP_DIR="${VM_APP_DIR%/}"  # Remove trailing slash

# Validate
if [ -z "$VM_USER" ] || [ -z "$VM_IP" ] || [ -z "$VM_APP_DIR" ]; then
    echo -e "${RED}❌ All fields are required${NC}"
    exit 1
fi

# Create config file
cat > "$CONFIG_FILE" << EOF
# Deployment Configuration
# Generated on $(date)

VM_USER="$VM_USER"
VM_IP="$VM_IP"
VM_APP_DIR="$VM_APP_DIR"
SERVICE_NAME="$SERVICE_NAME"
PORT="$PORT"
SSH_KEY="$SSH_KEY"
EOF

echo ""
echo -e "${GREEN}✅ Configuration saved to $CONFIG_FILE${NC}"
echo ""
echo -e "${BLUE}📋 Configuration:${NC}"
echo "  VM: $VM_USER@$VM_IP"
echo "  App Directory: $VM_APP_DIR"
echo "  Service: $SERVICE_NAME"
echo "  Port: $PORT"
echo "  SSH Key: $SSH_KEY"
echo ""

# Test SSH
echo -e "${YELLOW}Testing SSH connection...${NC}"
SSH_KEY_EXPANDED="${SSH_KEY/#\~/$HOME}"
if [ -f "$SSH_KEY_EXPANDED" ]; then
    if ssh -i "$SSH_KEY_EXPANDED" -o ConnectTimeout=5 "$VM_USER@$VM_IP" "echo 'Connection OK'" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ SSH connection successful${NC}"
    else
        echo -e "${YELLOW}⚠️  SSH connection failed. Make sure:${NC}"
        echo "  1. Key file exists: $SSH_KEY_EXPANDED"
        echo "  2. Key permissions: chmod 600 $SSH_KEY_EXPANDED"
        echo "  3. VM is accessible"
        echo "  4. Username and IP are correct"
    fi
else
    echo -e "${YELLOW}⚠️  SSH key not found: $SSH_KEY_EXPANDED${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  1. Build: ./scripts/stage1-build.sh"
echo "  2. Transfer: ./scripts/stage2-transfer.sh"
echo "  3. Deploy: ssh $VM_USER@$VM_IP 'cd $VM_APP_DIR && ./scripts/stage3-deploy.sh'"
echo ""

#!/bin/bash

# 🧹 RUN VM CLEANUP
# Transfers and runs the cleanup script on the VM
# Usage: ./scripts/run-vm-cleanup.sh

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

echo -e "${BLUE}🧹 VM Cleanup Runner${NC}"
echo ""

# Test SSH connection
echo -e "${BLUE}🔍 Testing SSH connection...${NC}"
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=5 "$VM" "echo 'Connected'" &>/dev/null; then
    echo -e "${RED}❌ Cannot connect to VM${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connected${NC}"
echo ""

# Show before stats
echo -e "${BLUE}📊 Before Cleanup:${NC}"
ssh -i "$SSH_KEY" "$VM" "df -h / | tail -1 && echo '---' && free -h | grep Mem"
echo ""

# Transfer and run cleanup script
echo -e "${BLUE}📤 Transferring cleanup script...${NC}"
scp -i "$SSH_KEY" scripts/vm-cleanup.sh "$VM:/tmp/vm-cleanup.sh"
echo -e "${GREEN}✓ Script transferred${NC}"
echo ""

# Run cleanup (with sudo for full cleanup)
echo -e "${BLUE}🧹 Running cleanup on VM...${NC}"
echo -e "${YELLOW}Note: Some operations require sudo. You may be prompted for password.${NC}"
echo ""
ssh -i "$SSH_KEY" -t "$VM" "chmod +x /tmp/vm-cleanup.sh && sudo /tmp/vm-cleanup.sh"

# Show after stats
echo ""
echo -e "${BLUE}📊 After Cleanup:${NC}"
ssh -i "$SSH_KEY" "$VM" "df -h / | tail -1 && echo '---' && free -h | grep Mem"
echo ""

echo -e "${GREEN}✅ Cleanup complete!${NC}"

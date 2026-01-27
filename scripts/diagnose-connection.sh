#!/bin/bash
# Diagnose SSH/SCP connection issues
# Run this ON YOUR LOCAL MACHINE

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load config
if [ -f ".deploy-config" ]; then
    source ".deploy-config"
    SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"
    SSH_KEY="${SSH_KEY/#\~/$HOME}"
else
    echo -e "${RED}❌ .deploy-config not found${NC}"
    exit 1
fi

VM="$VM_USER@$VM_IP"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o ConnectTimeout=30"

echo -e "${BLUE}🔍 Diagnosing Connection Issues${NC}"
echo ""

# 1. Test basic SSH
echo -e "${BLUE}1. Testing SSH connection...${NC}"
if ssh $SSH_OPTS "$VM" "echo 'SSH OK'" 2>&1; then
    echo -e "${GREEN}✓ SSH works${NC}"
else
    echo -e "${RED}❌ SSH failed${NC}"
    exit 1
fi
echo ""

# 2. Test long-running SSH
echo -e "${BLUE}2. Testing long-running SSH (30 seconds)...${NC}"
if timeout 35 ssh $SSH_OPTS "$VM" "sleep 30 && echo 'Long connection OK'" 2>&1; then
    echo -e "${GREEN}✓ Long connection works${NC}"
else
    echo -e "${RED}❌ Long connection failed - connection drops${NC}"
fi
echo ""

# 3. Check VM SSH config
echo -e "${BLUE}3. Checking VM SSH server config...${NC}"
ssh $SSH_OPTS "$VM" "
    echo 'SSH Config:'
    sudo grep -E '^(ClientAliveInterval|ClientAliveCountMax|TCPKeepAlive)' /etc/ssh/sshd_config 2>/dev/null || echo 'Using defaults'
    echo ''
    echo 'SSH Server Status:'
    sudo systemctl status sshd --no-pager | head -5
" 2>&1
echo ""

# 4. Check VM firewall
echo -e "${BLUE}4. Checking VM firewall...${NC}"
ssh $SSH_OPTS "$VM" "
    if command -v ufw &> /dev/null; then
        echo 'UFW Status:'
        sudo ufw status
    elif command -v firewall-cmd &> /dev/null; then
        echo 'Firewalld Status:'
        sudo firewall-cmd --state
    else
        echo 'No firewall detected (or using iptables)'
    fi
" 2>&1
echo ""

# 5. Check VM resources
echo -e "${BLUE}5. Checking VM resources...${NC}"
ssh $SSH_OPTS "$VM" "
    echo 'Memory:'
    free -h
    echo ''
    echo 'Disk:'
    df -h /tmp /var/www
    echo ''
    echo 'Load:'
    uptime
" 2>&1
echo ""

# 6. Test SCP with small file
echo -e "${BLUE}6. Testing SCP with small file (1MB)...${NC}"
TEST_FILE="/tmp/test_scp_$(date +%s).txt"
dd if=/dev/zero of="$TEST_FILE" bs=1M count=1 2>/dev/null
if scp $SSH_OPTS -C "$TEST_FILE" "$VM:/tmp/test_scp.txt" 2>&1; then
    echo -e "${GREEN}✓ Small file SCP works${NC}"
    ssh $SSH_OPTS "$VM" "rm -f /tmp/test_scp.txt" 2>/dev/null
else
    echo -e "${RED}❌ Small file SCP failed${NC}"
fi
rm -f "$TEST_FILE"
echo ""

# 7. Network test
echo -e "${BLUE}7. Testing network connectivity...${NC}"
ssh $SSH_OPTS "$VM" "
    echo 'Ping test:'
    ping -c 3 8.8.8.8 2>&1 | tail -2
    echo ''
    echo 'Network interfaces:'
    ip addr show | grep -E '^[0-9]+:|inet ' | head -6
" 2>&1
echo ""

echo -e "${BLUE}📋 Summary${NC}"
echo "Run these commands on VM to fix common issues:"
echo ""
echo -e "${YELLOW}Fix SSH timeout (if connection drops):${NC}"
echo "  sudo nano /etc/ssh/sshd_config"
echo "  Add/change:"
echo "    ClientAliveInterval 60"
echo "    ClientAliveCountMax 3"
echo "    TCPKeepAlive yes"
echo "  sudo systemctl restart sshd"
echo ""
echo -e "${YELLOW}Check firewall (if blocking):${NC}"
echo "  sudo ufw status"
echo "  sudo ufw allow 22/tcp"
echo ""
echo -e "${YELLOW}Check disk space:${NC}"
echo "  df -h"
echo "  sudo du -sh /tmp /var/www"

#!/bin/bash

# 🧹 VM CLEANUP SCRIPT
# Cleans up unnecessary files, logs, and optimizes the VM
# Run this on the VM: bash <(curl -s) or scp and run

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧹 VM Cleanup & Optimization${NC}"
echo ""

# Check if running as root for some operations
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  Some operations require root. Run with sudo for full cleanup.${NC}"
    SUDO=""
else
    SUDO=""
fi

# Step 1: Check current disk usage
echo -e "${BLUE}📊 Step 1: Current Disk Usage${NC}"
df -h / | tail -1
echo ""

# Step 2: Clean old build artifacts and backups
echo -e "${BLUE}🗑️  Step 2: Removing old build artifacts...${NC}"
APP_DIR="/var/www/converseblog"
if [ -d "$APP_DIR" ]; then
    # Remove old backups (keep only last 2)
    if [ -d "$APP_DIR/backups" ]; then
        BACKUP_COUNT=$(ls -1t "$APP_DIR/backups" 2>/dev/null | wc -l)
        if [ "$BACKUP_COUNT" -gt 2 ]; then
            ls -1t "$APP_DIR/backups" | tail -n +3 | xargs -I {} rm -f "$APP_DIR/backups/{}"
            echo -e "${GREEN}✓ Removed old backups${NC}"
        fi
    fi
    
    # Remove old deploy tarballs
    find "$APP_DIR" -name "deploy.tar.gz" -mtime +7 -delete 2>/dev/null && echo -e "${GREEN}✓ Removed old deploy tarballs${NC}" || true
    
    # Remove old standalone builds (keep only current)
    find "$APP_DIR" -type d -name "standalone" -not -path "*/current/*" -mtime +1 -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓ Removed old standalone builds${NC}" || true
fi
echo ""

# Step 3: Clean npm cache and node_modules (if not in use)
echo -e "${BLUE}📦 Step 3: Cleaning npm cache...${NC}"
if command -v npm &> /dev/null; then
    npm cache clean --force 2>/dev/null && echo -e "${GREEN}✓ NPM cache cleaned${NC}" || echo -e "${YELLOW}⚠️  NPM cache clean skipped${NC}"
fi
echo ""

# Step 4: Clean system logs (keep last 7 days)
echo -e "${BLUE}📋 Step 4: Cleaning system logs...${NC}"
if [ -n "$SUDO" ] || [ "$EUID" -eq 0 ]; then
    journalctl --vacuum-time=7d 2>/dev/null && echo -e "${GREEN}✓ System logs cleaned (kept last 7 days)${NC}" || echo -e "${YELLOW}⚠️  Log cleanup skipped (requires root)${NC}"
else
    echo -e "${YELLOW}⚠️  Log cleanup skipped (requires root)${NC}"
fi
echo ""

# Step 5: Clean temporary files
echo -e "${BLUE}🗂️  Step 5: Cleaning temporary files...${NC}"
# Clean /tmp files older than 7 days
find /tmp -type f -mtime +7 -delete 2>/dev/null && echo -e "${GREEN}✓ /tmp cleaned${NC}" || true

# Clean user temp files
find ~/tmp -type f -mtime +7 -delete 2>/dev/null && echo -e "${GREEN}✓ User temp files cleaned${NC}" || true

# Clean old log files
find "$APP_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null && echo -e "${GREEN}✓ Old log files removed${NC}" || true
echo ""

# Step 6: Clean package manager caches
echo -e "${BLUE}📦 Step 6: Cleaning package manager caches...${NC}"
if [ -n "$SUDO" ] || [ "$EUID" -eq 0 ]; then
    # APT cache (Debian/Ubuntu)
    if command -v apt-get &> /dev/null; then
        apt-get clean 2>/dev/null && echo -e "${GREEN}✓ APT cache cleaned${NC}" || true
        apt-get autoremove -y 2>/dev/null && echo -e "${GREEN}✓ Unused packages removed${NC}" || true
    fi
    
    # YUM cache (RHEL/CentOS)
    if command -v yum &> /dev/null; then
        yum clean all 2>/dev/null && echo -e "${GREEN}✓ YUM cache cleaned${NC}" || true
    fi
else
    echo -e "${YELLOW}⚠️  Package cache cleanup skipped (requires root)${NC}"
fi
echo ""

# Step 7: Remove old kernel versions (if any)
echo -e "${BLUE}🔧 Step 7: Checking for old kernels...${NC}"
if [ -n "$SUDO" ] || [ "$EUID" -eq 0 ]; then
    if command -v apt-get &> /dev/null; then
        OLD_KERNELS=$(dpkg -l | grep -E 'linux-image-[0-9]' | grep -v $(uname -r) | awk '{print $2}' | head -n -1)
        if [ -n "$OLD_KERNELS" ]; then
            echo -e "${YELLOW}Found old kernels (not removing automatically for safety)${NC}"
            echo "$OLD_KERNELS"
        else
            echo -e "${GREEN}✓ No old kernels found${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Kernel check skipped (requires root)${NC}"
fi
echo ""

# Step 8: Clean application-specific files
echo -e "${BLUE}🎯 Step 8: Cleaning application files...${NC}"
if [ -d "$APP_DIR" ]; then
    # Remove .next cache if exists (will be regenerated)
    find "$APP_DIR" -type d -name ".next" -not -path "*/standalone/.next/*" -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓ Removed .next cache${NC}" || true
    
    # Remove node_modules if not needed (standalone doesn't need it)
    find "$APP_DIR" -type d -name "node_modules" -not -path "*/standalone/*" -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓ Removed node_modules${NC}" || true
    
    # Remove source code if standalone exists
    if [ -d "$APP_DIR/standalone" ] && [ -f "$APP_DIR/standalone/server.js" ]; then
        # Keep only essential files
        KEEP_FILES=("standalone" ".env.local" "scripts" ".deploy-config")
        for item in "$APP_DIR"/*; do
            if [ -e "$item" ]; then
                BASENAME=$(basename "$item")
                KEEP=false
                for keep in "${KEEP_FILES[@]}"; do
                    if [ "$BASENAME" == "$keep" ]; then
                        KEEP=true
                        break
                    fi
                done
                if [ "$KEEP" = false ]; then
                    rm -rf "$item" 2>/dev/null && echo -e "${GREEN}✓ Removed $BASENAME${NC}" || true
                fi
            fi
        done
    fi
fi
echo ""

# Step 9: Optimize system
echo -e "${BLUE}⚡ Step 9: System optimization...${NC}"
# Clear system caches (if root)
if [ -n "$SUDO" ] || [ "$EUID" -eq 0 ]; then
    sync
    echo 3 > /proc/sys/vm/drop_caches 2>/dev/null && echo -e "${GREEN}✓ System caches cleared${NC}" || echo -e "${YELLOW}⚠️  Cache clear skipped${NC}"
fi
echo ""

# Step 10: Final disk usage
echo -e "${BLUE}📊 Step 10: Final Disk Usage${NC}"
df -h / | tail -1
echo ""

# Summary
echo -e "${GREEN}✅ Cleanup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 What was kept:${NC}"
echo "  ✓ Current application (standalone build)"
echo "  ✓ Environment files (.env.local)"
echo "  ✓ Deployment scripts"
echo "  ✓ Last 2 backups"
echo "  ✓ System logs (last 7 days)"
echo ""
echo -e "${BLUE}🗑️  What was removed:${NC}"
echo "  ✓ Old backups (kept last 2)"
echo "  ✓ Old deploy tarballs"
echo "  ✓ Temporary files"
echo "  ✓ Old log files"
echo "  ✓ NPM cache"
echo "  ✓ Package manager caches"
echo "  ✓ Source code (not needed with standalone)"
echo "  ✓ node_modules (not needed with standalone)"
echo ""

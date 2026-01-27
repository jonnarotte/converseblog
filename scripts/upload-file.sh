#!/bin/bash

# 📤 Reliable File Upload Script
# Handles large file uploads with retry logic and progress
# Usage: ./scripts/upload-file.sh <file> <remote-path>

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

FILE="${1:-deploy.tar.gz}"
REMOTE_PATH="${2:-/tmp/deploy.tar.gz}"

if [ ! -f "$FILE" ]; then
    echo -e "${RED}❌ File not found: $FILE${NC}"
    exit 1
fi

SSH_OPTS="-i $SSH_KEY -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no"
SCP_OPTS="$SSH_OPTS -C" # Compression enabled

FILE_SIZE=$(du -h "$FILE" | cut -f1)
echo -e "${BLUE}📤 Uploading $FILE ($FILE_SIZE) to $VM:$REMOTE_PATH${NC}"
echo ""

# Function to upload with rsync
upload_with_rsync() {
    echo -e "${YELLOW}Attempting upload with rsync (most reliable)...${NC}"
    rsync -avz --progress --timeout=300 --partial --inplace \
        -e "ssh $SSH_OPTS" \
        "$FILE" "$VM:$REMOTE_PATH"
    return $?
}

# Function to upload with SCP
upload_with_scp() {
    echo -e "${YELLOW}Attempting upload with SCP...${NC}"
    scp $SCP_OPTS "$FILE" "$VM:$REMOTE_PATH"
    return $?
}

# Try rsync first (best for large files)
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if command -v rsync &> /dev/null; then
        if upload_with_rsync; then
            echo -e "${GREEN}✓ Upload successful with rsync${NC}"
            exit 0
        fi
    fi
    
    # Fallback to SCP
    if upload_with_scp; then
        echo -e "${GREEN}✓ Upload successful with SCP${NC}"
        exit 0
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo -e "${YELLOW}⚠️  Upload failed, retrying ($RETRY_COUNT/$MAX_RETRIES)...${NC}"
        sleep 2
    fi
done

echo -e "${RED}❌ Upload failed after $MAX_RETRIES attempts${NC}"
echo ""
echo -e "${YELLOW}💡 Troubleshooting:${NC}"
echo "  1. Check internet connection"
echo "  2. Verify VM is accessible: ssh -i $SSH_KEY $VM"
echo "  3. Check disk space on VM: ssh -i $SSH_KEY $VM 'df -h'"
echo "  4. Try manual upload: scp -i $SSH_KEY $FILE $VM:$REMOTE_PATH"
exit 1

#!/bin/bash
# Force upload using rsync (more reliable for large files)
# Usage: ./scripts/force-upload.sh

set -e

# Load config
if [ -f ".deploy-config" ]; then
    source ".deploy-config"
    SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"
    SSH_KEY="${SSH_KEY/#\~/$HOME}"
else
    echo "❌ .deploy-config not found"
    exit 1
fi

VM="$VM_USER@$VM_IP"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o ConnectTimeout=30"
TARBALL="deploy.tar.gz"

if [ ! -f "$TARBALL" ]; then
    echo "❌ $TARBALL not found"
    exit 1
fi

echo "📤 Force uploading with rsync..."
echo "  File: $TARBALL ($(du -h "$TARBALL" | cut -f1))"
echo "  Target: $VM:/tmp/deploy.tar.gz"
echo ""

# Remove corrupted file on VM first
ssh $SSH_OPTS "$VM" "rm -f /tmp/deploy.tar.gz" 2>/dev/null || true

# Upload with rsync (resumable, more reliable)
if command -v rsync &> /dev/null; then
    echo "Using rsync (recommended)..."
    rsync -avz --progress --partial --inplace -e "ssh $SSH_OPTS" "$TARBALL" "$VM:/tmp/deploy.tar.gz"
    echo ""
    echo "✅ Upload complete!"
    echo ""
    echo "Now extract on VM:"
    echo "  cd /var/www/converseblog"
    echo "  bash scripts/stage2-transfer.sh  # (it will skip upload and extract)"
    echo "  OR manually extract and run stage3-deploy.sh"
else
    echo "❌ rsync not found. Install it:"
    echo "  macOS: brew install rsync"
    echo "  Linux: sudo apt-get install rsync"
    exit 1
fi

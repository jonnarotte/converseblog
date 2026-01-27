#!/bin/bash
# Fix SSH connection issues on VM
# Run this ON THE VM

set -e

echo "🔧 Fixing SSH Configuration..."

# Backup SSH config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Add keepalive settings
if ! grep -q "ClientAliveInterval" /etc/ssh/sshd_config; then
    echo "" | sudo tee -a /etc/ssh/sshd_config
    echo "# Keepalive settings" | sudo tee -a /etc/ssh/sshd_config
    echo "ClientAliveInterval 60" | sudo tee -a /etc/ssh/sshd_config
    echo "ClientAliveCountMax 3" | sudo tee -a /etc/ssh/sshd_config
    echo "TCPKeepAlive yes" | sudo tee -a /etc/ssh/sshd_config
    echo "✓ Added keepalive settings"
else
    echo "✓ Keepalive settings already exist"
fi

# Restart SSH
sudo systemctl restart sshd
echo "✓ SSH restarted"

echo ""
echo "✅ SSH configuration updated"
echo "Try uploading again from local machine"

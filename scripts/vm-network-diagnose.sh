#!/bin/bash
# Run this ON THE VM to diagnose network/SSH issues
# Usage: bash vm-network-diagnose.sh

echo "🔍 VM Network Diagnostics"
echo ""

# 1. Check SSH server config
echo "1. SSH Server Configuration:"
sudo grep -E "^(ClientAliveInterval|ClientAliveCountMax|TCPKeepAlive|MaxStartups|MaxSessions)" /etc/ssh/sshd_config || echo "Using defaults"
echo ""

# 2. Check SSH server status
echo "2. SSH Server Status:"
sudo systemctl status sshd --no-pager | head -10
echo ""

# 3. Check firewall
echo "3. Firewall Status:"
if command -v ufw &> /dev/null; then
    sudo ufw status verbose
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-all
else
    echo "No firewall detected (or using iptables)"
    sudo iptables -L -n | head -20
fi
echo ""

# 4. Check network interfaces
echo "4. Network Interfaces:"
ip addr show | grep -E "^[0-9]+:|inet " | head -10
echo ""

# 5. Check network connections
echo "5. Active SSH Connections:"
sudo netstat -tn | grep :22 | head -10
echo ""

# 6. Check system resources
echo "6. System Resources:"
echo "Memory:"
free -h
echo ""
echo "Disk:"
df -h /tmp /var/www
echo ""
echo "Load:"
uptime
echo ""

# 7. Check SSH logs
echo "7. Recent SSH Logs (last 20 lines):"
sudo tail -20 /var/log/auth.log 2>/dev/null || sudo journalctl -u ssh -n 20 --no-pager
echo ""

# 8. Check for connection limits
echo "8. Connection Limits:"
ulimit -n
echo "Max file descriptors: $(ulimit -n)"
echo ""

# 9. Check network buffer sizes
echo "9. Network Buffer Sizes:"
sysctl net.core.rmem_max net.core.wmem_max net.ipv4.tcp_rmem net.ipv4.tcp_wmem 2>/dev/null || echo "Cannot read network settings"
echo ""

echo "✅ Diagnostics complete"
echo ""
echo "Common fixes:"
echo "1. Increase SSH timeout: sudo nano /etc/ssh/sshd_config"
echo "   Add: ClientAliveInterval 60"
echo "   Add: ClientAliveCountMax 3"
echo "   Then: sudo systemctl restart sshd"
echo ""
echo "2. Check firewall: sudo ufw allow 22/tcp"
echo ""
echo "3. Check disk space: df -h"
echo ""
echo "4. Check memory: free -h"

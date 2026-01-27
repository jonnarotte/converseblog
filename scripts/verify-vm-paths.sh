#!/bin/bash
# Run this ON THE VM to verify paths
# Usage: bash verify-vm-paths.sh

echo "🔍 Verifying VM Paths"
echo ""

echo "1. Where stage2 extracts to:"
echo "   Should be: /var/www/converseblog/standalone"
echo "   Actual:"
ls -la /var/www/converseblog/standalone 2>/dev/null | head -5 || echo "   ❌ NOT FOUND"
echo ""

echo "2. Where stage3-deploy.sh looks:"
echo "   Checking script:"
grep "STANDALONE_DIR=" /var/www/converseblog/scripts/stage3-deploy.sh 2>/dev/null | head -1 || echo "   ❌ Script not found"
echo ""

echo "3. What's actually in /var/www/converseblog:"
ls -la /var/www/converseblog/ | grep -E "(standalone|scripts)"
echo ""

echo "4. Check if standalone exists:"
if [ -d "/var/www/converseblog/standalone" ]; then
    echo "   ✓ /var/www/converseblog/standalone exists"
    echo "   Contents:"
    ls -la /var/www/converseblog/standalone/ | head -10
    echo ""
    echo "   Build timestamp:"
    stat /var/www/converseblog/standalone/server.js 2>/dev/null | grep Modify || echo "   ❌ server.js not found"
else
    echo "   ❌ /var/www/converseblog/standalone NOT FOUND"
fi
echo ""

echo "5. Check if there's a nested standalone:"
if [ -d "/var/www/converseblog/standalone/standalone" ]; then
    echo "   ⚠️  Found nested standalone/standalone!"
    ls -la /var/www/converseblog/standalone/standalone/ | head -5
else
    echo "   ✓ No nested standalone"
fi
echo ""

echo "6. Check /tmp for leftover tarball:"
ls -lh /tmp/deploy.tar.gz 2>/dev/null || echo "   No tarball in /tmp"
echo ""

echo "7. Check what stage3-deploy.sh actually uses:"
cd /var/www/converseblog
if [ -f "scripts/stage3-deploy.sh" ]; then
    echo "   Script path check:"
    grep -A 2 "STANDALONE_DIR=" scripts/stage3-deploy.sh | head -3
    echo ""
    echo "   VM_APP_DIR check:"
    grep "VM_APP_DIR=" scripts/stage3-deploy.sh | head -3
else
    echo "   ❌ stage3-deploy.sh not found"
fi

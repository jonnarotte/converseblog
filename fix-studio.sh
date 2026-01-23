#!/bin/bash

# Fix Studio static assets issue
# Run this on your VM after deployment

APP_DIR="/var/www/converseblog"
cd $APP_DIR

echo "🔧 Fixing Studio static assets..."

# Ensure static files are in the right place
if [ -d ".next/static" ]; then
    echo "Copying static files to standalone directory..."
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/static
    echo "✓ Static files copied"
fi

# Ensure public files are copied
if [ -d "public" ]; then
    echo "Copying public files..."
    cp -r public .next/standalone/public
    echo "✓ Public files copied"
fi

# Restart the service
echo "Restarting service..."
sudo systemctl restart converseblog
sudo systemctl status converseblog --no-pager

echo "✅ Done! Studio should work now."

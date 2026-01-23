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

# Copy server files needed for dynamic routes like Studio
if [ -d ".next/server" ]; then
    echo "Copying server files..."
    mkdir -p .next/standalone/.next/server
    cp -r .next/server/app .next/standalone/.next/server/app 2>/dev/null || true
    echo "✓ Server files copied"
fi

# Ensure public files are copied
if [ -d "public" ]; then
    echo "Copying public files..."
    cp -r public .next/standalone/public
    echo "✓ Public files copied"
fi

# Update systemd service to use correct working directory
echo "Updating systemd service..."
sudo tee /etc/systemd/system/converseblog.service > /dev/null << EOF
[Unit]
Description=Converze Blog Next.js App
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$APP_DIR/.next/standalone
Environment=NODE_ENV=production
EnvironmentFile=$APP_DIR/.env.local
ExecStart=/usr/bin/node server.js
Environment=NEXT_PUBLIC_SANITY_PROJECT_ID=\${NEXT_PUBLIC_SANITY_PROJECT_ID}
Environment=NEXT_PUBLIC_SANITY_DATASET=\${NEXT_PUBLIC_SANITY_DATASET}
Environment=NEXT_PUBLIC_SITE_URL=\${NEXT_PUBLIC_SITE_URL}
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

# Restart the service
echo "Restarting service..."
sudo systemctl restart converseblog
sudo systemctl status converseblog --no-pager

echo "✅ Done! Studio should work now."

#!/bin/bash

# 🚀 STAGE 3: VM DEPLOYMENT
# Sets up and runs the application on VM (NO SOURCE CODE)
# Run this script ON THE VM after transfer
# Usage: ./scripts/stage3-deploy.sh

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load configuration
# Try from current directory first, then from parent
if [ -f ".deploy-config" ]; then
    source ".deploy-config"
elif [ -f "../.deploy-config" ]; then
    source "../.deploy-config"
fi

# Force correct paths (don't trust config if it's wrong)
# Always use /var/www/converseblog regardless of config
VM_APP_DIR="/var/www/converseblog"

SERVICE_NAME="${SERVICE_NAME:-converseblog}"
PORT="${PORT:-3000}"
DOMAIN="${DOMAIN:-_}"

# Use domain if provided, otherwise use _
SERVER_NAME="${DOMAIN:-_}"

# Standalone build is at VM_APP_DIR/standalone
STANDALONE_DIR="/var/www/converseblog/standalone"

echo -e "${BLUE}🚀 STAGE 3: VM Deployment${NC}"
echo ""

# Pre-flight checks
echo -e "${BLUE}🔍 Pre-flight checks...${NC}"

if [ ! -d "$STANDALONE_DIR" ]; then
    echo -e "${RED}❌ Standalone directory not found: $STANDALONE_DIR${NC}"
    echo -e "${YELLOW}Make sure Stage 2 (transfer) completed successfully${NC}"
    exit 1
fi

if [ ! -f "$STANDALONE_DIR/server.js" ]; then
    echo -e "${RED}❌ server.js not found in $STANDALONE_DIR${NC}"
    exit 1
fi

if [ ! -f "$STANDALONE_DIR/.env.local" ]; then
    echo -e "${RED}❌ .env.local not found in $STANDALONE_DIR${NC}"
    exit 1
fi

# Verify chunks exist
if [ ! -d "$STANDALONE_DIR/.next/static/chunks" ]; then
    echo -e "${RED}❌ Chunks directory not found: $STANDALONE_DIR/.next/static/chunks${NC}"
    echo -e "${YELLOW}This is critical for the app to work. Rebuild and redeploy.${NC}"
    exit 1
fi

CHUNK_COUNT=$(find "$STANDALONE_DIR/.next/static/chunks" -name "*.js" 2>/dev/null | wc -l | tr -d ' ')
if [ "$CHUNK_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ No JavaScript chunks found!${NC}"
    echo -e "${YELLOW}This is critical for the app to work. Rebuild and redeploy.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found $CHUNK_COUNT JavaScript chunks${NC}"

echo -e "${GREEN}✓ Pre-flight checks passed${NC}"
echo ""

# Step 1: Install Node.js (if needed)
echo -e "${BLUE}📦 Step 1: Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
echo ""

# Step 2: Create systemd service
echo -e "${BLUE}⚙️  Step 2: Creating systemd service...${NC}"
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=Converze Blog Next.js App
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$STANDALONE_DIR
Environment=NODE_ENV=production
EnvironmentFile=$STANDALONE_DIR/.env.local
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✓ Service file created${NC}"
echo ""

# Step 3: Configure Nginx (if not already configured)
echo -e "${BLUE}🌐 Step 3: Configuring Nginx...${NC}"
if [ ! -f "/etc/nginx/sites-available/$SERVICE_NAME" ]; then
    sudo tee /etc/nginx/sites-available/$SERVICE_NAME > /dev/null << EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    client_max_body_size 10M;

    location /_next/static {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/$SERVICE_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
    
    if sudo nginx -t; then
        echo -e "${GREEN}✓ Nginx configured${NC}"
    else
        echo -e "${RED}❌ Nginx configuration error${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Nginx already configured${NC}"
fi
echo ""

# Step 4: Start services
echo -e "${BLUE}🔄 Step 4: Starting services...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl restart $SERVICE_NAME
sudo systemctl restart nginx

echo -e "${GREEN}✓ Services started${NC}"
echo ""

# Step 5: Health check
echo -e "${BLUE}🏥 Step 5: Health check...${NC}"
sleep 3

if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}✓ Service is running${NC}"
else
    echo -e "${RED}❌ Service failed to start${NC}"
    echo -e "${YELLOW}Check logs: sudo journalctl -u $SERVICE_NAME -n 50${NC}"
    exit 1
fi

# Test HTTP
for i in {1..10}; do
    if curl -f -s http://localhost:$PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Application is responding${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${YELLOW}⚠️  Application not responding (might still be starting)${NC}"
    fi
    sleep 1
done

echo ""

# Summary
echo -e "${GREEN}✅ STAGE 3 COMPLETE!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "  • Service: $SERVICE_NAME"
echo "  • Status: $(sudo systemctl is-active $SERVICE_NAME && echo 'Active' || echo 'Inactive')"
echo "  • Port: $PORT"
echo "  • App Directory: $STANDALONE_DIR"
echo ""
echo -e "${YELLOW}📋 Useful Commands:${NC}"
echo "  • View logs: sudo journalctl -u $SERVICE_NAME -f"
echo "  • Check status: sudo systemctl status $SERVICE_NAME"
echo "  • Restart: sudo systemctl restart $SERVICE_NAME"
echo "  • Stop: sudo systemctl stop $SERVICE_NAME"
echo ""
if [ "$SERVER_NAME" != "_" ]; then
    echo -e "${GREEN}🌐 Your site is available at:${NC}"
    echo "  • http://$SERVER_NAME"
    echo "  • http://$SERVER_NAME/studio"
    echo ""
    echo -e "${YELLOW}💡 To enable HTTPS, run:${NC}"
    echo "  sudo certbot --nginx -d $SERVER_NAME"
    echo ""
fi

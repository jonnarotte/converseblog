#!/bin/bash

# Converze Blog Deployment Script for Google Cloud VM
# Run this script on your GCloud VM instance

set -e

echo "🚀 Starting Converze Blog Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please don't run as root. Use a regular user.${NC}"
   exit 1
fi

# Configuration
APP_DIR="/var/www/converseblog"
SERVICE_NAME="converseblog"
DOMAIN="${1:-}"  # Optional domain name as first argument

echo -e "${YELLOW}📦 Step 1: Installing Node.js (if not installed)...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"

echo -e "${YELLOW}📦 Step 2: Installing Nginx (if not installed)...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y nginx
fi

echo -e "${GREEN}✓ Nginx installed${NC}"

echo -e "${YELLOW}📁 Step 3: Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

if [ ! -f "$APP_DIR/package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in $APP_DIR${NC}"
    echo -e "${YELLOW}Please upload your project files to $APP_DIR first${NC}"
    exit 1
fi

cd $APP_DIR

echo -e "${YELLOW}📦 Step 4: Installing dependencies (including dev dependencies for build)...${NC}"
npm install

echo -e "${YELLOW}🔧 Step 5: Checking environment variables...${NC}"
if [ ! -f "$APP_DIR/.env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating template...${NC}"
    cat > .env.local << EOF
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NODE_ENV=production
EOF
    echo -e "${RED}⚠️  Please edit .env.local with your Sanity project ID!${NC}"
    echo -e "${YELLOW}Press Enter to continue after editing, or Ctrl+C to cancel...${NC}"
    read
fi

echo -e "${YELLOW}🏗️  Step 6: Building the application...${NC}"
npm run build

if [ ! -d "$APP_DIR/.next/standalone" ]; then
    echo -e "${RED}❌ Build failed or standalone output not found${NC}"
    exit 1
fi

# Copy static files to standalone directory (required for Studio and static assets)
echo -e "${YELLOW}📦 Copying static files...${NC}"
if [ -d "$APP_DIR/.next/static" ]; then
    mkdir -p "$APP_DIR/.next/standalone/.next"
    # Remove existing static directory to avoid conflicts
    rm -rf "$APP_DIR/.next/standalone/.next/static" 2>/dev/null || true
    cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"
    echo -e "${GREEN}✓ Static files copied (including chunks)${NC}"
    # Verify chunks were copied
    if [ -d "$APP_DIR/.next/standalone/.next/static/chunks" ]; then
        CHUNK_COUNT=$(find "$APP_DIR/.next/standalone/.next/static/chunks" -name "*.js" 2>/dev/null | wc -l)
        echo -e "${GREEN}✓ Copied $CHUNK_COUNT JavaScript chunks${NC}"
    fi
fi
# Copy server files needed for dynamic routes like Studio
if [ -d "$APP_DIR/.next/server" ]; then
    mkdir -p "$APP_DIR/.next/standalone/.next/server"
    cp -r "$APP_DIR/.next/server/app" "$APP_DIR/.next/standalone/.next/server/app" 2>/dev/null || true
    echo -e "${GREEN}✓ Server files copied${NC}"
fi
if [ -d "$APP_DIR/public" ]; then
    cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/public"
    echo -e "${GREEN}✓ Public files copied${NC}"
fi

echo -e "${GREEN}✓ Build successful${NC}"

echo -e "${YELLOW}⚙️  Step 7: Creating systemd service...${NC}"
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=Converze Blog Next.js App
After=network.target

[Service]
Type=simple
User=$USER
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

echo -e "${GREEN}✓ Service file created${NC}"

echo -e "${YELLOW}🌐 Step 8: Configuring Nginx...${NC}"
SERVER_NAME="${DOMAIN:-_}"
sudo tee /etc/nginx/sites-available/$SERVICE_NAME > /dev/null << EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    # Increase body size for file uploads (Sanity Studio)
    client_max_body_size 10M;

    # Serve Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Serve public files
    location /favicon.ico {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }

    location /manifest.json {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }

    # Main application (including Studio)
    location / {
        proxy_pass http://localhost:3000;
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

# Enable site
sudo ln -sf /etc/nginx/sites-available/$SERVICE_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test Nginx config
if sudo nginx -t; then
    echo -e "${GREEN}✓ Nginx configuration valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Step 9: Starting services...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl restart $SERVICE_NAME
sudo systemctl restart nginx

echo -e "${GREEN}✓ Services started${NC}"

# Check service status
sleep 2
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}✓ Application is running${NC}"
else
    echo -e "${RED}❌ Application failed to start. Check logs:${NC}"
    echo -e "${YELLOW}sudo journalctl -u $SERVICE_NAME -n 50${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Check service status: sudo systemctl status $SERVICE_NAME"
echo "2. View logs: sudo journalctl -u $SERVICE_NAME -f"
echo "3. Test your site: curl http://localhost:3000"
if [ -n "$DOMAIN" ]; then
    echo "4. Set up SSL: sudo certbot --nginx -d $DOMAIN"
else
    echo "4. Access your site at: http://$(curl -s ifconfig.me)"
    echo "   Or set up a domain and run: sudo certbot --nginx -d your-domain.com"
fi
echo ""
echo -e "${YELLOW}🔄 To update the app:${NC}"
echo "  cd $APP_DIR"
echo "  git pull  # or upload new files"
echo "  npm install --production"
echo "  npm run build"
echo "  sudo systemctl restart $SERVICE_NAME"
echo ""

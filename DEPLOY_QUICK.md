# Quick Deployment Guide - Google Cloud VM

## Prerequisites
- Google Cloud VM instance running Ubuntu/Debian
- SSH access to your VM
- Your Sanity Project ID

## Quick Start (5 minutes)

### 1. Upload Your Project to VM

**Option A: Using Git (Recommended)**
```bash
# On your VM
cd /var/www
sudo mkdir -p converseblog
sudo chown -R $USER:$USER converseblog
cd converseblog
git clone <your-repo-url> .
```

**Option B: Using SCP (from your local machine)**
```bash
# From your local machine
scp -r . user@your-vm-ip:/var/www/converseblog/
```

### 2. Run Deployment Script

```bash
# On your VM
cd /var/www/converseblog
chmod +x deploy.sh
./deploy.sh your-domain.com  # or ./deploy.sh for IP-only
```

The script will:
- ✅ Install Node.js and Nginx (if needed)
- ✅ Install dependencies
- ✅ Build the application
- ✅ Set up systemd service
- ✅ Configure Nginx
- ✅ Start everything

### 3. Configure Environment Variables

Edit `.env.local`:
```bash
nano .env.local
```

Add:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NODE_ENV=production
```

Then restart:
```bash
sudo systemctl restart converseblog
```

### 4. Set Up SSL (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Manual Deployment (If Script Doesn't Work)

### 1. Install Dependencies
```bash
cd /var/www/converseblog
npm install --production
```

### 2. Set Environment Variables
```bash
nano .env.local
# Add your Sanity project ID
```

### 3. Build
```bash
npm run build
```

### 4. Create Systemd Service
```bash
sudo nano /etc/systemd/system/converseblog.service
```

Paste:
```ini
[Unit]
Description=Converze Blog Next.js App
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/var/www/converseblog
Environment=NODE_ENV=production
EnvironmentFile=/var/www/converseblog/.env.local
ExecStart=/usr/bin/node /var/www/converseblog/.next/standalone/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 5. Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable converseblog
sudo systemctl start converseblog
```

### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/converseblog
```

Paste:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your VM IP

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/converseblog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Updating Your Site

```bash
cd /var/www/converseblog
git pull  # or upload new files
npm install --production
npm run build
sudo systemctl restart converseblog
```

## Troubleshooting

### Check if app is running:
```bash
sudo systemctl status converseblog
curl http://localhost:3000
```

### View logs:
```bash
sudo journalctl -u converseblog -f
```

### Check Nginx:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Common Issues:

1. **Port 3000 in use**: Change port in systemd service
2. **Build fails**: Check Node.js version (needs 18+)
3. **502 Bad Gateway**: App not running, check logs
4. **Sanity errors**: Verify `.env.local` has correct project ID

## Security Checklist

- [ ] Firewall configured (ports 80, 443 only)
- [ ] SSL certificate installed
- [ ] Environment variables set correctly
- [ ] Regular updates scheduled
- [ ] Backups configured

## Access Your Site

- **Main site**: `http://your-vm-ip` or `https://your-domain.com`
- **Sanity Studio**: `http://your-vm-ip/studio` or `https://your-domain.com/studio`

Your blog is now live! 🎉

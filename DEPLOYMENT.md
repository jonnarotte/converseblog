# Deployment Guide for Converze Blog

This guide covers deploying your Next.js blog with Sanity CMS to a Google Cloud VM.

## Overview

Your Next.js app is a **hybrid application** (not a pure SPA):
- It uses **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)**
- It fetches data from Sanity CMS at build time and runtime
- It cannot be deployed as a simple static SPA

## Deployment Options

### Option 1: Node.js Binary Deployment (Recommended - Simple & Efficient)

This is the **easiest and most efficient** approach for your use case.

#### Prerequisites
- Google Cloud VM with Node.js 18+ installed
- Nginx (or another reverse proxy)
- Domain name (optional, can use IP)

#### Steps

1. **Build the application on your VM:**
   ```bash
   # SSH into your VM
   ssh your-vm-ip

   # Clone or upload your project
   cd /var/www/converseblog
   git clone <your-repo> .  # or upload files

   # Install dependencies
   npm install --production

   # Set environment variables
   nano .env.local
   ```
   
   Add these variables:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Create a systemd service for auto-restart:**
   ```bash
   sudo nano /etc/systemd/system/converseblog.service
   ```
   
   Add this configuration:
   ```ini
   [Unit]
   Description=Converze Blog Next.js App
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/converseblog
   Environment=NODE_ENV=production
   EnvironmentFile=/var/www/converseblog/.env.local
   ExecStart=/usr/bin/node node_modules/.bin/next start
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

4. **Start the service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable converseblog
   sudo systemctl start converseblog
   sudo systemctl status converseblog
   ```

5. **Configure Nginx as reverse proxy:**
   ```bash
   sudo nano /etc/nginx/sites-available/converseblog
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # or your VM IP

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

6. **Enable the site and restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/converseblog /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set up SSL (Optional but recommended):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

#### Updating the Application

```bash
cd /var/www/converseblog
git pull  # or upload new files
npm install --production
npm run build
sudo systemctl restart converseblog
```

---

### Option 2: Docker Deployment (Alternative)

If you prefer containerization:

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Update next.config.js for standalone output:**
   ```js
   const nextConfig = {
     output: 'standalone',
     // ... rest of config
   }
   ```

3. **Build and run:**
   ```bash
   docker build -t converseblog .
   docker run -d -p 3000:3000 --env-file .env.local converseblog
   ```

---

### Option 3: Static Export (NOT Recommended for Your Use Case)

**Why this won't work well:**
- Your blog fetches data from Sanity at runtime
- Static export would require rebuilding every time content changes
- You'd lose dynamic features

**If you still want static export:**
1. Set `output: 'export'` in next.config.js
2. Run `npm run build` (creates `out` folder)
3. Serve `out` folder with Nginx
4. **Problem:** You'd need to rebuild and redeploy every time you add a blog post

---

## Why Binary Deployment is Best

✅ **Simple:** Just Node.js + systemd + Nginx  
✅ **Efficient:** No container overhead  
✅ **Dynamic:** Fetches fresh content from Sanity  
✅ **Auto-restart:** systemd handles crashes  
✅ **Easy updates:** Just rebuild and restart  
✅ **Lightweight:** Minimal resource usage  

## Environment Variables

Create `.env.local` on your VM:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

**Important:** These are public variables (NEXT_PUBLIC_ prefix), so they're safe in client-side code.

## Sanity Studio Access

Your Sanity Studio is available at `/studio` route. Make sure it's accessible:
- It will work automatically with your Next.js app
- Access it at: `https://your-domain.com/studio`

## Monitoring

Check logs:
```bash
sudo journalctl -u converseblog -f
```

Check if service is running:
```bash
sudo systemctl status converseblog
```

## Troubleshooting

1. **Port 3000 already in use:**
   - Change port in systemd service: `ExecStart=/usr/bin/node node_modules/.bin/next start -p 3001`
   - Update Nginx proxy_pass accordingly

2. **Build fails:**
   - Check Node.js version: `node --version` (needs 18+)
   - Check environment variables are set

3. **Sanity connection issues:**
   - Verify project ID and dataset in `.env.local`
   - Check Sanity project settings allow public read access

4. **Nginx 502 Bad Gateway:**
   - Check if Next.js app is running: `curl http://localhost:3000`
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Security Checklist

- [ ] Firewall configured (only ports 80, 443 open)
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Regular updates scheduled
- [ ] Backups configured

## Cost Estimation

- **VM:** ~$5-10/month (small instance)
- **Sanity:** Free tier (up to 3 users, 10K documents)
- **Domain:** ~$10-15/year (optional)
- **Total:** ~$5-10/month

---

## Quick Start Commands

```bash
# On your VM
cd /var/www/converseblog
npm install --production
npm run build
sudo systemctl start converseblog
sudo systemctl status converseblog
```

Your blog will be live at your VM's IP or domain!

# Deployment Guide

3-stage deployment system for GCloud VM. **No source code on VM** - only build artifacts.

## Overview

**3 Stages:**
1. **Local Build** - Build on your machine
2. **Transfer** - Upload build to VM (no source code)
3. **VM Deploy** - Run application on VM

**Benefits:**
- ✅ Fast deployments (~100MB vs 500MB+)
- ✅ Secure (no source code on VM)
- ✅ Reliable (automatic backups & rollback)
- ✅ Simple (one command)

## Quick Start

### One-Time Setup

Your deployment is already configured! Check `.deploy-config`:

```bash
VM_USER="rakshithgoudbrg"
VM_IP="34.173.15.101"
VM_APP_DIR="/var/www/converseblog"
SERVICE_NAME="converseblog"
PORT="3000"
SSH_KEY="~/.ssh/google_compute_engine"
DOMAIN="converze.org"
```

### Deploy

**One Command:**
```bash
./scripts/deploy-all.sh
```

**Or Step by Step:**
```bash
# Stage 1: Build locally
./scripts/stage1-build.sh

# Stage 2: Transfer to VM
./scripts/stage2-transfer.sh

# Stage 3: Deploy on VM (runs automatically)
```

## What Each Stage Does

### Stage 1: Local Build
- Installs dependencies
- Builds with `npx next build`
- Verifies chunks (fixes Studio issues)
- Creates `deploy.tar.gz` (~100MB)

### Stage 2: Transfer
- Tests SSH connection
- Creates backup on VM
- Uploads tarball
- Extracts on VM
- Verifies files

### Stage 3: VM Deploy
- Installs Node.js (if needed)
- Creates systemd service
- Configures Nginx for converze.org
- Starts application
- Health checks

## What's on VM?

**ONLY:**
- `.next/standalone/` directory (~100MB)
- `.env.local` file
- Deployment scripts

**NOT:**
- ❌ Source code
- ❌ node_modules (only production deps)
- ❌ Git repository
- ❌ Development files

## Requirements

### Local Machine
- Node.js 18+
- SSH access to VM
- `.env.local` configured

### VM
- Node.js 18+ (installed automatically)
- Nginx (installed automatically)
- SSH access

## Management Commands

```bash
# Check status
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101 \
  'sudo systemctl status converseblog'

# View logs
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101 \
  'sudo journalctl -u converseblog -f'

# Restart
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101 \
  'sudo systemctl restart converseblog'
```

## Troubleshooting

### SSH Connection Failed
```bash
# Test connection
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101 "echo 'OK'"

# Check key permissions
chmod 600 ~/.ssh/google_compute_engine
```

### Build Fails
- Check `.env.local` exists
- Verify Node.js: `node --version` (needs 18+)
- Check disk space

### Studio Not Loading (Missing Chunks)
The deployment scripts automatically copy all chunks. If issues persist:

```bash
# On VM, verify chunks exist
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101 \
  'ls -la /var/www/converseblog/standalone/.next/static/chunks/*.js | wc -l'
```

### Service Won't Start
```bash
# Check logs
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101 \
  'sudo journalctl -u converseblog -n 50'
```

## After Deployment

Your site will be available at:
- **HTTP:** http://converze.org
- **Studio:** http://converze.org/studio

## Security Features

- ✅ Automatic backups before deployment
- ✅ Health checks before/after
- ✅ Automatic rollback on failure
- ✅ Chunk verification
- ✅ No source code on VM

## Scripts Reference

- `scripts/stage1-build.sh` - Local build
- `scripts/stage2-transfer.sh` - Transfer to VM
- `scripts/stage3-deploy.sh` - Deploy on VM
- `scripts/deploy-all.sh` - Run all stages
- `scripts/verify-deployment.sh` - Verify configuration
- `scripts/vm-cleanup.sh` - Cleanup script (runs on VM)
- `scripts/run-vm-cleanup.sh` - Run cleanup remotely

## VM Cleanup & Optimization

To clean up unnecessary files and optimize your VM:

```bash
./scripts/run-vm-cleanup.sh
```

This will:
- Remove old backups (keeps last 2)
- Clean old deploy tarballs
- Remove temporary files
- Clean npm and system caches
- Remove old log files (keeps last 7 days)
- Remove source code (not needed with standalone builds)
- Optimize disk and memory usage

**Note:** Some operations require sudo. You'll be prompted for your password.

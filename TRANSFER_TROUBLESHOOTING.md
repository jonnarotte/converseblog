# Transfer Troubleshooting Guide

## Problem

File uploads keep stalling, even with chunked upload. This indicates a serious network or VM issue.

## Quick Diagnosis

Run diagnostics first:
```bash
./scripts/diagnose-connection.sh
```

This will check:
- Internet connectivity
- SSH connection
- VM resources (disk, memory)
- Network speed
- Transfer issues

## Solutions

### Option 1: Build Directly on VM (RECOMMENDED)

**Best solution if transfers keep failing:**

```bash
./scripts/vm-build-deploy.sh
```

**What it does:**
- Clones your git repo directly on VM
- Builds the app on VM (no large file transfer)
- Only transfers small `.env.local` file
- Deploys automatically

**Requirements:**
- Git repository must be accessible from VM
- VM needs Node.js and git installed (script installs automatically)

**Advantages:**
- ✅ No large file transfers
- ✅ Only ~1KB transfer (.env.local)
- ✅ Works on any connection speed
- ✅ Faster overall (builds on VM's faster connection)

### Option 2: Check VM Resources

The VM might be out of resources:

```bash
ssh -i ~/.ssh/google_compute_engine \
  rakshithgoudbrg@34.173.15.101 \
  "df -h && free -h && ps aux | head -10"
```

**Check:**
- Disk space in `/tmp` (needs > 25MB free)
- Memory available
- CPU load

### Option 3: Use Different Network

If your local network is slow:
- Try from a different location/network
- Use a VPN if behind firewall
- Try during off-peak hours

### Option 4: Manual Git Clone on VM

SSH to VM and build there:

```bash
# SSH to VM
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101

# On VM:
cd /var/www/converseblog
git clone <your-repo-url> .
# Or if already cloned:
git pull

# Install and build
npm install --legacy-peer-deps
npx next build --webpack
node scripts/copy-static.js

# Deploy
bash scripts/stage3-deploy.sh
```

### Option 5: Use Cloud Storage

Upload to Google Cloud Storage, then download on VM:

```bash
# Upload to GCS (if you have gsutil)
gsutil cp deploy.tar.gz gs://your-bucket/

# On VM, download:
gsutil cp gs://your-bucket/deploy.tar.gz /tmp/
```

## Recommended Solution

**Use `vm-build-deploy.sh`** - it's the most reliable:

1. No large file transfers
2. Builds on VM (faster)
3. Only transfers .env.local (~1KB)
4. Works on any connection

## If Nothing Works

1. **Check VM is accessible:**
   ```bash
   ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101
   ```

2. **Check your internet:**
   ```bash
   ping 8.8.8.8
   speedtest-cli  # if installed
   ```

3. **Check VM firewall:**
   - Ensure port 22 (SSH) is open
   - Check GCP firewall rules

4. **Try from different network:**
   - Mobile hotspot
   - Different WiFi
   - Different location

## Next Steps

1. **Run diagnostics:**
   ```bash
   ./scripts/diagnose-connection.sh
   ```

2. **If diagnostics pass, use VM build:**
   ```bash
   ./scripts/vm-build-deploy.sh
   ```

3. **If diagnostics fail, check VM status in GCP console**

The VM build method is the most reliable solution for slow/unstable connections! 🚀

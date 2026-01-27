# Quick Fix for VM Deployment Issues

## Problem

Your VM has:
- ❌ Missing chunks (`.next/static/chunks` not found)
- ❌ Service stopped
- ❌ Server Action errors
- ❌ stage3-deploy.sh not found

## Root Cause

The deployment tarball structure was nested, but the extraction wasn't flattening it correctly. The chunks weren't being copied properly.

## Solution

I've fixed the deployment scripts. Here's what to do:

### Option 1: Quick Fix Script (Recommended)

Run this from your local machine:

```bash
./scripts/fix-vm-deployment.sh
```

This will:
1. Rebuild locally with proper chunks
2. Transfer to VM
3. Verify chunks are present
4. Restart the service

### Option 2: Manual Fix

#### Step 1: Rebuild and Deploy

```bash
# From your local machine
./scripts/stage1-build.sh
./scripts/stage2-transfer.sh
```

#### Step 2: Run Stage 3 on VM

After transfer completes, SSH into VM and run:

```bash
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101
cd /var/www/converseblog
./scripts/stage3-deploy.sh
```

#### Step 3: Verify

```bash
# Check chunks
ls -la /var/www/converseblog/standalone/.next/static/chunks/*.js | wc -l

# Check service
sudo systemctl status converseblog

# Check logs
sudo journalctl -u converseblog -n 20
```

## What Was Fixed

1. **stage2-transfer.sh**: Now properly flattens the tarball structure
   - Extracts standalone build directly to `/var/www/converseblog/standalone/`
   - Copies `.env.local` to the right location
   - Copies scripts to `/var/www/converseblog/scripts/`

2. **stage3-deploy.sh**: Updated paths to match flattened structure
   - Looks for standalone build directly in `/var/www/converseblog/standalone/`
   - Verifies chunks exist before starting service
   - Uses correct `.env.local` path

## Verification Checklist

After deployment, verify:

- [ ] Chunks exist: `ls /var/www/converseblog/standalone/.next/static/chunks/*.js | wc -l` shows > 0
- [ ] Service is running: `sudo systemctl status converseblog` shows "active (running)"
- [ ] No errors in logs: `sudo journalctl -u converseblog -n 20` shows no errors
- [ ] Site loads: Visit http://converze.org
- [ ] Studio works: Visit http://converze.org/studio

## If Issues Persist

1. **Check chunks manually**:
   ```bash
   ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101
   find /var/www/converseblog/standalone/.next/static/chunks -name "*.js" | wc -l
   ```

2. **Check service logs**:
   ```bash
   sudo journalctl -u converseblog -n 50 --no-pager
   ```

3. **Restart service**:
   ```bash
   sudo systemctl restart converseblog
   sudo systemctl status converseblog
   ```

4. **Rebuild from scratch**:
   ```bash
   # On local machine
   ./scripts/stage1-build.sh
   ./scripts/stage2-transfer.sh
   
   # On VM
   ./scripts/stage3-deploy.sh
   ```

## Notes

- The `stage3-deploy.sh` script should be in `/var/www/converseblog/scripts/` after stage2-transfer completes
- If it's not there, check that stage2-transfer completed successfully
- The service expects the standalone build at `/var/www/converseblog/standalone/` (not nested)

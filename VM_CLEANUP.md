# VM Cleanup & Optimization Guide

## Overview

The VM cleanup script removes unnecessary files, optimizes storage, and ensures your VM runs efficiently with only the required files.

## What Gets Cleaned

### ✅ Removed (Safe to Delete)

1. **Old Backups**
   - Keeps only the last 2 backups
   - Removes older backup files

2. **Old Deploy Tarballs**
   - Removes deploy.tar.gz files older than 7 days

3. **Old Standalone Builds**
   - Removes old standalone directories (keeps current)

4. **Temporary Files**
   - `/tmp` files older than 7 days
   - User temp files older than 7 days
   - Application log files older than 7 days

5. **Cache Files**
   - NPM cache
   - APT/YUM package manager caches
   - System caches (if run with sudo)

6. **Source Code** (if standalone exists)
   - Removes source files (not needed with standalone builds)
   - Removes node_modules (not needed with standalone)
   - Removes .next cache directories

7. **System Logs**
   - Keeps last 7 days of logs
   - Removes older journal entries

### ✅ Kept (Required Files)

1. **Current Application**
   - `/var/www/converseblog/standalone/` - Current running build
   - `/var/www/converseblog/.env.local` - Environment variables
   - `/var/www/converseblog/scripts/` - Deployment scripts
   - `/var/www/converseblog/.deploy-config` - Configuration

2. **Recent Backups**
   - Last 2 backup files

3. **System Files**
   - All system files and configurations
   - Current kernel
   - Essential packages

## Usage

### Option 1: Run Remotely (Recommended)

From your local machine:

```bash
./scripts/run-vm-cleanup.sh
```

This will:
1. Connect to your VM
2. Transfer the cleanup script
3. Run it with sudo (you'll be prompted for password)
4. Show before/after disk usage

### Option 2: Run Directly on VM

SSH into your VM and run:

```bash
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101

# Then on the VM:
sudo bash /path/to/vm-cleanup.sh
```

Or copy the script first:

```bash
# From local machine
scp -i ~/.ssh/google_compute_engine scripts/vm-cleanup.sh \
  rakshithgoudbrg@34.173.15.101:/tmp/

# Then on VM
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101
sudo bash /tmp/vm-cleanup.sh
```

## What You'll See

The script provides detailed output:

```
🧹 VM Cleanup & Optimization

📊 Step 1: Current Disk Usage
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   15G  4.0G  79% /

🗑️  Step 2: Removing old build artifacts...
✓ Removed old backups
✓ Removed old deploy tarballs

📦 Step 3: Cleaning npm cache...
✓ NPM cache cleaned

... (more steps)

📊 Step 10: Final Disk Usage
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   12G  7.0G  63% /

✅ Cleanup Complete!
```

## Safety Features

- ✅ **Non-destructive**: Only removes clearly unnecessary files
- ✅ **Backup retention**: Keeps recent backups
- ✅ **Log retention**: Keeps last 7 days of logs
- ✅ **Verification**: Shows before/after disk usage
- ✅ **Dry-run safe**: Can be reviewed before running

## When to Run

Run cleanup:
- ✅ After deployments (to remove old builds)
- ✅ When disk space is low
- ✅ Monthly maintenance
- ✅ Before major deployments

**Don't run:**
- ❌ During active deployments
- ❌ If you need to rollback to an old version
- ❌ If you're debugging issues (keep logs)

## Expected Results

After cleanup, you should see:
- 📉 **Disk usage reduced** by 20-40% (depending on build history)
- 📉 **Memory usage optimized** (caches cleared)
- ⚡ **Faster operations** (less disk I/O)
- 🎯 **Only essential files** remain

## Troubleshooting

### "Permission denied"
Run with sudo:
```bash
sudo ./scripts/vm-cleanup.sh
```

### "Cannot connect to VM"
Check:
- SSH key is correct: `~/.ssh/google_compute_engine`
- VM IP is correct: `34.173.15.101`
- Network connectivity

### "Service stopped after cleanup"
This shouldn't happen, but if it does:
1. Check service status: `sudo systemctl status converseblog`
2. Restart if needed: `sudo systemctl restart converseblog`
3. Check logs: `sudo journalctl -u converseblog -n 50`

## Manual Cleanup

If you prefer manual cleanup:

```bash
# SSH into VM
ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101

# Check disk usage
df -h

# Remove old backups (keep last 2)
cd /var/www/converseblog/backups
ls -1t | tail -n +3 | xargs rm -f

# Remove old logs
find /var/www/converseblog -name "*.log" -mtime +7 -delete

# Clean npm cache
npm cache clean --force

# Clean system logs (requires sudo)
sudo journalctl --vacuum-time=7d

# Clean package cache (requires sudo)
sudo apt-get clean
sudo apt-get autoremove -y
```

## Questions?

If you're unsure about running cleanup:
1. Check current disk usage first: `df -h`
2. Review what will be removed (script shows this)
3. Run during low-traffic periods
4. Keep backups of important data

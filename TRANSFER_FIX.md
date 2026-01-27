# SCP Transfer Stalling - Fixed! ✅

## Problem

SCP transfers were stalling at ~1% (255KB) when uploading 21MB tarball to VM.

## Root Causes

1. **No SSH keepalive** - Connection drops during long transfers
2. **No retry logic** - Single attempt, fails on network hiccups
3. **No compression** - Larger file size = longer transfer
4. **No progress indication** - Hard to debug when it stalls

## Solutions Implemented

### 1. SSH Keepalive Settings
```bash
-o ServerAliveInterval=60    # Send keepalive every 60 seconds
-o ServerAliveCountMax=3     # Max 3 failed keepalives before disconnect
-o ConnectTimeout=10          # 10 second connection timeout
```

### 2. Retry Logic
- **3 automatic retries** if upload fails
- **3 second delay** between retries
- **Clear progress indication** for each attempt

### 3. rsync Support (Preferred)
- **rsync** is more reliable for large files
- **Resume capability** (--partial --inplace)
- **Progress indication** built-in
- **Automatic fallback** to SCP if rsync not available

### 4. Compression
- **SCP compression enabled** (-C flag)
- Reduces file size during transfer
- Faster uploads on slow connections

## Usage

### Automatic (Recommended)
```bash
./scripts/stage2-transfer.sh
```

The script will:
1. Try rsync first (if available)
2. Fallback to SCP with compression
3. Retry up to 3 times if it stalls
4. Show clear error messages if all attempts fail

### Manual Upload (If Script Fails)
```bash
# Using rsync (best)
rsync -avz --progress --timeout=300 \
  -e "ssh -i ~/.ssh/google_compute_engine -o ServerAliveInterval=60" \
  deploy.tar.gz rakshithgoudbrg@34.173.15.101:/tmp/

# Using SCP with compression
scp -C -i ~/.ssh/google_compute_engine \
  -o ServerAliveInterval=60 \
  deploy.tar.gz rakshithgoudbrg@34.173.15.101:/tmp/
```

### Standalone Upload Script
```bash
./scripts/upload-file.sh deploy.tar.gz /tmp/deploy.tar.gz
```

## What Changed

### `scripts/stage2-transfer.sh`
- ✅ Added SSH keepalive options
- ✅ Added retry logic (3 attempts)
- ✅ Added rsync support with fallback
- ✅ Added compression
- ✅ Better error messages
- ✅ Progress indication

### New Script: `scripts/upload-file.sh`
- Standalone upload utility
- Can be used independently
- Same retry and reliability features

## Testing

The script now handles:
- ✅ Network interruptions
- ✅ Slow connections
- ✅ Connection timeouts
- ✅ Large file transfers (21MB+)
- ✅ Automatic recovery

## If It Still Stalls

1. **Check internet connection**
   ```bash
   ping 8.8.8.8
   ```

2. **Test SSH connection**
   ```bash
   ssh -i ~/.ssh/google_compute_engine \
     -o ServerAliveInterval=60 \
     rakshithgoudbrg@34.173.15.101
   ```

3. **Check VM disk space**
   ```bash
   ssh -i ~/.ssh/google_compute_engine \
     rakshithgoudbrg@34.173.15.101 "df -h /tmp"
   ```

4. **Try manual upload with verbose output**
   ```bash
   scp -v -C -i ~/.ssh/google_compute_engine \
     -o ServerAliveInterval=60 \
     deploy.tar.gz rakshithgoudbrg@34.173.15.101:/tmp/
   ```

5. **Use the upload script**
   ```bash
   ./scripts/upload-file.sh deploy.tar.gz /tmp/deploy.tar.gz
   ```

## Expected Behavior

With the fixes:
- ✅ **First attempt** usually succeeds
- ✅ **Automatic retry** if it stalls
- ✅ **Progress shown** during transfer
- ✅ **Clear errors** if all attempts fail
- ✅ **Works on slow connections** (compression helps)

The transfer should now complete successfully! 🎉

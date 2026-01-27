# CI/CD Pipeline Setup Guide

## Overview

GitHub Actions automatically builds and deploys your app when you push to `main` or `master` branch. No more manual uploads!

## How It Works

1. **Push to GitHub** → Triggers workflow
2. **GitHub Actions builds** → Creates tarball
3. **Uploads to VM** → Via SCP (more reliable from GitHub)
4. **Deploys automatically** → Extracts and starts service

## Setup

### 1. Add GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

#### Required:
```
VM_IP=34.173.15.101
VM_USER=rakshithgoudbrg
VM_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
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
BAUGBw==
-----END OPENSSH PRIVATE KEY-----
NEXT_PUBLIC_SANITY_PROJECT_ID=o23ktewy
SANITY_API_TOKEN=skctA2M3mYvgajKBsoaB7gKD8TMBsw8lxVH71hYJazn4DYIdfK2vYggL106rIpkl9zFjbqW6QxRrBtm0WwLYPTiau9K0f5fGGacJJo0JU745asRnKdarR5nOXwPCxcegYFMCBKMlUdyZrggcXToWa53JGKA94kSVkTPnE8n81k2LbU3bJnaL
```

#### Optional (but recommended):
```
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://converze.org
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@converze.org
EMAIL_API_KEY=your-secret-key
WEBHOOK_SECRET=your-webhook-secret
```

### 2. Get Your SSH Key

Copy your SSH private key:

```bash
cat ~/.ssh/google_compute_engine
```

Copy the entire output (including `-----BEGIN` and `-----END` lines) and paste it as `VM_SSH_KEY` secret.

### 3. Enable Workflow

The workflow is already in `.github/workflows/deploy-ci.yml`. Just push to trigger it!

## Usage

### Automatic Deployment

**Just push to main/master:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will automatically:
1. Build your app
2. Create deployment package
3. Deploy to VM
4. Verify deployment

### Manual Trigger

You can also trigger manually:
1. Go to **Actions** tab in GitHub
2. Select **CI/CD Deploy** workflow
3. Click **Run workflow**

### Check Status

1. Go to **Actions** tab
2. Click on the latest workflow run
3. See build and deploy progress in real-time

## Workflow Features

✅ **Automatic builds** on push to main/master  
✅ **Artifact storage** (keeps tarball for 7 days)  
✅ **Optimized tarball** (excludes unnecessary files)  
✅ **Automatic backups** before deployment  
✅ **Health checks** after deployment  
✅ **Chunk verification** (ensures Studio works)  
✅ **Rollback ready** (backups created automatically)  

## Benefits Over Manual Upload

| Manual Upload | CI/CD Pipeline |
|--------------|----------------|
| ❌ Manual steps | ✅ Automatic |
| ❌ SCP stalling issues | ✅ More reliable from GitHub |
| ❌ Need to run scripts | ✅ Just push to Git |
| ❌ Local machine needed | ✅ Works from anywhere |
| ❌ Manual verification | ✅ Automatic health checks |
| ❌ No history | ✅ Full deployment history |

## Troubleshooting

### Workflow Fails

1. **Check Actions tab** for error messages
2. **Verify secrets** are set correctly
3. **Check SSH key** format (must include BEGIN/END lines)
4. **Verify VM is accessible** from GitHub Actions

### SSH Key Issues

If deployment fails with SSH errors:
1. Make sure `VM_SSH_KEY` secret includes:
   - `-----BEGIN OPENSSH PRIVATE KEY-----`
   - Your key content
   - `-----END OPENSSH PRIVATE KEY-----`
2. Test SSH manually:
   ```bash
   ssh -i ~/.ssh/google_compute_engine rakshithgoudbrg@34.173.15.101
   ```

### Build Fails

1. Check **Actions** → **Build** step logs
2. Verify all required secrets are set
3. Check if dependencies changed

### Deploy Fails

1. Check **Actions** → **Deploy** step logs
2. Verify VM has disk space: `df -h`
3. Check service logs: `sudo journalctl -u converseblog -n 50`

## Workflow Files

- `.github/workflows/deploy-ci.yml` - Main CI/CD workflow (recommended)
- `.github/workflows/deploy.yml` - Original workflow (still works)

## Comparison

### Manual Deployment
```bash
./scripts/stage1-build.sh
./scripts/stage2-transfer.sh  # ← SCP stalling issues
```

### CI/CD Deployment
```bash
git push origin main  # ← That's it!
```

## Next Steps

1. **Add secrets** to GitHub (see above)
2. **Push to main** to trigger first deployment
3. **Monitor Actions tab** to see progress
4. **Enjoy automatic deployments!** 🎉

## Notes

- Workflow only runs on `main`/`master` branch pushes
- Pull requests will build but not deploy
- Artifacts are kept for 7 days
- Each deployment creates a backup automatically

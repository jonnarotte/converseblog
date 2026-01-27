# Deployment Guide

This project uses **GitHub Actions CI/CD** with a safe branch-based workflow. Development happens in `develop`, and production deployments happen automatically when code is merged to `main`.

## Branch Strategy

### `develop` Branch
- **Purpose**: Development and testing
- **On Push**: Builds and verifies the application
- **No Deployment**: Never deploys to production
- **Use Case**: Daily development work, feature branches

### `main` Branch
- **Purpose**: Production-ready code
- **On Push**: Builds AND deploys to production server
- **Automatic Deployment**: Every merge to `main` triggers production deployment
- **Use Case**: Stable releases, production updates

## Workflow

### 1. Develop in `develop` Branch

```bash
git checkout develop
# Make your changes
git add .
git commit -m "Add new feature"
git push origin develop
```

**What happens:**
- ✅ GitHub Actions builds the application
- ✅ Verifies build artifacts
- ✅ Checks for chunks and static files
- ❌ **No deployment** to production

### 2. Create Pull Request

When ready to deploy:

```bash
# Create PR from develop → main
# Review changes in GitHub
# Get team approval
```

**What happens:**
- ✅ GitHub Actions builds the application
- ✅ Verifies everything works
- ❌ **No deployment** (PRs never deploy)

### 3. Merge to `main`

Once PR is approved and merged:

```bash
# Merge PR in GitHub UI
# Or merge locally:
git checkout main
git merge develop
git push origin main
```

**What happens:**
- ✅ GitHub Actions builds the application
- ✅ Creates deployment package
- ✅ **Deploys to production server**
- ✅ Verifies deployment success
- ✅ Health checks

## Setup

### 1. Configure GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these required secrets:

#### Required Secrets:
```
VM_IP=your-server-ip-address
VM_USER=your-ssh-username
VM_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
(your SSH private key)
-----END OPENSSH PRIVATE KEY-----
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
SANITY_API_TOKEN=your-sanity-api-token (⚠️ CRITICAL - Newsletter API requires this)
```

#### Optional Secrets (recommended):
```
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_xxxxxxxxxxxxx (⚠️ Required for email sending)
EMAIL_FROM=noreply@yourdomain.com (⚠️ Required for email sending)
EMAIL_API_KEY=your-secret-api-key
WEBHOOK_SECRET=your-webhook-secret
```

### ⚠️ Newsletter API 500 Error Fix

If newsletter subscription returns 500 error in production:

#### Error: "Insufficient permissions; permission 'create' required" (403)

**This means your Sanity token has wrong permissions!**

1. **Go to [sanity.io/manage](https://sanity.io/manage)**
2. **Select your project** → **API** → **Tokens**
3. **Create NEW token** with **Editor** or **Admin** permissions ⚠️ (NOT Viewer!)
4. **Update `SANITY_API_TOKEN` in GitHub Secrets** with the new token
5. **Redeploy** (push to main or manual trigger)
6. **Test** newsletter subscription

#### Error: "SANITY_API_TOKEN not configured" (500)

1. **Verify `SANITY_API_TOKEN` is set** in GitHub Secrets
2. **Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set** in GitHub Secrets
3. **Redeploy** after adding secrets

#### Check server logs:
```bash
ssh user@server 'sudo journalctl -u converseblog -f'
```

Look for:
- `❌ Sanity API token lacks required permissions` → Token needs Editor role
- `❌ Missing Sanity API token` → Token not set in GitHub Secrets

### 2. Get Your SSH Key

Copy your SSH private key:
```bash
cat ~/.ssh/your-ssh-key
```

Copy the entire output (including `-----BEGIN` and `-----END` lines) and paste it as `VM_SSH_KEY` secret.

## Usage Examples

### Daily Development

```bash
# Work on develop branch
git checkout develop
git pull origin develop

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin develop

# ✅ Build runs automatically, no deployment
```

### Deploy to Production

```bash
# Option 1: Via Pull Request (Recommended)
# 1. Create PR: develop → main in GitHub
# 2. Review and approve
# 3. Merge PR
# ✅ Automatic deployment happens

# Option 2: Direct merge (if needed)
git checkout main
git merge develop
git push origin main
# ✅ Automatic deployment happens
```

### Manual Trigger

You can also trigger deployment manually:
1. Go to **Actions** tab in GitHub
2. Select **CI/CD Pipeline** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

## What Gets Deployed

**ONLY:**
- `.next/standalone/` directory (~100MB)
- `.env.local` file (created from secrets)
- Deployment scripts

**NOT:**
- ❌ Source code
- ❌ node_modules (only production deps)
- ❌ Git repository
- ❌ Development files

## Server Requirements

The server must have:
- Node.js 18+ (installed automatically by deployment script)
- Nginx (installed automatically by deployment script)
- SSH access configured
- Sudo access for deployment user

## Management Commands

After deployment, you can manage the service:

```bash
# Check status
ssh -i ~/.ssh/your-key user@your-server \
  'sudo systemctl status converseblog'

# View logs
ssh -i ~/.ssh/your-key user@your-server \
  'sudo journalctl -u converseblog -f'

# Restart
ssh -i ~/.ssh/your-key user@your-server \
  'sudo systemctl restart converseblog'
```

## Troubleshooting

### Build Fails on `develop`

1. Check **Actions** tab for error messages
2. Verify `.env.local` has correct values locally
3. Check if dependencies changed
4. Review build logs in GitHub Actions

### Deployment Fails on `main`

1. Check **Actions** → **Deploy** step logs
2. Verify all required secrets are set
3. Check SSH key format (must include BEGIN/END lines)
4. Verify server has disk space: `df -h`
5. Check service logs: `sudo journalctl -u converseblog -n 50`

### Service Won't Start

```bash
# Check logs
ssh -i ~/.ssh/your-key user@your-server \
  'sudo journalctl -u converseblog -n 50'
```

## Security Features

- ✅ **Safe branch strategy** - `develop` never deploys
- ✅ **PR protection** - Pull requests never deploy
- ✅ **Automatic backups** before deployment
- ✅ **Health checks** after deployment
- ✅ **Chunk verification** (ensures Studio works)
- ✅ **No source code on server**
- ✅ **Secrets stored securely** in GitHub

## Benefits

| Feature | develop Branch | main Branch |
|---------|----------------|-------------|
| Build | ✅ Yes | ✅ Yes |
| Test | ✅ Yes | ✅ Yes |
| Deploy | ❌ No | ✅ Yes |
| Safe for experiments | ✅ Yes | ❌ No |

## Notes

- **Never push directly to `main`** - Always use PRs
- Pull requests will build but not deploy
- Artifacts are kept for 7 days
- Each deployment creates a backup automatically
- The workflow uses `stage3-deploy.sh` script on the server for final deployment steps

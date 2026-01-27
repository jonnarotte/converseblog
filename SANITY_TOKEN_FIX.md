# Fix: Sanity API Token Permissions Error

## Error
```
Insufficient permissions; permission "create" required
statusCode: 403
```

## Problem
Your Sanity API token exists but **doesn't have the right permissions**. The token needs **Editor** or **Admin** role to create documents.

## Solution: Create New Token with Correct Permissions

### Step 1: Go to Sanity Management

1. Visit: [https://sanity.io/manage](https://sanity.io/manage)
2. Select your project: **o23ktewy** (or your project name)
3. Go to **API** → **Tokens**

### Step 2: Create New Token

1. Click **"Add API token"** or **"Create token"**
2. **Name**: `Newsletter API Token` (or any name)
3. **Permissions**: Select **"Editor"** or **"Admin"** ⚠️ (NOT "Viewer" or "Custom")
4. Click **"Save"**
5. **Copy the token** (starts with `sk...`) - you'll only see it once!

### Step 3: Update GitHub Secret

1. Go to: `https://github.com/YOUR_USERNAME/converseblog/settings/secrets/actions`
2. Find **`SANITY_API_TOKEN`** secret
3. Click **"Update"** (or delete and recreate)
4. Paste the **new token** (the one with Editor permissions)
5. Click **"Update secret"**

### Step 4: Redeploy

**Option A: Push to main (automatic)**
```bash
git checkout main
git merge develop
git push origin main
```

**Option B: Manual trigger**
1. Go to GitHub → **Actions** tab
2. Select **"CI/CD Pipeline"** workflow
3. Click **"Run workflow"**
4. Select **main** branch
5. Click **"Run workflow"**

### Step 5: Verify

After deployment completes:
1. Visit: `https://converze.org`
2. Try subscribing to newsletter
3. Should work now! ✅

## Why This Happened

- The old token likely had **"Viewer"** permissions (read-only)
- Newsletter API needs **"create"** permission to add subscribers
- Only **Editor** or **Admin** tokens can create documents

## Quick Checklist

- [ ] Created new Sanity token with **Editor** permissions
- [ ] Updated `SANITY_API_TOKEN` in GitHub Secrets
- [ ] Triggered new deployment
- [ ] Tested newsletter subscription on production
- [ ] Verified it works ✅

## If Still Failing

Check the token permissions again:
1. Go to Sanity → API → Tokens
2. Verify the token shows **"Editor"** or **"Admin"** role
3. If it shows **"Viewer"**, create a new one with Editor permissions

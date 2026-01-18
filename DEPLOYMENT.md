# Deployment Guide for Google Cloud Platform (GCP)

## Build Status ✅
Your project builds successfully! The build completed without errors.

## Prerequisites
1. Google Cloud SDK (gcloud) installed
2. GCP project created
3. Billing enabled on your GCP project

## Option 1: Deploy to Cloud Run (Recommended - Serverless)

### Steps:

1. **Install Google Cloud SDK** (if not already installed):
```bash
# macOS
brew install google-cloud-sdk

# Verify installation
gcloud --version
```

2. **Authenticate and set project**:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

3. **Build and deploy using Cloud Build** (recommended):
```bash
# From your project root
gcloud run deploy converseblog \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

4. **Or build Docker image manually**:
```bash
# Create Dockerfile in root (if not exists)
# Then:
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/converseblog
gcloud run deploy converseblog \
  --image gcr.io/YOUR_PROJECT_ID/converseblog \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SANITY_PROJECT_ID=o23ktewy,NEXT_PUBLIC_SANITY_DATASET=production
```

## Option 2: Deploy to App Engine (Traditional)

1. **Create `app.yaml`** in project root:
```yaml
runtime: nodejs20

env_variables:
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'o23ktewy'
  NEXT_PUBLIC_SANITY_DATASET: 'production'
```

2. **Deploy**:
```bash
gcloud app deploy
```

## Option 3: Deploy to Compute Engine (VM)

1. **Create VM**:
```bash
gcloud compute instances create converseblog-vm \
  --machine-type=e2-medium \
  --zone=us-central1-a \
  --image-family=cos-stable \
  --image-project=cos-cloud
```

2. **SSH and setup**:
```bash
gcloud compute ssh converseblog-vm --zone=us-central1-a
# Then install Node.js, clone repo, build, and run
```

## Important: Environment Variables

**You MUST set these environment variables in GCP:**

- `NEXT_PUBLIC_SANITY_PROJECT_ID=o23ktewy`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2025-06-27` (optional, has default)

### For Cloud Run:
```bash
gcloud run services update converseblog \
  --set-env-vars NEXT_PUBLIC_SANITY_PROJECT_ID=o23ktewy,NEXT_PUBLIC_SANITY_DATASET=production
```

### For App Engine:
Add to `app.yaml`:
```yaml
env_variables:
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'o23ktewy'
  NEXT_PUBLIC_SANITY_DATASET: 'production'
```

## What to Deploy?

**You need to send your CODE, not just build files:**
- GCP will build your project during deployment
- Use `--source .` flag or push to a Git repository
- GCP Cloud Build will run `npm run build` automatically

### Files to include in deployment:
- All source code (`app/`, `components/`, `sanity/`, etc.)
- `package.json`
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.js`
- All config files

### Files to exclude (add to .gitignore):
- `node_modules/`
- `.next/`
- `.env.local` (use GCP environment variables instead)
- `.git/`

## Sanity CORS Settings

**Before deploying, update Sanity CORS:**
1. Go to https://sanity.io/manage
2. Select project `o23ktewy`
3. Settings → API → CORS origins
4. Add your GCP deployment URL (e.g., `https://your-app.run.app` or `https://your-project.appspot.com`)

## Post-Deployment Checklist

- [ ] Environment variables set in GCP
- [ ] CORS origins updated in Sanity dashboard
- [ ] Test `/studio` route works
- [ ] Test blog posts load correctly
- [ ] Check logs: `gcloud run logs read` or `gcloud app logs tail`

## Quick Deploy Command (Cloud Run - Easiest)

```bash
# From your project root
gcloud run deploy converseblog \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SANITY_PROJECT_ID=o23ktewy,NEXT_PUBLIC_SANITY_DATASET=production
```

This will:
1. Build your Next.js app
2. Create a Docker container
3. Deploy to Cloud Run
4. Give you a public URL

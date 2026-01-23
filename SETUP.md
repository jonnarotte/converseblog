# Quick Setup Guide

## Initial Sanity Setup

### Step 1: Create Sanity Project

1. Go to [sanity.io](https://www.sanity.io) and sign up/login
2. Click "Create project"
3. Choose a project name (e.g., "Converze Blog")
4. Choose a dataset name (default: "production")
5. Copy your **Project ID** from the dashboard

### Step 2: Configure Environment

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Project ID:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Step 3: Initialize Sanity (First Time Only)

Run this command to authenticate:

```bash
npx sanity@latest login
```

Then deploy the schema:

```bash
npx sanity@latest schema deploy
```

### Step 4: Access Studio

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000/studio` to access Sanity Studio.

### Step 5: Create Content

1. **Create Authors:**
   - Go to Studio → Authors
   - Create at least one author with name and slug

2. **Create Blog Posts:**
   - Go to Studio → Posts
   - Create your first blog post
   - Add title, excerpt, content, published date, and select author(s)

3. **Update About Page:**
   - Go to Studio → About Page
   - Edit the content

## Troubleshooting

### Studio Not Loading

If `/studio` shows an error:
1. Check your `.env.local` has the correct Project ID
2. Make sure you ran `npx sanity@latest login`
3. Try: `npx sanity@latest schema deploy`

### No Posts Showing

1. Make sure you've created posts in Sanity Studio
2. Check that posts have:
   - A slug
   - Published date
   - At least one author
3. Verify environment variables are set correctly

### Build Errors

If `npm run build` fails:
1. Check all environment variables are set
2. Make sure Sanity project exists and is accessible
3. Check Node.js version (needs 18+)

## Next Steps

- Customize the design in `components/` and `styles/globals.css`
- Add more fields to schemas in `sanity/schemaTypes/`
- Deploy following `DEPLOYMENT.md`

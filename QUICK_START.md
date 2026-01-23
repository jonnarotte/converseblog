# Quick Start Guide

## Schema Deployment - Two Options

### Option 1: Use Studio UI (Easiest - Recommended)

Since your schemas are already defined in code, you can skip the CLI deployment and use the Studio directly:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open Studio:**
   - Visit `http://localhost:3000/studio`
   - The Studio will automatically use your schemas from `sanity/schemaTypes/`
   - You can start creating content immediately!

### Option 2: Deploy Schemas via CLI

If you prefer to deploy schemas via CLI (optional):

```bash
npx sanity@latest schema deploy
```

**Note:** After upgrading to React 19, this should work now. If you still get errors, just use Option 1 - the Studio UI works perfectly without CLI deployment.

## Create Your First Content

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Access Studio:**
   - Go to `http://localhost:3000/studio`

3. **Create an Author:**
   - Click "Authors" in the sidebar
   - Click "Create new"
   - Fill in:
     - Name: Your name
     - Slug: (auto-generated)
     - Image: (optional)
     - Bio: (optional)
   - Click "Publish"

4. **Create a Blog Post:**
   - Click "Posts" in the sidebar
   - Click "Create new"
   - Fill in:
     - Title: Your post title
     - Slug: (auto-generated)
     - Excerpt: Brief description
     - Cover Image: (optional, click to upload)
     - Published at: Select date
     - Authors: Click and select your author(s)
     - Content: Write your post using the rich text editor
   - Click "Publish"

5. **Update About Page:**
   - Click "About Page" in the sidebar
   - Edit the content
   - Click "Publish"

6. **View Your Blog:**
   - Go to `http://localhost:3000/blog` to see your posts
   - Click on a post to read it

## Troubleshooting

### Studio Not Loading

- Make sure `.env.local` has your Project ID:
  ```env
  NEXT_PUBLIC_SANITY_PROJECT_ID=o23ktewy
  NEXT_PUBLIC_SANITY_DATASET=production
  ```

### No Content Showing

- Make sure you've created and **published** content in Studio
- Check that posts have:
  - A slug
  - Published date
  - At least one author

### Build Errors

- Make sure React 19 is installed: `npm install react@^19 react-dom@^19`
- Check environment variables are set correctly

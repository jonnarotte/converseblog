#!/usr/bin/env node

/**
 * Post-build script to copy static files to standalone directory
 * This ensures static chunks and public files are available in production
 */

const fs = require('fs');
const path = require('path');

const appDir = process.cwd();
const nextStatic = path.join(appDir, '.next/static');
const standaloneDir = path.join(appDir, '.next/standalone');
const standaloneStatic = path.join(standaloneDir, '.next/static');
const publicDir = path.join(appDir, 'public');
const standalonePublic = path.join(standaloneDir, 'public');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source directory not found: ${src}`);
    return false;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  return true;
}

console.log('📦 Copying static files to standalone directory...');

// Copy static files
if (fs.existsSync(nextStatic)) {
  if (fs.existsSync(standaloneStatic)) {
    fs.rmSync(standaloneStatic, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(standaloneStatic), { recursive: true });
  
  if (copyDir(nextStatic, standaloneStatic)) {
    const chunksDir = path.join(standaloneStatic, 'chunks');
    if (fs.existsSync(chunksDir)) {
      const jsFiles = fs.readdirSync(chunksDir).filter(f => f.endsWith('.js'));
      console.log(`✓ Copied ${jsFiles.length} JavaScript chunks`);
    }
    console.log('✓ Static files copied');
  }
} else {
  console.log('⚠️  .next/static directory not found');
}

// Copy public files
if (fs.existsSync(publicDir)) {
  if (fs.existsSync(standalonePublic)) {
    fs.rmSync(standalonePublic, { recursive: true, force: true });
  }
  if (copyDir(publicDir, standalonePublic)) {
    console.log('✓ Public files copied');
  }
} else {
  console.log('⚠️  public directory not found');
}

// Copy server files for dynamic routes (Studio)
const serverApp = path.join(appDir, '.next/server/app');
const standaloneServerApp = path.join(standaloneDir, '.next/server/app');
if (fs.existsSync(serverApp)) {
  fs.mkdirSync(path.dirname(standaloneServerApp), { recursive: true });
  if (copyDir(serverApp, standaloneServerApp)) {
    console.log('✓ Server files copied');
  }
}

console.log('✅ Post-build copy complete!');

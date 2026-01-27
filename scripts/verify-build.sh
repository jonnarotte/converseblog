#!/bin/bash
# Verify what's actually in the build vs deployed
# Run this ON YOUR LOCAL MACHINE

set -e

echo "🔍 Verifying Build Contents"
echo ""

# Check local build
echo "1. Local build (.next/standalone):"
if [ -f ".next/standalone/server.js" ]; then
    echo "   ✓ server.js exists"
    stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" .next/standalone/server.js 2>/dev/null || stat -c "%y" .next/standalone/server.js | cut -d' ' -f1,2
else
    echo "   ❌ server.js NOT FOUND - need to build first"
    exit 1
fi

echo ""
echo "2. Check new logo in local build:"
if [ -f ".next/standalone/public/favicon.svg" ]; then
    echo "   ✓ favicon.svg exists"
    LOCAL_SIZE=$(stat -f%z .next/standalone/public/favicon.svg 2>/dev/null || stat -c%s .next/standalone/public/favicon.svg)
    echo "   Size: $LOCAL_SIZE bytes"
    stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" .next/standalone/public/favicon.svg 2>/dev/null || stat -c "%y" .next/standalone/public/favicon.svg | cut -d' ' -f1,2
else
    echo "   ❌ favicon.svg NOT in build"
fi

echo ""
echo "3. Check tarball contents:"
if [ -f "deploy.tar.gz" ]; then
    echo "   Tarball exists"
    TARBALL_SIZE=$(stat -f%z deploy.tar.gz 2>/dev/null || stat -c%s deploy.tar.gz)
    echo "   Size: $TARBALL_SIZE bytes ($(du -h deploy.tar.gz | cut -f1))"
    echo ""
    echo "   Files in tarball:"
    tar -tzf deploy.tar.gz | grep -E "(server.js|favicon.svg|BUILD_ID)" | head -10
    echo ""
    echo "   Extract and check favicon:"
    TEMP_DIR=$(mktemp -d)
    tar -xzf deploy.tar.gz -C $TEMP_DIR 2>/dev/null
    if [ -f "$TEMP_DIR/standalone/public/favicon.svg" ]; then
        TAR_SIZE=$(stat -f%z "$TEMP_DIR/standalone/public/favicon.svg" 2>/dev/null || stat -c%s "$TEMP_DIR/standalone/public/favicon.svg")
        echo "   ✓ favicon.svg in tarball: $TAR_SIZE bytes"
        if [ "$LOCAL_SIZE" = "$TAR_SIZE" ]; then
            echo "   ✓ Sizes match"
        else
            echo "   ❌ Sizes DON'T match - tarball has old file!"
        fi
    else
        echo "   ❌ favicon.svg NOT in tarball!"
    fi
    rm -rf $TEMP_DIR
else
    echo "   ❌ deploy.tar.gz NOT FOUND"
fi

echo ""
echo "4. Check source files:"
if [ -f "public/favicon.svg" ]; then
    SOURCE_SIZE=$(stat -f%z public/favicon.svg 2>/dev/null || stat -c%s public/favicon.svg)
    echo "   ✓ Source favicon.svg: $SOURCE_SIZE bytes"
    stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" public/favicon.svg 2>/dev/null || stat -c "%y" public/favicon.svg | cut -d' ' -f1,2
    if [ "$LOCAL_SIZE" != "$SOURCE_SIZE" ]; then
        echo "   ⚠️  Source and build sizes don't match!"
    fi
else
    echo "   ❌ Source favicon.svg NOT FOUND"
fi

echo ""
echo "✅ Verification complete"

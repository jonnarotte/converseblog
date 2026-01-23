#!/bin/bash

# Diagnose Studio static assets issue
# Run this on your VM

APP_DIR="/var/www/converseblog"
cd $APP_DIR

echo "🔍 Diagnosing Studio static assets issue..."
echo ""

echo "1. Checking .next/static structure:"
if [ -d ".next/static" ]; then
    echo "   ✓ .next/static exists"
    echo "   Contents:"
    ls -la .next/static/ | head -10
    echo ""
    if [ -d ".next/static/chunks" ]; then
        echo "   ✓ .next/static/chunks exists"
        echo "   Chunk count: $(ls -1 .next/static/chunks/*.js 2>/dev/null | wc -l)"
        echo "   Sample chunks:"
        ls -1 .next/static/chunks/*.js 2>/dev/null | head -5
    else
        echo "   ❌ .next/static/chunks NOT FOUND"
    fi
else
    echo "   ❌ .next/static NOT FOUND"
fi

echo ""
echo "2. Checking standalone/.next/static structure:"
if [ -d ".next/standalone/.next/static" ]; then
    echo "   ✓ .next/standalone/.next/static exists"
    if [ -d ".next/standalone/.next/static/chunks" ]; then
        echo "   ✓ .next/standalone/.next/static/chunks exists"
        echo "   Chunk count: $(ls -1 .next/standalone/.next/static/chunks/*.js 2>/dev/null | wc -l)"
    else
        echo "   ❌ .next/standalone/.next/static/chunks NOT FOUND"
    fi
else
    echo "   ❌ .next/standalone/.next/static NOT FOUND"
fi

echo ""
echo "3. Checking if chunks match:"
if [ -d ".next/static/chunks" ] && [ -d ".next/standalone/.next/static/chunks" ]; then
    SOURCE_COUNT=$(ls -1 .next/static/chunks/*.js 2>/dev/null | wc -l)
    DEST_COUNT=$(ls -1 .next/standalone/.next/static/chunks/*.js 2>/dev/null | wc -l)
    echo "   Source chunks: $SOURCE_COUNT"
    echo "   Destination chunks: $DEST_COUNT"
    if [ "$SOURCE_COUNT" -eq "$DEST_COUNT" ]; then
        echo "   ✓ Chunk counts match"
    else
        echo "   ⚠️  Chunk counts don't match - need to copy again"
    fi
fi

echo ""
echo "4. Testing if Next.js can serve chunks:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" http://localhost:3000/_next/static/chunks/main-app.js 2>/dev/null || echo "   ❌ Cannot connect to localhost:3000"

echo ""
echo "✅ Diagnosis complete!"

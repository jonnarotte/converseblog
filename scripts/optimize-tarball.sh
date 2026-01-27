#!/bin/bash

# 📦 Optimize Tarball Size
# Reduces tarball size by removing unnecessary files
# Usage: ./scripts/optimize-tarball.sh

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DEPLOY_DIR=".deploy"
TARBALL="deploy.tar.gz"

echo -e "${BLUE}📦 Optimizing Tarball Size${NC}"
echo ""

if [ ! -d "$DEPLOY_DIR" ]; then
    echo -e "${RED}❌ .deploy directory not found${NC}"
    echo "Run: ./scripts/stage1-build.sh first"
    exit 1
fi

ORIGINAL_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
echo -e "${BLUE}Original size: $ORIGINAL_SIZE${NC}"

# Remove unnecessary files from standalone
echo -e "${BLUE}Cleaning unnecessary files...${NC}"

# Remove source maps (if any)
find "$DEPLOY_DIR/standalone" -name "*.map" -delete 2>/dev/null || true

# Remove test files
find "$DEPLOY_DIR/standalone" -name "*.test.*" -delete 2>/dev/null || true
find "$DEPLOY_DIR/standalone" -name "*.spec.*" -delete 2>/dev/null || true

# Remove README and docs from node_modules (if any)
find "$DEPLOY_DIR/standalone" -type f \( -name "README*" -o -name "*.md" -o -name "LICENSE*" \) \
    -not -path "*/node_modules/*" -delete 2>/dev/null || true

# Remove .git directories if any
find "$DEPLOY_DIR" -type d -name ".git" -exec rm -rf {} + 2>/dev/null || true

# Recreate tarball with maximum compression
echo -e "${BLUE}Creating optimized tarball with maximum compression...${NC}"
cd "$DEPLOY_DIR"
tar -czf "../$TARBALL" --exclude='*.map' --exclude='*.test.*' --exclude='*.spec.*' .
cd - > /dev/null

NEW_SIZE=$(du -sh "$TARBALL" | cut -f1)
echo ""
echo -e "${GREEN}✓ Optimization complete${NC}"
echo -e "  Original: $ORIGINAL_SIZE"
echo -e "  Optimized: $NEW_SIZE"
echo ""

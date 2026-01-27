#!/bin/bash

# 🎨 Generate Icon Files
# Converts SVG to ICO and PNG formats for maximum compatibility
# Requires: ImageMagick or online conversion tools

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎨 Generating Icon Files${NC}"
echo ""

PUBLIC_DIR="public"
SVG_FILE="$PUBLIC_DIR/favicon.svg"

if [ ! -f "$SVG_FILE" ]; then
    echo -e "${YELLOW}❌ favicon.svg not found${NC}"
    exit 1
fi

# Check for ImageMagick
if command -v convert &> /dev/null; then
    echo -e "${GREEN}✓ ImageMagick found${NC}"
    
    # Generate favicon.ico (multi-size)
    echo -e "${BLUE}Generating favicon.ico...${NC}"
    convert -background none -density 256 "$SVG_FILE" -define icon:auto-resize "$PUBLIC_DIR/favicon.ico"
    echo -e "${GREEN}✓ favicon.ico created${NC}"
    
    # Generate Apple touch icon (180x180)
    echo -e "${BLUE}Generating apple-icon.png...${NC}"
    convert -background none -resize 180x180 "$SVG_FILE" "$PUBLIC_DIR/apple-icon.png"
    echo -e "${GREEN}✓ apple-icon.png created${NC}"
    
    # Generate icon-192.png (if not exists)
    if [ ! -f "$PUBLIC_DIR/icon-192.png" ]; then
        echo -e "${BLUE}Generating icon-192.png...${NC}"
        convert -background none -resize 192x192 "$SVG_FILE" "$PUBLIC_DIR/icon-192.png"
        echo -e "${GREEN}✓ icon-192.png created${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✅ All icons generated!${NC}"
else
    echo -e "${YELLOW}⚠️  ImageMagick not found${NC}"
    echo ""
    echo "Install ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "Or use online tools:"
    echo "  1. https://realfavicongenerator.net/"
    echo "  2. https://favicon.io/favicon-converter/"
    echo "  3. Upload $SVG_FILE and download generated files"
    echo ""
    echo "Required files:"
    echo "  - favicon.ico (multi-size, 16x16 to 256x256)"
    echo "  - apple-icon.png (180x180)"
    echo "  - icon-192.png (192x192)"
fi

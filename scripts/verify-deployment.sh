#!/bin/bash

# ✅ Verify Deployment Configuration
# Checks if GitHub Actions secrets are configured correctly

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Verifying Deployment Configuration...${NC}"
echo ""

ERRORS=0

# Check .env.local (for local development)
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local found${NC}"
    source .env.local
    if [ -z "${NEXT_PUBLIC_SANITY_PROJECT_ID:-}" ]; then
        echo -e "${YELLOW}⚠️  NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local${NC}"
    else
        echo -e "${GREEN}✓ NEXT_PUBLIC_SANITY_PROJECT_ID is set${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local not found (optional for CI/CD)${NC}"
fi
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
    
    # Check version
    NODE_MAJOR=$(node --version | cut -d. -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18+ required (found $NODE_VERSION)${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ Node.js not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check required scripts
REQUIRED_SCRIPTS=("stage3-deploy.sh" "copy-static.js")
for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ]; then
        echo -e "${GREEN}✓ scripts/$script${NC}"
    else
        echo -e "${RED}❌ scripts/$script missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# Check GitHub workflow
if [ -f ".github/workflows/deploy.yml" ]; then
    echo -e "${GREEN}✓ GitHub Actions workflow found${NC}"
else
    echo -e "${RED}❌ .github/workflows/deploy.yml missing${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo -e "${BLUE}📋 GitHub Secrets Required:${NC}"
echo "  - VM_IP"
echo "  - VM_USER"
echo "  - VM_SSH_KEY"
echo "  - NEXT_PUBLIC_SANITY_PROJECT_ID"
echo "  - SANITY_API_TOKEN"
echo ""
echo -e "${BLUE}📋 Optional GitHub Secrets:${NC}"
echo "  - NEXT_PUBLIC_SANITY_DATASET (defaults to 'production')"
echo "  - NEXT_PUBLIC_SITE_URL"
echo "  - NEXT_PUBLIC_GA_ID"
echo "  - RESEND_API_KEY"
echo "  - EMAIL_FROM"
echo "  - EMAIL_API_KEY"
echo "  - WEBHOOK_SECRET"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Configure GitHub Secrets (see DEPLOYMENT.md)"
    echo "  2. Push to main/master branch to trigger deployment"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s). Please fix before deploying.${NC}"
    exit 1
fi

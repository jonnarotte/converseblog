# Testing Setup - First Time

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This installs:
   - Jest (unit testing)
   - React Testing Library (component testing)
   - Playwright (E2E testing)
   - All testing utilities

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Set up test environment:**
   ```bash
   cp .test.env.example .env.test.local
   # Edit .env.test.local if needed (usually defaults are fine)
   ```

## Verify Setup

Run a quick test:
```bash
npm test
```

If tests run successfully, you're all set! ✅

## Next Steps

- Read [TESTING.md](./TESTING.md) for complete guide
- Check [QUICK_TEST.md](./QUICK_TEST.md) for quick reference
- Start testing: `npm run test:watch`

## Troubleshooting

**"Cannot find module" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Playwright not found:**
```bash
npx playwright install
```

**Type errors:**
```bash
npm run type-check
```

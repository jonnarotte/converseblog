# Quick Testing Reference

Quick commands for testing before pushing.

## 🚀 Quick Test (Before Push)

```bash
npm run test:pre-push
```

This runs:
- ✅ TypeScript type check
- ✅ Unit tests
- ✅ Build test
- ✅ E2E tests (optional)

## 📝 Individual Test Commands

### Unit Tests
```bash
npm test                    # Run once
npm run test:watch         # Watch mode (auto-rerun)
npm run test:coverage      # With coverage report
```

### E2E Tests
```bash
npm run test:e2e           # Headless
npm run test:e2e:ui        # Interactive UI
npm run test:e2e:headed    # See browser
```

### Type Check
```bash
npm run type-check
```

### Build Test
```bash
npm run build
```

## 🧪 Test Specific Features

### Test Email (Resend)
```bash
# Unit test
npm test -- email.test.ts

# Manual API test (dev server running)
curl -X POST "http://localhost:3000/api/email/send?key=test-api-key" \
  -H "Content-Type: application/json" \
  -d '{"type":"custom","subject":"Test","message":"Test"}'
```

### Test Sanity Studio
```bash
# E2E test
npm run test:e2e -- sanity-studio.spec.ts

# Or manually: http://localhost:3000/studio
```

### Test Search
```bash
# Component test
npm test -- SearchBar.test.tsx

# E2E test
npm run test:e2e -- blog.spec.ts
```

## 🔄 Development Workflow

1. **Make changes**
2. **Run tests in watch mode:**
   ```bash
   npm run test:watch
   ```
3. **Test manually in browser:**
   ```bash
   npm run dev
   ```
4. **Before pushing:**
   ```bash
   npm run test:pre-push
   ```

## ⚠️ Common Issues

**Tests fail locally:**
```bash
npm test -- --clearCache
rm -rf node_modules .next
npm install
```

**E2E tests timeout:**
- Ensure dev server is running (`npm run dev`)
- Check `.env.local` has correct values

**Type errors:**
```bash
npm run type-check
```

## 📊 Coverage

Check test coverage:
```bash
npm run test:coverage
```

Open coverage report:
```bash
open coverage/lcov-report/index.html
```

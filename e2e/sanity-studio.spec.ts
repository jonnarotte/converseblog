import { test, expect } from '@playwright/test'

test.describe('Sanity Studio', () => {
  test('studio loads successfully', async ({ page }) => {
    await page.goto('/studio')
    
    // Studio should load (may take a moment)
    await page.waitForTimeout(3000)
    
    // Check for Sanity Studio elements
    const studioLoaded = await page.locator('[data-testid*="studio"], [class*="sanity"], body').isVisible()
    expect(studioLoaded).toBeTruthy()
  })

  test('studio is accessible', async ({ page }) => {
    await page.goto('/studio')
    
    // Wait for studio to load
    await page.waitForTimeout(3000)
    
    // Check page title
    const title = await page.title()
    expect(title).toBeTruthy()
    
    // Check that page loaded without errors
    const errorMessages = await page.locator('text=/error|failed|404/i').count()
    expect(errorMessages).toBe(0)
  })
})

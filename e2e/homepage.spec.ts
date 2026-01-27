import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /understand your voice/i })).toBeVisible()
    
    // Check feature boxes
    await expect(page.getByText('Record')).toBeVisible()
    await expect(page.getByText('Visualize')).toBeVisible()
    await expect(page.getByText('Discover')).toBeVisible()
    await expect(page.getByText('Transform')).toBeVisible()
  })

  test('navigation works', async ({ page }) => {
    await page.goto('/')
    
    // Click blog link
    await page.getByRole('link', { name: /blog/i }).first().click()
    await expect(page).toHaveURL(/\/blog/)
    
    // Navigate back
    await page.getByRole('link', { name: /converze/i }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('theme toggle works', async ({ page }) => {
    await page.goto('/')
    
    // Find theme toggle button
    const themeToggle = page.locator('[aria-label*="theme"], [aria-label*="Theme"]').first()
    
    if (await themeToggle.isVisible()) {
      const initialHtml = await page.content()
      await themeToggle.click()
      
      // Wait for theme change
      await page.waitForTimeout(500)
      
      const newHtml = await page.content()
      // Theme should have changed (class or data attribute)
      expect(newHtml).not.toBe(initialHtml)
    }
  })

  test('newsletter form appears', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to newsletter section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Newsletter form should be visible
    const newsletterInput = page.locator('input[type="email"]').first()
    await expect(newsletterInput).toBeVisible({ timeout: 5000 })
  })
})

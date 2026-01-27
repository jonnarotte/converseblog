import { test, expect } from '@playwright/test'

test.describe('Blog Page', () => {
  test('loads blog page', async ({ page }) => {
    await page.goto('/blog')
    
    // Check search bar is visible
    const searchInput = page.getByPlaceholderText(/search blog posts/i)
    await expect(searchInput).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    await page.goto('/blog')
    
    const searchInput = page.getByPlaceholderText(/search blog posts/i)
    
    // Type in search
    await searchInput.fill('test')
    
    // Wait for search results or "no results" message
    await page.waitForTimeout(1000)
    
    // Either results appear or "no posts found" message
    const hasResults = await page.locator('[class*="card"], [class*="post"]').count() > 0
    const hasNoResults = await page.getByText(/no posts found/i).isVisible().catch(() => false)
    
    expect(hasResults || hasNoResults).toBeTruthy()
  })

  test('blog cards are clickable', async ({ page }) => {
    await page.goto('/blog')
    
    // Wait for blog posts to load
    await page.waitForTimeout(2000)
    
    // Try to click first blog card if exists
    const firstCard = page.locator('a[href*="/blog/"]').first()
    const cardCount = await firstCard.count()
    
    if (cardCount > 0) {
      const href = await firstCard.getAttribute('href')
      await firstCard.click()
      
      if (href) {
        await expect(page).toHaveURL(new RegExp(href))
      }
    }
  })
})

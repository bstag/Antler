import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test('Submits via serverless fallback with interception', async ({ page }) => {
    await page.route(
      '**/functions/contact', 
      async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        })
      }
    )

    const check = await request.get('http://localhost:4321/Antler/contact')
    expect(check.status()).toBe(200)
    await page.goto('/Antler/contact', { waitUntil: 'domcontentloaded' })
    await page.fill('#name', 'Test User')
    await page.fill('#email', 'test@example.com')
    await page.fill('#subject', 'Testing')
    await page.fill('#message', 'Hello from Playwright')
    await page.evaluate(() => {
      const form = document.querySelector('form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    await page.waitForSelector('[role="status"]', { state: 'visible', timeout: 15000 })
  })
})

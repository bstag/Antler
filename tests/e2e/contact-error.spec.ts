import { test, expect } from '@playwright/test';

test.describe('Contact form error handling', () => {
  test('Shows accessible error message on failure', async ({ page }) => {
    // Mock a 500 error from the backend
    await page.route(
      '**/functions/contact',
      async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Simulated server error' })
        })
      }
    )

    // Go to contact page
    await page.goto('/Antler/contact', { waitUntil: 'domcontentloaded' })

    // Fill the form
    await page.fill('#name', 'Error Tester')
    await page.fill('#email', 'error@example.com')
    await page.fill('#message', 'This should fail')

    // Submit
    await page.click('button[type="submit"]')

    // Wait for error message
    // We specifically look for role="alert" to ensure accessibility
    const errorAlert = page.locator('[role="alert"]')

    // This expectation should fail if the role="alert" is missing
    await expect(errorAlert).toBeVisible({ timeout: 5000 })
    await expect(errorAlert).toContainText('Simulated server error')

    // Check for aria-live attribute
    await expect(errorAlert).toHaveAttribute('aria-live', 'assertive')
  })
})

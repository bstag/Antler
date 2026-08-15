import { test, expect } from '@playwright/test'

test.describe('Full-site mode', () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.post('api/config/templates', {
      data: { templateId: 'full-site' }
    })
    expect(res.ok()).toBeTruthy()
  })

  test('All primary routes load', async ({ request, page }) => {
    for (const path of ['/', '/blog', '/projects', '/resume', '/docs', '/contact']) {
      const resp = await request.get(path)
      expect(resp.status()).toBe(200)
    }
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.screenshot({ path: 'test-results/e2e/fullsite-home.png', fullPage: true })
  })
})

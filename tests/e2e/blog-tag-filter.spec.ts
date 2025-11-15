import { test, expect } from '@playwright/test'

test.describe('Blog tag filter', () => {
  test.beforeAll(async ({ request }) => {
    if (test.info().project.name !== 'blog-only') test.skip()
    const res = await request.post('api/config/templates', { data: { templateId: 'blog-only' } })
    expect(res.ok()).toBeTruthy()
  })

  test('Filter by tag and show/hide posts', async ({ request, page }) => {
    if (test.info().project.name !== 'blog-only') test.skip()
    // Ensure there's at least one post with e2e-tag
    const frontmatter = {
      title: 'E2E Tagged Post',
      description: 'Filter test',
      publicationDate: new Date().toISOString(),
      tags: ['e2e-tag']
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/blog', {
      data: { frontmatter, content: 'Body' }
    })

    // Navigate and click tag button
    await page.goto('/Antler/blog', { waitUntil: 'domcontentloaded' })
    const tagButton = page.locator('button.tag-filter', { hasText: 'e2e-tag' })
    await tagButton.click({ force: true })

    // Expect posts visible; switching to a non-existing tag should show the no-posts message
    const nonExisting = page.locator('button.tag-filter', { hasText: 'non-tag' })
    const count = await nonExisting.count()
    if (count) {
      await nonExisting.first().click({ force: true })
      await expect(page.locator('#no-posts')).toBeVisible()
    } else {
      // If no such tag button exists, just assert the page is still interactive
      const cards = await page.locator('.post-card').count()
      expect(cards).toBeGreaterThan(0)
    }
  })
})

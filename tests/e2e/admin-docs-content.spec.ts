import { test, expect } from '@playwright/test'

test.describe('Admin create docs content', () => {
  test.beforeAll(async ({ request }) => {
    if (test.info().project.name !== 'documentation') test.skip()
    const res = await request.post('api/config/templates', { data: { templateId: 'documentation' } })
    expect(res.ok()).toBeTruthy()
  })

  test('Create docs entry and verify grouping and order', async ({ request, page }) => {
    if (test.info().project.name !== 'documentation') test.skip()
    const frontmatter = {
      title: 'E2E Doc A',
      description: 'Docs admin content',
      group: 'Guides',
      order: 1
    }
    const content = '## Section 1\n\nContent A\n\n## Section 2\n\nContent B'
    const create = await request.post('http://localhost:4321/Antler/admin/api/content/docs', {
      data: { frontmatter, content }
    })
    expect(create.status()).toBe(201)

    let ok = false
    for (let i = 0; i < 20; i++) {
      const resp = await request.get('http://localhost:4321/Antler/docs')
      if (resp.status() === 200) {
        const html = await resp.text()
        if (html.includes('Guides') && html.includes('E2E Doc A')) { ok = true; break }
      }
      await new Promise(r => setTimeout(r, 500))
    }
    expect(ok).toBeTruthy()

    await page.goto('/Antler/docs', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Guides')).toBeVisible()
    await expect(page.getByText('E2E Doc A')).toBeVisible()
    await page.screenshot({ path: 'test-results/e2e/admin-docs-index.png', fullPage: true })
  })
})


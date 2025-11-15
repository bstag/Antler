import { test, expect } from '@playwright/test'

test.describe('Admin create blog content', () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.post('api/config/templates', { data: { templateId: 'blog-only' } })
    expect(res.ok()).toBeTruthy()
  })

  test('Create blog post and verify listing and slug page', async ({ request, page }) => {
    const frontmatter = {
      title: 'E2E Test Post',
      description: 'E2E blog content validation',
      publicationDate: new Date().toISOString(),
      tags: ['e2e-tag'],
      featured: true
    }
    const content = 'This is the E2E test post body.'

    const create = await request.post('http://localhost:4321/Antler/admin/api/content/blog', {
      data: { frontmatter, content }
    })
    expect(create.status()).toBe(201)
    const created = await create.json()
    const slug = created?.data?.id
    expect(slug).toBeTruthy()

    // Poll until slug page is available
    let ok = false
    for (let i = 0; i < 10; i++) {
      const resp = await request.get(`http://localhost:4321/Antler/blog/${slug}`)
      if (resp.status() === 200) { ok = true; break }
      await new Promise(r => setTimeout(r, 500))
    }
    expect(ok).toBeTruthy()

    // Verify index shows the post
    const indexResp = await request.get('http://localhost:4321/Antler/blog')
    expect(indexResp.status()).toBe(200)
    const body = await indexResp.text()
    expect(body).toContain('E2E Test Post')

    // Capture screenshot of the slug page
    await page.goto(`/Antler/blog/${slug}`, { waitUntil: 'domcontentloaded' })
    await page.screenshot({ path: 'test-results/e2e/admin-blog-slug.png', fullPage: true })
  })
})


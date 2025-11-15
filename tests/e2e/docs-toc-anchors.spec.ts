import { test, expect } from '@playwright/test'

test.describe('Docs TOC and anchors', () => {
  test.beforeAll(async ({ request }) => {
    if (test.info().project.name !== 'documentation') test.skip()
    const res = await request.post('api/config/templates', { data: { templateId: 'documentation' } })
    expect(res.ok()).toBeTruthy()
  })

  test('Anchor link scrolls to section', async ({ request, page }) => {
    if (test.info().project.name !== 'documentation') test.skip()
    const fm = { title: 'E2E Anchor Doc', description: 'Anchors', group: 'Guides', order: 2 }
    const md = '## Section 1\n\n[Go to Section 2](#section-2)\n\n## Section 2\n\nEnd'
    const create = await request.post('http://localhost:4321/Antler/admin/api/content/docs', {
      data: { frontmatter: fm, content: md }
    })
    expect(create.status()).toBe(201)

    const slug = (await create.json())?.data?.id
    expect(slug).toBeTruthy()

    let ok = false
    for (let i = 0; i < 20; i++) {
      const resp = await request.get(`http://localhost:4321/Antler/docs/${slug}`)
      if (resp.status() === 200) { ok = true; break }
      await new Promise(r => setTimeout(r, 500))
    }
    expect(ok).toBeTruthy()

    await page.goto(`/Antler/docs/${slug}`, { waitUntil: 'domcontentloaded' })
    const link = page.locator('a[href="#section-2"]')
    await expect(link).toBeVisible()
    await link.click()
    const inView = await page.evaluate(() => {
      const el = document.getElementById('section-2')
      if (!el) return false
      const rect = el.getBoundingClientRect()
      return rect.top >= 0 && rect.top < window.innerHeight
    })
    expect(inView).toBeTruthy()
  })
})


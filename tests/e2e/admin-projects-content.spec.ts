import { test, expect } from '@playwright/test'

test.describe('Admin create project content', () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.post('api/config/templates', { data: { templateId: 'portfolio' } })
    expect(res.ok()).toBeTruthy()
  })

  test('Create project and verify listing', async ({ request, page }) => {
    const frontmatter = {
      projectName: 'E2E Test Project',
      projectImage: '/images/og-default.png',
      description: 'E2E project content validation',
      technologies: ['Playwright', 'Astro'],
      featured: true,
      createdAt: new Date().toISOString()
    }
    const content = 'Project details body.'

    const create = await request.post('http://localhost:4321/Antler/admin/api/content/projects', {
      data: { frontmatter, content }
    })
    expect(create.status()).toBe(201)
    const created = await create.json()
    const slug = created?.data?.id
    expect(slug).toBeTruthy()

    // Poll until listing reflects the new project
    let ok = false
    for (let i = 0; i < 10; i++) {
      const resp = await request.get('http://localhost:4321/Antler/projects')
      if (resp.status() === 200) {
        const html = await resp.text()
        if (html.includes('E2E Test Project')) { ok = true; break }
      }
      await new Promise(r => setTimeout(r, 500))
    }
    expect(ok).toBeTruthy()

    await page.goto('/Antler/projects', { waitUntil: 'domcontentloaded' })
    await page.screenshot({ path: 'test-results/e2e/admin-projects-list.png', fullPage: true })
  })
})


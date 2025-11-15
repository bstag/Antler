import { test, expect } from '@playwright/test'

test.describe('Blog-only mode', () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.post('api/config/templates', {
      data: { templateId: 'blog-only' }
    })
    expect(res.ok()).toBeTruthy()
  })

  test('Routes enabled/disabled as expected', async ({ request, page }) => {
    const home = await request.get('http://localhost:4321/Antler/')
    expect(home.status()).toBe(200)

    const blog = await request.get('http://localhost:4321/Antler/blog')
    expect(blog.status()).toBe(200)

    const contact = await request.get('http://localhost:4321/Antler/contact')
    expect(contact.status()).toBe(200)

    const proj = await request.get('http://localhost:4321/Antler/projects')
    expect(proj.status()).toBe(404)

    const resume = await request.get('http://localhost:4321/Antler/resume')
    expect(resume.status()).toBe(404)

    const docs = await request.get('http://localhost:4321/Antler/docs')
    expect(docs.status()).toBe(404)

    await page.goto('/Antler/', { waitUntil: 'domcontentloaded' })
    await page.screenshot({ path: 'test-results/e2e/blog-home.png', fullPage: true })
  })

  test('Blog index loads', async ({ request, page }) => {
    const response = await request.get('http://localhost:4321/Antler/blog')
    expect(response.status()).toBe(200)
    await page.goto('/Antler/blog', { waitUntil: 'domcontentloaded' })
    await page.screenshot({ path: 'test-results/e2e/blog-index.png', fullPage: true })
  })
})

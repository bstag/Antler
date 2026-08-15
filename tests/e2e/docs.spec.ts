import { test, expect } from '@playwright/test'

test.describe('Documentation mode', () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.post('api/config/templates', {
      data: { templateId: 'documentation' }
    })
    expect(res.ok()).toBeTruthy()
  })

  test('Docs and contact enabled; others disabled', async ({ request }) => {
    const home = await request.get('/')
    expect(home.status()).toBe(200)

    const docs = await request.get('/docs')
    expect(docs.status()).toBe(200)

    const contact = await request.get('/contact')
    expect(contact.status()).toBe(200)

    const blog = await request.get('/blog')
    expect(blog.status()).toBe(404)

    const proj = await request.get('/projects')
    expect(proj.status()).toBe(404)

    const resume = await request.get('/resume')
    expect(resume.status()).toBe(404)
  })
})

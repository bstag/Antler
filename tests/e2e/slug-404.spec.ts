import { test, expect } from '@playwright/test'

test.describe('Slug 404 checks', () => {
  test('Nonexistent blog/project/docs slugs return 404', async ({ request }) => {
    const routes = [
      '/blog/not-a-real-post',
      '/projects/not-a-real-project',
      '/docs/not-a-real-doc'
    ]
    for (const path of routes) {
      const resp = await request.get(`http://localhost:4321/Antler${path}`)
      expect(resp.status()).toBe(404)
    }
  })
})


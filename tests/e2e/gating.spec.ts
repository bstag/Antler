import { test, expect } from '@playwright/test'

const modes = [
  { id: 'portfolio', enabled: ['/projects', '/resume', '/contact'], disabled: ['/blog', '/docs'] },
  { id: 'blog-only', enabled: ['/blog', '/contact'], disabled: ['/projects', '/resume', '/docs'] },
  { id: 'resume-only', enabled: ['/resume', '/contact'], disabled: ['/projects', '/blog', '/docs'] },
  { id: 'documentation', enabled: ['/docs', '/contact'], disabled: ['/projects', '/blog', '/resume'] }
]

for (const mode of modes) {
  test.describe(`${mode.id} gating`, () => {
    test.beforeAll(async ({ request }) => {
      const res = await request.post('api/config/templates', {
        data: { templateId: mode.id }
      })
      expect(res.ok()).toBeTruthy()
    })

    test('Enabled routes return 200; disabled return 404', async ({ request }) => {
      for (const path of mode.enabled) {
        const resp = await request.get(`http://localhost:4321/Antler${path}`)
        expect(resp.status()).toBe(200)
      }
      for (const path of mode.disabled) {
        const resp = await request.get(`http://localhost:4321/Antler${path}`)
        expect(resp.status()).toBe(404)
      }
    })
  })
}

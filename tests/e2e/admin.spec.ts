import { test, expect } from '@playwright/test'

test.describe('Admin interface', () => {
  test('Admin loads and schema API responds', async ({ page, request }) => {
    const admin = await page.goto('/Antler/admin')
    expect(admin?.status()).toBe(200)

    const schema = await request.get('/Antler/admin/api/schema/blog')
    expect(schema.ok()).toBeTruthy()
    const data = await schema.json()
    expect(data).toHaveProperty('data')
  })
})


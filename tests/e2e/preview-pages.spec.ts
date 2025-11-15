import { test, expect } from '@playwright/test'
import fs from 'fs'

test.describe('Preview build pages', () => {
  test('Routes match site.config enabled/disabled', async ({ request }) => {
    const raw = fs.readFileSync('site.config.json', 'utf-8')
    const config = JSON.parse(raw)
    const enabled = config.contentTypes.filter((ct: any) => ct.enabled)
    const disabled = config.contentTypes.filter((ct: any) => !ct.enabled)

    // Root should always be 200
    const root = await request.get('http://localhost:4321/Antler/')
    expect(root.status()).toBe(200)

    for (const ct of enabled) {
      const resp = await request.get(`http://localhost:4321/Antler${ct.route}`)
      expect(resp.status()).toBe(200)
    }

    for (const ct of disabled) {
      const resp = await request.get(`http://localhost:4321/Antler${ct.route}`)
      expect(resp.status()).toBe(404)
    }
  })
})

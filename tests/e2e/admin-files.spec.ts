import { test, expect } from '@playwright/test'

test.describe('Admin file upload', () => {
  test('Upload image and fetch via base path', async ({ request }) => {
    const form = new FormData()
    const blob = new Blob([new Uint8Array([137,80,78,71])], { type: 'image/png' })
    const file = new File([blob], 'tiny.png', { type: 'image/png' })
    form.append('file', file)
    form.append('directory', 'images')

    const upload = await request.post('http://localhost:4321/Antler/admin/api/files/upload', { multipart: form as any })
    expect(upload.status()).toBe(200)
    const json = await upload.json()
    const path = json?.data?.path
    expect(path).toBeTruthy()

    const asset = await request.get(`http://localhost:4321/Antler${path}`)
    expect(asset.status()).toBe(200)
  })
})


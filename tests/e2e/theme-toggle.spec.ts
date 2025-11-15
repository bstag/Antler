import { test, expect } from '@playwright/test'

test('Theme toggle updates class and stylesheet', async ({ page }) => {
  await page.goto('/Antler/', { waitUntil: 'domcontentloaded' })
  const before = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains('dark'),
    sheet: (document.getElementById('theme-stylesheet') as HTMLLinkElement)?.href || ''
  }))

  const toggle = page.getByRole('button', { name: /Switch to (dark|light) mode|Toggle theme/i })
  await expect(toggle).toBeVisible()
  await toggle.click()

  const after = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains('dark'),
    sheet: (document.getElementById('theme-stylesheet') as HTMLLinkElement)?.href || ''
  }))

  expect(before.dark !== after.dark || before.sheet !== after.sheet).toBeTruthy()
})

import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'

const raw = fs.readFileSync('site.config.json', 'utf-8')
const siteConfig = JSON.parse(raw)
const basePath = siteConfig?.customization?.urls?.basePath || ''
const baseURL = `http://localhost:4321${basePath}`

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['line']
  ],
  use: {
    baseURL,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000
  },
  projects: [
    {
      name: 'portfolio',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'blog-only',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'resume-only',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})

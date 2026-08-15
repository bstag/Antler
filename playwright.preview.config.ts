import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'

const raw = fs.readFileSync('site.config.json', 'utf-8')
const siteConfig = JSON.parse(raw)
const basePath = process.env.BASE_PATH || ''
const baseURL = `http://localhost:4321${basePath}`

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: [
    'tests/e2e/preview-*.spec.ts',
    'tests/e2e/custom-deploy-preview.spec.ts',
    'tests/e2e/site-sections-customization.spec.ts'
  ],
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
    command: 'npm run preview',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120000
  },
  projects: [
    { name: 'preview-chrome', use: { ...devices['Desktop Chrome'] } }
  ]
})

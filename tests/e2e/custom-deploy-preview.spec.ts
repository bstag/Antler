import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

test.describe('Custom Deploy & Static Render Verification', () => {
  const configPath = path.resolve('site.config.json')
  let originalConfig: string

  test.beforeAll(() => {
    // 1. Backup original configuration
    originalConfig = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(originalConfig)

    // 2. Apply custom user customizations
    config.customization.siteName = 'StagWare Custom Enterprise'
    config.customization.theme.default = 'purple'
    config.customization.hero = {
      ...config.customization.hero,
      title: {
        text: 'Revolutionize Your ',
        highlightedText: 'Static Deployment',
        suffixText: ' Effortlessly'
      },
      subtitle: 'End-to-end verified static site with custom hero, CTA buttons, and theme.',
      actions: {
        primary: {
          text: 'Explore Custom Solutions',
          link: '/projects',
          icon: 'Rocket'
        },
        secondary: {
          text: 'Contact Team',
          link: '/contact',
          icon: null
        }
      }
    }

    // Write customized site.config.json
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')

    // 3. Trigger production static build
    const npmCmd = process.platform === 'win32' ? 'cmd /c npm.cmd run build' : 'npm run build'
    execSync(npmCmd, { stdio: 'inherit' })
  })

  test.afterAll(() => {
    // 4. Cleanly restore original config and rebuild
    if (originalConfig) {
      fs.writeFileSync(configPath, originalConfig, 'utf-8')
      const npmCmd = process.platform === 'win32' ? 'cmd /c npm.cmd run build' : 'npm run build'
      execSync(npmCmd, { stdio: 'inherit' })
    }
  })

  test('Statically rendered HTML matches custom hero, theme, titles, and CTA buttons', async ({ request }) => {
    // 1. Verify preview server returns 200 for root
    const homeResponse = await request.get('/')
    expect(homeResponse.status()).toBe(200)

    // 2. Inspect raw static HTML generated in dist/index.html
    const distIndexPath = path.resolve('dist/index.html')
    expect(fs.existsSync(distIndexPath)).toBeTruthy()
    const distHtml = fs.readFileSync(distIndexPath, 'utf-8')

    // Validate Custom Site Title
    expect(distHtml).toContain('StagWare Custom Enterprise')

    // Validate Custom Hero Title & Highlighted Text
    expect(distHtml).toContain('Revolutionize Your')
    expect(distHtml).toContain('Static Deployment')
    expect(distHtml).toContain('Effortlessly')

    // Validate Custom Hero Subtitle
    expect(distHtml).toContain('End-to-end verified static site with custom hero, CTA buttons, and theme.')

    // Validate Custom Primary CTA Button
    expect(distHtml).toContain('Explore Custom Solutions')

    // Validate Custom Secondary CTA Button
    expect(distHtml).toContain('Contact Team')

    // Validate Theme link uses purple
    expect(distHtml).toMatch(/theme-purple\.css|purple/i)

    // Validate that /admin is completely absent and returns 404
    const adminResponse = await request.get('/admin')
    expect(adminResponse.status()).toBe(404)
  })
})

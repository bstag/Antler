import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

test.describe('Site Sections & Public Pages Customization Verification', () => {
  const configPath = path.resolve('site.config.json')
  let originalConfig: string

  test.beforeAll(() => {
    // 1. Backup original configuration
    originalConfig = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(originalConfig)

    // 2. Apply custom user customizations across site sections
    config.customization.author.email = 'custom-contact@stagware.com'
    config.customization.social.github = 'https://github.com/custom-stagware'
    config.customization.social.linkedin = 'https://linkedin.com/in/custom-stagware'

    config.customization.pages = {
      ...config.customization.pages,
      contact: {
        title: 'Reach Out To Our Team',
        description: 'Custom contact header subtitle for E2E validation.',
        keywords: ['reach', 'contact', 'stagware']
      },
      projects: {
        title: 'Featured Case Studies',
        description: 'Custom showcase of client solutions and innovations.',
        keywords: ['case studies', 'portfolio']
      }
    }

    // Disable blog to test homepage section conditional hiding
    const blogContentType = config.contentTypes.find((c: any) => c.id === 'blog')
    if (blogContentType) {
      blogContentType.enabled = false
    }

    // Write customized site.config.json
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')

    // 3. Trigger production static build
    const npmCmd = process.platform === 'win32' ? 'cmd /c npm.cmd run build' : 'npm run build'
    execSync(npmCmd, { stdio: 'inherit' })
  })

  test.afterAll(() => {
    // 4. Restore original config and rebuild
    if (originalConfig) {
      fs.writeFileSync(configPath, originalConfig, 'utf-8')
      const npmCmd = process.platform === 'win32' ? 'cmd /c npm.cmd run build' : 'npm run build'
      execSync(npmCmd, { stdio: 'inherit' })
    }
  })

  test('Contact page dynamically renders customized author email and social links', async ({ request }) => {
    const resp = await request.get('/contact')
    expect(resp.status()).toBe(200)

    const distContact = path.resolve('dist/contact/index.html')
    expect(fs.existsSync(distContact)).toBeTruthy()
    const html = fs.readFileSync(distContact, 'utf-8')

    expect(html).toContain('Reach Out To Our Team')
    expect(html).toContain('Custom contact header subtitle for E2E validation.')
    expect(html).toContain('custom-contact@stagware.com')
    expect(html).toContain('https://github.com/custom-stagware')
    expect(html).toContain('https://linkedin.com/in/custom-stagware')
  })

  test('Projects page renders customized page title and description', async ({ request }) => {
    const resp = await request.get('/projects')
    expect(resp.status()).toBe(200)

    const distProjects = path.resolve('dist/projects/index.html')
    expect(fs.existsSync(distProjects)).toBeTruthy()
    const html = fs.readFileSync(distProjects, 'utf-8')

    expect(html).toContain('Featured Case Studies')
    expect(html).toContain('Custom showcase of client solutions and innovations.')
  })

  test('Homepage dynamically gates disabled sections and renders custom section titles', async ({ request }) => {
    const resp = await request.get('/')
    expect(resp.status()).toBe(200)

    const distIndex = path.resolve('dist/index.html')
    expect(fs.existsSync(distIndex)).toBeTruthy()
    const html = fs.readFileSync(distIndex, 'utf-8')

    // Projects section is enabled and uses customized section title
    expect(html).toContain('Featured Case Studies')

    // Blog section was disabled in site.config.json, so it should not render on homepage
    expect(html).not.toContain('Latest Blog Posts')
  })

  test('Legal pages (/privacy and /terms) statically render with 200 OK', async ({ request }) => {
    const privacyResp = await request.get('/privacy')
    expect(privacyResp.status()).toBe(200)

    const termsResp = await request.get('/terms')
    expect(termsResp.status()).toBe(200)
  })
})

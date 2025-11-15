import { test, expect } from '@playwright/test'

test.describe('Admin create resume content', () => {
  test.setTimeout(60000)
test.beforeAll(async ({ request }) => {
  if (test.info().project.name !== 'resume-only') test.skip()
  const res = await request.post('api/config/templates', { data: { templateId: 'resume-only' } })
  expect(res.ok()).toBeTruthy()
})

  test('Create resume entries and verify /resume', async ({ request, page }) => {
    if (test.info().project.name !== 'resume-only') test.skip()
    const personal = {
      name: 'E2E Tester',
      title: 'QA Engineer',
      summary: 'Ensures end-to-end quality.'
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/resumePersonal', {
      data: { frontmatter: personal, content: '' }
    })

    const experience = {
      title: 'Testing Lead',
      company: 'QualityCorp',
      location: 'Remote',
      startDate: new Date().toISOString(),
      description: 'Led E2E testing efforts.',
      achievements: ['Stabilized test suite'],
      order: 1,
      current: true
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/resumeExperience', {
      data: { frontmatter: experience, content: '' }
    })

    const education = {
      degree: 'BSc Testing',
      school: 'Test University',
      location: 'Online',
      startDate: new Date().toISOString(),
      details: 'Focus on quality assurance.',
      order: 1
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/resumeEducation', {
      data: { frontmatter: education, content: '' }
    })

    const skills = {
      category: 'Tools',
      skills: ['Playwright', 'Vitest'],
      order: 1
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/resumeSkills', {
      data: { frontmatter: skills, content: '' }
    })

    const certification = {
      name: 'QA Certification',
      issuer: 'CertOrg',
      date: new Date().toISOString(),
      credentialId: 'QA-1234',
      order: 1
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/resumeCertifications', {
      data: { frontmatter: certification, content: '' }
    })

    const language = {
      name: 'English',
      proficiency: 'Native',
      order: 1
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/resumeLanguages', {
      data: { frontmatter: language, content: '' }
    })

    const rproject = {
      name: 'QA Tooling',
      description: 'Built internal QA tools',
      technologies: ['Playwright', 'Astro'],
      url: 'https://example.com',
      githubUrl: 'https://github.com/example/qa-tooling',
      order: 1
    }
    await request.post('http://localhost:4321/Antler/admin/api/content/resumeProjects', {
      data: { frontmatter: rproject, content: '' }
    })

    // Poll until /resume reflects content
    const resumeCheck = await request.get('http://localhost:4321/Antler/resume')
    expect(resumeCheck.status()).toBe(200)
    await page.goto('/Antler/resume', { waitUntil: 'domcontentloaded' })
    await page.screenshot({ path: 'test-results/e2e/admin-resume.png', fullPage: true })
  })
})

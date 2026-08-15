import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSiteConfig } from '../../../../lib/config/static';
import fs from 'fs';
import path from 'path';

interface DiagnosticCheck {
  category: 'config' | 'content' | 'build' | 'seo';
  title: string;
  status: 'pass' | 'warning' | 'error';
  message: string;
}

export const GET: APIRoute = async () => {
  if (!import.meta.env.DEV && process.env.NODE_ENV !== 'test') {
    return new Response(JSON.stringify({ success: false, error: 'Local development only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const config = await getSiteConfig();
    const checks: DiagnosticCheck[] = [];

    // 1. Site Configuration Checks
    if (config.customization?.siteName) {
      checks.push({
        category: 'config',
        title: 'Site Identity',
        status: 'pass',
        message: `Configured as "${config.customization.siteName}"`
      });
    } else {
      checks.push({
        category: 'config',
        title: 'Site Identity',
        status: 'warning',
        message: 'Site name is empty in site.config.json'
      });
    }

    if (config.customization?.author?.email) {
      checks.push({
        category: 'config',
        title: 'Author Contact',
        status: 'pass',
        message: `Primary email: ${config.customization.author.email}`
      });
    } else {
      checks.push({
        category: 'config',
        title: 'Author Contact',
        status: 'warning',
        message: 'No author email configured for contact forms and inquiries'
      });
    }

    // 2. Content Collections Checks
    try {
      const blogPosts = await getCollection('blog');
      const drafts = blogPosts.filter(p => (p.data as any).draft);
      checks.push({
        category: 'content',
        title: 'Blog Collection',
        status: 'pass',
        message: `${blogPosts.length} published post(s)${drafts.length > 0 ? `, ${drafts.length} draft(s)` : ''}`
      });
    } catch {
      checks.push({
        category: 'content',
        title: 'Blog Collection',
        status: 'pass',
        message: '0 posts found'
      });
    }

    try {
      const projects = await getCollection('projects');
      checks.push({
        category: 'content',
        title: 'Projects Portfolio',
        status: 'pass',
        message: `${projects.length} project(s) ready for showcase`
      });
    } catch {
      checks.push({
        category: 'content',
        title: 'Projects Portfolio',
        status: 'pass',
        message: '0 projects found'
      });
    }

    // 3. Build & Static Distribution Checks
    const distPath = path.resolve('dist');
    const hasDist = fs.existsSync(distPath);
    if (hasDist) {
      const distStat = fs.statSync(distPath);
      checks.push({
        category: 'build',
        title: 'Static Distribution',
        status: 'pass',
        message: `dist/ folder ready (Last built: ${distStat.mtime.toLocaleTimeString()})`
      });
    } else {
      checks.push({
        category: 'build',
        title: 'Static Distribution',
        status: 'warning',
        message: 'Site has not been built yet. Trigger a static build to generate dist/.'
      });
    }

    // 4. SEO Checks
    const hasDescription = Boolean(config.customization?.description);
    const hasKeywords = Boolean(config.customization?.seo?.keywords?.length);
    checks.push({
      category: 'seo',
      title: 'SEO & Metadata',
      status: hasDescription ? 'pass' : 'warning',
      message: hasDescription
        ? `SEO description present (${config.customization.seo?.keywords?.length || 0} keywords)`
        : 'Default SEO description is missing'
    });

    const errorCount = checks.filter(c => c.status === 'error').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const score = Math.round(((checks.length - errorCount * 2 - warningCount) / checks.length) * 100);

    return new Response(JSON.stringify({
      success: true,
      data: {
        score: Math.max(0, score),
        readiness: errorCount > 0 ? 'Not Ready' : warningCount > 0 ? 'Ready with Warnings' : 'Optimal',
        checks
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to run diagnostics'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

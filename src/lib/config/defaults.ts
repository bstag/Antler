import type { SiteConfig, SiteTemplate } from '../../types/config';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteMode: 'full',
  contentTypes: [
    {
      id: 'blog',
      name: 'Blog',
      enabled: true,
      route: '/blog',
      icon: 'document-text',
      order: 1,
      settings: {
        postsPerPage: 10,
        showExcerpts: true,
        enableComments: false
      }
    },
    {
      id: 'projects',
      name: 'Projects',
      enabled: true,
      route: '/projects',
      icon: 'briefcase',
      order: 2,
      settings: {
        showTechnologies: true,
        enableFiltering: true
      }
    },
    {
      id: 'resume',
      name: 'Resume',
      enabled: true,
      route: '/resume',
      icon: 'user',
      order: 3,
      settings: {
        showDownloadButton: true,
        pdfPath: '/resume.pdf'
      }
    },
    {
      id: 'docs',
      name: 'Documentation',
      enabled: true,
      route: '/docs',
      icon: 'book-open',
      order: 4,
      settings: {
        enableSearch: true,
        showTableOfContents: true
      }
    },
    {
      id: 'contact',
      name: 'Contact',
      enabled: true,
      route: '/contact',
      icon: 'mail',
      order: 5,
      settings: {
        enableForm: true,
        showSocialLinks: true
      }
    }
  ],
  navigation: [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      enabled: true,
      order: 0,
      icon: 'home'
    },
    {
      id: 'blog',
      label: 'Blog',
      href: '/blog',
      enabled: true,
      order: 1,
      icon: 'document-text'
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      enabled: true,
      order: 2,
      icon: 'briefcase'
    },
    {
      id: 'resume',
      label: 'Resume',
      href: '/resume',
      enabled: true,
      order: 3,
      icon: 'user'
    },
    {
      id: 'docs',
      label: 'Docs',
      href: '/docs',
      enabled: true,
      order: 4,
      icon: 'book-open'
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '/contact',
      enabled: true,
      order: 5,
      icon: 'mail'
    }
  ],
  customLinks: [],
  customization: {
    siteName: 'Antler',
    description: 'A modern static site generator built with Astro, React, and TypeScript',
    tagline: 'Transform your Markdown content into beautiful, performant websites',
    logo: {
      type: 'svg',
      svgContent: '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
      width: 'w-8 h-8'
    },
    author: {
      name: 'Your Name',
      email: 'your.email@example.com',
      bio: 'Software developer and content creator'
    },
    social: {
      github: 'https://github.com/yourusername',
      twitter: 'https://twitter.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      custom: []
    },
    seo: {
      keywords: ['static site generator', 'astro', 'markdown', 'blog'],
      defaultImage: '/images/og-default.png'
    },
    footer: {
      copyrightText: `© ${new Date().getFullYear()} Antler. Built with ❤️ using Astro and React.`,
      showBuiltWith: true,
      showSocialLinks: true,
      legalLinks: [
        { label: 'Privacy Policy', href: '/privacy', external: false },
        { label: 'Terms of Service', href: '/terms', external: false }
      ],
      customSections: [
        {
          title: 'Quick Links',
          links: [
            { label: 'Home', href: '/', external: false },
            { label: 'Blog', href: '/blog', external: false },
            { label: 'Projects', href: '/projects', external: false },
            { label: 'Resume', href: '/resume', external: false }
          ]
        },
        {
          title: 'Resources',
          links: [
            { label: 'Documentation', href: '/docs', external: false },
            { label: 'Installation', href: '/docs/installation', external: false },
            { label: 'Contact', href: '/contact', external: false },
            { label: 'GitHub', href: 'https://github.com/yourusername/antler', external: true }
          ]
        }
      ]
    },
    urls: {
      baseUrl: 'https://bstag.github.io',
      basePath: '/Antler'
    },
    theme: {
      default: 'blue',
      allowUserOverride: true,
      availableThemes: ['blue', 'indigo', 'purple', 'pink', 'green', 'orange', 'red']
    },
    features: {
      analytics: {
        enabled: false
      },
      rss: {
        enabled: true,
        feedPath: '/feed.xml'
      },
      sitemap: {
        enabled: true
      }
    }
  },
  lastModified: new Date().toISOString()
};

export const SITE_TEMPLATES: Record<string, SiteTemplate> = {
  'resume-only': {
    name: 'Resume Site',
    description: 'Perfect for job seekers and professionals showcasing their career',
    siteMode: 'resume',
    contentTypes: [
      { 
        id: 'resume', 
        name: 'Resume', 
        enabled: true, 
        route: '/resume', 
        icon: 'user', 
        order: 1,
        settings: {
          showDownloadButton: true,
          pdfPath: '/resume.pdf'
        }
      },
      { 
        id: 'contact', 
        name: 'Contact', 
        enabled: true, 
        route: '/contact', 
        icon: 'mail', 
        order: 2,
        settings: {
          enableForm: true,
          showSocialLinks: true
        }
      },
      { 
        id: 'blog', 
        name: 'Blog', 
        enabled: false, 
        route: '/blog', 
        icon: 'document-text', 
        order: 3,
        settings: {
          postsPerPage: 10,
          showExcerpts: true,
          enableComments: false
        }
      },
      { 
        id: 'projects', 
        name: 'Projects', 
        enabled: false, 
        route: '/projects', 
        icon: 'briefcase', 
        order: 4,
        settings: {
          showTechnologies: true,
          enableFiltering: true
        }
      },
      { 
        id: 'docs', 
        name: 'Documentation', 
        enabled: false, 
        route: '/docs', 
        icon: 'book-open', 
        order: 5,
        settings: {
          enableSearch: true,
          showTableOfContents: true
        }
      }
    ],
    navigation: [
      { id: 'home', label: 'Home', href: '/', enabled: true, order: 0, icon: 'home' },
      { id: 'resume', label: 'Resume', href: '/resume', enabled: true, order: 1, icon: 'user' },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true, order: 2, icon: 'mail' }
    ]
  },
  'portfolio': {
    name: 'Portfolio Site',
    description: 'Showcase your work and projects with an optional resume',
    siteMode: 'portfolio',
    contentTypes: [
      { 
        id: 'projects', 
        name: 'Projects', 
        enabled: true, 
        route: '/projects', 
        icon: 'briefcase', 
        order: 1,
        settings: {
          showTechnologies: true,
          enableFiltering: true
        }
      },
      { 
        id: 'resume', 
        name: 'Resume', 
        enabled: true, 
        route: '/resume', 
        icon: 'user', 
        order: 2,
        settings: {
          showDownloadButton: true,
          pdfPath: '/resume.pdf'
        }
      },
      { 
        id: 'contact', 
        name: 'Contact', 
        enabled: true, 
        route: '/contact', 
        icon: 'mail', 
        order: 3,
        settings: {
          enableForm: true,
          showSocialLinks: true
        }
      },
      { 
        id: 'blog', 
        name: 'Blog', 
        enabled: false, 
        route: '/blog', 
        icon: 'document-text', 
        order: 4,
        settings: {
          postsPerPage: 10,
          showExcerpts: true,
          enableComments: false
        }
      },
      { 
        id: 'docs', 
        name: 'Documentation', 
        enabled: false, 
        route: '/docs', 
        icon: 'book-open', 
        order: 5,
        settings: {
          enableSearch: true,
          showTableOfContents: true
        }
      }
    ],
    navigation: [
      { id: 'home', label: 'Home', href: '/', enabled: true, order: 0, icon: 'home' },
      { id: 'projects', label: 'Portfolio', href: '/projects', enabled: true, order: 1, icon: 'briefcase' },
      { id: 'resume', label: 'About', href: '/resume', enabled: true, order: 2, icon: 'user' },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true, order: 3, icon: 'mail' }
    ]
  },
  'blog-only': {
    name: 'Blog Site',
    description: 'Focus on content creation with a clean blogging experience',
    siteMode: 'blog',
    contentTypes: [
      { 
        id: 'blog', 
        name: 'Blog', 
        enabled: true, 
        route: '/blog', 
        icon: 'document-text', 
        order: 1,
        settings: {
          postsPerPage: 10,
          showExcerpts: true,
          enableComments: false
        }
      },
      { 
        id: 'contact', 
        name: 'Contact', 
        enabled: true, 
        route: '/contact', 
        icon: 'mail', 
        order: 2,
        settings: {
          enableForm: true,
          showSocialLinks: true
        }
      },
      { 
        id: 'projects', 
        name: 'Projects', 
        enabled: false, 
        route: '/projects', 
        icon: 'briefcase', 
        order: 3,
        settings: {
          showTechnologies: true,
          enableFiltering: true
        }
      },
      { 
        id: 'resume', 
        name: 'Resume', 
        enabled: false, 
        route: '/resume', 
        icon: 'user', 
        order: 4,
        settings: {
          showDownloadButton: true,
          pdfPath: '/resume.pdf'
        }
      },
      { 
        id: 'docs', 
        name: 'Documentation', 
        enabled: false, 
        route: '/docs', 
        icon: 'book-open', 
        order: 5,
        settings: {
          enableSearch: true,
          showTableOfContents: true
        }
      }
    ],
    navigation: [
      { id: 'home', label: 'Home', href: '/', enabled: true, order: 0, icon: 'home' },
      { id: 'blog', label: 'Blog', href: '/blog', enabled: true, order: 1, icon: 'document-text' },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true, order: 2, icon: 'mail' }
    ]
  },
  'documentation': {
    name: 'Documentation Site',
    description: 'Create comprehensive documentation with organized content',
    siteMode: 'docs',
    contentTypes: [
      { 
        id: 'docs', 
        name: 'Documentation', 
        enabled: true, 
        route: '/docs', 
        icon: 'book-open', 
        order: 1,
        settings: {
          enableSearch: true,
          showTableOfContents: true
        }
      },
      { 
        id: 'contact', 
        name: 'Contact', 
        enabled: true, 
        route: '/contact', 
        icon: 'mail', 
        order: 2,
        settings: {
          enableForm: true,
          showSocialLinks: true
        }
      },
      { 
        id: 'blog', 
        name: 'Blog', 
        enabled: false, 
        route: '/blog', 
        icon: 'document-text', 
        order: 3,
        settings: {
          postsPerPage: 10,
          showExcerpts: true,
          enableComments: false
        }
      },
      { 
        id: 'projects', 
        name: 'Projects', 
        enabled: false, 
        route: '/projects', 
        icon: 'briefcase', 
        order: 4,
        settings: {
          showTechnologies: true,
          enableFiltering: true
        }
      },
      { 
        id: 'resume', 
        name: 'Resume', 
        enabled: false, 
        route: '/resume', 
        icon: 'user', 
        order: 5,
        settings: {
          showDownloadButton: true,
          pdfPath: '/resume.pdf'
        }
      }
    ],
    navigation: [
      { id: 'home', label: 'Home', href: '/', enabled: true, order: 0, icon: 'home' },
      { id: 'docs', label: 'Documentation', href: '/docs', enabled: true, order: 1, icon: 'book-open' },
      { id: 'contact', label: 'Support', href: '/contact', enabled: true, order: 2, icon: 'mail' }
    ]
  },
  'full-site': {
    name: 'Full Site',
    description: 'Complete website with all content types enabled',
    siteMode: 'full',
    contentTypes: [
      { 
        id: 'blog', 
        name: 'Blog', 
        enabled: true, 
        route: '/blog', 
        icon: 'document-text', 
        order: 1,
        settings: {
          postsPerPage: 10,
          showExcerpts: true,
          enableComments: false
        }
      },
      { 
        id: 'projects', 
        name: 'Projects', 
        enabled: true, 
        route: '/projects', 
        icon: 'briefcase', 
        order: 2,
        settings: {
          showTechnologies: true,
          enableFiltering: true
        }
      },
      { 
        id: 'resume', 
        name: 'Resume', 
        enabled: true, 
        route: '/resume', 
        icon: 'user', 
        order: 3,
        settings: {
          showDownloadButton: true,
          pdfPath: '/resume.pdf'
        }
      },
      { 
        id: 'docs', 
        name: 'Documentation', 
        enabled: true, 
        route: '/docs', 
        icon: 'book-open', 
        order: 4,
        settings: {
          enableSearch: true,
          showTableOfContents: true
        }
      },
      { 
        id: 'contact', 
        name: 'Contact', 
        enabled: true, 
        route: '/contact', 
        icon: 'mail', 
        order: 5,
        settings: {
          enableForm: true,
          showSocialLinks: true
        }
      }
    ],
    navigation: [
      { id: 'home', label: 'Home', href: '/', enabled: true, order: 0, icon: 'home' },
      { id: 'blog', label: 'Blog', href: '/blog', enabled: true, order: 1, icon: 'document-text' },
      { id: 'projects', label: 'Projects', href: '/projects', enabled: true, order: 2, icon: 'briefcase' },
      { id: 'resume', label: 'Resume', href: '/resume', enabled: true, order: 3, icon: 'user' },
      { id: 'docs', label: 'Docs', href: '/docs', enabled: true, order: 4, icon: 'book-open' },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true, order: 5, icon: 'mail' }
    ]
  }
};
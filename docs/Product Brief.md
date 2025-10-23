# Product Brief: The "Flat-File SSG" Engine
## 1. Product Concept
A modern, high-performance static site generator (SSG) and "flat-file" content system. It transforms a simple directory of Markdown and YAML files into a complete, pre-rendered website, perfect for blogs, portfolios, resume sites, and documentation.
The system is designed to be fast (static-first), secure, and developer-friendly, while still supporting dynamic, interactive elements like contact forms through a serverless architecture.
## 2. Core Features
Flat-File CMS: All content is stored in human-readable Markdown (.md) files with YAML frontmatter. No database is required for content.
Static Site Generation: The entire site is pre-built into highly optimized HTML, CSS, and minimal JavaScript, ensuring maximum performance and security.
Component-Based Architecture: Pages can be built by composing reusable components (e.g., "Hero," "Featured Posts") defined in the YAML frontmatter.
Advanced Theming: Full support for system-wide theming, including automatic light and dark modes, using CSS Variables.
Modern Animations: Integrated support for smooth page transitions and interactive component-level animations.
Dynamic Form Handling: Securely manages interactive forms (like "Contact Me" or "Feedback") using serverless functions, without needing a traditional backend.
## 3. Recommended Technology Stack
Core Framework: Astro The ideal modern SSG for this project. It's content-focused, renders pure HTML, and uses an "Island Architecture" to load JavaScript only for interactive components.
Styling & Theming: Tailwind CSS A utility-first framework for rapid UI development. Theming (light/dark mode) is handled by "teaching" Tailwind to use CSS variables.
Interactivity ("Islands"): React, Svelte, or Vue Astro allows you to use your favorite component framework for interactive elements (like a form or a mobile menu) while the rest of the site remains static HTML.
Animations: Astro View Transitions & Framer Motion
View Transitions: Built into Astro for incredibly smooth, app-like animations between page loads.
Framer Motion: For complex, component-level animations within an interactive "island."
Form Backend: Serverless Functions
Functions: Cloudflare Workers, Azure Functions, Supabase Edge Functions, or Vercel Functions act as the secure middleman.
Database: Supabase (for an all-in-one solution with a database and functions) or Airtable (for simple "spreadsheet" data collection).
## 4. System Architecture
a) Static Site Generation (Read, Build, Render)
The "server" is a build-time process:
Read: The engine scans the content/ directory, reading all Markdown files and parsing their YAML frontmatter.
Build: It creates an in-memory "content map" of all pages, parses the Markdown into HTML, and identifies content relationships.
Render: It injects the parsed HTML and frontmatter data into the corresponding layout template (e.g., BlogPost.astro) and renders a final, static .html file for every page.
The final dist/ folder contains the entire pre-built site.
b) Secure Form Handling
Static sites cannot securely process forms. This architecture uses a serverless function as a secure proxy:
Frontend: A user submits a form on the static site. JavaScript bundles the form data into JSON.
API Call: The script POSTs the JSON to a secure API endpoint (e.g., /api/submit-form).
Serverless Function: This endpoint is a serverless function. It securely holds the private API keys for the database.
Data Storage: The function receives the JSON, validates it, and then securely sends the data to be saved in an Airtable or Supabase table.
Response: The function returns a "Success" message to the frontend, which displays it to the user.
c) Content Relationships
The system supports two types of content relationships:
Implicit Querying (Automatic): Used for "Recent Posts." A component (e.g., FeaturedPosts.astro) queries all files in /content/blog/, sorts them by date, and displays the top 3.
Explicit Linking (Curated): Used for "Featured Projects." A page's YAML frontmatter contains a list of slugs (e.g., projects: ['zetnote-app', 'my-api']). A component then uses a global "content map" to look up and render those specific projects.
## 5. Content Type Schemas (The "Flat-File" Model)
This defines the structure of the YAML frontmatter for each page type.
Blog Post
Template: BlogPost.astro
---
layout: 'BlogPost'
title: 'My First Post'
description: 'A short teaser for SEO.'
publicationDate: '2025-10-22'
featuredImage: '/images/blog/my-post-header.png'
tags:
  - 'Tech'
  - 'Tutorial'
---
Your article content in Markdown...


Project Page
Template: Project.astro
---
layout: 'Project'
projectName: 'ZetNote'
projectImage: '/images/projects/zetnote.png'
technologies:
  - 'React Native'
  - 'Supabase'
githubLink: 'https://github.com/user/zetnote'
---
The main description of the project...


Resume Page
Template: Resume.astro
---
layout: 'Resume'
title: 'My Professional Resume'
contact:
  email: 'my.email@server.com'
  linkedin: 'https://linkedin.com/in/me'

experience:
  - role: 'Senior Developer'
    company: 'Big Tech Inc.'
    dates: '2020 - Present'
    details: |
      - Led development of a new tool.
  - role: 'Junior Developer'
    company: 'Small Shop'
    dates: '2018 - 2020'
---
My professional summary...


Documentation Page
Template: Docs.astro
---
layout: 'Docs'
title: 'Installation'
group: 'Getting Started'
order: 2
---
To install, run `npm install...`


API Reference Page
Template: ApiReference.astro
---
layout: 'ApiReference'
title: 'GraphQL API Reference'
type: 'graphql' # or 'openapi'
schema_path: '/api/schema.graphql'
---
This page provides an interactive explorer...


Landing Page (Component-Based)
Template: Landing.astro
---
layout: 'Landing'
title: 'My Personal Portfolio & Blog'

sections:
  - component: 'hero'
    heading: 'Hi, I'm John Doe.'
    subheading: 'I build fast web applications.'
  
  - component: 'featured_posts'
    title: 'Latest From the Blog'
    count: 3 # This component will query for its own content
  
  - component: 'featured_projects'
    title: 'My Favorite Projects'
    projects: # This component receives explicit links
      - 'zetnote-app'
      - 'my-api-docs'
---


## 6. Deployment & Hosting Options
This architecture can be deployed for free or very low cost on any platform that supports static sites and Git-based deployments.
Cloudflare Pages: Excellent choice. Provides free static hosting on a global CDN and includes Cloudflare Workers for serverless functions.
Netlify: A popular all-in-one platform. Offers static hosting, Git-based CI/CD, and serverless functions (Netlify Functions).
Azure Static Web Apps: The seamless Microsoft ecosystem solution. Combines static hosting with integrated Azure Functions for the API.
Firebase Hosting: Google's solution. Provides fast static hosting on a global CDN, designed to be paired with Google Cloud Functions for backend tasks.
GitHub Pages: A free, simple option for static-only sites. For form handling, you would need to pair it with a serverless function hosted on a separate service (like Azure or Cloudflare).

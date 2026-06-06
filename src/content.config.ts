import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publicationDate: z.coerce.date(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    featured: z.boolean().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    projectName: z.string(),
    projectImage: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    githubLink: z.string().optional(),
    liveUrl: z.string().optional(),
    featured: z.boolean().optional(),
    createdAt: z.coerce.date().optional(),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    group: z.string(),
    order: z.number(),
    keywords: z.array(z.string()).optional(),
  }),
});

// Resume Collections
const resumePersonal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resumePersonal' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    order: z.number().default(1),
  }),
});

const resumeExperience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resumeExperience' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    achievements: z.array(z.string()).optional(),
    order: z.number().default(1),
  }),
});

const resumeEducation = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resumeEducation' }),
  schema: z.object({
    degree: z.string(),
    school: z.string(),
    location: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    gpa: z.string().optional(),
    details: z.string().optional(),
    order: z.number().default(1),
  }),
});

const resumeCertifications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resumeCertifications' }),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.coerce.date(),
    expirationDate: z.coerce.date().optional(),
    credentialId: z.string().optional(),
    url: z.string().optional(),
    order: z.number().default(1),
  }),
});

const resumeSkills = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resumeSkills' }),
  schema: z.object({
    category: z.string(),
    skills: z.array(z.string()),
    order: z.number().default(1),
  }),
});

const resumeLanguages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resumeLanguages' }),
  schema: z.object({
    name: z.string(),
    proficiency: z.string(),
    order: z.number().default(1),
  }),
});

const resumeProjects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resumeProjects' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    url: z.string().optional(),
    githubUrl: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    order: z.number().default(1),
  }),
});

export const collections = {
  blog,
  projects,
  docs,
  resumePersonal,
  resumeExperience,
  resumeEducation,
  resumeCertifications,
  resumeSkills,
  resumeLanguages,
  resumeProjects,
};

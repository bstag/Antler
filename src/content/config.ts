import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publicationDate: z.coerce.date(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    featured: z.boolean().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    group: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  blog,
  projects,
  docs,
};
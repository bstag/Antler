---
title: "Adding Content Types"
description: "How to add new content types and extend the MdCms system"
group: "Advanced"
order: 1
---

# Adding Content Types

MdCms is designed to be extensible. You can easily add new content types to suit your specific needs, whether it's for testimonials, team members, products, or any other structured content.

## Understanding Content Collections

Content collections in Astro are defined in `src/content/config.ts`. Each collection represents a different type of content with its own schema, validation rules, and structure.

### Basic Collection Structure

```typescript
import { defineCollection, z } from 'astro:content';

const newCollection = defineCollection({
  type: 'content',        // or 'data' for JSON/YAML files
  schema: z.object({
    // Define your fields here
  }),
});

export const collections = {
  blog,
  projects,
  docs,
  newCollection,  // Add your new collection
};
```

## Step-by-Step Guide

### 1. Define the Schema

First, decide what fields your new content type needs. Let's create a "testimonials" collection as an example:

```typescript
// src/content/config.ts
const testimonials = defineCollection({
  type: 'content',
  schema: z.object({
    clientName: z.string(),
    clientTitle: z.string(),
    clientCompany: z.string(),
    clientImage: z.string().optional(),
    rating: z.number().min(1).max(5),
    featured: z.boolean().default(false),
    projectType: z.string().optional(),
    testimonialDate: z.coerce.date(),
  }),
});
```

### 2. Create the Directory

Create a new directory in `src/content/` for your collection:

```bash
mkdir src/content/testimonials
```

### 3. Add to Collections Export

Update the collections export in `src/content/config.ts`:

```typescript
export const collections = {
  blog,
  projects,
  docs,
  testimonials,  // Add your new collection
};
```

### 4. Create Content Files

Create your first content file in the new directory:

```markdown
<!-- src/content/testimonials/john-doe-testimonial.md -->
---
clientName: "John Doe"
clientTitle: "CTO"
clientCompany: "Tech Innovations Inc."
clientImage: "/images/testimonials/john-doe.jpg"
rating: 5
featured: true
projectType: "Web Development"
testimonialDate: 2024-01-15
---

# Outstanding Web Development Service

Working with this team was an absolute pleasure. They delivered a high-quality website that exceeded our expectations. The attention to detail and professional communication throughout the project was remarkable.

The final product not only looks great but performs exceptionally well. Our conversion rates have increased by 40% since the launch.
```

### 5. Sync Content Collections

Run Astro sync to generate TypeScript types:

```bash
npx astro sync
```

## Real-World Examples

### Team Members Collection

```typescript
const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    position: z.string(),
    department: z.string(),
    bio: z.string(),
    avatar: z.string(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    skills: z.array(z.string()),
    joinDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});
```

Example content file:

```markdown
---
name: "Sarah Johnson"
position: "Senior Developer"
department: "Engineering"
bio: "Full-stack developer with 8 years of experience in React and Node.js"
avatar: "/images/team/sarah-johnson.jpg"
email: "sarah@company.com"
linkedin: "https://linkedin.com/in/sarahjohnson"
skills: ["React", "TypeScript", "Node.js", "GraphQL"]
joinDate: 2022-03-15
featured: true
---

# Sarah Johnson

Sarah is a passionate full-stack developer who loves creating efficient and scalable web applications. She leads our frontend architecture decisions and mentors junior developers.

## Experience

- 8+ years in web development
- Expert in React ecosystem
- Strong background in API design
```

### Products Collection

```typescript
const products = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    currency: z.string().default('USD'),
    category: z.string(),
    images: z.array(z.string()),
    features: z.array(z.string()),
    specifications: z.record(z.string()),
    inStock: z.boolean().default(true),
    featured: z.boolean().default(false),
    releaseDate: z.coerce.date(),
  }),
});
```

### Events Collection

```typescript
const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eventDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    venue: z.string().optional(),
    eventType: z.enum(['conference', 'workshop', 'meetup', 'webinar']),
    price: z.number().min(0).optional(),
    maxAttendees: z.number().positive().optional(),
    registrationUrl: z.string().url().optional(),
    speakers: z.array(z.object({
      name: z.string(),
      bio: z.string(),
      image: z.string().optional(),
    })).optional(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});
```

## Using New Collections in Components

### Fetching Collection Data

```typescript
// In an Astro component
---
import { getCollection } from 'astro:content';

// Get all testimonials
const testimonials = await getCollection('testimonials');

// Get featured testimonials only
const featuredTestimonials = await getCollection('testimonials', ({ data }) => {
  return data.featured === true;
});

// Sort by date
const sortedTestimonials = testimonials.sort((a, b) => 
  b.data.testimonialDate.valueOf() - a.data.testimonialDate.valueOf()
);
---

<section class="testimonials">
  {featuredTestimonials.map((testimonial) => (
    <div class="testimonial-card">
      <h3>{testimonial.data.clientName}</h3>
      <p>{testimonial.data.clientTitle} at {testimonial.data.clientCompany}</p>
      <div class="rating">
        {Array.from({ length: testimonial.data.rating }, (_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>
      <div set:html={testimonial.body} />
    </div>
  ))}
</section>
```

### Creating Dynamic Pages

Create dynamic pages for your new collection:

```typescript
// src/pages/testimonials/[slug].astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const testimonials = await getCollection('testimonials');
  return testimonials.map((testimonial) => ({
    params: { slug: testimonial.slug },
    props: { testimonial },
  }));
}

const { testimonial } = Astro.props;
const { Content } = await testimonial.render();
---

<BaseLayout title={`Testimonial from ${testimonial.data.clientName}`}>
  <article>
    <header>
      <h1>{testimonial.data.clientName}</h1>
      <p>{testimonial.data.clientTitle} at {testimonial.data.clientCompany}</p>
      <div class="rating">
        {Array.from({ length: testimonial.data.rating }, (_, i) => (
          <span>⭐</span>
        ))}
      </div>
    </header>
    
    <Content />
    
    {testimonial.data.projectType && (
      <footer>
        <p>Project Type: {testimonial.data.projectType}</p>
      </footer>
    )}
  </article>
</BaseLayout>
```

## Advanced Schema Patterns

### Nested Objects

```typescript
const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.object({
      name: z.string(),
      industry: z.string(),
      website: z.string().url().optional(),
    }),
    project: z.object({
      duration: z.string(),
      team: z.array(z.string()),
      budget: z.string().optional(),
      technologies: z.array(z.string()),
    }),
    results: z.object({
      metrics: z.record(z.string()),
      testimonial: z.string().optional(),
    }).optional(),
  }),
});
```

### Discriminated Unions

```typescript
const content = defineCollection({
  type: 'content',
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('article'),
      title: z.string(),
      author: z.string(),
      readingTime: z.number(),
    }),
    z.object({
      type: z.literal('video'),
      title: z.string(),
      duration: z.number(),
      videoUrl: z.string().url(),
    }),
    z.object({
      type: z.literal('podcast'),
      title: z.string(),
      duration: z.number(),
      audioUrl: z.string().url(),
      transcript: z.string().optional(),
    }),
  ]),
});
```

### References Between Collections

```typescript
// Create relationships between collections
const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authorId: z.string(), // Reference to authors collection
    coAuthors: z.array(z.string()).optional(),
  }),
});
```

## Data Collections vs Content Collections

### When to Use Data Collections

Use `type: 'data'` for structured data without markdown content:

```typescript
const settings = defineCollection({
  type: 'data',
  schema: z.object({
    siteName: z.string(),
    siteUrl: z.string().url(),
    socialMedia: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    }),
    features: z.array(z.object({
      name: z.string(),
      enabled: z.boolean(),
    })),
  }),
});
```

Data files use JSON or YAML:

```json
// src/content/settings/site.json
{
  "siteName": "My Awesome Site",
  "siteUrl": "https://mysite.com",
  "socialMedia": {
    "twitter": "@mysite",
    "github": "myusername"
  },
  "features": [
    { "name": "darkMode", "enabled": true },
    { "name": "comments", "enabled": false }
  ]
}
```

## Best Practices

### 1. Schema Design

- **Start Simple**: Begin with basic fields and add complexity as needed
- **Use Validation**: Add appropriate validation rules for data integrity
- **Default Values**: Provide sensible defaults for optional fields
- **Clear Naming**: Use descriptive field names that indicate their purpose

### 2. File Organization

```
src/content/
├── blog/
├── projects/
├── testimonials/
│   ├── client-a-testimonial.md
│   ├── client-b-testimonial.md
│   └── client-c-testimonial.md
├── team/
│   ├── john-doe.md
│   ├── jane-smith.md
│   └── bob-johnson.md
└── config.ts
```

### 3. Content Relationships

When creating relationships between collections:

```typescript
// Use consistent ID patterns
const authors = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authorId: z.string(), // References authors.id
  }),
});
```

### 4. Migration Strategy

When adding new collections to existing sites:

1. **Plan the Schema**: Design the complete schema before implementation
2. **Create Sample Content**: Test with a few sample files first
3. **Update Components**: Create or update components to display the new content
4. **Add Navigation**: Update site navigation to include new content types
5. **Test Thoroughly**: Ensure all functionality works before going live

## Troubleshooting

### Common Issues

1. **Schema Validation Errors**
   ```
   Error: Content does not match collection schema
   ```
   - Check that all required fields are present
   - Verify field types match the schema definition
   - Ensure proper frontmatter formatting

2. **TypeScript Errors**
   ```
   Property 'newField' does not exist
   ```
   - Run `npx astro sync` after schema changes
   - Restart your TypeScript language server
   - Check that the field exists in your schema

3. **Build Failures**
   ```
   Collection 'newCollection' not found
   ```
   - Ensure the collection is exported in `config.ts`
   - Check that the directory exists in `src/content/`
   - Verify collection name matches exactly

### Debugging Tips

1. **Use Astro Dev Tools**: Enable verbose logging to see detailed error messages
2. **Validate Schema**: Test your schema with sample data before creating content
3. **Check File Paths**: Ensure all referenced images and files exist
4. **Review Frontmatter**: Use a YAML validator to check frontmatter syntax
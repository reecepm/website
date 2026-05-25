import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
  }),
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiments' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    github: z.string().optional(),
    period: z.string().optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateRange: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    url: z.string().optional(),
    order: z.number(),
  }),
});

const socials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/socials' }),
  schema: z.object({
    name: z.string(),
    url: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    location: z.string(),
    focus: z.string(),
    bio: z.string(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, experiments, experience, socials, profile, site };

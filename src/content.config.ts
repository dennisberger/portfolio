import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    slug: z.string(),
    tag: z.string(),
    title: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    stats: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    order: z.number(),
    flagship: z.boolean().default(false),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    lede: z.string().optional(),
  }),
});

export const collections = { caseStudies };

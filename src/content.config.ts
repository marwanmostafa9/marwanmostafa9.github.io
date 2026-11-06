import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { FIELD_IDS } from './config/fields';

// One folder per project: src/content/projects/<slug>/index.md
// Images and videos in the same folder are picked up automatically (see src/lib/media.ts).
const projects = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    field: z.enum(FIELD_IDS),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    // Headline numbers shown on the project page, e.g. { value: '94%', label: 'accuracy' }
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    // Optional captions for gallery files, keyed by file name: { '02-results.png': 'Test-set results' }
    captions: z.record(z.string()).default({}),
    links: z
      .object({
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        demo: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
  }),
});

// All certificates live in one file: src/content/certificates/certificates.yaml
// Their images sit next to it (see src/lib/certificates.ts).
const certificates = defineCollection({
  loader: file('src/content/certificates/certificates.yaml'),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    shelf: z.enum(['course', 'recognition']),
    date: z
      .string()
      .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
      .optional(),
    image: z.string(),
    note: z.string().optional(),
    accent: z.string().default('#a78bfa'),
    url: z.string().url().optional(),
  }),
});

export const collections = { projects, certificates };

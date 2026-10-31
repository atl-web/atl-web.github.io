import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const teachers = defineCollection({
  loader: file('src/content/teachers.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    rank: z.string(),
    photo: z.string(),
    w: z.number().int(),
    h: z.number().int(),
    isHead: z.boolean().default(false),
  }),
});

const courses = defineCollection({
  loader: file('src/content/courses.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    days: z.array(z.enum(['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'])),
    start: z.string(),
    end: z.string(),
    teachers: z.array(z.string()),
  }),
});

const materials = defineCollection({
  loader: file('src/content/material.json'),
  schema: z.object({
    id: z.string(),
    group: z.enum(['examenes', 'formas', 'traducciones']),
    section: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    w: z.number().int(),
    h: z.number().int(),
    href: z.string(),
    external: z.boolean().default(false),
  }),
});

export const collections = { teachers, courses, materials };

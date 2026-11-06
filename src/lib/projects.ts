import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { FIELDS, type FieldId } from '../config/fields';

type Project = CollectionEntry<'projects'>;

// Featured projects first, then newest first.
export async function getProjects() {
  return (await getCollection('projects')).sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/** Exhibit numbers in the order the work was made: the oldest project is 001. */
export function exhibitNumbers(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  return Object.fromEntries(sorted.map((p, i) => [p.id, String(i + 1).padStart(3, '0')]));
}

/** One wing per field that has projects: biggest wing first (ties follow src/config/fields.ts), lettered A, B, C… */
export async function getWings() {
  const projects = await getProjects();
  const numbers = exhibitNumbers(projects);
  const wings = (Object.keys(FIELDS) as FieldId[])
    .map((id) => ({ id, ...FIELDS[id], projects: projects.filter((p) => p.data.field === id) }))
    .filter((w) => w.projects.length > 0)
    .sort((a, b) => b.projects.length - a.projects.length)
    .map((w, i) => ({ ...w, letter: String.fromCharCode(65 + i) }));
  const years = projects.map((p) => p.data.date.getFullYear());
  return { wings, numbers, projects, from: Math.min(...years), to: Math.max(...years) };
}

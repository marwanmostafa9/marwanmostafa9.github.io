import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/certificates/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP}',
  { eager: true },
);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2025-06-15' → 'Jun 2025', '2024' → '2024', undefined → '' */
export function formatCertDate(date?: string) {
  if (!date) return '';
  const [y, m] = date.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

/** Certificates in the order they appear in certificates.yaml, with their image resolved. */
export async function getCertificates() {
  const entries = await getCollection('certificates');
  return entries.map((c) => {
    const mod = images[`/src/content/certificates/${c.data.image}`];
    if (!mod) throw new Error(`Certificate "${c.id}": image "${c.data.image}" not found in src/content/certificates/`);
    return { id: c.id, ...c.data, img: mod.default, when: formatCertDate(c.data.date) };
  });
}

export type Certificate = Awaited<ReturnType<typeof getCertificates>>[number];

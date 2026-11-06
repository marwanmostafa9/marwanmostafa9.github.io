// Finds the images and videos inside each project's folder.
// cover.svg or cover.<image> -> card + page header. Everything else -> gallery, sorted by file name.
import type { ImageMetadata } from 'astro';

const ROOT = '/src/content/projects/';

const imageFiles = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/projects/*/*.{png,jpg,jpeg,webp,avif,gif,PNG,JPG,JPEG,WEBP}',
  { eager: true },
);
const videoFiles = import.meta.glob<string>('/src/content/projects/*/*.{mp4,webm,MP4,WEBM}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// A hand-made cover.svg is inlined, so it can use the site's fonts and colors
const svgCovers = import.meta.glob<string>('/src/content/projects/*/cover.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export type MediaItem =
  | { kind: 'image'; name: string; image: ImageMetadata }
  | { kind: 'video'; name: string; src: string };

function inFolder<T>(files: Record<string, T>, slug: string) {
  const prefix = `${ROOT}${slug}/`;
  return Object.entries(files)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, mod]) => ({ name: path.slice(prefix.length), mod }));
}

const isCover = (name: string) => /^cover\./i.test(name);

export function projectMedia(slug: string) {
  const images = inFolder(imageFiles, slug);
  const cover = images.find((f) => isCover(f.name))?.mod.default;
  const gallery: MediaItem[] = [
    ...images
      .filter((f) => !isCover(f.name))
      .map((f) => ({ kind: 'image' as const, name: f.name, image: f.mod.default })),
    ...inFolder(videoFiles, slug).map((f) => ({ kind: 'video' as const, name: f.name, src: f.mod })),
  ].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  return { cover, coverSvg: svgCovers[`${ROOT}${slug}/cover.svg`], gallery };
}

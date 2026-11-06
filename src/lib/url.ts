// Prefixes internal links with the deploy base path, so the site works on any repo name.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (path: string) => `${base}${path}`;

// Each field becomes one glowing cluster in the galaxy.
// To add a new field, add a line here and use its id in a project's `field:`.
// `motif` picks the style of the auto-generated cover for projects without an image.
export const FIELDS = {
  vision: { label: 'Computer Vision', color: '#38bdf8', motif: 'vision' },
  llm: { label: 'LLMs & RAG', color: '#a78bfa', motif: 'llm' },
  agents: { label: 'AI Agents', color: '#34d399', motif: 'agents' },
  speech: { label: 'Speech & Audio', color: '#f472b6', motif: 'speech' },
  ml: { label: 'Data Science & ML', color: '#fbbf24', motif: 'ml' },
  genai: { label: 'Generative AI', color: '#fb923c', motif: 'genai' },
} as const;

export type FieldId = keyof typeof FIELDS;
export type Motif = (typeof FIELDS)[FieldId]['motif'];
export const FIELD_IDS = Object.keys(FIELDS) as [FieldId, ...FieldId[]];

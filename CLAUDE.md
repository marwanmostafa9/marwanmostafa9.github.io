# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Marwan Mostafa's personal portfolio: a static Astro site styled as a museum of his work. Live at https://marwanmostafa9.github.io (repo `marwanmostafa9/marwanmostafa9.github.io`).

## Commands

```bash
npm run dev       # dev server (vite allowedHosts permits *.ngrok-free.app / *.ngrok.app tunnels)
npm run build     # static build to dist/, also validates all content frontmatter against the schemas
npm run preview   # serve dist/
```

There are no tests or linter. `npm run build` is the check: schema errors and missing certificate images fail it.

- Astro is pinned to `~5.7.14` because local Node is 18.19.1 (Astro ≥5.8 needs Node ≥18.20.8). Do not bump it unless Node is upgraded. CI uses Node 22.
- After editing `src/config/fields.ts`, restart `astro dev`: the content schema is cached and new field ids fail validation until restart.
- Deploy: every push to `main` builds and publishes via `.github/workflows/deploy.yml`. No `gh` CLI locally.

## Architecture

Single homepage (`src/pages/index.astro`) composed of sections in order: `Entrance` (hero) → `Exhibition` (projects grouped into wings) → `CertificateShelf` ("Hall of Honors") → `Contact` ("Front Desk"). Each project also gets its own page at `src/pages/projects/[slug].astro`. Components are plain `.astro` with inline `<script>` for interactivity; no UI framework, no Three.js (the earlier 3D galaxy was removed).

**Content collections** (`src/content.config.ts`):
- `projects`: one folder per project, `src/content/projects/<slug>/index.md`. The folder name is the slug. Frontmatter: `title`, `date`, `field`, `summary`, `tags`, `metrics` (`{value, label}` stat boxes), `captions` (keyed by gallery file name), `links` (`github`/`linkedin`/`demo`), `featured`.
- `certificates`: all entries in one file, `src/content/certificates/certificates.yaml`, with images next to it. File order = shelf order. `shelf: course | recognition`.

**Fields drive the layout.** `src/config/fields.ts` defines each field's label, color, and cover motif. `getWings()` in `src/lib/projects.ts` builds one wing per field that has projects, biggest wing first, lettered A, B, C. Exhibit numbers (`001`, `002`…) are assigned oldest-first by `date`. Project order (featured first, then newest) drives prev/next links on project pages.

**Project media is discovered by file name**, not declared (`src/lib/media.ts` via `import.meta.glob`):
- `cover.svg` → inlined raw HTML (so it can use site fonts). Prefix every `id` inside it with a per-project prefix (e.g. `fb-bg`) to avoid collisions when several covers are inlined on one page. Convention: 800×450, dark background, field color, mono tag top-left.
- `cover.<png|jpg|…>` → optimized image cover.
- No cover → `src/lib/covers.ts` generates a deterministic SVG from the field's motif, seeded by the slug (`src/lib/random.ts`).
- Every other image/video in the folder → gallery, sorted by file name with numeric ordering (`01.png`, `02.png`…).

**Internal links** must go through `href()` from `src/lib/url.ts` so they respect the deploy base path.

**Site identity** (name, role, tagline, socials, phone) lives in `src/config/site.ts`.

**CV chat** ("Ask about Marwan", `src/components/CvChat.astro`, mounted in `Base.astro`): a floating widget that streams answers from `chat-worker/`, a separate Cloudflare Worker (not part of the Astro build) that holds the Groq key as a secret and puts the CV text in the system prompt. The widget renders only when `SITE.chatEndpoint` is set. The worker's knowledge file `chat-worker/src/cv.txt` is generated from the CV PDF by `chat-worker/build-knowledge.sh` and is gitignored. Deploy steps: `chat-worker/README.md`.

## Content workflow

- `_inbox/` is a gitignored drop zone: `_inbox/projects/<project-name>/` and `_inbox/certificates/`. Move files to their final place (`src/content/projects/<slug>/` or `src/content/certificates/`) and empty the inbox afterward.
- When the user supplies a LinkedIn post for a project, restructure it (problem → what I built → how it's built → results) rather than pasting it raw. If no date is given, infer it and say it is a guess.
- Copy and headings center Marwan and his work, never "AI" generically.
- `cv/` and root-level `*.pdf` are the private CV and are gitignored. Never publish them.

// Generates an SVG cover for projects that have no image.
// The style comes from the project's field; the details come from its title and slug,
// so every cover is unique and always looks the same between builds.
import { FIELDS, type FieldId, type Motif } from '../config/fields';
import { hashString, mulberry32, gauss } from './random';

const W = 800;
const H = 450;
const MONO = `font-family="JetBrains Mono, ui-monospace, monospace"`;
const CHAR_W = 0.6; // JetBrains Mono advance width, in em

type Rnd = () => number;
interface Ctx {
  r: Rnd;
  c: string;
  id: string;
  title: string;
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);
const n = (v: number) => v.toFixed(1);
const between = (r: Rnd, a: number, b: number) => a + r() * (b - a);

// Split a title into WordPiece-style tokens: "Assistant" -> "Assis", "##tant"
function tokenize(title: string) {
  const words = title.match(/[A-Za-z0-9]+|[^\sA-Za-z0-9]/g) ?? [];
  const tokens: string[] = [];
  for (const w of words) {
    for (let i = 0; i < w.length; i += 5) tokens.push((i ? '##' : '') + w.slice(i, i + 5));
  }
  return ['[CLS]', ...tokens, '[SEP]'];
}

function vision({ r, c, id }: Ctx) {
  let s = `<rect width="${W}" height="${H}" fill="url(#${id}-scan)"/>`;
  const classes = ['object', 'face', 'person', 'eye', 'iris', 'hand', 'item'];
  for (let k = 0; k < 3; k++) {
    const w = between(r, 130, 200);
    const h = between(r, 120, 210);
    const x = 40 + k * (W - 80) / 3 + between(r, 0, (W - 80) / 3 - w);
    const y = between(r, 90, H - h - 50);
    const cx = x + w / 2;
    const cy = y + h / 2;
    s += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(w * 0.38)}" ry="${n(h * 0.4)}" fill="${c}" opacity=".28" filter="url(#${id}-blur)"/>`;
    s += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(w * 0.16)}" ry="${n(h * 0.18)}" fill="#fff" opacity=".18" filter="url(#${id}-blur)"/>`;
    s += `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="none" stroke="${c}" stroke-opacity=".7" stroke-width="1.5"/>`;
    const L = 18;
    const corners = [
      [x, y, 1, 1],
      [x + w, y, -1, 1],
      [x, y + h, 1, -1],
      [x + w, y + h, -1, -1],
    ];
    for (const [px, py, dx, dy] of corners) {
      s += `<path d="M${n(px + dx * L)} ${n(py)}H${n(px)}V${n(py + dy * L)}" fill="none" stroke="${c}" stroke-width="3.5"/>`;
    }
    const label = `${classes[Math.floor(r() * classes.length)]} ${between(r, 0.82, 0.99).toFixed(2)}`;
    const lw = label.length * 15 * CHAR_W + 14;
    s += `<rect x="${n(x - 0.75)}" y="${n(y - 26)}" width="${n(lw)}" height="26" fill="${c}"/>`;
    s += `<text x="${n(x + 7)}" y="${n(y - 8)}" ${MONO} font-size="15" fill="#070912" font-weight="700">${label}</text>`;
    if (k === 1) {
      s += `<g stroke="#fff" stroke-opacity=".7" stroke-width="1.2"><circle cx="${n(cx)}" cy="${n(cy)}" r="7" fill="none"/>`;
      s += `<path d="M${n(cx - 18)} ${n(cy)}h10M${n(cx + 8)} ${n(cy)}h10M${n(cx)} ${n(cy - 18)}v10M${n(cx)} ${n(cy + 8)}v10"/></g>`;
    }
  }
  return s;
}

function llm({ r, c, title }: Ctx) {
  let s = '';
  const tokens = tokenize(title);
  // Largest font that fits every token on one row (min 12px)
  const chars = tokens.reduce((a, t) => a + t.length, 0);
  const fs = Math.max(12, Math.min(24, (W - 80 - tokens.length * 32) / (chars * CHAR_W)));
  const y = 300;
  const boxes: { x: number; w: number }[] = [];
  let x = 40;
  for (const t of tokens) {
    const w = t.length * fs * CHAR_W + 22;
    if (x + w > W - 40) break;
    boxes.push({ x, w });
    s += `<rect x="${n(x)}" y="${y}" width="${n(w)}" height="${n(fs * 2.4)}" rx="9" fill="${c}" fill-opacity="${between(r, 0.08, 0.3).toFixed(2)}" stroke="${c}" stroke-opacity=".55"/>`;
    s += `<text x="${n(x + w / 2)}" y="${n(y + fs * 1.6)}" ${MONO} font-size="${n(fs)}" fill="#fff" fill-opacity=".85" text-anchor="middle">${esc(t)}</text>`;
    x += w + 10;
  }
  // Attention arcs from one focus token to the rest
  const focus = 1 + Math.floor(r() * Math.max(1, boxes.length - 2));
  const fx = boxes[focus].x + boxes[focus].w / 2;
  boxes.forEach((b, i) => {
    if (i === focus) return;
    const bx = b.x + b.w / 2;
    const weight = Math.pow(r(), 2);
    const lift = Math.min(200, 40 + Math.abs(bx - fx) * 0.45);
    s += `<path d="M${n(fx)} ${y - 4}Q${n((fx + bx) / 2)} ${n(y - 4 - lift)} ${n(bx)} ${y - 4}" fill="none" stroke="${c}" stroke-width="${n(1 + weight * 3)}" stroke-opacity="${(0.15 + weight * 0.8).toFixed(2)}"/>`;
  });
  s += `<rect x="${n(boxes[focus].x)}" y="${y}" width="${n(boxes[focus].w)}" height="${n(fs * 2.4)}" rx="9" fill="none" stroke="#fff" stroke-width="2"/>`;
  // Attention matrix
  const m = Math.min(8, boxes.length);
  const cell = 17;
  const ox = W - m * (cell + 2) - 40;
  const oy = 60;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      const op = Math.min(1, 0.06 + Math.pow(r(), 3) * 0.7 + (i === j ? 0.35 : 0));
      s += `<rect x="${ox + j * (cell + 2)}" y="${oy + i * (cell + 2)}" width="${cell}" height="${cell}" rx="2" fill="${c}" fill-opacity="${op.toFixed(2)}"/>`;
    }
  }
  s += `<text x="${ox}" y="${oy + m * (cell + 2) + 22}" ${MONO} font-size="14" fill="#fff" fill-opacity=".4">attn[h=${Math.floor(r() * 12)}]</text>`;
  return s;
}

function agents({ r, c, id }: Ctx) {
  let s = '';
  const names = ['plan', 'llm', 'tool', 'memory', 'sql', 'search', 'router', 'api', 'eval', 'retrieve'];
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  const cx = W * 0.47;
  const cy = H * 0.52;
  const count = 7;
  const nodes = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + between(r, -0.25, 0.25);
    const rad = between(r, 120, 165);
    return { x: cx + Math.cos(a) * rad * 1.75, y: cy + Math.sin(a) * rad * 0.95, name: names[i] };
  });
  nodes.forEach((p, i) => {
    const q = nodes[(i + 1) % count];
    s += `<line x1="${n(p.x)}" y1="${n(p.y)}" x2="${n(q.x)}" y2="${n(q.y)}" stroke="${c}" stroke-opacity=".14"/>`;
    s += `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(p.x)}" y2="${n(p.y)}" stroke="${c}" stroke-opacity=".32"/>`;
  });
  const a = Math.floor(r() * count);
  const b = (a + 1) % count;
  s += `<path d="M${n(cx)} ${n(cy)}L${n(nodes[a].x)} ${n(nodes[a].y)}L${n(nodes[b].x)} ${n(nodes[b].y)}" fill="none" stroke="${c}" stroke-width="2.5" stroke-dasharray="7 6" filter="url(#${id}-glow)"/>`;
  for (const p of nodes) {
    s += `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="15" fill="#0b0e1c" stroke="${c}" stroke-width="2"/>`;
    s += `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="4" fill="${c}"/>`;
    s += `<text x="${n(p.x)}" y="${n(p.y + 36)}" ${MONO} font-size="17" fill="${c}" fill-opacity=".9" text-anchor="middle">${p.name}</text>`;
  }
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="48" fill="none" stroke="${c}" stroke-opacity=".2"/>`;
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="30" fill="${c}" fill-opacity=".15" stroke="${c}" stroke-width="2.5" filter="url(#${id}-glow)"/>`;
  s += `<text x="${n(cx)}" y="${n(cy + 5)}" ${MONO} font-size="14" fill="#fff" text-anchor="middle" font-weight="700">agent</text>`;
  return s;
}

function speech({ r, c, title }: Ctx) {
  let s = '';
  const bumps = Array.from({ length: 4 }, () => ({ at: between(r, 0.05, 0.95), w: between(r, 0.06, 0.16) }));
  const bars = 92;
  const x0 = 40;
  const step = (W - 80) / bars;
  const mid = 205;
  const f1 = between(r, 0.2, 0.5);
  for (let i = 0; i < bars; i++) {
    const t = i / bars;
    const env = 0.12 + bumps.reduce((acc, b) => acc + Math.exp(-((t - b.at) ** 2) / (2 * b.w * b.w)), 0);
    const h = Math.min(1, env) * (0.45 + 0.55 * Math.abs(Math.sin(i * f1)) * r()) * 150;
    s += `<rect x="${n(x0 + i * step)}" y="${n(mid - h / 2)}" width="${n(step * 0.55)}" height="${n(Math.max(2, h))}" rx="1.5" fill="${c}" fill-opacity="${(0.3 + 0.7 * (h / 150)).toFixed(2)}"/>`;
  }
  // Diarization timeline: who spoke when
  let x = x0;
  let spk = 0;
  while (x < W - 40) {
    const w = Math.min(between(r, 60, 170), W - 40 - x);
    s += `<rect x="${n(x)}" y="330" width="${n(w - 4)}" height="10" rx="5" fill="${spk ? '#fff' : c}" fill-opacity="${spk ? '.55' : '.9'}"/>`;
    if (w > 80) s += `<text x="${n(x)}" y="368" ${MONO} font-size="15" fill="#fff" fill-opacity=".5">SPK_${spk}</text>`;
    x += w;
    spk = 1 - spk;
  }
  s += `<text x="${x0}" y="${mid - 105}" ${MONO} font-size="17" fill="#fff" fill-opacity=".55">&gt; transcribing… "${esc(title.toLowerCase())}"</text>`;
  return s;
}

function ml({ r, c }: Ctx) {
  let s = '';
  const ax = 70;
  const ay = H - 60;
  s += `<path d="M${ax} 70V${ay}H${W - 50}" fill="none" stroke="#fff" stroke-opacity=".25"/>`;
  const shades = [
    [c, 0.9],
    ['#ffffff', 0.6],
    [c, 0.45],
  ] as const;
  shades.forEach(([color, op], k) => {
    const cx = 160 + k * 200 + between(r, -30, 30);
    const cy = between(r, 150, 300);
    for (let i = 0; i < 38; i++) {
      s += `<circle cx="${n(cx + gauss(r) * 42)}" cy="${n(cy + gauss(r) * 34)}" r="3.6" fill="${color}" fill-opacity="${op}"/>`;
    }
  });
  s += `<path d="M${ax + 20} ${n(between(r, 90, 160))}C${n(260)} ${n(between(r, 250, 400))} ${n(460)} ${n(between(r, 60, 180))} ${W - 60} ${n(between(r, 280, 380))}" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="8 6"/>`;
  // Inset loss curve
  const lx = W - 230;
  const ly = 56;
  let d = '';
  for (let i = 0; i <= 40; i++) {
    const v = Math.exp(-i / 9) * 70 + r() * 6;
    d += `${i ? 'L' : 'M'}${n(lx + i * 4.5)} ${n(ly + 80 - v)}`;
  }
  s += `<rect x="${lx - 12}" y="${ly - 14}" width="210" height="112" rx="8" fill="#0b0e1c" fill-opacity=".8" stroke="#fff" stroke-opacity=".1"/>`;
  s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="2"/>`;
  s += `<text x="${lx}" y="${ly + 4}" ${MONO} font-size="14" fill="#fff" fill-opacity=".5">loss</text>`;
  return s;
}

// Diffusion: a strip of tiles going from pure noise to a clean image
function genai({ r, c }: Ctx) {
  let s = '';
  const steps = 5;
  const px = 12;
  const size = 10;
  const tile = px * size;
  const gap = (W - 80 - steps * tile) / (steps - 1);
  const sunX = between(r, 2.5, 7.5);
  const sunY = between(r, 2, 4);
  // Target image: a sun over rolling hills, as brightness per pixel
  const target = (x: number, y: number) => {
    const hill = 6.5 + Math.sin(x * 0.7 + sunX) * 1.2;
    if (y > hill) return 0.55;
    return Math.hypot(x - sunX, y - sunY) < 1.8 ? 1 : 0.12;
  };
  for (let k = 0; k < steps; k++) {
    const noise = 1 - k / (steps - 1);
    const ox = 40 + k * (tile + gap);
    const oy = 150;
    s += `<rect x="${n(ox - 1)}" y="${oy - 1}" width="${tile + 2}" height="${tile + 2}" rx="6" fill="none" stroke="${c}" stroke-opacity="${k === steps - 1 ? 0.9 : 0.3}"/>`;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const v = target(x, y) * (1 - noise) + r() * noise;
        s += `<rect x="${n(ox + x * px)}" y="${oy + y * px}" width="${px}" height="${px}" fill="${c}" fill-opacity="${(0.08 + v * 0.85).toFixed(2)}"/>`;
      }
    }
    s += `<text x="${n(ox + tile / 2)}" y="${oy + tile + 28}" ${MONO} font-size="14" fill="#fff" fill-opacity=".45" text-anchor="middle">t=${Math.round(noise * 1000)}</text>`;
  }
  return s;
}

const MOTIFS: Record<Motif, (ctx: Ctx) => string> = { vision, llm, agents, speech, ml, genai };

export function coverSvg(opts: { slug: string; field: FieldId; title: string }) {
  const field = FIELDS[opts.field];
  const seed = hashString(opts.slug);
  const r = mulberry32(seed);
  const id = `cv-${opts.slug.replace(/[^a-z0-9-]/gi, '')}`;
  const c = field.color;
  const gx = between(r, 0.25, 0.75).toFixed(2);
  const gy = between(r, 0.3, 0.7).toFixed(2);
  const body = MOTIFS[field.motif]({ r, c, id, title: opts.title });
  const tag = field.label.toLowerCase().replace(/[^a-z]+/g, '_');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration for ${esc(opts.title)}">
<defs>
<radialGradient id="${id}-bg" cx="${gx}" cy="${gy}" r=".75"><stop offset="0" stop-color="${c}" stop-opacity=".3"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="${id}-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<pattern id="${id}-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#fff" fill-opacity=".08"/></pattern>
<pattern id="${id}-scan" width="6" height="6" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="6" y2="0" stroke="${c}" stroke-opacity=".09"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="#070912"/>
<rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
<rect width="${W}" height="${H}" fill="url(#${id}-dots)"/>
${body}
<text x="28" y="40" ${MONO} font-size="18" fill="${c}" fill-opacity=".85">// ${tag}</text>
<text x="${W - 28}" y="40" ${MONO} font-size="18" fill="#fff" fill-opacity=".3" text-anchor="end">#${seed.toString(16).slice(0, 6)}</text>
</svg>`;
}

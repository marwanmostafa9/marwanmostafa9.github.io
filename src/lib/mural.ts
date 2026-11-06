import { hashString, mulberry32 } from './random';

export const MURAL_W = 1600;
export const MURAL_H = 900;

/** SVG markup for the neural-network "mural" sketched on the entrance wall. */
export function muralSvg(seed: string) {
  const W = MURAL_W;
  const H = MURAL_H;
  const rand = mulberry32(hashString(seed));
  const layers = [4, 6, 7, 7, 6, 4, 2];
  const nodes = layers.map((n, li) => {
    const x = 140 + (li * (W - 280)) / (layers.length - 1);
    return Array.from({ length: n }, (_, i) => ({
      x: Math.round(x),
      y: Math.round(H / 2 + (i - (n - 1) / 2) * 105 + (rand() - 0.5) * 24),
    }));
  });

  let d = '';
  for (let l = 0; l < nodes.length - 1; l++)
    for (const a of nodes[l]) for (const b of nodes[l + 1]) d += 'M' + a.x + ' ' + a.y + 'L' + b.x + ' ' + b.y;

  const circles = nodes
    .flat()
    .map((n) => '<circle cx="' + n.x + '" cy="' + n.y + '" r="9"/>')
    .join('');

  const notes = [
    { x: 120, y: 120, t: 'y = σ(Wx + b)' },
    { x: 1180, y: 110, t: 'softmax(QKᵀ / √d) V' },
    { x: 1240, y: 820, t: '∇θ L → 0' },
    { x: 160, y: 830, t: 'embed(&quot;hello&quot;) ∈ ℝ⁷⁶⁸' },
    { x: 640, y: 70, t: 'agent → plan → act → observe' },
  ]
    .map((n) => '<text x="' + n.x + '" y="' + n.y + '">' + n.t + '</text>')
    .join('');

  return (
    '<g class="m-lines"><path d="' + d + '"/></g>' +
    '<g class="m-nodes">' + circles + '</g>' +
    '<g class="m-notes">' + notes + '</g>'
  );
}

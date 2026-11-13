# Chat worker ("Ask about Marwan")

The portfolio is static (GitHub Pages), so it can't hold an API key. This Cloudflare Worker holds the
Groq key as a secret, adds the CV as context, and streams Groq's answer back to the chat widget
(`src/components/CvChat.astro`). Both services are free: Groq free tier + Cloudflare Workers free plan
(100,000 requests/day).

## First deploy

Run from this folder (`chat-worker/`):

1. Get a Groq key: https://console.groq.com/keys → Create API Key.
2. Build the knowledge file from the CV PDF: `./build-knowledge.sh`
3. Log in to Cloudflare (free account, opens the browser): `npx wrangler@3 login`
4. Deploy: `npx wrangler@3 deploy` and copy the `https://marwan-cv-chat.<you>.workers.dev` URL it prints.
5. Add the key as a secret (paste it when asked): `npx wrangler@3 secret put GROQ_API_KEY`
6. Put the URL in `src/config/site.ts` → `chatEndpoint`, then push to `main`.

## After changing the CV

`./build-knowledge.sh && npx wrangler@3 deploy`

## Notes

- `wrangler@3` is pinned because local Node is 18.19.1.
- Models: `MODELS` in `wrangler.toml`, tried in order (falls back on rate limit or retired model).
  Check https://console.groq.com/docs/models if answers stop working.
- Logs: `npx wrangler@3 tail` shows Groq errors live.
- Local test: put `GROQ_API_KEY=...` in `.dev.vars` (gitignored), run `npx wrangler@3 dev`,
  and set `chatEndpoint` to `http://localhost:8787` while running `npm run dev`.

// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://marwanmostafa9.github.io',
  vite: {
    server: {
      // let ngrok tunnels reach the dev server (any *.ngrok-free.app subdomain)
      allowedHosts: ['.ngrok-free.app', '.ngrok.app'],
    },
  },
});

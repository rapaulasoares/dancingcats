/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import type { Plugin } from 'vite';

/**
 * Development only: lets the 3D pages save a frame of the canvas as a PNG into dev-shots/, so it can be
 * inspected at full size. It does not exist in the production build.
 */
const devShots: Plugin = {
  name: 'dev-shots',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__dev/shot', (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end();
        return;
      }
      const chunks: Buffer[] = [];
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => {
        const name = (new URL(req.url ?? '', 'http://x').searchParams.get('name') ?? 'shot').replace(/[^a-z0-9_-]/gi, '');
        fs.mkdirSync('dev-shots', { recursive: true });
        fs.writeFileSync(`dev-shots/${name}.png`, Buffer.concat(chunks));
        res.end('ok');
      });
    });
  },
};

export default defineConfig({
  plugins: [react(), devShots],
  base: './',
  server: { port: 5199, strictPort: true },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});

import { defineConfig } from 'vite';
import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
// Builds the home page (if present) plus every page in /subpages
const pages = readdirSync('subpages').filter((f) => f.endsWith('.html')).map((f) => 'subpages/' + f);
if (existsSync('index.html')) pages.unshift('index.html');
export default defineConfig({ build: { rollupOptions: { input: Object.fromEntries(pages.map((p) => [p.replace(/\W/g, '_'), resolve(p)])) } } });

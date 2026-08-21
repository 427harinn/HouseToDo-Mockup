import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
/* global console, process */

import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distRoot = join(repoRoot, 'dist');

if (process.platform === 'win32') {
  execFileSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', 'npm run build'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
} else {
  execFileSync('npm', ['run', 'build'], { cwd: repoRoot, stdio: 'inherit' });
}

let html = await readFile(join(distRoot, 'index.html'), 'utf8');

const styleLinks = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/gi)];
for (const [tag, href] of styleLinks) {
  const assetPath = join(distRoot, href.replace(/^\//, ''));
  const css = await readFile(assetPath, 'utf8');
  html = html.replace(tag, () => `<style>${css}</style>`);
}

const escapeInlineScript = (javascript) => javascript.replace(/<\/script\b/gi, '<\\/script');
const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"[^>]*><\/script>/gi)];
const inlineScripts = [];
for (const [tag, src] of scripts) {
  const assetPath = join(distRoot, src.replace(/^\//, ''));
  const javascript = await readFile(assetPath, 'utf8');
  // UI Lab v1 discovers Adapter elements during iframe load. A classic inline
  // script lets React mount before that load event, avoiding a post-load DOM
  // discovery race in the imported preview.
  html = html.replace(tag, () => '');
  inlineScripts.push(`<script>${escapeInlineScript(javascript)}</script>`);
}
html = html.replace(/<\/body>/i, () => `${inlineScripts.join('')}\n</body>`);

const pantrySvg = await readFile(join(repoRoot, 'public', 'shopping-pantry.svg'));
const pantryDataUrl = `data:image/svg+xml;base64,${pantrySvg.toString('base64')}`;
html = html.replaceAll('/shopping-pantry.svg', pantryDataUrl);

await writeFile(join(distRoot, 'index.html'), html);
await cp(join(repoRoot, '.uilab'), join(distRoot, '.uilab'), { recursive: true });
await mkdir(join(repoRoot, 'artifacts'), { recursive: true });

console.log(`Created single-file preview: ${relative(repoRoot, join(distRoot, 'index.html'))}`);
console.log(`Adapter files copied to: ${relative(repoRoot, join(distRoot, '.uilab'))}`);

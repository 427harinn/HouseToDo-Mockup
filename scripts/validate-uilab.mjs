import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

/* global console, process, URL */

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const adapterRoot = join(repoRoot, '.uilab');
const requiredFiles = ['project.json', 'screens.json', 'components.json', 'tokens.json', 'states.json'];
const readJson = async (name) => JSON.parse(await readFile(join(adapterRoot, name), 'utf8'));
const fail = (message) => {
  console.error(`UI Lab validation failed: ${message}`);
  process.exitCode = 1;
};

for (const file of requiredFiles) {
  try {
    await access(join(adapterRoot, file));
  } catch {
    fail(`missing .uilab/${file}`);
  }
}
if (process.exitCode) process.exit();

const [project, screens, components, tokens, states] = await Promise.all(requiredFiles.map(readJson));
if (project.formatVersion !== 1) fail('project.formatVersion must be 1');
if (project.entry !== 'dist/index.html') fail('project.entry must be dist/index.html');
if (!tokens.color || !tokens.spacing || !tokens.radius) fail('tokens.json must contain color, spacing, and radius');
try {
  await access(join(repoRoot, project.entry));
} catch {
  fail(`missing ${project.entry}; run npm run build:uilab first`);
}

const routeStatePattern = /^\/[A-Za-z0-9/_-]+$/;
for (const [screenId, screen] of Object.entries(screens)) {
  if (!screen.path || !screen.name || !screen.defaultState) fail(`invalid screen ${screenId}`);
  if (!routeStatePattern.test(screen.path)) fail(`invalid route ${screen.path}`);
  if (!states[screenId]?.[screen.defaultState]) fail(`default state ${screenId}/${screen.defaultState} is not declared`);
  for (const stateId of Object.keys(states[screenId] ?? {})) {
    const route = `${project.entry}#${screen.path}?uilabState=${encodeURIComponent(stateId)}`;
    if (!route) fail(`could not construct route for ${screenId}/${stateId}`);
  }
}
for (const screenId of Object.keys(states)) {
  if (!screens[screenId]) fail(`states.json contains unknown screen ${screenId}`);
}

const allowedEditable = new Set(['position', 'width', 'height', 'padding', 'margin', 'gap', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'background', 'border', 'borderRadius', 'opacity']);
const selectorPattern = /^\[data-uilab-component='[^']+'\]$/;
for (const [componentId, component] of Object.entries(components)) {
  if (!selectorPattern.test(component.selector)) fail(`invalid selector for ${componentId}`);
  if (!['single', 'multiple'].includes(component.instances)) fail(`invalid instances for ${componentId}`);
  if (!Array.isArray(component.editable) || component.editable.some((property) => !allowedEditable.has(property))) fail(`invalid editable properties for ${componentId}`);
}

const html = await readFile(join(repoRoot, project.entry), 'utf8').catch(() => '');
if (/(?:https?:\/\/)?(?:127\.0\.0\.1|localhost)(?::\d+)?/i.test(html)) fail('build contains a localhost runtime URL');
if (/<script\b[^>]*\bsrc\s*=/i.test(html)) fail('build contains an external script runtime asset');
if (/<link\b[^>]*\bhref\s*=/i.test(html)) fail('build contains an external stylesheet asset');
if (!html.includes('data-uilab-component') || !html.includes('data-uilab-id')) fail('build does not preserve adapter attributes');

const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
const closingScriptTags = [...html.matchAll(/<\/script\b/gi)];
if (closingScriptTags.length !== inlineScripts.length) fail('inline JavaScript contains an HTML parser-dangerous </script sequence');
if (inlineScripts.length === 0) fail('build does not contain an inline JavaScript bundle');
for (const [, attributes, javascript] of inlineScripts) {
  if (/\bsrc\s*=/i.test(attributes)) fail('inline script extraction found an external script');
  if (/<\/script\b/i.test(javascript)) fail('inline JavaScript contains an HTML parser-dangerous </script sequence');
  try {
    new Script(javascript, { filename: `${project.entry}#inline-script` });
  } catch (error) {
    fail(`inline JavaScript is not syntax-valid: ${error.message}`);
  }
}
const stateCount = Object.values(states).reduce((total, screenStates) => total + Object.keys(screenStates).length, 0);
console.log(`UI Lab metadata valid: ${Object.keys(screens).length} screens, ${stateCount} states, ${Object.keys(components).length} component definitions`);
if (process.exitCode) process.exit();

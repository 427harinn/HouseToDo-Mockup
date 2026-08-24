/* global URL, console, fetch, setTimeout */

import { spawn } from 'node:child_process';
import { mkdir, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const outputDir = fileURLToPath(new URL('../artifacts/motion/', import.meta.url));
const screenshotDir = fileURLToPath(new URL('../docs/screenshots/motion/', import.meta.url));

await mkdir(outputDir, { recursive: true });
await mkdir(screenshotDir, { recursive: true });

const devServer = spawn(`npm run dev -- --host 127.0.0.1 --port ${port}`, {
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  stdio: 'ignore',
  shell: true,
  windowsHide: true,
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The Vite server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Vite did not start at ${baseUrl}`);
}

async function drag(page, from, to, duration = 280) {
  const steps = 12;
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps;
    await page.mouse.move(
      from.x + (to.x - from.x) * progress,
      from.y + (to.y - from.y) * progress,
    );
    await page.waitForTimeout(duration / steps);
  }
  await page.mouse.up();
}

async function record(name, route, action, screenshotName) {
  console.log(`Recording ${name}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: { dir: outputDir, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await action(page);
  await page.waitForTimeout(900);
  if (screenshotName) await page.screenshot({ path: join(screenshotDir, screenshotName) });
  const video = page.video();
  await context.close();
  await browser.close();
  if (!video) throw new Error(`No video was created for ${name}`);
  await rm(`${outputDir}${name}`, { force: true });
  await rename(await video.path(), `${outputDir}${name}`);
  console.log(`Recorded ${name}`);
}

await waitForServer();

try {
  await record('task-complete.webm', '#/home?uilabState=normal', async (page) => {
    await page.getByRole('button', { name: 'ゴミをまとめるを完了' }).click();
  }, 'home-after-complete-390x844.png');

  await record('task-swipe.webm', '#/home?uilabState=normal', async (page) => {
    const row = page.locator('[data-uilab-id="normal-trash"]');
    const box = await row.boundingBox();
    if (!box) throw new Error('Home task row was not measurable');
    await drag(page, { x: box.x + 280, y: box.y + box.height / 2 }, { x: box.x + 144, y: box.y + box.height / 2 }, 160);
  }, 'home-swipe-open-390x844.png');

  await record('shopping-swipe.webm', '#/shopping?uilabState=normal', async (page) => {
    const row = page.locator('[data-uilab-id="shopping-milk"]');
    const box = await row.boundingBox();
    if (!box) throw new Error('Shopping row was not measurable');
    await drag(page, { x: box.x + 280, y: box.y + box.height / 2 }, { x: box.x + 144, y: box.y + box.height / 2 }, 160);
  }, 'shopping-swipe-open-390x844.png');

  await record('shopping-expand-purchase.webm', '#/shopping?uilabState=normal', async (page) => {
    await page.getByRole('button', { name: /牛乳/ }).first().click();
    await page.waitForTimeout(450);
    await page.getByRole('button', { name: '購入', exact: true }).click();
  }, 'shopping-after-purchase-390x844.png');

  await record('bottom-sheet-drag-dismiss.webm', '#/home?uilabState=normal', async (page) => {
    await page.getByRole('button', { name: '追加' }).click();
    await page.waitForTimeout(450);
    const handle = page.locator('.bottom-sheet__handle');
    const box = await handle.boundingBox();
    if (!box) throw new Error('Bottom sheet handle was not measurable');
    await page.screenshot({ path: join(screenshotDir, 'bottom-sheet-open-390x844.png') });
    await drag(page, { x: box.x + box.width / 2, y: box.y + 2 }, { x: box.x + box.width / 2, y: box.y + 105 }, 220);
  }, null);

  await record('calendar-month-swipe.webm', '#/calendar?uilabState=normal', async (page) => {
    const grid = page.locator('.calendar-month-grid');
    const box = await grid.boundingBox();
    if (!box) throw new Error('Calendar month grid was not measurable');
    await drag(page, { x: box.x + box.width - 50, y: box.y + box.height / 2 }, { x: box.x + 50, y: box.y + box.height / 2 }, 200);
  }, 'calendar-next-month-390x844.png');

  await record('calendar-day-swipe.webm', '#/calendar?uilabState=date-open', async (page) => {
    const sheet = page.getByRole('dialog');
    const box = await sheet.boundingBox();
    if (!box) throw new Error('Calendar date sheet was not measurable');
    await drag(page, { x: box.x + box.width - 52, y: box.y + 72 }, { x: box.x + 52, y: box.y + 72 }, 200);
  }, 'calendar-date-next-390x844.png');

  await record('calendar-task-complete.webm', '#/calendar?uilabState=date-open', async (page) => {
    await page.getByRole('dialog').locator('.calendar-detail-task__main').first().click();
  }, 'calendar-after-complete-390x844.png');
} finally {
  devServer.kill();
}

console.log('Motion recordings written to artifacts/motion/.');

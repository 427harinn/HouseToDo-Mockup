import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

/* global console, process, Buffer, URL */

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const distRoot = join(repoRoot, 'dist');
const adapterRoot = join(repoRoot, '.uilab');
const artifactsRoot = join(repoRoot, 'artifacts');
const zipPath = join(artifactsRoot, 'HouseToDo-Mockup-uilab-v1.zip');

execFileSync(process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'npm', process.platform === 'win32'
  ? ['/d', '/s', '/c', 'npm run build:uilab']
  : ['run', 'build:uilab'], { cwd: repoRoot, stdio: 'inherit' });

const entries = [{ name: 'dist/index.html', path: join(distRoot, 'index.html') }];
for (const name of await readdir(adapterRoot)) {
  if (name.endsWith('.json')) entries.push({ name: `.uilab/${name}`, path: join(adapterRoot, name) });
}
entries.sort((left, right) => left.name.localeCompare(right.name));
for (const entry of entries) await stat(entry.path);

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
  return value >>> 0;
});
const crc32 = (buffer) => {
  let value = 0xffffffff;
  for (const byte of buffer) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
};
const dosDate = new Date(1980, 0, 1, 0, 0, 0);
const dosTime = ((dosDate.getHours() << 11) | (dosDate.getMinutes() << 5) | (dosDate.getSeconds() / 2)) >>> 0;
const dosDay = ((dosDate.getFullYear() - 1980) << 9) | ((dosDate.getMonth() + 1) << 5) | dosDate.getDate();
const localParts = [];
const centralParts = [];
let offset = 0;
for (const entry of entries) {
  const name = Buffer.from(entry.name);
  const data = await readFile(entry.path);
  const crc = crc32(data);
  const header = Buffer.alloc(30 + name.length);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(dosTime, 10);
  header.writeUInt16LE(dosDay, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(data.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(name.length, 26);
  header.writeUInt16LE(0, 28);
  name.copy(header, 30);
  localParts.push(header, data);

  const central = Buffer.alloc(46 + name.length);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(0, 10);
  central.writeUInt16LE(dosTime, 12);
  central.writeUInt16LE(dosDay, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34);
  central.writeUInt16LE(0, 36);
  central.writeUInt32LE(0, 38);
  central.writeUInt32LE(offset, 42);
  name.copy(central, 46);
  centralParts.push(central);
  offset += header.length + data.length;
}
const centralDirectory = Buffer.concat(centralParts);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);
end.writeUInt16LE(0, 6);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(centralDirectory.length, 12);
end.writeUInt32LE(offset, 16);
end.writeUInt16LE(0, 20);

await mkdir(artifactsRoot, { recursive: true });
await rm(zipPath, { force: true });
await writeFile(zipPath, Buffer.concat([...localParts, centralDirectory, end]));
const zipStat = await stat(zipPath);
console.log(`Created ${relative(repoRoot, zipPath)} (${(zipStat.size / 1024).toFixed(1)} KiB)`);
console.log(`ZIP entries: ${entries.map((entry) => entry.name).join(', ')}`);

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const pub = join(root, 'public');
const svg = readFileSync(join(pub, 'icon.svg'));

const targets = [
  { size: 1024, name: 'icon-1024.png' },
  { size: 512,  name: 'icon-512.png' },
  { size: 192,  name: 'icon-192.png' },
  { size: 180,  name: 'apple-touch-icon.png' },
  { size: 32,   name: 'favicon-32.png' },
  { size: 16,   name: 'favicon-16.png' },
];

for (const t of targets) {
  await sharp(svg, { density: 384 })
    .resize(t.size, t.size)
    .png({ compressionLevel: 9 })
    .toFile(join(pub, t.name));
  console.log(`✓ ${t.name}`);
}
console.log('done');

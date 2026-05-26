import { readdir, copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findProjectRoot(start: string): string {
  let dir = start;
  for (let i = 0; i < 6; i++) {
    if (existsSync(path.join(dir, 'package.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Could not locate project root from ${start}`);
}

const PROJECT_ROOT = findProjectRoot(__dirname);
const SRC_DIR = path.join(PROJECT_ROOT, 'seeds', 'img');
const DEST_DIR = path.join(PROJECT_ROOT, 'public', 'img', 'pets');

async function main(): Promise<void> {
  await mkdir(DEST_DIR, { recursive: true });
  const files = await readdir(SRC_DIR);
  for (const file of files) {
    const src = path.join(SRC_DIR, file);
    const dest = path.join(DEST_DIR, file);
    await copyFile(src, dest);
    // eslint-disable-next-line no-console
    console.log(`copied ${file}`);
  }
  // eslint-disable-next-line no-console
  console.log(`Done — ${files.length} files copied to ${DEST_DIR}.`);
}

main().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('copy-seed-images failed:', err);
  process.exit(1);
});

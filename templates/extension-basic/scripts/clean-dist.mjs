import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const templateRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
fs.rmSync(path.join(templateRoot, 'dist'), { recursive: true, force: true });

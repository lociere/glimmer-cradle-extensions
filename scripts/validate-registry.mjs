import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(await readFile(path.join(root, 'registry', 'catalog.json'), 'utf8'));
const ids = new Set();
for (const entry of catalog.extensions ?? []) {
  if (!entry.id || ids.has(entry.id)) throw new Error(`registry 扩展 ID 缺失或重复: ${entry.id}`);
  ids.add(entry.id);
  const manifest = YAML.parse(await readFile(path.join(root, entry.manifest_path), 'utf8'));
  if (manifest.id !== entry.id || manifest.version !== entry.latest_version) {
    throw new Error(`registry 与 manifest 不一致: ${entry.id}`);
  }
}
console.log(`[registry] ${ids.size} 个扩展条目通过校验`);

import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const glimmerRoot = path.resolve(process.argv[2] || process.env.GLIMMER_CRADLE_ROOT || path.join(repositoryRoot, '..', 'glimmer-cradle'));
const productSchema = path.join(glimmerRoot, 'products', 'product.schema.json');
if (!(await exists(productSchema))) throw new Error(`目标不是 Glimmer Cradle 主仓库: ${glimmerRoot}`);

const catalog = JSON.parse(await readFile(path.join(repositoryRoot, 'registry', 'catalog.json'), 'utf8'));
for (const entry of catalog.extensions) {
  const source = path.dirname(path.join(repositoryRoot, entry.manifest_path));
  const target = path.join(glimmerRoot, 'data', 'packages', 'extensions', entry.id, 'package');
  const manifest = YAML.parse(await readFile(path.join(source, 'extension-manifest.yaml'), 'utf8'));
  const builtEntry = path.resolve(source, manifest.main);
  if (!(await exists(builtEntry))) throw new Error(`扩展尚未构建: ${builtEntry}`);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  for (const name of ['dist', 'config', 'extension-manifest.yaml', 'package.json']) {
    const input = path.join(source, name);
    if (await exists(input)) await cp(input, path.join(target, name), { recursive: true });
  }
  console.log(`[install-local] ${entry.id}@${manifest.version} -> ${target}`);
}

async function exists(filePath) {
  return Boolean(await stat(filePath).catch(() => null));
}

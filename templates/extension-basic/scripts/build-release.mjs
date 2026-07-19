import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';
import { buildGcexPackage } from '@glimmer-cradle/extension-sdk/distribution';

const root = process.cwd();
const releaseDirectory = path.join(root, 'release');
const manifest = YAML.parse(await fs.readFile(path.join(root, 'extension-manifest.yaml'), 'utf8'));
const revision = git(['rev-parse', 'HEAD']);
const sourceTag = process.env.GITHUB_REF_NAME || git(['describe', '--tags', '--exact-match']);

if (!revision) throw new Error('发布必须来自可追溯的 Git commit。');
if (!sourceTag) throw new Error('发布必须由精确 Git tag 触发。');
if (sourceTag !== `v${manifest.version}`) {
  throw new Error(`Git tag ${sourceTag} 与扩展版本 v${manifest.version} 不一致。`);
}

await fs.rm(releaseDirectory, { recursive: true, force: true });
await fs.mkdir(releaseDirectory, { recursive: true });
const built = await buildGcexPackage({
  extensionRoot: root,
  outputDirectory: releaseDirectory,
  platform: process.env.GCEX_PLATFORM || 'any',
  sourceRevision: revision,
  sourceTag,
  channel: process.env.GCEX_CHANNEL || 'stable',
});
const bytes = await fs.readFile(built.packagePath);
const checksum = createHash('sha256').update(bytes).digest('hex');
await fs.writeFile(
  path.join(releaseDirectory, 'SHA256SUMS'),
  `${checksum}  ${built.packageFileName}\n`,
  'utf8',
);

function git(args) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || undefined;
  } catch {
    return undefined;
  }
}

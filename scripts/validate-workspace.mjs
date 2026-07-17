import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';
import protocol from '@glimmer-cradle/protocol';

const root = process.cwd();
const extensionsRoot = path.join(root, 'extensions');
const entries = fs.readdirSync(extensionsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const directory of entries) {
  const extensionRoot = path.join(extensionsRoot, directory);
  const result = protocol.validateExtensionManifest(
    YAML.parse(fs.readFileSync(path.join(extensionRoot, 'extension-manifest.yaml'), 'utf8')),
  );
  if (!result.ok || !result.data) throw new Error(`${directory}: ${result.errors.join('; ')}`);
  const manifest = result.data;
  const packageJson = JSON.parse(fs.readFileSync(path.join(extensionRoot, 'package.json'), 'utf8'));
  if (manifest.id !== directory) throw new Error(`${directory}: 目录名与 manifest.id 不一致。`);
  if (!manifest.id.startsWith('glimmer-cradle.')) throw new Error(`${directory}: 第一方扩展必须使用 glimmer-cradle.* ID。`);
  if (manifest.publisher !== 'glimmer-cradle') throw new Error(`${directory}: publisher 必须是 glimmer-cradle。`);
  if (manifest.version !== packageJson.version) throw new Error(`${directory}: manifest 与 package 版本不一致。`);
}

process.stdout.write(`[extensions] ${entries.length} 个第一方扩展通过仓库边界检查。\n`);

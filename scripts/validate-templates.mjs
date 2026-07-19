import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';
import protocol from '@glimmer-cradle/protocol';

const root = process.cwd();
const versions = JSON.parse(fs.readFileSync(path.join(root, 'tooling', 'public-package-versions.json'), 'utf8'));
const templatesRoot = path.join(root, 'templates');
const entries = fs.existsSync(templatesRoot)
  ? fs.readdirSync(templatesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
  : [];

for (const directory of entries) {
  const templateRoot = path.join(templatesRoot, directory);
  const manifestResult = protocol.validateExtensionManifest(
    YAML.parse(fs.readFileSync(path.join(templateRoot, 'extension-manifest.yaml'), 'utf8')),
  );
  if (!manifestResult.ok || !manifestResult.data) {
    throw new Error(`${directory}: 模板 manifest 校验失败: ${manifestResult.errors.join('; ')}`);
  }
  const packageJson = JSON.parse(fs.readFileSync(path.join(templateRoot, 'package.json'), 'utf8'));
  const manifest = manifestResult.data;
  if (manifest.version !== packageJson.version) {
    throw new Error(`${directory}: 模板 manifest 与 package 版本不一致。`);
  }
  if (packageJson.peerDependencies?.['@glimmer-cradle/extension-sdk'] !== versions.extensionSdk) {
    throw new Error(`${directory}: extension-sdk peer 必须精确锁定为 ${versions.extensionSdk}。`);
  }
  if (packageJson.peerDependencies?.['@glimmer-cradle/protocol'] !== versions.protocol) {
    throw new Error(`${directory}: protocol peer 必须精确锁定为 ${versions.protocol}。`);
  }
  if (manifest.engines?.extensionSdk !== versions.extensionSdk) {
    throw new Error(`${directory}: manifest.engines.extensionSdk 必须精确锁定为 ${versions.extensionSdk}。`);
  }
  for (const requiredPath of [
    '.github/workflows/release.yml',
    'scripts/build-release.mjs',
    'gcex.package.yaml',
  ]) {
    if (!fs.existsSync(path.join(templateRoot, requiredPath))) {
      throw new Error(`${directory}: 缺少作者发布边界文件 ${requiredPath}。`);
    }
  }
  if (packageJson.scripts?.['release:prepare'] !== 'pnpm build && node scripts/build-release.mjs') {
    throw new Error(`${directory}: release:prepare 未指向规范发布构建器。`);
  }
}

process.stdout.write(`[templates] ${entries.length} 个模板通过契约与版本边界检查。\n`);

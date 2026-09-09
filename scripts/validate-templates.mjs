import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';
import { validateExtensionManifest } from '@glimmer-cradle/extension-sdk/manifest';

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
  const manifestResult = validateExtensionManifest(
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
  if (packageJson.peerDependencies?.['@glimmer-cradle/protocol']) {
    throw new Error(`${directory}: 不得依赖已删除的 @glimmer-cradle/protocol。`);
  }
  if (manifest.engines?.extensionSdk !== versions.extensionSdk) {
    throw new Error(`${directory}: manifest.engines.extensionSdk 必须精确锁定为 ${versions.extensionSdk}。`);
  }
  for (const requiredPath of [
    '.github/workflows/release.yml',
    'scripts/build-release.mjs',
    'scripts/clean-dist.mjs',
    'gcex.package.yaml',
  ]) {
    if (!fs.existsSync(path.join(templateRoot, requiredPath))) {
      throw new Error(`${directory}: 缺少作者发布边界文件 ${requiredPath}。`);
    }
  }
  if (packageJson.scripts?.build !== 'node scripts/clean-dist.mjs && tsc -p tsconfig.json') {
    throw new Error(`${directory}: build 未在编译前清理 dist。`);
  }
  if (packageJson.scripts?.['release:prepare'] !== 'pnpm typecheck && pnpm test && pnpm build && node scripts/build-release.mjs') {
    throw new Error(`${directory}: release:prepare 未指向规范发布构建器。`);
  }
  const workflow = fs.readFileSync(path.join(templateRoot, '.github', 'workflows', 'release.yml'), 'utf8');
  if (workflow.includes('ubuntu-latest') || /uses:\s+[^\s]+@v\d+\b/.test(workflow)) {
    throw new Error(`${directory}: Release workflow 必须固定 runner 与 Action commit。`);
  }
  for (const marker of ['npm view', 'sha256sum --check SHA256SUMS', 'actions/attest@']) {
    if (!workflow.includes(marker)) throw new Error(`${directory}: Release workflow 缺少供应链门 ${marker}。`);
  }
  const releaseBuilder = fs.readFileSync(path.join(templateRoot, 'scripts', 'build-release.mjs'), 'utf8');
  for (const marker of ['GCEX_ALLOW_DIRTY', "['rev-list', '-n', '1', sourceTag]", 'verifyGcexPackage']) {
    if (!releaseBuilder.includes(marker)) throw new Error(`${directory}: 发布构建器缺少固定候选门 ${marker}。`);
  }
}

process.stdout.write(`[templates] ${entries.length} 个模板通过契约与版本边界检查。\n`);

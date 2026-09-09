import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { validateExtensionRegistryCatalog } from '@glimmer-cradle/extension-sdk/distribution';

const catalogPath = path.resolve(process.cwd(), 'registry', 'catalog.json');
const result = validateExtensionRegistryCatalog(JSON.parse(await fs.readFile(catalogPath, 'utf8')));
if (!result.ok || !result.data) {
  throw new Error(`Registry 契约校验失败: ${result.errors.join('; ')}`);
}

const catalog = result.data;
const ids = new Set();
for (const extension of catalog.extensions) {
  if (ids.has(extension.id)) throw new Error(`Registry 包含重复扩展 ID: ${extension.id}`);
  ids.add(extension.id);
  if (!extension.id.startsWith(`${extension.publisher}.`)) {
    throw new Error(`扩展 ID 与 publisher 不一致: ${extension.id}`);
  }
  if (extension.listing_status === 'approved' && Object.keys(extension.channels).length === 0) {
    throw new Error(`已审核扩展必须至少发布一个 channel: ${extension.id}`);
  }
  if (extension.listing_status !== 'approved' && Object.keys(extension.channels).length > 0) {
    throw new Error(`未审核扩展不得进入安装 channel: ${extension.id}`);
  }
  if (extension.security_status === 'blocked' && extension.listing_status !== 'blocked') {
    throw new Error(`安全阻断扩展必须同步标记 listing_status=blocked: ${extension.id}`);
  }
}

process.stdout.write(`[registry] ${catalog.extensions.length} 个扩展通过默认目录检查。\n`);

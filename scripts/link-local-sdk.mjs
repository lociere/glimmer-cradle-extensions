import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const glimmerRoot = path.resolve(process.argv[2] || process.env.GLIMMER_CRADLE_ROOT || '');
const source = path.join(glimmerRoot, 'packages', 'extension-sdk');
if (!glimmerRoot || !fs.existsSync(path.join(source, 'package.json')) || !fs.existsSync(path.join(source, 'dist'))) {
  throw new Error('请传入已构建的 Glimmer Cradle 主仓库路径，或设置 GLIMMER_CRADLE_ROOT。');
}

const target = path.join(process.cwd(), 'node_modules', '@glimmer-cradle', 'extension-sdk');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.rmSync(target, { recursive: true, force: true });
fs.symlinkSync(source, target, process.platform === 'win32' ? 'junction' : 'dir');
process.stdout.write(`[local-sdk] @glimmer-cradle/extension-sdk -> ${source}\n`);

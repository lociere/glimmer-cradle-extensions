# extension-basic

第一方扩展最小模板。复制后请立即修改：

- `id` / `name` / `description`
- `publisher`
- 权限、贡献点、配置 Schema
- `repository` / `homepage`

不要直接发布 `glimmer-cradle.template-basic`。该目录只用于演示 package、manifest、配置 Schema、最小 lifecycle 和 `.gcex` 打包边界。

## 发布

1. 运行 `pnpm install`，提交生成的 `pnpm-lock.yaml`，确保 Release 使用冻结依赖图。
2. 把 `package.json` 与 `extension-manifest.yaml` 的版本保持一致。
3. 提交代码并创建对应的 `v<version>` tag。
4. 确认精确 SDK 版本已在 npm 公开可取得；正式发布必须来自干净工作树，且 `v<version>` tag 真实指向当前 commit。
5. 推送 tag 后，`.github/workflows/release.yml` 会校验公开 SDK、执行类型检查与测试、清理旧构建、打包并复核摘要。
6. GitHub Release 只发布作者自有的 `.gcex` 与 `SHA256SUMS`；SPDX 2.3 SBOM 已位于 `.gcex` 的 `META-INF/` 中，workflow 另生成 GitHub provenance。

尚未创建正式 tag 时，可显式设置 `GCEX_ALLOW_DIRTY=1` 与匹配版本的 `GITHUB_REF_NAME` 构建本地候选；该模式不能作为公开发布证据。

跨平台实现可通过仓库变量 `GCEX_PLATFORM` 选择目标平台；默认 `any` 适用于不包含平台二进制的扩展。进入官方 Registry 是独立审核流程，不是扩展发布的前置条件。

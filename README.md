# Glimmer Cradle Extensions

微光摇篮扩展生态仓库。这里共同维护第一方扩展源码与默认 Registry，在一个仓库中完成审核、校验和发布联动；扩展发行单元与 Registry 仍保持独立边界。

## 仓库边界

- `extensions/<extension-id>/`：一个目录对应一个独立 SemVer 扩展包。
- `registry/catalog.json`：默认审核目录，只保存发现、信任与作者侧发布来源指针。
- Release artifact：由扩展作者自己的仓库和流水线管理，不提交或复制到本仓库。
- 第三方 Adapter：使用独立源码仓库，例如 `glimmer-cradle-napcat-adapter`。
- 用户安装态：`data/packages/extensions/<id>/<version>/`，不从本仓库源码运行。

当前尚无第一方扩展。新增扩展必须先确认它不是 Kernel、Cognition、Audio、Avatar 或产品 Shell 应承担的本体能力。

## 模板与版本边界

- `templates/extension-basic/` 是第一方扩展的最小作者模板，演示 package、manifest、配置 Schema、构建脚本、tag Release 与 `.gcex` 打包边界。
- `tooling/public-package-versions.json` 是本仓库唯一的公开 SDK / Protocol 版本事实源。模板、第一方扩展和 CI 都从这里读取精确版本，不再各自复制。
- `@glimmer-cradle/extension-sdk` 与 `@glimmer-cradle/protocol` 在本仓库内使用精确版本 `0.1.1`。主仓升级公开包后，应先同步这里的版本事实源，再跑 `pnpm validate`。
- 在公开包正式发布前，本仓库与 CI 都通过 `link-local-sdk` 连接已构建的主仓 `packages/extension-sdk` 与 `protocol`，而不是假设 npm registry 已可用。

## 本地验证

公共 Manifest、Registry 与发行格式的唯一事实源是 `@glimmer-cradle/protocol`；`@glimmer-cradle/extension-sdk` 只提供作者 API 和便利封装。本仓库只追加第一方 publisher 与默认 Registry 的审核政策。每个可发布扩展仍须自行声明 SDK peer。公开包尚未发布时，仓库根校验工具显式链接主仓库构建产物：

```powershell
pnpm install
pnpm link:local-sdk C:\path\to\glimmer-cradle
pnpm validate
```

`pnpm validate` 会依次验证第一方扩展、作者模板、Registry、各扩展的类型与测试。第三方扩展即使未进入默认 Registry，仍可按 Protocol 规定从仓库精确 Release、可选 Release Manifest 或本地 `.gcex` 安装。普通作者只需在自己的 GitHub Release 发布一个规范命名的自包含 `.gcex` 与 `SHA256SUMS`；SPDX SBOM 位于包内 `META-INF/`，Registry 不复制或托管扩展本体。

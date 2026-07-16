# Glimmer Cradle Extensions

微光摇篮第一方扩展源码 monorepo。这里保存由 Glimmer Cradle 自行实现和维护的可选能力，不保存第三方集成、Extension Registry 或用户安装态。

## 仓库边界

- `extensions/<extension-id>/`：一个目录对应一个独立 SemVer 扩展包。
- Release artifact：由扩展自己的流水线生成，不提交到源码目录。
- Registry：位于独立 `glimmer-cradle-extension-registry` 仓库，只负责审核、发布通道与索引。
- 第三方 Adapter：使用独立源码仓库，例如 `glimmer-cradle-napcat-adapter`。
- 用户安装态：`data/packages/extensions/<id>/<version>/`，不从本仓库源码运行。

当前尚无第一方扩展。新增扩展必须先确认它不是 Kernel、Cognition、Audio、Avatar 或产品 Shell 应承担的本体能力。

## 本地验证

公共 manifest 与发行契约由 `@glimmer-cradle/extension-sdk` 提供；本仓库只追加第一方 publisher 政策。每个可发布扩展仍须自行声明 SDK peer。SDK 尚未发布时，仓库根校验工具不伪装成扩展包，而是在安装根工具依赖后显式链接主仓库构建产物：

```powershell
pnpm install
pnpm link:local-sdk D:\elise\glimmer-cradle
pnpm validate
```

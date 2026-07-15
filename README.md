# Glimmer Cradle Extensions

微光摇篮官方扩展项目仓库。这里保存扩展源码与 registry 元数据；Glimmer Cradle 主仓库只提供 Extension SDK、协议、宿主和安装能力。

## 边界

- `extensions/`：独立扩展源码，一个目录对应一个可发布包。
- `registry/`：可审计的扩展目录元数据，不保存发布物本身。
- `dist/` 与 Release artifact：不可变安装包，由版本和摘要标识。
- 用户安装态：位于 Glimmer Cradle 的 `data/packages/extensions/<id>/package`，不从本仓库直接运行。

本地开发可先在主仓库构建公开 SDK，再执行 `pnpm install`。SDK 正式发布后，CI 和用户安装只消费语义化版本，不依赖两个仓库的相对路径。

# Glimmer Cradle Extensions 协作约定

- 本仓库只保存 Glimmer Cradle 官方扩展源码、发布元数据和扩展目录，不保存 Kernel、Cognition、Desktop、Server 或角色本体代码。
- 扩展只能依赖公开的 `@glimmer-cradle/extension-sdk`、`@glimmer-cradle/protocol` 和第三方库，不得引用主仓库内部路径。
- 每个扩展必须声明 manifest、权限、贡献点、配置 Schema、生命周期、readiness 和许可证。
- 扩展发布物必须可独立安装到 `data/packages/extensions/<extension-id>/package`；运行时不从本仓库源码目录加载。
- 密钥、账号、token、第三方程序包、日志和本机状态不得进入 Git。
- TypeScript 使用 `pnpm`；文本文件使用 UTF-8 无 BOM。

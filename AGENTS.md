# Glimmer Cradle Extensions 协作约定

- 本仓库只保存 Glimmer Cradle 第一方扩展源码，不保存 Registry、第三方集成、Kernel、Cognition、产品代码或用户安装态。
- 第一方扩展的主要能力必须由 Glimmer Cradle 自行实现；以另一个完整项目为主要能力来源的 Adapter 使用独立仓库。
- 扩展只能依赖公开的 `@glimmer-cradle/extension-sdk`、`@glimmer-cradle/protocol` 和第三方库，不得引用主仓库内部路径。
- 每个扩展必须声明 publisher、许可证、源码仓库、平台、权限、贡献点、配置 Schema、生命周期和 readiness。
- 每个 `extensions/<id>/` 都是独立 SemVer 发布单元，发布物安装到 `data/packages/extensions/<id>/<version>/`；Host 不从源码仓库运行。
- 密钥、账号、token、第三方程序包、日志和本机状态不得进入 Git。
- TypeScript 使用项目锁定的 pnpm；文本文件使用 UTF-8 无 BOM。

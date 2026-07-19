# First-party Extensions

每个直接子目录都是一个独立扩展发布单元。第一方扩展必须使用 `glimmer-cradle.<name>` ID，并由自己的 manifest 声明运行契约。

第三方系统 Adapter 不进入本目录；它们使用独立仓库，并可申请进入同仓库的 `registry/catalog.json`。

第一方作者请先从 `../templates/extension-basic/` 复制骨架，再根据能力 owner 调整 ID、权限、贡献点与配置。不要直接从别的扩展仓库剪裁 manifest 或打包脚本。

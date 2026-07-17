# Default Extension Registry

`catalog.json` 是微光摇篮默认扩展目录，只保存扩展发现、发布者归属、审核状态、安全状态和作者侧发布来源指针。

扩展源码、`.gcex`、可选 Release Manifest、Extension Manifest、SPDX SBOM、签名和构建证明全部由发布者自己的仓库与 Release 负责。Registry 不复制、不镜像也不接管这些事实；未收录扩展仍可按 Protocol 规定直接安装。

普通发布只要求一个 `<id>-<version>-<platform>.gcex`。多平台、channel 或下载前摘要绑定场景可以由作者在自己的 Release 额外提供 `release-manifest.json`；该文件不是 Registry 内容，也不是扩展生态的准入条件。

首次收录通过本仓库 PR。发布者变更、仓库迁移、新增高风险权限或签名异常必须重新审核；普通版本更新可由自动校验处理。

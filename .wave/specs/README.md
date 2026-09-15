# 模块规格

模块级规格目录。每个模块使用一个子目录承载设计、界面与原型、架构、开发规格、任务和验证报告。

## 目录约定

```txt
.wave/specs/{module-id}/
  MODULE.md
  DESIGN.md
  UI.md
  prototype/
  stitch/                  # 可选，仅启用 Stitch 时创建
    STITCH_PROMPT.md
    STITCH_RESULT.md
  ARCH.md
  BOOTSTRAP.md             # 仅 platform-bootstrap
  SPEC.md
  TASKS.md
  TEST_REPORT.md
```

## 命名约定

- 模块 ID 使用 kebab-case，例如 `product-detail`、`checkout`、`user-profile`。
- 模块目录由后续模块拆分节点生成。
- `app-shell` 是存在前端页面时使用的保留技术模块，只包含全局应用壳和唯一
  `APP-SHELL-001` scaffold 任务。
- `platform-bootstrap` 是需要新建 Better-T-Stack 工程时使用的保留技术模块，只包含
  初始化契约和唯一 `PLATFORM-BOOTSTRAP-001` bootstrap 任务；其 DESIGN/UI 不适用。

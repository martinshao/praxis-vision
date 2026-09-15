# Codex 项目规则

## SweetWave 工作流

对于非 trivial 的产品或工程任务，遵循：

Idea → Brief → Plan → Bootstrap（条件）→ Scaffold（条件）→ Run → QA → Release → Retro

可使用以下 SweetWave 个人级 skills：

```txt
$sw brief
$sw plan
$sw plan --stage prd|map|design|ui|architecture|spec|task|quality
$sw bootstrap
$sw scaffold
$sw run --stage bootstrap
$sw run --stage scaffold
$sw run [module] TASK-001
$sw run --all
$sw run [module] TASK-001 --stage implement|verify|review|qa
$sw release v0.1.0
$sw retro v0.1.0
```

## 项目命令

当前目录为空项目，仅有 SweetWave 文档，尚未确定技术栈及包管理器。

- 安装依赖、本地开发、类型检查、代码检查、测试、构建：尚未配置；工程初始化后按实际脚本补全，不猜测命令。

## 工程规则

- 不要修改与当前任务无关的文件。
- 未经明确批准，不要新增依赖。
- 不要通过压制 TypeScript、lint、测试错误来让检查通过，必须先分析根因。
- `$sw plan` 是文档规划状态的唯一写入者；`$sw run` 是工程运行状态的唯一写入者。
- `$sw plan` 完成后必须停止；存在全栈框架任务时先等待用户手动执行 `$sw bootstrap`，
  再按需执行 `$sw scaffold`；每个门完成后都等待用户检查，不得自动续跑。
- `PLAN_REPORT.md` 未通过或规划物料 STALE 时，不进入 `$sw run`。
- 前端骨架为 PENDING、BLOCKED 或 STALE 时，不执行普通 `$sw run --all`。
- 全栈框架为 PENDING、BLOCKED 或 STALE 时，不执行 scaffold 或普通 `$sw run --all`。
- 任务通过验证、审查和按需 QA/安全门后才可标记为 `[x]`。
- 跨会话恢复以 `.wave/STATUS.md`、`.wave/RUN_STATE.md` 和模块 `TASKS.md` 为准，
  不依赖聊天历史猜测进度。
- 重要架构决策、踩坑记录和跨任务影响写入 `.wave/LESSONS.md`。
- 不要读取或编辑 `.env` 文件。
- 未经明确批准，不要执行生产部署命令。
- 优先运行与任务最相关的最小验证命令，再运行全项目验证。
- 在声明完成前，必须报告修改文件、执行命令、命令结果和剩余风险。

## 架构规则

- 业务代码目录、UI、领域层、API、数据模型、状态管理与测试策略尚未确定，由后续规划明确。
- `.wave/` 仅保存工作流状态与交付文档，业务代码使用规划确定的工程目录。

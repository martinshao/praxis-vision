# 全栈初始化任务

## PLATFORM-BOOTSTRAP-001：创建 Better-T-Stack 技术骨架

- [ ] PLATFORM-BOOTSTRAP-001
预估：1h
任务类型：bootstrap
执行角色：platform-engineer
涉及项目：根目录、apps/web、packages/auth、packages/db、packages/ui、packages/config
风险等级：high
QA 策略：required
并行策略：serial
依赖：无
涉及范围：BOOTSTRAP.md 显式生成范围及独立安装、最小技术验证

### 输入与实现

读取 MODULE.md、ARCH.md、SPEC.md、BOOTSTRAP.md、../../TECH_DECISIONS.md、根 AGENTS.md 与 Git 基线。按 BOOTSTRAP 实时 help / version 核查、目录门禁、dry-run、基线重查、正式 no-git/no-install 生成、单独安装顺序执行。技术支撑 F-001–F-012，AC 在业务任务验证，本任务不声称功能验收完成。

### 边界与验收

唯一 apps/web，所选共享包和 bts.jsonc / 锁文件存在；原 .wave / AGENTS / Git / env 忽略规则保留。不得 overwrite / 嵌套 Git / 业务实现 / 迁移 seed / 真实凭据 / 提交推送 / 部署。环境样例如存在只核查无凭据 schema；不读现有 .env。生成器违反禁写约束时停止并保存现场。

### 验证命令

BOOTSTRAP.md 的完整 dry-run 命令与 pnpm install；生成后核查真实 scripts 并运行：

```bash
pnpm check-types
pnpm check
pnpm build
```

不存在的命令如实记录并选择真实等价命令。测试框架尚未建立时记录 NOT_AVAILABLE，由 scaffold 补齐，不吞错。

### 恢复与交接

部分生成 BLOCKED 保留现场；生成成功未安装只恢复 install；验证失败修复当前工程不重新生成。写 ../../handoffs/platform-bootstrap/PLATFORM-BOOTSTRAP-001.md：generator/version、dry_run_command/result、generation_command/complete、install_command/complete、workspace_paths、directory_conflict_strategy、nested_git_created、检查证据。角色不改三层状态与 TASKS 生命周期；由 bootstrap 编排器处理。

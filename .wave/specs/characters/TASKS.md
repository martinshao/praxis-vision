# SweetWave 任务清单

## TASK-001：人物与不可变身份版本服务

- [ ] TASK-001
预估：1h
任务类型：feature
执行角色：backend-engineer
涉及项目：apps/web
风险等级：high
QA 策略：required
并行策略：serial
依赖：app-shell/APP-SHELL-001, workspace/TASK-002
涉及范围：apps/web/src/server/characters、db 人物表、api/characters

### 目标与输入

人物与不可变身份版本服务。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-002。

### 允许与禁止范围

允许：apps/web/src/server/characters、db 人物表、api/characters，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 版本历史不变；外部照片 / 越权生成素材拒绝。
- 对应 AC-002；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- characters
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

版本历史不变；外部照片 / 越权生成素材拒绝。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-002：人物创建候选与身份选择界面

- [ ] TASK-002
预估：1h
任务类型：feature
执行角色：frontend-engineer
涉及项目：apps/web
风险等级：medium
QA 策略：auto
并行策略：serial
依赖：app-shell/APP-SHELL-001, characters/TASK-001, studio/TASK-003
涉及范围：apps/web/src/features/characters；src/app/characters

### 目标与输入

人物创建候选与身份选择界面。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-002。

### 允许与禁止范围

允许：apps/web/src/features/characters；src/app/characters，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 虚构人物生成、身份参考选择保存、再次复用。
- 对应 AC-002；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- characters
```

浏览器联调另执行 `pnpm test:e2e -- characters`；QA 记录真实账户、模型、耗时、费用与已知限制，不能用测试替身替代实际能力证据。

### 风险与恢复

虚构人物生成、身份参考选择保存、再次复用。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。


## 标记

[ ] 待执行；[IN_PROGRESS] 实现；[VERIFYING] 验证；[REVIEWING] 审查；[x] 完成。执行现场由 run 写 RUN_STATE，不写在此处。

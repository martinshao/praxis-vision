# SweetWave 任务清单

## TASK-001：建立单所有者会话与领域持久化基础

- [ ] TASK-001
预估：1h
任务类型：feature
执行角色：backend-engineer
涉及项目：apps/web
风险等级：high
QA 策略：required
并行策略：serial
依赖：app-shell/APP-SHELL-001
涉及范围：apps/web/src/server/auth、db；src/app/api/auth；scripts 初始化本人账户

### 目标与输入

建立单所有者会话与领域持久化基础。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-001, F-010。

### 允许与禁止范围

允许：apps/web/src/server/auth、db；src/app/api/auth；scripts 初始化本人账户，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 关闭注册；未认证与非允许所有者拒绝；数据迁移可复跑。
- 对应 AC-001, AC-010；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- workspace
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

关闭注册；未认证与非允许所有者拒绝；数据迁移可复跑。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-002：项目与归档服务契约

- [ ] TASK-002
预估：1h
任务类型：feature
执行角色：backend-engineer
涉及项目：apps/web
风险等级：high
QA 策略：required
并行策略：serial
依赖：app-shell/APP-SHELL-001, workspace/TASK-001
涉及范围：apps/web/src/server/workspace、src/app/api/projects、archive、contracts

### 目标与输入

项目与归档服务契约。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-001, F-010。

### 允许与禁止范围

允许：apps/web/src/server/workspace、src/app/api/projects、archive、contracts，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 本人 / 他人访问、引用隔离、归档恢复事务与版本冲突。
- 对应 AC-001, AC-010；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- workspace
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

本人 / 他人访问、引用隔离、归档恢复事务与版本冲突。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-003：项目、登录与归档界面

- [ ] TASK-003
预估：1h
任务类型：feature
执行角色：frontend-engineer
涉及项目：apps/web
风险等级：medium
QA 策略：auto
并行策略：serial
依赖：app-shell/APP-SHELL-001, workspace/TASK-002
涉及范围：apps/web/src/features/workspace；src/app 登录 / 项目 / 归档页面

### 目标与输入

项目、登录与归档界面。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-001, F-010。

### 允许与禁止范围

允许：apps/web/src/features/workspace；src/app 登录 / 项目 / 归档页面，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 登录进入私有工作区、新建再打开、归档恢复、失败保留。
- 对应 AC-001, AC-010；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- workspace
```

浏览器联调另执行 `pnpm test:e2e -- workspace`；QA 记录真实账户、模型、耗时、费用与已知限制，不能用测试替身替代实际能力证据。

### 风险与恢复

登录进入私有工作区、新建再打开、归档恢复、失败保留。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。


## 标记

[ ] 待执行；[IN_PROGRESS] 实现；[VERIFYING] 验证；[REVIEWING] 审查；[x] 完成。执行现场由 run 写 RUN_STATE，不写在此处。

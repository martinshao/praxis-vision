# SweetWave 任务清单

规划物料状态：READY

## TASK-001：作品来源、筛选与私有导出服务

- [ ] TASK-001
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, studio/TASK-003, workspace/TASK-002
      涉及范围：apps/web/src/server/gallery、db Work；api/works；消费 studio 的私有 media 接口

### 目标与输入

作品来源、筛选与私有导出服务。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-009, F-010。

### 允许与禁止范围

允许：apps/web/src/server/gallery、db Work；api/works；消费 studio 的私有 media 接口，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 媒体越权、旧快照、配置导出无凭据、快捷不虚构来源。
- 对应 AC-009, AC-010；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- gallery
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

媒体越权、旧快照、配置导出无凭据、快捷不虚构来源。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-002：作品库、评价与复用界面

- [ ] TASK-002
      预估：1h
      任务类型：feature
      执行角色：frontend-engineer
      涉及项目：apps/web
      风险等级：medium
      QA 策略：auto
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, gallery/TASK-001, studio/TASK-004
      涉及范围：apps/web/src/features/gallery；src/app/works

### 目标与输入

作品库、评价与复用界面。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-009。

### 允许与禁止范围

允许：apps/web/src/features/gallery；src/app/works，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 筛选详情、满意标记、原图导出失败重试、复制独立方案。
- 对应 AC-009；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- gallery
```

浏览器联调另执行 `pnpm test:e2e -- gallery`；QA 记录真实账户、模型、耗时、费用与已知限制，不能用测试替身替代实际能力证据。

### 风险与恢复

筛选详情、满意标记、原图导出失败重试、复制独立方案。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-003：人像与技能全闭环验收

- [ ] TASK-003
      预估：1h
      任务类型：feature
      执行角色：qa-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, gallery/TASK-002, studio/TASK-005, workspace/TASK-003
      涉及范围：apps/web/e2e；.wave/qa/gallery；.wave/qa/INIT-ACCEPTANCE.md

### 目标与输入

人像与技能全闭环验收。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012。

### 允许与禁止范围

允许：apps/web/e2e；.wave/qa/gallery；.wave/qa/INIT-ACCEPTANCE.md，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 人物 → 风格 / 技能 → 拍摄 → 重拍 → 满意 → 导出 → 复用 / 归档；真实生成与提炼未通不得完成。
- 对应 AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009, AC-010, AC-011, AC-012；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- gallery
```

浏览器联调另执行 `pnpm test:e2e -- gallery`；QA 记录真实账户、模型、耗时、费用与已知限制，不能用测试替身替代实际能力证据。

### 风险与恢复

人物 → 风格 / 技能 → 拍摄 → 重拍 → 满意 → 导出 → 复用 / 归档；真实生成与提炼未通不得完成。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

## 标记

[ ] 待执行；[IN_PROGRESS] 实现；[VERIFYING] 验证；[REVIEWING] 审查；[x] 完成。执行现场由 run 写 RUN_STATE，不写在此处。

私有媒体读取沿用 studio/TASK-003 的 GET /api/media/:assetId；本模块只消费，不重复维护路由。

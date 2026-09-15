# SweetWave 任务清单

## TASK-001：核查并固定生图与提炼服务适配方案

- [ ] TASK-001
预估：1h
任务类型：feature
执行角色：platform-engineer
涉及项目：apps/web
风险等级：high
QA 策略：required
并行策略：serial
依赖：app-shell/APP-SHELL-001, workspace/TASK-001
涉及范围：服务接入证据写 .wave/handoffs/studio/TASK-001.md；apps/web/src/contracts/provider 配置契约

### 目标与输入

核查并固定生图与提炼服务适配方案。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-006, F-011。

### 允许与禁止范围

允许：服务接入证据写 .wave/handoffs/studio/TASK-001.md；apps/web/src/contracts/provider 配置契约，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 用户选择服务资料、能力 / 数据政策 / 费用 / 模型固定；无账户能力不进入真实调用。
- 对应 AC-006, AC-011；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- studio
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

用户选择服务资料、能力 / 数据政策 / 费用 / 模型固定；无账户能力不进入真实调用。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-002：方案版本与最终提示词预览

- [ ] TASK-002
预估：1h
任务类型：feature
执行角色：backend-engineer
涉及项目：apps/web
风险等级：medium
QA 策略：auto
并行策略：serial
依赖：app-shell/APP-SHELL-001, workspace/TASK-002, characters/TASK-001, skills/TASK-002, photography/TASK-001
涉及范围：apps/web/src/server/studio、db 方案表、api/plans、projects plans

### 目标与输入

方案版本与最终提示词预览。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-004, F-005, F-007, F-008。

### 允许与禁止范围

允许：apps/web/src/server/studio、db 方案表、api/plans、projects plans，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 单要素改动保留其他配置；文本冲突、提交前素材摘要。
- 对应 AC-004, AC-005, AC-007, AC-008；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- studio
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

单要素改动保留其他配置；文本冲突、提交前素材摘要。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-003：生成队列、私有结果与服务适配器

- [ ] TASK-003
预估：1h
任务类型：feature
执行角色：backend-engineer
涉及项目：apps/web
风险等级：high
QA 策略：required
并行策略：serial
依赖：app-shell/APP-SHELL-001, studio/TASK-001, studio/TASK-002
涉及范围：apps/web/src/server/generation、provider；worker；db Job/Asset；api/generation、api/media

### 目标与输入

生成队列、私有结果与服务适配器。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-006。

### 允许与禁止范围

允许：apps/web/src/server/generation、provider；worker；db Job/Asset；api/generation、api/media，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 幂等提交、worker lease、未知不重发、结果保存失败只重存、无密钥泄漏。
- 对应 AC-006；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- studio
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

幂等提交、worker lease、未知不重发、结果保存失败只重存、无密钥泄漏。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-004：专业与快捷创作界面

- [ ] TASK-004
预估：1h
任务类型：feature
执行角色：frontend-engineer
涉及项目：apps/web
风险等级：medium
QA 策略：auto
并行策略：serial
依赖：app-shell/APP-SHELL-001, studio/TASK-003, characters/TASK-002, skills/TASK-004, photography/TASK-002
涉及范围：apps/web/src/features/studio；src/app/studio、quick

### 目标与输入

专业与快捷创作界面。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-004, F-005, F-006, F-007, F-008, F-012。

### 允许与禁止范围

允许：apps/web/src/features/studio；src/app/studio、quick，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 返回跳步不丢设置、快捷不依赖人物、应用技能变化预览、对比重拍。
- 对应 AC-004, AC-005, AC-006, AC-007, AC-008, AC-012；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- studio
```

浏览器联调另执行 `pnpm test:e2e -- studio`；QA 记录真实账户、模型、耗时、费用与已知限制，不能用测试替身替代实际能力证据。

### 风险与恢复

返回跳步不丢设置、快捷不依赖人物、应用技能变化预览、对比重拍。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-005：生成恢复与效果能力复验

- [ ] TASK-005
预估：1h
任务类型：feature
执行角色：qa-engineer
涉及项目：apps/web
风险等级：high
QA 策略：required
并行策略：serial
依赖：app-shell/APP-SHELL-001, studio/TASK-004
涉及范围：apps/web/tests/studio、e2e；.wave/qa/studio；不改业务以伪造通过

### 目标与输入

生成恢复与效果能力复验。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-002, F-006, F-007, F-008, F-012。

### 允许与禁止范围

允许：apps/web/tests/studio、e2e；.wave/qa/studio；不改业务以伪造通过，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 重复提交 / 超时 / 重启 / 存储失败；实际虚构人物效果按 PRD 记录，费用条件未达需暂停。
- 对应 AC-002, AC-006, AC-007, AC-008, AC-012；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- studio
```

浏览器联调另执行 `pnpm test:e2e -- studio`；QA 记录真实账户、模型、耗时、费用与已知限制，不能用测试替身替代实际能力证据。

### 风险与恢复

重复提交 / 超时 / 重启 / 存储失败；实际虚构人物效果按 PRD 记录，费用条件未达需暂停。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。


## 标记

[ ] 待执行；[IN_PROGRESS] 实现；[VERIFYING] 验证；[REVIEWING] 审查；[x] 完成。执行现场由 run 写 RUN_STATE，不写在此处。

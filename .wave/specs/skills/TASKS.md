# SweetWave 任务清单

规划物料状态：READY

## TASK-001：技能版本与受限参数规则存储

- [ ] TASK-001
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, workspace/TASK-002
      涉及范围：apps/web/src/server/skills、contracts 技能 schema、db、api/skills

### 目标与输入

技能版本与受限参数规则存储。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-011。

### 允许与禁止范围

允许：apps/web/src/server/skills、contracts 技能 schema、db、api/skills，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 必填 / 超限、不可执行表达式、版本不继承验证、本人引用。
- 对应 AC-011；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- skills
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

必填 / 超限、不可执行表达式、版本不继承验证、本人引用。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-002：机位技能预览与冲突引擎

- [ ] TASK-002
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：medium
      QA 策略：auto
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, skills/TASK-001
      涉及范围：apps/web/src/server/skills 规则 / 模板 / preview；api/skills preview

### 目标与输入

机位技能预览与冲突引擎。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-012。

### 允许与禁止范围

允许：apps/web/src/server/skills 规则 / 模板 / preview；api/skills preview，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 耳饰任务、服装与取景冲突、软建议保留、身份保护。
- 对应 AC-012；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- skills
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

耳饰任务、服装与取景冲突、软建议保留、身份保护。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-003：辅助提炼与验证记录服务

- [ ] TASK-003
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, skills/TASK-001, studio/TASK-001
      涉及范围：apps/web/src/server/skills extraction / trials；api；文字服务适配器

### 目标与输入

辅助提炼与验证记录服务。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-011。

### 允许与禁止范围

允许：apps/web/src/server/skills extraction / trials；api；文字服务适配器，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 来源与推断分开、结构验证失败、无服务不伪造成功。
- 对应 AC-011；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- skills
```

服务测试验证事务、错误与越权；使用测试替身，不自动发送付费请求。

### 风险与恢复

来源与推断分开、结构验证失败、无服务不伪造成功。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

---

## TASK-004：技能库、编辑与参数试用界面

- [ ] TASK-004
      预估：1h
      任务类型：feature
      执行角色：frontend-engineer
      涉及项目：apps/web
      风险等级：medium
      QA 策略：auto
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, skills/TASK-002, skills/TASK-003
      涉及范围：apps/web/src/features/skills；src/app/skills

### 目标与输入

技能库、编辑与参数试用界面。读取本模块 MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../CONTRACTS.md；../../TECH_DECISIONS.md；对应 PRD F-011, F-012。

### 允许与禁止范围

允许：apps/web/src/features/skills；src/app/skills，对应服务 / 界面测试与任务报告。禁止：无关模块功能、PRD 内容、真实 .env、提交推送、公开部署、真人上传、分享、永久删除。共享 schema 修改串行迁移，不覆盖已有数据库。

### 实现与验收

- 粘贴提炼校正、查找、参数预览、版本 / 未验证标签。
- 对应 AC-011, AC-012；只覆盖本任务关注部分，最终由闭环 QA 汇总，不提前勾选全部产品 AC。
- 供应商未核查 / 未配置时不伪造生成或提炼完成；服务选择阶段若涉及产品承诺变化，保存检查点回到 PRD。

### 验证命令

在 APP-SHELL-001 创建真实 scripts 后执行；本次规划未运行。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- skills
```

浏览器联调另执行 `pnpm test:e2e -- skills`；QA 记录真实账户、模型、耗时、费用与已知限制，不能用测试替身替代实际能力证据。

### 风险与恢复

粘贴提炼校正、查找、参数预览、版本 / 未验证标签。失败保留输入和已成功数据，先定位原因；不得通过吞掉错误或自动盲重发生成来通过。

## 标记

[ ] 待执行；[IN_PROGRESS] 实现；[VERIFYING] 验证；[REVIEWING] 审查；[x] 完成。执行现场由 run 写 RUN_STATE，不写在此处。

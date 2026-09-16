# prompts 增量任务清单

规划物料状态：READY
来源：INIT PRD v4已确认；新增6项，既有21项正文保留，APP-SHELL-001仅追加三路由。

## TASK-001 [NEW]：Prompt条目、来源与不可变版本持久化

- [x] TASK-001
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, workspace/TASK-001
      涉及范围：packages/db schema/迁移；apps/web/src/server/prompts；api/prompts及versions/sources

### 目标与输入

读取MODULE、DESIGN、UI、ARCH、SPEC、../CONTRACTS与INIT PRD v4。覆盖F-013, F-015；仅增量，不改旧领域规则或新增依赖。

### 允许与禁止范围

允许上述文件及相关测试；共享schema串行增量迁移。禁止无关人物/风格/机位方法、真实.env、自动抓取/脚本/批量跑图、公开分享/永久删除、提交推送或部署。生成任务与私有media仍归studio所有。

### 实现与验收

原文v1保留、metadata分离、完整正文另存、乐观锁事务、跨owner引用、nullable来源迁移，不写已有历史任务来源。
对应AC-013, AC-015。只验本任务部分，不勾选产品AC或以替身报告生成效果通过。

### 验证命令与证据

以下为沿用拟建scripts的契约，实际工程仍未创建；run先核对真实package.json，不把不存在命令记通过。task前检查生成器后的项目名称，按真实名称替换filter。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- prompts
```

前端/QA另使用既定E2E契约`pnpm test:e2e -- prompts`。当前未执行应用命令或付费服务；服务测试使用替身，重点事务/越权/零隐式生成。真实试用先通过供应商门与用户费用授权，失败/unknown计入记录。

### 风险与恢复

保存失败保输入、事务回滚/冲突选择；版本与历史源不可覆盖。重复关联job保持幂等，重读图/重试保存不重新生图；unknown先核实。不得吞错或自动提交外部任务以补预览。交付handoff含实际文件、命令、结果与未验证项。

## TASK-002 [NEW]：检索、重复提示与归档恢复服务

- [x] TASK-002
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：medium
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, prompts/TASK-001
      涉及范围：prompts列表/筛选/重复hash提示；archive/restore API

### 目标与输入

读取MODULE、DESIGN、UI、ARCH、SPEC、../CONTRACTS与INIT PRD v4。覆盖F-013, F-015；仅增量，不改旧领域规则或新增依赖。

### 允许与禁止范围

允许上述文件及相关测试；共享schema串行增量迁移。禁止无关人物/风格/机位方法、真实.env、自动抓取/脚本/批量跑图、公开分享/永久删除、提交推送或部署。生成任务与私有media仍归studio所有。

### 实现与验收

多题材收藏、绑定关键词/分页、来源仅元数据、不按URL合并；重复可明确另存或追加来源；归档恢复保版本与关联。
对应AC-013, AC-015。只验本任务部分，不勾选产品AC或以替身报告生成效果通过。

### 验证命令与证据

以下为沿用拟建scripts的契约，实际工程仍未创建；run先核对真实package.json，不把不存在命令记通过。task前检查生成器后的项目名称，按真实名称替换filter。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- prompts
```

前端/QA另使用既定E2E契约`pnpm test:e2e -- prompts`。当前未执行应用命令或付费服务；服务测试使用替身，重点事务/越权/零隐式生成。真实试用先通过供应商门与用户费用授权，失败/unknown计入记录。

### 风险与恢复

保存失败保输入、事务回滚/冲突选择；版本与历史源不可覆盖。重复关联job保持幂等，重读图/重试保存不重新生图；unknown先核实。不得吞错或自动提交外部任务以补预览。交付handoff含实际文件、命令、结果与未验证项。

## TASK-003 [NEW]：本人试用记录、封面与版本依据

- [ ] TASK-003
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, prompts/TASK-002, studio/TASK-003, gallery/TASK-001
      涉及范围：PromptTrial/Cover服务；trials/cover API；消费现有job/work/asset/media

### 目标与输入

读取MODULE、DESIGN、UI、ARCH、SPEC、../CONTRACTS与INIT PRD v4。覆盖F-014, F-015；仅增量，不改旧领域规则或新增依赖。

### 允许与禁止范围

允许上述文件及相关测试；共享schema串行增量迁移。禁止无关人物/风格/机位方法、真实.env、自动抓取/脚本/批量跑图、公开分享/永久删除、提交推送或部署。生成任务与私有media仍归studio所有。

### 实现与验收

验证owner/version/job/asset关系，origin与严格savedWork来源绑定，失败/unknown不伪成功，封面只成功未归档本人结果；旧版封面标签与新版无结果，评价不继承；不新建队列或媒体API。
对应AC-014, AC-015。只验本任务部分，不勾选产品AC或以替身报告生成效果通过。

### 验证命令与证据

以下为沿用拟建scripts的契约，实际工程仍未创建；run先核对真实package.json，不把不存在命令记通过。task前检查生成器后的项目名称，按真实名称替换filter。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- prompts
```

前端/QA另使用既定E2E契约`pnpm test:e2e -- prompts`。当前未执行应用命令或付费服务；服务测试使用替身，重点事务/越权/零隐式生成。真实试用先通过供应商门与用户费用授权，失败/unknown计入记录。

### 风险与恢复

保存失败保输入、事务回滚/冲突选择；版本与历史源不可覆盖。重复关联job保持幂等，重读图/重试保存不重新生图；unknown先核实。不得吞错或自动提交外部任务以补预览。交付handoff含实际文件、命令、结果与未验证项。

## TASK-004 [NEW]：快捷复用、作品反向保存与技能来源连接

- [ ] TASK-004
      预估：1h
      任务类型：feature
      执行角色：backend-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, prompts/TASK-003, studio/TASK-002, skills/TASK-003
      涉及范围：prompts/reuse与from-work；studio共享来源快照和适配；gallery来源读取/安全导出；skills/extract来源；workspace归档kind=prompt

### 目标与输入

读取MODULE、DESIGN、UI、ARCH、SPEC、../CONTRACTS与INIT PRD v4。覆盖F-005, F-008, F-009, F-010, F-011, F-012, F-015；仅增量，不改旧领域规则或新增依赖。

### 允许与禁止范围

允许上述文件及相关测试；共享schema串行增量迁移。禁止无关人物/风格/机位方法、真实.env、自动抓取/脚本/批量跑图、公开分享/永久删除、提交推送或部署。生成任务与私有media仍归studio所有。

### 实现与验收

载入只建独立草稿，替换确认+expectedDraftVersion，只有portrait可生图；unsupported明确未应用项且不改原文；提交冻结来源/实际文本/输入；from-work仅保实际文本不回填旧job；转技能显式发送与人工校正独立待试用草稿；全局归档加prompt。
对应AC-005, AC-008, AC-009, AC-010, AC-011, AC-012, AC-015。只验本任务部分，不勾选产品AC或以替身报告生成效果通过。

### 验证命令与证据

以下为沿用拟建scripts的契约，实际工程仍未创建；run先核对真实package.json，不把不存在命令记通过。task前检查生成器后的项目名称，按真实名称替换filter。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- prompts
```

前端/QA另使用既定E2E契约`pnpm test:e2e -- prompts`。当前未执行应用命令或付费服务；服务测试使用替身，重点事务/越权/零隐式生成。真实试用先通过供应商门与用户费用授权，失败/unknown计入记录。

### 风险与恢复

保存失败保输入、事务回滚/冲突选择；版本与历史源不可覆盖。重复关联job保持幂等，重读图/重试保存不重新生图；unknown先核实。不得吞错或自动提交外部任务以补预览。交付handoff含实际文件、命令、结果与未验证项。

## TASK-005 [NEW]：三个Prompt页面及必要界面连接

- [ ] TASK-005
      预估：1h
      任务类型：feature
      执行角色：frontend-engineer
      涉及项目：apps/web
      风险等级：medium
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, prompts/TASK-004, studio/TASK-004, gallery/TASK-002, workspace/TASK-003
      涉及范围：src/features/prompts和app/prompts；quick来源/适配；works保存为Prompt；skills来源；archive类别

### 目标与输入

读取MODULE、DESIGN、UI、ARCH、SPEC、../CONTRACTS与INIT PRD v4。覆盖F-013, F-014, F-015；联动F-005/F-008–F-012；仅增量，不改旧领域规则或新增依赖。

### 允许与禁止范围

允许上述文件及相关测试；共享schema串行增量迁移。禁止无关人物/风格/机位方法、真实.env、自动抓取/脚本/批量跑图、公开分享/永久删除、提交推送或部署。生成任务与私有media仍归studio所有。

### 实现与验收

收集原文必填与可后补字段、卡片/列表检索、版本差异、无图/旧版标签、本人试用/封面/评价；保存失败保输入；reuse取消不丢稿；只由用户显式提交生图或提炼；窄屏收集/阅读及键盘焦点。
对应AC-013, AC-014, AC-015。只验本任务部分，不勾选产品AC或以替身报告生成效果通过。

### 验证命令与证据

以下为沿用拟建scripts的契约，实际工程仍未创建；run先核对真实package.json，不把不存在命令记通过。task前检查生成器后的项目名称，按真实名称替换filter。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- prompts
```

前端/QA另使用既定E2E契约`pnpm test:e2e -- prompts`。当前未执行应用命令或付费服务；服务测试使用替身，重点事务/越权/零隐式生成。真实试用先通过供应商门与用户费用授权，失败/unknown计入记录。

### 风险与恢复

保存失败保输入、事务回滚/冲突选择；版本与历史源不可覆盖。重复关联job保持幂等，重读图/重试保存不重新生图；unknown先核实。不得吞错或自动提交外部任务以补预览。交付handoff含实际文件、命令、结果与未验证项。

## TASK-006 [NEW]：Prompt增量端到端验收

- [ ] TASK-006
      预估：1h
      任务类型：feature
      执行角色：qa-engineer
      涉及项目：apps/web
      风险等级：high
      QA 策略：required
      并行策略：serial
      依赖：app-shell/APP-SHELL-001, prompts/TASK-005, gallery/TASK-003
      涉及范围：apps/web/e2e/prompts；.wave/qa/prompts；INIT验收报告追加AC-013–015与受影响原AC

### 目标与输入

读取MODULE、DESIGN、UI、ARCH、SPEC、../CONTRACTS与INIT PRD v4。覆盖F-013, F-014, F-015；联动F-005/F-008–F-012；仅增量，不改旧领域规则或新增依赖。

### 允许与禁止范围

允许上述文件及相关测试；共享schema串行增量迁移。禁止无关人物/风格/机位方法、真实.env、自动抓取/脚本/批量跑图、公开分享/永久删除、提交推送或部署。生成任务与私有media仍归studio所有。

### 实现与验收

收藏→找回→独立quick草稿→显式试用→封面→改版→再用；旧图标签/评价隔离、unsupported/替换取消、归档恢复、from-work/转技能及跨owner安全；网络断言浏览/封面/读取重试零生成零外链请求；真实效果与费用只记录经授权的实验，原人像全闭环QA不重写。
对应AC-013, AC-014, AC-015。只验本任务部分，不勾选产品AC或以替身报告生成效果通过。

### 验证命令与证据

以下为沿用拟建scripts的契约，实际工程仍未创建；run先核对真实package.json，不把不存在命令记通过。task前检查生成器后的项目名称，按真实名称替换filter。

```bash
pnpm typecheck
pnpm lint
pnpm --filter @praxis/web test -- prompts
```

前端/QA另使用既定E2E契约`pnpm test:e2e -- prompts`。当前未执行应用命令或付费服务；服务测试使用替身，重点事务/越权/零隐式生成。真实试用先通过供应商门与用户费用授权，失败/unknown计入记录。

### 风险与恢复

保存失败保输入、事务回滚/冲突选择；版本与历史源不可覆盖。重复关联job保持幂等，重读图/重试保存不重新生图；unknown先核实。不得吞错或自动提交外部任务以补预览。交付handoff含实际文件、命令、结果与未验证项。

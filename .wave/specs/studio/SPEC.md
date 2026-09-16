# 人像创作工作台开发规格

物料状态：READY

## 输入与追踪

MODULE.md、DESIGN.md、UI.md、ARCH.md；../CONTRACTS.md；../../TECH_DECISIONS.md；INIT PRD v3。

## 功能与范围

选人物 → 服化道 → 姿态 → 场景 → 摄影 / 技能 → 提示词预览 → 显式生成 → 查看状态 → 对比 → 改一项重拍；快捷入口不要求人物。对应 F-004 / AC-004, F-005 / AC-005, F-006 / AC-006, F-007 / AC-007, F-008 / AC-008。

## 页面 / 组件

- `/studio/:projectId`：专业人像创作。
- `/quick`：快捷提示词生成。

复用输入标签、错误摘要、版本与来源标签、保存提示、空态和局部重试；具体布局按 UI.md，不引入首版之外的共享、支付或删除动作。

## 输入、数据与业务规则

- 字段：人物 / 风格 / 技能版本、造型、姿态、场景、摄影参数、自由文本、输出尺寸、方案版本。
- 数据：ShotPlanVersion、GenerationJob、Asset；Job 以 ownerId / submissionKey 唯一；任务 lease 与执行者记录支撑重启恢复。
- 规则：提交冻结快照；未提交不传输生成素材；同次重复提交不重复建任务；未知状态先核实，不盲目重试；重拍不承诺局部像素不变。
- 文本建议上限：名称 80 字、自由描述 8000 字、提炼来源 30000 字；参数与规则最多各 50 项；超限字段可定位，不截断后静默执行。这是防止请求失控的工程限制，界面显示上限。
- 不可变版本 + expectedVersion + ownerId 事务引用校验遵循 CONTRACTS.md，不复制另一套枚举或错误码。

## API 使用

- `POST /api/projects/:id/plans`：输入 mode,params,prompt,references，输出 ShotPlanVersion。
- `GET /api/projects/:id/plans`：输入 cursor，输出 ShotPlanVersion[]。
- `POST /api/plans/:id/preview`：输入 expectedVersion，输出 ResolvedPrompt+conflicts+transmissionSummary。
- `GET /api/generation/capabilities`：输入 none，输出 Capabilities+configured。
- `POST /api/generation/jobs`：输入 planVersionId,submissionKey,snapshotHash，输出 GenerationJob。
- `GET /api/generation/jobs/:id`：输入 id，输出 Job+assetIds。
- `POST /api/generation/jobs/:id/reconcile`：输入 id，输出 JobState。

以 ARCH.md 路径和 CONTRACTS.md JSON envelope 为唯一契约；不得新增绕过身份的媒体公开路径。mutations 成功后刷新对应资源，失败不丢草稿；版本冲突等待用户选择。

## 状态、异常和联调

DESIGN / UI 的 loading、empty、validation、success、error、unauthorized、interruption 均可达并有恢复动作。供应商未配置显示原因，generation unknown 先核实；重试保存 / 导出不重复生图。生成服务只能拿已提交方案，不读实时表单。

## 安全、性能与禁止范围

仅个人资源、无真人照片上传、无分享、可恢复归档；凭据服务端环境注入、不读取 .env；媒体私有、无任意 URL 下载。分页 / 懒加载 / 私有磁盘见 ARCH。禁止修改 PRD 确认内容、无关模块数据和生产资源。

## 测试策略与开发验收

- 领域：版本不变、必填 / 超限、归档恢复、跨所有者引用拒绝。
- 接口：契约 envelope、HTTP 状态、分页、冲突、资源未找到。
- UI：当前流程与失败保留；有标签、键盘焦点、窄屏无页面溢出。
- 浏览器联调：完成对应 PRD AC；测试替身明确标为测试，生成实际效果另行按 PRD 实验评价。
- 通过条件：对应 AC 可观察行为和最小相关检查通过，数据安全与任务恢复无未解决问题；不会把文档生成计入功能完成。

## 私有媒体接口归属

studio/TASK-003 实现 GET /api/media/:assetId，可信会话 / ownerId 检查，服务端映射路径与正确 MIME，归档关联仍可读。人物候选与作品读取此共享接口；gallery 不重复实现。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
ShotPlanVersion和GenerationJob冻结promptOrigin与实际提交文本/适配遗漏/输入引用（详见prompts/ARCH）；旧字段nullable。POST /api/prompts/:id/reuse由prompts协调调用现有草稿创建，不直接生图；studio依据共享schema校验引用owner/归档/版本及portrait范围，无studio→prompts服务导入。快捷草稿显示来源版本与unsupported未应用项，保留原文；替换须确认和expectedDraftVersion。最终预览/显式提交仍走现有任务接口，不静默忽略unsupported或覆盖身份。任务完成后Prompt详情查询已有job，不另建队列/重复provider调用。增量由prompts/TASK-001、TASK-004、TASK-005追加，原任务保留。

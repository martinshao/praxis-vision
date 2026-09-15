# 摄影技能资产开发规格

物料状态：READY

## 输入与追踪

MODULE.md、DESIGN.md、UI.md、ARCH.md；../CONTRACTS.md；../../TECH_DECISIONS.md；INIT PRD v3。

## 功能与范围

手工 / 粘贴资料提炼 → 校正草稿 → 参数化试用 → 预览建议 → 应用摄影步骤 → 人工评价 → 新版本复用。对应 F-011 / AC-011, F-012 / AC-012。

## 页面 / 组件

- `/skills`：技能库。
- `/skills/new`：创建或提炼。
- `/skills/:skillId`：技能版本与试用记录。

复用输入标签、错误摘要、版本与来源标签、保存提示、空态和局部重试；具体布局按 UI.md，不引入首版之外的共享、支付或删除动作。

## 输入、数据与业务规则

- 字段：名称、任务分类、标签、来源、适用条件、参数定义、规则、输出模板、检查清单、版本、验证条件。
- 数据：Skill、SkillVersion、SkillTrial；SkillRunSnapshot 随拍摄快照保存。验证条件包括模型、任务和人工评价。
- 规则：首版贯通 camera-intent 机位技能和一个摄影槽位；提炼只生成草稿，不执行资料指令；硬冲突需修复，软建议可保留；修改不继承旧版验证。
- 文本建议上限：名称 80 字、自由描述 8000 字、提炼来源 30000 字；参数与规则最多各 50 项；超限字段可定位，不截断后静默执行。这是防止请求失控的工程限制，界面显示上限。
- 不可变版本 + expectedVersion + ownerId 事务引用校验遵循 CONTRACTS.md，不复制另一套枚举或错误码。

## API 使用

- `GET /api/skills`：输入 query,category,tags,cursor，输出 Skill[]。
- `POST /api/skills`：输入 definition，输出 SkillVersion。
- `GET /api/skills/:id`：输入 id，输出 Skill+versions+trials。
- `POST /api/skills/extract`：输入 pastedText,sourceUrl?，输出 DraftExtraction。
- `POST /api/skills/:id/versions`：输入 definition,expectedVersion，输出 SkillVersion。
- `POST /api/skills/:id/preview`：输入 versionId,params,currentPlan，输出 SkillPreview。
- `POST /api/skills/:id/trials`：输入 versionId,jobId,goal,evaluation，输出 SkillTrial。

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

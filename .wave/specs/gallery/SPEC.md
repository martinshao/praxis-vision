# 作品与复用开发规格

物料状态：READY

## 输入与追踪

MODULE.md、DESIGN.md、UI.md、ARCH.md；../CONTRACTS.md；../../TECH_DECISIONS.md；INIT PRD v3。

## 功能与范围

按项目 / 人物 / 风格 / 标签筛选 → 详情 → 对比 / 收藏 / 满意 → 导出 → 复制方案再创作；归档后可恢复。对应 F-009 / AC-009。

## 页面 / 组件

- `/works`：作品库。
- `/works/:workId`：作品来源与复用。

复用输入标签、错误摘要、版本与来源标签、保存提示、空态和局部重试；具体布局按 UI.md，不引入首版之外的共享、支付或删除动作。

## 输入、数据与业务规则

- 字段：适用筛选、标签、收藏、满意评价、图片原输出、任务与方案快照。
- 数据：Work 与 Asset / Job / PlanVersion 引用；不复制生图图片到公开目录，不从当前资产重建历史。
- 规则：快捷作品不虚构专业字段来源；旧版本继续可查；导出失败能重试；零满意作品不计算平均满意成本。
- 文本建议上限：名称 80 字、自由描述 8000 字、提炼来源 30000 字；参数与规则最多各 50 项；超限字段可定位，不截断后静默执行。这是防止请求失控的工程限制，界面显示上限。
- 不可变版本 + expectedVersion + ownerId 事务引用校验遵循 CONTRACTS.md，不复制另一套枚举或错误码。

## API 使用

- `GET /api/works`：输入 projectId,characterId,styleId,tags,cursor，输出 Work[]。
- `GET /api/works/:id`：输入 id，输出 Work+snapshot+skillRuns。
- `PATCH /api/works/:id`：输入 tags,favorite,satisfied,expectedVersion，输出 Work。
- `GET /api/media/:assetId`：输入 assetId，输出 Private image bytes。
- `GET /api/works/:id/export`：输入 format=image|config，输出 Image bytes | safe JSON。
- `POST /api/works/:id/reuse`：输入 upgradeVersionIds?，输出 Independent plan draft。

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

私有媒体读取沿用 studio/TASK-003 的 GET /api/media/:assetId；本模块只消费，不重复维护路由。

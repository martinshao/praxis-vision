# 风格档案与组合开发规格

物料状态：READY

## 输入与追踪

MODULE.md、DESIGN.md、UI.md、ARCH.md；../CONTRACTS.md；../../TECH_DECISIONS.md；INIT PRD v3。

## 功能与范围

编辑光线 / 构图 / 色调 / 镜头感 / 情绪 → 保存 → 选两个档案 → 按维度取用 → 解决冲突 → 另存组合 → 应用拍摄。对应 F-003 / AC-003。

## 页面 / 组件

- `/styles`：摄影风格档案。
- `/styles/new`：新建风格。
- `/styles/:styleId`：档案编辑与组合。

复用输入标签、错误摘要、版本与来源标签、保存提示、空态和局部重试；具体布局按 UI.md，不引入首版之外的共享、支付或删除动作。

## 输入、数据与业务规则

- 字段：名称、五个风格维度、适用说明、技能版本引用、组合来源版本。
- 数据：Style 与 StyleVersion；技能版本和组合来源不可变；组合只存最终维度值和来源。
- 规则：最多两个档案按维度组合，冲突必须择一或新写值；原档案不改；技能不静默覆盖人物身份；无模型训练。
- 文本建议上限：名称 80 字、自由描述 8000 字、提炼来源 30000 字；参数与规则最多各 50 项；超限字段可定位，不截断后静默执行。这是防止请求失控的工程限制，界面显示上限。
- 不可变版本 + expectedVersion + ownerId 事务引用校验遵循 CONTRACTS.md，不复制另一套枚举或错误码。

## API 使用

- `GET /api/styles`：输入 query,cursor，输出 Style[]。
- `POST /api/styles`：输入 name,dimensions,skillVersionIds，输出 StyleVersion。
- `GET /api/styles/:id`：输入 id，输出 Style+versions。
- `POST /api/styles/:id/versions`：输入 dimensions,skillVersionIds,expectedVersion，输出 StyleVersion。
- `POST /api/styles/compose`：输入 sourceVersionIds,dimensionSelections,overrides,name，输出 NewStyleVersion。

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

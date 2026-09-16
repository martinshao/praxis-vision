# 私有工作区与项目开发规格

物料状态：READY

## 输入与追踪

MODULE.md、DESIGN.md、UI.md、ARCH.md；../CONTRACTS.md；../../TECH_DECISIONS.md；INIT PRD v3。

## 功能与范围

空工作区 → 新建项目 → 保存 → 再次打开；归档列表 → 选择对象 → 恢复，历史关联不变。对应 F-001 / AC-001, F-010 / AC-010。

## 页面 / 组件

- `/`：最近项目。
- `/projects`：拍摄项目。
- `/projects/:projectId`：项目详情。
- `/archive`：归档与恢复。

复用输入标签、错误摘要、版本与来源标签、保存提示、空态和局部重试；具体布局按 UI.md，不引入首版之外的共享、支付或删除动作。

## 输入、数据与业务规则

- 字段：项目名称（1–80 字）、标签（最多 20 个）、归档对象类别。
- 数据：Owner / Session、Project、统一归档接口；Better Auth 会话表；所有资源 ownerId 规则由共享契约定义。
- 规则：只操作当前所有者的资源；首版无公开分享、真人照片上传和永久删除；归档不删除数据。
- 文本建议上限：名称 80 字、自由描述 8000 字、提炼来源 30000 字；参数与规则最多各 50 项；超限字段可定位，不截断后静默执行。这是防止请求失控的工程限制，界面显示上限。
- 不可变版本 + expectedVersion + ownerId 事务引用校验遵循 CONTRACTS.md，不复制另一套枚举或错误码。

## API 使用

- `POST /api/projects`：输入 name,tags，输出 Project。
- `GET /api/projects`：输入 cursor,query，输出 Project[]。
- `GET /api/projects/:id`：输入 id，输出 Project。
- `PATCH /api/projects/:id`：输入 name,tags,expectedVersion，输出 Project。
- `GET /api/archive`：输入 kind,cursor，输出 ArchivedEntity[]。
- `POST /api/archive/:kind/:id/restore`：输入 id，输出 RestoredEntity。
- `POST /api/:resource/:id/archive`：输入 id，输出 ArchivedEntity。

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

## 私有会话入口

`/sign-in` 只允许预配置所有者登录。所有者邮箱 / 密码字段、提交中、字段错误、会话失效和登录成功状态完整；无注册或分享入口。未认证访问返回此页，returnTo 仅接受站内允许路由；登录后回到原任务。生成器 /login、/dashboard 示例不作为业务入口；APP-SHELL-001 移除示例页面，workspace/TASK-003 实现实际会话表单。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
Prompt归属相同owner，可恢复归档类别kind=prompt；GET /api/archive分页读取Prompt元数据；POST /api/archive/prompt/:id/restore与POST /api/prompts/:id/restore使用同一服务规则，不删除version/trial/cover。聚合层按共享schema查询，无workspace→prompts服务反向依赖。归档页新增Prompt类别；历史引用保持可读，恢复导航到/prompts/:promptId。由prompts/TASK-004、TASK-005实现增量，旧TASK-002/003负责原能力，不重复工作。

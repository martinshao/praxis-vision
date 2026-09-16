# 私有工作区与项目界面设计

物料状态：READY

## 来源

MODULE.md、DESIGN.md、INIT / PRD v3。

## 视觉方向（规划假设）

采用图片为中心的安静创作界面。当前无用户品牌规范，以下是可调整设计变量，不是已批准品牌。

- 中性深色工作台：背景 #18181B、面板 #27272A、主要文字 #FAFAFA、次要文字 #D4D4D8；重点操作浅色按钮深色文字。状态同时有文本标签。
- 系统无衬线字体与中文系统回退，不加载外部字体；正文 16px / 1.5；8px 间距基准；表单标签与帮助说明独立。
- 桌面左导航 224px；内容弹性宽度；工作台预览区至少占主要空间，右侧参数栏约 360px，可收起。
- 1024px 以下参数栏变分区面板；768px 以下导航抽屉、单列；图片可缩放，但页面不横向溢出。
- 按钮触控区域至少 44px、可见焦点；文本对比至少 4.5:1；图像有替代说明；提示不能只依赖 hover；减少动态效果设置下关闭非必要动画。
- 图片网格固定缩略图区域与懒加载，避免布局跳动；原图仅详情或对比时加载。
- 本地技能检索两轮设计系统建议均含营销 / 叙事布局，与创作工作台不符，不持久化这些匹配。以上采用 skill 优先级表通用指导与本项目图片工作任务推导，不冒充数据库匹配结果。

## 页面与文档化原型

- `/`：最近项目。
- `/projects`：拍摄项目。
- `/projects/:projectId`：项目详情。
- `/archive`：归档与恢复。

最近项目卡片、专业 / 快捷入口；归档页明确“可恢复，素材未删除”。

## 组件与状态

列表筛选、版本标签、带标签输入、字段错误、保存状态、确认提示、空态入口、错误重试。loading / empty / validation / success / error / unauthorized / interruption 逐项遵循 DESIGN.md；禁用按钮提供原因。

## 表单

项目名称（1–80 字）、标签（最多 20 个）、归档对象类别；校验失败焦点移向错误摘要，提交后保留草稿。

## 外部与跨模块

Stitch：MCP_GENERATE；设计系统已由用户确认。私有项目：[praxis-vision · INIT](https://stitch.withgoogle.com/projects/5480617662433312349)。逐屏 ID、工具描述与核对结果见 [STITCH_RESULT.md](stitch/STITCH_RESULT.md)，全局入口见 [STITCH_DESIGN_INDEX.md](../../STITCH_DESIGN_INDEX.md)。GENERATED 不等同人工批准；当前仅默认桌面稿。共享视觉变量由 app-shell/UI.md 汇总，业务交互由本模块维护。

## 私有会话入口

`/sign-in` 只允许预配置所有者登录。所有者邮箱 / 密码字段、提交中、字段错误、会话失效和登录成功状态完整；无注册或分享入口。未认证访问返回此页，returnTo 仅接受站内允许路由；登录后回到原任务。生成器 /login、/dashboard 示例不作为业务入口；APP-SHELL-001 移除示例页面，workspace/TASK-003 实现实际会话表单。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
Prompt归属相同owner，可恢复归档类别kind=prompt；GET /api/archive分页读取Prompt元数据；POST /api/archive/prompt/:id/restore与POST /api/prompts/:id/restore使用同一服务规则，不删除version/trial/cover。聚合层按共享schema查询，无workspace→prompts服务反向依赖。归档页新增Prompt类别；历史引用保持可读，恢复导航到/prompts/:promptId。由prompts/TASK-004、TASK-005实现增量，旧TASK-002/003负责原能力，不重复工作。

## 本轮增量提示词产物

PROMPT_ONLY / READY：[提示词](stitch/STITCH_PROMPT_DELTA.md)；入口[UI_PROMPT_DELTA_INDEX](../../UI_PROMPT_DELTA_INDEX.md)。本轮仅产物回链，不改变本页设计语义；未调用Stitch、未新增外部画布，旧稿仍STALE。

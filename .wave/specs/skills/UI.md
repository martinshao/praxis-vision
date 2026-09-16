# 摄影技能资产界面设计

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

- `/skills`：技能库。
- `/skills/new`：创建或提炼。
- `/skills/:skillId`：技能版本与试用记录。

列表显示任务分类、来源、版本、待试用 / 已验证状态；详情采用参数、规则、输出、试用记录分区；AI 提炼事实与建议分开；应用前字段差异可见。

## 组件与状态

列表筛选、版本标签、带标签输入、字段错误、保存状态、确认提示、空态入口、错误重试。loading / empty / validation / success / error / unauthorized / interruption 逐项遵循 DESIGN.md；禁用按钮提供原因。

## 表单

名称、任务分类、标签、来源、适用条件、参数定义、规则、输出模板、检查清单、版本、验证条件；校验失败焦点移向错误摘要，提交后保留草稿。

## 外部与跨模块

Stitch：MCP_GENERATE；设计系统已由用户确认。私有项目：[praxis-vision · INIT](https://stitch.withgoogle.com/projects/5480617662433312349)。逐屏 ID、工具描述与核对结果见 [STITCH_RESULT.md](stitch/STITCH_RESULT.md)，全局入口见 [STITCH_DESIGN_INDEX.md](../../STITCH_DESIGN_INDEX.md)。GENERATED 不等同人工批准；当前仅默认桌面稿。共享视觉变量由 app-shell/UI.md 汇总，业务交互由本模块维护。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
POST /api/skills/extract追加sourcePromptVersionId?；只允许本人未归档Prompt的指定版本，original pastedText和来源必须与选择一致，改稿作为编辑内容明示；明确预览发送内容并用户确认才调用辅助服务。独立技能草稿保存sourcePromptVersionId?，需人工校正，默认待试用，不能继承Prompt结果评价。详情显示来源链接/prompts/:promptId?versionId=...；不改原机位规则/单技能槽位。由prompts/TASK-004、TASK-005追加，旧技能任务正文保留。

## 本轮增量提示词产物

PROMPT_ONLY / READY：[提示词](stitch/STITCH_PROMPT_DELTA.md)；入口[UI_PROMPT_DELTA_INDEX](../../UI_PROMPT_DELTA_INDEX.md)。本轮仅产物回链，不改变本页设计语义；未调用Stitch、未新增外部画布，旧稿仍STALE。

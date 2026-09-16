# 人像创作工作台界面设计

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

- `/studio/:projectId`：专业人像创作。
- `/quick`：快捷提示词生成。

桌面主预览 + 候选条 + 右侧分步参数；提交前提示词与发送素材摘要；生成状态独立可见。对比使用两图并排 / 单图切换，提供键盘替代，不强制拖拽。

## 组件与状态

列表筛选、版本标签、带标签输入、字段错误、保存状态、确认提示、空态入口、错误重试。loading / empty / validation / success / error / unauthorized / interruption 逐项遵循 DESIGN.md；禁用按钮提供原因。

## 表单

人物 / 风格 / 技能版本、造型、姿态、场景、摄影参数、自由文本、输出尺寸、方案版本；校验失败焦点移向错误摘要，提交后保留草稿。

## 外部与跨模块

Stitch：MCP_GENERATE；设计系统已由用户确认。私有项目：[praxis-vision · INIT](https://stitch.withgoogle.com/projects/5480617662433312349)。逐屏 ID、工具描述与核对结果见 [STITCH_RESULT.md](stitch/STITCH_RESULT.md)，全局入口见 [STITCH_DESIGN_INDEX.md](../../STITCH_DESIGN_INDEX.md)。GENERATED 不等同人工批准；当前仅默认桌面稿。共享视觉变量由 app-shell/UI.md 汇总，业务交互由本模块维护。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
ShotPlanVersion和GenerationJob冻结promptOrigin与实际提交文本/适配遗漏/输入引用（详见prompts/ARCH）；旧字段nullable。POST /api/prompts/:id/reuse由prompts协调调用现有草稿创建，不直接生图；studio依据共享schema校验引用owner/归档/版本及portrait范围，无studio→prompts服务导入。快捷草稿显示来源版本与unsupported未应用项，保留原文；替换须确认和expectedDraftVersion。最终预览/显式提交仍走现有任务接口，不静默忽略unsupported或覆盖身份。任务完成后Prompt详情查询已有job，不另建队列/重复provider调用。增量由prompts/TASK-001、TASK-004、TASK-005追加，原任务保留。

## 本轮增量提示词产物

PROMPT_ONLY / READY：[提示词](stitch/STITCH_PROMPT_DELTA.md)；入口[UI_PROMPT_DELTA_INDEX](../../UI_PROMPT_DELTA_INDEX.md)。本轮仅产物回链，不改变本页设计语义；未调用Stitch、未新增外部画布，旧稿仍STALE。

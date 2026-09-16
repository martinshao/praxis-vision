# prompts 界面与文档化原型

物料状态：READY

## 来源与设计目标

MODULE、DESIGN、INIT PRD v4；继承已确认 STITCH_DESIGN_SYSTEM 的安静深色变量，外部旧截图不作结构 / 文案基线。用文字与本人结果帮助识别，并突出版本与依据。

## 页面清单、路径与信息架构

/prompts 库→/prompts/new 收集→/prompts/:promptId 详情 / 新版本→/quick 独立草稿。新增一级 Prompt，快捷生成常驻；原导航保留。

## 页面布局

库：搜索与收集在页头，筛选下方，卡片 / 紧凑列表切换。卡片主区本人结果封面或文字摘要，显示标题、题材、模型（未知可见）、当前版本及结果来自哪版。不显示伪造评分 / 验证数量。
收集：单列表单原文主区，其余信息可展开，不强迫填完模型 / 来源；重复提示在保存旁显示“已有条目”与追加来源 / 另存。
详情：原文 / 新版编辑为主，版本时间线、来源、条件、试用列表与结果预览独立分区。主要动作载入快捷生成；次级复制、另存新版本、选封面、评价、提炼技能、归档。旧版图有持续可见的版本来源标签，非仅 tooltip。

## 组件清单与状态

PromptCard（摘要 / 封面→打开）；PromptFilters（筛选→分页）；PromptEditor（原文 / metadata→保存）；VersionDiff（两个版本→文本差异）；TrialList（任务 / 图片 / 条件→封面或评价）；SourceLink（手工元数据→用户打开原站）；ReuseChoice（旧草稿→另建 / 确认替换 / 取消）。
loading 局部骨架；empty 分空库 / 无匹配 / 无结果；error 局部读取或保存重试；success 只在持久化成功后；disabled 明示非人像 / 归档 / 服务未配置原因；validation 原文旁错误和可聚焦摘要。

## 表单、响应式与可访问性

原文非空；标题可默认首段且编辑；来源可未知、只能 http(s) 来源链接；模型 / 参数未填不猜。正文16px/1.5、8px间距、8px圆角、224px侧栏；1024px分区、768px抽屉单列，长文本换行。44px目标、可见焦点、文字对比4.5:1；图片有版本替代说明，文本状态不只颜色。

## 原型与外部设计稿

文档化原型与三个Stitch初稿已生成；prompts屏幕ID及返回描述见[设计结果](stitch/STITCH_RESULT.md)。初稿GENERATED / NOT_REVIEWED；局部修正EDIT_REQUESTED / NOT_VERIFIED。既有19稿对新导航 STALE；不替用户声称视觉 / 响应式评审通过。无需新品牌、依赖或高保真生成才能完成本轮规划。

## 跨模块 UI 依赖与待确认

快捷页显示来源版本和最终实际文本；作品页显示来源 / 保存为 Prompt；技能页显示来源版本；归档页 prompt 筛选。无新增产品待确认项，实际可用性需 run 后验证。

## 本轮增量提示词产物

PROMPT_ONLY / READY：[提示词](stitch/STITCH_PROMPT.md)；入口[UI_PROMPT_DELTA_INDEX](../../UI_PROMPT_DELTA_INDEX.md)。本轮仅产物回链，不改变本页设计语义；未调用Stitch、未新增外部画布，旧稿仍STALE。

## 新增模块Stitch绘制交接

仅绘制/prompts、/prompts/new、/prompts/:promptId三个默认桌面；沿用原项目和设计系统。生成资源3/3读取成功，缩略布局粗检，不能证明文字/交互/响应式通过；详情初稿肖像及返回描述偏差已请求定点修正，资源未体现更新，保留NOT_VERIFIED。[结果](stitch/STITCH_RESULT.md)与[核对](stitch/VERIFICATION.json)。五组已有页局部更新不在本次范围。核心UI结构/规则不改，仅追加外部产物状态。

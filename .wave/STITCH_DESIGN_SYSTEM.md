# Praxis Vision · Stitch 设计系统确认方案

- 状态：READY
- 项目：[praxis-vision · INIT](https://stitch.withgoogle.com/projects/5480617662433312349)
- 项目 ID：5480617662433312349
- 可见性：PRIVATE（create_project 返回）
- 已有设计系统：无（list_design_systems 返回空）
- 来源：现有 app-shell/UI.md 及各模块 STITCH_PROMPT 的视觉提议
- 本方案尚未上传 / 创建设计系统，未生成屏幕

## 拟应用方案

图片为中心的安静深色摄影工作台。背景 #18181B、面板 #27272A、主要文字 #FAFAFA、次要文字 #D4D4D8；浅色主按钮配深色文字，中性配色，不新增强调品牌色。

中文优先无衬线；Stitch 可选字体采用 Noto Sans，工程阶段使用中文系统字体回退。正文 16px / 1.5，8px 间距基准。Stitch 必需圆角选项提议 ROUND_EIGHT（8px），属于本次补齐的可调整设计变量。

桌面 224px 左导航，主预览占主要空间，工作台右侧参数栏约 360px。1024px 以下参数区分区展开，768px 以下导航抽屉和单列。按钮目标至少 44px，状态用文字与图标，不依赖颜色。统一系统应用全部屏幕，单屏提示词只含结构与交互。

## 拟调用配置

colorMode DARK；colorVariant NEUTRAL；customColor / primary #FAFAFA；neutral #18181B；bodyFont / headlineFont / labelFont NOTO_SANS；roundness ROUND_EIGHT。designMd 说明面板、字体回退、间距、响应式与占位内容约束。先 create_design_system，立即 update_design_system 应用到项目，再逐屏生成。

## 屏幕范围与顺序

按现有七份提示词的屏幕清单串行生成 18 个业务页面与 1 个应用壳屏幕组；不含 platform-bootstrap。每次保存实际 screenId 和工具描述 / 建议；读取屏幕核对后才标记评审结果。关键状态与窄屏作为设计变体要求，未生成的变体不声称通过。

## 边界

只上传设计系统说明与已有屏幕结构提示词；人物图片、来源文章正文、真实凭据及业务数据不上传，使用安全占位。不实现代码，不恢复 bootstrap，不提交或部署。

## 本次确认与调用

用户：“确认，继续生成。”方案已确认。create_design_system 成功，asset ID 1178394102340625614；list_design_systems 已核实存在。update_design_system 返回 invalid argument（完整 asset name / 裸 ID 均拒绝），尚未设为项目默认；后续每屏显式指定 assets/1178394102340625614，避免默认主题。字体通过 designMd 明确指定；返回 theme 未回显字体枚举，实际屏幕需核对。

## 生成阶段核对

19 个屏幕已返回并逐一 get_screen 成功；每次 generate 显式传入 assets/1178394102340625614。get_project 后续回显与方案匹配的 designTheme，但不把该回显记作 update_design_system 调用成功。字体与可访问性仍待实际工程及人工评审。

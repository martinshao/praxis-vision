# PRD 评审与决策记录

## 当前评审

- Scope：INIT
- PRD 路径 / 版本：`.wave/prd/INIT-PRD.md` / v4
- PRD 内容指纹：sha256:bbf43297a08962c6dc65c040174416227545113ecf91b7075321a3eb8e6f30e0
- 状态：CONFIRMED
- 物料状态：READY；计划 COMPLETED / P2_PRD。
- 基础完整性：PASSED（文档检查）；无真实用户或生图效果实测，不是 P9。
- 当前待确认决定：无；整版 v4 新增 Prompt 切片已确认。
- 下一步：$sw plan INIT --from map
- 历史 v3 确认保留，因本次实质产品增量不适用于 v4。

## 轮次记录

| 轮次 / 日期    | 展示版本  | 用户原话 / 来源                                            | 处理结论与理由                                  | 影响                  | 新版本      | 未决问题         |
| -------------- | --------- | ---------------------------------------------------------- | ----------------------------------------------- | --------------------- | ----------- | ---------------- |
| 1 / 2026-09-15 | v1        | `$sw prd`                                                  | 真实案头调研、产品模型与 PRD 草案；不替用户确认 | 全部 F / AC           | v1 首稿     | 隐私与删除       |
| 1 / 2026-09-15 | v1 形成中 | “先做人像，风光后续加入”（异步问题回复）                   | 采纳，首版不纳入风光                            | MVP / 模型范围        | 纳入首稿 v1 | 无               |
| 1 / 2026-09-15 | v1 形成中 | “可编辑的摄影风格档案与组合，先不训练模型”（异步问题回复） | 采纳，首版包括档案组合，不训练模型              | F-003 / AC-003 / 模型 | 纳入首稿 v1 | 组合细则仍为建议 |

| 2 / 2026-09-15 | v2 | “根据这个文章…分析一下…技能…类似skill的资产库”，指定 X 链接 | 采纳产品方向；读原文并增加方法资产模型，机位技能首版切片作为建议 | F-003、F-005、F-009、F-011、F-012 / AC-011、AC-012 | v2；保留 v1 快照 | 原有隐私与删除；技能切片待评审 |

## 历史 v2 基础完整性检查

| 项目              | 结论     | 依据                                                  |
| ----------------- | -------- | ----------------------------------------------------- |
| 目标与证据        | 结构通过 | E-001–E-007，事实与假设分开；没有用户访谈             |
| 核心闭环          | 结构通过 | 创建人物 → 配置 → 生成 → 重拍 → 归档 / 导出 → 复用    |
| 对象与生命周期    | 结构通过 | 人物、风格、项目、方案、任务、作品；版本关系明确      |
| 交互状态与恢复    | 结构通过 | 空 / 加载 / 成功 / 失败 / 拒绝 / 状态未知 / 重试      |
| 首版切片与 F / AC | 结构通过 | 12 项功能与 12 项稳定验收，17 个章节检查通过          |
| 非功能与验证      | 结构通过 | 明确可靠性、可访问性、效果 / 成本实验；目标值标为建议 |
| 权限、隐私、删除  | BLOCKED  | 已提出具体选择，用户尚未回答；AC-010 未达到可执行条件 |
| 基础完整性总评    | BLOCKED  | 不能凭一句最终确认绕过未决关键规则                    |

结构检查不等于真实生成、用户测试或 P9 全局质量门通过。

## 输入基线

- idea/INIT-IDEA.md：sha256:ecc56c427d1816938f751519379e3188f815588ce25fdb61a87231ee3958856d
- brief/INIT-BRIEF.md：sha256:befe10e776414766f9ccebe5f8ecee518893f0b99177955c81445f23aeddfafc
- research/INIT-RESEARCH.md：sha256:1b634591b74eef59b8a67375ae283639dcac117914b5f8ab2dd860ac78093db3
- product/INIT-MODEL.md：sha256:56fd980af8e1a3aec3f557ec78f90f863c3c97e6df61ab259b227b601826ae00
- prd/INIT-PRD.md：sha256:94e6581439b695cbdc1b892fc5a3c79c95ced2b49f2d586fedd74533f19b9c96

## 最终确认凭证（仅 plan 编排器写入）

- 用户明确确认原话 / 消息定位：`$sw prd 确认 INIT 的 PRD v3`；当前任务本轮用户消息
- 确认日期：2026-09-15T16:07:47+08:00
- Scope / 确认版本：INIT / v3
- 确认 PRD 内容指纹：sha256:310742fe6a61987e5833c402774bd01151de59a65a0d9913c44aa1cdd824349a
- 已展示 PRD 原始文件指纹：sha256:0c36d309dd90a3801ef6873194f66d5f6ada2c2c2f48e0df389c64409145377c
- 指纹规则：UTF-8 / SHA-256；忽略物料状态值、评审状态行及“当前 v3”确认状态行，其他内容保留。
- IDEA / Brief / Research / Model 内容基线：
  - idea/INIT-IDEA.md：sha256:ecc56c427d1816938f751519379e3188f815588ce25fdb61a87231ee3958856d
  - brief/INIT-BRIEF.md：sha256:befe10e776414766f9ccebe5f8ecee518893f0b99177955c81445f23aeddfafc
  - research/INIT-RESEARCH.md：sha256:74be4573a3352e7fd1248d1a4cd872161b6de43ded54c4ec96d81026f2cb2e04
  - product/INIT-MODEL.md：sha256:fe6012f533bfd1349cfe8fc727195ef43acad68fa676240936621a1af1c2c1c2
  - product/INIT-SKILL-ASSETS.md：sha256:d972b9c9dc1937681210f6019f4b816d55920b7affd91ba7924905cebb74486f
- 基础完整性检查结论：PASSED；12 项功能及对应验收，核心闭环、生命周期、异常恢复和数据边界齐全。
- 验证限制：确认的是产品需求；未进行生成效果、用户测试或 P9 全局质量门，供应商条件接入前核查。
- 失效原因：无，当前凭证有效；后续实质变化需重新评审。

## 本轮 v2 输入基线

- idea/INIT-IDEA.md：sha256:ecc56c427d1816938f751519379e3188f815588ce25fdb61a87231ee3958856d
- brief/INIT-BRIEF.md：sha256:befe10e776414766f9ccebe5f8ecee518893f0b99177955c81445f23aeddfafc
- research/INIT-RESEARCH.md：sha256:d4786babef23b4ab7a21e5844e9df1d7b05f30060e2edcf2cb8be4078e9c890b
- product/INIT-MODEL.md：sha256:1f47524cd2088395944134a7d3fb982e450c3b07282d465402e9a0bb20ffe1f8
- product/INIT-SKILL-ASSETS.md：sha256:a56601727d9e9a388d7aa6439b94f475508f9cce061f082a0d626a44ce1d9291
- prd/INIT-PRD.md：sha256:d9fe2c76bd6b822098a1c973d0c7fa2eab2ac289da3490b8af225474b71e467b

## 历史下一轮建议（已处理）

对摄影技能方案反馈后修订递增版本；素材隐私与删除规则补齐、自检通过后，进入 AWAITING_CONFIRMATION。仅讨论技能资产库不视为批准整个 PRD。原调用保持 --stage prd，最终确认后仍停在 P2。

## 第三轮：收到确认意图

- 日期：2026-09-15T16:02:16+08:00
- 用户原话：`$sw prd PRD确认完毕`
- 对应唯一版本：INIT / v2；当前内容指纹：sha256:d9fe2c76bd6b822098a1c973d0c7fa2eab2ac289da3490b8af225474b71e467b
- 处理：记录用户对当前稿的确认意图；基础检查仍因真人上传、归属、第三方传输和删除规则缺失而 BLOCKED，不建立最终有效确认凭证，不改变 PRD 内容或版本。
- 待补齐：建议个人私有工作区、只使用 AI 虚构人物、不上传真人照片或公开分享；允许生成素材发送给生图服务；首版只做可恢复归档，永久删除在正式发布前另行定义。以上均为待用户选择的提案，不能作为已批准规则。

## 第四轮：补齐数据边界并展示 v3

- 日期：2026-09-15T16:06:32+08:00
- 用户原话：`$sw prd 统一采用“个人私有工作区、仅 AI 虚构人物、不上传真人照片或公开分享、允许素材发送给生图服务、首版只做可恢复归档”？`
- AI 解读：作为对上一轮具体方案的选择，采用该组首版规则；没有把该消息当作对尚未展示 v3 的最终确认。
- 处理：采纳，更新 F-001 / F-010、AC-001 / AC-010 与模型，保存 v2 快照。
- 检查：17 个章节、12 项功能和对应验收；角色 / 数据 / 归档规则补齐，基础完整性 PASSED；研究与效果实验限制保留。
- 最终有效确认凭证：尚无 v3 凭证；等待当前版本确认。

## 当前 v3 输入基线

- idea/INIT-IDEA.md：sha256:ecc56c427d1816938f751519379e3188f815588ce25fdb61a87231ee3958856d
- brief/INIT-BRIEF.md：sha256:befe10e776414766f9ccebe5f8ecee518893f0b99177955c81445f23aeddfafc
- research/INIT-RESEARCH.md：sha256:74be4573a3352e7fd1248d1a4cd872161b6de43ded54c4ec96d81026f2cb2e04
- product/INIT-MODEL.md：sha256:fe6012f533bfd1349cfe8fc727195ef43acad68fa676240936621a1af1c2c1c2
- product/INIT-SKILL-ASSETS.md：sha256:d972b9c9dc1937681210f6019f4b816d55920b7affd91ba7924905cebb74486f
- prd/INIT-PRD.md：sha256:0c36d309dd90a3801ef6873194f66d5f6ada2c2c2f48e0df389c64409145377c

## 第五轮：最终确认 v3

- 日期：2026-09-15T16:07:47+08:00
- 用户原话：`$sw prd 确认 INIT 的 PRD v3`
- 核对：当前 v3 与展示基线一致，所有输入指纹一致，基础完整性 PASSED，无活动工程现场。
- 处理：建立最终有效确认凭证，PRD READY，P2 CONFIRMED，单阶段检查点 COMPLETED；未进入 P3。

## 第六轮：Prompt 管理与预览（v4）

- 时间：2026-09-15T19:54:09+08:00
- 用户原话：`$sw prd 我有一个新需求，就是日常我会从很多社交平台，搜集到各种好的生图提示词，在AIGC时代，我也认为Prompt才是比较宝贵的资产，如何对于生图Prompt的管理，相关Prompt的预览是大问题，请帮我分析这个需求，并融入到现在的产品中。`
- 原话选择 1：`自生成结果作封面，外部示例只留链接（推荐）`。
- 原话选择 2：`允许收藏多题材，仅人像可生成（推荐）`。
- AI 解读：收藏资产与执行能力分离，增设 Prompt 对象 / 原始版本 / 本人试用关联；沿用私有与图片边界，不自动抓取或生成。
- 处理：采纳两项选择，建议首版手动收集、检索、完整文本版本、本人结果预览、显式快捷复用、作品反向保存和现有机制辅助提炼技能草稿。模板化、自动抓取、外图导入、自动风格提炼与跨模型批测暂缓。
- 影响：新增 F-013–F-015 / AC-013–AC-015；F-005、F-008–F-012 来源关联调整；全局导航新增 Prompt。旧功能编号及核心人物 / 风格 / 技能边界保留。
- 版本：v3 快照存 prd/history/INIT/v3-PRD.md；当前 v4 REVIEWING。旧确认因增量失效；未收到 v4 整版最终确认。
- 未决：整版范围与新增切片待评审；研究与复现效果未验证。暂无新增隐私 / 上传权限歧义。
- 实施检查：无业务代码、无实际完成任务；仅 TASKS 中的说明性 `[x]` 字样，非完成记录；RUN_STATE IDLE，无活动工程冲突。本次不提交、安装或生成新 Stitch 稿。

### v4 基础完整性检查

| 项目               | 结果                   | 依据                                                    |
| ------------------ | ---------------------- | ------------------------------------------------------- |
| 目标 / 证据 / 取舍 | PASSED                 | E-009–E-011；候选包含不开发方案，事实与建议区分         |
| 核心路径           | PASSED                 | 收集、找回、显式试用、结果、改版、复用及退出 / 恢复     |
| 对象 / 版本 / 评价 | PASSED                 | 原文、Prompt 版本、试用与作品关联；新旧封面规则明确     |
| 权限 / 素材 / 删除 | PASSED                 | 继承私有与仅虚构人物；外部示例仅链接；Prompt 可恢复归档 |
| 状态 / 恢复        | PASSED                 | 无图、无匹配、保存失败、链接失效、未知任务与无权限      |
| F/AC               | PASSED                 | 15 个稳定功能编号与 15 项可观察验收；新增编号不重排     |
| 范围 / 成本 / 验证 | PASSED                 | 仅人像内置生成；非自动跑图；人工收藏对照及版本理解实验  |
| 研究 / 效果证据    | PARTIAL / NOT_EXECUTED | 官方能力资料 + 发起人意图，无样本 / 用户实验 / 效果实测 |

### v4 输入基线（尚非确认凭证）

- PRD 规范化指纹：sha256:bbf43297a08962c6dc65c040174416227545113ecf91b7075321a3eb8e6f30e0
- 规范化：物料状态值清空，忽略以 `- 评审状态：` 或 `- 当前 vN ` 开头的工作流行，其余产品内容保留，末尾换行。
- idea/INIT-IDEA.md：sha256:ecc56c427d1816938f751519379e3188f815588ce25fdb61a87231ee3958856d
- brief/INIT-BRIEF.md：sha256:befe10e776414766f9ccebe5f8ecee518893f0b99177955c81445f23aeddfafc
- research/INIT-RESEARCH.md：sha256:81d6868a9de535718608e24a1ec5c8d314ea36f754014ae8be43af964955b647
- product/INIT-MODEL.md：sha256:2324ccce5eb086bef3f2663addcef2b5f5b0a1e23e69c3ac974d859cd2cea89d
- product/INIT-SKILL-ASSETS.md：sha256:d972b9c9dc1937681210f6019f4b816d55920b7affd91ba7924905cebb74486f
- product/INIT-PROMPT-ASSETS.md：sha256:7bcd52c0e6d911c3c065c9cd338b943f625e5a8d16fc545353a61653ae62b0f0

## 第七轮：最终确认 v4

- 用户明确确认原话：`$sw prd 确认 INIT 的 PRD v4`
- 确认时间：2026-09-15T19:56:28+08:00
- Scope / 版本：INIT / v4
- 内容指纹：sha256:bbf43297a08962c6dc65c040174416227545113ecf91b7075321a3eb8e6f30e0
- 核对：当前 PRD 与第六轮展示基线一致；IDEA、Brief、Research、Model、Skill Assets、Prompt Assets 输入指纹全部一致；15 F / AC 基础完整性 PASSED；RUN_STATE IDLE。
- 输入基线：
  - idea/INIT-IDEA.md：sha256:ecc56c427d1816938f751519379e3188f815588ce25fdb61a87231ee3958856d
  - brief/INIT-BRIEF.md：sha256:befe10e776414766f9ccebe5f8ecee518893f0b99177955c81445f23aeddfafc
  - research/INIT-RESEARCH.md：sha256:81d6868a9de535718608e24a1ec5c8d314ea36f754014ae8be43af964955b647
  - product/INIT-MODEL.md：sha256:2324ccce5eb086bef3f2663addcef2b5f5b0a1e23e69c3ac974d859cd2cea89d
  - product/INIT-SKILL-ASSETS.md：sha256:d972b9c9dc1937681210f6019f4b816d55920b7affd91ba7924905cebb74486f
  - product/INIT-PROMPT-ASSETS.md：sha256:7bcd52c0e6d911c3c065c9cd338b943f625e5a8d16fc545353a61653ae62b0f0
- 处理：有效确认已建立，PRD READY / CONFIRMED；原调用为单阶段 prd，结束于 COMPLETED / P2，不进入 P3。
- 证据限制：研究 PARTIAL、真实生成效果和可用性实验尚未执行；确认是范围批准，不代表实验通过。
- 下游：影响清单与旧 STALE 保留；需显式 $sw plan INIT --from map 重新规划。未提交、未进入工程或 Stitch。

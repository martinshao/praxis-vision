# PRD 评审与决策记录

## 当前评审

- Scope：INIT
- PRD 路径 / 版本：`.wave/prd/INIT-PRD.md` / v3
- PRD 内容指纹：sha256:310742fe6a61987e5833c402774bd01151de59a65a0d9913c44aa1cdd824349a
- 状态：CONFIRMED
- 物料状态：READY；计划 COMPLETED / P2_PRD。
- 基础完整性：PASSED；不是效果实测或 P9 通过。
- 下一步：$sw plan INIT --from map

## 轮次记录

| 轮次 / 日期 | 展示版本 | 用户原话 / 来源 | 处理结论与理由 | 影响 | 新版本 | 未决问题 |
|---|---|---|---|---|---|---|
| 1 / 2026-09-15 | v1 | `$sw prd` | 真实案头调研、产品模型与 PRD 草案；不替用户确认 | 全部 F / AC | v1 首稿 | 隐私与删除 |
| 1 / 2026-09-15 | v1 形成中 | “先做人像，风光后续加入”（异步问题回复） | 采纳，首版不纳入风光 | MVP / 模型范围 | 纳入首稿 v1 | 无 |
| 1 / 2026-09-15 | v1 形成中 | “可编辑的摄影风格档案与组合，先不训练模型”（异步问题回复） | 采纳，首版包括档案组合，不训练模型 | F-003 / AC-003 / 模型 | 纳入首稿 v1 | 组合细则仍为建议 |

| 2 / 2026-09-15 | v2 | “根据这个文章…分析一下…技能…类似skill的资产库”，指定 X 链接 | 采纳产品方向；读原文并增加方法资产模型，机位技能首版切片作为建议 | F-003、F-005、F-009、F-011、F-012 / AC-011、AC-012 | v2；保留 v1 快照 | 原有隐私与删除；技能切片待评审 |

## 历史 v2 基础完整性检查

| 项目 | 结论 | 依据 |
|---|---|---|
| 目标与证据 | 结构通过 | E-001–E-007，事实与假设分开；没有用户访谈 |
| 核心闭环 | 结构通过 | 创建人物 → 配置 → 生成 → 重拍 → 归档 / 导出 → 复用 |
| 对象与生命周期 | 结构通过 | 人物、风格、项目、方案、任务、作品；版本关系明确 |
| 交互状态与恢复 | 结构通过 | 空 / 加载 / 成功 / 失败 / 拒绝 / 状态未知 / 重试 |
| 首版切片与 F / AC | 结构通过 | 12 项功能与 12 项稳定验收，17 个章节检查通过 |
| 非功能与验证 | 结构通过 | 明确可靠性、可访问性、效果 / 成本实验；目标值标为建议 |
| 权限、隐私、删除 | BLOCKED | 已提出具体选择，用户尚未回答；AC-010 未达到可执行条件 |
| 基础完整性总评 | BLOCKED | 不能凭一句最终确认绕过未决关键规则 |

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

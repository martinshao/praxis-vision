# INIT Stitch 提示词入口

- 状态：READY
- 模式：PROMPT_ONLY
- 生成时间：2026-09-15T16:31:37+08:00
- 来源：已确认 INIT PRD v3 及现有 MODULE / DESIGN / UI
- 范围：6 个业务模块 + app-shell；18 个业务页面 + 1 个全局壳强内聚屏幕组
- platform-bootstrap Design/UI NOT_REQUIRED，无屏幕提示词

## 使用顺序

1. 从 app-shell 文件读取统一设计系统提议，先在 Stitch 建立 / 选择共享系统。
2. 优先复制 studio 的“专业人像创作”单屏文本，再设计 skills 的“技能版本与试用记录”，验证技能应用的差异预览。
3. 按其余页面逐屏复制；每个代码块是单次屏幕生成输入。加载 / 失败 / 冲突等另做状态变体。
4. 生成后使用对应短编辑提示词定点调整；真实图片、来源和费用仍只使用安全占位。

## 文件入口

| 模块 | 屏幕数 | 提示词 |
|---|---|---|
| workspace | 5 | [workspace](specs/workspace/stitch/STITCH_PROMPT.md) |
| characters | 3 | [characters](specs/characters/stitch/STITCH_PROMPT.md) |
| skills | 3 | [skills](specs/skills/stitch/STITCH_PROMPT.md) |
| photography | 3 | [photography](specs/photography/stitch/STITCH_PROMPT.md) |
| studio | 2 | [studio](specs/studio/stitch/STITCH_PROMPT.md) |
| gallery | 2 | [gallery](specs/gallery/stitch/STITCH_PROMPT.md) |
| app-shell | 1 | [app-shell](specs/app-shell/stitch/STITCH_PROMPT.md) |

## 来源指纹与边界

本次没有改动原 PRD / MODULE / DESIGN / UI / ARCH / SPEC 或任务定义；仅新增 UI 提示词和状态记录，不传播架构 STALE。UI 原文件的 Stitch DISABLED 是原完整规划时的记录，当前 PROMPT_ONLY 分支以本入口 / PLAN_STATE 为准。没有 STITCH_RESULT、项目 ID 或生成画面，不宣称 GENERATED。bootstrap 仍 BLOCKED，.env 写入未获许可，不自动恢复工程。

| 来源 / 输出 | SHA256 |
|---|---|
| `prd/INIT-PRD.md` | 404ad110f9d1e4968469f5c9f9eb85974a9de536bdd65e644bab365fa57b33a1 |
| `specs/workspace/MODULE.md` | be923a45fffd4ad05604cb257b8f9d8c67c3cb85a32ffc093b49608488030d4e |
| `specs/workspace/DESIGN.md` | 616b5c537e51cb9704367feb2ef8bb4fe571e2bbd8d7092af62dca2448deb9c6 |
| `specs/workspace/UI.md` | 7a5b63095cedf33fcac41a0164eec87b7d5a3906523585cc29cf3fc0de04d6e5 |
| `specs/characters/MODULE.md` | 1250cbed16c9d1a423687ab791c2bbc52b646bee25903698840c8bd7c060b396 |
| `specs/characters/DESIGN.md` | 93eb326fcd1107abbe2b7b530dddbe1589071ecfa8a46f48b8e857f05f72fec1 |
| `specs/characters/UI.md` | 94c634ae2a2db60e136fb4849466a5f9ac12b368b5e4f1388df02f6d7217f0ac |
| `specs/skills/MODULE.md` | d6f2f90c7ec6cbff1b06fe5c574d52a9b440133e3f022bf0646fa1dbe58b11f6 |
| `specs/skills/DESIGN.md` | 7f85743fac7827bfa2615025b87a3cbfd62bd1317d2e60978e29f0c24a52d509 |
| `specs/skills/UI.md` | de699fe4d64e5793d229adb8d8c01958c42fd0b8bae9d63a25a83ef6c8dcbe58 |
| `specs/photography/MODULE.md` | f31b8fb424dd989a83cc78b96888fea8fe93ffaa2d0e150031521acd8be32327 |
| `specs/photography/DESIGN.md` | d0fa3162dc13ff67824b220e7f0c6fce6628a7cfa82ba024e9ab83122369d2e8 |
| `specs/photography/UI.md` | dbf2d73fb7a5da83f315ac87d7e90097c804f8763cd59759e656406ddb23a63d |
| `specs/studio/MODULE.md` | 33a779e9b3a191c6736e12d8032d880b1b631ce1519970ab8a7266c29df94df3 |
| `specs/studio/DESIGN.md` | 67a881ae1bb1d4e0ee1770866fbdc1ca378f49430dc92785c39112dc771220df |
| `specs/studio/UI.md` | ca610fe881d5ff7bf8e894fcc4f780a0a210b57118b92e1c77d1fd8c63870d39 |
| `specs/gallery/MODULE.md` | 32a982490e461ee143a1279962e0737110636999c4b42a01958a6ec8dbba2483 |
| `specs/gallery/DESIGN.md` | 80c8767572fe8556ceb61c8442755b940c20605f3cae409a5984b393dd61b07d |
| `specs/gallery/UI.md` | 1250decfb947821667c1c584ccec102ea8a514cd5064b06defc5539bbfb5cbc5 |
| `specs/app-shell/MODULE.md` | 8101e079b02c28e1130fc6965ab70c2fb662891469c135f2d17d6a19810259e2 |
| `specs/app-shell/DESIGN.md` | c79ec723f85c415c0cdb5a8ee87eede2c34650d855219a3150482acd694f9709 |
| `specs/app-shell/UI.md` | 5ff4ff73aae3eba2828b97978e65d5126e5e1fba250aa37d43fd853507eb94c2 |
| `specs/workspace/stitch/STITCH_PROMPT.md` | 67934f1464ead731447df19130f1e5274c014ae4bbac52037cc68d46ada418d3 |
| `specs/characters/stitch/STITCH_PROMPT.md` | 5f2cef68f94930c777431be035a605c884af3305c434fb59ea471b560ee058c3 |
| `specs/skills/stitch/STITCH_PROMPT.md` | b83215dfe5d64986256712a1f4e980f6706c680fe64ed1d5efb47fce37946586 |
| `specs/photography/stitch/STITCH_PROMPT.md` | 7f410c0d4670ce5eada937ac043d013b3d8cf1446d906637ae6f1b040f5e1574 |
| `specs/studio/stitch/STITCH_PROMPT.md` | ffe11f7f013e1fff67a0712ab5e8e344af17eb8c75d0a77284f47ed76d610aa8 |
| `specs/gallery/stitch/STITCH_PROMPT.md` | 6d9de33fa64977c4eadc97f3d9fb70339a8778a2edb94700b79b954a6f413c69 |
| `specs/app-shell/stitch/STITCH_PROMPT.md` | 8f11ac6b05892432bde7f25700ec4640a0718e0d72eba26dc320e7df161ec31f |

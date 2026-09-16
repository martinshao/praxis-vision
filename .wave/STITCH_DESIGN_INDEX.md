# INIT Stitch 设计稿入口

规划物料状态：STALE
原因：INIT PRD v4 新增 Prompt 独立资产、全局入口、版本与生成 / 作品来源关联；v4 待确认，旧文档内容保留为 v3 历史，不是当前工程交接依据。

- 项目：[praxis-vision · INIT](https://stitch.withgoogle.com/projects/5480617662433312349) / PRIVATE
- 设计系统：assets/1178394102340625614
- 已生成：19/19 个默认桌面屏幕
- 生成稿状态：GENERATED，尚未人工批准；未验证窄屏、交互或效果
- 更新：2026-09-15T19:43:19+08:00

| 页面                             | 画布                                                                                                         | Screen ID                        | 状态      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------- | --------- |
| workspace / 最近项目             | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=41bc349d2dac4400abc4ec0e804aec74) | 41bc349d2dac4400abc4ec0e804aec74 | GENERATED |
| workspace / 拍摄项目             | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=7c47c98372724056bcaaf4ad07d88644) | 7c47c98372724056bcaaf4ad07d88644 | GENERATED |
| workspace / 项目详情             | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=f01f4db924ff4517bf2365df93490a3a) | f01f4db924ff4517bf2365df93490a3a | GENERATED |
| workspace / 归档与恢复           | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=0703d900dd674efd9f147512a28321ce) | 0703d900dd674efd9f147512a28321ce | GENERATED |
| workspace / 私有登录             | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=cab1dfbb2b8c44dd96f0cb172214d231) | cab1dfbb2b8c44dd96f0cb172214d231 | GENERATED |
| characters / 人物列表            | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=268919fe72d74cf8aae38e24776ba295) | 268919fe72d74cf8aae38e24776ba295 | GENERATED |
| characters / 创建虚构人物        | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=cb0ecd39f42f4980ba24c8e866e16517) | cb0ecd39f42f4980ba24c8e866e16517 | GENERATED |
| characters / 身份与版本          | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=a589295fc07c47ccbc2972bff4a843d5) | a589295fc07c47ccbc2972bff4a843d5 | GENERATED |
| skills / 技能库                  | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=3061e41b0bd64f57a9ec4717c7287dcc) | 3061e41b0bd64f57a9ec4717c7287dcc | GENERATED |
| skills / 创建或提炼              | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=ab02899a6eaf4a17b711234266a9b50c) | ab02899a6eaf4a17b711234266a9b50c | GENERATED |
| skills / 技能版本与试用记录      | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=9b493a6495234f14a390752e6f20a354) | 9b493a6495234f14a390752e6f20a354 | GENERATED |
| photography / 摄影风格档案       | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=54b51f63b6ad4bd981e6d487e99781c5) | 54b51f63b6ad4bd981e6d487e99781c5 | GENERATED |
| photography / 新建风格           | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=659a17590ce14e8d872f9ab02b9260f2) | 659a17590ce14e8d872f9ab02b9260f2 | GENERATED |
| photography / 档案编辑与组合     | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=ada9d19e96674a4ea28edd0d47d970d3) | ada9d19e96674a4ea28edd0d47d970d3 | GENERATED |
| studio / 专业人像创作            | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=08561172a36f4380ad0ba36e1fc07fb8) | 08561172a36f4380ad0ba36e1fc07fb8 | GENERATED |
| studio / 快捷提示词生成          | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=3682f083579e4b7fb9c309739c168e71) | 3682f083579e4b7fb9c309739c168e71 | GENERATED |
| gallery / 作品库                 | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=40c320a8df694dbe89bac92317ff9a2a) | 40c320a8df694dbe89bac92317ff9a2a | GENERATED |
| gallery / 作品来源与复用         | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=bb732e50f02448f5a2e341dcd71cd602) | bb732e50f02448f5a2e341dcd71cd602 | GENERATED |
| app-shell / 全局应用壳与占位规范 | [Stitch](https://stitch.withgoogle.com/projects/5480617662433312349?screen=30fcee553b674c9f90e0d3ab7764cf0e) | 30fcee553b674c9f90e0d3ab7764cf0e | GENERATED |

## 模块说明与工具原文

- [workspace](specs/workspace/stitch/STITCH_RESULT.md)
- [characters](specs/characters/stitch/STITCH_RESULT.md)
- [skills](specs/skills/stitch/STITCH_RESULT.md)
- [photography](specs/photography/stitch/STITCH_RESULT.md)
- [studio](specs/studio/stitch/STITCH_RESULT.md)
- [gallery](specs/gallery/stitch/STITCH_RESULT.md)
- [app-shell](specs/app-shell/stitch/STITCH_RESULT.md)

原始响应在 STITCH_GENERATION_LOG.json。工具自述不代替视觉 / 功能验证；19 页修订事件已返回，但 get_screen 截图仍未反映修改，最终画布落实状态 NOT_VERIFIED。bootstrap 仍 BLOCKED，本次不执行工程或提交。

## 当前核对与恢复

19 张默认桌面稿均已生成、逐一 get_screen 读取成功。创建人物请求 HTTP502 后在 list_screens 找到真实屏幕 cb0ecd39f42f4980ba24c8e866e16517，未重复生成。两次 edit_screens 共返回 19 个不同 Screen ID 的 project.file_update / DomOperationEvent，修改导航、占位、按钮和未验证承诺。编辑后逐一读取仍成功，但最近项目截图仍显示原肖像、相机假数据与旧侧栏；截图资源未反映编辑事件，无法证明修订已在最终画布落实，状态 EDIT_REQUESTED / NOT_VERIFIED。恢复时先读取现有项目与屏幕并核对最新画布，禁止重建或重复生成；人工批准前不作为工程视觉验收基线。初始最近项目、风格组合、作品来源截图已做粗略布局观察；仅 512px 预览，不能证明文字、响应式或交互通过。工作台截图查看未成功，未记为视觉核验。

浏览器交付核对：当前内置浏览器未登录 Stitch，项目页显示“此页面不存在，或未与您共享”及登录入口；MCP get_screen 19 项成功。这是未认证会话的显示，不能据此判定资源不存在。需用户使用绑定 MCP 的同一 Google 账户查看私有项目；本次未登录或改变可见性。

## v4 影响记录

INIT PRD v4 新增 Prompt 独立资产、全局入口、版本与生成 / 作品来源关联；v4 待确认，旧文档内容保留为 v3 历史，不是当前工程交接依据。 本轮只标记过期，不重写技术方案或任务生命周期。恢复：v4 有效确认后 $sw plan INIT --from map。

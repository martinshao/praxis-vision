# prompts 模块开发规格

物料状态：READY

## 1. 输入文档

MODULE、INIT PRD v4 CONFIRMED、DESIGN、UI、ARCH、../CONTRACTS.md；F-013–F-015 / AC-013–AC-015。

## 2. 功能拆解

收集原文 / 后补元数据→关键词筛选 / 去重提示→完整文本新版本与差异→任务结果关联 / 封面 / 评价→显式reuse / from-work / source技能草稿→归档恢复。条目独立于项目 / 人物；仅portrait可内置生成。

## 3. 模块边界

prompts 所有条目及展示关系；任务、媒体、作品、技能保持原所有权。新增集成只追加来源 / 复用操作，不重做原人像流程。

## 4. 路由设计

/prompts、/prompts/new、/prompts/:promptId。编辑新版本在详情页；对应Next app/prompts/page.tsx、new/page.tsx、[promptId]/page.tsx，new静态优先。全局Prompt入口，详情去/quick，归档恢复回本人库。

## 5. 组件设计

沿用UI的Card / Filters / Editor / VersionDiff / TrialList / SourceLink / ReuseChoice；API字段、错误与限值严格按ARCH，不产生另一个表单schema。

## 6. 界面与原型约束

继承已确认深色变量和UI桌面/窄屏规则；本人结果或文字摘要，无装饰假结果；封面旧版来源持续可见，不用“已验证”虚构效果。Stitch本次未请求，旧稿不作验收基线。

## 7. 状态管理

草稿与不可变版本 / 提交快照分开；filters/cursor可恢复，不持久化伪成功。readiness仅待整理/可复用，trial评价unrated/satisfied/improve绑定job与版；旧版评价不继承。更换草稿先确认，取消保留输入。

## 8. API 使用方式

逐一使用ARCH API表。收藏/详情/复制/选封面零生图调用；reuse只产quick草稿；from-work保存实际文本。最终生成仍走studio预览/提交/reconcile。辅助提炼另经skills发送摘要确认，不能保存动作隐式发送。

## 9. 数据模型使用方式

Prompt、Source、Version、Trial、Cover按ARCH；生成来源字段为nullable增量迁移，不破坏旧作品；历史来源只读，原文v1永存。不存在Prompt来源的旧Work不虚构来源。

## 10. Error / Loading / Empty 状态

保留输入；空库/无匹配/无图分开；409重复与版本冲突可选择；unsupported字段列未应用项；加载图失败只读重试；failed/rejected/unknown不伪称success。用户报告外链失效不会清原文；未认证回登录、资源无权限404回本人库。

## 11. 安全与权限约束

每次写及跨域引用服务端owner关系校验；CSRF/Origin，XSS转义与参数化查询；URL仅http(s)元数据，无抓取。所有生图输入仅虚构人物与本人生成素材；无真人上传/分享/永久删除，客户端禁用不替代服务端题材校验。

## 12. 性能约束

24条/max100分页、摘要列表不传全部长文/全部图；关键词检索不新增向量依赖。参考现有2秒浏览/保存反馈目标，需记录环境实测，不报当前通过。

## 13. 测试策略

领域/DB服务验证版本与FK、duplicate可另存、归档恢复、旧封面标识、同job重复关联幂等；组件与E2E验证收藏/筛选/适配/替换取消/from-work/转技能。网络断言浏览零生成零外链请求。核心生成结果效果另经真实授权试用，替身不代表实际效果。

## 14. 禁止修改范围

原人物/风格/机位方法内容、PRD、技术栈/新依赖、真实.env、供应商账户与部署；禁止自动抓取、跨模型批测、变量模板引擎或重新生成旧Stitch稿。

## 15. 验收标准

AC-013：原文独立保存、元数据可未知、可找回、重复提示可选择、多题材收藏而生图限人像。
AC-014：文字摘要/仅外链、显式试用、自结果版本/条件、新版无图/旧封面标识、读取重试不生成。
AC-015：新版本保原文/差异/旧快照、独立草稿/替换确认、unsupported适配明示、from-work与待试用技能来源、归档恢复不丢关联。
F-005 / F-008–F-012集成只覆盖来源和复用，不提前勾选原整项AC。

## 16. 跨模块联调约束

studio冻结Prompt来源并以最终文本/输入发任务；gallery展示来源并发起from-work；skills只接受本人来源版本提炼独立草稿；workspace归档聚合kind=prompt；app-shell三壳路由只标题/说明/未实现，不在scaffold塞表单、API或Mock。实现分工详见TASKS，接口一致性按ARCH/CONTRACTS验证。

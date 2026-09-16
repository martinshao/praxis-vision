# INIT 规划质量报告

规划物料状态：STALE
原因：INIT PRD v4 新增 Prompt 独立资产、全局入口、版本与生成 / 作品来源关联；v4 待确认，旧文档内容保留为 v3 历史，不是当前工程交接依据。

- 结论：STALE；下方 PASSED 检查为 v3 历史，本轮未重新执行 P9
- 检查时间：2026-09-15T16:21:25+08:00
- 来源：INIT PRD v3 已确认；内容指纹 sha256:310742fe6a61987e5833c402774bd01151de59a65a0d9913c44aa1cdd824349a
- 本轮调用：$sw plan INIT --from map；后续技术选择纳入 Better-T-Stack
- 结论范围：文档完整性、需求追踪、接口与权限约束、任务可调度性；不是已实现应用或效果验收

## 检查证据

| 检查           | 结果         | 依据                                                                                                                                 |
| -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 当前版本确认   | PASSED       | INIT-REVIEW.md 用户最终确认凭证；规范化 PRD hash 一致                                                                                |
| 上游基线       | PASSED       | Idea / Brief / Research / Model / Skill Assets 五项内容 hash 与确认基线一致                                                          |
| 模块文档       | PASSED       | 8 模块共 48 份 MODULE / DESIGN / UI / ARCH / SPEC / TASKS；bootstrap Design/UI 明确 NOT_REQUIRED，其余 READY；另有 READY BOOTSTRAP   |
| 需求与验收追踪 | PASSED       | F-001–F-012、AC-001–AC-012 全部追踪至真实业务文档及任务，见 TRACEABILITY                                                             |
| 页面覆盖       | PASSED       | 18 个规划路由无重复，业务 DESIGN / UI / SPEC 与 app-shell SPEC 对应；signin 必需身份入口，无公开分享 / 注册页                        |
| 跨域接口       | PASSED       | CONTRACTS 为统一认证 / envelope / 版本 / 错误契约；media 归 studio 所有，gallery 消费；人物候选任务等待生成服务                      |
| 任务结构       | PASSED       | 从实际 TASKS 解析 21 项，每项有类型、角色、项目、风险、QA、并行、依赖、范围、验证命令；任务引用存在                                  |
| 依赖调度       | PASSED       | 全图拓扑检查无循环，所有业务任务直接依赖 APP-SHELL-001，并传递依赖唯一 PLATFORM-BOOTSTRAP-001                                        |
| Bootstrap 门禁 | PASSED       | 唯一 bootstrap/platform-engineer/high/required/serial；CLI 3.43.0 help 实时核验；显式组合 dry-run 返回 0 / success=true / 无文件写入 |
| 工程边界       | PASSED       | 根仍无 package.json / apps；无正式生成、项目依赖安装、源码实现、数据库操作、提交推送或部署                                           |
| 可选设计       | NOT_REQUIRED | Stitch 未启用、无必需外部设计屏幕，不要求不存在的产物                                                                                |

## 本轮修复

用户选择 Better-T-Stack 后，新增 platform-bootstrap 的 ARCH / BOOTSTRAP / SPEC / TASKS，并让 scaffold 扩展生成工程，避免二次创建。runtime node 预检失败后按 CLI 改为 none，修正后通过。统一 packages/db、packages/auth 和 packages/ui 的规划位置；补齐私有 signin 的流程状态；将私有媒体读取前置到生成服务，消除人物候选显示依赖后置作品模块的问题。

## 仍待实际验证

生图与提炼服务尚未选定，studio/TASK-001 在实际接入前核查账户能力、模型、素材使用 / 保留政策、费用与恢复能力，未通过不能调用真实服务。当前可调度技术初始化、身份与规则任务；不把供应商门禁当作已完成。

研究仍为 PARTIAL，无用户访谈、可用性或生成效果 / 一致性 / 成本实验。视觉变量为规划假设，无高保真界面实测。Vitest / Playwright 尚未建立，本轮未执行应用测试、类型检查或构建；所有产品 AC 均未验收。实际生成器脚本和包路径以 bootstrap handoff 核验，版本变化先复查配置。

## 交接

进入 P10：READY_TO_RUN；全栈框架 PENDING；前端骨架 PENDING；RUN_STATE 保持 IDLE。下一条手动命令为 `$sw bootstrap`，完成并检查后才进入 `$sw scaffold`，再进入业务 `$sw run --all`。本次 plan 到此结束。

## v4 影响记录

INIT PRD v4 新增 Prompt 独立资产、全局入口、版本与生成 / 作品来源关联；v4 待确认，旧文档内容保留为 v3 历史，不是当前工程交接依据。 本轮只标记过期，不重写技术方案或任务生命周期。恢复：v4 有效确认后 $sw plan INIT --from map。

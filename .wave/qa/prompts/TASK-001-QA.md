# prompts/TASK-001 QA

- 结论：PASSED（仅条目、来源和不可变版本持久化/API）
- 角色：qa-engineer
- 日期：2026-09-16
- 输入：QA角色、prompts TASKS/ARCH/SPEC/CONTRACTS、实施与database handoff、TEST_REPORT、安全专项、实际4个API入口/服务/校验/schema/0002迁移/测试。
- Git基线：01be53ecb321293f1fef320c4110d6d9c7c6aacd，旧bootstrap/scaffold/workspace/规划未提交变化保留。

## 验收映射

| 项目 | 判定与事实 |
| --- | --- |
| 原文与metadata | PASSED；真实临时SQLite测试保留v1首尾空格和CRLF，metadata不能更新正文，旧版再读取原样；默认other/inbox，无模型/照片前置要求 |
| 完整版本与服务器指针 | PASSED；fullContent新增完整不可变正文，服务器从当前版生成parent/number/currentVersion；strict schema拒绝owner/parent/currentVersion类字段。数据库trigger拒绝历史update/delete |
| 并发CAS与回滚 | PASSED；两个竞争append只有一个提交，loser VERSION_CONFLICT，版本数量/锁正确；注入source失败CAS回滚。HTTP409仅返回本人当前锁/指针。仅结构化SQLITE_BUSY已回滚本地事务最多4次有限重试，不涉及外部提交 |
| owner及复合关系 | PASSED；查询绑定owner+条目+版本，跨owner/跨条目404同形；0002currentVersion复合deferred FK、parent/prompt/owner FK与版本号唯一。DDL跨owner/currentVersion/parent等检查引用database handoff临时SQLite验证；QA没有重跑该临时脚本 |
| 来源零请求 | PASSED；http(s)元数据无userinfo、长度2048，保存/追加/详情fetch spy零调用；没有自动请求外链或生成服务，不声称远端链接可访问 |
| 输入安全界限 | PASSED；正文20000、负面词10000、notes5000、tags20×40、参数16KiB UTF8及depth20/纯JSON/危险键；测试1000层拒绝、中文UTF8超限、恶意键/owner/URLuserinfo拒绝。流式body在parse前累计262144字节并取消超限流，静态源码核验，不冒称全部边界独立运行 |
| HTTP契约与守卫 | PASSED；实际4入口映射create/detail/metadata/versions/addSource，runtime调用真实requireOwner；测试401/Origin400/201/data/requestId/no-store/409。HTTP测试采用可信身份替身，真实cookie机制继承workspace已通过门，未做真实浏览器登录API闭环 |
| 迁移与旧数据 | PASSED；临时runner复跑账本两项、旧workspace数据/FK测试通过；0002追加，0001不改，旧账本测试改为检查0001记录未削弱迁移保留。必须用praxis_migrations，不混用Drizzle push/generate |
| 延后来源 | PASSED，范围合理；sourceWorkId nullable且CHECK暂仅NULL；Work/Job/Plan/Skill尚不存在，未来有序新迁移补FK，不虚构表/来源或修改旧历史 |
| 旧回归与工程门 | PASSED；QA独立全项目15测试含4Prompt和11既有测试通过；最终type/lint/build及安全专项PASSED引用实施证据，不重复build或不存在的Prompt UI E2E |

## QA实际命令与结果

- cat：指定规格/实施/database/security报告及API/服务/验证器/schema/迁移/tests读取成功；部分规格长输出截断，ARCH/CONTRACTS相关规则另定向rg核对，未据缺失输出推断已完成能力。
- 初次rg --files包含尚不存在apps/web/src/contracts产生路径错误，随后直接读取实际server/prompts验证器和API；没有把错误路径当作检查通过。
- pnpm test：exit0，Vitest4.1.11；5文件15项通过，2.52s，真实临时或内存SQLite自动清理，未触碰真实数据库/Owner。
- git diff --check：exit0（本报告落盘后）。

## 限制与下一步

没有阻止本单任务检查点的范围内问题。真实DB/Owner未初始化；检索、duplicate、归档、Trial/Cover、reuse及UI是TASK002–006后续，不将它们缺失判为001失败或声称完整AC013/015通过。未做浏览器认证API联调、2秒性能实测、外链网络/CVE审计或付费生图。

本模块还有5个任务未完成，不生成MODULE全部通过。建议CHECKPOINT：父流程N8/N9结束本单任务后停止用户检查。仅写本QA与指定handoff，无.env或环境schema内容读取编辑、源码/状态/TASKS/依赖修改、真实DB操作、付费、提交或部署。

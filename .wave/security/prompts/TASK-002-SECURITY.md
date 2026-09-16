# prompts/TASK-002 安全专项

- 结论：PASSED（检索/重复提示/可恢复归档API范围）
- 角色：security-engineer
- 日期：2026-09-16
- 输入：security角色、prompts TASKS/ARCH/SPEC/共享CONTRACTS、TASK-002与database handoff、BASELINE、TEST_REPORT及实际相关代码。
- Git基线：01be53ecb321293f1fef320c4110d6d9c7c6aacd；旧bootstrap/scaffold/workspace及规划变更不归当前任务。

## 审查与证据

| 项目 | 判定与证据 |
| --- | --- |
| GET身份/SQL | HTTP仍先可信requireOwner，list不需写Origin但不能匿名。当前版本JOIN同时限定id/prompt/owner，全部筛选绑定SQL；关键词%/_/反斜杠转义，LIKE显式ESCAPE；平台EXISTS不会重复，tags逐项AND，模型只看当前版 |
| 分页/输入 | 时间毫秒+UUID降序keyset，时间SafeInteger且不超过Date上界；默认24/max100；query及筛选严格schema、boolean限定true/false，除重复tags外重复query拒绝400；列表180字摘要，不传所有版本正文/参数 |
| 查重归属 | create整事务在本人任意历史版本hash查重、含归档，按本人条目去重，最多24个安全id/archivedAt；没有他人原文泄露。allowDuplicate:true才另存，URL不当合并键，来源追加保v1 |
| 归档与恢复 | archive/restore仍CAS+owner查询，无权/不存在404，锁冲突409；只修改归档/更新时间/乐观锁，不删除历史/来源或改currentVersion。归档详情与历史仍可读，常规编辑拒绝 |
| HTTP/错误 | 写Origin精确匹配与cross-site拒绝、JSON/body界限继承；no-store/requestId/envelope保持。duplicate 409只返回本人安全引用；未知错误503不回传内部详情；无生图、外链抓取或秘密日志 |
| 文件写队列 | createDb在打开client前canonical file身份，realpath/URI解码/相对路径统一；memory Symbol独立。withDatabaseWrite覆盖整事务含commit，前一失败tail只用于队列继续、调用者result保原error；finally仅删当前尾，不误删后来操作；不同文件并行 |
| 不确定提交 | 已撤销泛SQLITE_BUSY重放，当前代码无BUSY/定时事务重试；不根据错误message盲重试commit，无vendor补丁。队列是进程内且不可重入，跨进程/绕队列写仍依赖SQLite失败传播 |
| 构建追踪 | 只读6个Prompt API NFT JSON路径元数据，各287个追踪项；未匹配.wave/.git/data/AGENTS/秘密环境文件路径。未读取被追踪文件或.env内容；路径组合不再dynamic join，已构建无whole-project警告证据引用handoff |
| 暂缓能力 | Trial尚不存在，仅untried可用，其他trialState明确422；无伪造试用/封面。没有结构迁移、新依赖、真实DB操作或付费请求 |

## 实际命令与结果

- `pnpm --filter @praxis/web exec vitest run tests/prompts`：exit0，3文件13测试，临时SQLite/内存；独立客户端查重/CAS、明确另存、字面LIKE/注入词、筛选/分页、归档保历史/来源、HTTP边界与queue错误恢复通过。
- 指定规格/交接/源码/测试cat、rg：成功；当前服务不含SQLITE_BUSY/setTimeout/fetch/axios/console/数据库delete；唯一delete为进程内队列Map清理。
- Python仅读取NFT路径元数据、BASELINE及非环境代码：6路由敏感工程路径匹配0；baseline差异仅handoff源文件以及Next/生成类型工具产物。未读取秘密schema或环境值。
- `git diff --check`：exit0。
- 全项目24测试/type/lint/build exit0及无tracing警告引用最终handoff/TEST_REPORT，不重复build。

## 发现、严重度与风险

无阻止本次TASK-002检查点的范围内发现。

1. **中，使用约束**：进程内队列不提供跨进程锁、提交幂等或恶意库修复；持锁operation不能嵌套同file helper。后续领域写事务应整体复用queue，错误后核实状态，不重新引入泛BUSY自动重放。
   覆盖边界核对：实际runtime在进入Prompt service前调用requireOwner；该守卫真实auth.api.getSession可能刷新会话，Better Auth登录/会话写也未接入Prompt queue。由当前源码与handoff的驱动BEGIN/COMMIT诊断可知，这类写仍由SQLite仲裁，可能产生争用/503或守卫通用401，属于当前未全局排队的可用性限制；没有证据表明会绕过签名/Owner、跳过CAS或重放不确定提交，不据此新增安全阻塞。不得为了排队删除getSession签名/owner校验；后续认证写协调需专门验证，避免在同file持锁时再调用会写库的auth形成自锁。
2. **低，能力边界**：TASK-003接真实Trial时才开放tried/评价筛选；UI与效率/2秒目标后续验收。当前API实现不代表完整私有产品或部署授权。
3. **低，运行信任**：canonicalPath假设本地路径与仓库受可信操作员控制；文件symlink/hardlink运行中更换及外部进程不由该进程队列解决。本次没有操作真实库/账号。
4. **低，追踪/审计限制**：NFT只核对路径元数据，不能替代对生产包或实际秘密逐值审计；本专项不运行网络CVE审计。后续生产准备须另行核验环境/产物/访问边界。

TASK-001历史报告关于BUSY重放的结论仅描述当时实现；当前以TASK-002撤销重放/队列实现为准，不改旧历史报告。

仅新增本报告和security handoff，不改工程、状态、规划或依赖。

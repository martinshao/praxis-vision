# prompts/TASK-001 安全专项

- 结论：PASSED（仅条目/来源/不可变版本持久化API）
- 角色：security-engineer
- 日期：2026-09-16
- 输入：security角色、prompts TASKS/ARCH/SPEC、specs/CONTRACTS.md、TASK-001与database handoff、TEST_REPORT、TASK-001-BASELINE、实际相关代码与测试。
- 范围：可信身份、输入/来源边界、数据库所有权与历史、CAS事务及本地竞争重试。
- Git基线：01be53ecb321293f1fef320c4110d6d9c7c6aacd；此前bootstrap/scaffold/workspace与规划变更保留，不归当前任务。

## 检查与证据

| 项目 | 判定与证据 |
| --- | --- |
| 身份与归属 | runtime注入真实requireOwner，仅派生ownerId；所有Prompt/Version/Source查询绑定owner和条目。跨owner/跨条目版本均404，不存在同形；strict schema拒绝客户端owner/parent/currentVersion |
| 写入请求 | 先认证，再精确Origin匹配，Sec-Fetch-Site cross-site拒绝；application/json要求，流式累计body在JSON.parse前限制262144字节并取消超限读取；无正文日志/转发 |
| 纯JSON参数 | superRefine在z.record/z.json前检查plain对象、有限数值、深度20、禁__proto__/constructor/prototype；预检成功才stringify及16KiB UTF8限制。深层输入不会先进入递归JSON schema；正文/负面词/标签/notes等有限值 |
| 外部来源 | URL仅http(s)、最长2048、无username/password，只持久化元数据；无fetch/axios/eval/模板执行/HTML直出。测试fetch spy零调用，不声称对远端页面实际验证 |
| SQL与事务 | Drizzle绑定owner/id/expectedVersion，sql.raw只用于固定内置迁移。CAS先读本人锁并条件更新，追加内容与currentVersion/source同事务；失败回滚，不静默覆盖；409只附本人当前锁/指针 |
| 有限竞争重试 | 仅结构化error.code===SQLITE_BUSY，最多4次重试，20/40/60/80ms等待；不根据message/其它错误或不确定远端提交重试。安装Drizzle libsql/session.js catch分支await rollback后传播；没有外部调用。并发与注入source失败回滚测试通过 |
| 历史与关系 | 0002非破坏追加，0001未改；currentVersion三字段DEFERRABLE FK、version parent/prompt/owner复合FK、唯一版本号；触发器禁版本update/delete、Prompt/Source delete。metadata改动不改v1，完整新版本父指针由服务器决定 |
| 暂缓来源 | source_work_id nullable但CHECK要求NULL，避免制造不存在的Work/Job/Plan/Skill关系；未来开放work来源必须新增迁移/FK，不修改0002或回填虚假历史 |
| 范围保护 | 现有Web/db package相对baseline相同，无新增依赖声明；baseline未覆盖root package与lock，不声称这些字节未变。仅条目持久化；无检索/归档/封面/生成/reuse/UI或真实库操作 |

## 实际命令与结果

- `pnpm --filter @praxis/web exec vitest run tests/prompts/persistence.test.ts`：exit0，精确1文件4测试通过；临时实际SQLite，覆盖原文/metadata/版本/ownership、CAS与回滚、UTF8/深JSON/危险字段/URL零网络、HTTP身份Origin与错误envelope/no-store。
- 指定交接/规格/源码cat及关键字rg：成功；确认4实际API路径runtime映射、验证器、事务与固定DDL。源码fetch/axios/console/eval/HTML/环境读文件检索无命中，rg exit1为无匹配。
- 已安装Drizzle session.js只读rg：确认异常分支await libsqlTx.rollback()。
- Python读取BASELINE及非环境文件hash：差异仅handoff范围migrate/schema index/迁移README、已有workspace账本测试、生成env.ts格式和tsbuildinfo；Web/db package未变。未读取环境内容/schema。
- `git diff --check`：exit0。
- 工程最终15测试/type/lint/build exit0引用TEST_REPORT和handoff，不重复构建；不迁移真实库、不初始化账户、不付费或调用供应商。

## 发现、严重度与后续风险

无阻止本任务检查点的范围内发现。

1. **中，未来领域关系门禁**：Work/Job/Plan/Skill表尚不存在；sourceWork暂NULL合理。TASK-004真实集成需有序新迁移、同owner/job/textHash等关系校验及旧历史保护，不得绕过触发器改原版本。
2. **低，未来展示边界**：存储文本/URL作为数据不等于允许HTML/自动访问。后续UI保持React转义、外部链接安全属性；封面只能本人生成结果，不加载社交照片或触发供应商。
3. **低，容量/运行限制**：单请求体大小有界，但无慢请求超时或累计收藏配额；这是个人本地场景。若未来公开访问须另行服务配置和压力/限流验收。SQLITE_BUSY重试是本地有限恢复，不是提交幂等保证。
4. **低，验证范围**：真实数据库未迁移，浏览器登录到实际API闭环、性能2秒目标与网络CVE审计未做；测试替身验证HTTP守卫接线，可信会话实现继承已通过workspace安全门。不是产品私有全闭环/发布许可。

仅新增本报告及security handoff；不修改源码、依赖、规划或三层状态。

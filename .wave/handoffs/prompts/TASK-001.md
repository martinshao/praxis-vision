---
role: backend-engineer
execution_mode: subagent
status: COMPLETED
module: prompts
task: TASK-001
git_baseline: 01be53ecb321293f1fef320c4110d6d9c7c6aacd
next_node: N5
changed_files:
  - packages/db/src/schema/prompts.ts
  - packages/db/src/schema/index.ts
  - packages/db/src/migrations/0002-prompts.ts
  - packages/db/src/migrations/README.md
  - packages/db/src/migrate.ts
  - packages/db/src/query.ts
  - apps/web/src/server/prompts/validation.ts
  - apps/web/src/server/prompts/service.ts
  - apps/web/src/server/prompts/http.ts
  - apps/web/src/server/prompts/runtime.ts
  - apps/web/src/app/api/prompts/route.ts
  - apps/web/src/app/api/prompts/[promptId]/route.ts
  - apps/web/src/app/api/prompts/[promptId]/versions/route.ts
  - apps/web/src/app/api/prompts/[promptId]/sources/route.ts
  - apps/web/tests/prompts/persistence.test.ts
  - apps/web/tests/workspace-database.test.tsx
  - apps/web/src/env.ts
  - .wave/handoffs/prompts/TASK-001-IMPLEMENTATION.md
  - .wave/handoffs/prompts/TASK-001-database.md
  - .wave/handoffs/prompts/TASK-001.md
commands:
  - command: pnpm typecheck
    exit_code: 0
  - command: pnpm lint
    exit_code: 0
  - command: pnpm test
    exit_code: 0
  - command: pnpm build
    exit_code: 0
  - command: pnpm --filter @praxis/web exec vitest run tests/prompts
    exit_code: 0
verification:
  - Disposable real SQLite via libsql, migrations replay and 4 Prompt tests; total project 15 tests pass.
  - Exact original v1, metadata-only mutation, immutable historical version, owner and prompt/version relationship checks.
  - Competing CAS commits exactly one append; losing transaction returns VERSION_CONFLICT; injected source failure rolls back CAS.
  - UTF8 parameter byte limit, deeply nested JSON rejection, strict request fields, URL metadata with no fetch, auth/origin/no-store/envelope checks.
risks:
  - Real workspace database and owner remain uninitialized; no real migration or account operations.
  - Future job/plan/work/skill tables absent, nullable provenance integration deferred without manufacturing tables/history.
  - Trial/Cover/list/search/duplicate/archive/reuse/UI are later tasks, no complete product acceptance claim.
---

## 完成内容

数据库工程师串行负责 schema/0002 迁移，详细DDL验证见 TASK-001-database.md。保持 praxis_migrations 有序账本，0001不改。Prompt.currentVersion 三字段 deferred FK、version parent owner/条目复合 FK、不可更新/删除 trigger 保留历史；sourceWorkId nullable 且暂限制NULL，未来真实 Work 表集成须新增迁移。

服务分离 metadata 和完整不可变正文，首次原文原样保存；textHash仅规范换行/首尾空白用于以后检索，索引非唯一，TASK-002前不实现重复提示。未知题材默认other/待整理inbox，无图片/模型前置要求。元数据和来源追加用 expectedVersion CAS；新增版本由服务器当前版确定parent，事务更新指针与CAS。详情仅一份选定全文、最近24元数据/来源，版本列表24/max100分页。

POST /api/prompts、GET/PATCH /api/prompts/:id、GET/POST /versions、POST /sources 已接入可信 requireOwner。客户端owner/parent/currentVersion等字段拒绝。未认证401、不存在/跨owner或跨条目版本404、写Origin+Sec-Fetch-Site校验、乐观锁409携带当前锁与指针、成功/失败requestId和no-store。JSON请求262144字节界限；正文/负面词/标签/notes按ARCH，名称80沿共享名称约束；参数先深度20与纯数据/危险键校验再JSON schema及16KiB UTF8限额，URL http(s)无userinfo只保存、不抓取。

SQLite竞争可能在CAS前以明确 `SQLITE_BUSY` 拒绝事务。仅该结构化错误code做最多4次20/40/60/80ms本地回滚事务重试，后续读到winner提交返回409；不根据message重试，不重试任何其它错误/不确定提交，不包含外部调用。installed Drizzle libsql transaction异常分支先await rollback再向调用者传播错误。

## 命令与结果

- db类型与临时内存SQLite DDL命令见数据库handoff，最终0。
- 初次 `pnpm typecheck` exit2：Web没有声明drizzle-orm，改为db/query重导出现有依赖，不新增依赖；测试加入后第二次exit2：mutate结果unknown，修复泛型返回类型。最后 `pnpm typecheck` exit0。
- 初次 `pnpm --filter @praxis/web test -- prompts` exit1：实际Vitest `-- prompts`仍跑全项目；旧workspace账本长度1与新增0002冲突，改为验证0001单项；参数危险键先经过z.record被剥离，改为纯数据precheck。精确使用 `pnpm --filter @praxis/web exec vitest run tests/prompts` 最终exit0，4/4。强化并发最初发现loser SQLITE_BUSY，修复有限本地重试后409断言通过。
- `pnpm test` 最终exit0：5文件15测试通过（含4 Prompt，保留11既有测试）。
- scoped `biome check --write` 仅任务代码和受影响workspace测试，初次exit1为多变量declarator，手动拆分根因；最后exit0。
- `pnpm lint` 最后exit0：105文件通过。项目脚本先format:generated，自动格式化apps/web/src/env.ts（生成类型声明，未读取/编辑.env）；该副作用列在changed_files。直接只读biome曾在build并行重新生成env.ts时exit1，串行build完成再正式lint恢复0。无新增压制错误。
- `pnpm build` 最后exit0：Next16.3.5生产构建成功，4新API路径动态，原21壳保持。标准build由Varlock读取运行配置，未主动读取/编辑.env、未发供应商或初始化真实DB。
- typegen/build更新忽略的tsconfig.tsbuildinfo cache；未改三层工作流状态、TASKS或规划正文，未提交/推送/部署。

## 仍待验证

父流程 N5核验、N6审查、安全与QA；本handoff不替代任务完成门。未做真实浏览器会话调用/性能2秒实测/业务页面/生成效果。URL零请求验证针对服务+HTTP入口fetch替身断言；没有外链联机抓取。sourceWork/null来源待真实领域表出现后在TASK-004集成，不伪造未来表或旧任务来源。

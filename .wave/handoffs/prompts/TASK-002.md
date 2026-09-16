---
role: backend-engineer
execution_mode: subagent
status: COMPLETED
module: prompts
task: TASK-002
git_baseline: 01be53ecb321293f1fef320c4110d6d9c7c6aacd
next_node: N5
changed_files:
  - packages/db/src/index.ts
  - packages/db/src/query.ts
  - apps/web/src/server/prompts/service.ts
  - apps/web/src/server/prompts/validation.ts
  - apps/web/src/server/prompts/http.ts
  - apps/web/src/app/api/prompts/route.ts
  - apps/web/src/app/api/prompts/[promptId]/archive/route.ts
  - apps/web/src/app/api/prompts/[promptId]/restore/route.ts
  - apps/web/tests/prompts/search.test.ts
  - apps/web/tests/prompts/write-queue.test.ts
  - apps/web/src/env.ts
  - .wave/handoffs/prompts/TASK-002-IMPLEMENTATION.md
  - .wave/handoffs/prompts/TASK-002-database.md
  - .wave/handoffs/prompts/TASK-002.md
---

## 完成内容

- GET /api/prompts：query 搜索当前版正文/title/notes；topic/platform/model/favorite/tags/archived 筛选，平台来源 EXISTS 不重复条目，模型只查当前版。tags 采用可重复 URL 参数，各项 AND；其余重复 query 字段拒绝 400。无新依赖、向量库、外链请求或生成调用。
- 返回仅元数据及当前正文前 180 字摘要，不返回所有长文/参数/来源全集；createdAt、id 降序 keyset cursor（毫秒:UUID），默认 24/max100；时间有界、格式严格、SQL 绑定、LIKE %/_/反斜杠字面转义。
- POST create 事务内按同 owner 任意历史版本规范 textHash 查重并按 promptId 去重（含归档）；DUPLICATE_PROMPT 409 返回最多24个本人 duplicateIds/duplicatePrompts{id,archivedAt}，不含原文/他人引用。allowDuplicate:true 才明确另存；同 URL 不自动合并，追加来源沿用已有 addSource+expectedVersion，v1 不变。
- POST archive/restore：严格 expectedVersion CAS，只改 archivedAt/updatedAt/乐观版本，保留所有版本、来源/currentVersionId；默认列表排归档，archived=true 仅归档，详情/历史版本仍可读，归档禁止常规编辑。不存在/越权404，冲突409。
- API 沿用 requireOwner、写 Origin/CSRF、JSON envelope、requestId/no-store 和输入字节限值。新增读列表无 Origin 要求但必须认证。
- 串行委托 database-engineer 实现按真实文件身份的 withDatabaseWrite，create 和 CAS 整事务共用本地队列，含提交完成后才释放；失败保持原异常并允许后续操作，不同内存实例/文件独立。只扩展已有查询操作 re-export，无结构迁移或领域表虚构。

## 实际验证命令与结果

| 命令 | 实际结果 |
| --- | --- |
| pnpm --filter @praxis/web exec vitest run tests/prompts | 初始 exit1：独立客户端明确另存并发 SQLITE_BUSY；修复后最终 exit0，3文件/13测试 |
| pnpm --filter @praxis/web exec vitest run tests/prompts/search.test.ts | 诊断期间 exit1；保留独立客户端并发用例，未放宽断言 |
| pnpm typecheck | exit0，Next typegen + TypeScript |
| pnpm lint | 最终 exit0，109文件；既有 format:generated 自动格式化 typed env.ts |
| pnpm test | 最终 exit0，7文件/24测试 |
| pnpm build | 首轮 exit0但 helper whole-project tracing 警告；修复后最终 exit0、无该警告，archive/restore/list 动态路由均构建成功 |
| pnpm exec biome check apps packages package.json pnpm-workspace.yaml biome.json | build 后直接只读检查 exit1，仅 Varlock 重生 typed env.ts 默认格式；按既有 pnpm lint 格式化后 exit0 |
| pnpm exec biome check --write [本任务八个源/测试文件] | 初始 exit1（测试 import/单变量声明），已修根因，最终 exit0 |
| pnpm --filter @praxis-vision/db check-types | 数据库角色执行 exit0 |
| pnpm --filter @praxis/web test tests/prompts/write-queue.test.ts | 数据库角色执行 exit0，3项队列测试 |

上述构建/检查正常由 Varlock 加载开发环境，无主动读取/编辑 .env、秘密 schema、凭据或配置值。最后 lint 的生成格式副作用仅 apps/web/src/env.ts 字节相对基线改变，纯自动类型声明格式；packages/db/src/env.ts 与基线相同。没有业务文件压制 TypeScript/lint/test 错误；该生成文件已有 @ts-nocheck 来自官方生成器，未新增压制。原未提交工作全部保留。

## 测试证据

临时真实 SQLite 文件创建于系统 tmp 并 finally 删除：中文/字面 LIKE/SQL注入词、当前模型切版、同平台多来源无重复、AND tags、多题材、摘要限值、同时间游标分页无漏重、owner读写隔离、旧版规范hash与归档重复提示、明确另存/同URL独立条目/追加来源保v1、两个独立客户端并发默认一成功一409与明确另存两成功、归档CAS并发/冲突/历史可读/恢复保全部关联、HTTP严格query/重复字段/Date上界/认证/Origin/no-store/envelope、fetch零调用。队列测试包含同文件等价URI客户端串行、错误原样传播后恢复、不同文件/独立memory并行。

## 诊断与保留风险

- 安装的 Drizzle/libsql 源码只读诊断，无 vendor 补丁。libsql write 事务先 BEGIN，Drizzle 不提供错误发生阶段且 commit 失败后也回 rollback；泛 SQLITE_BUSY 不等于已回滚。撤销 TASK-001 的泛 BUSY 事务重放以防不确定提交被重复执行，队列不盲重试 SQL；其他进程或未采用队列的写争用仍由 SQLite 仲裁，失败 API 503，调用方需核实/重试。
- withDatabaseWrite 是进程内且不可重入；不得持锁时再等待同文件 helper。未来其他领域本地事务应复用此写队列；不保证跨进程排队或补救数据库损坏。
- 尚无 Trial/Job/Work/Cover：trialState=untried 当前可筛；tried/unrated/satisfied/improve 返回明确 CAPABILITY_UNSUPPORTED 422，不造假已有试用或封面。TASK-003 必须接真实当前版 Trial 数据与评价筛选。
- 真实数据库/账号未操作，无迁移、账号初始化、付费试用、生图、外链抓取、提交/推送/部署。前端页面仍占位，端到端UI、查找效率与2秒目标未实测，后续任务验收；不勾整项产品AC。

实现角色已完成，待根 N5验证/N6审查/N7安全与QA；未修改 STATUS/RUN_STATE/TASKS/规划物料或选择 TASK-003。

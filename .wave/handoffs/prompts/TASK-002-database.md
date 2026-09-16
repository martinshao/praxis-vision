# prompts/TASK-002 Database write concurrency handoff

## 执行结果

- 角色：database-engineer
- execution_mode：subagent
- 状态：COMPLETED
- 修改文件：`packages/db/src/index.ts`、`apps/web/tests/prompts/write-queue.test.ts`
- 完成内容：为 createDb 登记实际数据库身份，导出 `withDatabaseWrite(db, operation)`。同一文件的独立客户端共用进程内串行队列；URI 解码、绝对路径及 realpath 统一身份；独立内存数据库和不同文件不共享锁。整个 operation（包括 commit）完成后才释放队列；失败传播原始错误并释放队列，后续操作正常执行；空队列条目清理。
- 执行命令：`pnpm --filter @praxis-vision/db check-types`；`pnpm exec biome check --write packages/db/src/index.ts apps/web/tests/prompts/write-queue.test.ts`；`pnpm exec biome check packages/db/src/index.ts apps/web/tests/prompts/write-queue.test.ts`；`pnpm --filter @praxis/web test tests/prompts/write-queue.test.ts`。
- 验证结果：全部 exit 0；3 项测试通过，验证同文件不同 URI 客户端串行、失败释放和后续恢复、不同文件并行、独立内存数据库并行。临时 SQLite 文件仅建立于系统临时目录并最终删除。
- 风险：队列仅保护本进程采用此 helper 的写操作，跨进程仍由 SQLite 仲裁；不得在持锁 operation 内嵌套等待同文件 helper，否则会自锁。未新增依赖、迁移或修改 .env；未触碰业务规划和运行状态。
- 建议下一阶段：父代理将 create/mutate 整个 db.transaction 放入 helper 后 VERIFYING，保留独立客户端并发业务测试。

## 诊断依据

已只读检查安装的 @libsql/client 0.18.0 `lib-esm/sqlite3.js` 与 Drizzle `libsql/session.js`。本地客户端 transaction 默认 write 模式，建立 BEGIN 后独占池连接直至 commit/rollback。原并发测试的首轮失败可能发生在 BEGIN，而此前观察的 cannot commit SQL statements in progress 发生在 COMMIT，不能用泛 SQLITE_BUSY 判断是否可安全重放事务。Drizzle transaction 未向调用方提供明确失败阶段，盲目重试可能将不确定提交重新执行。本 helper 不重试任何 SQL 或 commit，保留错误及数据库约束，避免进程内争抢写锁。

查重必须继续在事务内完成；队列不是查重约束或跨进程锁的替代品。本任务不通过缩减独立客户端测试或吞掉锁错误使验证通过。

## 审查收口

createDb 在打开 client 前计算路径身份，规范化异常不会遗留已打开的连接。不存在的数据库文件继续规范化至真实父目录，但采用运行时字符串组合保留路径后缀及根目录分隔符，不使用动态 path.join；避免 Turbopack 将运行时数据库身份错误识别为需要追踪的整个工程资源。没有忽略构建警告、调整 tracing 排除或压制检查。父代理负责重新验证构建。

# prompts/TASK-001 Database handoff

## 执行结果

- 角色：database-engineer
- 执行模式：subagent
- 状态：COMPLETED
- Git 基线：01be53ecb321293f1fef320c4110d6d9c7c6aacd
- 修改文件：packages/db/src/schema/prompts.ts、schema/index.ts、migrations/0002-prompts.ts、migrate.ts、migrations/README.md，以及此 handoff。
- 完成内容：Prompt/Version/Source 共享 schema；非空 currentVersion 复合 deferred FK；owner.userId 所有者 FK；版本与来源同条目 owner 关系；版本号唯一、owner/hash 非唯一；版本不可更新/删除，Prompt/Source 不可删除；expectedVersion 初始1；串行0002账本迁移，0001不改。
- 字段约定：导出 prompt / promptVersion / promptSource。tags 为 string[] JSON，declaredParameters 为 Record<string,unknown> JSON；时间 timestamp_ms Date。nullable内容字段允许 null。来源仅 URL，sourceWorkId 必须 null。

## 执行命令与结果

- `pnpm --filter @praxis-vision/db check-types`：首次 exit 2（循环 FK 初始化类型推断）；通过给 extra-config callback 标注 SQLiteTableExtraConfigValue[] 解决推断根因。末次 exit 0。
- `python3 /tmp/praxis-prompts-schema-check.py`：exit 0。真实临时内存 SQLite，fresh 与 existing 均通过；检查版本不可更新/删除、Prompt 不可删除、跨 owner 拒绝、跨条目 parent 拒绝、跨条目 currentVersion 在 commit 拒绝、同 hash 可另存、work 来源拒绝、URL 来源插入、PRAGMA foreign_key_check 无问题、旧 verification 保留。该临时脚本不在产品源码中，不是虚构数据库服务测试。
- `pnpm exec biome check --write packages/db/src/schema/prompts.ts packages/db/src/schema/index.ts packages/db/src/migrations/0002-prompts.ts packages/db/src/migrate.ts`：exit 0，格式化范围内文件。
- 同范围 `pnpm exec biome check ...`：末次 exit 0，无修复。

## 风险与未验证项

- 临时 SQLite 校验验证DDL和约束，账本runner新建/已有/replay由父服务测试覆盖；此子范围不宣称已验证runner重放。
- schema无法描述 SQLite deferred FK及触发器，必须使用 application-ledger migrateDatabase，禁止混用 drizzle-kit push/generate/migrate 覆盖。
- Work/Job/ShotPlan/Skill真实领域表尚不存在，因此未虚构创建，未新增旧快照字段或历史来源。sourceWorkId nullable但受 NULL CHECK 保护，未来真实表集成必须新迁移加FK并开放 work source，不能改0002。
- 真实数据库、账号、生产环境未接触；未读取/修改.env，未新增依赖，未提交推送部署。
- 建议下一阶段：VERIFYING，父代理执行领域/API事务及migration runner测试，再交安全和QA。

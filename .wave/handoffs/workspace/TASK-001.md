---
role: backend-engineer
execution_mode: subagent
status: COMPLETED
module: workspace
task: TASK-001
git_baseline: 01be53ecb321293f1fef320c4110d6d9c7c6aacd
next_node: N5
changed_files: "完整文件清单见正文"
commands: ["pnpm --filter @praxis/web test -- workspace", "pnpm typecheck", "pnpm lint", "pnpm build", "pnpm --filter @praxis-vision/db check-types"]
verification: ["11测试通过", "类型检查通过", "lint通过", "构建通过", "真实临时PTY初始化及重复三次通过"]
risks: ["真实所有者未初始化", "真实数据库未迁移", "后续领域API必须调用可信守卫", "Node24运行器版本要求"]
---

## 完成内容

关闭 Better Auth 邮件密码注册；会话创建钩子仅接受数据库单例 Owner。HTTP 只开放 GET get-session、POST sign-in/email 与 sign-out；状态改变要求精确 Origin，原库 CSRF/cookie 签名机制保留。可信守卫校验服务端签名会话、有效期及 Owner，并只从该身份派生 ownerId。其他端点、伪造/过期/他人会话拒绝，不返回他人资料。错误使用通用契约 envelope；Better Auth 成功保留 SDK 的认证协议（领域 API 后续使用共享 data envelope）。429 与 Retry-After 保留，5xx 归 503，内部错误不回传。

数据库交接见 TASK-001-database.md；首次 auth 四表及 Owner 单例/FK，事务非破坏迁移与幂等初始化，不认领已有用户、不修改重复初始化的密码/会话。新 praxis_migrations 为权威迁移账本，根与 db-package scripts 使用同一 runner；旧 drizzle-kit generate/push 不得混用。以后增加不可变版本对象并追加 migrate.ts 有序清单，测试首次/升级/复跑。

本地 CLI 仅接受显式本地文件 URL、不载入 .env。Node24 strip-types + 仅项目指定源目录的相对 TS resolve hook，密码仅交互 TTY 隐藏输入，取消恢复 raw mode；没有密码 argv/env/log。提供迁移和本人账户初始化操作说明，没有操作真实数据库或真实账户。

## 修改文件

- package.json
- packages/db/package.json
- packages/db/src/schema/index.ts
- packages/db/src/schema/owner.ts
- packages/db/src/migrate.ts
- packages/db/src/migrations/0001-workspace.ts
- packages/db/src/migrations/README.md
- packages/db/src/initialize-owner.ts
- packages/auth/src/index.ts
- apps/web/src/app/api/auth/[...all]/route.ts
- apps/web/src/server/auth/session.ts
- apps/web/src/server/auth/http.ts
- apps/web/src/server/auth/initialize.ts
- apps/web/scripts/private-workspace.mjs
- apps/web/scripts/README.md
- apps/web/tests/workspace-database.test.tsx
- apps/web/tests/workspace/auth.test.ts
- apps/web/tests/workspace/cli.test.ts
- apps/web/vitest.config.ts

- .wave/handoffs/workspace/TASK-001-IMPLEMENTATION.md
- .wave/handoffs/workspace/TASK-001-database.md
- .wave/handoffs/workspace/TASK-001.md

## 命令与证据

- `pnpm --filter @praxis/web test -- workspace`：最终 exit 0，4 文件 / 11 测试；涵盖临时 SQLite 迁移两次、旧数据保留、单例/FK、旧账户拒绝认领、初始化幂等冲突/不重设密码、真实签名 cookie 登录、错误密码、他人账户/会话、伪造/过期 cookie、关闭注册、Origin、端点白名单、429/5xx错误边界与实际 CLI 迁移/非法参数/非TTY拒绝。
- `pnpm typecheck`：exit 0，Next 路由类型与 TypeScript 通过。
- `pnpm lint`：exit 0，全项目93文件检查。已有 format:generated 脚本格式化生成 env.ts；没有读取或编辑 .env/schema。构建插件仍正常加载运行时环境，未输出环境值。
- `pnpm build`：exit 0，Next16.3.5构建与类型通过。
- `pnpm --filter @praxis-vision/db check-types`：exit 0（数据库辅助/最后迁移列表修正后）。
- `pnpm exec biome check --write <任务列出的代码与配置>`：exit 0，格式化/导入整理，无规则压制。
- Python 标准库临时 PTY 实际执行 Node24 initialize-owner，首次+重复三次：exit 0，密码未出现在TTY输出；临时库自动删除。

早期 typecheck 因测试错误包导出/直接依赖及废弃 Vitest 配置失败(exit2)，已修正、未加依赖或压制错误。一次 PTY 隐藏断言发现显示密码提示早于 raw 模式的竞态，已改为先 raw/监听再显示提示，三次实际复验通过。Node strip-types 不支持参数属性，已改显式字段。

## 限制与风险

- 未创建真实所有者、未迁移真实数据库；operator 需根据 scripts/README.md 对正确私有文件执行设置，默认拒绝未初始化身份。
- TASK-003 登录表单/页面跳转、TASK-002项目归档、Prompt与媒体API未实现；页面仍为占位，没有宣称AC001/AC010全闭环完成。
- 此任务提供复用守卫，后续每个领域API必须调用并使用派生 ownerId，不能接受客户端归属字段。
- Node24运行器的 TypeScript/module hooks 有版本要求，未新增运行器依赖。
- 保留已有未提交 bootstrap/scaffold/规划；没有提交、推送或部署，没有改运行状态/任务勾选。
- 需父流程 N5/N6、独立安全与 QA 后才可标完成。

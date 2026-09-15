# 本轮技术决策与来源

## 技术方案与唯一目标

用户已选择 Better-T-Stack 并授权推荐组合：pnpm workspace；唯一 Web 应用 `apps/web`；Next.js App Router、React、TypeScript、Tailwind CSS、shadcn/ui；self 全栈后端；SQLite + Drizzle；Better Auth；Biome。CLI runtime 固定 none（self 模式要求），实际 Web 和独立 worker 使用 Node.js。媒体存在公开目录外的 `data/media`。生成版本与依赖在 bootstrap handoff 和锁文件固定；当前未生成业务工程。

- Next 页面入口 `apps/web/src/app`，动态参数使用 `[id]`；界面模块 `apps/web/src/features/{module}`。
- HTTP 契约入口 `apps/web/src/app/api`；领域服务 `apps/web/src/server/{module}`；数据库 schema / 迁移 `packages/db`，Web 注入私有本地连接；共享类型与校验 `apps/web/src/contracts`。
- 全局基础包含 Better Auth 的单所有者会话、关闭注册 / 公共分享，仅允许预配置所有者登录；无邮件流程、组织与团队功能。数据库私有资源必须校验可信会话和 ownerId。
- SQLite 与文件存储作为个人本地 / 单实例服务方案；不部署到无持久磁盘的无状态运行环境。默认仅 loopback，公开部署另行授权。
- 测试：Vitest（领域 / 数据 / 服务）、Testing Library（界面）、Playwright（浏览器闭环）；这些是工程任务中拟创建的工具，当前无依赖安装。
- 规划命令契约：根目录 `pnpm dev`、`pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm test:e2e`、`pnpm build`、`pnpm db:migrate`、`pnpm worker`。APP-SHELL-001 建立基础 scripts，工作区任务建立 db scripts；studio/TASK-003 建立 worker script；执行前检查真实 package.json，不把当前不存在命令报告为已通过。
- 用户原话：“采用 Better-T-Stack，具体组合由你推荐”。platform-bootstrap 是唯一工程初始化任务；APP-SHELL-001 扩展生成的 apps/web，不重复创建项目。详见 specs/platform-bootstrap/BOOTSTRAP.md（从模块目录为 ../platform-bootstrap/BOOTSTRAP.md）。共享 auth / db / ui / config 沿用生成器包，领域规则在业务任务实现。SQLite 客户端使用生成器兼容的本地文件连接，由 bootstrap 实际依赖核验；不强行假定 better-sqlite3。

## 供应商接入策略

当前规划采用可替换的 GenerationProvider / ExtractionProvider 契约。生图账户、模型与辅助提炼模型未选定，不臆造服务访问权限或费用。`studio/TASK-001` 是接入前置核查：先取得用户所选服务资料，确定文本生图、人物参考、结果保存、状态查询和数据使用条件；不能进入真实生成阶段以前跳过它。业务与接口测试可用测试替身；测试数据和替身只在测试范围，不当作真实产品结果。

OpenAI 是已核查的接口参考，不是用户已经批准的供应商。可选参考适配器采用 Images generations / edits，模型通过已验证配置注入；未知远端结果不假装具备独立查询 / 取消接口。实际选择其他服务时只调整适配器及能力表；改变 PRD 控制承诺时回到 P2。

AI 提炼同样需要结构化文字能力接入；未接入时展示不可用原因和手工创建入口，不能把手工创建当作完整 AI 提炼已交付。

## 实时资料（2026-09-15 查阅）

- [Next.js 安装](https://nextjs.org/docs/app/getting-started/installation)：App Router / TypeScript 初始化支持与 Node 版本要求；实际使用版本在 scaffold 时锁定。
- [Drizzle SQLite](https://orm.drizzle.team/docs/sqlite/get-started-sqlite)：SQLite 与 better-sqlite3 支持。
- [Better Auth options](https://better-auth.com/docs/reference/options)：支持关闭邮件密码注册。单所有者允许列表属于本项目服务端约束，并非声称库自动提供。
- [OpenAI 生图](https://developers.openai.com/api/docs/guides/image-generation)：文字生成与图像编辑 / 参考输入、图片输出；仅参考能力，不保证人物或像素完全一致。
- [OpenAI 数据控制](https://developers.openai.com/api/docs/guides/your-data)：API 内容默认不用于训练但存在数据保留条件；本轮不承诺零保留，实际选择时再次核查账户和对应接口。

## 运行前门

服务身份、私有媒体读取、关闭注册和归属隔离必须验证；供应商未选定不能执行实际生成或提炼。缺少凭据保持未配置，不读取现有 .env；用户运行时从安全环境提供。所有模型效果与成本仍按 PRD 实验验证，不在本轮造结论。

Better-T-Stack 实时 CLI 3.43.0 help 与无写入 dry-run 通过，完整显式命令与恢复约束见 specs/platform-bootstrap/BOOTSTRAP.md。Node v24.15.0；pnpm 实际版本见 BOOTSTRAP 记录。

# 应用壳技术架构

物料状态：READY

## 唯一工程目标

## 技术方案与唯一目标

用户已选择 Better-T-Stack 并授权推荐组合：pnpm workspace；唯一 Web 应用 `apps/web`；Next.js App Router、React、TypeScript、Tailwind CSS、shadcn/ui；self 全栈后端；SQLite + Drizzle；Better Auth；Biome。CLI runtime 固定 none（self 模式要求），实际 Web 和独立 worker 使用 Node.js。媒体存在公开目录外的 `data/media`。生成版本与依赖在 bootstrap handoff 和锁文件固定；当前未生成业务工程。

- Next 页面入口 `apps/web/src/app`，动态参数使用 `[id]`；界面模块 `apps/web/src/features/{module}`。
- HTTP 契约入口 `apps/web/src/app/api`；领域服务 `apps/web/src/server/{module}`；数据库 schema / 迁移 `packages/db`，Web 注入私有本地连接；共享类型与校验 `apps/web/src/contracts`。
- 全局基础包含 Better Auth 的单所有者会话、关闭注册 / 公共分享，仅允许预配置所有者登录；无邮件流程、组织与团队功能。数据库私有资源必须校验可信会话和 ownerId。
- SQLite 与文件存储作为个人本地 / 单实例服务方案；不部署到无持久磁盘的无状态运行环境。默认仅 loopback，公开部署另行授权。
- 测试：Vitest（领域 / 数据 / 服务）、Testing Library（界面）、Playwright（浏览器闭环）；这些是工程任务中拟创建的工具，当前无依赖安装。
- 规划命令契约：根目录 `pnpm dev`、`pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm test:e2e`、`pnpm build`、`pnpm db:migrate`、`pnpm worker`。APP-SHELL-001 建立基础 scripts，工作区任务建立 db scripts；studio/TASK-003 建立 worker script；执行前检查真实 package.json，不把当前不存在命令报告为已通过。
- 用户原话：“采用 Better-T-Stack，具体组合由你推荐”。platform-bootstrap 是唯一工程初始化任务；APP-SHELL-001 扩展生成的 apps/web，不重复创建项目。详见 specs/platform-bootstrap/BOOTSTRAP.md（从模块目录为 ../platform-bootstrap/BOOTSTRAP.md）。共享 auth / db / ui / config 沿用生成器包，领域规则在业务任务实现。SQLite 客户端使用生成器兼容的本地文件连接，由 bootstrap 实际依赖核验；不强行假定 better-sqlite3。

## 允许边界

在 platform-bootstrap 已验证的 apps/web 上添加页面壳、测试与命令别名；共享主题和原语位于 packages/ui，沿用 root workspace 配置与锁文件，不重复初始化。保留 .wave / AGENTS / Git；检查真实生成目录及 handoff。

路由清单来自 DESIGN.md，增加 /sign-in 作为私有访问的必要会话入口，scaffold 只占位；workspace 任务实现实际单所有者身份。既有框架示例代码仅清理无关示例，不移除错误与测试保护。

## 占位约束

所有页面只包含标题、说明、占位区和未实现标识；无 API、业务数据、真实表单、Mock 结果。应用壳可以有导航、面包屑、404 与错误边界。业务源码仅在各自 feature 任务加入。

## 检查

APP-SHELL-001 唯一 scaffold；建立可运行基础 dev / typecheck / lint / test / build 和 e2e scripts，空阶段测试以导航与路由检查为主。技术 auth / database 来自 bootstrap；私有规则与领域 schema 在 workspace 任务添加，worker 在 studio/TASK-003 添加。根 scripts 必须对应真实文件，不写吞掉失败的命令。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
新增/prompts、/prompts/new、/prompts/:promptId三页面壳；对应Next app/prompts/page.tsx、new/page.tsx、[promptId]/page.tsx。主导航为项目、人物、Prompt、摄影技能、摄影风格、作品；快捷生成常驻，归档次级。详情面包屑Prompt→[名称]，无权限/404回本人库。APP-SHELL-001增加这些导航和占位壳，仅标题/说明/未实现区域，不写真实表单、API、任务调用或Mock。具体Prompt业务在prompts/TASK-005。

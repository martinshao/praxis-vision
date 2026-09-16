# 私有工作区与项目技术架构

物料状态：READY

## 来源

MODULE.md、DESIGN.md、UI.md；INIT PRD v3；共享契约 ../CONTRACTS.md 和 ../../TECH_DECISIONS.md。

## 技术方案与唯一目标

用户已选择 Better-T-Stack 并授权推荐组合：pnpm workspace；唯一 Web 应用 `apps/web`；Next.js App Router、React、TypeScript、Tailwind CSS、shadcn/ui；self 全栈后端；SQLite + Drizzle；Better Auth；Biome。CLI runtime 固定 none（self 模式要求），实际 Web 和独立 worker 使用 Node.js。媒体存在公开目录外的 `data/media`。生成版本与依赖在 bootstrap handoff 和锁文件固定；当前未生成业务工程。

- Next 页面入口 `apps/web/src/app`，动态参数使用 `[id]`；界面模块 `apps/web/src/features/{module}`。
- HTTP 契约入口 `apps/web/src/app/api`；领域服务 `apps/web/src/server/{module}`；数据库 schema / 迁移 `packages/db`，Web 注入私有本地连接；共享类型与校验 `apps/web/src/contracts`。
- 全局基础包含 Better Auth 的单所有者会话、关闭注册 / 公共分享，仅允许预配置所有者登录；无邮件流程、组织与团队功能。数据库私有资源必须校验可信会话和 ownerId。
- SQLite 与文件存储作为个人本地 / 单实例服务方案；不部署到无持久磁盘的无状态运行环境。默认仅 loopback，公开部署另行授权。
- 测试：Vitest（领域 / 数据 / 服务）、Testing Library（界面）、Playwright（浏览器闭环）；这些是工程任务中拟创建的工具，当前无依赖安装。
- 规划命令契约：根目录 `pnpm dev`、`pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm test:e2e`、`pnpm build`、`pnpm db:migrate`、`pnpm worker`。APP-SHELL-001 建立基础 scripts，工作区任务建立 db scripts；studio/TASK-003 建立 worker script；执行前检查真实 package.json，不把当前不存在命令报告为已通过。
- 用户原话：“采用 Better-T-Stack，具体组合由你推荐”。platform-bootstrap 是唯一工程初始化任务；APP-SHELL-001 扩展生成的 apps/web，不重复创建项目。详见 specs/platform-bootstrap/BOOTSTRAP.md（从模块目录为 ../platform-bootstrap/BOOTSTRAP.md）。共享 auth / db / ui / config 沿用生成器包，领域规则在业务任务实现。SQLite 客户端使用生成器兼容的本地文件连接，由 bootstrap 实际依赖核验；不强行假定 better-sqlite3。

## 模块边界与技术层

业务服务只写本模块数据。依赖：无；通过共享类型 / 服务访问上游，不反向依赖下游。UI 不直连供应商或数据库。

## API 契约

所有接口继承 CONTRACTS.md 的认证、ownerId、分页、事务、错误与版本规则。

| 方法 / 路径                           | 输入                      | 输出             |
| ------------------------------------- | ------------------------- | ---------------- |
| `POST /api/projects`                  | name,tags                 | Project          |
| `GET /api/projects`                   | cursor,query              | Project[]        |
| `GET /api/projects/:id`               | id                        | Project          |
| `PATCH /api/projects/:id`             | name,tags,expectedVersion | Project          |
| `GET /api/archive`                    | kind,cursor               | ArchivedEntity[] |
| `POST /api/archive/:kind/:id/restore` | id                        | RestoredEntity   |
| `POST /api/:resource/:id/archive`     | id                        | ArchivedEntity   |

## 数据模型

Owner / Session、Project、统一归档接口；Better Auth 会话表；所有资源 ownerId 规则由共享契约定义。

## UI 状态的技术支撑

- 列表 pending 对应 loading；无 items 对应 empty；字段错误对应 validation；写入事务完成后 success。
- HTTP / 服务错误保留草稿，局部重试；不存在与越权统一 404，未认证 401。
- 容器 expectedVersion 冲突给出最新版本，用户选择后再提交；任务 unknown 不自动再次调用供应商。
- 客户端草稿与已提交快照分开；重新进入先加载服务器版本，离开提醒未保存内容。

## 认证、隐私与安全

只允许配置所有者会话，关闭注册；跨资源引用校验 ownerId。生成素材必须来自服务端 Asset，不能由客户端任意 URL 上传。状态变更校验 Origin / CSRF，会话 cookie HttpOnly / SameSite，生产使用 TLS。

技能提炼资料是不可信数据，不 eval、不自动取 URL、不执行脚本；结构化结果校验失败保留输入。媒体身份校验后代理读取，路径不能用户拼接；数据目录不加入 public，不写凭据到导出或日志。

## 性能、部署与可观测性

个人单实例 SQLite 持久磁盘，生成独立 worker，不依赖浏览器或 HTTP 长请求生命周期。所有者 / 状态 / 创建时间索引、24 条分页、缩略图延迟加载。日志只含 requestId、jobId、错误类别、耗时与可知用量，不记录全文素材。

## 验证与取舍

针对本模块版本、越权、输入边界和失败恢复验证；领域 / 服务测试不能访问真实供应商。实际生图 / 提炼须完成 studio/TASK-001 与当前资料核查，缺服务不可宣称对应功能通过。设计和文档 READY 不等于生成效果通过。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
Prompt归属相同owner，可恢复归档类别kind=prompt；GET /api/archive分页读取Prompt元数据；POST /api/archive/prompt/:id/restore与POST /api/prompts/:id/restore使用同一服务规则，不删除version/trial/cover。聚合层按共享schema查询，无workspace→prompts服务反向依赖。归档页新增Prompt类别；历史引用保持可读，恢复导航到/prompts/:promptId。由prompts/TASK-004、TASK-005实现增量，旧TASK-002/003负责原能力，不重复工作。

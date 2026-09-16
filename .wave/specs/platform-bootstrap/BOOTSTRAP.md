# Better-T-Stack Bootstrap Plan

## 状态与来源

- 状态：READY
- 来源 PRD：../../prd/INIT-PRD.md / INIT v3，确认有效
- 来源 MODULE / ARCH：MODULE.md / ARCH.md
- 选择凭证：用户：“采用 Better-T-Stack，具体组合由你推荐”；本轮推荐已按此授权固定显式组合
- 目标：新建全栈技术骨架

## 目标与目录

- 项目名称：praxis-vision
- 目标目录：/Users/martinshaw/workspace/ai/praxis-vision（命令目标 .）
- 当前目录类型：METADATA_ONLY；根只有 .wave / AGENTS / .gitignore / Git，无 package 或业务源码
- 冲突策略：metadata-only merge；执行前扫描生成文件同名冲突，保留并合并 .gitignore，保护 .wave / AGENTS / Git；发现业务工程阻塞
- Git：--no-git；生成：--no-install；随后单独 pnpm install

## Stack 选择

| 维度                | 选择                   | 来源 / 理由                              | 已确认       |
| ------------------- | ---------------------- | ---------------------------------------- | ------------ |
| frontend            | next                   | 单一 Web 工作台                          | 是，授权推荐 |
| backend             | self                   | HTTP API 在 apps/web，减少独立服务       | 是，授权推荐 |
| runtime             | none                   | CLI self 强制；实际 Node.js Web / worker | 是，授权推荐 |
| database            | sqlite                 | 个人单实例私有持久化                     | 是，授权推荐 |
| ORM                 | drizzle                | 类型与版本模型                           | 是，授权推荐 |
| API                 | none                   | 不额外 RPC；业务 HTTP 契约独立           | 是，授权推荐 |
| auth                | better-auth            | 私有会话基础，所有者规则另实现           | 是，授权推荐 |
| payments            | none                   | 无支付需求                               | 是           |
| addons              | biome                  | 基础 lint / format                       | 是，授权推荐 |
| examples            | none                   | 不生成无关业务样例                       | 是           |
| db-setup / template | none / none            | 本地手工配置，无外部托管                 | 是           |
| deployment          | web none / server none | 当前无发布范围                           | 是           |

## 实时检查与证据

2026-09-15：Node v24.15.0；pnpm 11.5.2；CLI 3.43.0。实时 --help 已确认下列显式选项。首次 runtime node 预检返回 1（self 要求 none），修正后下述 dry-run 返回 0，success=true，项目名 praxis-vision，目录正确，提示 No files were written。没有正式生成或安装项目依赖。

官方参考：[CLI](https://www.better-t-stack.dev/docs/cli)、[兼容性](https://www.better-t-stack.dev/docs/cli/compatibility)、[结构](https://www.better-t-stack.dev/docs/project-structure)。运行时重新核对 @latest 版本、help 及 dry-run；若组合能力变化，回 plan，不静默默认。

### 实时能力检查

```bash
pnpm create better-t-stack@latest --help
pnpm create better-t-stack@latest --version
```

### Dry Run

```bash
pnpm create better-t-stack@latest . --frontend next --backend self --runtime none --database sqlite --orm drizzle --api none --auth better-auth --payments none --addons biome --examples none --db-setup none --template none --web-deploy none --server-deploy none --package-manager pnpm --directory-conflict merge --no-git --no-install --open none --manual-db --disable-analytics --no-render-title --dry-run --verbose
```

### 正式生成（本轮未执行）

```bash
pnpm create better-t-stack@latest . --frontend next --backend self --runtime none --database sqlite --orm drizzle --api none --auth better-auth --payments none --addons biome --examples none --db-setup none --template none --web-deploy none --server-deploy none --package-manager pnpm --directory-conflict merge --no-git --no-install --open none --manual-db --disable-analytics --no-render-title
```

### 安装（生成成功后，本轮未执行）

```bash
pnpm install
```

## 验证

生成器预期根 scripts 为 check-types / check（Biome）/ build；执行前查看真实 package scripts。存在则执行 pnpm check-types、pnpm check、pnpm build；缺失时不能称通过，记录并使用等价实际命令，命令差异写 handoff。Vitest / Playwright 在 APP-SHELL-001 建立，不伪称 bootstrap 测试通过。

## 恢复标记

- dry-run：PASSED（规划预检；正式执行前重跑）
- generation：NOT_STARTED
- install：NOT_STARTED
- validation：NOT_STARTED
- 已生成路径：无
- 安全恢复：等待用户手动 $sw bootstrap；部分生成保留现场，安装失败只恢复安装，不重复创建
- 待确认问题：无初始化配置阻塞；真实生图 / 提炼供应商留 studio/TASK-001 门禁

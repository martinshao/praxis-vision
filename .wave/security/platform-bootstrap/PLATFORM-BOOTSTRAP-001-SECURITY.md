# PLATFORM-BOOTSTRAP-001 安全专项

- 结论：PASSED（仅技术骨架检查点，不是产品安全验收或发布许可）
- 角色：security-engineer
- 日期：2026-09-16
- 范围：官方初始化、锁定依赖、安装脚本许可、环境隔离、模板认证边界、工程忽略规则。
- 输入：AGENTS.md；platform-bootstrap BOOTSTRAP/ARCH/SPEC；授权 handoff；BOOTSTRAP-AUTHORIZED-EVIDENCE.json；实际生成配置与源文件。
- 用户授权：仅官方首次初始化创建 apps/web/.env；未读取、展示或编辑该文件及其他环境文件内容，未验证密钥具体值。

## 检查与证据

| 项目 | 结果 | 证据 |
| --- | --- | --- |
| 官方显式组合与安全边界 | 通过 | 授权证据中的 CLI 3.43.0、完整 generation/dry-run 指令保留 --no-git、--no-install、--manual-db、部署 none、--disable-analytics；生成与最终安装成功 |
| 固定安装来源 | 通过 | pnpm-lock.yaml 固定具体版本与 integrity；未发现 resolution 中自定义 tarball/repo/commit。packageManager 固定 pnpm@11.5.2；@next/env 的 Varlock npm 替换为明确 1.2.2 |
| 第三方构建脚本 | 通过 | pnpm-workspace.yaml 的 allowBuilds 仅 esbuild:true 与 sharp:true，无通配许可。esbuild 各版本安装脚本用途与 SHA256 记录在授权证据；安装修复未新增依赖 |
| 环境访问与客户端边界 | 通过，静态范围 | codegen 输出只有类型和 runtime ENV 代理，没有复制凭据字面量；PublicCoercedEnvSchema 排除 BETTER_AUTH_SECRET/DATABASE_URL。实际 services 在 server 页面与 auth route 引用，客户端组件/lib 未引用 services、env.server 或共享 db/auth 服务 |
| 泄露防护集成 | 通过，静态范围 | next.config.ts 使用官方 varlockNextConfigPlugin；安装的 plugin.cjs 对 sensitive 配置避免静态替换，并实现有条件的客户端构建扫描、响应防护和脱敏。未读取环境 schema，故不声称已独立核验所有运行开关或按秘密值比对产物 |
| 凭据与构建忽略 | 通过 | git check-ignore 对 apps/web/.env 和 .next 产物返回 0；git ls-files 未列出环境秘密文件/构建产物。根与 Web ignore 保护环境文件，Biome 明确排除 .env/.env.*，check 为有界只读检查 |
| 认证技术适配 | 通过，骨架范围 | betterAuth 使用传入 secret、受限 trustedOrigins、nextCookies 与 Drizzle；dashboard server 取得会话，无会话 redirect。未关闭注册、未实现所有者授权是已规划后续领域任务，不计作本技术骨架已验收 |
| 非授权副作用 | 通过 | 磁盘元数据扫描 apps/packages 未发现嵌套 .git 或 SQLite 数据库；授权证据无迁移/seed/deploy/commit/push。现有迁移脚本定义不等于实际执行 |
| 最终工程检查 | 引用有效证据 | 授权 evidence 中 check-types/check/build 均 exit 0；本专项不重复构建。测试框架 NOT_AVAILABLE，交给 scaffold |

## 发现、严重度与处理建议

未发现阻止本次 bootstrap 检查点的范围内问题。

恢复差异说明：父流程在恢复时发现旧 `.wave` 文档表格、任务缩进及空行存在格式变化，raw hash 并非全部相同；父流程对所抽查 tracked characters MODULE/ARCH/TASKS 的差异判定为仅空白，并报告 22 份表格反规范化可恢复旧 hash。安全专项不回滚这些文档，也不声称原文档字节未变；本报告的保护结论限于秘密文件忽略、未发现嵌套 Git/生成数据库及当前技术结构，文档语义/规划有效性由父流程门禁判定。

1. **中（已知后续门禁）**：官方 `/login` sign-up 示例与 auth 邮箱注册仍存在，尚无个人工作区所有者隔离。证据：packages/auth/src/index.ts 的 emailAndPassword.enabled 与模板 sign-up-form。建议：APP-SHELL-001 清理模板，workspace 关闭注册并建立所有者规则，再对登录/注册/越权/CSRF 作运行验收；不得把此报告当成可公开部署结论。
2. **低（防御改进）**：env.server.ts 是 re-export，未额外加入 server-only 导入保护；当前客户端未引用，但未来误引需防范。建议：在 scaffold 的服务边界及导入规则验收中检查，并保持 sensitive 标记和构建泄露防护，不为此专项新增依赖。
3. **低（供应链持续检查）**：锁定与 integrity 仅保证可复现下载，不能证明所有传递依赖无漏洞。pnpm 已记录弃用的 @esbuild-kit 子依赖；本次未执行网络漏洞审计，也未作 CVE 无风险声明。建议：发布准备时按锁文件执行独立依赖审计与官方安全公告核对。

## 执行命令与结果

- `cat`：指定角色/项目规则/规格/授权 handoff、证据、package/workspace/ignore/Biome 配置和非环境源文件，读取成功。
- `rg`：非环境 TS/TSX 中秘密字段、危险操作和客户端服务导入检查；无客户端服务/环境导入、无业务自定义 console/eval/dangerouslySetInnerHTML 命中。锁文件 resolution 无自定义 tarball/repo/commit。
- `rg --no-ignore`、`sed`：仅已安装 Varlock integration 源代码，核对 sensitive/public 与防护实现；成功。首次默认 rg 因 node_modules 忽略没有结果，随后明确 --no-ignore 核对；未据空输出作结论。
- `git check-ignore apps/web/.env apps/web/.next/server/app/index.html`：exit 0，两者受保护。
- `git ls-files` 指定秘密环境/构建路径：无输出；不读取文件内容。
- `git diff --check`：exit 0。
- Python 元数据扫描（跳过 node_modules/.next）及读取 evidence：nested_git_or_db=[]；仅确认开发环境文件存在；最终检查证据均 exit 0。

仅新增本报告与 security handoff；未改业务代码、依赖、状态或 TASKS。

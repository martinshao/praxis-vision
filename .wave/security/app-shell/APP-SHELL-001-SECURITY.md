# APP-SHELL-001 安全专项

- 结论：PASSED（SCAFFOLD_ONLY，页面骨架检查点）
- 角色：security-engineer
- 日期：2026-09-16
- 触发原因：已规划 Vitest4 / Testing Library / jsdom / Playwright 测试依赖安装，涉及锁文件与运行脚本。
- 输入：app-shell TASKS/ARCH/SPEC、APP-SHELL-001 handoff、TEST_REPORT、SCAFFOLD-BASELINE.json、实际壳/页面/测试/配置/锁文件。
- Git HEAD 基线：01be53ecb321293f1fef320c4110d6d9c7c6aacd；已有 bootstrap 与大量 .wave 差异不归于本任务。
- 禁止项遵守：未读取/编辑任何 .env 或环境 schema，未改工程、状态、任务，不生产操作，不重复全套验证。

## 检查及证据

| 项目 | 判定 | 证据 |
| --- | --- | --- |
| 测试依赖与锁定 | 通过 | Web devDependencies 中为规划测试工具；lock 固定 Vitest4.1.11、jsdom30.0.1、Playwright1.63.0 与 Testing Library，具 npm integrity；未发现 resolution 自定义 tarball/repo/commit。实际 `pnpm peers check` exit0，无 peer 问题 |
| 安装脚本边界 | 通过 | workspace allowBuilds 仍仅 esbuild/sharp，无通配扩展；postinstall 保留官方 Varlock codegen，仅追加格式化两个固定生成类型文件，没有读取内容输出或复制环境秘密的命令 |
| 本机测试与开发 | 通过 | Web dev 显式 127.0.0.1:3001；Playwright baseURL/webServer 均 loopback，reuseExistingServer=false、workers=1、使用已安装 Chrome；Vitest 仅 tests/**/*.test.tsx、jsdom、固定 setup。未配置外部服务、浏览器下载/部署或任意参数命令执行 |
| 秘密与日志 | 通过，静态范围 | 壳/页面/测试不引用 ENV/process.env，不输出 console 或 error 原文；生成 env.ts 只有字段声明与运行代理，无 BETTER_AUTH_SECRET/DATABASE_URL 字面量赋值。检查未读取环境值，不声称按实际秘密值比对全部产物 |
| 环境与私有产物忽略 | 通过 | `git check-ignore` 对开发环境、data/media、test-results、playwright-report 全部 exit0；`git ls-files` 指定秘密环境路径无输出。测试 trace retain-on-failure 仅当前占位流程，报告/trace 在忽略目录 |
| 注入与外部调用 | 通过 | 新壳使用固定内部 Link、固定 React 文本；动态详情入口不把 ID 当 HTML/SQL/URL/命令使用。定向 rg 未发现 fetch/axios/eval/dangerouslySetInnerHTML/外部生图请求，唯一 http 地址是 loopback 测试配置 |
| 认证与服务边界 | 通过，骨架范围 | api 扫描仅既有 api/auth/[...all]/route.ts；页面/壳没有 services/auth-client/db 导入，root 布局只导入壳和样式，既有 auth/db 服务保留。移除模板 UI 不等于禁用注册或完成权限 |
| 输入文档保护 | 通过 | 本专项重新计算 SCAFFOLD-BASELINE 所列核心文件 SHA256，仅 app-shell/TASKS 生命周期不同，其他来源核心物料一致；不把此前 bootstrap raw hash 差异归于 scaffold |
| 功能与错误展示 | 通过 | 21 壳页面显式功能尚未实现，不接数据/真实表单；error boundary 输出固定通用信息而非堆栈；noindex 是辅助搜索指令，不当成访问控制 |

## 发现、严重度与后续建议

无阻塞本次 scaffold 检查点的范围内问题。

1. **中，已知业务门禁**：既有 Better Auth 技术 endpoint 尚保留注册能力，壳页面也尚无可信单所有者会话保护；私有工作区文字不是访问控制。建议 workspace 实施关闭注册、所有者校验及 API/媒体越权与 CSRF 运行验收后再评价产品私有性。不能公开部署或声称产品安全已通过。
2. **低，测试数据边界**：Playwright 失败 trace 会保存 DOM/网络信息；当前全部是无数据占位。建议后续登录/生图测试仅使用专用测试身份和虚构素材，禁用真实凭据捕获，报告不得加入 Git 或分享。
3. **低，供应链持续检查**：本次固定依赖/脚本许可与 peer 检查不能证明全依赖无 CVE；未做网络漏洞审计，没有无漏洞声明。发布准备时对实际锁文件作独立审计；测试依赖不得添加至应用页面导入图。
4. **低，服务导入防御**：沿用 bootstrap env.server re-export 尚无额外 server-only 防护；当前无客户端引用。后续领域实现应保持服务导入边界并核验 Varlock sensitive 防护，不在本专项追加依赖。

## 实际命令与结果

- `cat` 指定角色/规格/交接/测试报告/基线与源码/非环境配置：成功。
- `rg` 定向新壳/页面/测试/配置：仅既有 auth route services 导入及本机测试 http 地址；无危险 HTML/命令执行、环境读出或外部生图调用。锁文件版本核对成功，自定义 resolution 检索无命中。
- `git check-ignore apps/web/.env data/media/example.png apps/web/test-results/.last-run.json apps/web/playwright-report/index.html`：exit0，全受保护。
- `git ls-files` 指定秘密环境路径：无输出，仅查看索引路径。
- `pnpm peers check`：exit0，No peer dependency issues found。
- Python：读取核心文档与 baseline 计算 hash，仅 app-shell/TASKS 差异；api route 只有既有 auth；两个生成 env.ts 秘密字面量赋值检测 False（只读生成 TS，不读环境文件）。
- `git diff --check`：exit0。

引用现有 TEST_REPORT/handoff 的最终 typecheck、4项组件测试、5项 E2E通过/1项适用性跳过、build、lint exit0；本专项不重复跑。人工视觉、辅助技术及产品所有者权限仍未验收。

仅新增本安全报告及 security handoff；由父流程完成 QA/N8 并停在用户检查点。

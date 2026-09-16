# APP-SHELL-001 前端交接

- 状态：COMPLETED（实现完成，可进入 N5 VERIFYING；不是任务 [x]）
- 日期：2026-09-16
- 执行角色：frontend-engineer
- execution_mode：subagent
- 子代理：/root/scaffold
- 主模式：scaffold / SCAFFOLD_ONLY
- 唯一任务：app-shell/APP-SHELL-001
- Git 基线：01be53ecb321293f1fef320c4110d6d9c7c6aacd；已有大量 .wave 与 bootstrap 工程未提交，完整保留。
- 输入：app-shell MODULE/DESIGN/UI/ARCH/SPEC/TASKS、TECH_DECISIONS、bootstrap handoff/completion、root 与 Web AGENTS、frontend 角色和适用 refs；实现前读取安装 Next.js 的 layouts/pages、Server/Client、error/loading/not-found 文档。

## 修改

- apps/web/src/app：21 个显式页面入口（含原页替换）、root layout、not-found/error/loading。
- apps/web/src/features/app-shell/{app-shell,placeholder-page}.tsx：共享导航、页壳、面包屑、窄屏原生模态抽屉。
- apps/web/src/index.css：继承 Stitch 深色 tokens、224px 左栏、系统中文字体、8px圆角、响应式与焦点。
- apps/web/package.json：包名 @praxis/web、loopback dev、typecheck/test/test:e2e/lint；type module 保证测试配置 ESM 一致。
- apps/web/{vitest,playwright}.config.ts、tests/{setup.ts,shell.test.tsx}、e2e/shell.spec.ts：规划测试工具与有实际行为断言的状态/路由/键盘测试。
- package.json：真实脚本别名；postinstall/env:generate 及 check 前仅格式化两个官方生成 env.ts 类型声明，解决 Varlock 在 dev/build 重写声明格式造成的 lint 不稳定。未降低任何源码 lint 规则。
- pnpm-lock.yaml：安装规划测试依赖；Vitest4.1.11 与 Better Auth 的 optional peer 匹配。
- biome.json：排除测试运行产物（test-results/playwright-report/coverage），源码仍完整检查。
- .gitignore：私有 data/ 与浏览器测试输出。
- apps/web/src/env.ts、packages/db/src/env.ts：仅官方类型生成器/格式化重写，未更改模式字段语义或读取 .env。

## 模板清理证据

删除 apps/web/src/app/login/page.tsx、dashboard/page.tsx、dashboard/dashboard.tsx；删除模板 components/header、sign-in-form、sign-up-form、user-menu、mode-toggle、loader、providers、theme-provider。
这些模块的使用方均局限于已删除示例页、模板 header 或已替换 root layout；清理后引用检索无残留（rg exit1代表无匹配）。保留 services.ts、auth-client.ts、既有 api/auth/[...all]、所有 auth/db 包；未新增 API 或改认证配置。

## 命令与实际结果

| 命令 | 结果 |
|---|---|
| pnpm --filter web add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test | exit0，规划测试工具安装；最初 Vitest5发现可选peer不兼容 |
| pnpm --filter @praxis/web add -D vitest@^4 | exit0，修复兼容性根因，Vitest4.1.11 |
| pnpm peers check | 最初exit1 Better Auth optional Vitest2–4；最终exit0，无peer问题 |
| pnpm exec biome check --write（本任务源码/测试/config/类型声明） | exit0；格式/导入修正，减少动态设置不使用 important |
| pnpm typecheck | exit0，Next typegen 与 tsc 通过 |
| pnpm test | exit0，4项组件状态测试通过（最终Vitest4） |
| pnpm test:e2e -- shell | 修正后exit0，桌面/移动5项通过、1项桌面不适用跳过；覆盖21路线各两viewport、导航/面包屑/404/前进后退/模态焦点/跳过导航 |
| pnpm build | exit0，Next16.3.5编译/类型/静态与动态页面生成通过，确认21入口和既有认证route |
| pnpm lint（最终在build之后） | exit0，82文件检查；仅格式化官方生成类型 |
| git diff --check | exit0 |
| pnpm dev | loopback 127.0.0.1:3001 启动成功，CUA检查完成后停止，未保留服务 |

初次E2E桌面通过、mobile worker 因运行中 CJS→ESM 配置缓存失配失败；完成模块声明变更后重启通过。另一次验证因手工预览 dev 仍占用3001而exit1，停止预览后完整重跑通过。初次lint发现生成器声明格式、浏览器trace产物；修正脚本与产物边界后通过。没有压制 TS/lint/test 错误。

## Frontend Evidence

- 前端模式：scaffold。
- 目标应用、框架与渲染模型：apps/web / @praxis/web，Next16.3.5 App Router、React19；页面和layout默认 Server Component，导航交互与错误boundary明确Client，不将业务数据传到客户端。
- 设计来源与继承的 token/组件：用户指定 Stitch MCP 现有项目5480617662433312349，设计系统assets/1178394102340625614，global-shell 30fcee553b674c9f90e0d3ab7764cf0e。主节点只读MCP响应保存STITCH_SOURCE_0/1/2；本代理从实时返回 URL 用CUA查看实际全局壳截图，确认为深色侧栏/顶栏/主内容占位。色彩#18181B/#27272A/#FAFAFA/#D4D4D8、224左栏、8px圆角、16px/1.5、44px目标；沿用packages/ui全局样式入口，lucide既有图标，不下载字体/照片。
- 新增或变更路由：/、/projects、/projects/[projectId]、/archive、/characters、/characters/new、/characters/[characterId]、/skills、/skills/new、/skills/[skillId]、/styles、/styles/new、/styles/[styleId]、/studio/[projectId]、/quick、/works、/works/[workId]、/prompts、/prompts/new、/prompts/[promptId]、/sign-in；移除/login、/dashboard模板。
- 覆盖的 UI 状态：默认标题/说明/功能尚未实现/占位；loading可读status、错误局部retry、404返回项目/Prompt；无虚假生成/保存/身份授权成功状态。
- 响应式验证：实际Playwright Chrome 1440×900及375×812全部21路由均200、指定标题、未实现标识、无form/input/textarea、无document横向溢出。CUA实际桌面默认viewport与375×812查看Prompt库及模态抽屉，视觉无遮挡/横溢；temporary viewport已reset。
- 可访问性验证：原生HTML dialog.showModal提供modal/inert背景/初始焦点/Tab范围；mobile16次Tab留在modal循环（UA可能经过body哨兵）、Escape关闭且trigger焦点恢复；跳过导航首Tab→Enter聚焦main；面包屑/导航独立名字，currentpage，44px触控、可见focus。修复desktop close不再聚焦隐藏mobile按钮。未执行屏幕阅读器实际读出。
- 浏览器、控制台与网络结果：隔离E2E pageerror为空，各规划路由200、未知地址404；CUA浏览器存在钱包/其他Chrome扩展脚本的fetch/MetaMask错误与MaxListeners告警（chrome-extension来源），不声称整个浏览器无异常；未观察应用hydration错误。无业务 API/外部媒体/生图调用。
- React/Next.js 专项检查：适用；显式文件路由/static new优先、无catch-all冒充已规划路由；Next16 error使用官方retry而非假定旧reset，根metadata zh-CN/noindex、无外部Google字体。服务端auth/db未进入页壳导入图；性能仅静态边界审查，无量化提升承诺。
- 与 UI.md 或设计来源的偏差：旧稿导航缺Prompt，按已确认v4更新六项；global设计稿的参数/指标/业务内容不搬，本任务只做页面壳占位。没有把未经人工评审的旧Stitch及三Prompt初稿说成已批准高保真。系统字体按不下载字体规则适配设计中的中文系统回退；business参数栏属于后续页面实现。
- 未完成的人工检查：用户视觉检查、辅助技术/跨浏览器兼容性；真实权限/所有者登录和数据功能属于后续workspace任务，不作为本任务验收通过。
- 性能与兼容性风险：原生modal dialog按现代Chrome验证，Safari/Firefox未验证；无业务数据故无业务请求性能证据；既有bootstrap依赖的两项deprecated传递包保留，不扩大依赖升级。

## 范围与下一步

未读取或编辑 .env；未再次初始化工程、新建API、业务表单、持久化、Mock指标、图像、外部设计写入；未修改 PLAN_STATE/STATUS/RUN_STATE/TASKS、未提交推送或部署。
下一步由主编排器 N5 验证/N6审查/N7按需QA和安全门；通过后仍停在scaffold供用户检查，不自动执行业务run。

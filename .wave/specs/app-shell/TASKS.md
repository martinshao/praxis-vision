# 应用壳任务清单

## APP-SHELL-001：扩展 Better-T-Stack 工程的全部页面壳

- [ ] APP-SHELL-001
预估：1h
任务类型：scaffold
执行角色：frontend-engineer
涉及项目：apps/web
风险等级：medium
QA 策略：required
并行策略：serial
依赖：platform-bootstrap/PLATFORM-BOOTSTRAP-001
涉及范围：apps/web、packages/ui、根 scripts 别名、所有页面占位与导航

### 输入

MODULE.md、DESIGN.md、UI.md、ARCH.md、SPEC.md；../../TECH_DECISIONS.md；读取 ../platform-bootstrap/BOOTSTRAP.md 与 ../../handoffs/platform-bootstrap/PLATFORM-BOOTSTRAP-001.md；不重复运行生成器。

### 实现

确认 bootstrap COMPLETE 且 apps/web 已存在，保存 Git 基线；沿用生成工程、packages/ui 原语、pnpm workspace 与锁文件，补充测试框架及规划命令别名。Web 包统一 @praxis/web 并同步内部引用。根命令代理到真实 Web 包，build / lint 不吞错。清理 /login、/dashboard 生成器示例页面，认证基础包保留待业务配置。现有 .wave / AGENTS / Git 保留，根 .gitignore 补充缓存、data 私有目录与构建输出。

### 页面壳验收

SPEC 所有路由以及 /sign-in 具备标题、说明、占位区和未实现标识；导航 / 面包屑可达，404 / 错误页可返回，键盘与窄屏无溢出。应用壳只建导航与布局，无 API、真实表单、业务逻辑或业务 Mock，不伪造工作台生成结果。私有身份 / 领域 db 在 workspace 任务建立，worker 在 studio/TASK-003 建立。

### 允许与禁止范围

允许上述工程及页面壳和基础导航测试；不改 PRD / 上游文档，不读真实 .env，不提交推送，不部署，不实现业务。

### 验证命令

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e -- shell
pnpm build
```

命令在本任务真实建立后运行，当前仅规划。工具或依赖失败保存检查点；不得删除 .wave 或重新生成工程。

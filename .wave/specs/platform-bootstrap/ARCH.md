# 技术骨架架构

物料状态：READY
来源：MODULE.md、BOOTSTRAP.md、../../TECH_DECISIONS.md；已确认 INIT PRD v3。

Next self 模式唯一应用 apps/web，HTTP 业务 API 在 apps/web/src/app/api；CLI runtime none，实际 Node.js。SQLite / Drizzle schema 位于 packages/db，认证技术适配 packages/auth；组件原语 / 主题 packages/ui，类型配置 packages/config。具体文件以 bootstrap handoff 实际清单核验；不同于此结构须回 plan 修订，不假造路径。

API none 表示不额外采用 tRPC/oRPC，业务 HTTP 契约仍由 CONTRACTS.md 定义。单实例本地私有持久磁盘；不生成部署 / 支付 / AI 示例 / MCP / agent skills。生成器 auth 示例属于技术样例，不能视为私有规则已完成；app-shell 清理页面示例，workspace 关闭注册并实现所有者隔离。

根目录为 metadata-only merge；merge 会替换同名生成文件，所以正式生成前检查所有目标冲突，现有 .gitignore 如冲突先保存原内容并合并，不能丢失既有 env 保护。发现业务 package / 源码、路径符号链接、目录基线变化立即阻塞，不 overwrite，不创建嵌套 Git。生成器会生成无凭据 schema 或模板时须核验不含真实密钥，不读取已有 .env；若实际版本强制产生禁写 .env，停止并回 plan 处理。

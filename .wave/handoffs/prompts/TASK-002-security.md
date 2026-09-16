# prompts/TASK-002 安全交接

## 执行结果

- 角色：security-engineer
- 状态：COMPLETED
- 修改文件：仅 `.wave/security/prompts/TASK-002-SECURITY.md` 与本交接。
- 完成内容：可信查询/绑定LIKE/当前版筛选分页、本人历史hash查重、CAS归档保关联、HTTP边界、canonical-file整事务queue与取消盲重放；PASSED。
- 执行命令：指定cat/rg；精确 `pnpm --filter @praxis/web exec vitest run tests/prompts`；Python NFT路径/非环境baseline核对；git diff --check。
- 验证结果：13测试exit0、diff检查exit0；6个API NFT各287项，敏感工程路径匹配0。全24/type/lint/build引用最终证据，不重复构建。
- 风险：queue进程内不可重入，不保证跨进程或提交幂等；Trial/UI后续，未验收性能/产品全闭环/部署。TASK-001旧BUSY报告保留历史，当前已撤销泛重放。
- 安全报告：../../security/prompts/TASK-002-SECURITY.md
- 建议下一阶段：CHECKPOINT（父流程继续QA/N8，角色不改任务/状态）。

未读取编辑.env/秘密schema、操作真实库、调用供应商、添加依赖或提交部署。

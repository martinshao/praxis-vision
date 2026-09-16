# TASK-002 实施计划

沿用现有 Prompt/Source/Version 与 owner 边界，无结构迁移或新依赖。
- 列表当前版 join，来源 EXISTS 避免重复，关键词 LIKE 绑定并转义；标签 AND；createdAt+id 降序稳定游标，默认24/max100，仅180字摘要。
- 重复以同 owner 任一历史版本规范 textHash（含归档）提示，仅返回本人条目 id；事务内复核，明确 allowDuplicate 才另存，追加来源沿用 CAS。
- archive/restore CAS，仅修改 archivedAt/updatedAt/expectedVersion；历史详情可读，归档不可编辑。
- 严格 URL query，布尔只 true/false，tags 为重复 URL 参数（AND），trialState untried/unrated/satisfied/improve/tried；真实 Trial 未落地，除 untried 外明确能力未支持，untried 为当前全部。
- 临时 SQLite 验证筛选/分页/并发重复/归档恢复/权限/HTTP，检查类型、lint、全测试、构建。

## 实施中核实与收口

临时独立 SQLite 客户端并发明确另存出现 BEGIN/COMMIT 的 SQLITE_BUSY，去除 RETURNING 不解决。已串行委托 database-engineer，新增 withDatabaseWrite 按真实规范文件路径排队（不同内存实例独立），服务 create/CAS 整事务持锁，原 RETURNING 保留。队列不取代事务内查重或 SQLite 跨进程写锁。因 Drizzle 不提供失败阶段，撤销泛 BUSY 自动重放；原异常传播，防止不确定 commit 后再新建。

首轮构建发现 helper 动态 path.join 被误追踪为整工程资源，数据库角色改为规范父路径/后缀的运行时身份组合；复验构建无警告。createDb 先计算身份再打开客户端，防异常泄漏。

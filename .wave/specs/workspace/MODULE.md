# 私有工作区与项目模块

物料状态：READY

## 来源 PRD

- ../../prd/INIT-PRD.md；INIT / v3，已确认。

## 关联需求与验收

- 功能：F-001, F-010
- 验收：AC-001, AC-010

## 模块目标与边界

- 目标：空工作区 → 新建项目 → 保存 → 再次打开；归档列表 → 选择对象 → 恢复，历史关联不变
- 模块内：项目名称（1–80 字）、标签（最多 20 个）、归档对象类别。
- 规则：只操作当前所有者的资源；首版无公开分享、真人照片上传和永久删除；归档不删除数据。
- 模块外：不承接其他业务模块的写入，不新增支付、分享、真人上传或永久删除。

## 上游依赖

- 无业务上游；跨域通过契约访问，不直接修改上游表。

## 文档状态

| Design | UI    | Arch  | Spec  | Tasks | 总状态 |
| ------ | ----- | ----- | ----- | ----- | ------ |
| READY  | READY | READY | READY | READY | ready  |

## 待生成文档

DESIGN.md、UI.md、ARCH.md、SPEC.md、TASKS.md；TEST_REPORT.md 在运行验证后创建，初始化不伪造。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
Prompt归属相同owner，可恢复归档类别kind=prompt；GET /api/archive分页读取Prompt元数据；POST /api/archive/prompt/:id/restore与POST /api/prompts/:id/restore使用同一服务规则，不删除version/trial/cover。聚合层按共享schema查询，无workspace→prompts服务反向依赖。归档页新增Prompt类别；历史引用保持可读，恢复导航到/prompts/:promptId。由prompts/TASK-004、TASK-005实现增量，旧TASK-002/003负责原能力，不重复工作。

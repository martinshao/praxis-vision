# SweetWave 规划质量报告

## 结论

- 状态：BLOCKED
- 检查时间：未执行（初始化仅创建模板）
- Scope：

## 需求追踪

- 功能需求覆盖：
- 验收标准覆盖：
- 断裂引用：

## 跨文档一致性

| 检查项 | 结果 | 说明 |
|---|---|---|
| Design / UI / Spec 页面与状态 |  |  |
| Arch / Spec API 与数据模型 |  |  |
| 权限、安全和性能约束 |  |  |
| Task 文档、角色和范围引用 |  |  |
| 模块依赖和循环 |  |  |
| platform-bootstrap 唯一性、BOOTSTRAP 与依赖门 |  |  |
| app-shell 唯一性与路由覆盖 |  |  |
| 前端任务对 APP-SHELL-001 的依赖 |  |  |

## Stitch 可选分支证据

| 模块 | 模式 | 提示词状态 / 覆盖 | 生成状态 | 项目 / 屏幕 ID | 评审状态 | 是否必需 | 判定 / 恢复动作 |
|---|---|---|---|---|---|---|---|
|  | DISABLED / PROMPT_ONLY / MCP_GENERATE |  |  |  |  | 否 |  |

判定规则：`READY_FOR_STITCH` 在非必需分支中可通过质量门，但必须有 READY 提示词、失败原因和恢复动作；
只有 `GENERATED / REVIEWED` 才要求完整真实项目/屏幕 ID。非必需 STALE 结果不得进入下游引用。

## 阻塞项

- 尚无产品需求和规划物料，质量门未执行。

## 待确认项

-

## 可交接性

- READY_TO_RUN：否
- 全栈框架：NOT_REQUIRED
- 前端骨架：NOT_REQUIRED
- Stitch 设计：NOT_REQUESTED
- 建议下一步：

## 状态值

- `PASSED`：全部强制项通过。
- `BLOCKED`：存在结构、引用或一致性失败。
- `NEEDS_CONFIRMATION`：存在必须由用户决策的高风险问题。

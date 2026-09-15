# SweetWave 规划状态

记录当前唯一的文档编排现场。没有活动规划时保持 `IDLE`。

## 检查点

- 状态：IDLE
- 当前节点：
- Scope：
- 当前 PRD：
- 当前模块：
- 当前产物：
- 下一节点：
- 恢复命令：
- 更新时间：2026-09-15T14:30:01+08:00

## 物料基线

| 产物 | 来源 | 指纹 | 状态 |
|---|---|---|---|
| PRD | Idea / Brief |  | MISSING |
| MODULE_MAP | PRD |  | MISSING |
| BOOTSTRAP（可选） | ARCH / 已确认技术选项 |  | NOT_REQUIRED |

## 模块调度

- 串行顺序：
- 并行候选：
- 冲突原因：
- 已完成模块：
- 阻塞模块：

## P5 Stitch 可选分支

- 模式：DISABLED
- 当前模块：
- 提示词状态：NOT_REQUESTED
- 生成状态：NOT_REQUESTED
- 提示词产物：
- 结果产物：
- 外部项目 / 屏幕：
- 失败原因：

## STALE 传播

| 上游变化 | 受影响模块 | 受影响产物 | 是否涉及已完成任务 | 处理 |
|---|---|---|---|---|
|  |  |  |  |  |

## Role 执行结果

- 角色：
- 状态：
- 输入物料：
- 输出文件：
- 覆盖需求：
- 假设：
- 待确认问题：
- 下游影响：

## 阻塞与待确认

-

## 上下文恢复摘要

- 当前 Scope：
- 当前模块：
- 刚完成节点：
- 下一节点：
- 必读物料：
- 相关 LESSONS：
- STALE 风险：
- 推荐恢复命令：

## 写入规则

- 状态只允许：`IDLE`、`RUNNING`、`PAUSED`、`BLOCKED`、`COMPLETED`。
- 当前节点只允许：`P1_RESTORE` 至 `P10_HANDOFF`。
- Stitch 是 `P5_UI` 的可选子状态，不新增 P 编号；只有 `plan` 可写本节。
- 产物状态只允许：`NOT_REQUIRED`、`MISSING`、`DRAFT`、`REVIEWING`、`READY`、`BLOCKED`、`STALE`。
- 每次进入节点、暂停、阻塞或完成时立即更新。
- Role Skills 不得修改本文件。

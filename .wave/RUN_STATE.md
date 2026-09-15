# SweetWave 执行状态

记录当前唯一的任务执行现场，用于跨会话恢复。没有正在执行的任务时保持 `IDLE`。

## 检查点

- 状态：IDLE
- 当前节点：
- 范围模式：
- 目标模块：
- 目标任务：
- 模块：
- 任务：
- 阶段：
- 基准提交：
- 恢复命令：
- 更新时间：2026-09-15T14:30:01+08:00

## 物料基线

| 文件 | 指纹 |
|---|---|
| MODULE.md |  |
| DESIGN.md |  |
| UI.md |  |
| ARCH.md |  |
| BOOTSTRAP.md（可选） |  |
| SPEC.md |  |
| TASKS.md 任务定义 |  |

## 执行现场

### 调度计划

- 串行组：
- 并行候选：
- 冲突原因：
- 范围外任务：不调度

### 路由与派发凭证

- 任务声明角色：
- 解析角色：
- 角色推断理由：
- 目标角色：
- 角色手册：
- handoff 路径：
- 调用输入摘要：
- 派发状态：NOT_STARTED
- 返回角色：
- 返回状态：
- 返回修改文件：
- 派发异常：

### Engineer 执行结果

- 任务类型：
- 角色：
- 状态：
- 结果摘要：

### 已完成步骤

-

### 已修改文件

-

### 已执行验证

| 命令 | 结果 | 说明 |
|---|---|---|
|  |  |  |

### 阻塞与待确认

-

## QA 累积

- 距离上次完整 QA 的完成任务数：0
- 最近 QA：
- 本任务 QA 原因：
- 本任务安全门原因：

## 上下文恢复摘要

- 当前模块：
- 刚完成任务：
- 下一任务：
- 范围模式：
- 目标模块：
- 目标任务：
- 必读规格：
- 相关 LESSONS：
- Git 基线：
- 未解决风险：
- 推荐恢复命令：

## 写入规则

- 状态只允许：`IDLE`、`RUNNING`、`PAUSED`、`BLOCKED`、`COMPLETED`。
- 阶段只允许：`PLANNING`、`IMPLEMENTING`、`VERIFYING`、`REVIEWING`、
  `QA_EVALUATING`、`FINALIZING`。
- 当前节点只允许：`N1_RESTORE` 至 `N10_FINISH`。
- 范围模式只允许：`NEXT_PROJECT_TASK`、`NEXT_MODULE_TASK`、`SINGLE_TASK`、
  `ALL_MODULE_TASKS`、`ALL_PROJECT_TASKS`、`BOOTSTRAP_ONLY`、`SCAFFOLD_ONLY`。
- 派发状态只允许：`NOT_STARTED`、`CALLING`、`RESULT_RETURNED`、
  `RESULT_VALIDATED`、`DIRECT_GENERIC`、`FAILED`。
- 非 `generic` 任务进入 N4 前，派发状态必须为 `RESULT_VALIDATED`。
- 非 `generic` 任务的 handoff 文件必须存在且通过角色、状态、范围和 Git 基线校验。
- `DIRECT_GENERIC` 只允许解析角色明确为 `generic` 的任务。
- `ALL_MODULE_TASKS`、`ALL_PROJECT_TASKS` 中间任务完成时不得结束当前调用。
- 每次进入新阶段、暂停、阻塞或完成时立即更新。
- 新任务开始前覆盖旧的 `COMPLETED` 现场；不要同时记录多个活动任务。
- `TASKS.md` 使用任务定义指纹：比较时忽略 `[ ]`、`[IN_PROGRESS]`、
  `[VERIFYING]`、`[REVIEWING]`、`[BLOCKED]`、`[x]` 等生命周期标记。

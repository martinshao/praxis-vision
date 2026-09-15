# INIT 需求追踪矩阵

物料状态：READY
来源：已确认 PRD v3；本矩阵为规划追踪，不是产品验收结果。Stitch 未启用，无必需外部屏幕产物。

| 功能 | 模块 | DESIGN / UI / ARCH / SPEC | 工程任务 | 验收 |
|---|---|---|---|---|
| F-001 | workspace | [DESIGN](specs/workspace/DESIGN.md) / [UI](specs/workspace/UI.md) / [ARCH](specs/workspace/ARCH.md) / [SPEC](specs/workspace/SPEC.md) | [workspace/TASK-001](specs/workspace/TASKS.md), [workspace/TASK-002](specs/workspace/TASKS.md), [workspace/TASK-003](specs/workspace/TASKS.md)；gallery/TASK-003 最终闭环 | AC-001（未执行） |
| F-002 | characters | [DESIGN](specs/characters/DESIGN.md) / [UI](specs/characters/UI.md) / [ARCH](specs/characters/ARCH.md) / [SPEC](specs/characters/SPEC.md) | [characters/TASK-001](specs/characters/TASKS.md), [characters/TASK-002](specs/characters/TASKS.md)；gallery/TASK-003 最终闭环 | AC-002（未执行） |
| F-003 | photography | [DESIGN](specs/photography/DESIGN.md) / [UI](specs/photography/UI.md) / [ARCH](specs/photography/ARCH.md) / [SPEC](specs/photography/SPEC.md) | [photography/TASK-001](specs/photography/TASKS.md), [photography/TASK-002](specs/photography/TASKS.md)；gallery/TASK-003 最终闭环 | AC-003（未执行） |
| F-004 | studio | [DESIGN](specs/studio/DESIGN.md) / [UI](specs/studio/UI.md) / [ARCH](specs/studio/ARCH.md) / [SPEC](specs/studio/SPEC.md) | [studio/TASK-002](specs/studio/TASKS.md), [studio/TASK-004](specs/studio/TASKS.md)；gallery/TASK-003 最终闭环 | AC-004（未执行） |
| F-005 | studio | [DESIGN](specs/studio/DESIGN.md) / [UI](specs/studio/UI.md) / [ARCH](specs/studio/ARCH.md) / [SPEC](specs/studio/SPEC.md) | [studio/TASK-002](specs/studio/TASKS.md), [studio/TASK-004](specs/studio/TASKS.md)；gallery/TASK-003 最终闭环 | AC-005（未执行） |
| F-006 | studio | [DESIGN](specs/studio/DESIGN.md) / [UI](specs/studio/UI.md) / [ARCH](specs/studio/ARCH.md) / [SPEC](specs/studio/SPEC.md) | [studio/TASK-001](specs/studio/TASKS.md), [studio/TASK-003](specs/studio/TASKS.md), [studio/TASK-004](specs/studio/TASKS.md), [studio/TASK-005](specs/studio/TASKS.md)；gallery/TASK-003 最终闭环 | AC-006（未执行） |
| F-007 | studio | [DESIGN](specs/studio/DESIGN.md) / [UI](specs/studio/UI.md) / [ARCH](specs/studio/ARCH.md) / [SPEC](specs/studio/SPEC.md) | [studio/TASK-002](specs/studio/TASKS.md), [studio/TASK-004](specs/studio/TASKS.md), [studio/TASK-005](specs/studio/TASKS.md)；gallery/TASK-003 最终闭环 | AC-007（未执行） |
| F-008 | studio | [DESIGN](specs/studio/DESIGN.md) / [UI](specs/studio/UI.md) / [ARCH](specs/studio/ARCH.md) / [SPEC](specs/studio/SPEC.md) | [studio/TASK-002](specs/studio/TASKS.md), [studio/TASK-004](specs/studio/TASKS.md), [studio/TASK-005](specs/studio/TASKS.md)；gallery/TASK-003 最终闭环 | AC-008（未执行） |
| F-009 | gallery | [DESIGN](specs/gallery/DESIGN.md) / [UI](specs/gallery/UI.md) / [ARCH](specs/gallery/ARCH.md) / [SPEC](specs/gallery/SPEC.md) | [gallery/TASK-001](specs/gallery/TASKS.md), [gallery/TASK-002](specs/gallery/TASKS.md), [gallery/TASK-003](specs/gallery/TASKS.md)；gallery/TASK-003 最终闭环 | AC-009（未执行） |
| F-010 | workspace | [DESIGN](specs/workspace/DESIGN.md) / [UI](specs/workspace/UI.md) / [ARCH](specs/workspace/ARCH.md) / [SPEC](specs/workspace/SPEC.md) | [workspace/TASK-001](specs/workspace/TASKS.md), [workspace/TASK-002](specs/workspace/TASKS.md), [workspace/TASK-003](specs/workspace/TASKS.md)；gallery/TASK-003 最终闭环 | AC-010（未执行） |
| F-011 | skills | [DESIGN](specs/skills/DESIGN.md) / [UI](specs/skills/UI.md) / [ARCH](specs/skills/ARCH.md) / [SPEC](specs/skills/SPEC.md) | [skills/TASK-001](specs/skills/TASKS.md), [skills/TASK-003](specs/skills/TASKS.md), [skills/TASK-004](specs/skills/TASKS.md)；gallery/TASK-003 最终闭环 | AC-011（未执行） |
| F-012 | skills | [DESIGN](specs/skills/DESIGN.md) / [UI](specs/skills/UI.md) / [ARCH](specs/skills/ARCH.md) / [SPEC](specs/skills/SPEC.md) | [skills/TASK-002](specs/skills/TASKS.md), [skills/TASK-004](specs/skills/TASKS.md)；gallery/TASK-003 最终闭环 | AC-012（未执行） |

## 技术与共享追踪

全部业务任务传递依赖 PLATFORM-BOOTSTRAP-001；直接依赖 APP-SHELL-001。共享规则见 [CONTRACTS](specs/CONTRACTS.md)，技术决策见 [TECH_DECISIONS](TECH_DECISIONS.md)。F-002 效果复验另由 studio/TASK-005 支撑；F-012 在 studio/TASK-004/005 验证槽位与对比；F-010 归档后作品可读由 gallery/TASK-001/003 交叉验证。

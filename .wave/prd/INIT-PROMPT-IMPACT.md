# INIT PRD v4 Prompt 增量影响清单

物料状态：REVIEWING

## 变化与保留

新增 F-013–F-015 / AC-013–AC-015，调整 F-005、F-008–F-012 的 Prompt 来源关联；新增一级 Prompt 入口。多题材收藏、仅人像内置生成和自生成封面 / 外部仅链接为用户已选择规则。v4 尚未整版确认；v3 PRD 快照与旧凭证保留。主技术组合、私有权限、人物身份、两风格组合、单机位技能、整图重拍、仅可恢复归档均不改。

## 受影响下游

- workspace：资产归属 / 归档与全局入口；skills：来源 Prompt 版本 / 提炼草稿；studio：载入草稿、版本来源、实际文本 / 试用；gallery：Prompt 结果预览及保存为 Prompt；app-shell：导航 / 页面壳。上述模块 MODULE、DESIGN、UI、ARCH、SPEC、TASKS 标 STALE，仅过期标记。
- characters / photography：业务规则与服务 / 任务不改；仅 UI 因共享导航变化 STALE。七模块 Stitch 提示词与结果保留真实 ID，但对 v4 STALE。
- MODULE_MAP、CONTRACTS、TECH_DECISIONS、TRACEABILITY、PLAN_REPORT、UI / Stitch 入口索引 STALE；旧文档包含 v3 来源，不自动重写成 v4。
- platform-bootstrap 配置 / 架构无真实变化，不标全栈方案 STALE；原自动 .env 创建冲突仍 BLOCKED。前端骨架因导航变化 STALE；没有已生成工程要迁移。
- Prompt 是建议新增业务边界，正式模块 / 路由 / 数据 / API / 任务在确认后 P3–P8 处理，不在本轮新建工程任务。

## 安全恢复

RUN_STATE IDLE，0 项实际完成、无业务代码，因此没有已实现迁移或已完成任务重做需审批。仅保存 P2 草案与影响，不推进 P3、不改工程生命周期、不调用 Stitch、不提交。两项选择不是整版 PRD 确认。恢复：$sw prd INIT；v4 确认后单阶段结束，再由用户手动 $sw plan INIT --from map。

## 指纹记录

旧 PLAN_STATE / STATUS 指纹清单作为 v3 历史保留；本次实际文件指纹见 INIT-PROMPT-MATERIALS.json，不把刷新 hash 当作确认或下游 READY。

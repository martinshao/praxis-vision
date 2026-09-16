# 人像创作工作台模块

物料状态：READY

## 来源 PRD

- ../../prd/INIT-PRD.md；INIT / v3，已确认。

## 关联需求与验收

- 功能：F-004, F-005, F-006, F-007, F-008
- 验收：AC-004, AC-005, AC-006, AC-007, AC-008

## 模块目标与边界

- 目标：选人物 → 服化道 → 姿态 → 场景 → 摄影 / 技能 → 提示词预览 → 显式生成 → 查看状态 → 对比 → 改一项重拍；快捷入口不要求人物
- 模块内：人物 / 风格 / 技能版本、造型、姿态、场景、摄影参数、自由文本、输出尺寸、方案版本。
- 规则：提交冻结快照；未提交不传输生成素材；同次重复提交不重复建任务；未知状态先核实，不盲目重试；重拍不承诺局部像素不变。
- 模块外：不承接其他业务模块的写入，不新增支付、分享、真人上传或永久删除。

## 上游依赖

- workspace, characters, skills, photography；跨域通过契约访问，不直接修改上游表。

## 文档状态

| Design | UI    | Arch  | Spec  | Tasks | 总状态 |
| ------ | ----- | ----- | ----- | ----- | ------ |
| READY  | READY | READY | READY | READY | ready  |

## 待生成文档

DESIGN.md、UI.md、ARCH.md、SPEC.md、TASKS.md；TEST_REPORT.md 在运行验证后创建，初始化不伪造。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
ShotPlanVersion和GenerationJob冻结promptOrigin与实际提交文本/适配遗漏/输入引用（详见prompts/ARCH）；旧字段nullable。POST /api/prompts/:id/reuse由prompts协调调用现有草稿创建，不直接生图；studio依据共享schema校验引用owner/归档/版本及portrait范围，无studio→prompts服务导入。快捷草稿显示来源版本与unsupported未应用项，保留原文；替换须确认和expectedDraftVersion。最终预览/显式提交仍走现有任务接口，不静默忽略unsupported或覆盖身份。任务完成后Prompt详情查询已有job，不另建队列/重复provider调用。增量由prompts/TASK-001、TASK-004、TASK-005追加，原任务保留。

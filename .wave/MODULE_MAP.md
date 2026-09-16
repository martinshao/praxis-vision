# SweetWave 模块地图

物料状态：READY
来源：INIT PRD v3；用户明确采用 Better-T-Stack，授权推荐组合。增量来源：INIT PRD v4；仅新增prompts及必要接线。文档顺序：platform-bootstrap → workspace → prompts → characters → skills → photography → studio → gallery → app-shell；实际工程先 bootstrap，再 scaffold，再业务任务 DAG。

| 模块 ID            | 名称             | 来源需求                                   | 业务文档依赖                               | Design       | UI           | Arch  | Spec  | Tasks | 总状态 |
| ------------------ | ---------------- | ------------------------------------------ | ------------------------------------------ | ------------ | ------------ | ----- | ----- | ----- | ------ |
| platform-bootstrap | 全栈技术初始化   | 全部功能的技术支撑                         | 无                                         | NOT_REQUIRED | NOT_REQUIRED | READY | READY | READY | ready  |
| workspace          | 私有工作区与项目 | F-001, F-010                               | 无                                         | READY        | READY        | READY | READY | READY | ready  |
| prompts            | Prompt资产库     | F-013, F-014, F-015；关联F-005/F-008–F-012 | workspace                                  | READY        | READY        | READY | READY | READY | ready  |
| characters         | 数字人物资产     | F-002                                      | workspace                                  | READY        | READY        | READY | READY | READY | ready  |
| skills             | 摄影技能资产     | F-011, F-012                               | workspace                                  | READY        | READY        | READY | READY | READY | ready  |
| photography        | 风格档案与组合   | F-003                                      | workspace, skills                          | READY        | READY        | READY | READY | READY | ready  |
| studio             | 人像创作工作台   | F-004, F-005, F-006, F-007, F-008          | workspace, characters, skills, photography | READY        | READY        | READY | READY | READY | ready  |
| gallery            | 作品与复用       | F-009                                      | workspace, studio                          | READY        | READY        | READY | READY | READY | ready  |
| app-shell          | 应用壳           | 全部功能的技术支撑                         | 无                                         | READY        | READY        | READY | READY | READY | ready  |

## 依赖与边界

业务文档依赖无循环。人物页面消费 studio 共享生成服务，studio 方案服务读取人物身份；两者服务职责独立，任务 DAG 将候选页面排在生成服务之后。私有媒体接口 studio 所有，gallery 只消费。app-shell 聚合同阶段业务页面，不作为文档上游；工程任务依赖 scaffold。

当前串行；人物领域服务和技能规则是后续并行候选，共享 schema / 契约变更保持串行。初始化保护现有 .wave、AGENTS、Git 和 env 忽略规则，不覆盖既有业务工程。

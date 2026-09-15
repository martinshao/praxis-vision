# 全局应用壳体验设计

物料状态：READY

- 来源：全部业务 MODULE / DESIGN；INIT PRD v3。
- 导航分组：项目、人物、摄影技能、摄影风格、作品；快捷生成常驻操作；归档次级入口。
- 根路径最近项目；详情面包屑指向各列表；工作台可返回所属项目。
- 以下路由全部只建页面壳，具体业务由对应模块实现。

| 页面 | 路由 | 模块 |
|---|---|---|
| 最近项目 | `/` | workspace |
| 拍摄项目 | `/projects` | workspace |
| 项目详情 | `/projects/:projectId` | workspace |
| 归档与恢复 | `/archive` | workspace |
| 人物列表 | `/characters` | characters |
| 创建虚构人物 | `/characters/new` | characters |
| 身份与版本 | `/characters/:characterId` | characters |
| 技能库 | `/skills` | skills |
| 创建或提炼 | `/skills/new` | skills |
| 技能版本与试用记录 | `/skills/:skillId` | skills |
| 摄影风格档案 | `/styles` | photography |
| 新建风格 | `/styles/new` | photography |
| 档案编辑与组合 | `/styles/:styleId` | photography |
| 专业人像创作 | `/studio/:projectId` | studio |
| 快捷提示词生成 | `/quick` | studio |
| 作品库 | `/works` | gallery |
| 作品来源与复用 | `/works/:workId` | gallery |

## 全局状态

加载保持导航；404 返回项目页；错误边界提供局部重试；窄屏抽屉菜单打开时管理焦点、Escape 可关闭；错误不用全局重载重发生成请求。

- `/sign-in`：私有工作区必要会话入口；本阶段仅占位，workspace 实现认证；无公开注册。

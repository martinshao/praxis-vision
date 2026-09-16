# 应用壳模块

物料状态：READY

## 来源与关联

INIT / PRD v3；技术聚合模块，支撑 F-001–F-012 的页面入口，不独占业务验收。

## 边界

根布局、导航、面包屑、404、错误边界和占位页；不实现 API、表单、生成任务或业务 Mock。

## 依赖

文档聚合各业务页面；业务文档不依赖应用壳。工程任务 APP-SHELL-001 是所有页面实现前置门。

## 文档状态

| Design | UI    | Arch  | Spec  | Tasks | 总状态 |
| ------ | ----- | ----- | ----- | ----- | ------ |
| READY  | READY | READY | READY | READY | ready  |

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
新增/prompts、/prompts/new、/prompts/:promptId三页面壳；对应Next app/prompts/page.tsx、new/page.tsx、[promptId]/page.tsx。主导航为项目、人物、Prompt、摄影技能、摄影风格、作品；快捷生成常驻，归档次级。详情面包屑Prompt→[名称]，无权限/404回本人库。APP-SHELL-001增加这些导航和占位壳，仅标题/说明/未实现区域，不写真实表单、API、任务调用或Mock。具体Prompt业务在prompts/TASK-005。

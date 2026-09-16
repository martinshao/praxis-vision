# 应用壳开发规格

物料状态：READY

- 输入：MODULE / DESIGN / UI / ARCH 与所有业务页面地图。
- 目标：apps/web；pnpm workspace / Next App Router，具体工程结构见 ARCH。
- 只有一个 APP-SHELL-001。
- 路由：
  - `/`：最近项目 / workspace
  - `/projects`：拍摄项目 / workspace
  - `/projects/:projectId`：项目详情 / workspace
  - `/archive`：归档与恢复 / workspace
  - `/characters`：人物列表 / characters
  - `/characters/new`：创建虚构人物 / characters
  - `/characters/:characterId`：身份与版本 / characters
  - `/skills`：技能库 / skills
  - `/skills/new`：创建或提炼 / skills
  - `/skills/:skillId`：技能版本与试用记录 / skills
  - `/styles`：摄影风格档案 / photography
  - `/styles/new`：新建风格 / photography
  - `/styles/:styleId`：档案编辑与组合 / photography
  - `/studio/:projectId`：专业人像创作 / studio
  - `/quick`：快捷提示词生成 / studio
  - `/works`：作品库 / gallery
  - `/works/:workId`：作品来源与复用 / gallery
  - `/prompts`：Prompt 库 / prompts
  - `/prompts/new`：收集 Prompt / prompts
  - `/prompts/:promptId`：条目详情与版本 / prompts
  - `/sign-in`：单所有者会话入口占位，业务在 workspace 实现。

## 页面壳与禁止范围

根导航、面包屑、可达路由、404、错误边界、标题 / 说明 / 内容占位区 / 尚未实现标签。不可加入 API、业务逻辑、真实输入表单、业务 Mock、供应商调用、工作区数据与画像。

## 验收

基础应用可启动，所有路由和导航可达，无重复路由；按 UI 变量渲染，窄屏抽屉和键盘操作可用；相关 typecheck / lint / test / build 通过；应用壳通过仍须人工检查后执行业务 run。

## PRD v4 必要增量（原功能内容保留）

来源：INIT PRD v4 CONFIRMED；新增F-013–F-015 / AC-013–AC-015，不重写已有能力。详细数据、接口、限值、试用与封面规则见 ../prompts/ARCH.md、../prompts/SPEC.md及共享CONTRACTS。
新增/prompts、/prompts/new、/prompts/:promptId三页面壳；对应Next app/prompts/page.tsx、new/page.tsx、[promptId]/page.tsx。主导航为项目、人物、Prompt、摄影技能、摄影风格、作品；快捷生成常驻，归档次级。详情面包屑Prompt→[名称]，无权限/404回本人库。APP-SHELL-001增加这些导航和占位壳，仅标题/说明/未实现区域，不写真实表单、API、任务调用或Mock。具体Prompt业务在prompts/TASK-005。

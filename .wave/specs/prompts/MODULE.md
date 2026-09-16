# prompts 模块

物料状态：READY

## 来源 PRD

INIT / PRD v4，CONFIRMED，F-013–F-015；联动 F-005、F-008–F-012。

## 关联需求与验收标准

F-013 / AC-013 收集检索；F-014 / AC-014 本人结果预览；F-015 / AC-015 版本及复用。

## 模块目标

把跨平台收藏的原文、条件、版本和本人结果存成可找回的私有资产，不要求先建项目或人物。

## 模块边界

模块内：条目 / 来源 / 不可变版本、检索与重复提示、本人试用关联 / 评价、封面、归档、载入快捷草稿、作品反向保存及显式转技能来源。
模块外：生成 worker / provider / media 由 studio 所有；Work 由 gallery 所有；Skill 由 skills 所有；会话与归档聚合由 workspace 所有。Prompt 不执行脚本、抓取、真人图上传、跨题材生成或自动跑图。

## 上游依赖

文档依赖 workspace；共享契约描述与 studio / gallery / skills 的消费边界，领域地图无反向依赖。工程依赖详见 TASKS；prompts 协调跨域，studio 只存共享来源字段，不导入 prompts 服务。

## 下游影响

app-shell 新增三路由；快捷 / 作品 / 技能显示来源并复用；全局归档加 prompt 类别。不改变人物与风格领域规则。

## 文档状态

| Design | UI    | Arch  | Spec  | Tasks | 总状态 |
| ------ | ----- | ----- | ----- | ----- | ------ |
| READY  | READY | READY | READY | READY | ready  |

## 待生成文档与待确认问题

本次必需文档已完成；TEST_REPORT 在实际 run 后产生。无新增产品决策；效果与查找效率未实测。

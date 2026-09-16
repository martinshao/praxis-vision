# PRD v4 新增 UI 提示词入口

- 模式：PROMPT_ONLY；状态：READY / PROMPT_READY
- 范围：3个新页面生成提示词 + 5组已有UI局部编辑提示词（技能组覆盖创建与详情）；不是8个新页面。
- 项目/系统：复用历史5480617662433312349与assets/1178394102340625614；本次不发现、连接、配置或调用MCP。
- 新页仅默认桌面；其他状态规定行为，不自动新增画布；继承已确认系统，不重新提案主题。

| 操作          | 模块      | 页面/范围                                                 | 文档                                                      |
| ------------- | --------- | --------------------------------------------------------- | --------------------------------------------------------- |
| NEW_PAGE × 3  | prompts   | /prompts、/prompts/new、/prompts/:promptId                | [新页面提示词](specs/prompts/stitch/STITCH_PROMPT.md)     |
| EDIT_EXISTING | studio    | /quick                                                    | [局部增量](specs/studio/stitch/STITCH_PROMPT_DELTA.md)    |
| EDIT_EXISTING | gallery   | /works/:workId                                            | [局部增量](specs/gallery/stitch/STITCH_PROMPT_DELTA.md)   |
| EDIT_EXISTING | skills    | /skills/new 与 /skills/:skillId                           | [局部增量](specs/skills/stitch/STITCH_PROMPT_DELTA.md)    |
| EDIT_EXISTING | workspace | /archive                                                  | [局部增量](specs/workspace/stitch/STITCH_PROMPT_DELTA.md) |
| EDIT_EXISTING | app-shell | 全局共享导航及 /prompts、/prompts/new、/prompts/:promptId | [局部增量](specs/app-shell/stitch/STITCH_PROMPT_DELTA.md) |

## 使用与恢复

后续只有用户显式调用$sw ui stitch才进入MCP：先核对原项目/目标屏幕/设计系统，新页逐屏生成；已有页选对应旧screen仅定点编辑，壳同步导航而不重画主内容。不得将旧全量提示词提交重做19页，不重建项目，不把READY当作GENERATED。历史screenId在每组文档中已记录；以实际读取结果为准。

本次未修改旧7份全量提示词、旧STITCH_RESULT或原生成日志；这些仍STALE。3新页面和5组局部指令均未执行外部生成/编辑，无新screenId或视觉通过结论。核心UI/ARCH/SPEC/TASKS语义不变，无新STALE传播；bootstrap原阻塞保留，RUN_STATE IDLE。

## 当前新增模块绘制结果

2026-09-15T20:18:14.278343+08:00：用户$sw ui stitch 只绘制新增的模块，仅prompts三默认DESKTOP稿GENERATED / NOT_REVIEWED，[结果](specs/prompts/stitch/STITCH_RESULT.md)。一次局部修正限定三个新增ID，EDIT_REQUESTED / NOT_VERIFIED。上方PROMPT_ONLY为提示词阶段历史，五组旧页编辑仍NOT_REQUESTED，旧稿STALE；没有完成整站更新或视觉验收。

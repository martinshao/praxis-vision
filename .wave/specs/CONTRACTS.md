# 共享领域契约

- 来源：INIT / PRD v3；业务规则保持已确认内容。此文档由 P6 架构节点统一维护，模块 ARCH / SPEC 引用同一契约。
- 状态：READY；技术建议见 TECH_DECISIONS.md，供应商接入由 studio/TASK-001 核查后定点配置。

## 私有资源与版本

所有实体使用稳定 UUID，写入 ownerId、createdAt、updatedAt、archivedAt（可空）。ownerId 必须由可信服务端身份确定，不接受客户端自由指定。不存在与无权访问均返回 RESOURCE_NOT_FOUND，避免泄漏资源存在性；未认证返回 UNAUTHENTICATED。

版本对象不可变：CharacterVersion（identityDescription、generatedReferenceAssetIds）、StyleVersion（五个风格维度、skillVersionIds、sourceStyleVersionIds）、SkillVersion（适用条件、参数定义、规则、模板、检查清单、来源）。修改创建版本，不更新历史版本内容。

Project 记录名称和标签；ShotPlanVersion 记录 projectId、mode（professional / quick）、characterVersionId（快捷可空）、styleVersionId（可空）、skillRunSnapshot（可空）、造型 / 姿态 / 场景 / 摄影参数、rawPrompt、resolvedPrompt、outputOptions。提交保存不可变快照。快捷记录不补造专业字段。

Asset 为生图输出：mimeType、size、width、height、checksum、privateStorageKey、generationJobId、ownerId。角色参考只能选本人已成功生成的 Asset；不接收外部照片 URL、任意本地路径或文件上传。

Work 关联 Asset、GenerationJob、ShotPlanVersion；记录标签、favorite、satisfiedAt（可空）。归档与恢复只改变容器 / 实体的 archivedAt，不删除资产与快照，不级联改归属。归档列表按对象类别查询，恢复所有历史关联。

## API 基础

- JSON 成功：{data, requestId}；错误：{error:{code,message,fieldErrors?},requestId}。
- 列表：GET，cursor、limit（默认 24，最大 100）、query、archived（默认 false），结果 items、nextCursor。
- 创建 POST；更新容器 PATCH；创建不可变版本 POST /versions；归档 POST /archive；恢复 POST /restore；不提供 DELETE 资源永久清除接口。
- 错误：VALIDATION_ERROR 400、UNAUTHENTICATED 401、RESOURCE_NOT_FOUND 404、VERSION_CONFLICT 409、CAPABILITY_UNSUPPORTED 422、PROVIDER_UNAVAILABLE 503。
- 所有引用资源同时校验 ownerId；校验归档与版本状态；写入用事务。并发编辑通过 expectedVersion，冲突返回当前版本供用户选择，不能最后写入静默覆盖。

## 摄影技能

SkillVersion.inputSchema 使用受限字段类型：text、enum、number、boolean；每项有 key、label、required、default、help 和边界。禁止可执行表达式。参数 / 规则 / 模板有大小上限，服务端校验与 UI 校验一致。

规则使用受限条件和字段操作（equals、in、missing、and、or），输出 warning / blocking 与建议；不 eval，不执行外部脚本。模板只插值允许的参数键，未填项不可混入“undefined”。摄影方案身份字段受保护，变化先预览，用户已设置值不静默覆盖。

POST /skills/extract 只接受粘贴文本和可选 sourceUrl 作为来源元数据，不自动请求 URL。辅助提炼通过受限结果结构验证；输出草稿、来源事实、推断、未知与建议。未设置辅助服务时提供手工编辑，不伪装 AI 提炼成功。此辅助功能接入亦需后续服务能力与素材边界核查。

POST /skills/:skillId/preview 接收 versionId、params、currentPlan，返回 patch、promptFragment、warnings、blockingIssues、checklist。用户显式应用才保存 skillRunSnapshot：版本、输入、建议、选择、最终 patch 与 checklist。

试用记录关联指定版本、人物、任务目标、供应商 / 模型条件与人工评价；版本更新不继承“已验证”。已验证需要该版本记录，不由 AI 单次提炼赋值。

## 生成任务与供应商边界

生成任务：id、ownerId、planVersionId、submissionKey、snapshotHash、status、provider、model、providerRequestId、attempt、estimatedCost（可空）、actualCost（可空）、errorCode、startedAt、finishedAt。

同一 ownerId + submissionKey 唯一；相同 key 和不同 snapshotHash 返回冲突。提交先冻结方案、事务写任务，再通过 worker 执行，HTTP 页面刷新不重复触发供应商调用。各次显式重试使用新 key，先展示输入与可能成本。

状态：submitting → queued → running → succeeded / failed / rejected；远端超时且无法证明未执行时进入 unknown。状态未知只能核实，不自动付费重发；取消未确认不可宣称 canceled 或退款。供应商无任务查询时，保留本地持久化结果与 unknown 反馈，不伪装支持远端查询。

结果只有图片已安全下载到私有存储、数据库资产记录成功后才能 succeeded；原始远程 URL 不作为公开图源。供应商输出损坏 / 保存失败保留任务错误和恢复信息；重试持久化不能再次生图。

供应商契约：capabilities（文字生图、人物参考、编辑、任务查询、尺寸限制）、submit(snapshot)、reconcile(requestId)（若支持）、estimate(options)（可未知）。技能语义输出与供应商参数翻译分离；不支持能力在发送前明确拒绝。

前端只接收能力、状态和可知成本；凭据只在服务端。发送前展示最终提示词与生成参考素材列表。供应商数据保留、训练用途、商业使用、账户权限和价格在接入任务中核查，未完成核查不发送真实素材。

## 来源回溯与导出

作品详情读取任务快照，不从资产当前版本反推历史。重用复制旧方案成新草稿；如选择升级技能版本先预览差异。快捷作品仅显示实际存在的文本、选项和技能记录。

私有媒体通过认证后的资源代理读取，存储目录不能挂到公开静态资源。导出原输出图片；配置导出为 JSON、可选，排除凭据、存储路径和他人资源；导出失败可重试读取，不重复生成。

## 可观察状态与指标

所有资源列表 / 详情有 loading、empty、error、success、validation 和 unauthorized 行为；本地操作成功以前不显示已保存。任务 unknown 与 failed 分开。费用不可知显示未知。

满意成本 = 所有可知生成费用 / 满意作品数；费用不完整时注明缺失，零满意时未定义。资产复用、入口和会话事件不记录私密提示词全文。效果评估和用户访谈未执行，架构不写实验通过。

## 实现位置与 worker lease

共享 schema / 迁移使用 packages/db，共享认证适配使用 packages/auth，Web 注入本地 SQLite 配置。GenerationJob 另含 leaseOwner、leaseExpiresAt、attempt、providerRequestId?、errorCode?、storageState；原子领取 queued job 后写 lease，持续心跳。lease 失效且外部调用已开始时进入 unknown，禁止重新派发；仅本地持久化失败且结果字节仍可恢复时重试保存，否则标记明确错误。私有 media 路由归 studio 所有。

## PRD v4 Prompt 增量契约

权威字段与API：specs/prompts/ARCH.md（本目录相对prompts/ARCH.md）。Prompt/Source/Version/Trial/Cover继承owner、事务、分页、乐观锁与仅归档规则。新增/api/prompts CRUD/versions/sources/trials/cover/reuse/from-work及archive/restore；GET /api/archive新增kind=prompt，skills/extract新增sourcePromptVersionId。source URL只记录，不请求。

ShotPlanVersion/GenerationJob冻结nullable promptOrigin和actualSubmittedText/adaptation，SkillVersion追加nullable sourcePromptVersionId；Work读job快照。savedWork关联只由from-work绑定服务器sourceWorkId和同owner/job/actualTextHash，旧job不回填来源。

DUPLICATE_PROMPT 409为非强制合并提示；正常VERSION_CONFLICT保持。Prompt原文textHash非unique索引以允许用户另存。Topic不是生图模式：仅portrait可reuse/submit，landscape/illustration/other可收藏与复制。浏览/保存/封面不触发生成/抓取/辅助提炼。unsupported负面词/参数保原文、明确遗漏，显式确认适配后的最终稿才提交。字段限值与幂等规则详见prompts/ARCH，消费者不能另造契约。

Prompt快捷草稿增量：POST /api/quick/drafts及studio.createQuickDraft只创建独立quick草稿，optional projectId；无项目时事务建立本人快捷容器。精确字段与owner/来源/替换规则以prompts/ARCH为准，归prompts/TASK-004集成，不新建生成服务。

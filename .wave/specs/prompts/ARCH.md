# prompts 技术架构

物料状态：READY

## 来源、目标与边界

INIT PRD v4；MODULE / DESIGN / UI；共享 ../CONTRACTS.md。沿用 Next apps/web、SQLite / Drizzle、Better Auth、已有 pnpm / 测试策略；不新增依赖、模型或社交连接。领域服务 src/server/prompts，界面 src/features/prompts，路由 src/app/prompts，共享 schema packages/db。
prompts 协调读取 studio / gallery / skills 已存在对象；studio 只校验共享 schema 中来源引用的 owner / 归档并冻结来源，不导入 prompts 业务服务；gallery 读来源快照，skills 存来源 FK。无双向服务导入、无第二套队列或媒体路由。

## 数据模型

Prompt：id、ownerId、title、topic（portrait/landscape/illustration/other）、tags、notes、readiness（inbox/ready）、favorite、currentVersionId、expectedVersion、archivedAt、createdAt、updatedAt。readiness 不代表已验证。
PromptSource：id、promptId、ownerId、kind（url/work）、sourceWorkId?（仅from-work服务写入）、url?、platform?、author?、availability（unknown/userReportedUnavailable）、createdAt；http(s) 无 userinfo，仅元数据，不自动访问。
PromptVersion：id、promptId、ownerId、number、parentVersionId?、text、negativeText?、declaredProvider?、declaredModel?、declaredParameters（受限 JSON）、referenceNotes?、changeNote?、textHash、createdAt；正文不可变，v1 原文永久保留。修改元数据与内容版本分离。
PromptTrial：id、ownerId、promptVersionId、associationMode（origin/savedWork）、generationJobId、evaluation（unrated/satisfied/improve）、note?、expectedVersion、createdAt；job/version 唯一，结果 / 条件从 job 的不可变快照读取，不重复保存假成功状态。
PromptCover：promptId、ownerId、assetId、generationJobId、promptVersionId；封面可来自旧版但 API 明确返回 currentVersionId 与 coverVersionId。选择本人成功未归档 Work/Asset，且任务快照对应本条目该版本，或符合下述from-work原作绑定；旧关联作品归档不删除封面。
ShotPlanVersion / GenerationJob 的冻结快照追加 promptOrigin（promptId,versionId,versionNumber,originalTextHash）与 actualSubmittedText、adaptation（omittedFields,overrides,referenceAssetIds）；历史 nullable，不反推未存在来源。SkillVersion.sourcePromptVersionId?，Work 可由 job 得来源，导出含安全来源字段，不含私有路径。

## API 契约

| 方法 / 路径                            | 输入                                                                           | 输出                                          |
| -------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------- |
| GET /api/prompts                       | query,topic,platform,model,trialState,favorite,tags,cursor,limit,archived      | items,nextCursor                              |
| POST /api/prompts                      | text,metadata,sources,allowDuplicate?                                          | Prompt+v1 或 DUPLICATE_PROMPT 409+本人重复 id |
| GET /api/prompts/:id                   | versionId?                                                                     | 条目、版本、来源、试用、封面版本              |
| GET /api/prompts/:id/versions          | cursor,limit                                                                   | 版本元数据items,nextCursor                    |
| GET /api/prompts/:id/trials            | versionId?,cursor,limit                                                        | 已有试用/任务结果items,nextCursor             |
| PATCH /api/prompts/:id                 | metadata,expectedVersion                                                       | Prompt                                        |
| POST /api/prompts/:id/versions         | fullContent,expectedVersion,changeNote                                         | 新版及新 currentVersionId                     |
| POST /api/prompts/:id/sources          | source,expectedVersion                                                         | Source                                        |
| POST /api/prompts/:id/archive          | expectedVersion                                                                | ArchivedPrompt                                |
| POST /api/prompts/:id/restore          | expectedVersion                                                                | RestoredPrompt                                |
| POST /api/prompts/:id/trials           | versionId,jobId,evaluation?,note?                                              | Trial（校验任务来源）                         |
| PATCH /api/prompts/:id/trials/:trialId | evaluation,note,expectedVersion                                                | Trial                                         |
| POST /api/prompts/:id/cover            | versionId,jobId,assetId,expectedVersion                                        | Cover+current/coverVersionId                  |
| POST /api/prompts/:id/reuse            | versionId,outputOptions,targetDraftId?,replaceConfirmed?,expectedDraftVersion? | 独立 quick 草稿+未应用项；不提交任务          |
| POST /api/prompts/from-work            | workId,title?,topic                                                            | v1+sourceWorkId+Trial / Cover 初始可选引用    |

技能提炼复用 POST /api/skills/extract，增加 sourcePromptVersionId?；发送摘要与用户显式确认，来源不能由客户端伪造跨所有者引用。输出仍为独立待试用草稿，不自动生图或创建已验证技能。

## 规则、事务与安全

ownerId 来自会话；每个 prompt/version/job/asset/work FK 都校验同一 owner 及条目关系。越权 / 不存在404，未认证401；状态写操作 Origin / CSRF。分页24/max100；text 1–20000字、negativeText≤10000、notes≤5000、tags≤20项、每项≤40字、sourceURL≤2048、declaredParameters≤16KiB且纯数据，服务端校验与UI相同（工程限值，不是假定业务统计）。SQL绑定参数，LIKE 转义；无 eval、脚本 / 模板执行、HTML 直出或源 URL 请求。
保存新版本、更新currentVersion与乐观锁在事务内；原文重复用 owner+textHash 索引提示（不唯一），hash基于仅规范换行/首尾空白文本，不按来源URL或近似语义自动合并。并发新建复核重复；用户可明确另存。追加来源不修改v1。
试用来自现有持久任务的来源关联；from-work的savedWork关联仅允许新条目v1的服务器sourceWorkId绑定：同owner，原Work.jobId匹配且v1.textHash与该任务actualSubmittedText规范hash一致。旧job来源不回填，此关联表示从该作品收存的文本，不宣称旧任务原先引用此Prompt。封面选择也允许该严格原作绑定；其他关联必须有job快照中的对应promptOrigin。失败/unknown也可记录任务，但封面只能successful资产。从作品保存为Prompt必须本人且实际文本存在，来源绑定新v1；并不宣称v1包含全部参考能力。
reuse 默认新草稿；替换须expectedDraftVersion+明确replaceConfirmed；只允许portrait，其他题材422 CAPABILITY_UNSUPPORTED但可收藏复制。负面词/参数unsupported保留原文并列omittedFields；用户检查适配稿后显式提交，不能默默当原模型参数生效。生成入口服务端复核题材及虚构人物政策，前端禁用不能代替校验。

## UI 状态、性能、运行与验证

读取pending→loading；无结果→文本摘要；409重复 / 乐观锁→选择；图片读取失败仅 media 重试；生成unknown沿用 reconcile 不重发。归档默认隐藏、历史可查，restore保留FK，无DELETE。
单实例持久SQLite，owner / archived / topic / created / textHash索引，24条分页，按需读版本/试用，缩略图延迟加载；初版参数化关键词检索，暂不向量库或图搜索。复用现有私有media GET /api/media/:assetId；日志只记录ID/错误/耗时，不记录原文全文或URL。
测试边界：跨owner FK、并发版本/重复提示、旧封面/新版本、归档恢复、不支持参数、草稿替换、失败/unknown、外链零请求。使用替身验证行为，真实试用仅在原供应商门核查及用户授权费用后进行，不宣称实测。技术目标与基础命令以 TECH_DECISIONS / 实际scripts为准。

详情默认只返回当前版与最近24条元数据；后续版本/试用通过上述分页接口按需读，不把所有长文本或原图塞入列表。GET返回仅安全媒体assetId，不泄露privateStorageKey。

快捷草稿容器：reuse内部调用studio.createQuickDraft，新增必要服务入口POST /api/quick/drafts（text, outputOptions, promptOrigin?, optional projectId），只创建草稿不发任务。无projectId时事务建立本人快捷项目容器与首个草稿，不要求先完成建项目表单；有projectId须本人未归档。替换目标草稿仍需确认及乐观锁，不能更新已提交ShotPlanVersion；另存新版本。客户端不能任选他人项目。此基础只为全局quick与Prompt复用连接，由prompts/TASK-004补齐，原人物/摄影流程不变。

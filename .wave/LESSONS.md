# SweetWave 经验记录

记录跨任务、跨阶段仍然有价值的经验。不要写常规流水账。

## 记录原则

- 架构决策及理由
- 踩坑和解决方式
- 影响后续任务的约束
- 环境、依赖、部署或测试的特殊处理
- 用户明确确认过的重要业务规则

## YYYY-MM-DD — <阶段 / 任务>

- 背景：
- 决策：
- 理由：
- 后续影响：

## 2026-09-16 — Better-T-Stack初始化

- 官方CLI3.43.0 Next/self组合首次生成开发.env，用户明确授权该具体例外；仍不主动读取/编辑秘密文件。
- pnpm11大包下载超时可仅恢复install，延长fetch-timeout并降低并发；生成成功不得重跑。
- 官方模板allowBuilds只列sharp，需审查后仅加入已有esbuild；不放开全部脚本。
- 默认Biome check --write .应限定工程并采用只读check，避免触及.wave；环境、node_modules、.next构建产物应排除/忽略。
- 安全/QA技术骨架通过不代表模板注册与产品所有者权限已验收；后续scaffold/workspace继续处理。

## 2026-09-16 — APP-SHELL-001

- Stitch MCP作为视觉来源仍按当前PRD路由实施；旧稿缺Prompt时补v4入口，不将旧业务数据或未评审稿声明为已批准高保真。
- 安装Next16.3.5文档的错误边界使用retry；不要凭旧版本惯例套用reset。
- Varlock在dev/build自动重写env.ts类型声明格式；codegen及工程check只格式化固定生成.ts，避免构建后lint不稳定，仍不主动读取/编辑.env，不降低规则。
- Better Auth可选Vitest peer支持2–4，本任务选Vitest4并通过pnpm peers check；配置CJS转ESM后应重启测试worker再验证。

## 2026-09-16 — workspace/TASK-001

- 私有身份来自BetterAuth可信签名会话与数据库单例Owner；后续每个领域/媒体API必须调用requireOwner，不接受客户端ownerId。页面文案不是访问控制。
- 初始化拒绝认领所有旧用户；同邮箱复跑不重置密码/会话。真实私有库与Owner未自动设置，CLI要求显式本地文件及TTY隐藏密码。
- 应用迁移统一praxis_migrations账本，未来有序新增不可变迁移对象；不要混用原drizzle-kit migrate/generate/push。测试首次/升级/复跑和旧数据保留。
- Node24 strip-types不支持TS参数属性，初始化脚本使用显式字段及受控相对源解析，不新增tsx等运行器依赖。终端应先raw/监听再显示密码提示，避免回显竞态。
- 认证成功保留BetterAuth协议与cookie，错误采用通用envelope；限流429/Retry-After保留，内部5xx归503。真实登录界面与生产TLS/cookie由后续任务验证。

## 2026-09-16 — prompts/TASK-001

- 原文v1原样持久化，hash只规范换行/首尾空白；metadata独立更新，完整新正文创建版本。当前指针复合deferred FK和历史不可变trigger由0002权威迁移建立，不能用Drizzle push覆盖这些约束。
- Work/Job/Plan/Skill表尚不存在，sourceWorkId暂NULL；未来接线须新迁移调整约束，不修改0002或伪造历史来源。
- SQLite竞争可能在CAS前返回SQLITE_BUSY，仅已回滚且明确code的本地事务有限重试，使loser读到新版本后返回409；外部/不确定提交不得自动重试。
- 验证纯JSON先检查深度/危险键再递归schema，16KiB按UTF8字节；来源URL只保存元数据，不隐式请求。
- Vitest脚本追加`-- prompts`可能仍执行全项目，精确范围用`pnpm --filter @praxis/web exec vitest run tests/prompts`；新增迁移时旧测试核对目标账本项，不能假设全账本永远只有1项。

## 2026-09-16 — prompts/TASK-002（覆盖旧BUSY恢复建议）

- Drizzle/libsql异常阶段不能可靠区分BEGIN与COMMIT；SQLITE_BUSY不能直接视作已回滚。当前撤销TASK001泛事务重放，由withDatabaseWrite按canonical file进程内排队整个事务，保留原错误，避免不确定提交重复执行。
- 同文件不同客户端共队列，独立memory/不同文件独立；helper不可重入，未来领域整事务应复用，不持同file锁再调用会写库的认证层。跨进程/既有认证写仍SQLite仲裁，失败核实状态，不盲重试。
- canonicalPath动态join会触发Next whole-project tracing，改等价路径拼接后构建无警告，NFT敏感工程路径匹配0；运行数据库身份不应成为打包依赖。
- 标签用重复URL tags参数AND，其余重复标量拒绝；当前版model/文本筛选与来源EXISTS避免重复行；稳定时间/id分页与字面LIKE转义。
- 历史hash查重包含本人归档条目并安全返回状态，不按来源URL合并；allowDuplicate显式另存。Trial除untried尚未建则422明确，后续TASK003接线后再开放评价筛选。

# workspace/TASK-001 安全专项

- 结论：PASSED（仅认证/初始化/持久化基础，不是产品全闭环或部署许可）
- 角色：security-engineer
- 日期：2026-09-16
- 触发原因：high 风险认证、会话、本人账户初始化与数据库迁移。
- 输入：安全角色手册、workspace TASKS/ARCH/SPEC、specs/CONTRACTS.md、TASK-001 handoff/database handoff、TEST_REPORT、TASK-001-BASELINE.json、实际相关源码/测试/脚本。
- Git 基线：01be53ecb321293f1fef320c4110d6d9c7c6aacd；此前 bootstrap/scaffold 与 .wave 变更不归本任务。

## 检查与证据

| 项目 | 结论与证据 |
| --- | --- |
| 禁注册与单所有者会话 | packages/auth 的 disableSignUp:true；关闭 cookieCache；session.create.before 必须匹配数据库 Owner，缺配置或其他用户拒绝。真实 Better Auth 测试覆盖直接注册拒绝和他人已有凭据拒绝登录 |
| 可信身份守卫 | requireOwner 调用服务端 getSession、强制关闭 cookie cache、显式校验 expiresAt 与 Owner.userId；只派生 ownerId，无客户端归属输入。伪造、过期及改成其他用户的真实签名会话均拒绝 |
| 认证 HTTP 边界 | 精确 method/path 白名单仅 GET get-session、POST sign-in/email、POST sign-out；POST Origin 严格匹配配置 origin。除登录外先调用 requireOwner。SDK cookie 签名/CSRF机制未移除，成功原 Response 保留 cookie；错误不传播原响应内部字段 |
| 错误及缓存 | 所有响应 no-store；随机 requestId。401/403→401，5xx→503；429保持429/Retry-After；不回传密码、数据库详情或堆栈。测试针对429/500通用错误通过 |
| Owner与初始化 | Owner CHECK singleton主键、唯一 user FK、ON DELETE RESTRICT；事务同时创建 user/credential/owner。密码 Better Auth hashPassword，12–128字符，规范化邮箱。相同邮箱复跑不更新密码/会话，不同配置Owner或已有未认领用户拒绝；单例/FK及旧数据拒绝测试通过 |
| 非破坏迁移 | 仅固定代码的 CREATE TABLE/INDEX IF NOT EXISTS，无 DROP/DELETE/覆盖；参数绑定查写 praxis_migrations。DDL与账本同事务、错误传播，显式开启FK。sql.raw仅用于不可变内置迁移字符串，不接受外部输入。根与db包迁移统一新runner，README要求备份与停写、禁止混用旧Drizzle账本 |
| 本地CLI与秘密 | 仅 migrate/initialize-owner 与唯一显式本地 file: URL；拒绝file://、远程协议、query/fragment、:memory:、NUL与额外argv；无dotenv/env/readFile加载、无密码argv/env/log。密码仅TTY，raw/监听先于提示，取消与终止恢复raw；输出只有固定通用状态 |
| Source loader | Node24 strip-types；仅受控项目 db/src、server/auth 源文件父路径的相对导入 fallback，目标保持仓库内；无用户导入路径/远程loader/新依赖。该边界假定本地仓库文件可信，不当成恶意仓库沙箱 |
| 范围与产物保护 | 无生图/网络供应商调用、业务资源API或生产操作。环境/data忽略有效。Web/auth package相对baseline不变，无新依赖声明；baseline不覆盖lock/workspace，不能据此声称锁文件字节未变 |

## 实际验证

- `pnpm --filter @praxis/web test -- workspace`：exit0，4文件11项通过；只用内存/临时SQLite，CLI临时库测试自动清理，无真实库迁移或真实Owner创建。覆盖真实签名会话、禁注册、他人/过期/伪造身份、Origin、错误边界、幂等/冲突/FK/保留数据与CLI非法参数/非TTY。
- 指定 handoff/规格/源码/测试/配置 `cat` 与安全关键字 `rg`：成功；无环境内容读取、秘密日志或供应商调用。初次CONTRACTS路径不存在，随后读取正确 `.wave/specs/CONTRACTS.md`；没有据错误路径作结论。
- Python仅读取BASELINE所列非环境源码计算SHA256：既有差异为handoff的auth handler/config、db package/schema、Vitest配置及Next自动类型/tsbuildinfo；没有既有源码移除。root package与新文件以handoff为范围依据，不把HEAD全部差异归本任务。
- `git check-ignore apps/web/.env data/media/example.png`：exit0；仅索引路径核验。
- `git diff --check`：exit0。
- 额外连接级FK检查：`node --input-type=module` 导入实际安装的 @libsql/client，`createClient({url:'file::memory:'})` 新连接只执行 `PRAGMA foreign_keys`，exit0，结果 `[{"foreign_keys":1}]`，finally关闭。确认当前驱动新连接默认开启FK，不依赖此前迁移连接；未操作真实库。
- type/lint/build/db types与真实临时PTY无密码回显证据引用TASK-001/TEST_REPORT；不重复构建，不读取/展示/编辑任何环境文件或凭据。

## 发现、严重度与后续风险

无阻止本任务检查点的范围内发现。

1. **中，后续接口门禁**：复用guard已提供，但领域资源/媒体API尚未实现，每个入口必须可信会话派生ownerId；页面仍占位是允许范围，不代表私有全产品完成。TASK-003实现登录/returnTo时须站内白名单与会话失效验证。
2. **低，操作风险**：真实库/Owner尚未设置；本地文件路径由可信操作员指定，相对路径按cwd解析。初始化前核对目标路径、文件权限和备份；不混用旧db:push/generate与praxis_migrations。
3. **低，运行假设**：Node24实验module hooks/strip-types及现代TTY需匹配版本；PTY回显结论引用已有临时运行证据，本专项未再执行真人凭据交互。未来变更终端逻辑须重复取消/密码回显检查。
4. **低，部署边界**：Cookie配置沿用Better Auth默认，本机测试验证签名/失效，未对TLS/代理/Secure生产场景验收；无生产部署授权。未执行网络CVE审计，不声明全部传递依赖无漏洞。

仅新增本报告与security交接；父流程继续其余门禁，业务AC不由此报告勾选。

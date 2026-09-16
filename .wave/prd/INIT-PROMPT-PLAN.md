# INIT PRD v4 增量规划交接

物料状态：READY

## 范围与结果

仅新增F-013–F-015及F-005/F-008–F-012必要连接。独立prompts模块完成MODULE、DESIGN、UI、ARCH、SPEC、TASKS；旧功能正文/任务编号保留，跨模块文档仅追加v4节。用户选择的多题材收藏/人像生成、自生成封面/外部仅链接均落实为接口与验收规则。

新增页面：/prompts、/prompts/new、/prompts/:promptId。新增数据：Prompt/Source/Version/Trial/Cover，源版本与实际任务输入冻结；不会新建队列/媒体服务。作品反向保存绑定旧原作，禁止回填旧任务不存在的Prompt来源；跨所有者与归档边界在服务端校验。模板、外图导入、自动抓取、批量测试、语义/图检索均未纳入。

## 开发顺序

基础前置仍为原bootstrap→原APP-SHELL-001（追加三壳路由）与旧工作区基础。新增任务顺序TASK-001存储/版本→TASK-002检索/归档→TASK-003试用/封面→TASK-004快捷/作品/技能来源连接→TASK-005页面→TASK-006增量QA。逐项旧依赖见[任务清单](../specs/prompts/TASKS.md)，不能绕过原生成/供应商/作品能力。

- 模块：9个（新增prompts，旧8个保留）。
- 任务：27个（旧21个+新增6个），实际完成0。
- 唯一已有APP-SHELL-001追加导航/三路由，没有第二个scaffold/bootstrap任务。
- 质量：文档增量检查见[PLAN_REPORT](../PLAN_REPORT.md)，不代表已实现或效果验证。

## 前置阻塞与下一步

工程仍未创建，原bootstrap自动.env创建与禁写规则冲突仍BLOCKED。本次未改变该规则或依赖授权；运行前先处理原阻塞，再手动$sw bootstrap，人工检查后$sw scaffold。完整工程门未通过不可直接run prompts。

本次Stitch未请求：未修改旧提示词/生成资产，旧19稿及导航尚STALE，不能作为v4视觉验收。后续如需，仅针对新增页及必要连接单独调用$sw ui prompt或$sw ui stitch。

研究PARTIAL，真实Prompt样本检索/旧封面理解与生图效果/费用实验未执行。当前仅文档规划完成，不安装、生成代码、提交或部署。

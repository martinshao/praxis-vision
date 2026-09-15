# 技术初始化规格

物料状态：READY
输入：MODULE.md、ARCH.md、BOOTSTRAP.md、../../TECH_DECISIONS.md；唯一 PLATFORM-BOOTSTRAP-001。

读取真实 CLI 版本 / help、目录及 Git 基线；以 BOOTSTRAP 显式配置 dry-run，通过并重新检查基线后正式生成（保留 no-git/no-install），单独 pnpm install。不运行数据库迁移 / push / seed。

验收：bts.jsonc 和 pnpm workspace 存在，唯一 apps/web 与所选 auth/db/ui/config 包吻合，无嵌套 Git和现有文档丢失；依赖锁固定，真实 check-types/check/build 能通过。测试工具未由生成器建立时如实记录 NOT_AVAILABLE，交由 APP-SHELL-001 建立。生成器示例和自动生成无密钥配置须列入 handoff。

生成成功、安装失败只恢复 install；部分生成保留现场并阻塞；验证失败修复已生成工程，不重新生成。handoff 路径 ../../handoffs/platform-bootstrap/PLATFORM-BOOTSTRAP-001.md，记录 CLI / 命令 / 路径 / 基线 / 各步骤证据 / 恢复标记。

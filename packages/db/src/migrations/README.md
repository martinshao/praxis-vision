# Workspace database migration

`migrateDatabase(db)` is an explicit local initialization operation using the
injected Drizzle/libsql database. The initialization CLI calls it before owner
creation; request handlers must not call it. No database or environment file is
opened by importing this module.

The first migration creates Better Auth's four tables and indexes if absent,
then adds the singleton owner table. Existing auth tables and rows are retained.
All DDL and the `praxis_migrations` journal entry execute in one write
transaction. A failure rolls back that transaction and propagates to the caller;
the next explicit invocation can retry. Existing incompatible tables or duplicate
credentials must be investigated rather than overwritten. Foreign keys are
enabled on the injected connection before migration.

Before migrating an existing database, stop application writers and create a
verified SQLite backup using SQLite's backup mechanism. This additive migration
has no automatic destructive down migration. To roll back application code,
leave the additive tables in place; to roll back database state, stop writers and
restore the verified backup, accounting for any writes made since it was taken.
Neither rollback nor backup commands run automatically.

Owner initialization is transactional: it creates user, credential account, and
singleton owner together. A repeated initialization with the same normalized
email returns `unchanged` without replacing the password. A different configured
owner, or any preexisting users without an owner, causes a safe rejection.
Email normalization and password validation/hashing belong to the caller.

`praxis_migrations` is the authoritative application ledger. The root and db-package
`db:migrate` scripts both use this runner, with an explicit local file URL. Do not
mix the generator's `drizzle-kit migrate/generate/push` workflow with this ledger.
Future tasks create a new immutable versioned migration object and append it to
the ordered migration list in `migrate.ts`; never edit an already applied object's
id or statements. Verify both fresh and existing temporary databases and replay.

## Prompt persistence (0002)

The second immutable migration adds `prompt`, `prompt_version`, and
`prompt_source`, leaving auth and historical rows unchanged. Prompt creation
must insert its row and its first version in the same transaction: the composite
current-version foreign key is deferred until commit and proves that the version
belongs to the same prompt and owner. Parent-version and source foreign keys
also prove the prompt/owner relationship. Owner IDs reference the configured
owner's unique user ID, not arbitrary authenticated users. Versions reject SQL
updates and deletes; prompts and sources reject deletes. Use metadata updates,
new versions, and later archive/restore services instead.

The owner/text-hash index is intentionally nonunique: duplicate handling belongs
to the service and the user may explicitly save another entry. This task has no
Work, GenerationJob, ShotPlanVersion, or SkillVersion table to alter. The nullable
`source_work_id` column is present but constrained to NULL and only URL sources
are accepted. The future from-work integration must add a new migration that
opens work sources and adds genuine work/owner foreign keys when the real table
exists; it must not fabricate historical provenance. No snapshot or skill fields
are claimed as migrated here.

The application ledger is required for the deferred current-version constraint
and permanent-version triggers; Drizzle's schema declarations cannot express
SQLite deferred foreign keys or these triggers. Never use `drizzle-kit push` to
replace this migration. The migration takes a write transaction; stop writers and
back up first as above. No production database or real account has been migrated
by this implementation. Rollback keeps the additive schema or restores a verified
backup explicitly; there is no destructive down operation.

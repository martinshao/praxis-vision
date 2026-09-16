import { sql } from "drizzle-orm";
import type { Database } from "./index";
import { workspaceMigration } from "./migrations/0001-workspace";
import { promptsMigration } from "./migrations/0002-prompts";

/** Run explicitly from the local initialization CLI, never during a request. */
export async function migrateDatabase(db: Database): Promise<void> {
	await db.run(sql`PRAGMA foreign_keys = ON`);
	await db.transaction(async (tx) => {
		await tx.run(sql`CREATE TABLE IF NOT EXISTS praxis_migrations (
 id TEXT PRIMARY KEY NOT NULL, applied_at INTEGER NOT NULL
)`);
		for (const migration of [workspaceMigration, promptsMigration]) {
			const applied = await tx.all<{ id: string }>(
				sql`SELECT id FROM praxis_migrations WHERE id = ${migration.id}`,
			);
			if (applied.length > 0) continue;
			for (const statement of migration.statements) {
				await tx.run(sql.raw(statement));
			}
			await tx.run(
				sql`INSERT INTO praxis_migrations (id, applied_at) VALUES (${migration.id}, ${Date.now()})`,
			);
		}
	});
}

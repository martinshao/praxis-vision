// @vitest-environment node
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createDb } from "@praxis-vision/db";
import { initializeOwner } from "@praxis-vision/db/initialize-owner";
import { migrateDatabase } from "@praxis-vision/db/migrate";
import { owner, user } from "@praxis-vision/db/schema";
import { describe, expect, it } from "vitest";

async function withTemporaryDb(
	run: (db: ReturnType<typeof createDb>) => Promise<void>,
) {
	const directory = await mkdtemp(join(tmpdir(), "praxis-workspace-db-"));
	const db = createDb({
		DATABASE_URL: `file:${join(directory, "test.sqlite")}`,
	});
	try {
		await run(db);
	} finally {
		db.$client.close();
		await rm(directory, { recursive: true, force: true });
	}
}

describe("workspace database migrations", () => {
	it("initializes atomically and reruns without rotating credentials", async () => {
		await withTemporaryDb(async (db) => {
			await migrateDatabase(db);
			const input = {
				email: "owner@example.test",
				name: "Owner",
				passwordHash: "test-hash",
			};
			expect((await initializeOwner(db, input)).status).toBe("created");
			expect(
				(await initializeOwner(db, { ...input, passwordHash: "replacement" }))
					.status,
			).toBe("unchanged");
			expect((await db.query.account.findMany())[0]?.password).toBe(
				"test-hash",
			);
			await expect(
				initializeOwner(db, { ...input, email: "other@example.test" }),
			).rejects.toMatchObject({ code: "OWNER_ALREADY_CONFIGURED" });
			expect(await db.select().from(user)).toHaveLength(1);
		});
	});
	it("migrates twice, preserves owner, and enforces singleton and foreign key constraints", async () => {
		await withTemporaryDb(async (db) => {
			await migrateDatabase(db);
			await db
				.insert(user)
				.values({ id: "first", name: "Owner", email: "owner@example.test" });
			await db.insert(owner).values({ userId: "first" });
			await migrateDatabase(db);
			expect(await db.select().from(owner)).toHaveLength(1);
			expect(
				(
					await db.$client.execute(
						"SELECT id FROM praxis_migrations WHERE id = '0001-workspace-auth-owner'",
					)
				).rows,
			).toHaveLength(1);
			await expect(
				db.insert(owner).values({ id: "second", userId: "first" }),
			).rejects.toThrow();
			await expect(db.delete(user)).rejects.toThrow();
		});
	});
	it("adopts existing generator auth tables without replacing existing rows", async () => {
		await withTemporaryDb(async (db) => {
			await db.$client.execute(
				`CREATE TABLE "user" (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, email_verified INTEGER NOT NULL DEFAULT 0, image TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
			);
			await db.$client.execute(
				`INSERT INTO "user" VALUES ('existing', 'Existing', 'existing@example.test', 0, NULL, 1000, 2000)`,
			);
			await migrateDatabase(db);
			await migrateDatabase(db);
			const rows = await db.select().from(user);
			expect(rows).toHaveLength(1);
			expect(rows[0]?.createdAt.getTime()).toBe(1000);
			await expect(
				db.insert(owner).values({ userId: "absent" }),
			).rejects.toThrow();
			await expect(
				initializeOwner(db, {
					email: "new@example.test",
					name: "New",
					passwordHash: "test",
				}),
			).rejects.toMatchObject({ code: "EXISTING_USERS" });
		});
	});
});

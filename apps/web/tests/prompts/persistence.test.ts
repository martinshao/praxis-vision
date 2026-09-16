// @vitest-environment node
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createDb } from "@praxis-vision/db";
import { migrateDatabase } from "@praxis-vision/db/migrate";
import { eq } from "@praxis-vision/db/query";
import { owner, prompt, promptVersion, user } from "@praxis-vision/db/schema";
import { describe, expect, it, vi } from "vitest";
import { UnauthenticatedError } from "@/server/auth/session";
import { createPromptHandler } from "@/server/prompts/http";
import { createPromptService } from "@/server/prompts/service";

async function temporary(
	run: (db: ReturnType<typeof createDb>) => Promise<void>,
) {
	const dir = await mkdtemp(join(tmpdir(), "praxis-prompt-"));
	const db = createDb({ DATABASE_URL: `file:${join(dir, "test.sqlite")}` });
	try {
		await migrateDatabase(db);
		await db
			.insert(user)
			.values({ id: "owner", name: "Owner", email: "owner@example.test" });
		await db.insert(owner).values({ userId: "owner" });
		await migrateDatabase(db);
		expect(
			(await db.$client.execute("SELECT id FROM praxis_migrations")).rows,
		).toHaveLength(2);
		await run(db);
	} finally {
		db.$client.close();
		await rm(dir, { recursive: true, force: true });
	}
}
describe("Prompt persistence", () => {
	it("retains exact v1, separates metadata, appends full content and checks ownership", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			const created = await service.create("owner", {
				text: "  Original\r\ntext  ",
			});
			const id = created.prompt?.id ?? "";
			expect(created.version?.text).toBe("  Original\r\ntext  ");
			expect(created.prompt?.readiness).toBe("inbox");
			await service.metadata("owner", id, {
				metadata: { topic: "landscape", tags: ["tag"] },
				expectedVersion: 1,
			});
			const changed = await service.appendVersion("owner", id, {
				fullContent: {
					text: "Second",
					negativeText: "negative",
					declaredParameters: { seed: 2 },
				},
				expectedVersion: 2,
			});
			expect(changed.version.number).toBe(2);
			expect(changed.version.parentVersionId).toBe(created.version?.id);
			expect(
				(await service.detail("owner", id, created.version?.id)).version.text,
			).toBe("  Original\r\ntext  ");
			await expect(service.detail("other", id)).rejects.toMatchObject({
				code: "RESOURCE_NOT_FOUND",
			});
			const other = await service.create("owner", { text: "Other" });
			await expect(
				service.detail("owner", id, other.version?.id),
			).rejects.toMatchObject({ code: "RESOURCE_NOT_FOUND" });
			await expect(
				service.metadata("owner", id, {
					metadata: { text: "overwrite" },
					expectedVersion: 3,
				}),
			).rejects.toThrow();
			await expect(
				db.update(promptVersion).set({ text: "overwrite" }),
			).rejects.toThrow();
			await expect(db.delete(promptVersion)).rejects.toThrow();
			expect(
				(await service.versions("owner", id, { limit: 1 })).nextCursor,
			).toBe(2);
			expect(
				(await service.versions("owner", id, { cursor: 2, limit: 1 })).items[0]
					?.number,
			).toBe(1);
		}));
	it("CAS concurrent writes admit one winner and preserve transaction state", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			const created = await service.create("owner", { text: "one" });
			const id = created.prompt?.id ?? "";
			const results = await Promise.allSettled([
				service.appendVersion("owner", id, {
					fullContent: { text: "two" },
					expectedVersion: 1,
				}),
				service.appendVersion("owner", id, {
					fullContent: { text: "three" },
					expectedVersion: 1,
				}),
			]);
			expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
			expect(results.filter((r) => r.status === "rejected")).toHaveLength(1);
			const loser = results.find((r) => r.status === "rejected");
			if (loser?.status === "rejected")
				expect(loser.reason).toMatchObject({ code: "VERSION_CONFLICT" });
			expect((await service.detail("owner", id)).prompt.expectedVersion).toBe(
				2,
			);
			expect((await service.versions("owner", id, {})).items).toHaveLength(2);
			await expect(
				service.addSource("owner", id, {
					source: { kind: "url", url: "https://example.test/a" },
					expectedVersion: 1,
				}),
			).rejects.toMatchObject({ code: "VERSION_CONFLICT" });
			await db.$client.execute(
				`CREATE TRIGGER reject_source BEFORE INSERT ON prompt_source BEGIN SELECT RAISE(ABORT,'test rollback'); END`,
			);
			await expect(
				service.addSource("owner", id, {
					source: { kind: "url", url: "https://example.test/a" },
					expectedVersion: 2,
				}),
			).rejects.toThrow();
			expect((await service.detail("owner", id)).prompt.expectedVersion).toBe(
				2,
			);
		}));
	it("validates limits and records external URL only with zero network requests", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			let deep: unknown = {};
			for (let index = 0; index < 1000; index++) deep = { child: deep };
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			try {
				const created = await service.create("owner", {
					text: "<script>alert('data')</script>",
					sources: [{ kind: "url", url: "http://127.0.0.1/private" }],
				});
				const id = created.prompt?.id ?? "";
				await service.addSource("owner", id, {
					source: {
						kind: "url",
						url: "https://example.test",
						availability: "userReportedUnavailable",
					},
					expectedVersion: 1,
				});
				await service.detail("owner", id);
				expect(fetchSpy).not.toHaveBeenCalled();
				for (const input of [
					{ text: " " },
					{ text: "ok", declaredParameters: deep },
					{ text: "x".repeat(20001) },
					{ text: "ok", negativeText: "x".repeat(10001) },
					{ text: "ok", metadata: { notes: "x".repeat(5001) } },
					{ text: "ok", metadata: { tags: Array(21).fill("tag") } },
					{ text: "ok", declaredParameters: { a: "中".repeat(5500) } },
					{
						text: "ok",
						sources: [
							{ kind: "url", url: "https://user:password@example.test" },
						],
					},
					{ text: "ok", ownerId: "other" },
					{ text: "ok", declaredParameters: JSON.parse('{"__proto__":{}}') },
				])
					await expect(service.create("owner", input)).rejects.toThrow();
				await expect(
					service.metadata("other", id, {
						metadata: { favorite: true },
						expectedVersion: 2,
					}),
				).rejects.toMatchObject({ code: "RESOURCE_NOT_FOUND" });
				await db
					.update(prompt)
					.set({ archivedAt: new Date() })
					.where(eq(prompt.id, id));
				await expect(
					service.appendVersion("owner", id, {
						fullContent: { text: "three" },
						expectedVersion: 2,
					}),
				).rejects.toMatchObject({ code: "RESOURCE_NOT_FOUND" });
			} finally {
				fetchSpy.mockRestore();
			}
		}));
	it("HTTP auth, origin, strict inputs, conflict and no-store request envelopes", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			let authenticated = true;
			const handler = createPromptHandler({
				origin: "http://localhost:3001",
				service,
				requireOwner: async () => {
					if (!authenticated) throw new UnauthenticatedError();
					return { ownerId: "owner" };
				},
			});
			const request = (body: unknown, origin = "http://localhost:3001") =>
				new Request("http://localhost:3001/api/prompts", {
					method: "POST",
					headers: { origin, "content-type": "application/json" },
					body: JSON.stringify(body),
				});
			authenticated = false;
			expect((await handler(request({ text: "one" }), "create")).status).toBe(
				401,
			);
			authenticated = true;
			expect(
				(await handler(request({ text: "one" }, "http://evil.test"), "create"))
					.status,
			).toBe(400);
			const response = await handler(request({ text: "one" }), "create");
			expect(response.status).toBe(201);
			expect(response.headers.get("cache-control")).toBe("no-store");
			const body = await response.json();
			expect(body.requestId).toBe(response.headers.get("x-request-id"));
			const id = body.data.prompt.id;
			await handler(
				request({ metadata: { favorite: true }, expectedVersion: 1 }),
				"metadata",
				id,
			);
			const conflict = await handler(
				request({ fullContent: { text: "two" }, expectedVersion: 1 }),
				"appendVersion",
				id,
			);
			expect(conflict.status).toBe(409);
			expect((await conflict.json()).error.currentVersion.expectedVersion).toBe(
				2,
			);
			expect(
				(
					await handler(
						request({
							metadata: { currentVersionId: "bad" },
							expectedVersion: 2,
						}),
						"metadata",
						id,
					)
				).status,
			).toBe(400);
		}));
});

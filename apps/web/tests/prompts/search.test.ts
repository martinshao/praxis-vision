// @vitest-environment node
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createDb } from "@praxis-vision/db";
import { migrateDatabase } from "@praxis-vision/db/migrate";
import { owner, prompt, user } from "@praxis-vision/db/schema";
import { describe, expect, it, vi } from "vitest";
import { UnauthenticatedError } from "@/server/auth/session";
import { createPromptHandler } from "@/server/prompts/http";
import { createPromptService } from "@/server/prompts/service";

async function temporary(
	run: (db: ReturnType<typeof createDb>, url: string) => Promise<void>,
) {
	const dir = await mkdtemp(join(tmpdir(), "praxis-search-"));
	const url = `file:${join(dir, "test.sqlite")}`;
	const db = createDb({ DATABASE_URL: url });
	try {
		await migrateDatabase(db);
		await db.insert(user).values([
			{ id: "owner", name: "Owner", email: "owner@example.test" },
			{ id: "other", name: "Other", email: "other@example.test" },
		]);
		await db.insert(owner).values({ userId: "owner" });
		await run(db, url);
	} finally {
		db.$client.close();
		await rm(dir, { recursive: true, force: true });
	}
}
describe("Prompt search, duplicates and archive", () => {
	it("searches Chinese and literal LIKE symbols with bound values and safe short summaries", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			const created = await service.create("owner", {
				text: `人像 100%_\\literal ${"长".repeat(500)}`,
				metadata: {
					title: "人物",
					topic: "portrait",
					tags: ["摄影", "冷光"],
					favorite: true,
				},
				declaredModel: "model-a",
				sources: [
					{ kind: "url", url: "https://example.test/a", platform: "x" },
					{ kind: "url", url: "https://example.test/b", platform: "x" },
				],
			});
			await service.create("owner", {
				text: "landscape",
				metadata: { topic: "landscape", tags: ["摄影"] },
				sources: [
					{ kind: "url", url: "https://example.test/a", platform: "x" },
				],
			});
			for (const query of ["人像", "100%_\\literal", "%", "_", "\\"]) {
				const result = await service.list("owner", { query });
				expect(result.items).toHaveLength(1);
				expect(result.items[0]?.id).toBe(created.prompt?.id);
			}
			expect(
				(await service.list("owner", { query: "' OR 1=1 --" })).items,
			).toHaveLength(0);
			const found = await service.list("owner", {
				topic: "portrait",
				platform: "x",
				model: "model-a",
				favorite: "true",
				tags: ["摄影", "冷光"],
				trialState: "untried",
			});
			expect(found.items).toHaveLength(1);
			expect(found.items[0]?.summary).toHaveLength(180);
			expect(found.items[0]).not.toHaveProperty("text");
			expect(found.items[0]).not.toHaveProperty("declaredParameters");
			expect(
				(await service.list("owner", { topic: "landscape" })).items,
			).toHaveLength(1);
			await service.appendVersion("owner", created.prompt?.id ?? "", {
				fullContent: { text: "changed", declaredModel: "model-b" },
				expectedVersion: 1,
			});
			expect(
				(await service.list("owner", { model: "model-a" })).items,
			).toHaveLength(0);
			expect(
				(await service.list("owner", { model: "model-b" })).items,
			).toHaveLength(1);
			await expect(
				service.list("owner", { trialState: "satisfied" }),
			).rejects.toMatchObject({ code: "CAPABILITY_UNSUPPORTED" });
		}));
	it("paginates stable timestamp ties without repeats and scopes every page to owner", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			const ids: string[] = [];
			for (let i = 0; i < 5; i++) {
				const saved = await service.create("owner", { text: `text-${i}` });
				ids.push(saved.prompt?.id ?? "");
			}
			await db.update(prompt).set({ createdAt: new Date(1000) });
			const all: string[] = [];
			let cursor: string | null = null;
			do {
				const page = await service.list("owner", {
					limit: "2",
					...(cursor ? { cursor } : {}),
				});
				all.push(...page.items.map((i) => i.id));
				cursor = page.nextCursor;
			} while (cursor);
			expect(all).toEqual(ids.sort().reverse());
			expect(new Set(all).size).toBe(5);
			expect((await service.list("other", {})).items).toHaveLength(0);
			expect((await service.list("owner", {})).items).toHaveLength(5);
		}));
	it("detects normalized historical duplicates including archived prompts; explicit another copy and source append preserve v1", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			const first = await service.create("owner", { text: "  原文\r\nline  " });
			const id = first.prompt?.id ?? "";
			await service.appendVersion("owner", id, {
				fullContent: { text: "新版" },
				expectedVersion: 1,
			});
			await service.archive("owner", id, { expectedVersion: 2 });
			await expect(
				service.create("owner", { text: "原文\nline" }),
			).rejects.toMatchObject({
				code: "DUPLICATE_PROMPT",
				duplicatePrompts: [{ id, archivedAt: expect.any(Date) }],
			});
			const duplicate = await service.create("owner", {
				text: "原文\nline",
				allowDuplicate: true,
			});
			expect(duplicate.prompt?.id).not.toBe(id);
			await service.restore("owner", id, { expectedVersion: 3 });
			await service.addSource("owner", id, {
				source: { kind: "url", url: "https://example.test/a" },
				expectedVersion: 4,
			});
			expect(
				(await service.detail("owner", id, first.version?.id)).version.text,
			).toBe("  原文\r\nline  ");
			// Identical URLs are never the duplicate identity.
			await service.create("owner", {
				text: "different text",
				sources: [{ kind: "url", url: "https://example.test/a" }],
			});
		}));
	it("concurrent duplicate creates on independent SQLite clients admit one by default and both when confirmed", async () =>
		temporary(async (db, url) => {
			const secondDb = createDb({ DATABASE_URL: url });
			try {
				const a = createPromptService(db);
				const b = createPromptService(secondDb);
				const results = await Promise.allSettled([
					a.create("owner", { text: "simultaneous" }),
					b.create("owner", { text: "simultaneous" }),
				]);
				expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
				const loser = results.find((r) => r.status === "rejected");
				if (loser?.status === "rejected")
					expect(loser.reason).toMatchObject({ code: "DUPLICATE_PROMPT" });
				const copies = await Promise.allSettled([
					a.create("owner", { text: "simultaneous", allowDuplicate: true }),
					b.create("owner", { text: "simultaneous", allowDuplicate: true }),
				]);
				expect(
					copies.map((r) =>
						r.status === "fulfilled" ? "fulfilled" : String(r.reason),
					),
				).toEqual(["fulfilled", "fulfilled"]);
				expect((await a.list("owner", {})).items).toHaveLength(3);
			} finally {
				secondDb.$client.close();
			}
		}));
	it("archive/restore CAS preserves versions and sources, default hides archived and history remains readable; zero network", async () =>
		temporary(async (db) => {
			const service = createPromptService(db);
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			try {
				const first = await service.create("owner", {
					text: "history",
					sources: [{ kind: "url", url: "http://127.0.0.1/private" }],
				});
				const id = first.prompt?.id ?? "";
				await service.appendVersion("owner", id, {
					fullContent: { text: "latest" },
					expectedVersion: 1,
				});
				const results = await Promise.allSettled([
					service.archive("owner", id, { expectedVersion: 2 }),
					service.archive("owner", id, { expectedVersion: 2 }),
				]);
				expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
				expect((await service.list("owner", {})).items).toHaveLength(0);
				expect(
					(await service.list("owner", { archived: "true" })).items,
				).toHaveLength(1);
				expect(
					(await service.detail("owner", id, first.version?.id)).version.text,
				).toBe("history");
				await expect(
					service.metadata("owner", id, {
						metadata: { favorite: true },
						expectedVersion: 3,
					}),
				).rejects.toMatchObject({ code: "RESOURCE_NOT_FOUND" });
				await expect(
					service.restore("owner", id, { expectedVersion: 2 }),
				).rejects.toMatchObject({ code: "VERSION_CONFLICT" });
				await expect(
					service.restore("other", id, { expectedVersion: 3 }),
				).rejects.toMatchObject({ code: "RESOURCE_NOT_FOUND" });
				await expect(
					service.archive("other", id, { expectedVersion: 3 }),
				).rejects.toMatchObject({ code: "RESOURCE_NOT_FOUND" });
				await service.restore("owner", id, { expectedVersion: 3 });
				const detail = await service.detail("owner", id);
				expect(detail.versions.items).toHaveLength(2);
				expect(detail.sources).toHaveLength(1);
				expect(detail.prompt.currentVersionId).toBe(detail.version.id);
				expect(detail.prompt.expectedVersion).toBe(4);
				await service.list("owner", { platform: "x" });
				expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy.mockRestore();
			}
		}));
	it("HTTP validates query shape, repeated tags, duplicates and write origin; no-store auth envelopes", async () =>
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
			const get = (query = "") =>
				new Request(`http://localhost:3001/api/prompts${query}`);
			const write = (body: unknown, origin = "http://localhost:3001") =>
				new Request("http://localhost:3001/api/prompts", {
					method: "POST",
					headers: { origin, "content-type": "application/json" },
					body: JSON.stringify(body),
				});
			const saved = await service.create("owner", {
				text: "private raw text",
				metadata: { tags: ["a", "b"] },
			});
			const id = saved.prompt?.id ?? "";
			for (const query of [
				"?limit=0",
				"?limit=101",
				"?limit=1.5",
				"?limit=",
				"?limit=2&limit=3",
				"?archived=0",
				"?favorite=yes",
				"?cursor=bogus",
				"?cursor=8640000000000001:00000000-0000-0000-0000-000000000000",
				"?cursor=9999999999999999:00000000-0000-0000-0000-000000000000",
				"?unknown=x",
				"?topic=nope",
				"?tags=",
				"?query=a&query=b",
			])
				expect((await handler(get(query), "list")).status).toBe(400);
			const listed = await handler(get("?tags=a&tags=b"), "list");
			expect(listed.status).toBe(200);
			expect((await listed.json()).data.items).toHaveLength(1);
			expect(listed.headers.get("cache-control")).toBe("no-store");
			const duplicate = await handler(
				write({ text: "private raw text" }),
				"create",
			);
			expect(duplicate.status).toBe(409);
			const result = await duplicate.json();
			expect(result.error.code).toBe("DUPLICATE_PROMPT");
			expect(result.error.duplicateIds).toEqual([id]);
			expect(JSON.stringify(result)).not.toContain("private raw text");
			expect(
				(
					await handler(
						write({ text: "private raw text", allowDuplicate: true }),
						"create",
					)
				).status,
			).toBe(201);
			expect(
				(
					await handler(
						write({ expectedVersion: 1 }, "http://evil.test"),
						"archive",
						id,
					)
				).status,
			).toBe(400);
			expect(
				(
					await handler(
						write({ expectedVersion: 1, ownerId: "other" }),
						"archive",
						id,
					)
				).status,
			).toBe(400);
			expect(
				(await handler(write({ expectedVersion: 1 }), "archive", id)).status,
			).toBe(200);
			expect(
				(await handler(write({ expectedVersion: 2 }), "restore", id)).status,
			).toBe(200);
			expect((await handler(get("?trialState=tried"), "list")).status).toBe(
				422,
			);
			authenticated = false;
			expect((await handler(get(), "list")).status).toBe(401);
			expect(
				(await handler(write({ expectedVersion: 3 }), "archive", id)).status,
			).toBe(401);
		}));
});

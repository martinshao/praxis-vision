// @vitest-environment node
import { createAuth } from "@praxis-vision/auth";
import { createDb } from "@praxis-vision/db";
import { migrateDatabase } from "@praxis-vision/db/migrate";
import { describe, expect, it, vi } from "vitest";
import { createPrivateAuthHandler } from "../../src/server/auth/http";
import { initializePrivateOwner } from "../../src/server/auth/initialize";
import { requireOwner } from "../../src/server/auth/session";

const origin = "http://127.0.0.1:3001";
function setup() {
	const db = createDb({ DATABASE_URL: "file::memory:" });
	const auth = createAuth(
		{
			BETTER_AUTH_URL: origin,
			BETTER_AUTH_SECRET: "temporary-test-secret-at-least-32-characters",
		},
		db,
	);
	return { db, auth, handle: createPrivateAuthHandler(auth, db, origin) };
}
describe("workspace private authentication", () => {
	it("preserves auth throttling and hides internal failures", async () => {
		const { auth, handle } = setup();
		const spy = vi.spyOn(auth, "handler");
		for (const status of [429, 500]) {
			spy.mockResolvedValueOnce(
				Response.json(
					{ message: "private internal database details" },
					{ status, headers: { "Retry-After": "10" } },
				),
			);
			const result = await handle(
				new Request(`${origin}/api/auth/sign-in/email`, {
					method: "POST",
					headers: { origin },
				}),
			);
			expect(result.status).toBe(status === 500 ? 503 : 429);
			expect(await result.text()).not.toContain(
				"private internal database details",
			);
			if (status === 429) expect(result.headers.get("Retry-After")).toBe("10");
		}
	});

	it("validates real signed owner session, rejects wrong passwords and expiry, and initialization never resets credentials", async () => {
		const { db, auth, handle } = setup();
		await migrateDatabase(db);
		const first = await initializePrivateOwner(
			db,
			"owner@example.test",
			"temporary-test-password",
		);
		expect(
			(
				await initializePrivateOwner(
					db,
					"owner@example.test",
					"different-test-password",
				)
			).status,
		).toBe("unchanged");
		await expect(
			initializePrivateOwner(
				db,
				"other@example.test",
				"temporary-test-password",
			),
		).rejects.toThrow("OWNER_ALREADY_CONFIGURED");
		const signIn = (password: string) =>
			handle(
				new Request(`${origin}/api/auth/sign-in/email`, {
					method: "POST",
					headers: { origin, "Content-Type": "application/json" },
					body: JSON.stringify({ email: "owner@example.test", password }),
				}),
			);
		expect(
			(await signIn("different-test-password")).status,
		).toBeGreaterThanOrEqual(400);
		const response = await signIn("temporary-test-password");
		expect(response.status).toBe(200);
		const cookies = response.headers
			.getSetCookie()
			.map((cookie) => cookie.split(";")[0])
			.join("; ");
		const headers = new Headers({ cookie: cookies });
		expect((await requireOwner(auth, db, headers)).ownerId).toBe(first.userId);
		await db.$client.execute({
			sql: "INSERT INTO user (id,name,email,email_verified,created_at,updated_at) VALUES (?,?,?,?,?,?)",
			args: [
				"outsider",
				"Other",
				"other@example.test",
				1,
				Date.now(),
				Date.now(),
			],
		});
		await db.$client.execute({
			sql: "INSERT INTO account (id,account_id,provider_id,user_id,password,created_at,updated_at) SELECT ?,?,provider_id,?,password,created_at,updated_at FROM account WHERE user_id=?",
			args: ["other-account", "outsider", "outsider", first.userId],
		});
		const other = await handle(
			new Request(`${origin}/api/auth/sign-in/email`, {
				method: "POST",
				headers: { origin, "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "other@example.test",
					password: "temporary-test-password",
				}),
			}),
		);
		expect(other.status).toBe(401);
		await db.$client.execute({
			sql: "UPDATE session SET user_id=?",
			args: ["outsider"],
		});
		await expect(requireOwner(auth, db, headers)).rejects.toThrow(
			"Authentication required",
		);
		await db.$client.execute({
			sql: "UPDATE session SET user_id=?",
			args: [first.userId],
		});
		await db.$client.execute({
			sql: "UPDATE session SET expires_at = ? WHERE user_id = ?",
			args: [Date.now() - 1000, first.userId],
		});
		await expect(requireOwner(auth, db, headers)).rejects.toThrow(
			"Authentication required",
		);
	});
	it("fails closed without configured owner, rejects forged cookies and unplanned endpoints", async () => {
		const { db, auth, handle } = setup();
		await migrateDatabase(db);
		await expect(
			requireOwner(
				auth,
				db,
				new Headers({ cookie: "better-auth.session_token=forged" }),
			),
		).rejects.toThrow("Authentication required");
		const request = (
			path: string,
			method = "POST",
			requestOrigin: string | null = origin,
		) =>
			new Request(`${origin}/api/auth${path}`, {
				method,
				headers: requestOrigin
					? { origin: requestOrigin, "Content-Type": "application/json" }
					: {},
				body:
					method === "POST"
						? JSON.stringify({
								email: "test@example.test",
								password: "temporary-test-password",
							})
						: undefined,
			});
		expect((await handle(request("/sign-up/email"))).status).toBe(404);
		expect((await handle(request("/change-email"))).status).toBe(404);
		expect((await handle(request("/sign-in/email", "POST", null))).status).toBe(
			400,
		);
		expect(
			(await handle(request("/sign-in/email", "POST", "https://attacker.test")))
				.status,
		).toBe(400);
		expect((await handle(request("/get-session", "GET"))).status).toBe(401);
		expect(
			(await auth.handler(request("/sign-up/email"))).status,
		).toBeGreaterThanOrEqual(400);
	});
});

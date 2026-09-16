// @vitest-environment node
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const script = resolve("scripts/private-workspace.mjs");
it("workspace CLI runs repeatable migration on temporary SQLite and rejects remote URL/password arguments/non-TTY initialization", () => {
	const directory = mkdtempSync(resolve(tmpdir(), "praxis-workspace-cli-"));
	const url = `file:${resolve(directory, "test.sqlite")}`;
	try {
		for (let index = 0; index < 2; index++)
			expect(
				execFileSync(
					process.execPath,
					["--experimental-strip-types", script, "migrate", url],
					{ encoding: "utf8" },
				),
			).toContain("Migration completed.");
		for (const args of [
			["migrate", "https://remote.test/db"],
			["migrate", url, "password-must-not-be-argv"],
			["initialize-owner", url],
		]) {
			const result = spawnSync(
				process.execPath,
				["--experimental-strip-types", script, ...args],
				{ encoding: "utf8" },
			);
			expect(result.status).toBe(1);
			expect(result.stderr).not.toContain("password-must-not-be-argv");
		}
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
});

// @vitest-environment node
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createDb, withDatabaseWrite } from "@praxis-vision/db";
import { expect, it } from "vitest";

function signal() {
	let resolve!: () => void;
	const promise = new Promise<void>((done) => {
		resolve = done;
	});
	return { promise, resolve };
}

it("serializes independent clients with equivalent file paths and releases after failure", async () => {
	const dir = await mkdtemp(join(tmpdir(), "praxis-queue-"));
	const path = join(dir, "test.sqlite");
	const a = createDb({ DATABASE_URL: `file:${path}` });
	const b = createDb({ DATABASE_URL: pathToFileURL(path).href });
	try {
		const entered = signal();
		const release = signal();
		const failure = new Error("transaction failed");
		const first = withDatabaseWrite(a, async () => {
			entered.resolve();
			await release.promise;
			throw failure;
		});
		const rejection = expect(first).rejects.toBe(failure);
		let secondEntered = false;
		const second = withDatabaseWrite(b, async () => {
			secondEntered = true;
			return "next";
		});
		await entered.promise;
		await Promise.resolve();
		expect(secondEntered).toBe(false);
		release.resolve();
		await rejection;
		expect(await second).toBe("next");
		expect(await withDatabaseWrite(a, async () => "again")).toBe("again");
	} finally {
		a.$client.close();
		b.$client.close();
		await rm(dir, { recursive: true, force: true });
	}
});

it.each(["file", "memory"] as const)(
	"allows distinct %s databases to progress independently",
	async (kind) => {
		const dir = await mkdtemp(join(tmpdir(), "praxis-queue-"));
		const a = createDb({
			DATABASE_URL:
				kind === "memory" ? ":memory:" : `file:${join(dir, "a.sqlite")}`,
		});
		const b = createDb({
			DATABASE_URL:
				kind === "memory" ? "file::memory:" : `file:${join(dir, "b.sqlite")}`,
		});
		try {
			const enteredA = signal();
			const enteredB = signal();
			const release = signal();
			const first = withDatabaseWrite(a, async () => {
				enteredA.resolve();
				await release.promise;
			});
			const second = withDatabaseWrite(b, async () => {
				enteredB.resolve();
				await release.promise;
			});
			await Promise.all([enteredA.promise, enteredB.promise]);
			release.resolve();
			await Promise.all([first, second]);
		} finally {
			a.$client.close();
			b.$client.close();
			await rm(dir, { recursive: true, force: true });
		}
	},
);

import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, resolve, sep } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
// Node 24 strips TS; resolve only this repository's relative source imports.
registerHooks({
	resolve(specifier, context, nextResolve) {
		try {
			return nextResolve(specifier, context);
		} catch (error) {
			if (!specifier.startsWith(".") || !context.parentURL?.startsWith("file:"))
				throw error;
			const parent = fileURLToPath(context.parentURL);
			const allowed = ["packages/db/src", "apps/web/src/server/auth"].some(
				(dir) => parent.startsWith(resolve(repository, dir) + sep),
			);
			if (!allowed) throw error;
			const base = resolve(dirname(parent), specifier);
			if (!base.startsWith(repository + sep)) throw error;
			const candidate = [`${base}.ts`, resolve(base, "index.ts")].find(
				existsSync,
			);
			if (!candidate) throw error;
			return nextResolve(pathToFileURL(candidate).href, context);
		}
	},
});

export function localDatabaseUrl(value) {
	if (
		!value?.startsWith("file:") ||
		value.startsWith("file://") ||
		value.includes("?") ||
		value.includes("#") ||
		value.includes(":memory:")
	)
		throw new Error("Use an explicit local file database URL");
	const file = value.slice(5);
	if (!file || file.includes("\0"))
		throw new Error("Use an explicit local file database URL");
	return pathToFileURL(resolve(file)).href;
}

async function hiddenPassword() {
	if (!process.stdin.isTTY || !process.stdout.isTTY)
		throw new Error("Owner initialization requires an interactive terminal");
	process.stdin.setRawMode(true);
	const cancelSignal = () => {
		process.stdin.setRawMode(false);
		process.exit(130);
	};
	process.once("SIGINT", cancelSignal);
	process.once("SIGTERM", cancelSignal);
	return new Promise((resolvePassword, reject) => {
		let password = "";
		const restore = () => {
			process.off("SIGINT", cancelSignal);
			process.off("SIGTERM", cancelSignal);
			process.stdin.setRawMode(false);
			process.stdin.pause();
			process.stdin.off("data", onData);
			process.stdout.write("\n");
		};
		const onData = (chunk) => {
			for (const char of chunk.toString()) {
				if (char === "\u0003" || char === "\u0004") {
					restore();
					reject(new Error("Initialization canceled"));
					return;
				}
				if (char === "\r" || char === "\n") {
					restore();
					resolvePassword(password);
					return;
				}
				if (char === "\u007f" || char === "\b") {
					password = password.slice(0, -1);
					continue;
				}
				if (char >= " " && password.length < 129) password += char;
			}
		};
		process.stdin.on("data", onData);
		process.stdin.resume();
		process.stdout.write("Password (12–128 characters, hidden): ");
	});
}

async function main() {
	const [command, url, ...extra] = process.argv.slice(2);
	if (!["migrate", "initialize-owner"].includes(command) || extra.length)
		throw new Error(
			"Usage: private-workspace.mjs migrate|initialize-owner file:/absolute/database.sqlite",
		);
	const { createDb } = await import("@praxis-vision/db");
	const { migrateDatabase } = await import("@praxis-vision/db/migrate");
	const db = createDb({ DATABASE_URL: localDatabaseUrl(url) });
	try {
		if (command === "migrate") {
			await migrateDatabase(db);
			console.log("Migration completed.");
			return;
		}
		if (!process.stdin.isTTY || !process.stdout.isTTY)
			throw new Error("Owner initialization requires an interactive terminal");
		const terminal = createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		let email;
		try {
			email = await terminal.question("Owner email: ");
		} finally {
			terminal.close();
		}
		const password = await hiddenPassword();
		const { initializePrivateOwner } = await import(
			"../src/server/auth/initialize.ts"
		);
		await migrateDatabase(db);
		const result = await initializePrivateOwner(db, email, password);
		console.log(
			result.status === "created"
				? "Owner initialized."
				: "Owner already initialized; credentials unchanged.",
		);
	} finally {
		db.$client.close();
	}
}
if (
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	main().catch(() => {
		if (process.stdin.isTTY) process.stdin.setRawMode(false);
		console.error(
			"Operation failed. Check local configuration and account initialization constraints.",
		);
		process.exitCode = 1;
	});
}

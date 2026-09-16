import { realpathSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import type { DatabaseConfig } from "./config";
import * as schema from "./schema";

type WriteIdentity = string | symbol;
const writeIdentities = new WeakMap<object, WriteIdentity>();
const writeTails = new Map<WriteIdentity, Promise<void>>();

function canonicalPath(path: string): string {
	const absolute = resolve(path);
	try {
		return realpathSync(absolute);
	} catch (error) {
		if (
			!(error instanceof Error) ||
			!("code" in error) ||
			error.code !== "ENOENT"
		)
			throw error;
		const parent = dirname(absolute);
		if (parent === absolute) throw error;
		const realParent = canonicalPath(parent);
		const suffix = absolute.slice(parent.length);
		// These are runtime database identities, not files to load into the bundle.
		return realParent.endsWith(sep) && suffix.startsWith(sep)
			? realParent + suffix.slice(1)
			: realParent + suffix;
	}
}

function writeIdentity(url: string): WriteIdentity {
	if (url === ":memory:") return Symbol("memory database");
	if (!url.startsWith("file:")) return url;
	// Match the same decoded URI path used by libsql, including relative file URLs.
	const path = decodeURIComponent(
		url
			.slice(5)
			.replace(/^\/\/[^/]*/, "")
			.split(/[?#]/, 1)[0] ?? "",
	);
	if (path === ":memory:") return Symbol("memory database");
	return `file:${canonicalPath(path)}`;
}

export function createDb(env: DatabaseConfig) {
	const identity = writeIdentity(env.DATABASE_URL);
	const client = createClient({
		url: env.DATABASE_URL,
	});

	const db = drizzle({ client, schema });
	writeIdentities.set(db, identity);
	return db;
}

export type Database = ReturnType<typeof createDb>;

/** Serialize whole write transactions across local clients for the same file.
 * SQLite still arbitrates other processes; errors, including commit errors,
 * propagate unchanged and are never blindly retried by this queue.
 */
export async function withDatabaseWrite<T>(
	db: Database,
	operation: () => Promise<T>,
): Promise<T> {
	const identity = writeIdentities.get(db);
	if (identity === undefined)
		throw new Error("Database was not created by createDb");
	const previous = writeTails.get(identity) ?? Promise.resolve();
	const result = previous.then(operation);
	const tail = result.then(
		() => undefined,
		() => undefined,
	);
	writeTails.set(identity, tail);
	try {
		return await result;
	} finally {
		if (writeTails.get(identity) === tail) writeTails.delete(identity);
	}
}

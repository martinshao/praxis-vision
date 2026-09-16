import { createAuth as createConfiguredAuth } from "@praxis-vision/auth";
import { createDb, type Database } from "@praxis-vision/db";

import { env } from "./env.server";

const db = createDb(env);

export function getDb(): Database {
	return db;
}
export const auth = createConfiguredAuth(env, db);

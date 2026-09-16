import { env } from "@/env.server";
import { auth, getDb } from "@/services";
import { requireOwner } from "../auth/session";
import { createPromptHandler } from "./http";
import { createPromptService } from "./service";

const db = getDb();
export const promptHandler = createPromptHandler({
	origin: env.BETTER_AUTH_URL,
	requireOwner: (headers) => requireOwner(auth, db, headers),
	service: createPromptService(db),
});

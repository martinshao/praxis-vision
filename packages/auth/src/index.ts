import type { Database } from "@praxis-vision/db";
import * as schema from "@praxis-vision/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";

export type AuthConfig = {
	BETTER_AUTH_URL: string;
	BETTER_AUTH_SECRET: string;
};

export function createAuth(env: AuthConfig, database: Database) {
	return betterAuth({
		database: drizzleAdapter(database, {
			provider: "sqlite",
			schema,
		}),
		trustedOrigins: [env.BETTER_AUTH_URL],
		emailAndPassword: { enabled: true, disableSignUp: true },
		session: { cookieCache: { enabled: false } },
		databaseHooks: {
			session: {
				create: {
					before: async (session) => {
						const allowed = await database.query.owner.findFirst();
						if (!allowed || allowed.userId !== session.userId) {
							throw new APIError("UNAUTHORIZED", {
								message: "Authentication required",
							});
						}
						return { data: session };
					},
				},
			},
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		plugins: [nextCookies()],
	});
}

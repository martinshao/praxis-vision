import type { createAuth } from "@praxis-vision/auth";
import type { Database } from "@praxis-vision/db";

export class UnauthenticatedError extends Error {
	readonly code = "UNAUTHENTICATED";
	constructor() {
		super("Authentication required");
	}
}

/** Derives ownership exclusively from a verified server session and singleton. */
export async function requireOwner(
	auth: ReturnType<typeof createAuth>,
	database: Database,
	headers: Headers,
) {
	try {
		const session = await auth.api.getSession({
			headers,
			query: { disableCookieCache: true },
		});
		const allowed = await database.query.owner.findFirst();
		if (
			!session ||
			session.session.expiresAt.getTime() <= Date.now() ||
			!allowed ||
			session.user.id !== allowed.userId
		) {
			throw new UnauthenticatedError();
		}
		return { ownerId: allowed.userId, session };
	} catch {
		throw new UnauthenticatedError();
	}
}

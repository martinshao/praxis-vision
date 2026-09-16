import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Database } from "./index";
import { account, owner, user } from "./schema";

export class OwnerInitializationError extends Error {
	readonly code: "OWNER_ALREADY_CONFIGURED" | "EXISTING_USERS";
	constructor(code: "OWNER_ALREADY_CONFIGURED" | "EXISTING_USERS") {
		super(code);
		this.code = code;
		this.name = "OwnerInitializationError";
	}
}

export async function initializeOwner(
	db: Database,
	input: { email: string; name: string; passwordHash: string },
): Promise<{ status: "created" | "unchanged"; userId: string }> {
	return db.transaction(async (tx) => {
		const existing = await tx
			.select({ userId: owner.userId, email: user.email })
			.from(owner)
			.innerJoin(user, eq(owner.userId, user.id))
			.limit(1);
		if (existing[0]) {
			if (existing[0].email !== input.email)
				throw new OwnerInitializationError("OWNER_ALREADY_CONFIGURED");
			return { status: "unchanged", userId: existing[0].userId };
		}
		if ((await tx.select({ id: user.id }).from(user).limit(1)).length > 0) {
			throw new OwnerInitializationError("EXISTING_USERS");
		}
		const userId = randomUUID();
		const now = new Date();
		await tx.insert(user).values({
			id: userId,
			name: input.name,
			email: input.email,
			emailVerified: true,
			createdAt: now,
			updatedAt: now,
		});
		await tx.insert(account).values({
			id: randomUUID(),
			accountId: userId,
			providerId: "credential",
			userId,
			password: input.passwordHash,
			createdAt: now,
			updatedAt: now,
		});
		await tx.insert(owner).values({ userId, createdAt: now });
		return { status: "created", userId };
	});
}

import type { Database } from "@praxis-vision/db";
import { initializeOwner } from "@praxis-vision/db/initialize-owner";
import { hashPassword } from "better-auth/crypto";

export function validateOwnerInput(email: string, password: string) {
	const normalized = email.trim().toLowerCase();
	if (
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ||
		normalized.length > 254 ||
		password.length < 12 ||
		password.length > 128
	)
		throw new Error("Invalid owner credentials");
	return normalized;
}
export async function initializePrivateOwner(
	db: Database,
	email: string,
	password: string,
) {
	return initializeOwner(db, {
		email: validateOwnerInput(email, password),
		name: "Owner",
		passwordHash: await hashPassword(password),
	});
}

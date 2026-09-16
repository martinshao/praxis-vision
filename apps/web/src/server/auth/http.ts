import type { createAuth } from "@praxis-vision/auth";
import type { Database } from "@praxis-vision/db";
import { requireOwner, UnauthenticatedError } from "./session";

const endpoints = new Map([
	["GET", new Set(["/get-session"])],
	["POST", new Set(["/sign-in/email", "/sign-out"])],
]);
function failure(status: number, code: string, requestId: string) {
	return Response.json(
		{
			error: {
				code,
				message:
					status === 404 ? "Resource not found" : "Authentication required",
			},
			requestId,
		},
		{ status, headers: { "Cache-Control": "no-store" } },
	);
}

export function createPrivateAuthHandler(
	auth: ReturnType<typeof createAuth>,
	database: Database,
	origin: string,
) {
	return async (request: Request): Promise<Response> => {
		const requestId = crypto.randomUUID();
		const path = new URL(request.url).pathname.slice("/api/auth".length);
		if (!endpoints.get(request.method)?.has(path))
			return failure(404, "RESOURCE_NOT_FOUND", requestId);
		if (
			request.method === "POST" &&
			request.headers.get("origin") !== new URL(origin).origin
		)
			return failure(400, "VALIDATION_ERROR", requestId);
		try {
			if (path !== "/sign-in/email")
				await requireOwner(auth, database, request.headers);
			const response = await auth.handler(request);
			if (!response.ok) {
				const status =
					response.status >= 500
						? 503
						: response.status === 429
							? 429
							: response.status === 401 || response.status === 403
								? 401
								: 400;
				const code =
					status === 503
						? "PROVIDER_UNAVAILABLE"
						: status === 401
							? "UNAUTHENTICATED"
							: "VALIDATION_ERROR";
				const rejected = failure(status, code, requestId);
				const retryAfter = response.headers.get("Retry-After");
				if (status === 429 && retryAfter)
					rejected.headers.set("Retry-After", retryAfter);
				return rejected;
			}
			response.headers.set("Cache-Control", "no-store");
			response.headers.set("X-Request-Id", requestId);
			return response;
		} catch (error) {
			if (error instanceof UnauthenticatedError)
				return failure(401, "UNAUTHENTICATED", requestId);
			return failure(503, "PROVIDER_UNAVAILABLE", requestId);
		}
	};
}

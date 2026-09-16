import { ZodError } from "zod";
import { UnauthenticatedError } from "../auth/session";
import { PromptError } from "./service";
export type PromptOperation =
	| "list"
	| "archive"
	| "restore"
	| "create"
	| "detail"
	| "versions"
	| "metadata"
	| "appendVersion"
	| "addSource";
export function createPromptHandler(deps: {
	origin: string;
	requireOwner: (headers: Headers) => Promise<{ ownerId: string }>;
	service: {
		list(ownerId: string, input: unknown): Promise<unknown>;
		archive(ownerId: string, id: string, input: unknown): Promise<unknown>;
		restore(ownerId: string, id: string, input: unknown): Promise<unknown>;
		create(ownerId: string, input: unknown): Promise<unknown>;
		detail(ownerId: string, id: string, versionId?: string): Promise<unknown>;
		versions(ownerId: string, id: string, input: unknown): Promise<unknown>;
		metadata(ownerId: string, id: string, input: unknown): Promise<unknown>;
		appendVersion(
			ownerId: string,
			id: string,
			input: unknown,
		): Promise<unknown>;
		addSource(ownerId: string, id: string, input: unknown): Promise<unknown>;
	};
}) {
	return async (request: Request, operation: PromptOperation, id?: string) => {
		const requestId = crypto.randomUUID();
		function response(data: unknown, status = 200) {
			return Response.json(data, {
				status,
				headers: { "Cache-Control": "no-store", "X-Request-Id": requestId },
			});
		}
		function failure(
			code: string,
			message: string,
			status: number,
			extras: Record<string, unknown> = {},
		) {
			return response(
				{ error: { code, message, ...extras }, requestId },
				status,
			);
		}
		try {
			const { ownerId } = await deps.requireOwner(request.headers);
			const writing = !["list", "detail", "versions"].includes(operation);
			if (
				writing &&
				(request.headers.get("origin") !== new URL(deps.origin).origin ||
					request.headers.get("sec-fetch-site") === "cross-site")
			)
				return failure("VALIDATION_ERROR", "Invalid request origin", 400);
			const url = new URL(request.url);
			let data: unknown;
			if (
				[...url.searchParams.keys()].some(
					(key) =>
						url.searchParams.getAll(key).length !== 1 &&
						!(operation === "list" && key === "tags"),
				)
			)
				return failure("VALIDATION_ERROR", "Repeated query field", 400);
			if (operation === "list")
				data = await deps.service.list(ownerId, {
					...Object.fromEntries(url.searchParams),
					...(url.searchParams.has("tags")
						? { tags: url.searchParams.getAll("tags") }
						: {}),
				});
			else if (operation === "detail") {
				if ([...url.searchParams.keys()].some((key) => key !== "versionId"))
					return failure("VALIDATION_ERROR", "Invalid query", 400);
				const versionId = url.searchParams.get("versionId") ?? undefined;
				if (versionId && !/^[0-9a-f-]{36}$/i.test(versionId))
					return failure("VALIDATION_ERROR", "Invalid version", 400);
				data = await deps.service.detail(ownerId, id ?? "", versionId);
			} else if (operation === "versions")
				data = await deps.service.versions(
					ownerId,
					id ?? "",
					Object.fromEntries(url.searchParams),
				);
			else {
				if (
					request.headers
						.get("content-type")
						?.split(";")[0]
						?.trim()
						.toLowerCase() !== "application/json"
				)
					return failure("VALIDATION_ERROR", "JSON body required", 400);
				// Bound bytes before parsing; the body is never logged or forwarded.
				const reader = request.body?.getReader();
				if (!reader)
					return failure("VALIDATION_ERROR", "JSON body required", 400);
				const chunks: Uint8Array[] = [];
				let size = 0;
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					size += value.byteLength;
					if (size > 262144) {
						await reader.cancel();
						return failure("VALIDATION_ERROR", "Request too large", 400);
					}
					chunks.push(value);
				}
				let input: unknown;
				try {
					input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
				} catch {
					return failure("VALIDATION_ERROR", "Invalid JSON", 400);
				}
				data =
					operation === "create"
						? await deps.service.create(ownerId, input)
						: await deps.service[operation](ownerId, id ?? "", input);
			}
			return response(
				{ data, requestId },
				operation === "create" ||
					operation === "appendVersion" ||
					operation === "addSource"
					? 201
					: 200,
			);
		} catch (error) {
			if (error instanceof UnauthenticatedError)
				return failure("UNAUTHENTICATED", "Authentication required", 401);
			if (error instanceof ZodError)
				return failure("VALIDATION_ERROR", "Invalid input", 400, {
					fieldErrors: error.flatten().fieldErrors,
				});
			if (error instanceof PromptError)
				return failure(
					error.code,
					error.code === "RESOURCE_NOT_FOUND"
						? "Resource not found"
						: error.code === "DUPLICATE_PROMPT"
							? "Duplicate prompt; explicitly save separately or append a source"
							: error.code === "CAPABILITY_UNSUPPORTED"
								? "Trial filtering requires trial persistence"
								: "Version conflict",
					error.code === "RESOURCE_NOT_FOUND"
						? 404
						: error.code === "CAPABILITY_UNSUPPORTED"
							? 422
							: 409,
					{
						...(error.currentVersion
							? { currentVersion: error.currentVersion }
							: {}),
						...(error.duplicatePrompts
							? {
									duplicateIds: error.duplicatePrompts.map((p) => p.id),
									duplicatePrompts: error.duplicatePrompts,
								}
							: {}),
					},
				);
			return failure("PROVIDER_UNAVAILABLE", "Service unavailable", 503);
		}
	};
}

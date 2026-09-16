import { createHash, randomUUID } from "node:crypto";
import { type Database, withDatabaseWrite } from "@praxis-vision/db";
import {
	and,
	desc,
	eq,
	isNotNull,
	isNull,
	lt,
	or,
	sql,
} from "@praxis-vision/db/query";
import { prompt, promptSource, promptVersion } from "@praxis-vision/db/schema";
import {
	archiveWriteSchema,
	type Content,
	createSchema,
	listSchema,
	metadataWriteSchema,
	pageSchema,
	sourceWriteSchema,
	versionWriteSchema,
} from "./validation";

export class PromptError extends Error {
	constructor(
		readonly code:
			| "RESOURCE_NOT_FOUND"
			| "VERSION_CONFLICT"
			| "DUPLICATE_PROMPT"
			| "CAPABILITY_UNSUPPORTED",
		readonly currentVersion?: {
			expectedVersion: number;
			currentVersionId: string;
		},
		readonly duplicatePrompts?: { id: string; archivedAt: Date | null }[],
	) {
		super(code);
	}
}
export function textHash(text: string) {
	return createHash("sha256")
		.update(text.replace(/\r\n?/g, "\n").trim())
		.digest("hex");
}
const versionMetadata = {
	id: promptVersion.id,
	number: promptVersion.number,
	parentVersionId: promptVersion.parentVersionId,
	declaredProvider: promptVersion.declaredProvider,
	declaredModel: promptVersion.declaredModel,
	changeNote: promptVersion.changeNote,
	textHash: promptVersion.textHash,
	createdAt: promptVersion.createdAt,
};
function versionValues(content: Content) {
	return {
		...content,
		negativeText: content.negativeText ?? null,
		declaredProvider: content.declaredProvider ?? null,
		declaredModel: content.declaredModel ?? null,
		declaredParameters: content.declaredParameters ?? {},
		referenceNotes: content.referenceNotes ?? null,
		textHash: textHash(content.text),
	};
}
export function createPromptService(db: Database) {
	async function owned(ownerId: string, id: string) {
		const [item] = await db
			.select()
			.from(prompt)
			.where(and(eq(prompt.id, id), eq(prompt.ownerId, ownerId)))
			.limit(1);
		if (!item) throw new PromptError("RESOURCE_NOT_FOUND");
		return item;
	}
	async function mutate<T>(
		ownerId: string,
		id: string,
		expectedVersion: number,
		run: (
			tx: Parameters<Parameters<Database["transaction"]>[0]>[0],
			item: typeof prompt.$inferSelect,
		) => Promise<T>,
		allowArchived = false,
	) {
		const transaction = () =>
			db.transaction(async (tx) => {
				const [item] = await tx
					.select()
					.from(prompt)
					.where(and(eq(prompt.id, id), eq(prompt.ownerId, ownerId)))
					.limit(1);
				if (!item) throw new PromptError("RESOURCE_NOT_FOUND");
				if (item.archivedAt && !allowArchived)
					throw new PromptError("RESOURCE_NOT_FOUND");
				if (item.expectedVersion !== expectedVersion)
					throw new PromptError("VERSION_CONFLICT", {
						expectedVersion: item.expectedVersion,
						currentVersionId: item.currentVersionId,
					});
				const rows = await tx
					.update(prompt)
					.set({ expectedVersion: expectedVersion + 1, updatedAt: new Date() })
					.where(
						and(
							eq(prompt.id, id),
							eq(prompt.ownerId, ownerId),
							eq(prompt.expectedVersion, expectedVersion),
						),
					)
					.returning({ id: prompt.id });
				if (!rows.length)
					throw new PromptError("VERSION_CONFLICT", {
						expectedVersion: item.expectedVersion,
						currentVersionId: item.currentVersionId,
					});
				return run(tx, item);
			});
		return withDatabaseWrite(db, transaction);
	}
	return {
		async create(ownerId: string, input: unknown) {
			const parsed = createSchema.parse(input);
			const {
				metadata = {},
				sources = [],
				allowDuplicate = false,
				...content
			} = parsed;
			const id = randomUUID();
			const versionId = randomUUID();
			const now = new Date();
			const transaction = () =>
				db.transaction(async (tx) => {
					if (!allowDuplicate) {
						const duplicates = await tx
							.selectDistinct({ id: prompt.id, archivedAt: prompt.archivedAt })
							.from(promptVersion)
							.innerJoin(
								prompt,
								and(
									eq(prompt.id, promptVersion.promptId),
									eq(prompt.ownerId, promptVersion.ownerId),
								),
							)
							.where(
								and(
									eq(promptVersion.ownerId, ownerId),
									eq(promptVersion.textHash, textHash(content.text)),
								),
							)
							.orderBy(desc(prompt.createdAt), desc(prompt.id))
							.limit(24);
						if (duplicates.length)
							throw new PromptError("DUPLICATE_PROMPT", undefined, duplicates);
					}
					const [item] = await tx
						.insert(prompt)
						.values({
							id,
							ownerId,
							title:
								metadata.title ??
								content.text.trim().split(/\r?\n/)[0]?.slice(0, 80) ??
								"Prompt",
							topic: metadata.topic ?? "other",
							tags: metadata.tags ?? [],
							notes: metadata.notes ?? "",
							readiness: metadata.readiness ?? "inbox",
							favorite: metadata.favorite ?? false,
							currentVersionId: versionId,
							expectedVersion: 1,
							createdAt: now,
							updatedAt: now,
						})
						.returning();
					const [version] = await tx
						.insert(promptVersion)
						.values({
							id: versionId,
							promptId: id,
							ownerId,
							number: 1,
							parentVersionId: null,
							...versionValues(content),
							createdAt: now,
						})
						.returning();
					const savedSources = sources.length
						? await tx
								.insert(promptSource)
								.values(
									sources.map((source) => ({
										...source,
										id: randomUUID(),
										promptId: id,
										ownerId,
										sourceWorkId: null,
										availability: source.availability ?? "unknown",
										createdAt: now,
									})),
								)
								.returning()
						: [];
					return { prompt: item, version, sources: savedSources };
				});
			return withDatabaseWrite(db, transaction);
		},
		async list(ownerId: string, input: unknown) {
			const filters = listSchema.parse(input);
			// No Trial persistence exists before TASK-003: reject tried filtering
			// rather than representing an invented trial record as actual evidence.
			if (filters.trialState && filters.trialState !== "untried")
				throw new PromptError("CAPABILITY_UNSUPPORTED");
			const needle = `%${(filters.query ?? "").replace(/[\\%_]/g, "\\$&")}%`;
			const [timestamp, cursorId] = filters.cursor?.split(":") ?? [];
			const rows = await db
				.select({
					id: prompt.id,
					title: prompt.title,
					topic: prompt.topic,
					tags: prompt.tags,
					notes: prompt.notes,
					readiness: prompt.readiness,
					favorite: prompt.favorite,
					currentVersionId: prompt.currentVersionId,
					expectedVersion: prompt.expectedVersion,
					archivedAt: prompt.archivedAt,
					createdAt: prompt.createdAt,
					updatedAt: prompt.updatedAt,
					versionNumber: promptVersion.number,
					declaredProvider: promptVersion.declaredProvider,
					declaredModel: promptVersion.declaredModel,
					summary: sql<string>`substr(${promptVersion.text}, 1, 180)`,
				})
				.from(prompt)
				.innerJoin(
					promptVersion,
					and(
						eq(promptVersion.id, prompt.currentVersionId),
						eq(promptVersion.ownerId, prompt.ownerId),
						eq(promptVersion.promptId, prompt.id),
					),
				)
				.where(
					and(
						eq(prompt.ownerId, ownerId),
						filters.archived
							? isNotNull(prompt.archivedAt)
							: isNull(prompt.archivedAt),
						filters.topic ? eq(prompt.topic, filters.topic) : undefined,
						filters.favorite !== undefined
							? eq(prompt.favorite, filters.favorite)
							: undefined,
						filters.model
							? eq(promptVersion.declaredModel, filters.model)
							: undefined,
						filters.platform
							? sql`EXISTS (SELECT 1 FROM ${promptSource} WHERE ${promptSource.promptId} = ${prompt.id} AND ${promptSource.ownerId} = ${ownerId} AND ${promptSource.platform} = ${filters.platform})`
							: undefined,
						...(filters.tags ?? []).map(
							(tag) =>
								sql`EXISTS (SELECT 1 FROM json_each(${prompt.tags}) WHERE value = ${tag})`,
						),
						filters.query
							? sql`(${prompt.title} LIKE ${needle} ESCAPE '\\' OR ${prompt.notes} LIKE ${needle} ESCAPE '\\' OR ${promptVersion.text} LIKE ${needle} ESCAPE '\\')`
							: undefined,
						timestamp && cursorId
							? or(
									lt(prompt.createdAt, new Date(Number(timestamp))),
									and(
										eq(prompt.createdAt, new Date(Number(timestamp))),
										lt(prompt.id, cursorId),
									),
								)
							: undefined,
					),
				)
				.orderBy(desc(prompt.createdAt), desc(prompt.id))
				.limit(filters.limit + 1);
			const items = rows.slice(0, filters.limit);
			const last = items.at(-1);
			return {
				items,
				nextCursor:
					rows.length > filters.limit && last
						? `${last.createdAt.getTime()}:${last.id}`
						: null,
			};
		},
		async archive(ownerId: string, id: string, input: unknown) {
			const { expectedVersion } = archiveWriteSchema.parse(input);
			return mutate(
				ownerId,
				id,
				expectedVersion,
				async (tx, item) => {
					const [updated] = await tx
						.update(prompt)
						.set({ archivedAt: item.archivedAt ?? new Date() })
						.where(and(eq(prompt.id, id), eq(prompt.ownerId, ownerId)))
						.returning();
					return updated;
				},
				true,
			);
		},
		async restore(ownerId: string, id: string, input: unknown) {
			const { expectedVersion } = archiveWriteSchema.parse(input);
			return mutate(
				ownerId,
				id,
				expectedVersion,
				async (tx) => {
					const [updated] = await tx
						.update(prompt)
						.set({ archivedAt: null })
						.where(and(eq(prompt.id, id), eq(prompt.ownerId, ownerId)))
						.returning();
					return updated;
				},
				true,
			);
		},
		async detail(ownerId: string, id: string, versionId?: string) {
			const item = await owned(ownerId, id);
			const [version] = await db
				.select()
				.from(promptVersion)
				.where(
					and(
						eq(promptVersion.id, versionId ?? item.currentVersionId),
						eq(promptVersion.promptId, id),
						eq(promptVersion.ownerId, ownerId),
					),
				)
				.limit(1);
			if (!version) throw new PromptError("RESOURCE_NOT_FOUND");
			const versions = await db
				.select(versionMetadata)
				.from(promptVersion)
				.where(
					and(
						eq(promptVersion.promptId, id),
						eq(promptVersion.ownerId, ownerId),
					),
				)
				.orderBy(desc(promptVersion.number))
				.limit(25);
			const sources = await db
				.select()
				.from(promptSource)
				.where(
					and(eq(promptSource.promptId, id), eq(promptSource.ownerId, ownerId)),
				)
				.orderBy(desc(promptSource.createdAt), desc(promptSource.id))
				.limit(24);
			return {
				prompt: item,
				version,
				versions: {
					items: versions.slice(0, 24),
					nextCursor: versions.length > 24 ? versions[23]?.number : null,
				},
				sources,
			};
		},
		async versions(ownerId: string, id: string, input: unknown) {
			await owned(ownerId, id);
			const { cursor, limit } = pageSchema.parse(input);
			const rows = await db
				.select(versionMetadata)
				.from(promptVersion)
				.where(
					and(
						eq(promptVersion.promptId, id),
						eq(promptVersion.ownerId, ownerId),
						cursor ? lt(promptVersion.number, cursor) : undefined,
					),
				)
				.orderBy(desc(promptVersion.number))
				.limit(limit + 1);
			return {
				items: rows.slice(0, limit),
				nextCursor: rows.length > limit ? rows[limit - 1]?.number : null,
			};
		},
		async metadata(ownerId: string, id: string, input: unknown) {
			const { metadata, expectedVersion } = metadataWriteSchema.parse(input);
			return mutate(ownerId, id, expectedVersion, async (tx) => {
				const [item] = await tx
					.update(prompt)
					.set(metadata)
					.where(and(eq(prompt.id, id), eq(prompt.ownerId, ownerId)))
					.returning();
				return item;
			});
		},
		async appendVersion(ownerId: string, id: string, input: unknown) {
			const { fullContent, expectedVersion, changeNote } =
				versionWriteSchema.parse(input);
			return mutate(ownerId, id, expectedVersion, async (tx, item) => {
				const [parent] = await tx
					.select()
					.from(promptVersion)
					.where(
						and(
							eq(promptVersion.id, item.currentVersionId),
							eq(promptVersion.promptId, id),
							eq(promptVersion.ownerId, ownerId),
						),
					)
					.limit(1);
				if (!parent) throw new PromptError("RESOURCE_NOT_FOUND");
				const [version] = await tx
					.insert(promptVersion)
					.values({
						id: randomUUID(),
						promptId: id,
						ownerId,
						number: parent.number + 1,
						parentVersionId: parent.id,
						...versionValues(fullContent),
						changeNote: changeNote ?? null,
						createdAt: new Date(),
					})
					.returning();
				if (!version) throw new Error("Version insert failed");
				const [updated] = await tx
					.update(prompt)
					.set({ currentVersionId: version.id })
					.where(and(eq(prompt.id, id), eq(prompt.ownerId, ownerId)))
					.returning();
				return { prompt: updated, version };
			});
		},
		async addSource(ownerId: string, id: string, input: unknown) {
			const { source, expectedVersion } = sourceWriteSchema.parse(input);
			return mutate(ownerId, id, expectedVersion, async (tx) => {
				const [saved] = await tx
					.insert(promptSource)
					.values({
						...source,
						id: randomUUID(),
						promptId: id,
						ownerId,
						sourceWorkId: null,
						availability: source.availability ?? "unknown",
						createdAt: new Date(),
					})
					.returning();
				return { source: saved, expectedVersion: expectedVersion + 1 };
			});
		},
	};
}

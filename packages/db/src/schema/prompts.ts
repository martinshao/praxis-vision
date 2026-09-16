import { sql } from "drizzle-orm";
import {
	check,
	foreignKey,
	index,
	integer,
	type SQLiteTableExtraConfigValue,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { owner } from "./owner";

const now = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;
export const prompt = sqliteTable(
	"prompt",
	{
		id: text("id").primaryKey(),
		ownerId: text("owner_id")
			.notNull()
			.references(() => owner.userId, { onDelete: "restrict" }),
		title: text("title").notNull().default(""),
		topic: text("topic", {
			enum: ["portrait", "landscape", "illustration", "other"],
		})
			.notNull()
			.default("other"),
		tags: text("tags", { mode: "json" })
			.$type<string[]>()
			.notNull()
			.default(sql`'[]'`),
		notes: text("notes").notNull().default(""),
		readiness: text("readiness", { enum: ["inbox", "ready"] })
			.notNull()
			.default("inbox"),
		favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
		currentVersionId: text("current_version_id").notNull(),
		expectedVersion: integer("expected_version").notNull().default(1),
		archivedAt: integer("archived_at", { mode: "timestamp_ms" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(now),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(now),
	},
	(t): SQLiteTableExtraConfigValue[] => [
		uniqueIndex("prompt_id_owner_uidx").on(t.id, t.ownerId),
		index("prompt_owner_archive_topic_created_idx").on(
			t.ownerId,
			t.archivedAt,
			t.topic,
			t.createdAt,
		),
		foreignKey({
			columns: [t.currentVersionId, t.id, t.ownerId],
			foreignColumns: [
				promptVersion.id,
				promptVersion.promptId,
				promptVersion.ownerId,
			],
		}),
		check(
			"prompt_topic_check",
			sql`${t.topic} IN ('portrait','landscape','illustration','other')`,
		),
		check("prompt_readiness_check", sql`${t.readiness} IN ('inbox','ready')`),
		check("prompt_expected_version_check", sql`${t.expectedVersion} >= 1`),
	],
);

export const promptVersion = sqliteTable(
	"prompt_version",
	{
		id: text("id").primaryKey(),
		promptId: text("prompt_id").notNull(),
		ownerId: text("owner_id")
			.notNull()
			.references(() => owner.userId, { onDelete: "restrict" }),
		number: integer("number").notNull(),
		parentVersionId: text("parent_version_id"),
		text: text("text").notNull(),
		negativeText: text("negative_text"),
		declaredProvider: text("declared_provider"),
		declaredModel: text("declared_model"),
		declaredParameters: text("declared_parameters", { mode: "json" })
			.$type<Record<string, unknown>>()
			.notNull()
			.default(sql`'{}'`),
		referenceNotes: text("reference_notes"),
		changeNote: text("change_note"),
		textHash: text("text_hash").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(now),
	},
	(t): SQLiteTableExtraConfigValue[] => [
		uniqueIndex("prompt_version_id_prompt_owner_uidx").on(
			t.id,
			t.promptId,
			t.ownerId,
		),
		uniqueIndex("prompt_version_number_uidx").on(t.promptId, t.number),
		index("prompt_version_owner_hash_idx").on(t.ownerId, t.textHash),
		foreignKey({
			columns: [t.promptId, t.ownerId],
			foreignColumns: [prompt.id, prompt.ownerId],
		}).onDelete("restrict"),
		foreignKey({
			columns: [t.parentVersionId, t.promptId, t.ownerId],
			foreignColumns: [t.id, t.promptId, t.ownerId],
		}).onDelete("restrict"),
		check("prompt_version_number_check", sql`${t.number} >= 1`),
		check(
			"prompt_version_parent_check",
			sql`(${t.number} = 1 AND ${t.parentVersionId} IS NULL) OR (${t.number} > 1 AND ${t.parentVersionId} IS NOT NULL)`,
		),
	],
);

export const promptSource = sqliteTable(
	"prompt_source",
	{
		id: text("id").primaryKey(),
		promptId: text("prompt_id").notNull(),
		ownerId: text("owner_id")
			.notNull()
			.references(() => owner.userId, { onDelete: "restrict" }),
		kind: text("kind", { enum: ["url", "work"] }).notNull(),
		sourceWorkId: text("source_work_id"),
		url: text("url"),
		platform: text("platform"),
		author: text("author"),
		availability: text("availability", {
			enum: ["unknown", "userReportedUnavailable"],
		})
			.notNull()
			.default("unknown"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(now),
	},
	(t): SQLiteTableExtraConfigValue[] => [
		index("prompt_source_prompt_owner_idx").on(t.promptId, t.ownerId),
		foreignKey({
			columns: [t.promptId, t.ownerId],
			foreignColumns: [prompt.id, prompt.ownerId],
		}).onDelete("restrict"),
		check(
			"prompt_source_url_only_check",
			sql`${t.kind} = 'url' AND ${t.url} IS NOT NULL AND ${t.sourceWorkId} IS NULL`,
		),
		check(
			"prompt_source_availability_check",
			sql`${t.availability} IN ('unknown','userReportedUnavailable')`,
		),
	],
);

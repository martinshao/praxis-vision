import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const owner = sqliteTable(
	"owner",
	{
		id: text("id").primaryKey().default("singleton"),
		userId: text("user_id")
			.notNull()
			.unique()
			.references(() => user.id, { onDelete: "restrict" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`),
	},
	(table) => [check("owner_singleton", sql`${table.id} = 'singleton'`)],
);

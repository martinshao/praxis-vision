import { z } from "zod";

const bounded = (max: number) => z.string().max(max);
const parameters = z
	.unknown()
	.superRefine((value, ctx) => {
		const forbidden = new Set(["__proto__", "constructor", "prototype"]);
		function safe(input: unknown, depth = 0): boolean {
			if (depth > 20) return false;
			if (
				input === null ||
				typeof input === "string" ||
				typeof input === "boolean"
			)
				return true;
			if (typeof input === "number") return Number.isFinite(input);
			if (typeof input !== "object") return false;
			if (
				!Array.isArray(input) &&
				Object.getPrototypeOf(input) !== Object.prototype &&
				Object.getPrototypeOf(input) !== null
			)
				return false;
			return Object.entries(input).every(
				([key, child]) => !forbidden.has(key) && safe(child, depth + 1),
			);
		}
		if (
			!value ||
			Array.isArray(value) ||
			typeof value !== "object" ||
			!safe(value) ||
			Buffer.byteLength(JSON.stringify(value), "utf8") > 16384
		)
			ctx.addIssue({
				code: "custom",
				message: "Parameters must be bounded plain JSON data",
			});
	})
	.pipe(z.record(z.string(), z.json()));
export const metadataSchema = z
	.object({
		title: bounded(80),
		topic: z.enum(["portrait", "landscape", "illustration", "other"]),
		tags: z.array(z.string().min(1).max(40)).max(20),
		notes: bounded(5000),
		readiness: z.enum(["inbox", "ready"]),
		favorite: z.boolean(),
	})
	.strict()
	.partial();
export const contentSchema = z
	.object({
		text: z
			.string()
			.min(1)
			.max(20000)
			.refine((text) => text.trim().length > 0, "Text cannot be blank"),
		negativeText: bounded(10000).nullable().optional(),
		declaredProvider: bounded(200).nullable().optional(),
		declaredModel: bounded(200).nullable().optional(),
		declaredParameters: parameters.optional(),
		referenceNotes: bounded(5000).nullable().optional(),
	})
	.strict();
export const sourceSchema = z
	.object({
		kind: z.literal("url"),
		url: z
			.string()
			.max(2048)
			.refine((value) => {
				try {
					const url = new URL(value);
					return (
						["http:", "https:"].includes(url.protocol) &&
						!url.username &&
						!url.password
					);
				} catch {
					return false;
				}
			}, "Only HTTP(S) URLs without credentials are allowed"),
		platform: bounded(200).nullable().optional(),
		author: bounded(200).nullable().optional(),
		availability: z.enum(["unknown", "userReportedUnavailable"]).optional(),
	})
	.strict();
export const createSchema = contentSchema
	.extend({
		metadata: metadataSchema.optional(),
		sources: z.array(sourceSchema).max(24).optional(),
		allowDuplicate: z.boolean().optional(),
	})
	.strict();
export const metadataWriteSchema = z
	.object({
		metadata: metadataSchema,
		expectedVersion: z.number().int().min(1),
	})
	.strict();
export const versionWriteSchema = z
	.object({
		fullContent: contentSchema,
		expectedVersion: z.number().int().min(1),
		changeNote: bounded(5000).nullable().optional(),
	})
	.strict();
export const sourceWriteSchema = z
	.object({ source: sourceSchema, expectedVersion: z.number().int().min(1) })
	.strict();
export const pageSchema = z
	.object({
		cursor: z.coerce.number().int().min(1).optional(),
		limit: z.coerce.number().int().min(1).max(100).default(24),
	})
	.strict();
export type Content = z.infer<typeof contentSchema>;
export type Metadata = z.infer<typeof metadataSchema>;

const queryBoolean = z.enum(["true", "false"]).transform((v) => v === "true");
const listCursor = z
	.string()
	.max(200)
	.regex(
		/^\d{1,16}:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
	)
	.refine(
		(v) =>
			Number.isSafeInteger(Number(v.split(":")[0])) &&
			Number(v.split(":")[0]) <= 8640000000000000,
	);
export const listSchema = z
	.object({
		query: z.string().max(200).optional(),
		topic: z
			.enum(["portrait", "landscape", "illustration", "other"])
			.optional(),
		platform: z.string().min(1).max(200).optional(),
		model: z.string().min(1).max(200).optional(),
		trialState: z
			.enum(["untried", "unrated", "satisfied", "improve", "tried"])
			.optional(),
		favorite: queryBoolean.optional(),
		archived: queryBoolean.default(false),
		tags: z.array(z.string().min(1).max(40)).max(20).optional(),
		cursor: listCursor.optional(),
		limit: z
			.string()
			.regex(/^[1-9]\d{0,2}$/)
			.transform(Number)
			.pipe(z.number().max(100))
			.default(24),
	})
	.strict();
export const archiveWriteSchema = z
	.object({ expectedVersion: z.number().int().min(1) })
	.strict();

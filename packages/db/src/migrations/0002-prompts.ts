// Additive, immutable application-ledger migration. No existing rows are rewritten.
export const promptsMigration = {
	id: "0002-prompts-persistence",
	statements: [
		`CREATE TABLE prompt (
 id TEXT PRIMARY KEY NOT NULL,
 owner_id TEXT NOT NULL REFERENCES owner(user_id) ON DELETE RESTRICT,
 title TEXT NOT NULL DEFAULT '', topic TEXT NOT NULL DEFAULT 'other' CHECK(topic IN ('portrait','landscape','illustration','other')),
 tags TEXT NOT NULL DEFAULT '[]', notes TEXT NOT NULL DEFAULT '',
 readiness TEXT NOT NULL DEFAULT 'inbox' CHECK(readiness IN ('inbox','ready')),
 favorite INTEGER NOT NULL DEFAULT 0 CHECK(favorite IN (0,1)),
 current_version_id TEXT NOT NULL, expected_version INTEGER NOT NULL DEFAULT 1 CHECK(expected_version >= 1),
 archived_at INTEGER, created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
 updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
 FOREIGN KEY(current_version_id,id,owner_id) REFERENCES prompt_version(id,prompt_id,owner_id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED
 )`,
		"CREATE UNIQUE INDEX prompt_id_owner_uidx ON prompt(id,owner_id)",
		"CREATE INDEX prompt_owner_archive_topic_created_idx ON prompt(owner_id,archived_at,topic,created_at)",
		`CREATE TABLE prompt_version (
 id TEXT PRIMARY KEY NOT NULL, prompt_id TEXT NOT NULL,
 owner_id TEXT NOT NULL REFERENCES owner(user_id) ON DELETE RESTRICT,
 number INTEGER NOT NULL CHECK(number >= 1), parent_version_id TEXT,
 text TEXT NOT NULL, negative_text TEXT, declared_provider TEXT, declared_model TEXT,
 declared_parameters TEXT NOT NULL DEFAULT '{}', reference_notes TEXT, change_note TEXT,
 text_hash TEXT NOT NULL, created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
 CHECK((number = 1 AND parent_version_id IS NULL) OR (number > 1 AND parent_version_id IS NOT NULL)),
 FOREIGN KEY(prompt_id,owner_id) REFERENCES prompt(id,owner_id) ON DELETE RESTRICT,
 FOREIGN KEY(parent_version_id,prompt_id,owner_id) REFERENCES prompt_version(id,prompt_id,owner_id) ON DELETE RESTRICT
 )`,
		"CREATE UNIQUE INDEX prompt_version_id_prompt_owner_uidx ON prompt_version(id,prompt_id,owner_id)",
		"CREATE UNIQUE INDEX prompt_version_number_uidx ON prompt_version(prompt_id,number)",
		"CREATE INDEX prompt_version_owner_hash_idx ON prompt_version(owner_id,text_hash)",
		`CREATE TABLE prompt_source (
 id TEXT PRIMARY KEY NOT NULL, prompt_id TEXT NOT NULL,
 owner_id TEXT NOT NULL REFERENCES owner(user_id) ON DELETE RESTRICT,
 kind TEXT NOT NULL, source_work_id TEXT, url TEXT, platform TEXT, author TEXT,
 availability TEXT NOT NULL DEFAULT 'unknown' CHECK(availability IN ('unknown','userReportedUnavailable')),
 created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
 CHECK(kind = 'url' AND url IS NOT NULL AND source_work_id IS NULL),
 FOREIGN KEY(prompt_id,owner_id) REFERENCES prompt(id,owner_id) ON DELETE RESTRICT
 )`,
		"CREATE INDEX prompt_source_prompt_owner_idx ON prompt_source(prompt_id,owner_id)",
		`CREATE TRIGGER prompt_version_no_update BEFORE UPDATE ON prompt_version BEGIN SELECT RAISE(ABORT,'Prompt versions are immutable'); END`,
		`CREATE TRIGGER prompt_version_no_delete BEFORE DELETE ON prompt_version BEGIN SELECT RAISE(ABORT,'Prompt versions are permanent'); END`,
		`CREATE TRIGGER prompt_no_delete BEFORE DELETE ON prompt BEGIN SELECT RAISE(ABORT,'Archive prompts instead of deleting'); END`,
		`CREATE TRIGGER prompt_source_no_delete BEFORE DELETE ON prompt_source BEGIN SELECT RAISE(ABORT,'Prompt sources are retained'); END`,
	],
} as const;

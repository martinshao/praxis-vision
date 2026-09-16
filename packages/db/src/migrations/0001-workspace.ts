// Additive bootstrap: existing generator tables and rows are never replaced.
export const workspaceMigration = {
	id: "0001-workspace-auth-owner",
	statements: [
		`CREATE TABLE IF NOT EXISTS "user" (
 id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 email_verified INTEGER DEFAULT 0 NOT NULL, image TEXT,
 created_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
 updated_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
)`,
		`CREATE TABLE IF NOT EXISTS session (
 id TEXT PRIMARY KEY NOT NULL, expires_at INTEGER NOT NULL, token TEXT NOT NULL UNIQUE,
 created_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
 updated_at INTEGER NOT NULL, ip_address TEXT, user_agent TEXT,
 user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
)`,
		"CREATE INDEX IF NOT EXISTS session_userId_idx ON session(user_id)",
		`CREATE TABLE IF NOT EXISTS account (
 id TEXT PRIMARY KEY NOT NULL, account_id TEXT NOT NULL, provider_id TEXT NOT NULL,
 user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
 access_token TEXT, refresh_token TEXT, id_token TEXT, access_token_expires_at INTEGER,
 refresh_token_expires_at INTEGER, scope TEXT, password TEXT,
 created_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
 updated_at INTEGER NOT NULL
)`,
		"CREATE UNIQUE INDEX IF NOT EXISTS account_providerId_accountId_uidx ON account(provider_id, account_id)",
		"CREATE INDEX IF NOT EXISTS account_userId_idx ON account(user_id)",
		`CREATE TABLE IF NOT EXISTS verification (
 id TEXT PRIMARY KEY NOT NULL, identifier TEXT NOT NULL, value TEXT NOT NULL,
 expires_at INTEGER NOT NULL,
 created_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
 updated_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
)`,
		"CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification(identifier)",
		`CREATE TABLE IF NOT EXISTS owner (
 id TEXT PRIMARY KEY NOT NULL DEFAULT 'singleton' CHECK (id = 'singleton'),
 user_id TEXT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE RESTRICT,
 created_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
)`,
	],
} as const;

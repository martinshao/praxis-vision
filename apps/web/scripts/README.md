# Local private workspace setup

Requires Node.js 24 (TypeScript stripping and repository-scoped module resolution hooks).
No environment file is loaded by this CLI. It accepts only an explicit local `file:` URL.
Back up an existing database before running a migration; incompatible existing schema
fails without replacing rows. Do not use `db:push` or the generator's Drizzle migration
journal for these versioned application migrations.

From the repository root:

```sh
pnpm db:migrate file:/absolute/path/private.sqlite
pnpm owner:init file:/absolute/path/private.sqlite
```

Owner initialization asks for an email and a hidden password in an interactive terminal.
Passwords are never arguments, environment fields, or log output. Minimum length is 12,
maximum 128. It migrates first, then atomically creates one owner and credential record.
Rerunning with the same normalized email leaves credentials and sessions unchanged.
A different owner email or any pre-existing unclaimed user is rejected. Such a database
requires an explicit operator-reviewed recovery decision; this tool never claims old users,
resets passwords, clears sessions, or removes data.

The Web application's existing runtime database configuration must point to the same file.
No real database migration or real owner creation was performed by TASK-001.

# Authorized Bootstrap Handoff

role: platform-engineer
execution_mode: subagent
scope_mode: BOOTSTRAP_ONLY
status: COMPLETED
module: platform-bootstrap
task: PLATFORM-BOOTSTRAP-001
git_baseline: 01be53ecb321293f1fef320c4110d6d9c7c6aacd
next_node: root review → required QA/security → user inspection; frontend scaffold remains a separate manual gate

## Bootstrap Evidence

- generator: pnpm create better-t-stack@latest
- generator_version: 3.43.0
- generation_complete: true
- install_complete: true
- directory_conflict_strategy: metadata-only merge; protected original AGENTS/.wave/Git and merged .gitignore
- workspace_paths: apps/web; packages/auth; packages/db; packages/ui; packages/config
- nested_git_created: false
- Environment authorization: ENV-CREATION-AUTHORIZATION.md. Only the official initial generation created apps/web/.env; content was not read or shown. Varlock codegen/build uses runtime environment normally without outputting values. Generated typed accessors contain no copied URL/key literals.
- Full machine-readable evidence: BOOTSTRAP-AUTHORIZED-EVIDENCE.json.

## Commands and results

| Command | Exit | Result |
|---|---:|---|
| pnpm create better-t-stack@latest --help | 0 | Explicit options supported |
| pnpm create better-t-stack@latest --version | 0 | 3.43.0 |
| Full dry-run below | 0 | success=true; No files were written |
| Full generation below | 0 | Scaffolded once; no git/install |
| pnpm install | 1 | Registry large tarballs hit download timeout after automatic retries |
| curl official Next/SWC tarballs to /tmp only | 0 / 0 | HTTP200; both complete; no source/version change |
| pnpm install --fetch-timeout=300000 --network-concurrency=4 | 1 initially / 0 finally | Download complete; initial pnpm build allowlist failure fixed for esbuild only; lock fixed |
| pnpm rebuild esbuild | 0 | Existing dependency installation repair |
| pnpm run check-types (final) | 0 | db/ui/auth/web TypeScript passed |
| pnpm exec biome check --write apps packages package.json pnpm-workspace.yaml biome.json | 1 initially / 0 finally | Safe generated-template format/import repairs then actual a11y fixes |
| pnpm run check (final) | 0 | 63 files; no fixes/no diagnostics |
| pnpm run build (final) | 0 | Next16.3.5 optimized build; default template routes only |
| git check-ignore apps/web/.env apps/web/.next/server/app/index.html | 0 | Both ignored |

Two premature check attempts while install was incomplete triggered pnpm auto-install; stopped (137), no actual verification claimed. Two subsequent check attempts before esbuild placeholder correction returned1 from install preflight; final checks above are authoritative. No migrations, seed, deploy, commit or push.

Dry-run:
```bash
pnpm create better-t-stack@latest . --frontend next --backend self --runtime none --database sqlite --orm drizzle --api none --auth better-auth --payments none --addons biome --examples none --db-setup none --template none --web-deploy none --server-deploy none --package-manager pnpm --directory-conflict merge --no-git --no-install --open none --manual-db --disable-analytics --no-render-title --dry-run --verbose
```
Generation:
```bash
pnpm create better-t-stack@latest . --frontend next --backend self --runtime none --database sqlite --orm drizzle --api none --auth better-auth --payments none --addons biome --examples none --db-setup none --template none --web-deploy none --server-deploy none --package-manager pnpm --directory-conflict merge --no-git --no-install --open none --manual-db --disable-analytics --no-render-title
```

## Changed files

Generated source/config inventory is complete below. apps/web/.env exists solely through authorized generator creation and is ignored; its contents were never inspected. Generated build outputs/node_modules/tsbuildinfo excluded.

- .gitignore
- README.md
- apps/web/.env.schema
- apps/web/.gitignore
- apps/web/AGENTS.md
- apps/web/bunfig.toml
- apps/web/components.json
- apps/web/next-env.d.ts
- apps/web/next.config.ts
- apps/web/package.json
- apps/web/postcss.config.mjs
- apps/web/src/app/api/auth/[...all]/route.ts
- apps/web/src/app/dashboard/dashboard.tsx
- apps/web/src/app/dashboard/page.tsx
- apps/web/src/app/favicon.ico
- apps/web/src/app/layout.tsx
- apps/web/src/app/login/page.tsx
- apps/web/src/app/page.tsx
- apps/web/src/components/header.tsx
- apps/web/src/components/loader.tsx
- apps/web/src/components/mode-toggle.tsx
- apps/web/src/components/providers.tsx
- apps/web/src/components/sign-in-form.tsx
- apps/web/src/components/sign-up-form.tsx
- apps/web/src/components/theme-provider.tsx
- apps/web/src/components/user-menu.tsx
- apps/web/src/env.server.ts
- apps/web/src/env.ts
- apps/web/src/index.css
- apps/web/src/lib/auth-client.ts
- apps/web/src/services.ts
- apps/web/tsconfig.json
- biome.json
- bts.jsonc
- bunfig.toml
- package.json
- packages/auth/.gitignore
- packages/auth/package.json
- packages/auth/src/index.ts
- packages/auth/tsconfig.json
- packages/config/package.json
- packages/config/tsconfig.base.json
- packages/db/.env.schema
- packages/db/.gitignore
- packages/db/drizzle.config.ts
- packages/db/package.json
- packages/db/src/config.ts
- packages/db/src/env.ts
- packages/db/src/index.ts
- packages/db/src/migrations/.gitkeep
- packages/db/src/schema/auth.ts
- packages/db/src/schema/index.ts
- packages/db/tsconfig.json
- packages/ui/components.json
- packages/ui/package.json
- packages/ui/postcss.config.mjs
- packages/ui/src/components/attachment.tsx
- packages/ui/src/components/bubble.tsx
- packages/ui/src/components/button.tsx
- packages/ui/src/components/card.tsx
- packages/ui/src/components/checkbox.tsx
- packages/ui/src/components/dropdown-menu.tsx
- packages/ui/src/components/empty.tsx
- packages/ui/src/components/input-group.tsx
- packages/ui/src/components/input.tsx
- packages/ui/src/components/label.tsx
- packages/ui/src/components/marker.tsx
- packages/ui/src/components/message-scroller.tsx
- packages/ui/src/components/message.tsx
- packages/ui/src/components/skeleton.tsx
- packages/ui/src/components/sonner.tsx
- packages/ui/src/components/textarea.tsx
- packages/ui/src/components/tooltip.tsx
- packages/ui/src/hooks/.gitkeep
- packages/ui/src/lib/utils.ts
- packages/ui/src/styles/globals.css
- packages/ui/tsconfig.json
- pnpm-lock.yaml
- pnpm-workspace.yaml
- tsconfig.json

- .wave/handoffs/platform-bootstrap/PLATFORM-BOOTSTRAP-001-AUTHORIZED.md
- .wave/handoffs/platform-bootstrap/BOOTSTRAP-AUTHORIZED-EVIDENCE.json

## Verification and risks

Actual structure matches planned Next self workspace. No nested Git or generated SQLite database files. Original workflow docs preserved by generator. No test framework/scripts generated: NOT_AVAILABLE, scaffold establishes them. No private owner isolation, disabled registration, supplier integrations, Prompt business pages/APIs or product ACs claimed.

Official starter samples retained: homepage Better-T-Stack status, /login sign-in/sign-up forms, /dashboard server session guard and empty client view, /api/auth/[...all] handler, theme/header/user-menu and shared UI primitives (including unused messaging/attachment components). These are technical samples for APP-SHELL-001/workspace tasks to replace; they are not product implementation and should not be deployed.

Actual latest official template includes Varlock schema + generated typed accessors/postinstall and @next/env integration. These are generator-selected infrastructure dependencies, recorded rather than manually added. Supply-chain review should inspect locked dependencies and esbuild installation script allowlist (only esbuild + official sharp allowed); deprecated @esbuild-kit helper subdependencies noted by pnpm.

Scope fixes: bounded read-only check prevents .wave formatting; .env variants excluded from Biome; .next/out ignored; safe generated-template formatting/import organization; primitive fieldset/label semantics and empty-dashboard cleanup. No lint/TypeScript suppression or validation weakening.

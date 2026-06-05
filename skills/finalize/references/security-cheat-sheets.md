# Security cheat-sheet router

Phase 4 support for `/finalize`. This file turns broad security review into targeted, surface-aware checks. It is not a separate verdict lane by itself; it tells you which narrower references to load so the audit is complete without becoming noisy.

## How to use

Start with `security-review.md` as the always-on floor. Then load the focused references below when the diff touches their surface:

- `api-security-review.md`
  Load when the diff adds or changes HTTP endpoints, RPC methods, webhooks, controllers, route handlers, request/response schemas, or API clients.
- `agent-security-review.md`
  Load when the diff calls an LLM, builds agent behavior, handles prompts/context, exposes tools, stores embeddings, or executes model output.
- `auth-session-review.md`
  Load when the diff touches login, signup, logout, password reset, MFA, session/cookie/token handling, roles/permissions, or identity-provider integration.
- `input-upload-output-review.md`
  Load when the diff accepts untrusted input, parses files, renders rich output, builds URLs/queries/commands, or handles uploads/downloads.
- `workflow-security.md`
  Load when the diff changes `.github/workflows/**`, CI/CD config, release automation, build scripts, deploy scripts, or secrets usage in automation.
- `repo-hygiene.md`
  Load when the diff changes dependency manifests, lockfiles, release config, repo policy files, action pinning, or supply-chain-sensitive project config.
- `observability-review.md`
  Load when the diff changes logging, tracing, alerts, audit logs, error reporting, or sensitive state transitions that must be observable.
- `migration-safety.md`
  Load when the diff changes DB schemas, migrations, backfills, data transforms, or anything that mutates persistent data at rollout time.
- `configuration-review.md`
  Load when the diff changes env vars, feature flags, defaults, deployment config, debug modes, or production-vs-dev behavior.

## Trigger heuristics

Use filename and behavior clues together:
- API surfaces: `routes`, `controllers`, `handlers`, `openapi`, `schema`, `api`, `webhook`
- Auth/session: `auth`, `login`, `session`, `token`, `cookie`, `oauth`, `saml`, `mfa`, `acl`, `rbac`
- Input/output: upload handlers, HTML rendering, redirect helpers, file parsing, template rendering, shell/SQL builders
- Workflow/repo: `.github/workflows`, `Dockerfile`, release scripts, package manager config, action references, policy files
- Migration/data: `migrations`, `prisma`, `typeorm`, `schema.sql`, `alembic`, backfill scripts, ETL jobs
- Config/flags: `.env.example`, deployment manifests, feature flag config, runtime settings
- Observability: logger setup, tracing middleware, audit events, Sentry/Datadog/OpenTelemetry hooks

## Discipline

- Load only the references that match the diff surface.
- If a surface clearly does not apply, note `N/A` and move on.
- Findings from these focused refs still must pass `findings-lifecycle.md` before blocking.

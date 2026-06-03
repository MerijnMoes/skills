# Configuration review

Phase 4, Phase 5, and Phase 7 support for `/finalize`, conditional. Apply when the diff changes env vars, feature flags, defaults, deployment config, debug settings, or production-vs-dev behavior.

## What to check

- **Safe defaults** — production-facing defaults are secure and conservative; debug/dev shortcuts are not accidentally enabled by default.
- **Environment separation** — dev/test-only config does not leak into production paths.
- **Required config clarity** — new env vars, flags, or secrets are documented and validated clearly enough that misconfiguration is unlikely.
- **Feature-flag safety** — default states, fallback paths, and stale flag behavior are explicit.
- **Fail-safe behavior** — missing or invalid config fails closed where security or integrity depends on it.
- **Secret handling** — config examples and docs do not embed real secrets or encourage unsafe storage.

## Concrete prompts

- If the new config is missing in production, what exactly happens?
- What value is used by default, and is it safe?
- Can an operator mis-set this and silently weaken security or correctness?
- Is the new flag/env var reflected in docs and examples accurately?

## Common blockers

- Debug, permissive CORS, mock auth, or insecure transport enabled by default.
- Missing config silently downgrades security or writes to the wrong target.
- New secret/env var required but undocumented or ambiguously named.

## Output

Use this both for audit findings and for doc-update checks when configuration changed.

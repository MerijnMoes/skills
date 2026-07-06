# QA capability matrix

The QA capability matrix records which local/free QA capabilities were relevant,
which were run, and which remain residual risk. It prevents skipped checks from
disappearing into optimistic prose.

Forge must not require paid QA providers, hosted AI testing services, provider
model subscriptions, or vendor dashboards for pass/fail evidence.

## Matrix

```md
## QA Capability Matrix

| Capability | State | Evidence | Reason |
|---|---|---|---|
| Browser E2E - watched local | run / N/A / not configured / deferred | headed/ui command, artifacts | why |
| Browser E2E - CI equivalent | run / N/A / not configured / deferred | headless command, artifacts | why |
| API contract | run / N/A / not configured / deferred | paths, command, artifacts | why |
| Accessibility | run / N/A / not configured / deferred | axe/manual/browser evidence | why |
| Visual smoke | run / N/A / not configured / deferred | screenshots/snapshots | why |
| Performance smoke | run / N/A / not configured / deferred | Lighthouse/k6/build metrics | why |
| Coverage signal | run / N/A / not configured / deferred | coverage summary | why |
| Security checks | run / N/A / not configured / deferred | audit/secret/static-analysis evidence | why |
| CI artifacts | run / N/A / not configured / deferred | reports/traces/logs | why |
```

## State meanings

- `run`: executed and evidence captured.
- `N/A`: not relevant to this diff.
- `not configured`: relevant, but the repo has no local setup yet.
- `deferred`: relevant, but blocked by environment, credentials, data, time, or
  explicit user decision.

`not configured` and `deferred` are not failures by themselves, but they are
residual-risk inputs for `/forge:review`.

## Capability guidance

- **Browser E2E**: default to Playwright for smoke paths, changed critical
  flows, negative/recovery paths, auth/state transitions, navigation, async
  loading, and persistence-visible outcomes.
- **API contract**: use Playwright API request tests when changed behavior
  crosses REST, GraphQL, auth, validation, CRUD, permission, pagination, or
  error-contract boundaries. Assert body, headers, error shape, and side
  effects, not only status codes.
- **Accessibility**: prefer semantic Playwright assertions and keyboard checks.
  Use `@axe-core/playwright` only if present or explicitly approved for local
  setup.
- **Visual smoke**: use screenshots for investigation and reporting. Use
  snapshot assertions only for stable high-value surfaces where the repo already
  accepts baseline maintenance.
- **Performance smoke**: use Lighthouse for browser-facing load/render/access
  signals and k6 for load-sensitive API/backend flows only when risk and
  environment justify it. Performance checks need explicit thresholds.
- **Coverage signal**: use existing coverage tooling to find suspicious changed
  behavior gaps. Never add vacuous tests to improve a number.
- **Security checks**: start by detecting existing package-manager audit,
  dependency scanning, secret scanning, static analysis, lint security plugins,
  vulnerability alerts, or CI security jobs. Suggest new tools only after
  recording what already exists.
- **CI artifacts**: prefer cheap-to-expensive order: lint/typecheck, unit,
  integration, build, API, E2E, performance. Preserve traces, screenshots,
  videos, coverage, and logs when available.

## Output rules

- Include the matrix in QA evidence for non-trivial Forge runs.
- Name exact commands, paths, screenshots, traces, videos, reports, or logs.
- Explain every `not configured` and `deferred` state.
- Do not imply a capability passed when it was not run.

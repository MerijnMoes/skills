# Playwright Testing Specialty

Use when generic `testing.md` is not enough and the changed risk is a browser
user journey covered by Playwright in this project. Keep this focused on
Playwright-specific review tactics, not generic test-quality advice already
covered elsewhere.

## What to review

- Locator discipline over brittle selectors, especially avoiding CSS/XPath
  chains when role-, label-, or test-id-based locators can express intent.
- Waiting on explicit conditions instead of sleeps, including navigation,
  network, visibility, and state transitions that the test can observe
  directly.
- Focused page-object or helper boundaries when they clarify reuse without
  hiding assertions or turning the test flow into an unreadable abstraction
  layer.
- Retries, traces, screenshots, video, and artifact capture for failures so
  flaky or environment-specific breaks leave enough evidence to debug.
- `repeat-each` or retry-based flake diagnosis when stability is in doubt, used
  to investigate nondeterminism rather than to mask it.

## Keep the scope tight

Stay on the changed browser journey, the stability risks it introduces, and the
minimum stack-specific tactics needed to verify it well. Route back to
`testing.md` for generic guidance on assertions, isolation, and choosing the
cheapest test that matches the risk.

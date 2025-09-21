# Secret Audit — motionmavericks/photo-platform — 20250921

- generated: 2025-09-21T15:56:46+10:00
- gitleaks: 8.18.4
- trufflehog: not_run
- deep_scan: true

## Findings (redacted)



## Remediation plan
- Replace hard-coded secrets with env vars or secret manager references.
- Add .gitignore for .env*, credentials, and build artifacts.
- Add pre-commit hook to run `gitleaks protect`.
- Rotate any exposed keys at the provider.

## History rewrite (optional)
- Only performed if CONFIRM_HISTORY_REWRITE=true.
- Force-push required. May break forks and SHAs.

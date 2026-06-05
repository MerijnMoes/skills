# Infrastructure security review

Use this specialty reference when the diff changes Docker, Kubernetes,
Terraform, or cloud-configuration surfaces that deserve focused review.

- Scope: configuration-sensitive trust boundaries, identity/secret handling,
  network exposure, and deploy-safety implications visible in the diff.
- Scope: infrastructure-specific findings that should stay narrowly tied to the
  changed config rather than expanding into a full platform audit.
- Scope: minimal router only for now; later tasks may expand the lane-specific
  checks.
- Mutability mode: `report-first`

# Decision packet

Used in `/finalize` Phases 7 and 8. This is the final structured bundle that
justifies the verdict. It is an internal verdict bundle, not a second
user-facing report contract; Phase 8 reporting should project from this packet.

## Inputs

- evidence-pack summary
- surviving findings
- verification-ledger summary
- residual unknowns
- project-fit and spec-fit judgment

Use the `risk lane` assigned in the evidence pack; the decision packet records
and applies that calibration rather than reclassifying the change. Refer to
`risk-mapping.md` for the deeper risk detail behind the lane when needed.

## Outputs

- verdict: `READY TO SHIP` | `NEEDS REVISION` | `BLOCKED`
- short verdict rationale
- evidence summary
- blocking findings
- non-blocking / deferred findings
- verification coverage summary
- residual risk and unknowns
- recommended next step

These outputs are the structured inputs to Phase 8 final reporting, which turns
them into the user-facing summary.

## Provenance

When relevant, note:

- risk lane
- whether challenger ran
- whether audit independence was structural or instructional
- which major lanes were skipped or unavailable

# Frontier Candidate Review Rubric

Use this rubric exactly. Label each candidate independently.

Labels:
- A: would run now; public data/artifact, metric, baseline, and scientific hypothesis are clear.
- B: worth tracking, but needs one concrete repair before running.
- C: plausible but weak scientific value, weak measurement, or crowded/obvious.
- Reject: missing data, metric, baseline, hypothesis, falsifiability, or safe 24-72h path.

For each candidate return JSON with:
- candidate_id
- frontier_label
- would_run_24_72h
- rationale
- repair_needed
- fatal_blocker

Rationale must identify the strongest evidence span, public training/evaluation asset, measurable endpoint, and scientific hypothesis.

Be stricter than the cheap scanner. A candidate that sounds interesting but cannot be run in 24-72h with public data/artifacts is Reject or C.

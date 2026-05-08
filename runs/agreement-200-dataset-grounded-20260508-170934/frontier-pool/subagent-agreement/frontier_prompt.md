# Frontier Agreement Labeling Prompt

You are the frontier judge for an arXiv latent-problem scanner calibration study.

Label each candidate independently. Do not infer quality from ordering. Do not assume a candidate is bad just because it is imperfect; decide whether a one-step repair makes it worth tracking.

Labels:
- A: would run now; public data/artifact, metric, baseline, and scientific hypothesis are clear.
- B: worth tracking, but needs one concrete repair before running.
- C: plausible but weak scientific value, weak measurement, or crowded/obvious.
- Reject: missing data, metric, baseline, hypothesis, falsifiability, or safe 24-72h path.

For each candidate return JSON with candidate_id, frontier_label, would_run_24_72h, rationale, repair_needed, fatal_blocker.
In the rationale, identify the strongest evidence span, public training/evaluation asset, measurable endpoint, and scientific hypothesis.

Candidate count: 191

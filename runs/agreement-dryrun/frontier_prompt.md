# Frontier Agreement Labeling Prompt

You are the frontier judge for an arXiv latent-problem scanner calibration study.

Label each candidate independently. Do not infer quality from ordering. Do not assume a candidate is bad just because it is imperfect; decide whether a one-step repair makes it worth tracking.

Labels:
- A: would spend 24-72h running this experiment.
- B: worth tracking or repairable with one concrete step.
- C: technically plausible but not worth pursuing now.
- Reject: fatal flaw.

For each candidate return JSON with candidate_id, frontier_label, would_run_24_72h, rationale, repair_needed, fatal_blocker.

Candidate count: 6

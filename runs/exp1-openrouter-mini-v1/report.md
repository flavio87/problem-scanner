# Experiment 1 Comprehensive Smoke Report

Generated: 2026-05-08T09:19:36.660Z
Output directory: `runs/exp1-openrouter-mini-v1`
Mode: `llm`

## Run Summary

- Papers fetched from arXiv API: 3
- Papers inside 3-day window: 3
- Abstract-pass shortlist size: 1
- Raw candidates extracted: 0
- Accepted candidates in report: 0
- Rejected candidates: 0
- Top-20 evidence precision: 0%
- Top-20 problem-evidence precision: 0%
- Estimated cost: $0.006666
- Estimated cost per scanned paper: $0.002222

## LLM And Prompt Audit

- Run mode: `llm`
- LLM invoked: yes
- Provider: openrouter
- Broad scan model: `google/gemini-3-flash-preview`
- Verifier model: `google/gemini-3-flash-preview`
- Prompt audit file: `prompts.md`

## Acceptance Checks

- FAIL: at_least_3_a_grade
- FAIL: at_least_8_a_or_b_grade
- FAIL: top_20_evidence_precision_gt_80pct
- FAIL: top_20_problem_evidence_precision_gt_80pct
- FAIL: at_least_1_under_72h_public_benchmark
- PASS: low_cost_per_paper
- Overall: FAIL

## Grade Counts

- A: 0
- B: 0
- C: 0

No accepted candidates.
## Rejection Audit

No rejected candidates.

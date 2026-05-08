# Experiment 1 Comprehensive Smoke Report

Generated: 2026-05-08T09:33:31.929Z
Output directory: `runs/exp1-smoke-50-openrouter-v2`
Mode: `llm`

## Run Summary

- Papers fetched from arXiv API: 50
- Papers inside 3-day window: 50
- Abstract-pass shortlist size: 30
- Raw candidates extracted: 16
- Accepted candidates in report: 1
- Rejected candidates: 15
- Top-20 evidence precision: 100%
- Top-20 problem-evidence precision: 100%
- Estimated cost: $0.268919
- Estimated cost per scanned paper: $0.005378

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
- PASS: top_20_evidence_precision_gt_80pct
- PASS: top_20_problem_evidence_precision_gt_80pct
- PASS: at_least_1_under_72h_public_benchmark
- PASS: low_cost_per_paper
- Overall: FAIL

## Grade Counts

- A: 1
- B: 0
- C: 0

## Candidate Index

| Rank | Grade | Paper | Score | Impact | Time Budget | Candidate |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | A | [2605.06557v1](https://arxiv.org/abs/2605.06557v1) | 89 | developer productivity | 48h | Generalization of process-level coordination diagnostics to non-spatial MARL domains |

## Detailed Candidates

### 1. A-grade candidate: 2605.06557v1

ArXiv: https://arxiv.org/abs/2605.06557v1
Score: 89/100
Confidence: 0.9
Impact type: developer productivity
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: future_work
Paper status: active
Code/data status: found
Verified code/data URLs: 1

Candidate problem:

Generalization of process-level coordination diagnostics to non-spatial MARL domains

Problem evidence spans:

- These metrics reveal coordination failure modes that return alone can conceal (Figure 1), highlighting that in addition to measuring the return, cooperative MARL benchmarks should also assess how well agents coordinate with each other.

Feasibility evidence spans:

- Existing cooperative MARL benchmarks have driven substantial progress by standardizing algorithm evaluation, including StarCraft micromanagement Samvelyan et al. ( 2019 ) , particle-world coordination tasks Lowe et al. ( 2017 ) , level-based foraging Christianos et al. ( 2020 ) , and Overcooked-style collaboration Carroll et al. ( 2019 ) .

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/mariacardei/coordination_aware_MARL

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/mariacardei/coordination_aware_MARL

Why hidden or underexploited:

Most benchmarks like SMAC or Overcooked report only win rates or returns, ignoring the 'redundancy' or 'diversity' metrics proposed in this paper which could explain why certain algorithms fail to scale.

Auto-research experiment:

Integrate STAT's 'conflict rate' and 'assignment diversity' metrics into the Level-Based Foraging (LBF) benchmark. Compare IQL and QMIX to see if QMIX's performance advantage in LBF is due to lower redundant foraging attempts or higher agent specialization.

Available data or benchmark:

Level-Based Foraging (LBF) and STAT diagnostic framework

Expected metric:

Correlation coefficient between 'conflict rate' and 'return' across different agent scales in LBF.

Specific intervention:

Instrument the Level-Based Foraging environment to log 'redundant attempts' (multiple agents attempting to pick the same food item simultaneously) as a proxy for STAT's conflict rate.

Baseline:

Standard return-based evaluation of QMIX on Level-Based Foraging.

Metric:

Conflict rate (redundant foraging attempts per episode)

Story angle:

Standard MARL metrics are lying to us; it's time to look under the hood of agent coordination in classic benchmarks.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 22/25
- Falsifiable evaluation: 19/20
- Problem clarity: 14/15
- Novelty or neglectedness: 13/15
- Impact: 12/15
- Storyability: 9/10

## Rejection Audit

### Rejected 1: 2605.06612v1

Candidate: Interaction between online discrepancy learning and restart mechanisms leading to false restarts or missed detections.

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code, data, or benchmark URL provided in the candidate or paper text (code_or_data_status is 'claimed' but 'code_or_data_urls' is empty).
- The candidate relies on a 'plant-simulation digital-twin benchmark' described in an appendix, which is not a verified public benchmark URL.

### Rejected 2: 2605.06612v1

Candidate: Sensitivity of BRPC to poorly specified transition noise and particle degeneracy in the projected parameter update.

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in the candidate or paper text.
- The candidate's code_or_data_status is 'claimed' but the code_or_data_urls list is empty, which violates the strict requirement for a concrete verified URL.

### Rejected 3: 2605.06652v1

Candidate: The 'auditor' capability in benchmarkless safety scoring creates a trade-off where high-strength auditors collapse comparative deltas between safe models.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 4: 2605.06652v1

Candidate: Benchmarkless safety scoring instruments lack explicit mitigations for 'eval-awareness' where models may behave differently when they detect they are being audited.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 5: 2605.06588v1

Candidate: Neural GED estimators fail to handle edge labels due to baseline architectural inconsistencies

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in the candidate or paper text (code_or_data_status is 'claimed' but 'code_or_data_urls' is empty).
- The evidence role is 'limitation' and the problem evidence spans indicate a deliberate exclusion of features (edge labels) to maintain baseline comparability, which is a standard experimental control rather than a fundamental failure mode of the proposed bi-Lipschitz theory.

### Rejected 6: 2605.06588v1

Candidate: Bi-Lipschitz guarantees for neural GED are restricted to the 1-WL expressive regime

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- Evidence spans do not match source text.
- No verified concrete public code/data/benchmark URL provided in the candidate metadata or paper text.
- The candidate relies on 'claimed' code status without a specific repository link to verify the implementation of FSW-GNN or the experimental pipeline.

### Rejected 7: 2605.06632v1

Candidate: Discrete Hard-Token Reversal of SFT-Induced Behaviors

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 8: 2605.06632v1

Candidate: Cross-Model Consistency of Sparse Carrier Causal Necessity

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 9: 2605.06627v1

Candidate: Deadpan note segments in score-performance alignments due to linear interpolation

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 10: 2605.06627v1

Candidate: Source-domain bias in large-scale MIDI pre-training

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 11: 2605.06557v1

Candidate: MARL coordination failure under sparse commitment decisions and high assignment pressure

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 12: 2605.06591v1

Candidate: Inference speed of Flow Matching kernels in multi-step autoregressive particle simulations

Reasons:

- Problem evidence span does not state a problem role.
- The provided code URL (https://github.com/lucidrains/x-transformers) is a general-purpose library and not the specific implementation of the BRICKS model or the CaloBricks dataset mentioned in the paper.
- The candidate fails to provide a verified concrete public code/data/benchmark URL for the specific research artifact (BRICKS/CaloBricks) as required by the strict verification criteria.

### Rejected 13: 2605.06591v1

Candidate: Generalization of Neural Markov Kernels to complex 3D geometries and diverse particle species

Reasons:

- Problem evidence span does not state a problem role.
- The provided code URL (https://github.com/lucidrains/x-transformers) is a general-purpose library and does not contain the specific BRICKS model implementation, the CaloBricks dataset, or the experimental scripts required to reproduce the paper's results.
- The candidate fails to provide a verified concrete public code/data/benchmark URL specific to the research (the CaloBricks dataset mentioned in the text is not linked via a verified URL).

### Rejected 14: 2605.06571v1

Candidate: Standard Federated Learning implementations underperform in heterogeneous IoT environments because a single global model cannot represent diverse device behaviors, leading to model divergence and poor anomaly detection.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in the candidate or paper text.
- The candidate's specific intervention is a verbatim repetition of a problem statement rather than a concrete technical modification.
- The evidence role is incorrectly identified as 'negative_result' when the cited spans actually describe the motivation for the proposed work (limitation of prior art) rather than a failure of the proposed CLAD framework itself.

### Rejected 15: 2605.06571v1

Candidate: Standard Federated Learning (FL) for IoT Intrusion Detection fails to generalize across heterogeneous device behaviors and cannot utilize unlabeled data from edge devices.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- The candidate fails to provide a verified concrete public code, data, or benchmark URL as required by the strict verifier instructions.
- The candidate's 'specific_intervention' and 'candidate_problem' are recursive and poorly defined, essentially asking to 'design an ablation' rather than proposing a specific, falsifiable research hypothesis or technical change.
- The evidence provided for feasibility is based on the paper's own positive results ('Our approach outperforms state-of-the-art baselines'), which violates the 'no positive-result-only' evidence rule for candidates.
- The candidate lacks a specific, verifiable baseline and metric beyond 'reported baseline' and 'pre-registered benchmark delta'.


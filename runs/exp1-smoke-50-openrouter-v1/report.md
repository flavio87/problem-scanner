# Experiment 1 Comprehensive Smoke Report

Generated: 2026-05-08T09:26:06.747Z
Output directory: `runs/exp1-smoke-50-openrouter-v1`
Mode: `llm`

## Run Summary

- Papers fetched from arXiv API: 50
- Papers inside 3-day window: 50
- Abstract-pass shortlist size: 30
- Raw candidates extracted: 21
- Accepted candidates in report: 1
- Rejected candidates: 20
- Top-20 evidence precision: 100%
- Top-20 problem-evidence precision: 100%
- Estimated cost: $0.300943
- Estimated cost per scanned paper: $0.006019

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
| 1 | A | [2605.06585v1](https://arxiv.org/abs/2605.06585v1) | 88 | developer productivity | 48h | Scalability of DR-L2O to high iteration counts due to large inner conic programs |

## Detailed Candidates

### 1. A-grade candidate: 2605.06585v1

ArXiv: https://arxiv.org/abs/2605.06585v1
Score: 88/100
Confidence: 0.95
Impact type: developer productivity
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: limitation
Paper status: active
Code/data status: found
Verified code/data URLs: 1

Candidate problem:

Scalability of DR-L2O to high iteration counts due to large inner conic programs

Problem evidence spans:

- A major limitation is scalability: unrolling algorithms for more iterations requires solving a much larger conic program at each gradient step.

Feasibility evidence spans:

- A natural remedy is to use GPU-accelerated first-order solvers [ 52 , 46 , 51 , 16 , 17 ] .
- Furthermore, in all SGD iteration timing tables, our code with JAX uses just-in-time (JIT) techniques for computational efficiency

Paper status evidence:

- Distributionally-Robust Learning to Optimize, v1 submitted May 2026 (simulated date based on ID).

Paper status sources:

- https://arxiv.org/abs/2605.06585v1

Verified code/data URLs:

- https://github.com/stellatogrp/dro_pep

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/stellatogrp/dro_pep

Why hidden or underexploited:

The paper focuses on the theoretical framework and small-scale benchmarks (Quadratic, LASSO, LP) using CPU-based solvers (Clarabel). The authors explicitly identify the transition to GPU-accelerated first-order solvers as the next step for scaling the number of unrolled iterations.

Auto-research experiment:

Replace the Clarabel/diffcp CPU-based SDP solver with a GPU-accelerated first-order solver (e.g., SCS or a custom JAX-based ADMM solver) to solve the inner DR-PEP problem. Compare the wall-clock time and maximum feasible unrolling depth (K) against the current CPU baseline while maintaining the same out-of-sample risk bounds.

Available data or benchmark:

Unconstrained quadratic minimization, LASSO, and linear programming benchmarks provided in the paper's repository.

Expected metric:

Maximum unrolling depth (K) achievable within a fixed 1-hour training budget.

Specific intervention:

Integrate a GPU-accelerated first-order conic solver (e.g., SCS with JAX/CUDA) into the DR-L2O training loop to replace the interior-point solver Clarabel.

Baseline:

The current DR-L2O implementation using Clarabel and diffcp on CPU.

Metric:

Seconds per SGD iteration

Story angle:

While DR-L2O provides the first robust bridge between data-driven and worst-case optimization, its reliance on heavy interior-point solvers makes it too slow for deep unrolling. By moving the inner SDP to the GPU, we can unlock the performance of deep learned optimizers with the safety of PEP bounds.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 22/25
- Falsifiable evaluation: 18/20
- Problem clarity: 14/15
- Novelty or neglectedness: 13/15
- Impact: 12/15
- Storyability: 9/10

## Rejection Audit

### Rejected 1: 2605.06612v1

Candidate: Interaction between online discrepancy learning and restart mechanisms in nonstationary Bayesian calibration

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in the candidate or paper text.
- The code_or_data_status is 'claimed' but the code_or_data_urls list is empty.
- The paper is a fresh submission (May 2024) and the candidate does not provide a link to a repository to verify the feasibility of the 'auto_research_experiment'.

### Rejected 2: 2605.06612v1

Candidate: Sensitivity of BRPC restart mechanisms to non-Gaussian simulator errors and covariate shift

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in code_or_data_urls.
- The candidate relies on 'claimed' code/data status without providing a functional link to the implementation or the specific plant-simulation benchmark data.

### Rejected 3: 2605.06652v1

Candidate: Auditor capability-matching trade-off in benchmarkless safety scoring

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 4: 2605.06652v1

Candidate: Vulnerability of benchmarkless safety scores to eval-awareness (gaming)

Reasons:

- Problem evidence span does not state a problem role.
- Safety/legal risk cannot be sandboxed in the described experiment.

### Rejected 5: 2605.06646v1

Candidate: Loss of automatic feature selection in Lasso and Elastic Net when using Venn-Abers calibration

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 6: 2605.06646v1

Candidate: Performance degradation of Venn-Abers regressors on small datasets

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 7: 2605.06643v1

Candidate: Multimodal Domain Generalization (MMDG) models exhibit significant performance degradation and unreliable confidence estimation when faced with missing modalities or sensor failures.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 8: 2605.06643v1

Candidate: Trimodal fusion in MMDG often fails to outperform bimodal configurations due to modality competition where dominant modalities overshadow auxiliary ones.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 9: 2605.06570v1

Candidate: Scalability of Smooth Neural Adjoint Policy Optimization (SNAPO) to non-differentiable or stochastic simulators

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in code_or_data_urls.
- The paper ID (2605.06570v1) indicates a future date (May 2026), suggesting this is a synthetic or hallucinated paper entry.
- Evidence role is 'limitation' but the provided evidence spans are descriptive of the method's features rather than explicit admissions of limitations in the text.
- The candidate fails to provide a specific URL for the 'Natural gas storage forward curve data' or the simulator code, which is a mandatory requirement for acceptance.

### Rejected 10: 2605.06627v1

Candidate: Deadpan note segments and missing sustain pedal effects in RAScoP-refined MIDI alignments

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 11: 2605.06627v1

Candidate: Performance degradation in expressive rendering models due to source-domain imbalance (Aria-MIDI dominance)

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 12: 2605.06557v1

Candidate: Return-based evaluation in cooperative MARL obscures coordination failure modes under combinatorial scaling.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 13: 2605.06557v1

Candidate: Value-based MARL methods struggle with redundant assignment and sparse decision opportunities in commitment-constrained environments.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 14: 2605.06523v1

Candidate: Implicit reward overfitting in RLVR where non-rank-1 components inflate training rewards without improving reasoning generalization.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 15: 2605.06523v1

Candidate: Loss of general capabilities (safety, world knowledge) during RLVR due to the dominance of the rank-1 reasoning component.

Reasons:

- Problem evidence span does not state a problem role.

### Rejected 16: 2605.06608v1

Candidate: Anytime-valid inference for adaptive covariate acquisition in sequential RCTs

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in code_or_data_urls.
- The candidate relies on 'claimed' code status without a verifiable repository link.

### Rejected 17: 2605.06608v1

Candidate: Correlated covariate acquisition in budgeted sequential experiments

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- No verified concrete public code/data/benchmark URL provided in code_or_data_urls.
- The candidate relies on 'claimed' code status without a verifiable source link.

### Rejected 18: 2605.06591v1

Candidate: Inference-time latency of Flow-Matching kernels in multi-step autoregressive particle simulations

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code/data/benchmark URL provided (the provided URL is a generic library, not the specific paper implementation or dataset).
- The paper ID 2605.06591v1 suggests a future date (May 2026), indicating this may be a synthetic or misdated entry, or the paper is not yet publicly available on arXiv (current date is 2024/2025).
- The provided code_or_data_urls points to a general-purpose repository (lucidrains/x-transformers) rather than the specific 'CaloBricks' dataset or 'BRICKS' implementation mentioned in the text.

### Rejected 19: 2605.06591v1

Candidate: Extension of 1D Markov Kernels to Full 3D Autoregressive Particle Rollouts

Reasons:

- Problem evidence span does not state a problem role.
- The provided code_or_data_urls (https://github.com/lucidrains/x-transformers) is a general-purpose library and not the specific code or data for the BRICKS model or CaloBricks dataset.
- No verified concrete public URL for the BRICKS model code or the 20M-event CaloBricks dataset was found in the provided text or metadata.
- The paper ID 2605.06591v1 suggests a future date (May 2026), which indicates this may be a synthetic or placeholder ID, and the paper status cannot be verified as 'active' in current repositories.

### Rejected 20: 2605.06660v1

Candidate: Vulnerability of Soft-Verifier VHG to Reward Hacking in General Mathematical Reasoning

Reasons:

- Problem evidence span does not state a problem role.
- No verified concrete public code, data, or benchmark URL found.
- Safety/legal risk cannot be sandboxed in the described experiment.
- No verified concrete public code, data, or benchmark URL provided in the candidate metadata or paper text.
- The candidate relies on 'claimed' code/data status without providing the required URLs to verify the feasibility of the auto-research experiment.


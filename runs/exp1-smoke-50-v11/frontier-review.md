# Frontier Review: v11 Top Candidate

Reviewed: 2026-05-07

## Verdict

Best candidate: `2605.05084v1`, `Order Matters: Improving Domain Adaptation by Reordering Data`.

The scanner's top-ranked opportunity is directionally correct: it found an explicit future-work intervention rather than a positive-result claim, and the experiment can be bounded to a compute-only benchmark comparison.

I would treat it as the best current candidate, but not as a fully cleared production lead. External venue status and code availability need a separate resolver before daily automation promotes it as a top pick.

## Candidate

Test whether replacing the paper's greedy ordering optimization with simulated annealing and tabu search improves robustness against local minima in the ORDERED domain-adaptation setup.

## Evidence Check

- Problem evidence: explicit future-work span in the paper proposing metaheuristics for the optimization procedure.
- Feasibility evidence: the paper reports simulations and image domain-shift benchmark experiments, giving an immediate evaluation path.
- Public reproducibility status: claimed, not confirmed. The scanner found benchmark evidence, but not a concrete repository URL.
- External status caveat: the OpenReview page for the matching ICLR 2026 submission lists the submission as withdrawn, while the arXiv record remains the scanner's source of truth.

Sources:

- arXiv: https://arxiv.org/abs/2605.05084v1
- OpenReview: https://openreview.net/forum?id=tktzkmqIfm
- Final scanner report: `runs/exp1-smoke-50-v11/report.md`

## 24-72 Hour Experiment

1. Reproduce or minimally reimplement the reported ORDERED greedy ordering procedure.
2. Run the same domain-shift benchmark protocol under a fixed compute budget.
3. Compare greedy ordering against simulated annealing and tabu search.
4. Measure target-domain accuracy, discrepancy-estimator variance, optimization runtime, and sensitivity to random seed.
5. Promote only if a metaheuristic improves accuracy or variance enough to justify extra optimization cost.

## Pipeline Implications

- Keep the stricter evidence-role split; it removed positive-result and generic-ablation false positives.
- Keep the human-cohort rejection gate; the rerun correctly rejected the co-mentorship cohort-expansion candidate.
- Add an external status resolver for OpenReview/conference pages before promoting a candidate.
- Add repository/data URL verification rather than allowing `claimed` benchmark evidence to score like `found` code.
- Treat the v11 smoke as a useful quality improvement but not an acceptance pass: it found 7 A-grade candidates, below the 8 A/B candidate threshold.

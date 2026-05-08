# Subagent Frontier Review Summary

Run root: `runs/agreement-200-dataset-grounded-20260508-170934`

## Review Completion

- Reviewed candidates: 191 / 191
- Reviewers: 5 isolated chunk reviewers
- Labels file: `frontier-pool/subagent_labels.json`
- Agreement metrics: `frontier-pool/subagent-agreement/agreement_metrics.json`

## Frontier Label Distribution

| Label | Count |
| --- | ---: |
| A | 58 |
| B | 62 |
| C | 6 |
| Reject | 65 |
| A+B | 120 |

## Cheap-vs-Frontier Comparison

| Arm | Reviewed candidates | Frontier A | Frontier B | Frontier A+B | Precision@20 | Precision@80/all | Recall@80/all |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| cheap-strict | 32 | 21 | 10 | 31 | 0.95 | 0.9688 | 0.2583 |
| cheap-recall | 80 | 36 | 32 | 68 | 0.85 | 0.85 | 0.5667 |
| heuristic | 80 | 2 | 20 | 22 | 0.15 | 0.275 | 0.1833 |

## Interpretation

- The strict cheap model is very high precision: 31 of 32 accepted candidates were frontier A/B, and 21 were A.
- The recall cheap model is the best operating point for discovery: it found 68 frontier A/B candidates among its top 80 reviewed candidates, with 36 A labels.
- The heuristic baseline is not competitive: only 22 A/B and 2 A labels among 80 candidates.
- The cheap LLM path is useful, but the strict verifier is too aggressive for discovery because it misses 89 of 120 frontier A/B candidates in the pooled review set.
- The next production approach should use recall-first cheap extraction, then a frontier/strict judge on the top recall pool rather than relying on strict cheap acceptance alone.

## Error Context

- cheap-strict run errors: 7 total; 4 JSON repairs, 2 retries, 1 timeout fallback.
- cheap-recall run errors: 3 total; 2 JSON repairs, 1 timeout fallback.
- heuristic run errors: 0.

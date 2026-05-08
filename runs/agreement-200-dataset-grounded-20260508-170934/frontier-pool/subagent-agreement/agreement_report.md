# Cheap Vs Frontier Agreement Report

Generated: 2026-05-08T17:40:47.910Z

- Total candidates: 191
- Labeled candidates: 191
- Frontier A: 58
- Frontier B: 62
- Frontier A/B: 120

| Arm | Candidates | Frontier A/B | Missed A/B | Precision@20 | Recall@50 |
| --- | ---: | ---: | ---: | ---: | ---: |
| heuristic | 80 | 22 | 98 | 0.15 | 0.1 |
| recall | 80 | 68 | 52 | 0.85 | 0.3583 |
| strict | 32 | 31 | 89 | 0.95 | 0.2583 |

## Decision Rules

- Cheap scanner is viable if recall@50 for frontier A/B is above 0.8 and precision@20 is above 0.4.
- Strict verifier is too aggressive if it misses more than 10-15% of frontier A candidates.
- Recall-first is not useful if it mostly increases rejects without improving frontier A/B recall.

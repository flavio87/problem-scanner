# problem-scanner

Experiment 1 implementation: arXiv latent problem recovery and cheap-vs-frontier agreement calibration.

## What It Does

This pipeline scans fresh arXiv papers (default: last 3 days across `cs.AI`, `cs.LG`, `stat.ML`, `q-bio.QM`, `q-bio.GN`, `q-bio.PE`, `eess`) and produces ranked, evidence-backed candidate research problems with:

- explicit evidence spans
- a falsifiable 24-72h experiment path
- hard rejection-gate reasoning
- rubric scores and grades
- run artifacts for review

The scanner workflow implements a V1/V2/V3 cascade:

1. V1 extraction (`heuristic` or Gemini broad scan)
2. V2 strict verification and rejection gates
3. V3 ranking using the 100-point rubric

The current experiment objective is not raw accepted-candidate count. The main question is:

> Can a cheap model approximate a frontier model's candidate-quality decisions well enough to be used as the daily scanner?

The 200-paper experiment should measure cheap-vs-frontier agreement:

- `precision@K`: how many cheap top-K candidates are frontier `A/B`
- `recall@K`: how many frontier `A/B` candidates the cheap arm surfaced
- false negatives: frontier `A/B` candidates missed by a cheap arm
- calibration: how often cheap high scores map to frontier `A/B`

## Setup

Use Bun only.

```bash
bun install
```

## Run

Default (auto mode):

```bash
bun run exp1
```

Force heuristic mode (no API key needed):

```bash
bun run exp1 --mode heuristic
```

Use Gemini for extraction/verification:

```bash
export GEMINI_API_KEY=your_key
bun run exp1 --mode llm --broadModel gemini-3-flash-preview --verifierModel gemini-3-flash-preview
```

Use OpenRouter for extraction/verification:

```bash
export OPENROUTER_API_KEY=your_key
bun run exp1 --mode llm --provider openrouter \
  --broadModel google/gemini-3-flash-preview \
  --verifierModel google/gemini-3-flash-preview
```

Optional cost estimation (set current provider prices yourself):

```bash
bun run exp1 --mode llm \
  --inputPricePerMTokenUSD 0.15 \
  --outputPricePerMTokenUSD 0.60
```

## Key Flags

- `--days` default `3`
- `--targetMin` default `80`
- `--targetMax` default `120`
- `--abstractTopK` default `40`
- `--candidatePerPaper` default `2`
- `--verifierTopK` default `30`
- `--provider` default `openrouter` when `OPENROUTER_API_KEY` is set, otherwise `google-gemini`
- `--arxivSource` default `auto`; use `recent-html` when the arXiv export API is rate-limited
- `--extractionProfile` default `strict`; use `recall` to build a high-recall candidate pool for agreement studies
- `--outputDir` default `runs/exp1-<timestamp>`

## 200-Paper Agreement Study

Run cheap arms over the same 200-paper target. Use diversified categories so the result is about model agreement, not a narrow `cs.LG` batch.

```bash
export OPENROUTER_API_KEY=your_key
export CATS=cs.AI,cs.LG,cs.MA,cs.CL,stat.ML,eess,q-bio.QM,q-bio.GN,q-bio.PE

bun run exp1 --mode llm --provider openrouter \
  --arxivSource recent-html \
  --categories "$CATS" \
  --perCategoryFetch 35 \
  --targetMin 200 \
  --targetMax 200 \
  --abstractTopK 120 \
  --candidatePerPaper 2 \
  --verifierTopK 80 \
  --maxCandidatesOutput 100 \
  --outputDir runs/agreement-200/cheap-strict

bun run exp1 --mode llm --provider openrouter \
  --arxivSource recent-html \
  --extractionProfile recall \
  --categories "$CATS" \
  --perCategoryFetch 35 \
  --targetMin 200 \
  --targetMax 200 \
  --abstractTopK 120 \
  --candidatePerPaper 4 \
  --verifierTopK 0 \
  --maxCandidatesOutput 200 \
  --outputDir runs/agreement-200/cheap-recall

bun run exp1 --mode heuristic \
  --arxivSource recent-html \
  --categories "$CATS" \
  --perCategoryFetch 35 \
  --targetMin 200 \
  --targetMax 200 \
  --abstractTopK 120 \
  --candidatePerPaper 4 \
  --verifierTopK 0 \
  --maxCandidatesOutput 200 \
  --outputDir runs/agreement-200/heuristic
```

Build a blinded frontier-review pool from the cheap arms:

```bash
bun run agreement \
  --outputDir runs/agreement-200/eval \
  --maxPerArm 80 \
  --arm strict:runs/agreement-200/cheap-strict/candidates.final.json:80 \
  --arm recall:runs/agreement-200/cheap-recall/candidates.raw.json:80 \
  --arm heuristic:runs/agreement-200/heuristic/candidates.raw.json:80
```

Send `runs/agreement-200/eval/frontier_pool.json` to the frontier judge using `runs/agreement-200/eval/frontier_prompt.md`. The frontier labels should use this schema:

```json
[
  {
    "candidate_id": "cand_...",
    "frontier_label": "A",
    "would_run_24_72h": true,
    "rationale": "Why the label was assigned.",
    "repair_needed": "Concrete one-step repair if label is B.",
    "fatal_blocker": "Fatal flaw if label is Reject."
  }
]
```

After frontier labels are saved, compute agreement metrics:

```bash
bun run agreement \
  --outputDir runs/agreement-200/eval \
  --frontierLabels runs/agreement-200/eval/frontier_labels.json \
  --k 10,20,50 \
  --maxPerArm 80 \
  --arm strict:runs/agreement-200/cheap-strict/candidates.final.json:80 \
  --arm recall:runs/agreement-200/cheap-recall/candidates.raw.json:80 \
  --arm heuristic:runs/agreement-200/heuristic/candidates.raw.json:80
```

Decision thresholds:

- cheap scanner is viable if `recall@50` for frontier `A/B` is above `0.8`
- cheap top queue is useful if `precision@20` is above `0.4`
- strict verification is too aggressive if it misses more than `10-15%` of frontier `A` candidates
- recall-first is useful only if it improves frontier `A/B` recall without burying all good candidates below review depth

Candidate extraction is dataset-grounded: candidates must include explicit problem evidence, public training/evaluation data or a reproducible artifact, a scientific hypothesis, baseline, intervention, metric, success threshold, failure condition, and first-24h experiment step.

## Outputs

Each run writes to `runs/exp1-<timestamp>/`:

- `config.json`
- `reproducibility.json`
- `papers.json`
- `shortlist.json`
- `paper_texts.json`
- `candidates.raw.json`
- `candidates.rejected.json`
- `candidates.final.json`
- `summary.json`
- `report.md`

The agreement evaluator writes:

- `frontier_pool.json`
- `candidate_sources.json`
- `frontier_label_template.json`
- `frontier_prompt.md`
- `agreement_metrics.json` when labels are supplied
- `agreement_report.md` when labels are supplied

## Quality Gates

```bash
bun test
bun run typecheck
```

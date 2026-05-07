# problem-scanner

Experiment 1 implementation: arXiv latent problem recovery smoke test.

## What It Does

This pipeline scans fresh arXiv papers (default: last 3 days across `cs.AI`, `cs.LG`, `stat.ML`, `q-bio.QM`, `q-bio.GN`, `q-bio.PE`, `eess`) and produces ranked, evidence-backed candidate research problems with:

- explicit evidence spans
- a falsifiable 24-72h experiment path
- hard rejection-gate reasoning
- rubric scores and grades
- run artifacts for review

The workflow implements a V1/V2/V3 cascade:

1. V1 extraction (`heuristic` or Gemini broad scan)
2. V2 strict verification and rejection gates
3. V3 ranking using the 100-point rubric

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
- `--outputDir` default `runs/exp1-<timestamp>`

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

## Quality Gates

```bash
bun test
bun run typecheck
```

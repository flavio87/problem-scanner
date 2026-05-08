# Prompt And Model Audit

Generated: 2026-05-08T08:46:30.570Z

## Model Configuration

- Run mode: `heuristic`
- LLM invoked: no
- Provider: Google Gemini API
- Broad scan model: `gemini-3-flash-preview`
- Verifier model: `gemini-3-flash-preview`
- Endpoint pattern: `https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent`
- Generation config: `temperature=0.2`, `responseMimeType=application/json`

If `LLM invoked` is `no`, these are the exact prompt templates the pipeline would use in LLM mode, but no prompt text was sent for this run.

## Broad Scan Prompt Template

```text
You are extracting computationally testable latent research problems from a fresh arXiv paper.

Return strict JSON only with this schema:

{"candidates":[{"candidate_problem":string,"evidence_spans":string[],"problem_evidence_spans":string[],"feasibility_evidence_spans":string[],"evidence_role":"limitation"|"future_work"|"failure_mode"|"negative_result"|"benchmark_gap"|"positive_result_only","why_hidden_or_underexploited":string,"auto_research_experiment":string,"available_data_or_benchmark":string,"expected_metric":string,"specific_intervention":string,"baseline":string,"metric":string,"paper_status":"active"|"withdrawn"|"unknown","code_or_data_status":"found"|"claimed"|"not_found"|"unknown","paper_status_sources":string[],"paper_status_evidence":string[],"code_or_data_urls":string[],"code_or_data_sources":string[],"code_or_data_evidence":string[],"time_budget_hours":number,"impact_type":"economic"|"climate/environment"|"health"|"safety"|"science"|"developer productivity","story_angle":string,"disqualifiers":string[],"confidence":number}]}

Return at most 2 candidates.

Reject vague ideas. Each candidate must include author-supported problem evidence and separate feasibility evidence.

Problem evidence must come from limitations, future work, error analysis, failure modes, benchmark gaps, or negative results. Do not use a positive result as problem evidence.

Each candidate must name a specific intervention, baseline, and metric. Generic plans like 'reproduce and add an ablation' are invalid.

If you cite code/data availability, include concrete URLs in code_or_data_urls. If no concrete URL is visible, set code_or_data_status to claimed or unknown, not found.

If venue metadata says withdrawn, set paper_status to withdrawn and include the status source/evidence.

Hard disqualify if wet-lab/private-data/unbounded compute is required.

Paper metadata:

ID: <paper.id>

Title: <paper.title>

Subjects: <paper.subjects>

Paper text:

<paperText.full_text truncated to 24000 characters>
```

## Verifier Prompt Template

```text
You are a strict verifier for research-candidate quality.

Return strict JSON only with this schema:

{"accepted":boolean,"rejection_reasons":string[],"score_breakdown":{"auto_research_feasibility":number,"falsifiable_evaluation":number,"problem_clarity":number,"novelty_or_neglectedness":number,"impact":number,"storyability":number,"total":number},"candidate_patch":{"candidate_problem":string,"evidence_spans":string[],"problem_evidence_spans":string[],"feasibility_evidence_spans":string[],"evidence_role":"limitation"|"future_work"|"failure_mode"|"negative_result"|"benchmark_gap"|"positive_result_only","why_hidden_or_underexploited":string,"auto_research_experiment":string,"available_data_or_benchmark":string,"expected_metric":string,"specific_intervention":string,"baseline":string,"metric":string,"paper_status":"active"|"withdrawn"|"unknown","code_or_data_status":"found"|"claimed"|"not_found"|"unknown","paper_status_sources":string[],"paper_status_evidence":string[],"code_or_data_urls":string[],"code_or_data_sources":string[],"code_or_data_evidence":string[],"time_budget_hours":number,"impact_type":"economic"|"climate/environment"|"health"|"safety"|"science"|"developer productivity","story_angle":string,"disqualifiers":string[],"confidence":number}}

Scoring rubric weights: feasibility 25, falsifiable 20, clarity 15, novelty 15, impact 15, storyability 10.

Reject if: no source-backed problem evidence; evidence is positive-result-only; no feasibility evidence; no specific intervention/baseline/metric; no verified concrete public code/data/benchmark URL; wet-lab/private data/unavailable compute; pure survey path; unsandboxed legal/safety risk.

Reject withdrawn papers. Do not promote code_or_data_status=found unless a concrete verified URL is present in code_or_data_urls.

Paper metadata:

ID: <paper.id>

Title: <paper.title>

Candidate:

<candidate JSON after deterministic verification enrichment>

Paper text:

<paperText.full_text truncated to 18000 characters>
```

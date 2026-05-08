# Experiment 1 Comprehensive Smoke Report

Generated: 2026-05-08T08:53:34.333Z
Output directory: `runs/exp1-smoke-50-v15`
Mode: `heuristic`

## Run Summary

- Papers fetched from arXiv API: 50
- Papers inside 3-day window: 50
- Abstract-pass shortlist size: 30
- Raw candidates extracted: 48
- Accepted candidates in report: 10
- Rejected candidates: 38
- Top-20 evidence precision: 96%
- Top-20 problem-evidence precision: 100%
- Estimated cost: $0
- Estimated cost per scanned paper: $0

## LLM And Prompt Audit

- Run mode: `heuristic`
- LLM invoked: no
- Provider: google-gemini
- Broad scan model: `gemini-3-flash-preview`
- Verifier model: `gemini-3-flash-preview`
- Prompt audit file: `prompts.md`
- Note: no LLM prompts were sent in this run because mode was heuristic or no Gemini API key was configured.

## Acceptance Checks

- PASS: at_least_3_a_grade
- PASS: at_least_8_a_or_b_grade
- PASS: top_20_evidence_precision_gt_80pct
- PASS: top_20_problem_evidence_precision_gt_80pct
- PASS: at_least_1_under_72h_public_benchmark
- PASS: low_cost_per_paper
- Overall: PASS

## Grade Counts

- A: 10
- B: 0
- C: 0

## Candidate Index

| Rank | Grade | Paper | Score | Impact | Time Budget | Candidate |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | A | [2605.06576v1](https://arxiv.org/abs/2605.06576v1) | 90 | safety | 48h | Test whether Evaluate methods that explicitly optimize for the expected deployment stressor, such as missing links, temporal drift, rare ... |
| 2 | A | [2605.06576v1](https://arxiv.org/abs/2605.06576v1) | 90 | safety | 48h | Test whether Stress-test and mitigate the interaction between the stressed graph factor and the underlying representation design in the O... |
| 3 | A | [2605.06628v1](https://arxiv.org/abs/2605.06628v1) | 86 | developer productivity | 48h | Test whether Evaluate variable-rate training and joint optimization with downstream ML tasks to better align compression with inference a... |
| 4 | A | [2605.06523v1](https://arxiv.org/abs/2605.06523v1) | 86 | safety | 48h | Test whether Stress-test and mitigate the test set in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup addr... |
| 5 | A | [2605.06523v1](https://arxiv.org/abs/2605.06523v1) | 86 | safety | 48h | Test whether Stress-test and mitigate more parameters in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup a... |
| 6 | A | [2605.06627v1](https://arxiv.org/abs/2605.06627v1) | 84 | climate/environment | 48h | Test whether Evaluate extending the methodology to multi-instrument repertoires, developing more robust quality assessment models and inc... |
| 7 | A | [2605.06557v1](https://arxiv.org/abs/2605.06557v1) | 84 | climate/environment | 48h | Test whether Evaluate the same evaluation protocol to controlled variants with these factors while preserving interpretable process diagn... |
| 8 | A | [2605.06592v1](https://arxiv.org/abs/2605.06592v1) | 82 | safety | 48h | Test whether Stress-test and mitigate under-represented domains—the text-side branch can introduce noise, and the image-only variant of D... |
| 9 | A | [2605.06646v1](https://arxiv.org/abs/2605.06646v1) | 82 | science | 48h | Test whether Stress-test and mitigate a recent extension to bounded regression in the Inductive Venn-Abers and related regressors setup a... |
| 10 | A | [2605.06654v1](https://arxiv.org/abs/2605.06654v1) | 82 | science | 48h | Test whether Stress-test and mitigate approximations in the Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretr... |

## Detailed Candidates

### 1. A-grade candidate: 2605.06576v1

ArXiv: https://arxiv.org/abs/2605.06576v1
Score: 90/100
Confidence: 0.58
Impact type: safety
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: future_work
Paper status: active
Code/data status: found
Verified code/data URLs: 1

Candidate problem:

Test whether Evaluate methods that explicitly optimize for the expected deployment stressor, such as missing links, temporal drift, rare classes, or structurally disadvantaged nodes in the On the Safety of Graph Representation Learning setup addresses a stated future work in On the Safety of Graph Representation Learning.

Problem evidence spans:

- A next step is to develop methods that explicitly optimize for the expected deployment stressor, such as missing links, temporal drift, rare classes, or structurally disadvantaged nodes.

Feasibility evidence spans:

- We introduce GRL-Safety, a multi-axis safety evaluation benchmark for GRL.
- GRL-Safety evaluates twelve representative methods, spanning topology-only embedding methods, supervised GNNs, self-supervised graph models, and GFMs, on twenty-five graph datasets under standardized evaluation conditions while preserving method-native adaptation.
- The benchmark, evaluation protocols, and code are available at: https://github.com/GXG-CS/GRL-Safety.
- GRL and GFM benchmarks have made substantial progress in measuring clean-setting performance, transfer, adaptation, and task coverage across datasets, tasks, and domains [ 20 , 61 , 6 , 64 ] .

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/GXG-CS/GRL-Safety

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/GXG-CS/GRL-Safety

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from On the Safety of Graph Representation Learning. Then apply this intervention: Evaluate methods that explicitly optimize for the expected deployment stressor, such as missing links, temporal drift, rare classes, or structurally disadvantaged nodes in the On the Safety of Graph Representation Learning setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Safety benchmark success/failure rate and false-positive/false-negative trade-offs.

Specific intervention:

Evaluate methods that explicitly optimize for the expected deployment stressor, such as missing links, temporal drift, rare classes, or structurally disadvantaged nodes in the On the Safety of Graph Representation Learning setup

Baseline:

The reported baseline/protocol from On the Safety of Graph Representation Learning.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 16/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 12/15
- Storyability: 7/10

### 2. A-grade candidate: 2605.06576v1

ArXiv: https://arxiv.org/abs/2605.06576v1
Score: 90/100
Confidence: 0.58
Impact type: safety
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: failure_mode
Paper status: active
Code/data status: found
Verified code/data URLs: 1

Candidate problem:

Test whether Stress-test and mitigate the interaction between the stressed graph factor and the underlying representation design in the On the Safety of Graph Representation Learning setup addresses a stated failure mode in On the Safety of Graph Representation Learning.

Problem evidence spans:

- Across corruption, OOD generalization, and fairness, method rankings and failure modes change with the interaction between the stressed graph factor and the underlying representation design.

Feasibility evidence spans:

- We introduce GRL-Safety, a multi-axis safety evaluation benchmark for GRL.
- GRL-Safety evaluates twelve representative methods, spanning topology-only embedding methods, supervised GNNs, self-supervised graph models, and GFMs, on twenty-five graph datasets under standardized evaluation conditions while preserving method-native adaptation.
- The benchmark, evaluation protocols, and code are available at: https://github.com/GXG-CS/GRL-Safety.
- GRL and GFM benchmarks have made substantial progress in measuring clean-setting performance, transfer, adaptation, and task coverage across datasets, tasks, and domains [ 20 , 61 , 6 , 64 ] .

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/GXG-CS/GRL-Safety

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/GXG-CS/GRL-Safety

Why hidden or underexploited:

The candidate is grounded in an explicit failure mode span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from On the Safety of Graph Representation Learning. Then apply this intervention: Stress-test and mitigate the interaction between the stressed graph factor and the underlying representation design in the On the Safety of Graph Representation Learning setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Safety benchmark success/failure rate and false-positive/false-negative trade-offs.

Specific intervention:

Stress-test and mitigate the interaction between the stressed graph factor and the underlying representation design in the On the Safety of Graph Representation Learning setup

Baseline:

The reported baseline/protocol from On the Safety of Graph Representation Learning.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 16/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 12/15
- Storyability: 7/10

### 3. A-grade candidate: 2605.06628v1

ArXiv: https://arxiv.org/abs/2605.06628v1
Score: 86/100
Confidence: 0.58
Impact type: developer productivity
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: future_work
Paper status: active
Code/data status: found
Verified code/data URLs: 3

Candidate problem:

Test whether Evaluate variable-rate training and joint optimization with downstream ML tasks to better align compression with inference accuracy in the LiVeAction: a Lightweight, Versatile, and Asymmetric Neural Codec Design for Real-time Operation setup addresses a stated future work in LiVeAction: a Lightweight, Versatile, and Asymmetric Neural Codec Design for Real-time Operation.

Problem evidence spans:

- Future work will explore variable-rate training and joint optimization with downstream ML tasks to better align compression with inference accuracy.

Feasibility evidence spans:

- We release our code, experiments, and python library at https://github.com/UT-SysML/liveaction .
- Figure 1: Rate-distortion-complexity trade-off for RGB images measured on the kodak dataset.
- In contrast, LiVeAction shows that a simple mean-squared-error (MSE) based rate–distortion objective suffices across modalities, eliminating the need for perceptual losses.
- Figure 4 shows downstream machine-perception quality for RGB images via ImageNet classification accuracy on decoded outputs.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/UT-SysML/liveaction
- https://huggingface.co/timm/eva_giant_patch14_224.clip_ft_in1k
- https://www.image-net.org/

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/UT-SysML/liveaction
- Verified reachable public code/data/benchmark URL: https://huggingface.co/timm/eva_giant_patch14_224.clip_ft_in1k
- Verified reachable public code/data/benchmark URL: https://www.image-net.org/

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from LiVeAction: a Lightweight, Versatile, and Asymmetric Neural Codec Design for Real-time Operation. Then apply this intervention: Evaluate variable-rate training and joint optimization with downstream ML tasks to better align compression with inference accuracy in the LiVeAction: a Lightweight, Versatile, and Asymmetric Neural Codec Design for Real-time Operation setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Primary benchmark accuracy/error improvement against baseline.

Specific intervention:

Evaluate variable-rate training and joint optimization with downstream ML tasks to better align compression with inference accuracy in the LiVeAction: a Lightweight, Versatile, and Asymmetric Neural Codec Design for Real-time Operation setup

Baseline:

The reported baseline/protocol from LiVeAction: a Lightweight, Versatile, and Asymmetric Neural Codec Design for Real-time Operation.

Metric:

accuracy

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 20/20
- Problem clarity: 11/15
- Novelty or neglectedness: 15/15
- Impact: 8/15
- Storyability: 7/10

### 4. A-grade candidate: 2605.06523v1

ArXiv: https://arxiv.org/abs/2605.06523v1
Score: 86/100
Confidence: 0.58
Impact type: safety
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: failure_mode
Paper status: active
Code/data status: found
Verified code/data URLs: 1

Candidate problem:

Test whether Stress-test and mitigate the test set in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup addresses a stated failure mode in On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR.

Problem evidence spans:

- This indicates that while non-Rank-1 components significantly boost the reward on the training set, they fail to translate into generalized performance on the test set.

Feasibility evidence spans:

- Predicated on this observation, we employed Periodic Rank-1 Substitution and identified a counterintuitive phenomenon: RLVR may exhibit implicit reward overfitting to the training dataset.
- By periodically eliminating these components, we find that on a significant portion of datasets, the model’s performance on the test set remains comparable, even though its training reward is lower than that of Full RL Fine-tuning.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://huggingface.co/Jackrong/Llama3.1-8B-Thinking-R1

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://huggingface.co/Jackrong/Llama3.1-8B-Thinking-R1

Why hidden or underexploited:

The candidate is grounded in an explicit failure mode span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR. Then apply this intervention: Stress-test and mitigate the test set in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate the test set in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup

Baseline:

The reported baseline/protocol from On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 12/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 12/15
- Storyability: 7/10

### 5. A-grade candidate: 2605.06523v1

ArXiv: https://arxiv.org/abs/2605.06523v1
Score: 86/100
Confidence: 0.58
Impact type: safety
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: limitation
Paper status: active
Code/data status: found
Verified code/data URLs: 1

Candidate problem:

Test whether Stress-test and mitigate more parameters in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup addresses a stated limitation in On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR.

Problem evidence spans:

- The limitations of our work are: due to limited computing resources, we have no opportunity to observe the behavior of models with more parameters.

Feasibility evidence spans:

- Predicated on this observation, we employed Periodic Rank-1 Substitution and identified a counterintuitive phenomenon: RLVR may exhibit implicit reward overfitting to the training dataset.
- By periodically eliminating these components, we find that on a significant portion of datasets, the model’s performance on the test set remains comparable, even though its training reward is lower than that of Full RL Fine-tuning.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://huggingface.co/Jackrong/Llama3.1-8B-Thinking-R1

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://huggingface.co/Jackrong/Llama3.1-8B-Thinking-R1

Why hidden or underexploited:

The candidate is grounded in an explicit limitation span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR. Then apply this intervention: Stress-test and mitigate more parameters in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate more parameters in the On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR setup

Baseline:

The reported baseline/protocol from On the Implicit Reward Overfitting and the Low-rank Dynamics in RLVR.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 12/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 12/15
- Storyability: 7/10

### 6. A-grade candidate: 2605.06627v1

ArXiv: https://arxiv.org/abs/2605.06627v1
Score: 84/100
Confidence: 0.58
Impact type: climate/environment
Time budget: 48 hours
Evidence precision: 80%
Problem evidence precision: 100%
Feasibility evidence precision: 75%
Evidence role: future_work
Paper status: active
Code/data status: found
Verified code/data URLs: 8

Candidate problem:

Test whether Evaluate extending the methodology to multi-instrument repertoires, developing more robust quality assessment models and incorporating more granular score and performance annotations in the PianoCoRe: Combined and Refined Piano MIDI Dataset setup addresses a stated future work in PianoCoRe: Combined and Refined Piano MIDI Dataset.

Problem evidence spans:

- Future directions include extending the methodology to multi-instrument repertoires, developing more robust quality assessment models and incorporating more granular score and performance annotations.

Feasibility evidence spans:

- Project repository: https://github.com/ilya16/PianoCoRe Symbolic music datasets with matched scores and performances are essential for many music information retrieval (MIR) tasks.
- This work presents PianoCoRe, a large-scale piano MIDI dataset that unifies and refines major open-source piano corpora.
- The dataset contains 250,046 performances of 5,625 pieces written by 483 composers, totaling 21,763 h of performed music.
- In addition to the dataset, the contributions are: (1) a MIDI quality classifier for detecting corrupted and score-like transcriptions and (2) RAScoP, an alignment refinement pipeline that cleans temporal alignment errors and interpolates missing notes.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/CPJKU/asap-dataset
- https://github.com/bytedance/GiantMIDI-Piano
- https://github.com/ilya16/PianoCoRe
- https://github.com/ilya16/SyMuPe
- https://github.com/tangjjbetsy/ATEPP
- https://huggingface.co/datasets/SyMuPe/PERiScoPe
- https://huggingface.co/datasets/SyMuPe/PianoCoRe
- https://huggingface.co/datasets/loubb/aria-midi

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/CPJKU/asap-dataset
- Verified reachable public code/data/benchmark URL: https://github.com/bytedance/GiantMIDI-Piano
- Verified reachable public code/data/benchmark URL: https://github.com/ilya16/PianoCoRe
- Verified reachable public code/data/benchmark URL: https://github.com/ilya16/SyMuPe
- Verified reachable public code/data/benchmark URL: https://github.com/tangjjbetsy/ATEPP
- Verified reachable public code/data/benchmark URL: https://huggingface.co/datasets/SyMuPe/PERiScoPe
- Verified reachable public code/data/benchmark URL: https://huggingface.co/datasets/SyMuPe/PianoCoRe
- Verified reachable public code/data/benchmark URL: https://huggingface.co/datasets/loubb/aria-midi

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from PianoCoRe: Combined and Refined Piano MIDI Dataset. Then apply this intervention: Evaluate extending the methodology to multi-instrument repertoires, developing more robust quality assessment models and incorporating more granular score and performance annotations in the PianoCoRe: Combined and Refined Piano MIDI Dataset setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Evaluate extending the methodology to multi-instrument repertoires, developing more robust quality assessment models and incorporating more granular score and performance annotations in the PianoCoRe: Combined and Refined Piano MIDI Dataset setup

Baseline:

The reported baseline/protocol from PianoCoRe: Combined and Refined Piano MIDI Dataset.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 12/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 10/15
- Storyability: 7/10

### 7. A-grade candidate: 2605.06557v1

ArXiv: https://arxiv.org/abs/2605.06557v1
Score: 84/100
Confidence: 0.58
Impact type: climate/environment
Time budget: 48 hours
Evidence precision: 80%
Problem evidence precision: 100%
Feasibility evidence precision: 75%
Evidence role: future_work
Paper status: active
Code/data status: found
Verified code/data URLs: 1

Candidate problem:

Test whether Evaluate the same evaluation protocol to controlled variants with these factors while preserving interpretable process diagnostics in the Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning setup addresses a stated future work in Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning.

Problem evidence spans:

- Future work could extend the same evaluation protocol to controlled variants with these factors while preserving interpretable process diagnostics.

Feasibility evidence spans:

- Submitted and under review Cooperative multi-agent reinforcement learning (MARL) benchmarks commonly emphasize aggregate outcomes such as return, success rate, or completion time.
- TITLE: Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning ABSTRACT: Cooperative multi-agent reinforcement learning (MARL) benchmarks commonly emphasize aggregate outcomes such as return, success rate, or completion time.
- This limitation is especially important for benchmarks intended to evaluate scaling behavior, where increasing the number of agents, tasks, or available choices may change not only task difficulty but also the structure of coordination itself.
- This motivates a coordination-aware evaluation perspective, in which cooperative MARL benchmarks report process-level diagnostics that characterize how agents coordinate, in addition to their achieved return.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/mariacardei/coordination_aware_MARL

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/mariacardei/coordination_aware_MARL

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning. Then apply this intervention: Evaluate the same evaluation protocol to controlled variants with these factors while preserving interpretable process diagnostics in the Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Evaluate the same evaluation protocol to controlled variants with these factors while preserving interpretable process diagnostics in the Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning setup

Baseline:

The reported baseline/protocol from Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 12/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 10/15
- Storyability: 7/10

### 8. A-grade candidate: 2605.06592v1

ArXiv: https://arxiv.org/abs/2605.06592v1
Score: 82/100
Confidence: 0.58
Impact type: safety
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: failure_mode
Paper status: active
Code/data status: found
Verified code/data URLs: 2

Candidate problem:

Test whether Stress-test and mitigate under-represented domains—the text-side branch can introduce noise, and the image-only variant of DinoRankCLIP (fourth row of Table ˜ 3 (b)) is preferable; (iii) in the DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Lang... addresses a stated failure mode in DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Language Pretraining with High-Order Ranking Consistency.

Problem evidence spans:

- Three failure modes: (i) on captions describing globally salient categories without local descriptors, the conflict gate closes everywhere and DinoRankCLIP behaves indistinguishably from RankCLIP at the same order; (ii) when the teacher’s text-aligned projection is misaligned with the contrastive text encoder—for under-represented domains—the text-side branch can introduce noise, and the image-only variant of DinoRankCLIP (fourth row of Table ˜ 3 (b)) is preferable; (iii) ...

Feasibility evidence spans:

- Complementarily, we introduce a high-order Plackett-Luce ranking model in which the per-position utility is augmented with attention-parameterised pairwise and tuple-wise transition terms; the family contains CLIP and RANKCLIP as nested zero-order and first-order special cases, and the optimal order on every benchmark is $R^*=3$.
- The full empirical study -- order sweep, Fine-grained Probe on five datasets, four-node Modality-Gap analysis, six-variant Fusion ablation -- fits in 72 hours on a single eight-GPU H100 node and trains entirely on Conceptual Captions 3M.
- Complementarily, we introduce a high-order Plackett–Luce ranking model in which the per-position utility is augmented with attention-parameterised pairwise and tuple-wise transition terms; the family contains CLIP and RankCLIP as nested zero-order and first-order special cases, and the optimal order on every benchmark is R ∗ = 3 R^{*}=3 .
- The full empirical study—order sweep, Fine-grained Probe on five datasets, four-node Modality-Gap analysis, six-variant Fusion ablation—fits in 72 hours on a single eight-GPU H100 node and trains entirely on Conceptual Captions 3M.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://www.cs.toronto.edu/~kriz/cifar.html
- https://www.image-net.org/

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://www.cs.toronto.edu/~kriz/cifar.html
- Verified reachable public code/data/benchmark URL: https://www.image-net.org/

Why hidden or underexploited:

The candidate is grounded in an explicit failure mode span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Language Pretraining with High-Order Ranking Consistency. Then apply this intervention: Stress-test and mitigate under-represented domains—the text-side branch can introduce noise, and the image-only variant of DinoRankCLIP (fourth row of Table ˜ 3 (b)) is preferable; (iii) in the DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Lang.... Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate under-represented domains—the text-side branch can introduce noise, and the image-only variant of DinoRankCLIP (fourth row of Table ˜ 3 (b)) is preferable; (iii) in the DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Lang...

Baseline:

The reported baseline/protocol from DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Language Pretraining with High-Order Ranking Consistency.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 12/20
- Problem clarity: 11/15
- Novelty or neglectedness: 15/15
- Impact: 12/15
- Storyability: 7/10

### 9. A-grade candidate: 2605.06646v1

ArXiv: https://arxiv.org/abs/2605.06646v1
Score: 82/100
Confidence: 0.58
Impact type: science
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: limitation
Paper status: active
Code/data status: found
Verified code/data URLs: 2

Candidate problem:

Test whether Stress-test and mitigate a recent extension to bounded regression in the Inductive Venn-Abers and related regressors setup addresses a stated limitation in Inductive Venn-Abers and related regressors.

Problem evidence spans:

- Inductive Venn–Abers and related regressors Ivan Petej and Vladimir Vovk Abstract Venn–Abers predictors are probabilistic predictors that enjoy appealing properties of validity, but their major limitation is that they are applicable only to the case of binary classification, with a recent extension to bounded regression.

Feasibility evidence spans:

- The improvement is not as significant as we had hoped and disappears for smaller datasets.
- Computational experiments show that this leads to a limited improvement in the performance of standard point regressors on large datasets.
- Table 12: Bounded Logistic dataset ( σ = 1 \sigma=1 ) none CVAR1 CVAR10 Elastic Net 2.551 ± 0.021 2.551\pm 0.021 1.506 ± 0.012 \textbf{1.506}\pm 0.012 1.508 ± 0.012 1.508\pm 0.012 Gradient Boosting 1.532 ± 0.018 1.532\pm 0.018 1.323 ± 0.009 \textbf{1.323}\pm 0.009 1.326 ± 0.009 1.326\pm 0.009 Lasso 2.830 ± 0.024 2.830\pm 0.024 2.201 ± 0.025 \textbf{2.201}\pm 0.025 2.203 ± 0.025 2.203\pm 0.025 Linear Regression 1.596 ± 0.021 1.596\pm 0.021 1.031 ± 0.002 \textbf{1.031}\pm 0....
- For these smaller datasets the results are mixed, as we said in the main paper.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/ip200/ivar-experiments
- https://github.com/ip200/venn-abers

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/ip200/ivar-experiments
- Verified reachable public code/data/benchmark URL: https://github.com/ip200/venn-abers

Why hidden or underexploited:

The candidate is grounded in an explicit limitation span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Inductive Venn-Abers and related regressors. Then apply this intervention: Stress-test and mitigate a recent extension to bounded regression in the Inductive Venn-Abers and related regressors setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate a recent extension to bounded regression in the Inductive Venn-Abers and related regressors setup

Baseline:

The reported baseline/protocol from Inductive Venn-Abers and related regressors.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 12/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 8/15
- Storyability: 7/10

### 10. A-grade candidate: 2605.06654v1

ArXiv: https://arxiv.org/abs/2605.06654v1
Score: 82/100
Confidence: 0.58
Impact type: science
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: limitation
Paper status: active
Code/data status: found
Verified code/data URLs: 9

Candidate problem:

Test whether Stress-test and mitigate approximations in the Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less setup addresses a stated limitation in Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less.

Problem evidence spans:

- The major limitation of the work is that the experiments are mainly conducted on small models due to the requirement of pretraining and limited computational resources, and the theory is obtained under approximations.

Feasibility evidence spans:

- Figure 1: The Pareto frontier of different optimizers and LoRA finetuning Llama-2-7B with the MetaMathQA dataset for 1 1 epoch.
- APPENDIX: The Alpaca dataset [Taori et al. , 2023 ] ( https://huggingface.co/datasets/tatsu-lab/alpaca ) is released under the cc-by-nc-4.0 license.
- The MetaMathQA [Yu et al. , 2023 ] ( https://huggingface.co/datasets/meta-math/MetaMathQA ) and Magicoder [Wei et al. , 2023 ] ( https://huggingface.co/datasets/ise-uiuc/Magicoder-OSS-Instruct-75K ) datasets and the NanoGPT [Karpathy, 2022 ] ( https://github.com/karpathy/nanogpt ) and Dion [Ahn et al. , 2025b , a ] ( https://github.com/microsoft/dion ) codebases are under the MIT license.
- The LlamaFactory codebase [Zheng et al. , 2024 ] ( https://github.com/hiyouga/LlamaFactory ) is under the Apache-2.0 license.

Paper status evidence:

- None.

Paper status sources:

- None.

Verified code/data URLs:

- https://github.com/hiyouga/LlamaFactory
- https://github.com/karpathy/nanoGPT
- https://github.com/karpathy/nanogpt
- https://github.com/microsoft/dion
- https://github.com/tatsu-lab/stanford_alpaca
- https://huggingface.co/datasets/ise-uiuc/Magicoder-OSS-Instruct-75K
- https://huggingface.co/datasets/meta-math/MetaMathQA
- https://huggingface.co/datasets/tatsu-lab/alpaca
- https://huggingface.co/meta-llama/Llama-2-7b-hf

Code/data verification evidence:

- Verified reachable public code/data/benchmark URL: https://github.com/hiyouga/LlamaFactory
- Verified reachable public code/data/benchmark URL: https://github.com/karpathy/nanoGPT
- Verified reachable public code/data/benchmark URL: https://github.com/karpathy/nanogpt
- Verified reachable public code/data/benchmark URL: https://github.com/microsoft/dion
- Verified reachable public code/data/benchmark URL: https://github.com/tatsu-lab/stanford_alpaca
- Verified reachable public code/data/benchmark URL: https://huggingface.co/datasets/ise-uiuc/Magicoder-OSS-Instruct-75K
- Verified reachable public code/data/benchmark URL: https://huggingface.co/datasets/meta-math/MetaMathQA
- Verified reachable public code/data/benchmark URL: https://huggingface.co/datasets/tatsu-lab/alpaca
- Verified reachable public code/data/benchmark URL: https://huggingface.co/meta-llama/Llama-2-7b-hf

Why hidden or underexploited:

The candidate is grounded in an explicit limitation span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less. Then apply this intervention: Stress-test and mitigate approximations in the Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public benchmark related to the paper's main task; start with reproduction from abstract and references.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate approximations in the Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less setup

Baseline:

The reported baseline/protocol from Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less.

Metric:

pre-registered benchmark delta

Story angle:

A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.

Disqualifiers:

- None.

Score breakdown:

- Auto-research feasibility: 25/25
- Falsifiable evaluation: 12/20
- Problem clarity: 15/15
- Novelty or neglectedness: 15/15
- Impact: 8/15
- Storyability: 7/10

## Rejection Audit

### Rejected 1: 2605.06612v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Online Bayesian Calibration under Gradual and Abrupt System Changes: Future work should study adaptive restart thresholds, scalable sparse-GP or neural discrepancy models, and validation on larger r... addresses a stated future work in Online Bayesian Calibration under Gradual and Abrupt System Changes.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 2: 2605.06612v1

Candidate: Test whether Evaluate extending BRPC to high-dimensional digital twin systems and developing restart mechanisms with stronger false-alarm control and more adaptive memory-reset strategies in the Online Bayesian Calibration under Gradual and Abrupt System Changes setup addresses a stated future work in Online Bayesian Calibration under Gradual and Abrupt System Changes.

Reasons:

- No verified concrete public code, data, or benchmark URL found.

### Rejected 3: 2605.06644v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Edge-specific signal propagation on mature chromophore-region 3D mechanism graphs for fluorescent protein quantum-yield prediction: Future work could replace or augment this step with more explicit ... addresses a stated future work in Edge-specific signal propagation on mature chromophore-region 3D mechanism graphs for fluorescent protein quantum-yield prediction.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 4: 2605.06592v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Language Pretraining with High-Order Ranking Consistency: This is a substantial limitation. addresses a stated limitation in DINORANKCLIP: DINOv3 Distillation and Injection for Vision-Language Pretraining with High-Order Ranking Consistency.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 5: 2605.06652v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in When No Benchmark Exists: Validating Comparative LLM Safety Scoring Without Ground-Truth Labels: A natural next step is to stress-test the chain itself (by instantiating it with deliberately degener... addresses a stated future work in When No Benchmark Exists: Validating Comparative LLM Safety Scoring Without Ground-Truth Labels.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 6: 2605.06588v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Towards Metric-Faithful Neural Graph Matching: A useful future direction is to connect encoder geometry to per-step guarantees for such decoders or to partial-alignment objectives arising along the ... addresses a stated future work in Towards Metric-Faithful Neural Graph Matching.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 7: 2605.06588v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Towards Metric-Faithful Neural Graph Matching: Future work should therefore expand the design space of bi-Lipschitz graph encoders, improve their computational efficiency, and determine which geomet... addresses a stated future work in Towards Metric-Faithful Neural Graph Matching.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 8: 2605.06575v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Directional Consistency as a Complementary Optimization Signal: The GONO Framework: This observation reveals that existing optimizers such as Adam, SGD, and RMSprop lack explicit mechanisms to explo... addresses a stated failure mode in Directional Consistency as a Complementary Optimization Signal: The GONO Framework.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 9: 2605.06575v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Directional Consistency as a Complementary Optimization Signal: The GONO Framework: In the course of this work, we made a striking empirical observation: an optimizer can exhibit near-perfect direct... addresses a stated failure mode in Directional Consistency as a Complementary Optimization Signal: The GONO Framework.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 10: 2605.06667v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in ActCam: Zero-Shot Joint Camera and 3D Motion Control for Video Generation: However, we argue that the necessity of using a specific model for generating videos with acting and camera control is a fu... addresses a stated limitation in ActCam: Zero-Shot Joint Camera and 3D Motion Control for Video Generation.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 11: 2605.06667v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in ActCam: Zero-Shot Joint Camera and 3D Motion Control for Video Generation: We also provided ablations and failure cases to clarify the contribution of each design choice and the remaining limitations. addresses a stated limitation in ActCam: Zero-Shot Joint Camera and 3D Motion Control for Video Generation.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 12: 2605.06643v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Are We Making Progress in Multimodal Domain Generalization? A Comprehensive Benchmark Study: Additionally, our robustness evaluation is limited to two representative perturbations; extending this to... addresses a stated future work in Are We Making Progress in Multimodal Domain Generalization? A Comprehensive Benchmark Study.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 13: 2605.06643v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Are We Making Progress in Multimodal Domain Generalization? A Comprehensive Benchmark Study: Future work must focus on discovering novel training paradigms or architectural innovations that genuinel... addresses a stated future work in Are We Making Progress in Multimodal Domain Generalization? A Comprehensive Benchmark Study.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 14: 2605.06596v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in FedAttr: Towards Privacy-preserving Client-Level Attribution in Federated LLM Fine-tuning: In settings where the corpus owner is unavailable or unwilling to participate, a delegated or threshold-bas... addresses a stated future work in FedAttr: Towards Privacy-preserving Client-Level Attribution in Federated LLM Fine-tuning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 15: 2605.06585v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Distributionally-Robust Learning to Optimize: We prove high-probability bounds showing that the true risk of the learned algorithm is at most the in-sample L2O optimum plus a slack that shrinks with... addresses a stated negative result in Distributionally-Robust Learning to Optimize.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 16: 2605.06585v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Distributionally-Robust Learning to Optimize: However, worst-case analysis is inherently pessimistic: it guards against pathological instances that rarely arise in practice, yielding conservative al... addresses a stated negative result in Distributionally-Robust Learning to Optimize.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 17: 2605.06647v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Superintelligent Retrieval Agent: The Next Frontier of Information Retrieval: We have not evaluated settings where the corpus is far outside the LLM’s pretraining distribution; in such domains, corp... addresses a stated benchmark gap in Superintelligent Retrieval Agent: The Next Frontier of Information Retrieval.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 18: 2605.06647v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Superintelligent Retrieval Agent: The Next Frontier of Information Retrieval: The limitations of dense retrieval are not merely engineering inconveniences; they expose a deeper mismatch between sing... addresses a stated limitation in Superintelligent Retrieval Agent: The Next Frontier of Information Retrieval.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 19: 2605.06632v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Crafting Reversible SFT Behaviors in Large Language Models: The most immediate open problem is extending reversal to discrete input tokens rather than continuous soft prompts, which would make the b... addresses a stated future work in Crafting Reversible SFT Behaviors in Large Language Models.

Reasons:

- No separate feasibility evidence span for public data, code, benchmark, or metric.
- Specific intervention is generic rather than operational.

### Rejected 20: 2605.06632v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Crafting Reversible SFT Behaviors in Large Language Models: Two limitations bound the current study. addresses a stated limitation in Crafting Reversible SFT Behaviors in Large Language Models.

Reasons:

- No separate feasibility evidence span for public data, code, benchmark, or metric.
- Specific intervention is generic rather than operational.

### Rejected 21: 2605.06627v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in PianoCoRe: Combined and Refined Piano MIDI Dataset: A subjective listening test of popular models trained on the subsets of PianoCoRe dataset would be a valuable next step to confirm that objective ... addresses a stated future work in PianoCoRe: Combined and Refined Piano MIDI Dataset.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 22: 2605.06597v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in UniSD: Towards a Unified Self-Distillation Framework for Large Language Models: We view this scope as a starting point for several future directions. addresses a stated future work in UniSD: Towards a Unified Self-Distillation Framework for Large Language Models.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 23: 2605.06597v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in UniSD: Towards a Unified Self-Distillation Framework for Large Language Models: Self-Distillation (SD) offers a promising direction, where the model derives supervision from its own behavior rather ... addresses a stated future work in UniSD: Towards a Unified Self-Distillation Framework for Large Language Models.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 24: 2605.06557v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning: Exploratory COMA results are included in the appendix, but a more complete evaluation of policy-gradient and on-po... addresses a stated future work in Coordination Matters: Evaluation of Cooperative Multi-Agent Reinforcement Learning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 25: 2605.06615v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in When and Why SignSGD Outperforms SGD: A Theoretical Study Based on $\ell_1$-norm Lower Bounds: Consequently, evaluating the performance of sign-based methods under the aforementioned problem class a... addresses a stated failure mode in When and Why SignSGD Outperforms SGD: A Theoretical Study Based on $\ell_1$-norm Lower Bounds.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 26: 2605.06610v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in SoftSAE: Dynamic Top-K Selection for Adaptive Sparse Autoencoders: Despite impressive advancements, all these leading methodologies share a fundamental architectural limitation: they impose a rigid,... addresses a stated limitation in SoftSAE: Dynamic Top-K Selection for Adaptive Sparse Autoencoders.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 27: 2605.06610v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in SoftSAE: Dynamic Top-K Selection for Adaptive Sparse Autoencoders: Despite current limitations, most notably increased computational cost and the need to carefully manage the soft-to-hard selection ... addresses a stated limitation in SoftSAE: Dynamic Top-K Selection for Adaptive Sparse Autoencoders.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 28: 2605.06608v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in DARTS: Targeting Prognostic Covariates in Budget-Constrained Sequential Experiments: While DARTS consistently improves precision in unknown-covariate settings, we note several limitations regarding ... addresses a stated limitation in DARTS: Targeting Prognostic Covariates in Budget-Constrained Sequential Experiments.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 29: 2605.06608v1

Candidate: Test whether Evaluate the limitations of the independent arm assumption in the DARTS: Targeting Prognostic Covariates in Budget-Constrained Sequential Experiments setup addresses a stated limitation in DARTS: Targeting Prognostic Covariates in Budget-Constrained Sequential Experiments.

Reasons:

- No verified concrete public code, data, or benchmark URL found.

### Rejected 30: 2605.06599v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Weight-Decay Turns Transformer Loss Landscapes Villani: Functional-Analytic Foundations for Optimization and Generalization: Extensions to structured regularization, reinforcement learning, and othe... addresses a stated future work in Weight-Decay Turns Transformer Loss Landscapes Villani: Functional-Analytic Foundations for Optimization and Generalization.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 31: 2605.06571v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in CLAD: A Clustered Label-Agnostic Federated Learning Framework for Joint Anomaly Detection and Attack Classification: While FL addresses the privacy and bandwidth issues, standard implementations und... addresses a stated negative result in CLAD: A Clustered Label-Agnostic Federated Learning Framework for Joint Anomaly Detection and Attack Classification.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 32: 2605.06571v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in CLAD: A Clustered Label-Agnostic Federated Learning Framework for Joint Anomaly Detection and Attack Classification: While Federated Learning (FL) offers a privacy-preserving alternative to centrali... addresses a stated failure mode in CLAD: A Clustered Label-Agnostic Federated Learning Framework for Joint Anomaly Detection and Attack Classification.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 33: 2605.06564v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Dynamic Treatment on Networks: A policy that selects the right nodes to treat but ignores their sequencing can perform strictly worse than one that orders strategically. addresses a stated negative result in Dynamic Treatment on Networks.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 34: 2605.06552v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Sequential Design of Genetic Circuits Under Uncertainty With Reinforcement Learning: Exploring such semi-amortized strategies is an interesting avenue for future work. addresses a stated future work in Sequential Design of Genetic Circuits Under Uncertainty With Reinforcement Learning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 35: 2605.06552v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Sequential Design of Genetic Circuits Under Uncertainty With Reinforcement Learning: Handling potential model mismatch robustly is therefore an important future direction, particularly in biological... addresses a stated future work in Sequential Design of Genetic Circuits Under Uncertainty With Reinforcement Learning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 36: 2605.06660v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Verifier-Backed Hard Problem Generation for Mathematical Reasoning: Across hard-verifier integration and soft-verifier general math, VHG checks validity before interpreting solver failure as difficu... addresses a stated failure mode in Verifier-Backed Hard Problem Generation for Mathematical Reasoning.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 37: 2605.06660v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Verifier-Backed Hard Problem Generation for Mathematical Reasoning: The main limitation of VHG is that its guarantees are only as strong as the verifier backend. addresses a stated limitation in Verifier-Backed Hard Problem Generation for Mathematical Reasoning.

Reasons:

- No verified concrete public code, data, or benchmark URL found.
- Specific intervention is generic rather than operational.

### Rejected 38: 2605.06654v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less: We will be interested in scaling up our experiments and exploring more optimizers for future work. addresses a stated future work in Optimizer-Model Consistency: Full Finetuning with the Same Optimizer as Pretraining Forgets Less.

Reasons:

- Specific intervention is generic rather than operational.


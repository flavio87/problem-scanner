# Experiment 1 Comprehensive Smoke Report

Generated: 2026-05-07T23:17:56.720Z
Output directory: `runs/exp1-smoke-50-v5`
Mode: `heuristic`

## Run Summary

- Papers fetched from arXiv API: 50
- Papers inside 3-day window: 50
- Abstract-pass shortlist size: 30
- Raw candidates extracted: 40
- Accepted candidates in report: 8
- Rejected candidates: 32
- Top-20 evidence precision: 90%
- Top-20 problem-evidence precision: 100%
- Estimated cost: $0
- Estimated cost per scanned paper: $0

## Acceptance Checks

- PASS: at_least_3_a_grade
- PASS: at_least_8_a_or_b_grade
- PASS: top_20_evidence_precision_gt_80pct
- PASS: top_20_problem_evidence_precision_gt_80pct
- PASS: at_least_1_under_72h_public_benchmark
- PASS: low_cost_per_paper
- Overall: PASS

## Grade Counts

- A: 8
- B: 0
- C: 0

## Candidate Index

| Rank | Grade | Paper | Score | Impact | Time Budget | Candidate |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | A | [2605.05084v1](https://arxiv.org/abs/2605.05084v1) | 86 | safety | 48h | Test whether Stress-test and mitigate small minibatches in the Order Matters: Improving Domain Adaptation by Reordering Data setup addres... |
| 2 | A | [2605.05133v1](https://arxiv.org/abs/2605.05133v1) | 84 | economic | 48h | Test whether Evaluate this trade-off by adopting structured variational distributions (Mishkin et al in the Transformed Latent Variable M... |
| 3 | A | [2605.05133v1](https://arxiv.org/abs/2605.05133v1) | 84 | economic | 48h | Test whether Evaluate imposing additional constraints within the latent space, such as amortisation (Kingma and Welling, 2014 ) in the Tr... |
| 4 | A | [2605.04993v1](https://arxiv.org/abs/2605.04993v1) | 84 | economic | 48h | Test whether Evaluate the present intra-depot setting to cross-depot federated learning across multiple charging sites in the Federated L... |
| 5 | A | [2605.05115v1](https://arxiv.org/abs/2605.05115v1) | 84 | economic | 48h | Test whether Evaluate more abstract concepts, e in the Manifold Steering Reveals the Shared Geometry of Neural Network Representation and... |
| 6 | A | [2605.05054v1](https://arxiv.org/abs/2605.05054v1) | 82 | safety | 48h | Test whether Stress-test and mitigate the angular sub-manifold, leading to regression training difficulty and extra truncation errors in ... |
| 7 | A | [2605.05040v1](https://arxiv.org/abs/2605.05040v1) | 82 | science | 48h | Test whether Stress-test and mitigate the quality of the contextual teacher signal in the Preference-Based Self-Distillation: Beyond KL M... |
| 8 | A | [2605.05125v1](https://arxiv.org/abs/2605.05125v1) | 80 | economic | 48h | Test whether Stress-test and mitigate harder benchmarks in the Joint Treatment Effect Estimation from Incomplete Healthcare Data: Tempora... |

## Detailed Candidates

### 1. A-grade candidate: 2605.05084v1

ArXiv: https://arxiv.org/abs/2605.05084v1
Score: 86/100
Confidence: 0.58
Impact type: safety
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: limitation
Paper status: active
Code/data status: claimed

Candidate problem:

Test whether Stress-test and mitigate small minibatches in the Order Matters: Improving Domain Adaptation by Reordering Data setup addresses a stated limitation in Order Matters: Improving Domain Adaptation by Reordering Data.

Problem evidence spans:

- Although theoretically well-grounded [ 7 , 6 , 44 ] , a key limitation is that empirically estimating these discrepancies is extremely noisy, especially in high dimensions and with small minibatches.

Feasibility evidence spans:

- This paper proposes Optimal Reordering of Data for Error-Reduced Estimation of Discrepancy (ORDERED), a novel unbiased stochastic variance reduction technique which reduces the discrepancy estimation error by optimising the order in which the training data are sampled.
- We consider two specific domain discrepancy losses (correlation alignment and the maximum mean discrepancy), formulate their stochastic estimation error as a function of the data sampling order, and propose a practical optimisation algorithm.
- Our simulations demonstrate reduced variance compared to related methods, and experiments on two domain shift image classification benchmarks show improved target domain accuracy.
- We call this method Optimal Reordering of Data for Error-Reduced Estimation of Discrepancy (ORDERED).

Why hidden or underexploited:

The candidate is grounded in an explicit limitation span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Order Matters: Improving Domain Adaptation by Reordering Data. Then apply this intervention: Stress-test and mitigate small minibatches in the Order Matters: Improving Domain Adaptation by Reordering Data setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate small minibatches in the Order Matters: Improving Domain Adaptation by Reordering Data setup

Baseline:

The reported baseline/protocol from Order Matters: Improving Domain Adaptation by Reordering Data.

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

### 2. A-grade candidate: 2605.05133v1

ArXiv: https://arxiv.org/abs/2605.05133v1
Score: 84/100
Confidence: 0.58
Impact type: economic
Time budget: 48 hours
Evidence precision: 60%
Problem evidence precision: 100%
Feasibility evidence precision: 50%
Evidence role: future_work
Paper status: active
Code/data status: claimed

Candidate problem:

Test whether Evaluate this trade-off by adopting structured variational distributions (Mishkin et al in the Transformed Latent Variable Multi-Output Gaussian Processes setup addresses a stated future work in Transformed Latent Variable Multi-Output Gaussian Processes.

Problem evidence spans:

- Future work could address this trade-off by adopting structured variational distributions (Mishkin et al.

Feasibility evidence spans:

- ICML 2026 Multi-Output Gaussian Processes (MOGPs) provide a principled probabilistic framework for modelling correlated outputs but face scalability bottlenecks when applied to datasets with high-dimensional output spaces.
- Across diverse benchmarks, including climate modelling with over 10,000 outputs and zero-inflated spatial transcriptomics data, T-LVMOGP outperforms baselines in both predictive accuracy and computational efficiency.
- TITLE: Transformed Latent Variable Multi-Output Gaussian Processes ABSTRACT: Multi-Output Gaussian Processes (MOGPs) provide a principled probabilistic framework for modelling correlated outputs but face scalability bottlenecks when applied to datasets with high-dimensional output spaces.
- (4) Empirical experiments demonstrate that our model outperforms MOGP baselines in both predictive accuracy and computational efficiency.

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Transformed Latent Variable Multi-Output Gaussian Processes. Then apply this intervention: Evaluate this trade-off by adopting structured variational distributions (Mishkin et al in the Transformed Latent Variable Multi-Output Gaussian Processes setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Evaluate this trade-off by adopting structured variational distributions (Mishkin et al in the Transformed Latent Variable Multi-Output Gaussian Processes setup

Baseline:

The reported baseline/protocol from Transformed Latent Variable Multi-Output Gaussian Processes.

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

### 3. A-grade candidate: 2605.05133v1

ArXiv: https://arxiv.org/abs/2605.05133v1
Score: 84/100
Confidence: 0.58
Impact type: economic
Time budget: 48 hours
Evidence precision: 60%
Problem evidence precision: 100%
Feasibility evidence precision: 50%
Evidence role: future_work
Paper status: active
Code/data status: claimed

Candidate problem:

Test whether Evaluate imposing additional constraints within the latent space, such as amortisation (Kingma and Welling, 2014 ) in the Transformed Latent Variable Multi-Output Gaussian Processes setup addresses a stated future work in Transformed Latent Variable Multi-Output Gaussian Processes.

Problem evidence spans:

- Furthermore, although the parameter complexity of q ​ ( 𝐇 ) q(\mathbf{H}) scales linearly with the number of outputs P P , future work could investigate imposing additional constraints within the latent space, such as amortisation (Kingma and Welling, 2014 ) .

Feasibility evidence spans:

- ICML 2026 Multi-Output Gaussian Processes (MOGPs) provide a principled probabilistic framework for modelling correlated outputs but face scalability bottlenecks when applied to datasets with high-dimensional output spaces.
- Across diverse benchmarks, including climate modelling with over 10,000 outputs and zero-inflated spatial transcriptomics data, T-LVMOGP outperforms baselines in both predictive accuracy and computational efficiency.
- TITLE: Transformed Latent Variable Multi-Output Gaussian Processes ABSTRACT: Multi-Output Gaussian Processes (MOGPs) provide a principled probabilistic framework for modelling correlated outputs but face scalability bottlenecks when applied to datasets with high-dimensional output spaces.
- (4) Empirical experiments demonstrate that our model outperforms MOGP baselines in both predictive accuracy and computational efficiency.

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Transformed Latent Variable Multi-Output Gaussian Processes. Then apply this intervention: Evaluate imposing additional constraints within the latent space, such as amortisation (Kingma and Welling, 2014 ) in the Transformed Latent Variable Multi-Output Gaussian Processes setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Evaluate imposing additional constraints within the latent space, such as amortisation (Kingma and Welling, 2014 ) in the Transformed Latent Variable Multi-Output Gaussian Processes setup

Baseline:

The reported baseline/protocol from Transformed Latent Variable Multi-Output Gaussian Processes.

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

### 4. A-grade candidate: 2605.04993v1

ArXiv: https://arxiv.org/abs/2605.04993v1
Score: 84/100
Confidence: 0.58
Impact type: economic
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: future_work
Paper status: active
Code/data status: found

Candidate problem:

Test whether Evaluate the present intra-depot setting to cross-depot federated learning across multiple charging sites in the Federated Learning for Early Prediction of EV Charging Demand setup addresses a stated future work in Federated Learning for Early Prediction of EV Charging Demand.

Problem evidence spans:

- Future work will extend the present intra-depot setting to cross-depot federated learning across multiple charging sites.

Feasibility evidence spans:

- We construct a session-level dataset from the Adaptive Charging Network (ACN), combining session metadata with early-window charging measurements, and derive tabular features capturing user intent, temporal patterns, and initial charging behavior.
- Code is available at https://github.com/Indigma-Innovations/federated-learning-ev-charging-demand.
- We build a session-level dataset using the Adaptive Charging Network (ACN) framework [ 7 ] by combining session metadata with features extracted from the first 10 minutes of charging activity, including current, pilot signal, utilization, and trend statistics.
- • We build a realistic session-level dataset using ACN framework and derive a compact tabular representation that captures temporal context, user-provided information, and early charging dynamics.

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Federated Learning for Early Prediction of EV Charging Demand. Then apply this intervention: Evaluate the present intra-depot setting to cross-depot federated learning across multiple charging sites in the Federated Learning for Early Prediction of EV Charging Demand setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Evaluate the present intra-depot setting to cross-depot federated learning across multiple charging sites in the Federated Learning for Early Prediction of EV Charging Demand setup

Baseline:

The reported baseline/protocol from Federated Learning for Early Prediction of EV Charging Demand.

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

### 5. A-grade candidate: 2605.05115v1

ArXiv: https://arxiv.org/abs/2605.05115v1
Score: 84/100
Confidence: 0.58
Impact type: economic
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: future_work
Paper status: active
Code/data status: found

Candidate problem:

Test whether Evaluate more abstract concepts, e in the Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior setup addresses a stated future work in Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior.

Problem evidence spans:

- To further validate the claims posited in this paper, future work is needed to explore more abstract concepts, e.g., refusals (Arditi et al.

Feasibility evidence spans:

- We perform geometry-aware steering experiments and compare against the baseline of linear steering (see Fig.
- Goodman †,a Thomas Fel † {}^{{\color[rgb]{0.72265625,0.59375,0.2265625}\definecolor[named]{pgfstrokecolor}{rgb}{0.72265625,0.59375,0.2265625}\bm{\dagger}}\raisebox{0.5pt}{\hskip 1.42262pt\includegraphics[height=6.0pt]{goodfire/goodfire_logo_small.png}}} Atticus Geiger † {}^{{\color[rgb]{0.72265625,0.59375,0.2265625}\definecolor[named]{pgfstrokecolor}{rgb}{0.72265625,0.59375,0.2265625}\bm{\dagger}}\raisebox{0.5pt}{\hskip 1.42262pt\includegraphics[height=6.0pt]{goodfire/good...

Why hidden or underexploited:

The candidate is grounded in an explicit future work span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior. Then apply this intervention: Evaluate more abstract concepts, e in the Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Evaluate more abstract concepts, e in the Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior setup

Baseline:

The reported baseline/protocol from Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior.

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

### 6. A-grade candidate: 2605.05054v1

ArXiv: https://arxiv.org/abs/2605.05054v1
Score: 82/100
Confidence: 0.58
Impact type: safety
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: limitation
Paper status: active
Code/data status: claimed

Candidate problem:

Test whether Stress-test and mitigate the angular sub-manifold, leading to regression training difficulty and extra truncation errors in the Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation setup addresses a stated limitation in Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation.

Problem evidence spans:

- Under this new geometric view, we identify three overlooked limitations in them: 1) Angular dynamics distortion : The radial-angular coupling induces non-uniform speed on the angular sub-manifold, leading to regression training difficulty and extra truncation errors.

Feasibility evidence spans:

- 3) Context-agnostic unconditional flow: Dataset-specific information loss during pre-trained cross-modal feature extraction remains unrecovered.
- Meanwhile, we incorporate classifier-free guidance by conditioning the flow on the pre-trained VLMs' hidden states to inject missing dataset-specific information.
- Extensive results across 11 benchmarks have demonstrated that DP-FM achieves a new state-of-the-art for multi-step few-shot adaptation.
- e ., image features and text features) in challenging datasets (Jiang et al.

Why hidden or underexploited:

The candidate is grounded in an explicit limitation span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation. Then apply this intervention: Stress-test and mitigate the angular sub-manifold, leading to regression training difficulty and extra truncation errors in the Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate the angular sub-manifold, leading to regression training difficulty and extra truncation errors in the Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation setup

Baseline:

The reported baseline/protocol from Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation.

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

### 7. A-grade candidate: 2605.05040v1

ArXiv: https://arxiv.org/abs/2605.05040v1
Score: 82/100
Confidence: 0.58
Impact type: science
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: limitation
Paper status: active
Code/data status: claimed

Candidate problem:

Test whether Stress-test and mitigate the quality of the contextual teacher signal in the Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization setup addresses a stated limitation in Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization.

Problem evidence spans:

- The main limitation of our setting is that PBSD still depends on the quality of the contextual teacher signal.

Feasibility evidence spans:

- Experiments on mathematical reasoning and tool-use benchmarks across multiple model scales demonstrate that PBSD consistently achieves the strongest average performance among comparable baselines, showing improved training stability over prior self-distillation baselines while preserving token efficiency.
- Specifically, KL matching tends to suppress epistemic verbalization (namely, the model’s explicit expression of uncertainty, hesitation, self-checking, and error correction), yielding reasoning traces that are shorter but undesirably overconfident.
- We further provide a statistical analysis clarifying when contextual self-distillation, i.e., learning from a relevant teacher, can be theoretically preferable to learning from an external teacher; specifically, we show this by analyzing the statistical error of the maximum likelihood estimator (MLE) in the induced preference-learning problem.
- • We empirically evaluate our proposed PBSD on mathematical reasoning and tool-use benchmarks across multiple model scales.

Why hidden or underexploited:

The candidate is grounded in an explicit limitation span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization. Then apply this intervention: Stress-test and mitigate the quality of the contextual teacher signal in the Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Public datasets or benchmarks referenced by the paper; use reported protocol for replication.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate the quality of the contextual teacher signal in the Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization setup

Baseline:

The reported baseline/protocol from Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization.

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

### 8. A-grade candidate: 2605.05125v1

ArXiv: https://arxiv.org/abs/2605.05125v1
Score: 80/100
Confidence: 0.58
Impact type: economic
Time budget: 48 hours
Evidence precision: 100%
Problem evidence precision: 100%
Feasibility evidence precision: 100%
Evidence role: failure_mode
Paper status: active
Code/data status: claimed

Candidate problem:

Test whether Stress-test and mitigate harder benchmarks in the Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation setup addresses a stated failure mode in Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation.

Problem evidence spans:

- All models perform comparably on the positive control (Simple 3-Node), confirming the DAG constraint does not degrade performance when confounding is absent; two non-overlapping failure modes emerge on harder benchmarks.

Feasibility evidence spans:

- Ablations on four synthetic and one semi-synthetic benchmark with known counterfactuals show that DAG constraints and exact inference address distinct failure modes: neither compensates for the other.
- Across 30%--80% MNAR missingness, this imputer achieves the best pooled rank over biomarker and causal metrics, leading in point-wise accuracy and temporal extrapolation while preserving average treatment effect (ATE) recovery as statistical baselines degrade.
- Experiments on four synthetic datasets and one semi-synthetic evaluation dataset with known counterfactuals reveal two distinct failure modes: (i) DAG constraints are necessary for confounding separation (unconstrained models maintain systematic bias in low-effect subgroups even despite low factual prediction error); (ii) exact inference is required for structural propagation (variational methods fail to recover the true treatment effect under complex mediation paths even ...
- , 2012 ) , MissForest (Stekhoven and Bühlmann, 2012 ) , and a DAG-aware flow matching (CFM) baseline (inspired by the m-graph framework (Mohan and Pearl, 2021 ) ) across 30–80% MNAR missingness using three LLM backends (GPT-5.4 and GPT-OSS-120b from OpenAI, Qwen3.5-Plus from Alibaba Cloud).

Why hidden or underexploited:

The candidate is grounded in an explicit failure mode span rather than a positive-result claim.

Auto-research experiment:

Reproduce The reported baseline/protocol from Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation. Then apply this intervention: Stress-test and mitigate harder benchmarks in the Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation setup. Compare against the baseline under the same data, split, and compute budget.

Available data or benchmark:

Author-provided code repository plus public benchmark datasets referenced in the paper.

Expected metric:

Pre-registered measurable delta on a public benchmark metric versus baseline.

Specific intervention:

Stress-test and mitigate harder benchmarks in the Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation setup

Baseline:

The reported baseline/protocol from Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation.

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
- Impact: 10/15
- Storyability: 7/10

## Rejection Audit

### Rejected 1: 2605.05054v1

Candidate: Test whether Stress-test and mitigate few-shot adaptation (FMA) (Jiang et al in the Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation setup addresses a stated limitation in Direct Product Flow Matching: Decoupling Radial and Angular Dynamics for Few-Shot Adaptation.

Reasons:

- Problem evidence appears to describe a limitation the paper claims to solve, not an open candidate.

### Rejected 2: 2605.05040v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization: In this sense, the limitation is not separate from our problem formulation; rather, it defines the regime in which P... addresses a stated limitation in Preference-Based Self-Distillation: Beyond KL Matching via Reward Regularization.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 3: 2605.05104v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Building informative materials datasets beyond targeted objectives: Robust computation of diversity for our framework while making the computation reasonable time consuming is left as future work. addresses a stated future work in Building informative materials datasets beyond targeted objectives.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 4: 2605.05104v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Building informative materials datasets beyond targeted objectives: Testing in higher-dimensional settings, and methods to address possible curse of dimensionality effects, are left for future work. addresses a stated future work in Building informative materials datasets beyond targeted objectives.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 5: 2605.04997v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in DualTCN: A Physics-Constrained Temporal Convolutional Network for 2 Time-Domain Marine CSEM Inversion: Key limitations include: (i) the two-channel input creates a structural amplitude vulnerability... addresses a stated limitation in DualTCN: A Physics-Constrained Temporal Convolutional Network for 2 Time-Domain Marine CSEM Inversion.

Reasons:

- Specific intervention is generic rather than operational.
- Safety/legal risk cannot be sandboxed in the described experiment.

### Rejected 6: 2605.04997v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in DualTCN: A Physics-Constrained Temporal Convolutional Network for 2 Time-Domain Marine CSEM Inversion: The retraining pipeline takes < 8 <8 GPU-hours for one million samples; two concrete field-data... addresses a stated future work in DualTCN: A Physics-Constrained Temporal Convolutional Network for 2 Time-Domain Marine CSEM Inversion.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 7: 2605.05125v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation: Simple LDL Cox CVD Risk Mean rank Reliability Model... addresses a stated failure mode in Joint Treatment Effect Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows with LLM-driven Evolutionary MNAR Imputation.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 8: 2605.05000v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Agentic Vulnerability Reasoning on Windows COM Binaries: COMRace++ ’s limited base-configuration performance (0.225 F1, 0.500 recall, and 32 missed vulnerable functions out of 64) stems from four st... addresses a stated limitation in Agentic Vulnerability Reasoning on Windows COM Binaries.

Reasons:

- Specific intervention is generic rather than operational.
- No concrete metric named.
- Safety/legal risk cannot be sandboxed in the described experiment.

### Rejected 9: 2605.05000v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Agentic Vulnerability Reasoning on Windows COM Binaries: A natural next step is domain-specific fine-tuning or knowledge augmentation to reduce prompt-engineering overhead ( lyu2024knowtuning ; meng... addresses a stated future work in Agentic Vulnerability Reasoning on Windows COM Binaries.

Reasons:

- Specific intervention is generic rather than operational.
- Safety/legal risk cannot be sandboxed in the described experiment.

### Rejected 10: 2605.05084v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Order Matters: Improving Domain Adaptation by Reordering Data: I Introduction Machine learning models often underperform when the test data distribution differs from the training distribution, a phe... addresses a stated negative result in Order Matters: Improving Domain Adaptation by Reordering Data.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 11: 2605.05020v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Graph-SND: Sparse Aggregation for Behavioral Diversity in Multi-Agent Reinforcement Learning: The main failure mode is transparent from the graph semantics. addresses a stated failure mode in Graph-SND: Sparse Aggregation for Behavioral Diversity in Multi-Agent Reinforcement Learning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 12: 2605.05020v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Graph-SND: Sparse Aggregation for Behavioral Diversity in Multi-Agent Reinforcement Learning: This is not a failure of the estimator theory; it means the graph has selected a local measurement target. addresses a stated failure mode in Graph-SND: Sparse Aggregation for Behavioral Diversity in Multi-Agent Reinforcement Learning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 13: 2605.05151v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Superposition Is Not Necessary: A Mechanistic Interpretability Analysis of Transformer Representations for Time Series Forecasting: Attention heads and residual stream representations may encode add... addresses a stated future work in Superposition Is Not Necessary: A Mechanistic Interpretability Analysis of Transformer Representations for Time Series Forecasting.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 14: 2605.05144v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Human-AI Co-Mentorship in Project-Based Learning: A Case Study in Financial Forecasting: While we took steps to reduce leakage risk, alternative sentiment extraction methods remain an important dire... addresses a stated future work in Human-AI Co-Mentorship in Project-Based Learning: A Case Study in Financial Forecasting.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 15: 2605.05144v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Human-AI Co-Mentorship in Project-Based Learning: A Case Study in Financial Forecasting: These limitations point to the importance of contextualizing our results and pursuing further research to val... addresses a stated limitation in Human-AI Co-Mentorship in Project-Based Learning: A Case Study in Financial Forecasting.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 16: 2605.05134v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Low-Cost Black-Box Detection of LLM Hallucinations via Dynamical System Prediction: To address these limitations, we treat the LMM as dynamical system (DS) and propose a novel DS prediction approach... addresses a stated limitation in Low-Cost Black-Box Detection of LLM Hallucinations via Dynamical System Prediction.

Reasons:

- Problem evidence appears to describe a limitation the paper claims to solve, not an open candidate.
- Specific intervention is generic rather than operational.

### Rejected 17: 2605.05123v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Adaptive Policy Selection and Fine-Tuning under Interaction Budgets for Offline-to-Online Reinforcement Learning: One limitation is that, after each fine-tuning iteration, it requires a considerable... addresses a stated limitation in Adaptive Policy Selection and Fine-Tuning under Interaction Budgets for Offline-to-Online Reinforcement Learning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 18: 2605.05123v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Adaptive Policy Selection and Fine-Tuning under Interaction Budgets for Offline-to-Online Reinforcement Learning: A future direction could be to leverage exploration rollouts to monitor progress dur... addresses a stated future work in Adaptive Policy Selection and Fine-Tuning under Interaction Budgets for Offline-to-Online Reinforcement Learning.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 19: 2605.05120v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Physiologically Grounded Driver Behavior Classification: SHAP-Driven Elite Feature Selection and Hybrid Gradient Boosting for Multimodal Physiological Signals: This section discusses the implication... addresses a stated limitation in Physiologically Grounded Driver Behavior Classification: SHAP-Driven Elite Feature Selection and Hybrid Gradient Boosting for Multimodal Physiological Signals.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 20: 2605.05120v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Physiologically Grounded Driver Behavior Classification: SHAP-Driven Elite Feature Selection and Hybrid Gradient Boosting for Multimodal Physiological Signals: Future work will aim to validate these... addresses a stated future work in Physiologically Grounded Driver Behavior Classification: SHAP-Driven Elite Feature Selection and Hybrid Gradient Boosting for Multimodal Physiological Signals.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 21: 2605.05095v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in A Bayesian Approach for Task-Specific Next-Best-View Selection with Uncertain Geometry: We see these as promising future work. addresses a stated future work in A Bayesian Approach for Task-Specific Next-Best-View Selection with Uncertain Geometry.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 22: 2605.05066v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in The Impossibility Triangle of Long-Context Modeling: Our analysis has several limitations. addresses a stated limitation in The Impossibility Triangle of Long-Context Modeling.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 23: 2605.05066v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in The Impossibility Triangle of Long-Context Modeling: We highlight four directions for future work. addresses a stated future work in The Impossibility Triangle of Long-Context Modeling.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 24: 2605.05055v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Adaptive Learning Strategies for AoA-Based Outdoor Localization: A Comprehensive Framework: There are several directions for future work. addresses a stated future work in Adaptive Learning Strategies for AoA-Based Outdoor Localization: A Comprehensive Framework.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 25: 2605.05029v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in The Predictive-Causal Gap: An Impossibility Theorem and Large-Scale Neural Evidence: The Predictive-Causal Gap: An Impossibility Theorem and Large-Scale Neural Evidence Kejun Liu kjliu@suda.edu.cn S... addresses a stated failure mode in The Predictive-Causal Gap: An Impossibility Theorem and Large-Scale Neural Evidence.

Reasons:

- No public code, data, benchmark, or metric evidence found.
- Specific intervention is generic rather than operational.

### Rejected 26: 2605.05029v1

Candidate: Test whether Stress-test and mitigate dimension: at N = 100 N=100 , the optimal encoder becomes causally blind (fidelity ∼ 10 − 8 \sim 10^{-8} ) while achieving 92 % 92\% lower prediction error than the causal representation in the The Predictive-Causal Gap: An Impossib... addresses a stated failure mode in The Predictive-Causal Gap: An Impossibility Theorem and Large-Scale Neural Evidence.

Reasons:

- No public code, data, benchmark, or metric evidence found.

### Rejected 27: 2605.05023v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in CuBridge: An LLM-Based Framework for Understanding and Reconstructing High-Performance Attention Kernels: Our work has two main limitations. addresses a stated limitation in CuBridge: An LLM-Based Framework for Understanding and Reconstructing High-Performance Attention Kernels.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 28: 2605.05023v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in CuBridge: An LLM-Based Framework for Understanding and Reconstructing High-Performance Attention Kernels: We have not yet extended our validation to other high-performance computing tasks, such as s... addresses a stated future work in CuBridge: An LLM-Based Framework for Understanding and Reconstructing High-Performance Attention Kernels.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 29: 2605.05008v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Scalable inference of spatial regions and temporal signatures from time series: Several directions for future work remain. addresses a stated future work in Scalable inference of spatial regions and temporal signatures from time series.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 30: 2605.04971v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Why Geometric Continuity Emerges in Deep Neural Networks: Residual Connections and Rotational Symmetry Breaking: Crucially, a nonlinear but rotation-preserving activation fails to retain continuity,... addresses a stated failure mode in Why Geometric Continuity Emerges in Deep Neural Networks: Residual Connections and Rotational Symmetry Breaking.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 31: 2605.04971v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Why Geometric Continuity Emerges in Deep Neural Networks: Residual Connections and Rotational Symmetry Breaking: A nonlinear-but-rotation-preserving activation (Section 4.3 ) fails to produce contin... addresses a stated failure mode in Why Geometric Continuity Emerges in Deep Neural Networks: Residual Connections and Rotational Symmetry Breaking.

Reasons:

- Specific intervention is generic rather than operational.

### Rejected 32: 2605.05115v1

Candidate: Test whether Design a paper-specific ablation around this stated gap in Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior: While we believe our results have enabled significant progress towards the motivating goals, there are re... addresses a stated limitation in Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior.

Reasons:

- Specific intervention is generic rather than operational.


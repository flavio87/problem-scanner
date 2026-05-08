import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import type { CandidateProblem, RawCandidate, ScoreBreakdown } from "./experiment1.js";

export type FrontierLabel = "A" | "B" | "C" | "Reject";

export interface ArmInput {
  name: string;
  path: string;
  maxCandidates: number;
}

export interface CandidateSource {
  arm: string;
  rank: number;
  score: number | null;
  grade: string | null;
  source_path: string;
}

export interface AgreementCandidate {
  candidate_id: string;
  paper_id: string;
  candidate_problem: string;
  evidence_spans: string[];
  problem_evidence_spans: string[];
  feasibility_evidence_spans: string[];
  auto_research_experiment: string;
  available_data_or_benchmark: string;
  expected_metric: string;
  specific_intervention: string;
  baseline: string;
  metric: string;
  code_or_data_urls: string[];
  story_angle: string;
  sources: CandidateSource[];
}

export interface FrontierLabelRecord {
  candidate_id: string;
  frontier_label: FrontierLabel;
  would_run_24_72h?: boolean;
  rationale?: string;
  repair_needed?: string;
  fatal_blocker?: string;
}

export interface ArmAgreementMetrics {
  arm: string;
  candidates: number;
  frontier_a: number;
  frontier_b: number;
  frontier_ab: number;
  missed_frontier_a: number;
  missed_frontier_ab: number;
  precision_at_k: Record<string, number>;
  recall_at_k: Record<string, number>;
  false_negative_ids: string[];
  calibration: Array<{
    bucket: string;
    candidates: number;
    frontier_ab: number;
    rate: number;
  }>;
}

export interface AgreementMetrics {
  generated_at: string;
  total_candidates: number;
  labeled_candidates: number;
  frontier_a: number;
  frontier_b: number;
  frontier_ab: number;
  k_values: number[];
  arms: ArmAgreementMetrics[];
}

type CandidateLike = Partial<RawCandidate & CandidateProblem>;

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function candidateId(candidate: Pick<AgreementCandidate, "paper_id" | "candidate_problem">): string {
  const hash = createHash("sha256")
    .update(`${candidate.paper_id}\n${normalizeText(candidate.candidate_problem)}`)
    .digest("hex")
    .slice(0, 16);
  return `cand_${hash}`;
}

function readJsonFile(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse JSON at ${path}: ${detail}`);
  }
}

function readJsonArray(path: string): CandidateLike[] {
  const parsed = readJsonFile(path);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array at ${path}`);
  }
  return parsed as CandidateLike[];
}

function scoreForCandidate(candidate: CandidateLike): number | null {
  const score = candidate.score_breakdown as Partial<ScoreBreakdown> | undefined;
  return typeof score?.total === "number" ? score.total : null;
}

function rankCandidates(candidates: CandidateLike[]): CandidateLike[] {
  return [...candidates].sort((a, b) => {
    const rankA = typeof a.rank === "number" && a.rank > 0 ? a.rank : Number.POSITIVE_INFINITY;
    const rankB = typeof b.rank === "number" && b.rank > 0 ? b.rank : Number.POSITIVE_INFINITY;
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return (scoreForCandidate(b) ?? 0) - (scoreForCandidate(a) ?? 0);
  });
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}

function toAgreementCandidate(candidate: CandidateLike): AgreementCandidate {
  const base = {
    paper_id: String(candidate.paper_id ?? ""),
    candidate_problem: String(candidate.candidate_problem ?? ""),
  };
  return {
    candidate_id: candidateId(base),
    ...base,
    evidence_spans: asStringArray(candidate.evidence_spans),
    problem_evidence_spans: asStringArray(candidate.problem_evidence_spans),
    feasibility_evidence_spans: asStringArray(candidate.feasibility_evidence_spans),
    auto_research_experiment: String(candidate.auto_research_experiment ?? ""),
    available_data_or_benchmark: String(candidate.available_data_or_benchmark ?? ""),
    expected_metric: String(candidate.expected_metric ?? ""),
    specific_intervention: String(candidate.specific_intervention ?? ""),
    baseline: String(candidate.baseline ?? ""),
    metric: String(candidate.metric ?? ""),
    code_or_data_urls: asStringArray(candidate.code_or_data_urls),
    story_angle: String(candidate.story_angle ?? ""),
    sources: [],
  };
}

export function buildCandidatePool(arms: ArmInput[]): AgreementCandidate[] {
  const byId = new Map<string, AgreementCandidate>();

  for (const arm of arms) {
    const ranked = rankCandidates(readJsonArray(arm.path)).slice(0, arm.maxCandidates);
    ranked.forEach((candidate, index) => {
      const normalized = toAgreementCandidate(candidate);
      if (!normalized.paper_id || !normalized.candidate_problem) {
        return;
      }
      const existing = byId.get(normalized.candidate_id) ?? normalized;
      existing.sources.push({
        arm: arm.name,
        rank: index + 1,
        score: scoreForCandidate(candidate),
        grade: typeof candidate.grade === "string" ? candidate.grade : null,
        source_path: arm.path,
      });
      byId.set(existing.candidate_id, existing);
    });
  }

  return Array.from(byId.values()).sort((a, b) => {
    const bestRankA = Math.min(...a.sources.map((source) => source.rank));
    const bestRankB = Math.min(...b.sources.map((source) => source.rank));
    return bestRankA - bestRankB;
  });
}

function isFrontierAB(label: FrontierLabel | undefined): boolean {
  return label === "A" || label === "B";
}

function isFrontierA(label: FrontierLabel | undefined): boolean {
  return label === "A";
}

function roundMetric(value: number): number {
  return Number(value.toFixed(4));
}

function scoreBucket(score: number | null): string {
  if (score === null) {
    return "unscored";
  }
  if (score >= 85) {
    return "85+";
  }
  if (score >= 75) {
    return "75-84";
  }
  if (score >= 65) {
    return "65-74";
  }
  return "<65";
}

export function scoreAgreement(
  pool: AgreementCandidate[],
  labels: FrontierLabelRecord[],
  kValues: number[],
): AgreementMetrics {
  const labelById = new Map(labels.map((label) => [label.candidate_id, label.frontier_label]));
  const frontierAIds = new Set(pool.filter((candidate) => isFrontierA(labelById.get(candidate.candidate_id))).map((candidate) => candidate.candidate_id));
  const frontierABIds = new Set(pool.filter((candidate) => isFrontierAB(labelById.get(candidate.candidate_id))).map((candidate) => candidate.candidate_id));
  const arms = Array.from(new Set(pool.flatMap((candidate) => candidate.sources.map((source) => source.arm)))).sort();

  return {
    generated_at: new Date().toISOString(),
    total_candidates: pool.length,
    labeled_candidates: pool.filter((candidate) => labelById.has(candidate.candidate_id)).length,
    frontier_a: frontierAIds.size,
    frontier_b: pool.filter((candidate) => labelById.get(candidate.candidate_id) === "B").length,
    frontier_ab: frontierABIds.size,
    k_values: kValues,
    arms: arms.map((arm) => {
      const armCandidates = pool
        .filter((candidate) => candidate.sources.some((source) => source.arm === arm))
        .sort((a, b) => {
          const rankA = a.sources.find((source) => source.arm === arm)?.rank ?? Number.POSITIVE_INFINITY;
          const rankB = b.sources.find((source) => source.arm === arm)?.rank ?? Number.POSITIVE_INFINITY;
          return rankA - rankB;
        });
      const armIds = new Set(armCandidates.map((candidate) => candidate.candidate_id));
      const precisionAtK: Record<string, number> = {};
      const recallAtK: Record<string, number> = {};

      for (const k of kValues) {
        const topK = armCandidates.slice(0, k);
        const relevant = topK.filter((candidate) => isFrontierAB(labelById.get(candidate.candidate_id))).length;
        precisionAtK[String(k)] = topK.length > 0 ? roundMetric(relevant / topK.length) : 0;
        recallAtK[String(k)] = frontierABIds.size > 0 ? roundMetric(relevant / frontierABIds.size) : 0;
      }

      const bucketMap = new Map<string, { candidates: number; frontier_ab: number }>();
      for (const candidate of armCandidates) {
        const source = candidate.sources.find((item) => item.arm === arm);
        const bucket = scoreBucket(source?.score ?? null);
        const current = bucketMap.get(bucket) ?? { candidates: 0, frontier_ab: 0 };
        current.candidates += 1;
        if (isFrontierAB(labelById.get(candidate.candidate_id))) {
          current.frontier_ab += 1;
        }
        bucketMap.set(bucket, current);
      }

      const missedAB = Array.from(frontierABIds).filter((id) => !armIds.has(id));
      return {
        arm,
        candidates: armCandidates.length,
        frontier_a: armCandidates.filter((candidate) => isFrontierA(labelById.get(candidate.candidate_id))).length,
        frontier_b: armCandidates.filter((candidate) => labelById.get(candidate.candidate_id) === "B").length,
        frontier_ab: armCandidates.filter((candidate) => isFrontierAB(labelById.get(candidate.candidate_id))).length,
        missed_frontier_a: Array.from(frontierAIds).filter((id) => !armIds.has(id)).length,
        missed_frontier_ab: missedAB.length,
        precision_at_k: precisionAtK,
        recall_at_k: recallAtK,
        false_negative_ids: missedAB,
        calibration: Array.from(bucketMap.entries()).map(([bucket, values]) => ({
          bucket,
          candidates: values.candidates,
          frontier_ab: values.frontier_ab,
          rate: values.candidates > 0 ? roundMetric(values.frontier_ab / values.candidates) : 0,
        })),
      };
    }),
  };
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function promptMarkdown(pool: AgreementCandidate[]): string {
  return [
    "# Frontier Agreement Labeling Prompt",
    "",
    "You are the frontier judge for an arXiv latent-problem scanner calibration study.",
    "",
    "Label each candidate independently. Do not infer quality from ordering. Do not assume a candidate is bad just because it is imperfect; decide whether a one-step repair makes it worth tracking.",
    "",
    "Labels:",
    "- A: would spend 24-72h running this experiment.",
    "- B: worth tracking or repairable with one concrete step.",
    "- C: technically plausible but not worth pursuing now.",
    "- Reject: fatal flaw.",
    "",
    "For each candidate return JSON with candidate_id, frontier_label, would_run_24_72h, rationale, repair_needed, fatal_blocker.",
    "",
    `Candidate count: ${pool.length}`,
  ].join("\n");
}

function reportMarkdown(metrics: AgreementMetrics): string {
  const lines = ["# Cheap Vs Frontier Agreement Report", "", `Generated: ${metrics.generated_at}`, ""];
  lines.push(`- Total candidates: ${metrics.total_candidates}`);
  lines.push(`- Labeled candidates: ${metrics.labeled_candidates}`);
  lines.push(`- Frontier A: ${metrics.frontier_a}`);
  lines.push(`- Frontier B: ${metrics.frontier_b}`);
  lines.push(`- Frontier A/B: ${metrics.frontier_ab}`);
  lines.push("");
  lines.push("| Arm | Candidates | Frontier A/B | Missed A/B | Precision@20 | Recall@50 |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  for (const arm of metrics.arms) {
    lines.push(
      `| ${arm.arm} | ${arm.candidates} | ${arm.frontier_ab} | ${arm.missed_frontier_ab} | ${arm.precision_at_k["20"] ?? 0} | ${arm.recall_at_k["50"] ?? 0} |`,
    );
  }
  lines.push("");
  lines.push("## Decision Rules");
  lines.push("");
  lines.push("- Cheap scanner is viable if recall@50 for frontier A/B is above 0.8 and precision@20 is above 0.4.");
  lines.push("- Strict verifier is too aggressive if it misses more than 10-15% of frontier A candidates.");
  lines.push("- Recall-first is not useful if it mostly increases rejects without improving frontier A/B recall.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function parseArm(raw: string, fallbackMax: number): ArmInput {
  const [name, path, maxRaw] = raw.split(":");
  if (!name || !path) {
    throw new Error(`Invalid --arm value: ${raw}. Expected name:path[:maxCandidates].`);
  }
  const maxCandidates = maxRaw ? Number.parseInt(maxRaw, 10) : fallbackMax;
  return { name, path, maxCandidates: Number.isFinite(maxCandidates) && maxCandidates > 0 ? maxCandidates : fallbackMax };
}

function parseCsvNumbers(raw: string | undefined, fallback: number[]): number[] {
  if (!raw) {
    return fallback;
  }
  const parsed = raw
    .split(",")
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item) && item > 0);
  return parsed.length > 0 ? parsed : fallback;
}

export async function main(argv: string[]): Promise<void> {
  const parsed = parseArgs({
    args: argv,
    strict: false,
    allowPositionals: true,
    options: {
      arm: { type: "string", multiple: true },
      outputDir: { type: "string" },
      frontierLabels: { type: "string" },
      maxPerArm: { type: "string" },
      k: { type: "string" },
    },
  });

  const outputDir = String(parsed.values.outputDir ?? join("runs", `agreement-${new Date().toISOString().replace(/[:.]/g, "-")}`));
  const maxPerArm = Number.parseInt(String(parsed.values.maxPerArm ?? "50"), 10);
  const rawArmValues = parsed.values.arm;
  const armValues = Array.isArray(rawArmValues)
    ? rawArmValues.filter((value): value is string => typeof value === "string")
    : typeof rawArmValues === "string"
      ? [rawArmValues]
      : [];
  const arms = armValues.map((arm) => parseArm(arm, maxPerArm));
  if (arms.length === 0) {
    throw new Error("At least one --arm name:path[:maxCandidates] is required.");
  }

  mkdirSync(outputDir, { recursive: true });
  const pool = buildCandidatePool(arms);
  const blindedPool = pool.map(({ sources, ...candidate }) => candidate);
  writeJson(join(outputDir, "frontier_pool.json"), blindedPool);
  writeJson(join(outputDir, "candidate_sources.json"), pool.map((candidate) => ({ candidate_id: candidate.candidate_id, sources: candidate.sources })));
  writeJson(
    join(outputDir, "frontier_label_template.json"),
    blindedPool.map((candidate) => ({
      candidate_id: candidate.candidate_id,
      frontier_label: "Reject",
      would_run_24_72h: false,
      rationale: "",
      repair_needed: "",
      fatal_blocker: "",
    })),
  );
  writeFileSync(join(outputDir, "frontier_prompt.md"), `${promptMarkdown(pool)}\n`, "utf8");

  if (parsed.values.frontierLabels) {
    const labels = readJsonFile(String(parsed.values.frontierLabels)) as FrontierLabelRecord[];
    const metrics = scoreAgreement(pool, labels, parseCsvNumbers(parsed.values.k as string | undefined, [10, 20, 50]));
    writeJson(join(outputDir, "agreement_metrics.json"), metrics);
    writeFileSync(join(outputDir, "agreement_report.md"), reportMarkdown(metrics), "utf8");
  }

  console.log(JSON.stringify({ output_dir: outputDir, candidates: pool.length }, null, 2));
}

if (import.meta.main) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ error: message }));
    process.exit(1);
  });
}

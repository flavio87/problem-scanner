import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";

export const DEFAULT_CATEGORIES = [
  "cs.AI",
  "cs.LG",
  "stat.ML",
  "q-bio.QM",
  "q-bio.GN",
  "q-bio.PE",
  "eess",
] as const;

export const IMPACT_TYPES = [
  "economic",
  "climate/environment",
  "health",
  "safety",
  "science",
  "developer productivity",
] as const;

export type ImpactType = (typeof IMPACT_TYPES)[number];
export type RunMode = "heuristic" | "llm";
export type EvidenceRole =
  | "limitation"
  | "future_work"
  | "failure_mode"
  | "negative_result"
  | "benchmark_gap"
  | "positive_result_only";
export type PaperStatus = "active" | "withdrawn" | "unknown";
export type CodeOrDataStatus = "found" | "claimed" | "not_found" | "unknown";
export type PublicExperimentConfig = Omit<ExperimentConfig, "gemini_api_key"> & {
  gemini_api_key_set: boolean;
};

export interface ScoreBreakdown {
  auto_research_feasibility: number;
  falsifiable_evaluation: number;
  problem_clarity: number;
  novelty_or_neglectedness: number;
  impact: number;
  storyability: number;
  total: number;
}

export interface CandidateProblem {
  paper_id: string;
  candidate_problem: string;
  evidence_spans: string[];
  problem_evidence_spans: string[];
  feasibility_evidence_spans: string[];
  evidence_role: EvidenceRole;
  why_hidden_or_underexploited: string;
  auto_research_experiment: string;
  available_data_or_benchmark: string;
  expected_metric: string;
  specific_intervention: string;
  baseline: string;
  metric: string;
  paper_status: PaperStatus;
  code_or_data_status: CodeOrDataStatus;
  paper_status_sources: string[];
  paper_status_evidence: string[];
  code_or_data_urls: string[];
  code_or_data_sources: string[];
  code_or_data_evidence: string[];
  time_budget_hours: number;
  impact_type: ImpactType;
  story_angle: string;
  disqualifiers: string[];
  confidence: number;
  score_breakdown: ScoreBreakdown;
  grade: "A" | "B" | "C";
  rank: number;
  evidence_precision: number;
  problem_evidence_precision: number;
  feasibility_evidence_precision: number;
}

export interface RawCandidate {
  paper_id: string;
  candidate_problem: string;
  evidence_spans: string[];
  problem_evidence_spans: string[];
  feasibility_evidence_spans: string[];
  evidence_role: EvidenceRole;
  why_hidden_or_underexploited: string;
  auto_research_experiment: string;
  available_data_or_benchmark: string;
  expected_metric: string;
  specific_intervention: string;
  baseline: string;
  metric: string;
  paper_status: PaperStatus;
  code_or_data_status: CodeOrDataStatus;
  paper_status_sources: string[];
  paper_status_evidence: string[];
  code_or_data_urls: string[];
  code_or_data_sources: string[];
  code_or_data_evidence: string[];
  time_budget_hours: number;
  impact_type: ImpactType;
  story_angle: string;
  disqualifiers: string[];
  confidence: number;
}

export interface RejectionRecord {
  paper_id: string;
  candidate_problem: string;
  reasons: string[];
}

export interface ArxivPaper {
  id: string;
  canonical_id: string;
  title: string;
  abstract: string;
  comments: string;
  subjects: string[];
  primary_subject: string;
  authors: string[];
  abs_url: string;
  pdf_url: string;
  published_at: string;
  updated_at: string;
}

export interface PaperSections {
  introduction: string;
  discussion: string;
  limitations: string;
  future_work: string;
  conclusion: string;
  appendix: string;
  raw_text: string;
}

export interface PaperText {
  paper_id: string;
  source: "html" | "abstract";
  sections: PaperSections;
  full_text: string;
  external_urls?: string[];
}

export interface ExperimentConfig {
  days: number;
  categories: string[];
  per_category_fetch: number;
  target_min: number;
  target_max: number;
  abstract_top_k: number;
  candidate_per_paper: number;
  verifier_top_k: number;
  max_evidence_spans: number;
  max_candidates_output: number;
  output_dir: string;
  mode: RunMode;
  broad_model: string;
  verifier_model: string;
  gemini_api_key?: string;
  input_price_per_mtoken_usd: number;
  output_price_per_mtoken_usd: number;
}

interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface LlmJsonResult<T> {
  data: T;
  usage: TokenUsage;
}

interface V1CandidateEnvelope {
  candidates: Array<Partial<RawCandidate>>;
}

interface V2Verification {
  accepted: boolean;
  rejection_reasons: string[];
  score_breakdown?: Partial<ScoreBreakdown>;
  candidate_patch?: Partial<RawCandidate>;
}

interface RunSummary {
  started_at: string;
  finished_at: string;
  config: PublicExperimentConfig;
  llm: {
    provider: "google-gemini";
    mode: RunMode;
    llm_invoked: boolean;
    broad_model: string;
    verifier_model: string;
    prompt_audit_path: string;
  };
  papers_fetched: number;
  papers_in_window: number;
  abstract_shortlist_size: number;
  raw_candidates: number;
  accepted_candidates: number;
  rejected_candidates: number;
  top_20_evidence_precision: number;
  top_20_problem_evidence_precision: number;
  grade_counts: {
    A: number;
    B: number;
    C: number;
  };
  acceptance: {
    pass: boolean;
    checks: {
      at_least_3_a_grade: boolean;
      at_least_8_a_or_b_grade: boolean;
      top_20_evidence_precision_gt_80pct: boolean;
      top_20_problem_evidence_precision_gt_80pct: boolean;
      at_least_1_under_72h_public_benchmark: boolean;
      low_cost_per_paper: boolean;
    };
  };
  usage: TokenUsage;
  estimated_cost_usd: number;
  estimated_cost_per_paper_usd: number;
}

interface PaperVerification {
  paper_id: string;
  paper_status: PaperStatus;
  paper_status_sources: string[];
  paper_status_evidence: string[];
  code_or_data_status: CodeOrDataStatus;
  code_or_data_urls: string[];
  code_or_data_sources: string[];
  code_or_data_evidence: string[];
}

const POSITIVE_SIGNAL_TERMS = [
  "limitation",
  "limitations",
  "future work",
  "underexplored",
  "open problem",
  "failure mode",
  "negative result",
  "benchmark",
  "error analysis",
  "does not generalize",
  "brittle",
  "trade-off",
  "fails",
  "bottleneck",
  "appendix",
];

const NEGATIVE_SIGNAL_TERMS = ["survey", "tutorial", "opinion", "position paper"];

const PROBLEM_EVIDENCE_PATTERNS: Array<{ role: EvidenceRole; pattern: RegExp }> = [
  { role: "limitation", pattern: /\b(limitation|limitations|limited by|we limit|our analysis has several limitations)\b/i },
  { role: "future_work", pattern: /\b(future work|future direction|future directions|open problem|next step|next steps|promising direction)\b/i },
  { role: "failure_mode", pattern: /\b(failure mode|fails?|failure|brittle|breaks down|does not generalize|degrades|unstable)\b/i },
  { role: "negative_result", pattern: /\b(negative result|underperform|worse than|did not improve|no improvement|unsuccessful)\b/i },
  { role: "benchmark_gap", pattern: /\b(benchmark gap|not covered by|uncovered|missing benchmark|evaluation gap|not evaluated)\b/i },
];

const FEASIBILITY_EVIDENCE_PATTERN =
  /\b(public|benchmark|benchmarks|dataset|datasets|github|repository|repo|source code|code is available|baseline|accuracy|f1|auc|precision|recall|error|domainbed|imagenet|cifar|mnist|ngsim)\b/i;

const GENERIC_EXPERIMENT_PATTERN =
  /^reproduce the paper's baseline setting on public data, add one focused ablation targeting the cited failure mode/i;

const GENERIC_INTERVENTION_PATTERN = /^design a paper-specific ablation around this stated gap/i;

const SOLVED_PRIOR_ART_PATTERN =
  /\bto address (?:this|these) limitations?\b/i;

const HUMAN_STUDY_INTERVENTION_PATTERN =
  /\b(participant base|participants?|cohorts?|human subjects?|user stud(?:y|ies)|classroom|students?|interviews?|survey respondents?)\b/i;

const WET_LAB_TERMS = [
  "wet lab",
  "in vivo",
  "in vitro",
  "animal study",
  "patient recruitment",
  "clinical trial",
  "surgical deployment",
  "field deployment",
  "human subjects",
  "irb",
  "lab assay",
];

const PRIVATE_DATA_TERMS = [
  "private dataset",
  "proprietary dataset",
  "closed-source",
  "restricted access",
  "internal dataset",
  "non-public dataset",
  "confidential data",
];

const UNSANDBOXED_RISK_PATTERNS = [
  /\bmalware\b/i,
  /\bexploit(?:s|ed|ing)?\b/i,
  /\bzero-day\b/i,
  /\bvulnerabilit(?:y|ies)\b/i,
  /\bproof-of-concept\b/i,
  /\bpo[cs]\b/i,
  /\barbitrary code execution\b/i,
  /\blive target\b/i,
  /\breal-world attack\b/i,
  /\boffensive operation\b/i,
];

const REQUEST_TIMEOUT_MS = 45_000;
const RESOURCE_VERIFY_TIMEOUT_MS = 12_000;

const RESOURCE_HOST_PATTERNS = [
  /(^|\.)github\.com$/i,
  /(^|\.)gitlab\.com$/i,
  /(^|\.)bitbucket\.org$/i,
  /(^|\.)huggingface\.co$/i,
  /(^|\.)paperswithcode\.com$/i,
  /(^|\.)zenodo\.org$/i,
  /(^|\.)figshare\.com$/i,
  /(^|\.)kaggle\.com$/i,
  /(^|\.)osf\.io$/i,
  /(^|\.)dataverse\.harvard\.edu$/i,
  /(^|\.)openml\.org$/i,
  /(^|\.)archive\.ics\.uci\.edu$/i,
  /(^|\.)cs\.toronto\.edu$/i,
  /(^|\.)image-net\.org$/i,
];

const IGNORED_RESOURCE_URL_PATTERNS = [
  /github\.com\/arxiv\/html_feedback/i,
  /github\.com\/brucemiller\/latexml/i,
  /github\.com\/dginev\/latexml/i,
  /github\.com\/arxiv-vanity/i,
];

const RAW_CANDIDATE_JSON_SCHEMA =
  "{\"candidate_problem\":string,\"evidence_spans\":string[],\"problem_evidence_spans\":string[],\"feasibility_evidence_spans\":string[],\"evidence_role\":\"limitation\"|\"future_work\"|\"failure_mode\"|\"negative_result\"|\"benchmark_gap\"|\"positive_result_only\",\"why_hidden_or_underexploited\":string,\"auto_research_experiment\":string,\"available_data_or_benchmark\":string,\"expected_metric\":string,\"specific_intervention\":string,\"baseline\":string,\"metric\":string,\"paper_status\":\"active\"|\"withdrawn\"|\"unknown\",\"code_or_data_status\":\"found\"|\"claimed\"|\"not_found\"|\"unknown\",\"paper_status_sources\":string[],\"paper_status_evidence\":string[],\"code_or_data_urls\":string[],\"code_or_data_sources\":string[],\"code_or_data_evidence\":string[],\"time_budget_hours\":number,\"impact_type\":\"economic\"|\"climate/environment\"|\"health\"|\"safety\"|\"science\"|\"developer productivity\",\"story_angle\":string,\"disqualifiers\":string[],\"confidence\":number}";

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(value: string): string {
  const noScripts = value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ");
  return normalizeWhitespace(decodeEntities(noScripts.replace(/<[^>]+>/g, " ")));
}

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

function nowTag(): string {
  const now = new Date();
  const iso = now.toISOString().replace(/[:]/g, "-").replace(/\..+$/, "");
  return iso;
}

function toPositiveInt(input: string | undefined, fallback: number, name: string): number {
  if (!input) {
    return fallback;
  }
  const parsed = Number.parseInt(input, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid --${name}: ${input}`);
  }
  return parsed;
}

function toNonNegativeFloat(input: string | undefined, fallback: number, name: string): number {
  if (!input) {
    return fallback;
  }
  const parsed = Number.parseFloat(input);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid --${name}: ${input}`);
  }
  return parsed;
}

function parseImpactType(input: string): ImpactType {
  const normalized = normalizeWhitespace(input.toLowerCase());
  if ((IMPACT_TYPES as readonly string[]).includes(normalized)) {
    return normalized as ImpactType;
  }
  return "science";
}

function parseEvidenceRole(input: string): EvidenceRole {
  const normalized = normalizeWhitespace(input.toLowerCase()).replace(/[\s-]+/g, "_");
  const roles = new Set<string>([
    "limitation",
    "future_work",
    "failure_mode",
    "negative_result",
    "benchmark_gap",
    "positive_result_only",
  ]);
  if (roles.has(normalized)) {
    return normalized as EvidenceRole;
  }
  return "positive_result_only";
}

function parsePaperStatus(input: string): PaperStatus {
  const normalized = normalizeWhitespace(input.toLowerCase());
  if (new Set<string>(["active", "withdrawn", "unknown"]).has(normalized)) {
    return normalized as PaperStatus;
  }
  return "unknown";
}

function parseCodeOrDataStatus(input: string): CodeOrDataStatus {
  const normalized = normalizeWhitespace(input.toLowerCase()).replace(/[\s-]+/g, "_");
  if (new Set<string>(["found", "claimed", "not_found", "unknown"]).has(normalized)) {
    return normalized as CodeOrDataStatus;
  }
  return "unknown";
}

function parseStringArray(input: unknown, max: number): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .map((item) => normalizeWhitespace(String(item)))
    .filter(Boolean)
    .slice(0, max);
}

function safeSubstring(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }
  return `${input.slice(0, maxLength - 3)}...`;
}

function splitSentences(text: string): string[] {
  const protectedText = [
    /\bet al\./gi,
    /\be\.g\./gi,
    /\bi\.e\./gi,
    /\bvs\./gi,
    /\bfig\./gi,
    /\beq\./gi,
    /\bsec\./gi,
    /\bdr\./gi,
    /\bprof\./gi,
    /\bmr\./gi,
    /\bms\./gi,
  ].reduce((value, pattern) => value.replace(pattern, (match) => match.replace(/\./g, "<DOT>")), normalizeWhitespace(text));

  return protectedText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replaceAll("<DOT>", ".").trim())
    .filter((sentence) => sentence.length > 30);
}

function normalizeUrl(rawUrl: string): string | null {
  const trimmed = rawUrl
    .trim()
    .replace(/[),.;:\]]+$/g, "")
    .replace(/^["'(<[]+/, "");

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function resourceHostAllowed(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return (
      RESOURCE_HOST_PATTERNS.some((pattern) => pattern.test(hostname)) &&
      !IGNORED_RESOURCE_URL_PATTERNS.some((pattern) => pattern.test(url))
    );
  } catch {
    return false;
  }
}

function canonicalResourceUrl(url: string): string {
  const parsed = new URL(url);
  if (parsed.hostname.toLowerCase() === "github.com") {
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length >= 2) {
      parsed.pathname = `/${segments[0]}/${segments[1]}`;
      parsed.search = "";
    }
  }
  return parsed.toString();
}

export function extractConcreteResourceUrls(text: string): string[] {
  const urls = new Set<string>();
  for (const match of text.matchAll(/https?:\/\/[^\s<>"'`]+/g)) {
    const normalized = normalizeUrl(match[0]);
    if (normalized && resourceHostAllowed(normalized)) {
      urls.add(canonicalResourceUrl(normalized));
    }
  }
  return Array.from(urls).sort();
}

function knownBenchmarkResourceUrls(text: string): string[] {
  const lower = text.toLowerCase();
  const urls = new Set<string>();

  if (/\bdomainbed\b/.test(lower)) {
    urls.add("https://github.com/facebookresearch/DomainBed");
  }
  if (/\bimagenet\b|\bimage net\b/.test(lower)) {
    urls.add("https://www.image-net.org/");
  }
  if (/\bcifar(?:-?10|-?100)?\b/.test(lower)) {
    urls.add("https://www.cs.toronto.edu/~kriz/cifar.html");
  }
  if (/\bmnist\b/.test(lower)) {
    urls.add("https://yann.lecun.com/exdb/mnist/");
  }
  if (/\bopenml\b/.test(lower)) {
    urls.add("https://www.openml.org/");
  }
  if (/\buci\b|\buci machine learning repository\b/.test(lower)) {
    urls.add("https://archive.ics.uci.edu/");
  }

  return Array.from(urls).sort();
}

function extractLinksFromHtml(html: string): string[] {
  const urls = new Set<string>();
  for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const normalized = normalizeUrl(match[1]);
    if (normalized) {
      urls.add(normalized);
    }
  }
  return Array.from(urls).sort();
}

function extractTagContent(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(regex);
  return normalizeWhitespace(decodeEntities(match?.[1] ?? ""));
}

function extractAttributes(tagText: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of tagText.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)=["']([^"']*)["']/g)) {
    attrs[match[1]] = decodeEntities(match[2]);
  }
  return attrs;
}

function arxivIdFromUrl(url: string): string {
  const match = url.match(/\/abs\/([^?#]+)/i);
  if (match?.[1]) {
    return match[1];
  }
  return url;
}

function canonicalArxivId(id: string): string {
  return id.replace(/v\d+$/i, "");
}

function parseArxivDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date(0).toISOString();
  }
  return date.toISOString();
}

export function parseArxivFeed(xml: string): ArxivPaper[] {
  const results: ArxivPaper[] = [];
  for (const entryMatch of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entry = entryMatch[1];
    const idUrl = extractTagContent(entry, "id");
    const id = arxivIdFromUrl(idUrl);
    const canonicalId = canonicalArxivId(id);

    const title = extractTagContent(entry, "title");
    const abstract = extractTagContent(entry, "summary");
    const comments = extractTagContent(entry, "arxiv:comment");
    const published = parseArxivDate(extractTagContent(entry, "published"));
    const updated = parseArxivDate(extractTagContent(entry, "updated"));

    const authors: string[] = [];
    for (const authorMatch of entry.matchAll(/<author>([\s\S]*?)<\/author>/g)) {
      const name = extractTagContent(authorMatch[1], "name");
      if (name) {
        authors.push(name);
      }
    }

    const subjects: string[] = [];
    let primarySubject = "";
    for (const categoryMatch of entry.matchAll(/<category\s+([^>]*?)\/?>(?:<\/category>)?/g)) {
      const attrs = extractAttributes(categoryMatch[1]);
      const term = attrs.term?.trim();
      if (term && !subjects.includes(term)) {
        subjects.push(term);
      }
    }

    const primaryMatch = entry.match(/<arxiv:primary_category\s+([^>]*?)\/?>(?:<\/arxiv:primary_category>)?/i);
    if (primaryMatch) {
      const attrs = extractAttributes(primaryMatch[1]);
      primarySubject = attrs.term?.trim() ?? "";
    }

    let pdfUrl = `https://arxiv.org/pdf/${id}.pdf`;
    let absUrl = `https://arxiv.org/abs/${id}`;

    for (const linkMatch of entry.matchAll(/<link\s+([^>]*?)\/?>(?:<\/link>)?/g)) {
      const attrs = extractAttributes(linkMatch[1]);
      if (attrs.href && attrs.rel === "alternate") {
        absUrl = attrs.href;
      }
      if (attrs.href && (attrs.title === "pdf" || attrs.type === "application/pdf")) {
        pdfUrl = attrs.href;
      }
    }

    if (!title || !abstract || !id) {
      continue;
    }

    results.push({
      id,
      canonical_id: canonicalId,
      title,
      abstract,
      comments,
      subjects,
      primary_subject: primarySubject || subjects[0] || "unknown",
      authors,
      abs_url: absUrl,
      pdf_url: pdfUrl,
      published_at: published,
      updated_at: updated,
    });
  }
  return results;
}

function scoreAbstractSignal(paper: ArxivPaper): number {
  const text = `${paper.title} ${paper.abstract} ${paper.comments}`.toLowerCase();
  let score = 0;

  for (const term of POSITIVE_SIGNAL_TERMS) {
    if (text.includes(term)) {
      score += 2;
    }
  }

  for (const term of NEGATIVE_SIGNAL_TERMS) {
    if (text.includes(term)) {
      score -= 2;
    }
  }

  if (/\b(benchmark|dataset|code|github|public)\b/.test(text)) {
    score += 2;
  }

  if (/\b(limitations?|future work|discussion|conclusion)\b/.test(text)) {
    score += 2;
  }

  if (/\b(agent|reasoning|safety|alignment|biomedical|genomics|protein)\b/.test(text)) {
    score += 1;
  }

  return score;
}

function classifyHeading(heading: string): keyof Omit<PaperSections, "raw_text"> | null {
  const normalized = normalizeWhitespace(stripHtml(heading).toLowerCase());
  if (!normalized) {
    return null;
  }
  if (normalized.includes("introduction") || normalized.startsWith("background")) {
    return "introduction";
  }
  if (
    normalized.includes("limitation") ||
    normalized.includes("threats to validity") ||
    normalized.includes("failure mode") ||
    normalized.includes("error analysis")
  ) {
    return "limitations";
  }
  if (
    normalized.includes("future work") ||
    normalized.includes("next steps") ||
    normalized.includes("open problem") ||
    normalized.includes("outlook")
  ) {
    return "future_work";
  }
  if (normalized.includes("discussion")) {
    return "discussion";
  }
  if (normalized.includes("conclusion") || normalized.includes("concluding")) {
    return "conclusion";
  }
  if (normalized.includes("appendix") || normalized.includes("supplementary")) {
    return "appendix";
  }
  return null;
}

function blankSections(): PaperSections {
  return {
    introduction: "",
    discussion: "",
    limitations: "",
    future_work: "",
    conclusion: "",
    appendix: "",
    raw_text: "",
  };
}

export function extractSectionsFromHtml(html: string): PaperSections {
  const sections = blankSections();
  const bodyMatch =
    html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i) ??
    html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i) ??
    html.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  const body = bodyMatch?.[1] ?? html;

  sections.raw_text = safeSubstring(stripHtml(body), 60_000);

  const headingRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings = Array.from(body.matchAll(headingRegex));
  if (headings.length === 0) {
    sections.discussion = safeSubstring(sections.raw_text, 12_000);
    return sections;
  }

  for (let i = 0; i < headings.length; i += 1) {
    const current = headings[i];
    const next = headings[i + 1];
    if (current.index === undefined) {
      continue;
    }

    const headingText = stripHtml(current[2] ?? "");
    const sectionKey = classifyHeading(headingText);
    if (!sectionKey) {
      continue;
    }

    const segmentStart = current.index + current[0].length;
    const segmentEnd = next?.index ?? body.length;
    const segmentText = safeSubstring(stripHtml(body.slice(segmentStart, segmentEnd)), 12_000);
    if (!segmentText) {
      continue;
    }

    const existing = sections[sectionKey];
    sections[sectionKey] = existing
      ? safeSubstring(`${existing}\n\n${segmentText}`, 16_000)
      : segmentText;
  }

  if (!sections.discussion) {
    sections.discussion = safeSubstring(sections.raw_text, 6_000);
  }

  return sections;
}

function buildFullText(paper: ArxivPaper, sections: PaperSections): string {
  return [
    `TITLE: ${paper.title}`,
    `ABSTRACT: ${paper.abstract}`,
    sections.introduction ? `INTRODUCTION: ${sections.introduction}` : "",
    sections.discussion ? `DISCUSSION: ${sections.discussion}` : "",
    sections.limitations ? `LIMITATIONS: ${sections.limitations}` : "",
    sections.future_work ? `FUTURE WORK: ${sections.future_work}` : "",
    sections.conclusion ? `CONCLUSION: ${sections.conclusion}` : "",
    sections.appendix ? `APPENDIX: ${sections.appendix}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function extractEvidenceSentences(text: string, max: number): string[] {
  const sentences = splitSentences(text);

  const evidence: string[] = [];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const hasSignal = POSITIVE_SIGNAL_TERMS.some((term) => lower.includes(term));
    if (hasSignal && !evidence.includes(sentence)) {
      evidence.push(safeSubstring(sentence, 320));
      if (evidence.length >= max) {
        return evidence;
      }
    }
  }

  for (const sentence of sentences) {
    if (!evidence.includes(sentence)) {
      evidence.push(safeSubstring(sentence, 320));
      if (evidence.length >= max) {
        break;
      }
    }
  }

  return evidence;
}

function classifyEvidenceRole(sentence: string): EvidenceRole {
  for (const { role, pattern } of PROBLEM_EVIDENCE_PATTERNS) {
    if (pattern.test(sentence)) {
      return role;
    }
  }
  return "positive_result_only";
}

function evidenceRolePriority(role: EvidenceRole): number {
  switch (role) {
    case "future_work":
      return 5;
    case "benchmark_gap":
      return 4;
    case "negative_result":
      return 3;
    case "failure_mode":
      return 2;
    case "limitation":
      return 1;
    case "positive_result_only":
      return 0;
  }
}

function extractRoleEvidenceSentences(
  text: string,
  max: number,
): Array<{ span: string; role: EvidenceRole }> {
  const sentences = splitSentences(text);

  const evidence: Array<{ span: string; role: EvidenceRole }> = [];
  for (const sentence of sentences) {
    const role = classifyEvidenceRole(sentence);
    if (role === "positive_result_only") {
      continue;
    }
    const span = safeSubstring(sentence, 480);
    if (!evidence.some((item) => item.span === span)) {
      evidence.push({ span, role });
    }
  }

  return evidence
    .sort((a, b) => evidenceRolePriority(b.role) - evidenceRolePriority(a.role))
    .slice(0, max);
}

function extractFeasibilityEvidenceSentences(text: string, max: number): string[] {
  const sentences = splitSentences(text);

  const evidence: string[] = [];
  for (const sentence of sentences) {
    if (!FEASIBILITY_EVIDENCE_PATTERN.test(sentence)) {
      continue;
    }
    const span = safeSubstring(sentence, 480);
    if (!evidence.includes(span)) {
      evidence.push(span);
      if (evidence.length >= max) {
        break;
      }
    }
  }
  return evidence;
}

function inferImpactType(text: string): ImpactType {
  const lower = text.toLowerCase();
  if (/(econom|market|cost|business|revenue)/.test(lower)) {
    return "economic";
  }
  if (/(climate|carbon|energy|environment|sustainability)/.test(lower)) {
    return "climate/environment";
  }
  if (/(health|clinical|biomedical|patient|disease|drug)/.test(lower)) {
    return "health";
  }
  if (/(safety|alignment|security|harm|trust|attack)/.test(lower)) {
    return "safety";
  }
  if (/(developer|software|code|tooling|programming)/.test(lower)) {
    return "developer productivity";
  }
  return "science";
}

function inferMetric(text: string): string {
  const lower = text.toLowerCase();
  if (/\bf1\b/.test(lower)) {
    return "Primary benchmark F1 improvement against baseline.";
  }
  if (/\bauc\b/.test(lower)) {
    return "Primary benchmark AUC improvement against baseline.";
  }
  if (/(precision|recall)/.test(lower)) {
    return "Primary benchmark precision/recall trade-off against baseline.";
  }
  if (/(accuracy|error rate)/.test(lower)) {
    return "Primary benchmark accuracy/error improvement against baseline.";
  }
  if (/(safety|attack|exploit|security)/.test(lower)) {
    return "Safety benchmark success/failure rate and false-positive/false-negative trade-offs.";
  }
  if (/(runtime|latency|throughput|compute|token)/.test(lower)) {
    return "Quality-cost frontier: output quality versus compute/token cost.";
  }
  return "Pre-registered measurable delta on a public benchmark metric versus baseline.";
}

function inferBenchmarkHint(paper: ArxivPaper, text: string): string {
  const combined = `${paper.comments} ${text}`.toLowerCase();
  if (/(github|repository|repo|source code|code is available)/.test(combined)) {
    return "Author-provided code repository plus public benchmark datasets referenced in the paper.";
  }
  if (/(dataset|benchmark|public)/.test(combined)) {
    return "Public datasets or benchmarks referenced by the paper; use reported protocol for replication.";
  }
  return "Public benchmark related to the paper's main task; start with reproduction from abstract and references.";
}

function inferCodeOrDataStatus(text: string): CodeOrDataStatus {
  const lower = text.toLowerCase();
  if (extractConcreteResourceUrls(text).length > 0 || knownBenchmarkResourceUrls(text).length > 0) {
    return "found";
  }
  if (/https?:\/\/(www\.)?github\.com|github\.com|code is available|source code (?:is )?available|repository at/.test(lower)) {
    return "found";
  }
  if (/\b(public|benchmark|benchmarks|dataset|datasets|github|repository|repo|source code|open-source)\b/.test(lower)) {
    return "claimed";
  }
  if (PRIVATE_DATA_TERMS.some((term) => lower.includes(term))) {
    return "not_found";
  }
  return "unknown";
}

function inferPaperStatus(paper: ArxivPaper, paperText: PaperText): PaperStatus {
  const text = `${paper.title} ${paper.abstract} ${paper.comments} ${paperText.full_text}`.toLowerCase();
  if (/\bwithdrawn\b|\bthis paper has been withdrawn\b/.test(text)) {
    return "withdrawn";
  }
  return "active";
}

function cleanInterventionPhrase(value: string): string {
  return normalizeWhitespace(value)
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/[.;:]+$/g, "")
    .trim();
}

function inferSpecificIntervention(problemSpan: string, paper: ArxivPaper): string {
  const span = normalizeWhitespace(problemSpan);
  if (/\bsimulated annealing\b/i.test(span) || /\btabu search\b/i.test(span)) {
    return safeSubstring(
      `Compare the paper's greedy optimisation procedure against simulated annealing and tabu search in the ${paper.title} setup`,
      260,
    );
  }

  const futureWorkIsInMatch = span.match(/\bfuture work is in\s+(.+)/i);
  if (futureWorkIsInMatch?.[1]) {
    return safeSubstring(`Evaluate ${cleanInterventionPhrase(futureWorkIsInMatch[1])} in the ${paper.title} setup`, 260);
  }

  const futureMatch = span.match(/\b(?:future work|future directions?|next steps?|promising direction)[^;:,-]*(?:include|includes|address|explore|investigate|extend|improve|develop|test|evaluate|consider)\s+(.+)/i);
  if (futureMatch?.[1]) {
    return safeSubstring(`Evaluate ${cleanInterventionPhrase(futureMatch[1])} in the ${paper.title} setup`, 260);
  }

  const limitationMatch = span.match(/\b(?:limitation|limitations|limited by|fails?|failure mode|degrades|unstable)[^.!?]*\b(?:under|when|on|for|with|because of)\s+([^.!?]+)/i);
  if (limitationMatch?.[1]) {
    return safeSubstring(`Stress-test and mitigate ${cleanInterventionPhrase(limitationMatch[1])} in the ${paper.title} setup`, 260);
  }

  return safeSubstring(`Design a paper-specific ablation around this stated gap in ${paper.title}: ${span}`, 260);
}

function inferBaseline(paper: ArxivPaper): string {
  return `The reported baseline/protocol from ${paper.title}.`;
}

function inferMetricName(expectedMetric: string): string {
  const lower = expectedMetric.toLowerCase();
  if (lower.includes("f1")) {
    return "F1";
  }
  if (lower.includes("auc")) {
    return "AUC";
  }
  if (lower.includes("accuracy")) {
    return "accuracy";
  }
  if (lower.includes("latency")) {
    return "latency";
  }
  if (lower.includes("cost")) {
    return "cost";
  }
  if (lower.includes("error")) {
    return "error rate";
  }
  return "pre-registered benchmark delta";
}

function heuristicCandidatesFromPaper(
  paper: ArxivPaper,
  paperText: PaperText,
  config: ExperimentConfig,
): RawCandidate[] {
  const focusText = [
    paperText.sections.limitations,
    paperText.sections.future_work,
    paperText.sections.discussion,
    paperText.sections.conclusion,
  ]
    .filter(Boolean)
    .join(" ");

  const problemEvidence = extractRoleEvidenceSentences(focusText, Math.max(config.candidate_per_paper, 1) * 2);
  const feasibilityEvidence = extractFeasibilityEvidenceSentences(
    `${paper.comments} ${paper.abstract} ${paperText.full_text}`,
    config.max_evidence_spans,
  );
  const sourceText = `${paper.comments} ${paper.abstract} ${paperText.full_text} ${(paperText.external_urls ?? []).join(" ")}`;
  const concreteResourceUrls = Array.from(
    new Set([...extractConcreteResourceUrls(sourceText), ...knownBenchmarkResourceUrls(sourceText)]),
  );

  if (problemEvidence.length === 0) {
    return [];
  }

  const candidates: RawCandidate[] = [];
  for (let i = 0; i < Math.min(config.candidate_per_paper, problemEvidence.length); i += 1) {
    const { span, role } = problemEvidence[i];
    const impactType = inferImpactType(`${paper.title} ${focusText}`);
    const metric = inferMetric(`${paper.title} ${span}`);
    const dataHint = inferBenchmarkHint(paper, focusText);
    const specificIntervention = inferSpecificIntervention(span, paper);

    candidates.push({
      paper_id: paper.id,
      candidate_problem: `Test whether ${specificIntervention} addresses a stated ${role.replace(/_/g, " ")} in ${paper.title}.`,
      evidence_spans: [span, ...feasibilityEvidence],
      problem_evidence_spans: [span],
      feasibility_evidence_spans: feasibilityEvidence,
      evidence_role: role,
      why_hidden_or_underexploited:
        `The candidate is grounded in an explicit ${role.replace(/_/g, " ")} span rather than a positive-result claim.`,
      auto_research_experiment: `Reproduce ${inferBaseline(paper)} Then apply this intervention: ${specificIntervention}. Compare against the baseline under the same data, split, and compute budget.`,
      available_data_or_benchmark: dataHint,
      expected_metric: metric,
      specific_intervention: specificIntervention,
      baseline: inferBaseline(paper),
      metric: inferMetricName(metric),
      paper_status: inferPaperStatus(paper, paperText),
      code_or_data_status: inferCodeOrDataStatus(sourceText),
      paper_status_sources: [],
      paper_status_evidence: [],
      code_or_data_urls: concreteResourceUrls,
      code_or_data_sources: concreteResourceUrls,
      code_or_data_evidence: concreteResourceUrls.map((url) => `Concrete public resource URL found in source text: ${url}`),
      time_budget_hours: 48,
      impact_type: impactType,
      story_angle:
        "A paper-author-supported gap can be turned into a visible, bounded benchmark comparison.",
      disqualifiers: [],
      confidence: 0.58,
    });
  }

  return candidates;
}

function normalizeRawCandidate(candidate: Partial<RawCandidate>, paperId: string): RawCandidate {
  const problemEvidence = (candidate.problem_evidence_spans ?? candidate.evidence_spans ?? [])
    .map((span) => normalizeWhitespace(String(span)))
    .filter(Boolean)
    .slice(0, 8);
  const feasibilityEvidence = (candidate.feasibility_evidence_spans ?? [])
    .map((span) => normalizeWhitespace(String(span)))
    .filter(Boolean)
    .slice(0, 8);
  const combinedEvidence = (candidate.evidence_spans ?? [...problemEvidence, ...feasibilityEvidence])
    .map((span) => normalizeWhitespace(String(span)))
    .filter(Boolean)
    .slice(0, 12);
  const inferredRole = problemEvidence[0] ? classifyEvidenceRole(problemEvidence[0]) : "positive_result_only";

  return {
    paper_id: paperId,
    candidate_problem: normalizeWhitespace(candidate.candidate_problem ?? "Candidate problem missing."),
    evidence_spans: combinedEvidence.length > 0 ? combinedEvidence : [...problemEvidence, ...feasibilityEvidence],
    problem_evidence_spans: problemEvidence,
    feasibility_evidence_spans: feasibilityEvidence,
    evidence_role: parseEvidenceRole(String(candidate.evidence_role ?? inferredRole)),
    why_hidden_or_underexploited: normalizeWhitespace(candidate.why_hidden_or_underexploited ?? ""),
    auto_research_experiment: normalizeWhitespace(candidate.auto_research_experiment ?? ""),
    available_data_or_benchmark: normalizeWhitespace(candidate.available_data_or_benchmark ?? ""),
    expected_metric: normalizeWhitespace(candidate.expected_metric ?? ""),
    specific_intervention: normalizeWhitespace(candidate.specific_intervention ?? ""),
    baseline: normalizeWhitespace(candidate.baseline ?? ""),
    metric: normalizeWhitespace(candidate.metric ?? ""),
    paper_status: parsePaperStatus(String(candidate.paper_status ?? "unknown")),
    code_or_data_status: parseCodeOrDataStatus(String(candidate.code_or_data_status ?? "unknown")),
    paper_status_sources: parseStringArray(candidate.paper_status_sources, 12),
    paper_status_evidence: parseStringArray(candidate.paper_status_evidence, 12),
    code_or_data_urls: parseStringArray(candidate.code_or_data_urls, 20)
      .map((url) => normalizeUrl(url))
      .filter((url): url is string => Boolean(url)),
    code_or_data_sources: parseStringArray(candidate.code_or_data_sources, 20),
    code_or_data_evidence: parseStringArray(candidate.code_or_data_evidence, 20),
    time_budget_hours: clamp(Math.round(Number(candidate.time_budget_hours ?? 72)), 1, 240),
    impact_type: parseImpactType(String(candidate.impact_type ?? "science")),
    story_angle: normalizeWhitespace(candidate.story_angle ?? ""),
    disqualifiers: (candidate.disqualifiers ?? [])
      .map((item) => normalizeWhitespace(String(item)))
      .filter(Boolean)
      .slice(0, 8),
    confidence: clamp(Number(candidate.confidence ?? 0.5), 0, 1),
  };
}

function parseJsonBlob(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Model returned empty text");
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : trimmed;

  try {
    return JSON.parse(raw);
  } catch {
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
    }
  }

  throw new Error("Unable to parse model JSON output");
}

class GeminiJsonClient {
  constructor(private readonly apiKey: string, private readonly model: string) {}

  async generateJson<T>(prompt: string): Promise<LlmJsonResult<T>> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model,
    )}:generateContent`;

    const response = await fetch(endpoint, {
      method: "POST",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini request failed (${response.status}): ${safeSubstring(errorText, 400)}`);
    }

    const body = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };

    const responseText =
      body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ?? "";

    const parsed = parseJsonBlob(responseText) as T;

    return {
      data: parsed,
      usage: {
        prompt_tokens: body.usageMetadata?.promptTokenCount ?? 0,
        completion_tokens: body.usageMetadata?.candidatesTokenCount ?? 0,
        total_tokens: body.usageMetadata?.totalTokenCount ?? 0,
      },
    };
  }
}

function llmV1InstructionLines(config: ExperimentConfig): string[] {
  return [
    "You are extracting computationally testable latent research problems from a fresh arXiv paper.",
    "Return strict JSON only with this schema:",
    `{"candidates":[${RAW_CANDIDATE_JSON_SCHEMA}]}`,
    `Return at most ${config.candidate_per_paper} candidates.`,
    "Reject vague ideas. Each candidate must include author-supported problem evidence and separate feasibility evidence.",
    "Problem evidence must come from limitations, future work, error analysis, failure modes, benchmark gaps, or negative results. Do not use a positive result as problem evidence.",
    "Each candidate must name a specific intervention, baseline, and metric. Generic plans like 'reproduce and add an ablation' are invalid.",
    "If you cite code/data availability, include concrete URLs in code_or_data_urls. If no concrete URL is visible, set code_or_data_status to claimed or unknown, not found.",
    "If venue metadata says withdrawn, set paper_status to withdrawn and include the status source/evidence.",
    "Hard disqualify if wet-lab/private-data/unbounded compute is required.",
  ];
}

function llmV1Prompt(paper: ArxivPaper, paperText: PaperText, config: ExperimentConfig): string {
  const context = safeSubstring(paperText.full_text, 24_000);
  return [
    ...llmV1InstructionLines(config),
    "Paper metadata:",
    `ID: ${paper.id}`,
    `Title: ${paper.title}`,
    `Subjects: ${paper.subjects.join(", ")}`,
    "Paper text:",
    context,
  ].join("\n\n");
}

function llmV2InstructionLines(): string[] {
  return [
    "You are a strict verifier for research-candidate quality.",
    "Return strict JSON only with this schema:",
    `{"accepted":boolean,"rejection_reasons":string[],"score_breakdown":{"auto_research_feasibility":number,"falsifiable_evaluation":number,"problem_clarity":number,"novelty_or_neglectedness":number,"impact":number,"storyability":number,"total":number},"candidate_patch":${RAW_CANDIDATE_JSON_SCHEMA}}`,
    "Scoring rubric weights: feasibility 25, falsifiable 20, clarity 15, novelty 15, impact 15, storyability 10.",
    "Reject if: no source-backed problem evidence; evidence is positive-result-only; no feasibility evidence; no specific intervention/baseline/metric; no verified concrete public code/data/benchmark URL; wet-lab/private data/unavailable compute; pure survey path; unsandboxed legal/safety risk.",
    "Reject withdrawn papers. Do not promote code_or_data_status=found unless a concrete verified URL is present in code_or_data_urls.",
  ];
}

function llmV2Prompt(candidate: RawCandidate, paper: ArxivPaper, paperText: PaperText): string {
  const context = safeSubstring(paperText.full_text, 18_000);
  return [
    ...llmV2InstructionLines(),
    "Paper metadata:",
    `ID: ${paper.id}`,
    `Title: ${paper.title}`,
    "Candidate:",
    JSON.stringify(candidate, null, 2),
    "Paper text:",
    context,
  ].join("\n\n");
}

function scoreCandidate(candidate: RawCandidate): ScoreBreakdown {
  const candidateText = [
    candidate.candidate_problem,
    candidate.auto_research_experiment,
    candidate.available_data_or_benchmark,
    candidate.specific_intervention,
    candidate.baseline,
    candidate.metric,
    candidate.feasibility_evidence_spans.join(" "),
    candidate.code_or_data_urls.join(" "),
    candidate.code_or_data_evidence.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  let feasibility = 0;
  if (candidate.time_budget_hours <= 72) {
    feasibility += 6;
  } else if (candidate.time_budget_hours <= 120) {
    feasibility += 3;
  } else {
    feasibility += 1;
  }
  if (candidate.code_or_data_status === "found" && candidate.code_or_data_urls.length > 0) {
    feasibility += 10;
  } else if (candidate.code_or_data_status === "claimed") {
    feasibility += 4;
  } else if (candidate.code_or_data_status === "unknown") {
    feasibility += 2;
  }
  if (candidate.feasibility_evidence_spans.length > 0 && /(public|benchmark|dataset|github|kaggle|open|accuracy|f1|auc)/.test(candidateText)) {
    feasibility += 5;
  }
  if (candidate.specific_intervention.length >= 30 && candidate.baseline.length >= 20) {
    feasibility += 7;
  }
  feasibility = clamp(feasibility, 0, 25);

  let falsifiable = 0;
  if (candidate.expected_metric.length >= 20 && candidate.metric.length >= 3) {
    falsifiable += 8;
  }
  if (/(accuracy|f1|auc|error|rate|latency|throughput|cost|success|precision|recall)/.test(`${candidate.expected_metric} ${candidate.metric}`.toLowerCase())) {
    falsifiable += 8;
  }
  if (/\d|%|delta|improv|drop|increase|decrease|baseline|compare|versus/.test(candidate.expected_metric.toLowerCase())) {
    falsifiable += 4;
  }
  falsifiable = clamp(falsifiable, 0, 20);

  let clarity = 0;
  const problemLength = candidate.candidate_problem.length;
  if (problemLength >= 60 && problemLength <= 360) {
    clarity += 10;
  } else if (problemLength >= 30) {
    clarity += 6;
  }
  if (candidate.specific_intervention.length >= 30 && candidate.baseline.length >= 20) {
    clarity += 5;
  }
  clarity = clamp(clarity, 0, 15);

  let novelty = 0;
  if (candidate.evidence_role !== "positive_result_only" && candidate.problem_evidence_spans.length > 0) {
    novelty += 10;
  }
  if (candidate.evidence_role === "future_work" || candidate.evidence_role === "limitation") {
    novelty += 3;
  }
  if (/(not in abstract|hidden|underused|overlooked|author-supported|explicit)/.test(candidate.why_hidden_or_underexploited.toLowerCase())) {
    novelty += 5;
  }
  novelty = clamp(novelty, 0, 15);

  let impact = 8;
  if (candidate.impact_type === "health" || candidate.impact_type === "safety") {
    impact = 12;
  }
  if (candidate.impact_type === "economic" || candidate.impact_type === "climate/environment") {
    impact = 10;
  }
  if (candidate.story_angle.toLowerCase().includes("real-world")) {
    impact += 2;
  }
  if (candidate.paper_status === "withdrawn") {
    impact -= 4;
  }
  impact = clamp(impact, 0, 15);

  let storyability = 0;
  if (candidate.story_angle.length >= 50) {
    storyability += 5;
  }
  if (/(despite|however|unexpected|counterintuitive|surprising)/.test(candidate.story_angle.toLowerCase())) {
    storyability += 3;
  }
  if (candidate.time_budget_hours <= 72) {
    storyability += 2;
  }
  storyability = clamp(storyability, 0, 10);

  let total = feasibility + falsifiable + clarity + novelty + impact + storyability;
  if (candidate.code_or_data_status === "unknown") {
    total = Math.min(total, 72);
  }
  if (candidate.code_or_data_status === "claimed") {
    total = Math.min(total, 74);
  }
  if (candidate.code_or_data_status === "not_found") {
    total = Math.min(total, 62);
  }
  if (candidate.code_or_data_status === "found" && candidate.code_or_data_urls.length === 0) {
    total = Math.min(total, 70);
  }
  if (candidate.paper_status === "withdrawn") {
    total = Math.min(total, 74);
  }
  if (candidate.evidence_role === "positive_result_only") {
    total = Math.min(total, 45);
  }

  return {
    auto_research_feasibility: feasibility,
    falsifiable_evaluation: falsifiable,
    problem_clarity: clarity,
    novelty_or_neglectedness: novelty,
    impact,
    storyability,
    total: Math.round(total),
  };
}

function toGrade(total: number): "A" | "B" | "C" {
  if (total >= 80) {
    return "A";
  }
  if (total >= 65) {
    return "B";
  }
  return "C";
}

function evidencePrecisionForCandidate(candidate: RawCandidate, paperText: PaperText): number {
  const haystack = paperText.full_text.toLowerCase();
  const spans = candidate.evidence_spans.map((span) => normalizeWhitespace(span).toLowerCase()).filter(Boolean);
  if (spans.length === 0) {
    return 0;
  }
  let matched = 0;
  for (const span of spans) {
    if (haystack.includes(span) || haystack.includes(span.slice(0, Math.min(80, span.length)))) {
      matched += 1;
    }
  }
  return matched / spans.length;
}

function problemEvidencePrecisionForCandidate(candidate: RawCandidate, paperText: PaperText): number {
  const haystack = paperText.full_text.toLowerCase();
  const spans = candidate.problem_evidence_spans.map((span) => normalizeWhitespace(span).toLowerCase()).filter(Boolean);
  if (spans.length === 0) {
    return 0;
  }
  let matched = 0;
  for (const span of spans) {
    if (haystack.includes(span) || haystack.includes(span.slice(0, Math.min(80, span.length)))) {
      matched += 1;
    }
  }
  return matched / spans.length;
}

function feasibilityEvidencePrecisionForCandidate(candidate: RawCandidate, paperText: PaperText): number {
  const haystack = paperText.full_text.toLowerCase();
  const spans = candidate.feasibility_evidence_spans.map((span) => normalizeWhitespace(span).toLowerCase()).filter(Boolean);
  if (spans.length === 0) {
    return 0;
  }
  let matched = 0;
  for (const span of spans) {
    if (haystack.includes(span) || haystack.includes(span.slice(0, Math.min(80, span.length)))) {
      matched += 1;
    }
  }
  return matched / spans.length;
}

export function applyHardRejectionGates(candidate: RawCandidate, paperText: PaperText): string[] {
  const reasons: string[] = [];
  const fullText = [
    candidate.candidate_problem,
    candidate.auto_research_experiment,
    candidate.available_data_or_benchmark,
    candidate.expected_metric,
    candidate.code_or_data_evidence.join(" "),
    candidate.paper_status_evidence.join(" "),
    candidate.disqualifiers.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (candidate.problem_evidence_spans.length === 0) {
    reasons.push("No source-backed problem evidence span.");
  }

  if (candidate.evidence_role === "positive_result_only") {
    reasons.push("Evidence role is positive_result_only, not a stated problem, limitation, future work, or failure mode.");
  }

  if (candidate.problem_evidence_spans.some((span) => classifyEvidenceRole(span) === "positive_result_only")) {
    reasons.push("Problem evidence span does not state a problem role.");
  }

  if (candidate.problem_evidence_spans.some((span) => SOLVED_PRIOR_ART_PATTERN.test(span))) {
    reasons.push("Problem evidence appears to describe a limitation the paper claims to solve, not an open candidate.");
  }

  if (
    HUMAN_STUDY_INTERVENTION_PATTERN.test(
      `${candidate.candidate_problem} ${candidate.specific_intervention} ${candidate.problem_evidence_spans.join(" ")}`,
    )
  ) {
    reasons.push("Candidate requires new human participants, cohorts, surveys, or classroom deployment.");
  }

  if (candidate.feasibility_evidence_spans.length === 0) {
    reasons.push("No separate feasibility evidence span for public data, code, benchmark, or metric.");
  }

  if (candidate.paper_status === "withdrawn") {
    reasons.push("Paper is withdrawn according to arXiv or external venue metadata.");
  }

  if (candidate.code_or_data_status === "not_found" || candidate.code_or_data_status === "unknown") {
    reasons.push("No public code, data, benchmark, or metric evidence found.");
  }

  if (candidate.code_or_data_status !== "found" || candidate.code_or_data_urls.length === 0) {
    reasons.push("No verified concrete public code, data, or benchmark URL found.");
  }

  if (evidencePrecisionForCandidate(candidate, paperText) === 0) {
    reasons.push("Evidence spans do not match source text.");
  }

  if (problemEvidencePrecisionForCandidate(candidate, paperText) === 0) {
    reasons.push("Problem evidence spans do not match source text.");
  }

  if (WET_LAB_TERMS.some((term) => fullText.includes(term)) && !fullText.includes("in silico")) {
    reasons.push("Requires wet-lab or field-heavy validation not suitable for first compute-only loop.");
  }

  if (PRIVATE_DATA_TERMS.some((term) => fullText.includes(term))) {
    reasons.push("Depends on private or unavailable data/resources.");
  }

  if (candidate.expected_metric.length < 12) {
    reasons.push("No measurable success/failure criterion.");
  }

  if (candidate.auto_research_experiment.length < 40) {
    reasons.push("Experiment path is too vague to execute.");
  }

  if (GENERIC_EXPERIMENT_PATTERN.test(candidate.auto_research_experiment)) {
    reasons.push("Experiment path is generic rather than paper-specific.");
  }

  if (candidate.specific_intervention.length < 30) {
    reasons.push("No specific intervention named.");
  }

  if (GENERIC_INTERVENTION_PATTERN.test(candidate.specific_intervention)) {
    reasons.push("Specific intervention is generic rather than operational.");
  }

  if (candidate.baseline.length < 20) {
    reasons.push("No concrete baseline named.");
  }

  if (candidate.metric.length < 3) {
    reasons.push("No concrete metric named.");
  }

  if (/\b(survey|opinion|position)\b/.test(fullText) && !/\b(experiment|benchmark|evaluate|ablation|reproduce)\b/.test(fullText)) {
    reasons.push("Pure survey/opinion-style candidate without executable experiment path.");
  }

  if (
    UNSANDBOXED_RISK_PATTERNS.some((pattern) => pattern.test(fullText)) &&
    !/\b(sandbox|offline|simulated|ctf)\b/.test(fullText)
  ) {
    reasons.push("Safety/legal risk cannot be sandboxed in the described experiment.");
  }

  return reasons;
}

function mergeScoreBreakdown(preferred: Partial<ScoreBreakdown> | undefined, fallback: ScoreBreakdown): ScoreBreakdown {
  if (!preferred) {
    return fallback;
  }
  const merged: ScoreBreakdown = {
    auto_research_feasibility: clamp(Math.round(preferred.auto_research_feasibility ?? fallback.auto_research_feasibility), 0, 25),
    falsifiable_evaluation: clamp(Math.round(preferred.falsifiable_evaluation ?? fallback.falsifiable_evaluation), 0, 20),
    problem_clarity: clamp(Math.round(preferred.problem_clarity ?? fallback.problem_clarity), 0, 15),
    novelty_or_neglectedness: clamp(Math.round(preferred.novelty_or_neglectedness ?? fallback.novelty_or_neglectedness), 0, 15),
    impact: clamp(Math.round(preferred.impact ?? fallback.impact), 0, 15),
    storyability: clamp(Math.round(preferred.storyability ?? fallback.storyability), 0, 10),
    total: 0,
  };
  merged.total =
    merged.auto_research_feasibility +
    merged.falsifiable_evaluation +
    merged.problem_clarity +
    merged.novelty_or_neglectedness +
    merged.impact +
    merged.storyability;
  return merged;
}

async function fetchArxivCategory(category: string, maxResults: number): Promise<ArxivPaper[]> {
  const url = new URL("https://export.arxiv.org/api/query");
  url.searchParams.set("search_query", `cat:${category}`);
  url.searchParams.set("start", "0");
  url.searchParams.set("max_results", String(maxResults));
  url.searchParams.set("sortBy", "submittedDate");
  url.searchParams.set("sortOrder", "descending");
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        "User-Agent": "problem-scanner/0.1 (+https://arxiv.org)",
      },
    });

    if (response.ok) {
      const xml = await response.text();
      return parseArxivFeed(xml);
    }

    if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
      const waitMs = 1000 * attempt;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    throw new Error(`arXiv query failed for ${category}: ${response.status}`);
  }

  throw new Error(`arXiv query failed for ${category}: exhausted retries`);
}

async function fetchRecentPapers(config: ExperimentConfig): Promise<{ allFetched: number; filtered: ArxivPaper[] }> {
  const paperMap = new Map<string, ArxivPaper>();
  let allFetched = 0;

  for (const category of config.categories) {
    try {
      const papers = await fetchArxivCategory(category, config.per_category_fetch);
      allFetched += papers.length;

      for (const paper of papers) {
        const existing = paperMap.get(paper.canonical_id);
        if (!existing || new Date(paper.updated_at).getTime() > new Date(existing.updated_at).getTime()) {
          paperMap.set(paper.canonical_id, paper);
        }
      }
    } catch (error) {
      console.warn(
        JSON.stringify({
          stage: "fetch_category_error",
          category,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  }

  const cutoffMs = Date.now() - config.days * 24 * 60 * 60 * 1000;
  const filtered = Array.from(paperMap.values())
    .filter((paper) => new Date(paper.published_at).getTime() >= cutoffMs)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, config.target_max);

  return { allFetched, filtered };
}

async function fetchPaperText(paper: ArxivPaper): Promise<PaperText> {
  const htmlCandidates = [
    `https://arxiv.org/html/${paper.id}`,
    `https://arxiv.org/html/${paper.canonical_id}`,
  ];

  for (const url of htmlCandidates) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      if (!response.ok) {
        continue;
      }
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.toLowerCase().includes("text/html")) {
        continue;
      }
      const html = await response.text();
      const sections = extractSectionsFromHtml(html);
      const fullText = buildFullText(paper, sections);
      if (fullText.length > paper.abstract.length + 200) {
        return {
          paper_id: paper.id,
          source: "html",
          sections,
          full_text: fullText,
          external_urls: extractLinksFromHtml(html),
        };
      }
    } catch {
      continue;
    }
  }

  const fallbackSections = blankSections();
  fallbackSections.discussion = paper.abstract;
  fallbackSections.raw_text = paper.abstract;
  return {
    paper_id: paper.id,
    source: "abstract",
    sections: fallbackSections,
    full_text: buildFullText(paper, fallbackSections),
    external_urls: [],
  };
}

function titleTerms(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((term) => term.length >= 3 && !["the", "and", "for", "with", "from"].includes(term)),
  );
}

function titleSimilarity(a: string, b: string): number {
  const left = titleTerms(a);
  const right = titleTerms(b);
  if (left.size === 0 || right.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const term of left) {
    if (right.has(term)) {
      intersection += 1;
    }
  }
  return intersection / Math.max(left.size, right.size);
}

function contentValue(content: unknown, key: string): string {
  if (!content || typeof content !== "object") {
    return "";
  }
  const value = (content as Record<string, unknown>)[key];
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "value" in value) {
    return normalizeWhitespace(String((value as { value: unknown }).value ?? ""));
  }
  return "";
}

async function resolveOpenReviewStatus(paper: ArxivPaper): Promise<Pick<PaperVerification, "paper_status" | "paper_status_sources" | "paper_status_evidence">> {
  const searchUrl = `https://api2.openreview.net/notes/search?term=${encodeURIComponent(paper.title)}&limit=5`;
  try {
    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { "User-Agent": "problem-scanner/0.1 (+https://openreview.net)" },
    });
    if (!response.ok) {
      return { paper_status: "unknown", paper_status_sources: [], paper_status_evidence: [] };
    }

    const body = (await response.json()) as { notes?: unknown[] };
    let best:
      | {
          status: PaperStatus;
          source: string;
          evidence: string;
          score: number;
        }
      | null = null;

    for (const note of body.notes ?? []) {
      if (!note || typeof note !== "object") {
        continue;
      }
      const record = note as Record<string, unknown>;
      const content = record.content;
      const noteTitle = contentValue(content, "title");
      const score = titleSimilarity(paper.title, noteTitle);
      if (score < 0.82) {
        continue;
      }

      const venue = contentValue(content, "venue");
      const venueId = contentValue(content, "venueid");
      const evidence = normalizeWhitespace([noteTitle, venue, venueId].filter(Boolean).join(" | "));
      const status: PaperStatus = /\bwithdrawn\b/i.test(evidence) ? "withdrawn" : "active";
      const forum = String(record.forum ?? record.id ?? "");
      const source = forum ? `https://openreview.net/forum?id=${forum}` : searchUrl;

      if (!best || score > best.score || status === "withdrawn") {
        best = { status, source, evidence, score };
      }
    }

    if (!best) {
      return { paper_status: "unknown", paper_status_sources: [], paper_status_evidence: [] };
    }

    return {
      paper_status: best.status,
      paper_status_sources: [best.source],
      paper_status_evidence: [best.evidence],
    };
  } catch {
    return { paper_status: "unknown", paper_status_sources: [], paper_status_evidence: [] };
  }
}

async function verifyResourceUrl(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.toLowerCase() === "github.com") {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length >= 2) {
        const apiUrl = `https://api.github.com/repos/${segments[0]}/${segments[1]}`;
        const response = await fetch(apiUrl, {
          signal: AbortSignal.timeout(RESOURCE_VERIFY_TIMEOUT_MS),
          headers: {
            "User-Agent": "problem-scanner/0.1",
            Accept: "application/vnd.github+json",
          },
        });
        if (response.ok) {
          return true;
        }
      }
    }

    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(RESOURCE_VERIFY_TIMEOUT_MS),
      headers: { "User-Agent": "problem-scanner/0.1" },
    });
    if (response.ok || response.status === 405) {
      return true;
    }

    const getResponse = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(RESOURCE_VERIFY_TIMEOUT_MS),
      headers: {
        "User-Agent": "problem-scanner/0.1",
        Range: "bytes=0-1024",
      },
    });
    return getResponse.ok;
  } catch {
    return false;
  }
}

async function verifyPaperResources(paper: ArxivPaper, paperText: PaperText): Promise<Pick<PaperVerification, "code_or_data_status" | "code_or_data_urls" | "code_or_data_sources" | "code_or_data_evidence">> {
  const sourceText = [
    paper.comments,
    paper.abstract,
    paperText.full_text,
    ...(paperText.external_urls ?? []),
  ].join(" ");

  const candidateUrls = Array.from(
    new Set([...extractConcreteResourceUrls(sourceText), ...knownBenchmarkResourceUrls(sourceText)]),
  ).slice(0, 12);

  const verifiedUrls: string[] = [];
  for (const url of candidateUrls) {
    if (await verifyResourceUrl(url)) {
      verifiedUrls.push(url);
    }
  }

  if (verifiedUrls.length > 0) {
    return {
      code_or_data_status: "found",
      code_or_data_urls: verifiedUrls,
      code_or_data_sources: verifiedUrls,
      code_or_data_evidence: verifiedUrls.map((url) => `Verified reachable public code/data/benchmark URL: ${url}`),
    };
  }

  const inferred = inferCodeOrDataStatus(sourceText);
  return {
    code_or_data_status: inferred === "found" ? "claimed" : inferred,
    code_or_data_urls: candidateUrls,
    code_or_data_sources: candidateUrls,
    code_or_data_evidence:
      candidateUrls.length > 0
        ? candidateUrls.map((url) => `Concrete URL found but not verified reachable during smoke run: ${url}`)
        : [],
  };
}

async function verifyPaper(paper: ArxivPaper, paperText: PaperText): Promise<PaperVerification> {
  const localStatus = inferPaperStatus(paper, paperText);
  const openReviewStatus = await resolveOpenReviewStatus(paper);
  const resources = await verifyPaperResources(paper, paperText);

  const paperStatus: PaperStatus =
    localStatus === "withdrawn" || openReviewStatus.paper_status === "withdrawn"
      ? "withdrawn"
      : openReviewStatus.paper_status === "active"
        ? "active"
        : localStatus;

  const localStatusEvidence =
    localStatus === "withdrawn" ? ["arXiv text or metadata contains a withdrawal notice."] : [];

  return {
    paper_id: paper.id,
    paper_status: paperStatus,
    paper_status_sources: [
      ...(localStatusEvidence.length > 0 ? [paper.abs_url] : []),
      ...openReviewStatus.paper_status_sources,
    ],
    paper_status_evidence: [...localStatusEvidence, ...openReviewStatus.paper_status_evidence],
    ...resources,
  };
}

function enrichCandidateWithVerification(candidate: RawCandidate, verification: PaperVerification | undefined): RawCandidate {
  if (!verification) {
    return candidate;
  }

  return {
    ...candidate,
    paper_status: verification.paper_status,
    code_or_data_status: verification.code_or_data_status,
    paper_status_sources: Array.from(new Set([...candidate.paper_status_sources, ...verification.paper_status_sources])),
    paper_status_evidence: Array.from(new Set([...candidate.paper_status_evidence, ...verification.paper_status_evidence])),
    code_or_data_urls:
      verification.code_or_data_urls.length > 0
        ? verification.code_or_data_urls
        : Array.from(new Set([...candidate.code_or_data_urls, ...verification.code_or_data_urls])),
    code_or_data_sources: Array.from(new Set([...candidate.code_or_data_sources, ...verification.code_or_data_sources])),
    code_or_data_evidence:
      verification.code_or_data_evidence.length > 0
        ? verification.code_or_data_evidence
        : Array.from(new Set([...candidate.code_or_data_evidence, ...verification.code_or_data_evidence])),
  };
}

async function mapWithConcurrency<T, U>(
  values: T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<U>,
): Promise<U[]> {
  const results: U[] = new Array(values.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= values.length) {
        return;
      }
      results[index] = await mapper(values[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, values.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function initUsage(): TokenUsage {
  return { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
}

function addUsage(target: TokenUsage, delta: TokenUsage): void {
  target.prompt_tokens += delta.prompt_tokens;
  target.completion_tokens += delta.completion_tokens;
  target.total_tokens += delta.total_tokens;
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function publicConfig(config: ExperimentConfig): PublicExperimentConfig {
  const { gemini_api_key: geminiApiKey, ...rest } = config;
  return {
    ...rest,
    gemini_api_key_set: Boolean(geminiApiKey),
  };
}

function promptAuditMarkdown(config: ExperimentConfig, llmInvoked: boolean): string {
  const v1Template = [
    ...llmV1InstructionLines(config),
    "Paper metadata:",
    "ID: <paper.id>",
    "Title: <paper.title>",
    "Subjects: <paper.subjects>",
    "Paper text:",
    "<paperText.full_text truncated to 24000 characters>",
  ].join("\n\n");

  const v2Template = [
    ...llmV2InstructionLines(),
    "Paper metadata:",
    "ID: <paper.id>",
    "Title: <paper.title>",
    "Candidate:",
    "<candidate JSON after deterministic verification enrichment>",
    "Paper text:",
    "<paperText.full_text truncated to 18000 characters>",
  ].join("\n\n");

  return [
    "# Prompt And Model Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Model Configuration",
    "",
    `- Run mode: \`${config.mode}\``,
    `- LLM invoked: ${llmInvoked ? "yes" : "no"}`,
    "- Provider: Google Gemini API",
    `- Broad scan model: \`${config.broad_model}\``,
    `- Verifier model: \`${config.verifier_model}\``,
    "- Endpoint pattern: `https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent`",
    "- Generation config: `temperature=0.2`, `responseMimeType=application/json`",
    "",
    "If `LLM invoked` is `no`, these are the exact prompt templates the pipeline would use in LLM mode, but no prompt text was sent for this run.",
    "",
    "## Broad Scan Prompt Template",
    "",
    "```text",
    v1Template,
    "```",
    "",
    "## Verifier Prompt Template",
    "",
    "```text",
    v2Template,
    "```",
    "",
  ].join("\n");
}

function markdownList(items: string[]): string[] {
  if (items.length === 0) {
    return ["- None."];
  }
  return items.map((item) => `- ${item}`);
}

function markdownReport(
  candidates: CandidateProblem[],
  rejected: RejectionRecord[],
  summary: RunSummary,
): string {
  const lines: string[] = [];
  lines.push("# Experiment 1 Comprehensive Smoke Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Output directory: \`${summary.config.output_dir}\``);
  lines.push(`Mode: \`${summary.config.mode}\``);
  lines.push("");

  lines.push("## Run Summary");
  lines.push("");
  lines.push(`- Papers fetched from arXiv API: ${summary.papers_fetched}`);
  lines.push(`- Papers inside ${summary.config.days}-day window: ${summary.papers_in_window}`);
  lines.push(`- Abstract-pass shortlist size: ${summary.abstract_shortlist_size}`);
  lines.push(`- Raw candidates extracted: ${summary.raw_candidates}`);
  lines.push(`- Accepted candidates in report: ${summary.accepted_candidates}`);
  lines.push(`- Rejected candidates: ${summary.rejected_candidates}`);
  lines.push(`- Top-20 evidence precision: ${Math.round(summary.top_20_evidence_precision * 100)}%`);
  lines.push(`- Top-20 problem-evidence precision: ${Math.round(summary.top_20_problem_evidence_precision * 100)}%`);
  lines.push(`- Estimated cost: $${summary.estimated_cost_usd}`);
  lines.push(`- Estimated cost per scanned paper: $${summary.estimated_cost_per_paper_usd}`);
  lines.push("");

  lines.push("## LLM And Prompt Audit");
  lines.push("");
  lines.push(`- Run mode: \`${summary.llm.mode}\``);
  lines.push(`- LLM invoked: ${summary.llm.llm_invoked ? "yes" : "no"}`);
  lines.push(`- Provider: ${summary.llm.provider}`);
  lines.push(`- Broad scan model: \`${summary.llm.broad_model}\``);
  lines.push(`- Verifier model: \`${summary.llm.verifier_model}\``);
  lines.push(`- Prompt audit file: \`${summary.llm.prompt_audit_path}\``);
  if (!summary.llm.llm_invoked) {
    lines.push("- Note: no LLM prompts were sent in this run because mode was heuristic or no Gemini API key was configured.");
  }
  lines.push("");

  lines.push("## Acceptance Checks");
  lines.push("");
  for (const [check, passed] of Object.entries(summary.acceptance.checks)) {
    lines.push(`- ${passed ? "PASS" : "FAIL"}: ${check}`);
  }
  lines.push(`- Overall: ${summary.acceptance.pass ? "PASS" : "FAIL"}`);
  lines.push("");

  lines.push("## Grade Counts");
  lines.push("");
  lines.push(`- A: ${summary.grade_counts.A}`);
  lines.push(`- B: ${summary.grade_counts.B}`);
  lines.push(`- C: ${summary.grade_counts.C}`);
  lines.push("");

  if (candidates.length === 0) {
    lines.push("No accepted candidates.");
  } else {
    lines.push("## Candidate Index");
    lines.push("");
    lines.push("| Rank | Grade | Paper | Score | Impact | Time Budget | Candidate |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const candidate of candidates) {
      const shortProblem = safeSubstring(candidate.candidate_problem, 140).replace(/\|/g, "\\|");
      lines.push(
        `| ${candidate.rank} | ${candidate.grade} | [${candidate.paper_id}](https://arxiv.org/abs/${candidate.paper_id}) | ${candidate.score_breakdown.total} | ${candidate.impact_type} | ${candidate.time_budget_hours}h | ${shortProblem} |`,
      );
    }
    lines.push("");

    lines.push("## Detailed Candidates");
    lines.push("");
    for (const candidate of candidates) {
      lines.push(`### ${candidate.rank}. ${candidate.grade}-grade candidate: ${candidate.paper_id}`);
      lines.push("");
      lines.push(`ArXiv: https://arxiv.org/abs/${candidate.paper_id}`);
      lines.push(`Score: ${candidate.score_breakdown.total}/100`);
      lines.push(`Confidence: ${candidate.confidence}`);
      lines.push(`Impact type: ${candidate.impact_type}`);
      lines.push(`Time budget: ${candidate.time_budget_hours} hours`);
      lines.push(`Evidence precision: ${Math.round(candidate.evidence_precision * 100)}%`);
      lines.push(`Problem evidence precision: ${Math.round(candidate.problem_evidence_precision * 100)}%`);
      lines.push(`Feasibility evidence precision: ${Math.round(candidate.feasibility_evidence_precision * 100)}%`);
      lines.push(`Evidence role: ${candidate.evidence_role}`);
      lines.push(`Paper status: ${candidate.paper_status}`);
      lines.push(`Code/data status: ${candidate.code_or_data_status}`);
      lines.push(`Verified code/data URLs: ${candidate.code_or_data_urls.length}`);
      lines.push("");
      lines.push("Candidate problem:");
      lines.push("");
      lines.push(candidate.candidate_problem);
      lines.push("");
      lines.push("Problem evidence spans:");
      lines.push("");
      lines.push(...markdownList(candidate.problem_evidence_spans));
      lines.push("");
      lines.push("Feasibility evidence spans:");
      lines.push("");
      lines.push(...markdownList(candidate.feasibility_evidence_spans));
      lines.push("");
      lines.push("Paper status evidence:");
      lines.push("");
      lines.push(...markdownList(candidate.paper_status_evidence));
      lines.push("");
      lines.push("Paper status sources:");
      lines.push("");
      lines.push(...markdownList(candidate.paper_status_sources));
      lines.push("");
      lines.push("Verified code/data URLs:");
      lines.push("");
      lines.push(...markdownList(candidate.code_or_data_urls));
      lines.push("");
      lines.push("Code/data verification evidence:");
      lines.push("");
      lines.push(...markdownList(candidate.code_or_data_evidence));
      lines.push("");
      lines.push("Why hidden or underexploited:");
      lines.push("");
      lines.push(candidate.why_hidden_or_underexploited || "Not specified.");
      lines.push("");
      lines.push("Auto-research experiment:");
      lines.push("");
      lines.push(candidate.auto_research_experiment || "Not specified.");
      lines.push("");
      lines.push("Available data or benchmark:");
      lines.push("");
      lines.push(candidate.available_data_or_benchmark || "Not specified.");
      lines.push("");
      lines.push("Expected metric:");
      lines.push("");
      lines.push(candidate.expected_metric || "Not specified.");
      lines.push("");
      lines.push("Specific intervention:");
      lines.push("");
      lines.push(candidate.specific_intervention || "Not specified.");
      lines.push("");
      lines.push("Baseline:");
      lines.push("");
      lines.push(candidate.baseline || "Not specified.");
      lines.push("");
      lines.push("Metric:");
      lines.push("");
      lines.push(candidate.metric || "Not specified.");
      lines.push("");
      lines.push("Story angle:");
      lines.push("");
      lines.push(candidate.story_angle || "Not specified.");
      lines.push("");
      lines.push("Disqualifiers:");
      lines.push("");
      lines.push(...markdownList(candidate.disqualifiers));
      lines.push("");
      lines.push("Score breakdown:");
      lines.push("");
      lines.push(`- Auto-research feasibility: ${candidate.score_breakdown.auto_research_feasibility}/25`);
      lines.push(`- Falsifiable evaluation: ${candidate.score_breakdown.falsifiable_evaluation}/20`);
      lines.push(`- Problem clarity: ${candidate.score_breakdown.problem_clarity}/15`);
      lines.push(`- Novelty or neglectedness: ${candidate.score_breakdown.novelty_or_neglectedness}/15`);
      lines.push(`- Impact: ${candidate.score_breakdown.impact}/15`);
      lines.push(`- Storyability: ${candidate.score_breakdown.storyability}/10`);
      lines.push("");
    }
  }

  lines.push("## Rejection Audit");
  lines.push("");
  if (rejected.length === 0) {
    lines.push("No rejected candidates.");
  } else {
    for (const [index, item] of rejected.entries()) {
      lines.push(`### Rejected ${index + 1}: ${item.paper_id}`);
      lines.push("");
      lines.push(`Candidate: ${item.candidate_problem}`);
      lines.push("");
      lines.push("Reasons:");
      lines.push("");
      lines.push(...markdownList(item.reasons));
      lines.push("");
    }
  }

  return lines.join("\n");
}

function runMetadata(): Record<string, unknown> {
  let gitCommit = "unknown";
  let gitBranch = "unknown";
  try {
    gitCommit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    gitBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  } catch {
    // Ignore git metadata if unavailable.
  }

  return {
    generated_at: new Date().toISOString(),
    git_commit: gitCommit,
    git_branch: gitBranch,
    platform: process.platform,
    arch: process.arch,
    node_version: process.version,
    bun_version: (globalThis as { Bun?: { version: string } }).Bun?.version ?? "unknown",
    cpu_count: os.cpus().length,
    hostname: os.hostname(),
  };
}

function printHelp(): void {
  const lines = [
    "Experiment 1 arXiv latent problem recovery",
    "",
    "Usage:",
    "  bun run exp1 --days 3 --targetMin 80 --targetMax 120",
    "",
    "Options:",
    "  --days <n>                     Submission-day window (default: 3)",
    "  --categories <csv>             Categories (default: cs.AI,cs.LG,stat.ML,q-bio.QM,q-bio.GN,q-bio.PE,eess)",
    "  --perCategoryFetch <n>         Per-category fetch cap (default: 80)",
    "  --targetMin <n>                Target minimum papers (default: 80)",
    "  --targetMax <n>                Target maximum papers (default: 120)",
    "  --abstractTopK <n>             Abstract-pass shortlist size (default: 40)",
    "  --candidatePerPaper <n>        Max candidates per shortlisted paper (default: 2)",
    "  --verifierTopK <n>             LLM verifier budget over candidate pool (default: 30)",
    "  --mode heuristic|llm           Force mode (default: llm if GEMINI_API_KEY present, else heuristic)",
    "  --broadModel <name>            Broad extraction model (default: gemini-3-flash-preview)",
    "  --verifierModel <name>         Verifier model (default: gemini-3-flash-preview)",
    "  --outputDir <path>             Output directory (default: runs/exp1-<timestamp>)",
    "  --inputPricePerMTokenUSD <n>   Input price for cost estimate",
    "  --outputPricePerMTokenUSD <n>  Output price for cost estimate",
    "  --help                         Show this help",
  ];
  console.log(lines.join("\n"));
}

export function parseCliArgs(argv: string[]): ExperimentConfig {
  const parsed = parseArgs({
    args: argv,
    strict: false,
    allowPositionals: true,
    options: {
      days: { type: "string" },
      categories: { type: "string" },
      perCategoryFetch: { type: "string" },
      targetMin: { type: "string" },
      targetMax: { type: "string" },
      abstractTopK: { type: "string" },
      candidatePerPaper: { type: "string" },
      verifierTopK: { type: "string" },
      maxEvidenceSpans: { type: "string" },
      maxCandidatesOutput: { type: "string" },
      outputDir: { type: "string" },
      mode: { type: "string" },
      broadModel: { type: "string" },
      verifierModel: { type: "string" },
      inputPricePerMTokenUSD: { type: "string" },
      outputPricePerMTokenUSD: { type: "string" },
      help: { type: "boolean" },
    },
  });

  if (parsed.values.help) {
    printHelp();
    process.exit(0);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const inferredMode: RunMode = geminiApiKey ? "llm" : "heuristic";
  const requestedMode = parsed.values.mode ? String(parsed.values.mode) : inferredMode;
  const modeMap: Record<string, RunMode> = { llm: "llm", heuristic: "heuristic" };
  const mode = modeMap[requestedMode.trim().toLowerCase()] ?? "heuristic";

  const categories = String(parsed.values.categories ?? DEFAULT_CATEGORIES.join(","))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const outputDir = String(parsed.values.outputDir ?? join("runs", `exp1-${nowTag()}`));

  const config: ExperimentConfig = {
    days: toPositiveInt(parsed.values.days as string | undefined, 3, "days"),
    categories,
    per_category_fetch: toPositiveInt(parsed.values.perCategoryFetch as string | undefined, 80, "perCategoryFetch"),
    target_min: toPositiveInt(parsed.values.targetMin as string | undefined, 80, "targetMin"),
    target_max: toPositiveInt(parsed.values.targetMax as string | undefined, 120, "targetMax"),
    abstract_top_k: toPositiveInt(parsed.values.abstractTopK as string | undefined, 40, "abstractTopK"),
    candidate_per_paper: toPositiveInt(parsed.values.candidatePerPaper as string | undefined, 2, "candidatePerPaper"),
    verifier_top_k: toPositiveInt(parsed.values.verifierTopK as string | undefined, 30, "verifierTopK"),
    max_evidence_spans: toPositiveInt(parsed.values.maxEvidenceSpans as string | undefined, 4, "maxEvidenceSpans"),
    max_candidates_output: toPositiveInt(parsed.values.maxCandidatesOutput as string | undefined, 20, "maxCandidatesOutput"),
    output_dir: outputDir,
    mode,
    broad_model: String(parsed.values.broadModel ?? "gemini-3-flash-preview"),
    verifier_model: String(parsed.values.verifierModel ?? "gemini-3-flash-preview"),
    gemini_api_key: geminiApiKey,
    input_price_per_mtoken_usd: toNonNegativeFloat(
      parsed.values.inputPricePerMTokenUSD as string | undefined,
      0,
      "inputPricePerMTokenUSD",
    ),
    output_price_per_mtoken_usd: toNonNegativeFloat(
      parsed.values.outputPricePerMTokenUSD as string | undefined,
      0,
      "outputPricePerMTokenUSD",
    ),
  };

  if (isLlmMode(config) && !config.gemini_api_key) {
    throw new Error("--mode llm requested but GEMINI_API_KEY is not set.");
  }

  if (config.target_min > config.target_max) {
    throw new Error("targetMin cannot exceed targetMax.");
  }

  return config;
}

function candidateWithPatch(base: RawCandidate, patch: Partial<RawCandidate> | undefined): RawCandidate {
  if (!patch) {
    return base;
  }
  return normalizeRawCandidate({ ...base, ...patch }, base.paper_id);
}

function estimateCost(usage: TokenUsage, config: ExperimentConfig): { total: number; perPaper: number } {
  const inputCost = (usage.prompt_tokens / 1_000_000) * config.input_price_per_mtoken_usd;
  const outputCost = (usage.completion_tokens / 1_000_000) * config.output_price_per_mtoken_usd;
  const total = inputCost + outputCost;
  return {
    total,
    perPaper: total,
  };
}

function isLlmMode(config: ExperimentConfig): boolean {
  return config.mode.startsWith("llm");
}

export async function runExperiment(config: ExperimentConfig): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  mkdirSync(config.output_dir, { recursive: true });
  const publicRunConfig = publicConfig(config);
  const llmInvoked = isLlmMode(config) && Boolean(config.gemini_api_key);
  const promptAuditPath = join(config.output_dir, "prompts.md");

  writeJson(join(config.output_dir, "config.json"), publicRunConfig);
  writeJson(join(config.output_dir, "reproducibility.json"), runMetadata());
  writeFileSync(promptAuditPath, promptAuditMarkdown(config, llmInvoked), "utf8");

  console.log(JSON.stringify({ stage: "fetch", categories: config.categories, days: config.days }));
  const fetched = await fetchRecentPapers(config);
  writeJson(join(config.output_dir, "papers.json"), fetched.filtered);

  const ranked = fetched.filtered
    .map((paper) => ({ paper, abstract_score: scoreAbstractSignal(paper) }))
    .sort((a, b) => b.abstract_score - a.abstract_score);

  const shortlist = ranked.slice(0, Math.min(config.abstract_top_k, ranked.length));
  writeJson(join(config.output_dir, "shortlist.json"), shortlist);

  console.log(
    JSON.stringify({
      stage: "shortlist",
      papers_fetched: fetched.allFetched,
      papers_in_window: fetched.filtered.length,
      shortlist_size: shortlist.length,
    }),
  );

  const paperTexts = await mapWithConcurrency(
    shortlist,
    6,
    async ({ paper }) => await fetchPaperText(paper),
  );

  writeJson(join(config.output_dir, "paper_texts.json"), paperTexts);

  const paperById = new Map(shortlist.map((entry) => [entry.paper.id, entry.paper]));
  const textByPaperId = new Map(paperTexts.map((text) => [text.paper_id, text]));
  const paperVerifications = await mapWithConcurrency(
    shortlist,
    4,
    async ({ paper }) => {
      const paperText = textByPaperId.get(paper.id);
      if (!paperText) {
        return {
          paper_id: paper.id,
          paper_status: "unknown",
          paper_status_sources: [],
          paper_status_evidence: [],
          code_or_data_status: "unknown",
          code_or_data_urls: [],
          code_or_data_sources: [],
          code_or_data_evidence: [],
        } satisfies PaperVerification;
      }
      return await verifyPaper(paper, paperText);
    },
  );
  writeJson(join(config.output_dir, "paper_verification.json"), paperVerifications);
  const verificationByPaperId = new Map(paperVerifications.map((verification) => [verification.paper_id, verification]));

  const usage = initUsage();
  const rawCandidates: RawCandidate[] = [];

  let extractor: GeminiJsonClient | null = null;
  let verifier: GeminiJsonClient | null = null;

  if (isLlmMode(config) && config.gemini_api_key) {
    extractor = new GeminiJsonClient(config.gemini_api_key, config.broad_model);
    verifier = new GeminiJsonClient(config.gemini_api_key, config.verifier_model);
  }

  for (const shortlistEntry of shortlist) {
    const paper = shortlistEntry.paper;
    const paperText = textByPaperId.get(paper.id);
    if (!paperText) {
      continue;
    }

    if (extractor) {
      try {
        const result = await extractor.generateJson<V1CandidateEnvelope>(llmV1Prompt(paper, paperText, config));
        addUsage(usage, result.usage);

        const candidates = Array.isArray(result.data.candidates) ? result.data.candidates : [];
        for (const candidate of candidates) {
          const normalized = normalizeRawCandidate(candidate, paper.id);
          rawCandidates.push(enrichCandidateWithVerification(normalized, verificationByPaperId.get(paper.id)));
        }
      } catch (error) {
        console.warn(
          JSON.stringify({
            stage: "extract_fallback",
            paper_id: paper.id,
            error: error instanceof Error ? error.message : String(error),
          }),
        );
        rawCandidates.push(
          ...heuristicCandidatesFromPaper(paper, paperText, config).map((candidate) =>
            enrichCandidateWithVerification(candidate, verificationByPaperId.get(paper.id)),
          ),
        );
      }
    } else {
      rawCandidates.push(
        ...heuristicCandidatesFromPaper(paper, paperText, config).map((candidate) =>
          enrichCandidateWithVerification(candidate, verificationByPaperId.get(paper.id)),
        ),
      );
    }
  }

  writeJson(join(config.output_dir, "candidates.raw.json"), rawCandidates);

  const preliminary = rawCandidates
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate).total,
    }))
    .sort((a, b) => b.score - a.score);

  const verifierBudgetIds = new Set(
    preliminary.slice(0, Math.min(config.verifier_top_k, preliminary.length)).map((item) => item.candidate),
  );

  const accepted: CandidateProblem[] = [];
  const rejected: RejectionRecord[] = [];

  for (const candidate of rawCandidates) {
    const paper = paperById.get(candidate.paper_id);
    const paperText = textByPaperId.get(candidate.paper_id);
    if (!paper || !paperText) {
      rejected.push({
        paper_id: candidate.paper_id,
        candidate_problem: candidate.candidate_problem,
        reasons: ["Missing paper context for candidate validation."],
      });
      continue;
    }

    let working = candidate;
    let score = scoreCandidate(working);
    const verifierReasons: string[] = [];

    if (verifier && verifierBudgetIds.has(candidate)) {
      try {
        const result = await verifier.generateJson<V2Verification>(llmV2Prompt(working, paper, paperText));
        addUsage(usage, result.usage);
        working = enrichCandidateWithVerification(
          candidateWithPatch(working, result.data.candidate_patch),
          verificationByPaperId.get(working.paper_id),
        );
        const mergedScore = mergeScoreBreakdown(result.data.score_breakdown, scoreCandidate(working));
        score = mergedScore;
        if (!result.data.accepted) {
          verifierReasons.push(...(result.data.rejection_reasons ?? []));
        }
      } catch (error) {
        console.warn(
          JSON.stringify({
            stage: "verify_fallback",
            paper_id: candidate.paper_id,
            error: error instanceof Error ? error.message : String(error),
          }),
        );
      }
    }

    const reasons = [...applyHardRejectionGates(working, paperText), ...verifierReasons];
    const evidencePrecision = evidencePrecisionForCandidate(working, paperText);
    const problemEvidencePrecision = problemEvidencePrecisionForCandidate(working, paperText);
    const feasibilityEvidencePrecision = feasibilityEvidencePrecisionForCandidate(working, paperText);

    if (reasons.length > 0) {
      rejected.push({
        paper_id: working.paper_id,
        candidate_problem: working.candidate_problem,
        reasons: Array.from(new Set(reasons)),
      });
      continue;
    }

    const grade = toGrade(score.total);
    accepted.push({
      ...working,
      score_breakdown: score,
      grade,
      rank: 0,
      evidence_precision: Math.min(evidencePrecision, problemEvidencePrecision),
      problem_evidence_precision: problemEvidencePrecision,
      feasibility_evidence_precision: feasibilityEvidencePrecision,
    });
  }

  accepted.sort((a, b) => b.score_breakdown.total - a.score_breakdown.total);

  const trimmedAccepted = accepted.slice(0, config.max_candidates_output).map((candidate, index) => ({
    ...candidate,
    rank: index + 1,
  }));

  const top20 = trimmedAccepted.slice(0, 20);
  const top20EvidencePrecision =
    top20.length > 0
      ? top20.reduce((sum, candidate) => sum + candidate.evidence_precision, 0) / top20.length
      : 0;
  const top20ProblemEvidencePrecision =
    top20.length > 0
      ? top20.reduce((sum, candidate) => sum + candidate.problem_evidence_precision, 0) / top20.length
      : 0;

  const gradeCounts = {
    A: trimmedAccepted.filter((candidate) => candidate.grade === "A").length,
    B: trimmedAccepted.filter((candidate) => candidate.grade === "B").length,
    C: trimmedAccepted.filter((candidate) => candidate.grade === "C").length,
  };

  const aOrBCount = gradeCounts.A + gradeCounts.B;
  const hasFastPublicCandidate = trimmedAccepted.some(
    (candidate) =>
      candidate.time_budget_hours <= 72 &&
      candidate.code_or_data_status === "found" &&
      candidate.code_or_data_urls.length > 0 &&
      candidate.feasibility_evidence_spans.length > 0,
  );

  const cost = estimateCost(usage, config);
  const estimatedCostPerPaper = fetched.filtered.length > 0 ? cost.total / fetched.filtered.length : 0;

  const acceptance = {
    at_least_3_a_grade: gradeCounts.A >= 3,
    at_least_8_a_or_b_grade: aOrBCount >= 8,
    top_20_evidence_precision_gt_80pct: top20EvidencePrecision > 0.8,
    top_20_problem_evidence_precision_gt_80pct: top20ProblemEvidencePrecision > 0.8,
    at_least_1_under_72h_public_benchmark: hasFastPublicCandidate,
    low_cost_per_paper: config.input_price_per_mtoken_usd === 0 && config.output_price_per_mtoken_usd === 0
      ? true
      : estimatedCostPerPaper <= 0.05,
  };

  const summary: RunSummary = {
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    config: publicRunConfig,
    llm: {
      provider: "google-gemini",
      mode: config.mode,
      llm_invoked: llmInvoked,
      broad_model: config.broad_model,
      verifier_model: config.verifier_model,
      prompt_audit_path: "prompts.md",
    },
    papers_fetched: fetched.allFetched,
    papers_in_window: fetched.filtered.length,
    abstract_shortlist_size: shortlist.length,
    raw_candidates: rawCandidates.length,
    accepted_candidates: trimmedAccepted.length,
    rejected_candidates: rejected.length,
    top_20_evidence_precision: Number(top20EvidencePrecision.toFixed(4)),
    top_20_problem_evidence_precision: Number(top20ProblemEvidencePrecision.toFixed(4)),
    grade_counts: gradeCounts,
    acceptance: {
      pass: Object.values(acceptance).every(Boolean),
      checks: acceptance,
    },
    usage,
    estimated_cost_usd: Number(cost.total.toFixed(6)),
    estimated_cost_per_paper_usd: Number(estimatedCostPerPaper.toFixed(6)),
  };

  writeJson(join(config.output_dir, "candidates.final.json"), trimmedAccepted);
  writeJson(join(config.output_dir, "candidates.rejected.json"), rejected);
  writeJson(join(config.output_dir, "summary.json"), summary);
  writeFileSync(join(config.output_dir, "report.md"), `${markdownReport(trimmedAccepted, rejected, summary)}\n`, "utf8");

  console.log(
    JSON.stringify({
      stage: "done",
      output_dir: config.output_dir,
      accepted_candidates: trimmedAccepted.length,
      rejected_candidates: rejected.length,
      acceptance: summary.acceptance,
    }),
  );

  return summary;
}

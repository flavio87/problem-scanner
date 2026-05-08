import { describe, expect, it } from "bun:test";
import { candidateId, scoreAgreement, type AgreementCandidate, type FrontierLabelRecord } from "../src/agreement.js";
import {
  applyHardRejectionGates,
  extractConcreteResourceUrls,
  extractEvidenceSentences,
  extractSectionsFromHtml,
  parseCliArgs,
  parseArxivFeed,
  parseArxivRecentHtml,
  parseJsonBlob,
  type PaperText,
  type RawCandidate,
} from "../src/experiment1.js";

const DATASET_GROUNDED_FIELDS = {
  public_training_or_eval_data: "The paper-linked public benchmark or repository artifact.",
  scientific_hypothesis: "The intervention should isolate a measurable mechanism behind the stated paper limitation.",
  success_threshold: "Success means a measurable improvement over the reported baseline on the named metric.",
  failure_condition: "Failure means no measurable improvement or no usable public artifact within 24 hours.",
  first_24h_experiment: "Set up the public artifact, reproduce the baseline, and run a small pilot intervention.",
};

describe("parseArxivFeed", () => {
  it("parses key fields from arXiv Atom XML", () => {
    const xml = `
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:arxiv="http://arxiv.org/schemas/atom">
        <entry>
          <id>http://arxiv.org/abs/2605.12345v1</id>
          <updated>2026-05-06T10:00:00Z</updated>
          <published>2026-05-05T09:00:00Z</published>
          <title>Test Paper</title>
          <summary>We report a limitation and future work.</summary>
          <author><name>Alice</name></author>
          <category term="cs.AI" scheme="http://arxiv.org/schemas/atom"/>
          <arxiv:primary_category term="cs.AI" scheme="http://arxiv.org/schemas/atom"/>
          <arxiv:comment>Code available on GitHub.</arxiv:comment>
          <link rel="alternate" type="text/html" href="https://arxiv.org/abs/2605.12345v1"/>
          <link rel="related" type="application/pdf" title="pdf" href="https://arxiv.org/pdf/2605.12345v1.pdf"/>
        </entry>
      </feed>
    `;

    const parsed = parseArxivFeed(xml);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("2605.12345v1");
    expect(parsed[0].canonical_id).toBe("2605.12345");
    expect(parsed[0].primary_subject).toBe("cs.AI");
    expect(parsed[0].authors).toEqual(["Alice"]);
    expect(parsed[0].pdf_url).toContain("2605.12345v1.pdf");
  });
});

describe("parseArxivRecentHtml", () => {
  it("parses arXiv recent-list fallback entries", () => {
    const html = `
      <dt>
        <a href="/abs/2605.06651" title="Abstract" id="2605.06651">arXiv:2605.06651</a>
        [<a href="/pdf/2605.06651" title="Download PDF">pdf</a>]
      </dt>
      <dd>
        <div class='meta'>
          <div class='list-title mathjax'><span class='descriptor'>Title:</span> AI Co-Mathematician </div>
          <div class='list-authors'><a>Daniel Zheng</a>, <a>Ingrid von Glehn</a></div>
          <div class='list-comments mathjax'><span class='descriptor'>Comments:</span> 22 pages</div>
          <div class='list-subjects'><span class='descriptor'>Subjects:</span>
            <span class="primary-subject">Artificial Intelligence (cs.AI)</span>; Machine Learning (cs.LG)
          </div>
        </div>
      </dd>
    `;

    const parsed = parseArxivRecentHtml(html, "cs.AI", "2026-05-08T00:00:00.000Z");

    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("2605.06651");
    expect(parsed[0].title).toBe("AI Co-Mathematician");
    expect(parsed[0].authors).toEqual(["Daniel Zheng", "Ingrid von Glehn"]);
    expect(parsed[0].subjects).toContain("cs.AI");
    expect(parsed[0].subjects).toContain("cs.LG");
  });
});

describe("extractSectionsFromHtml", () => {
  it("extracts key sections by heading", () => {
    const html = `
      <html><body><main>
        <h2>Introduction</h2><p>Intro details.</p>
        <h2>Limitations</h2><p>This fails under long context.</p>
        <h2>Future Work</h2><p>Test adaptive context gating.</p>
        <h2>Conclusion</h2><p>We conclude with caveats.</p>
      </main></body></html>
    `;

    const sections = extractSectionsFromHtml(html);
    expect(sections.introduction).toContain("Intro details");
    expect(sections.limitations).toContain("fails under long context");
    expect(sections.future_work).toContain("adaptive context gating");
    expect(sections.conclusion).toContain("conclude");
  });
});

describe("extractEvidenceSentences", () => {
  it("prioritizes signal-bearing sentences", () => {
    const text =
      "The benchmark is strong. A key limitation is failure under noisy prompts. Future work should evaluate adaptive retrieval.";
    const spans = extractEvidenceSentences(text, 2);
    expect(spans[0].toLowerCase()).toContain("limitation");
    expect(spans).toHaveLength(2);
  });

  it("does not split evidence spans at common scholarly abbreviations", () => {
    const text =
      "Future work could address this trade-off by adopting structured variational distributions (Mishkin et al. 2024) in a benchmark setting.";
    const spans = extractEvidenceSentences(text, 1);
    expect(spans[0]).toContain("Mishkin et al. 2024");
    expect(spans[0]).toContain("benchmark setting");
  });
});

describe("parseJsonBlob", () => {
  it("extracts fenced JSON", () => {
    expect(parseJsonBlob("```json\n{\"ok\":true}\n```")).toEqual({ ok: true });
  });

  it("repairs JSON truncated after a complete array item", () => {
    const parsed = parseJsonBlob("{\"candidates\":[{\"candidate_problem\":\"x\",\"evidence_spans\":[\"y\"]}");

    expect(parsed).toEqual({
      candidates: [{ candidate_problem: "x", evidence_spans: ["y"] }],
    });
  });

  it("repairs JSON truncated inside an incomplete string by dropping the partial item", () => {
    const parsed = parseJsonBlob("{\"candidates\":[{\"candidate_problem\":\"x\",\"evidence_spans\":[\"lim");

    expect(parsed).toEqual({
      candidates: [{ candidate_problem: "x", evidence_spans: [] }],
    });
  });
});

describe("applyHardRejectionGates", () => {
  it("rejects wet-lab and non-falsifiable candidates", () => {
    const paperText: PaperText = {
      paper_id: "2605.12345v1",
      source: "abstract",
      sections: {
        introduction: "",
        discussion: "",
        limitations: "",
        future_work: "",
        conclusion: "",
        appendix: "",
        raw_text: "This paper reports a limitation in safety benchmark coverage.",
      },
      full_text: "This paper reports a limitation in safety benchmark coverage.",
    };

    const candidate: RawCandidate = {
      paper_id: "2605.12345v1",
      candidate_problem: "Run a clinical trial for this model.",
      evidence_spans: ["unrelated quote not in paper"],
      problem_evidence_spans: ["unrelated quote not in paper"],
      feasibility_evidence_spans: [],
      evidence_role: "limitation",
      why_hidden_or_underexploited: "",
      auto_research_experiment: "Do a wet lab assay.",
      available_data_or_benchmark: "Private dataset",
      ...DATASET_GROUNDED_FIELDS,
      expected_metric: "",
      specific_intervention: "",
      baseline: "",
      metric: "",
      paper_status: "active",
      code_or_data_status: "not_found",
      paper_status_sources: [],
      paper_status_evidence: [],
      code_or_data_urls: [],
      code_or_data_sources: [],
      code_or_data_evidence: [],
      time_budget_hours: 96,
      impact_type: "health",
      story_angle: "",
      disqualifiers: [],
      confidence: 0.3,
    };

    const reasons = applyHardRejectionGates(candidate, paperText);
    expect(reasons.join(" ").toLowerCase()).toContain("wet-lab");
    expect(reasons.join(" ").toLowerCase()).toContain("measurable");
  });

  it("rejects positive-result-only evidence as a problem claim", () => {
    const paperText: PaperText = {
      paper_id: "2605.54321v1",
      source: "abstract",
      sections: {
        introduction: "",
        discussion: "",
        limitations: "",
        future_work: "",
        conclusion: "",
        appendix: "",
        raw_text: "Experiments on two public benchmarks show improved target domain accuracy over baselines.",
      },
      full_text: "Experiments on two public benchmarks show improved target domain accuracy over baselines.",
    };

    const candidate: RawCandidate = {
      paper_id: "2605.54321v1",
      candidate_problem: "Treat a positive benchmark result as a hidden problem.",
      evidence_spans: ["Experiments on two public benchmarks show improved target domain accuracy over baselines."],
      problem_evidence_spans: ["Experiments on two public benchmarks show improved target domain accuracy over baselines."],
      feasibility_evidence_spans: ["Experiments on two public benchmarks show improved target domain accuracy over baselines."],
      evidence_role: "positive_result_only",
      why_hidden_or_underexploited: "This is only a result.",
      auto_research_experiment: "Reproduce the result and compare against a baseline.",
      available_data_or_benchmark: "Public benchmarks are mentioned.",
      ...DATASET_GROUNDED_FIELDS,
      expected_metric: "Accuracy versus baseline.",
      specific_intervention: "Repeat the same positive-result experiment.",
      baseline: "The reported baseline.",
      metric: "accuracy",
      paper_status: "active",
      code_or_data_status: "claimed",
      paper_status_sources: [],
      paper_status_evidence: [],
      code_or_data_urls: [],
      code_or_data_sources: [],
      code_or_data_evidence: [],
      time_budget_hours: 48,
      impact_type: "science",
      story_angle: "This is not a real gap.",
      disqualifiers: [],
      confidence: 0.2,
    };

    const reasons = applyHardRejectionGates(candidate, paperText);
    expect(reasons.join(" ").toLowerCase()).toContain("positive_result_only");
  });

  it("rejects human-cohort expansion as non-compute-only validation", () => {
    const paperText: PaperText = {
      paper_id: "2605.67890v1",
      source: "abstract",
      sections: {
        introduction: "",
        discussion: "",
        limitations: "",
        future_work: "",
        conclusion: "",
        appendix: "",
        raw_text: "Future work should broaden the participant base to include more diverse cohorts. A public benchmark is used for analysis.",
      },
      full_text: "Future work should broaden the participant base to include more diverse cohorts. A public benchmark is used for analysis.",
    };

    const candidate: RawCandidate = {
      paper_id: "2605.67890v1",
      candidate_problem: "Evaluate more diverse cohorts in a classroom mentorship setting.",
      evidence_spans: [
        "Future work should broaden the participant base to include more diverse cohorts.",
        "A public benchmark is used for analysis.",
      ],
      problem_evidence_spans: ["Future work should broaden the participant base to include more diverse cohorts."],
      feasibility_evidence_spans: ["A public benchmark is used for analysis."],
      evidence_role: "future_work",
      why_hidden_or_underexploited: "The span is explicit future work.",
      auto_research_experiment: "Recruit additional participants and compare outcomes against the reported baseline.",
      available_data_or_benchmark: "Public benchmark mentioned.",
      ...DATASET_GROUNDED_FIELDS,
      expected_metric: "Accuracy versus baseline.",
      specific_intervention: "Evaluate more diverse cohorts in the reported classroom setting.",
      baseline: "The reported baseline.",
      metric: "accuracy",
      paper_status: "active",
      code_or_data_status: "claimed",
      paper_status_sources: [],
      paper_status_evidence: [],
      code_or_data_urls: [],
      code_or_data_sources: [],
      code_or_data_evidence: [],
      time_budget_hours: 48,
      impact_type: "science",
      story_angle: "This is a human-validation follow-up rather than a compute-only experiment.",
      disqualifiers: [],
      confidence: 0.4,
    };

    const reasons = applyHardRejectionGates(candidate, paperText);
    expect(reasons.join(" ").toLowerCase()).toContain("human participants");
  });

  it("rejects claimed code/data without a verified concrete URL", () => {
    const paperText: PaperText = {
      paper_id: "2605.11111v1",
      source: "abstract",
      sections: {
        introduction: "",
        discussion: "",
        limitations: "",
        future_work: "",
        conclusion: "",
        appendix: "",
        raw_text: "Future work should evaluate adaptive retrieval. A public benchmark is mentioned.",
      },
      full_text: "Future work should evaluate adaptive retrieval. A public benchmark is mentioned.",
    };

    const candidate: RawCandidate = {
      paper_id: "2605.11111v1",
      candidate_problem: "Evaluate adaptive retrieval against the reported baseline.",
      evidence_spans: ["Future work should evaluate adaptive retrieval.", "A public benchmark is mentioned."],
      problem_evidence_spans: ["Future work should evaluate adaptive retrieval."],
      feasibility_evidence_spans: ["A public benchmark is mentioned."],
      evidence_role: "future_work",
      why_hidden_or_underexploited: "The span is explicit future work.",
      auto_research_experiment: "Reproduce the reported baseline, add adaptive retrieval, and compare accuracy.",
      available_data_or_benchmark: "Public benchmark mentioned.",
      ...DATASET_GROUNDED_FIELDS,
      expected_metric: "Accuracy delta versus baseline.",
      specific_intervention: "Evaluate adaptive retrieval in the reported setup.",
      baseline: "The reported baseline.",
      metric: "accuracy",
      paper_status: "active",
      code_or_data_status: "claimed",
      paper_status_sources: [],
      paper_status_evidence: [],
      code_or_data_urls: [],
      code_or_data_sources: [],
      code_or_data_evidence: [],
      time_budget_hours: 48,
      impact_type: "science",
      story_angle: "A bounded public benchmark comparison.",
      disqualifiers: [],
      confidence: 0.7,
    };

    const reasons = applyHardRejectionGates(candidate, paperText);
    expect(reasons.join(" ").toLowerCase()).toContain("concrete public code");
  });

  it("rejects externally withdrawn papers", () => {
    const paperText: PaperText = {
      paper_id: "2605.22222v1",
      source: "abstract",
      sections: {
        introduction: "",
        discussion: "",
        limitations: "",
        future_work: "",
        conclusion: "",
        appendix: "",
        raw_text: "Future work should evaluate adaptive retrieval. GitHub repository: https://github.com/example/repo",
      },
      full_text: "Future work should evaluate adaptive retrieval. GitHub repository: https://github.com/example/repo",
    };

    const candidate: RawCandidate = {
      paper_id: "2605.22222v1",
      candidate_problem: "Evaluate adaptive retrieval against the reported baseline.",
      evidence_spans: [
        "Future work should evaluate adaptive retrieval.",
        "GitHub repository: https://github.com/example/repo",
      ],
      problem_evidence_spans: ["Future work should evaluate adaptive retrieval."],
      feasibility_evidence_spans: ["GitHub repository: https://github.com/example/repo"],
      evidence_role: "future_work",
      why_hidden_or_underexploited: "The span is explicit future work.",
      auto_research_experiment: "Reproduce the reported baseline, add adaptive retrieval, and compare accuracy.",
      available_data_or_benchmark: "Verified repository.",
      ...DATASET_GROUNDED_FIELDS,
      expected_metric: "Accuracy delta versus baseline.",
      specific_intervention: "Evaluate adaptive retrieval in the reported setup.",
      baseline: "The reported baseline.",
      metric: "accuracy",
      paper_status: "withdrawn",
      code_or_data_status: "found",
      paper_status_sources: ["https://openreview.net/forum?id=test"],
      paper_status_evidence: ["venue: withdrawn submission"],
      code_or_data_urls: ["https://github.com/example/repo"],
      code_or_data_sources: ["https://github.com/example/repo"],
      code_or_data_evidence: ["Verified reachable public code/data/benchmark URL: https://github.com/example/repo"],
      time_budget_hours: 48,
      impact_type: "science",
      story_angle: "A bounded public benchmark comparison.",
      disqualifiers: [],
      confidence: 0.7,
    };

    const reasons = applyHardRejectionGates(candidate, paperText);
    expect(reasons.join(" ").toLowerCase()).toContain("withdrawn");
  });
});

describe("extractConcreteResourceUrls", () => {
  it("extracts and canonicalizes public code/data URLs", () => {
    const urls = extractConcreteResourceUrls(
      "Code: https://github.com/example/repo/tree/main and data https://huggingface.co/datasets/org/data.",
    );
    expect(urls).toContain("https://github.com/example/repo");
    expect(urls).toContain("https://huggingface.co/datasets/org/data");
  });
});

describe("parseCliArgs", () => {
  it("uses OpenRouter defaults when OPENROUTER_API_KEY is set", () => {
    const previousOpenRouterKey = process.env.OPENROUTER_API_KEY;
    const previousGeminiKey = process.env.GEMINI_API_KEY;

    try {
      process.env.OPENROUTER_API_KEY = "test-openrouter-key";
      delete process.env.GEMINI_API_KEY;

      const config = parseCliArgs(["--targetMin", "1", "--targetMax", "1"]);

      expect(config.mode).toBe("llm");
      expect(config.llm_provider).toBe("openrouter");
      expect(config.arxiv_source).toBe("auto");
      expect(config.broad_model).toBe("google/gemini-3-flash-preview");
      expect(config.verifier_model).toBe("google/gemini-3-flash-preview");
      expect(config.openrouter_api_key).toBe("test-openrouter-key");
      expect(config.input_price_per_mtoken_usd).toBe(0.5);
      expect(config.output_price_per_mtoken_usd).toBe(3);
    } finally {
      if (previousOpenRouterKey === undefined) {
        delete process.env.OPENROUTER_API_KEY;
      } else {
        process.env.OPENROUTER_API_KEY = previousOpenRouterKey;
      }

      if (previousGeminiKey === undefined) {
        delete process.env.GEMINI_API_KEY;
      } else {
        process.env.GEMINI_API_KEY = previousGeminiKey;
      }
    }
  });

  it("requires the selected provider key in LLM mode", () => {
    const previousOpenRouterKey = process.env.OPENROUTER_API_KEY;
    const previousGeminiKey = process.env.GEMINI_API_KEY;

    try {
      delete process.env.OPENROUTER_API_KEY;
      delete process.env.GEMINI_API_KEY;

      expect(() => parseCliArgs(["--mode", "llm", "--provider", "openrouter"])).toThrow("OPENROUTER_API_KEY");
    } finally {
      if (previousOpenRouterKey === undefined) {
        delete process.env.OPENROUTER_API_KEY;
      } else {
        process.env.OPENROUTER_API_KEY = previousOpenRouterKey;
      }

      if (previousGeminiKey === undefined) {
        delete process.env.GEMINI_API_KEY;
      } else {
        process.env.GEMINI_API_KEY = previousGeminiKey;
      }
    }
  });

  it("parses recall extraction profile", () => {
    const previousOpenRouterKey = process.env.OPENROUTER_API_KEY;
    const previousGeminiKey = process.env.GEMINI_API_KEY;

    try {
      delete process.env.OPENROUTER_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const config = parseCliArgs(["--mode", "heuristic", "--extractionProfile", "recall"]);

      expect(config.mode).toBe("heuristic");
      expect(config.extraction_profile).toBe("recall");
    } finally {
      if (previousOpenRouterKey === undefined) {
        delete process.env.OPENROUTER_API_KEY;
      } else {
        process.env.OPENROUTER_API_KEY = previousOpenRouterKey;
      }

      if (previousGeminiKey === undefined) {
        delete process.env.GEMINI_API_KEY;
      } else {
        process.env.GEMINI_API_KEY = previousGeminiKey;
      }
    }
  });

  it("parses recent-html arXiv source", () => {
    const config = parseCliArgs(["--mode", "heuristic", "--arxivSource", "recent-html"]);

    expect(config.arxiv_source).toBe("recent-html");
  });

  it("allows verifierTopK zero to skip verifier calls", () => {
    const config = parseCliArgs(["--mode", "heuristic", "--verifierTopK", "0"]);

    expect(config.verifier_top_k).toBe(0);
  });

  it("parses LLM concurrency, output-token, and retry controls", () => {
    const config = parseCliArgs([
      "--mode",
      "heuristic",
      "--llmExtractConcurrency",
      "6",
      "--llmVerifyConcurrency",
      "3",
      "--llmMaxOutputTokens",
      "12000",
      "--llmMaxRetries",
      "1",
    ]);

    expect(config.llm_extract_concurrency).toBe(6);
    expect(config.llm_verify_concurrency).toBe(3);
    expect(config.llm_max_output_tokens).toBe(12000);
    expect(config.llm_max_retries).toBe(1);
  });
});

describe("agreement metrics", () => {
  it("computes cheap-vs-frontier recall and false negatives", () => {
    const acceptedCandidate: AgreementCandidate = {
      candidate_id: candidateId({ paper_id: "2605.1v1", candidate_problem: "Accepted candidate" }),
      paper_id: "2605.1v1",
      candidate_problem: "Accepted candidate",
      evidence_spans: [],
      problem_evidence_spans: [],
      feasibility_evidence_spans: [],
      auto_research_experiment: "",
      available_data_or_benchmark: "",
      ...DATASET_GROUNDED_FIELDS,
      expected_metric: "",
      specific_intervention: "",
      baseline: "",
      metric: "",
      code_or_data_urls: [],
      story_angle: "",
      sources: [{ arm: "strict", rank: 1, score: 90, grade: "A", source_path: "strict.json" }],
    };

    const missedCandidate: AgreementCandidate = {
      ...acceptedCandidate,
      candidate_id: candidateId({ paper_id: "2605.2v1", candidate_problem: "Missed candidate" }),
      paper_id: "2605.2v1",
      candidate_problem: "Missed candidate",
      sources: [{ arm: "recall", rank: 1, score: null, grade: null, source_path: "recall.json" }],
    };

    const labels: FrontierLabelRecord[] = [
      { candidate_id: acceptedCandidate.candidate_id, frontier_label: "A" },
      { candidate_id: missedCandidate.candidate_id, frontier_label: "B" },
    ];

    const metrics = scoreAgreement([acceptedCandidate, missedCandidate], labels, [1, 2]);
    const strict = metrics.arms.find((arm) => arm.arm === "strict");

    expect(metrics.frontier_ab).toBe(2);
    expect(strict?.precision_at_k["1"]).toBe(1);
    expect(strict?.recall_at_k["2"]).toBe(0.5);
    expect(strict?.missed_frontier_ab).toBe(1);
    expect(strict?.false_negative_ids).toContain(missedCandidate.candidate_id);
  });
});

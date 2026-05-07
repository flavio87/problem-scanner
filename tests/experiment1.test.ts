import { describe, expect, it } from "bun:test";
import {
  applyHardRejectionGates,
  extractEvidenceSentences,
  extractSectionsFromHtml,
  parseArxivFeed,
  type PaperText,
  type RawCandidate,
} from "../src/experiment1.js";

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
      expected_metric: "",
      specific_intervention: "",
      baseline: "",
      metric: "",
      paper_status: "active",
      code_or_data_status: "not_found",
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
      expected_metric: "Accuracy versus baseline.",
      specific_intervention: "Repeat the same positive-result experiment.",
      baseline: "The reported baseline.",
      metric: "accuracy",
      paper_status: "active",
      code_or_data_status: "claimed",
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
      expected_metric: "Accuracy versus baseline.",
      specific_intervention: "Evaluate more diverse cohorts in the reported classroom setting.",
      baseline: "The reported baseline.",
      metric: "accuracy",
      paper_status: "active",
      code_or_data_status: "claimed",
      time_budget_hours: 48,
      impact_type: "science",
      story_angle: "This is a human-validation follow-up rather than a compute-only experiment.",
      disqualifiers: [],
      confidence: 0.4,
    };

    const reasons = applyHardRejectionGates(candidate, paperText);
    expect(reasons.join(" ").toLowerCase()).toContain("human participants");
  });
});

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
      why_hidden_or_underexploited: "",
      auto_research_experiment: "Do a wet lab assay.",
      available_data_or_benchmark: "Private dataset",
      expected_metric: "",
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
});

export function buildPRDPrompt(productName, insights, uxExpertReview, opportunities, reasoning) {
  const reviewSection = uxExpertReview?.findings?.length
    ? `\n\nUX Expert Perspective findings:\n${JSON.stringify(uxExpertReview.findings, null, 2)}`
    : '';
  const opportunitiesSection = opportunities?.opportunities?.length
    ? `\n\nDesign Opportunities:\n${JSON.stringify(opportunities, null, 2)}`
    : '';
  const reasoningSection = reasoning?.threads?.length
    ? `\n\nReasoning threads (User Evidence + Behavior Patterns + UX Findings):\n${JSON.stringify(reasoning, null, 2)}`
    : '';

  return `You are a principal product strategist translating research into evidence-backed product decisions for ${productName}.

Generate the PRD / product decisions based on:
1. Insights
2. Reasoning (user evidence + behavior patterns + UX findings)
3. UX Expert Perspective findings

This is NOT a speculative feature brainstorm. Every requirement must trace back to evidence below.

Research insights:
${JSON.stringify(insights, null, 2)}${reasoningSection}${opportunitiesSection}${reviewSection}

Generate product decisions ONLY from the evidence above. Do NOT invent problems not supported by the research.

Every decision must trace this chain:
User Evidence → Behavioral Insight → UX Principle → Product Requirement

Return ONLY valid JSON:
{
  "title": "${productName} — Product Decision Framework",
  "sections": [
    {
      "id": 1,
      "name": "Short name for this decision (3-5 words max)",
      "priority": "Critical",
      "impact": "High",
      "confidence": 85,
      "effort": "Medium",
      "problem": "Specific behavioral problem statement derived from the insights",
      "userStory": "When a user is [behavioral state], they need [capability] so they can [outcome]",
      "requirement": "Clear, testable product requirement that addresses the behavioral problem",
      "successMetric": "Specific, measurable outcome that signals the behavior has changed",
      "userEvidence": "Direct quote or observable behavior from user perspectives that supports this decision",
      "behavioralInsight": "The exact insight title or finding this decision addresses",
      "relatedHeuristic": "UX principle name from UX Expert Perspective (e.g. Recognition Rather Than Recall) — no Nielsen numbers"
    }
  ]
}

Generate 5-6 sections. Rules:
- priority: "Critical" | "High" | "Medium" | "Low"
- impact: "High" | "Medium" | "Low"
- confidence: 0–100 integer
- effort: "High" | "Medium" | "Low"
- userEvidence MUST cite specific user behavior — never invent
- behavioralInsight MUST reference an actual insight title
- relatedHeuristic MUST reference a UX principle from the UX Expert findings when available
- Prefer decisions that are supported by Insights + Reasoning + UX Findings together
- Sort by priority descending (Critical first).`;
}

export function buildPRDPrompt(productName, insights, designReview, opportunities) {
  const reviewSection = designReview?.frameworks?.length
    ? `\n\nAI Design Review (multi-framework):\n${JSON.stringify(designReview, null, 2)}`
    : '';
  const opportunitiesSection = opportunities?.opportunities?.length
    ? `\n\nDesign Opportunities:\n${JSON.stringify(opportunities, null, 2)}`
    : '';

  return `You are a principal product strategist translating behavioral research into evidence-backed product decisions for ${productName}.

This is NOT a speculative feature brainstorm. Every requirement must trace back to real user evidence from the research below.

Research insights:
${JSON.stringify(insights, null, 2)}${opportunitiesSection}${reviewSection}

Generate product decisions ONLY from the evidence above. Do NOT invent problems not supported by the research.

Every decision must trace this chain:
User Evidence → Behavioral Insight → Design Framework Principle → Product Requirement

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
      "relatedHeuristic": "The design framework principle this decision addresses (Nielsen, WCAG, HIG, Material, Cognitive Load, or Trust pattern)"
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
- relatedHeuristic MUST reference an actual principle from the design review
- At least 3 decisions must connect to design opportunities
- Sort by priority descending (Critical first).`;
}

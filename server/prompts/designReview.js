function formatPerspectives(cards) {
  return cards.map(c => {
    const label = c.perspective || c.persona || 'User';
    const driver = c.driver || c.emotion || '';
    return `[${label}${driver ? ` — ${driver}` : ''}]\nThought: "${c.thought}"${c.worry ? `\nWorry: ${c.worry}` : ''}`;
  }).join('\n\n');
}

const FRAMEWORKS = `
1. Nielsen Heuristics (frameworkId: "nielsen")
   - Visibility of System Status, Match Between System and Real World, User Control and Freedom,
     Consistency and Standards, Error Prevention, Recognition Rather Than Recall,
     Flexibility and Efficiency, Aesthetic and Minimalist Design,
     Help Users Recognize/Diagnose/Recover from Errors, Help and Documentation

2. WCAG Accessibility (frameworkId: "wcag")
   - Perceivable, Operable, Understandable, Robust (cite specific success criteria when relevant)

3. Apple Human Interface Guidelines (frameworkId: "apple-hig")
   - Clarity, Deference, Depth, platform conventions, navigation patterns, feedback

4. Material Design (frameworkId: "material")
   - Material metaphor, motion, layout, typography, color system, component patterns

5. Cognitive Load (frameworkId: "cognitive-load")
   - Intrinsic, extraneous, germane load; working memory limits; decision fatigue; information scent

6. Trust & UX Patterns (frameworkId: "trust")
   - Transparency, predictability, social proof, error recovery, data handling signals, consent patterns
`;

export function buildDesignReviewPrompt(productName, insights, cards, opportunities) {
  const opportunitiesSection = opportunities
    ? `\n\nDesign opportunities (from prior reasoning step):\n${JSON.stringify(opportunities, null, 2)}`
    : '';

  return `You are a senior UX researcher performing a multi-framework AI design review for ${productName}.

This is NOT a generic audit. Evaluate the product ONLY through frameworks where the user evidence actually applies. Skip frameworks with no supporting evidence — do not force findings.

Review frameworks:
${FRAMEWORKS}

User perspectives:
${formatPerspectives(cards)}

Behavioral insights:
${JSON.stringify(insights, null, 2)}${opportunitiesSection}

For each finding, trace this chain:
User Perspective → Behavioral Insight → Design Framework Principle → Design Implication

Rules:
- Only include frameworks that have at least one evidence-backed finding.
- Each framework must have 1–3 findings (not more).
- "evidence" must cite observable user behavior from perspectives.
- "behavioralInsight" must reference an actual insight from the research.
- "principle" names the specific heuristic, WCAG criterion, HIG principle, Material pattern, cognitive load factor, or trust pattern.
- "relevance" explains why this principle applies to this specific evidence.
- "implication" is a concrete design direction — not vague advice.
- "sourcePerspective" must name the exact perspective label from user perspectives.
- "sourceInsightTitle" must name the exact insight title from behavioral insights.
- severity: "Low" | "Medium" | "High"
- confidence: integer 0–100
- synthesis: 1–2 short sentences, max 35 words total. Cross-framework takeaway only — no lists.

Return ONLY valid JSON:
{
  "title": "${productName} — AI Design Review",
  "synthesis": "One concise cross-framework takeaway.",
  "frameworks": [
    {
      "frameworkId": "nielsen",
      "framework": "Nielsen Heuristics",
      "findings": [
        {
          "id": 1,
          "principle": "Recognition Rather Than Recall",
          "relevance": "Why this heuristic applies",
          "evidence": "Observable user behavior",
          "behavioralInsight": "Supporting insight",
          "implication": "Concrete design direction",
          "severity": "High",
          "confidence": 90,
          "sourcePerspective": "Looking for Simplicity",
          "sourceInsightTitle": "Exact insight title"
        }
      ]
    }
  ]
}`;
}

function formatPerspectives(cards) {
  return cards.map(c => {
    const label = c.perspective || c.persona || 'User';
    return `[${label}]\nThought: "${c.thought}"`;
  }).join('\n\n');
}

export function buildOpportunitiesPrompt(productName, insights, cards) {
  return `You are a senior product designer identifying evidence-backed design opportunities for ${productName}.

This is NOT a feature brainstorm. Every opportunity must trace back to user evidence from the research below.

User perspectives:
${formatPerspectives(cards)}

Behavioral insights:
${JSON.stringify(insights, null, 2)}

Identify design opportunities — places where a specific design intervention could address observed user behavior. Each opportunity must trace:

User Perspective → Behavioral Insight → Design Opportunity → Design Direction

Rules:
- Do NOT invent opportunities without supporting evidence.
- "observation" must cite observable user behavior from perspectives.
- "behavioralInsight" must reference an actual insight from the research data.
- "opportunity" describes what the product could do differently (not a feature list).
- "designDirection" is a concrete design approach, not vague advice.
- "sourcePerspective" must name the exact perspective label from user perspectives.
- impact: "Critical" | "High" | "Medium" | "Low"
- confidence: integer 0–100
- Generate 4–6 opportunities, sorted by impact (Critical first).
- synthesis: 1–2 short sentences, max 35 words total. Highest-leverage takeaway only — no lists.

Return ONLY valid JSON:
{
  "title": "${productName} — Design Opportunities",
  "synthesis": "Where the evidence points to the highest-leverage design interventions.",
  "opportunities": [
    {
      "id": 1,
      "title": "Short opportunity title (5 words max)",
      "observation": "What users do or experience",
      "behavioralInsight": "The underlying pattern from insights",
      "opportunity": "What design could change",
      "designDirection": "Concrete design approach",
      "impact": "High",
      "confidence": 88,
      "sourcePerspective": "Looking for Simplicity"
    }
  ]
}`;
}
